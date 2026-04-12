// Supabase Edge Function — fetch-inbox
// Pulls emails via POP3/SMTP and stores in crm_inbox_messages
// Deploy: supabase functions deploy fetch-inbox --no-verify-jwt
// Trigger: cron every 5 minutes, or manual invoke

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailAccount {
  email: string
  name: string
  is_default: boolean
}

interface SmtpConfig {
  host: string
  port: string
  secure: boolean
  username: string
  password: string
  from_name: string
  from_email: string
}

// POP3 client — minimal implementation for Deno
async function fetchPop3Emails(config: {
  host: string
  port: number
  username: string
  password: string
  secure: boolean
  maxEmails?: number
}): Promise<Array<{
  from: string
  to: string
  subject: string
  body: string
  date: string
  messageId: string
}>> {
  const { host, port, username, password, secure, maxEmails = 20 } = config
  const emails: Array<{
    from: string; to: string; subject: string
    body: string; date: string; messageId: string
  }> = []

  try {
    const conn = secure
      ? await Deno.connectTls({ hostname: host, port })
      : await Deno.connect({ hostname: host, port })

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    async function readLine(): Promise<string> {
      const buf = new Uint8Array(4096)
      let result = ''
      while (true) {
        const n = await conn.read(buf)
        if (n === null) break
        result += decoder.decode(buf.subarray(0, n))
        if (result.includes('\r\n')) break
      }
      return result.trim()
    }

    async function send(cmd: string): Promise<string> {
      await conn.write(encoder.encode(cmd + '\r\n'))
      return await readLine()
    }

    // Connect
    await readLine() // Welcome banner

    // Auth
    const userResp = await send(`USER ${username}`)
    if (!userResp.startsWith('+OK')) throw new Error(`POP3 USER failed: ${userResp}`)

    const passResp = await send(`PASS ${password}`)
    if (!passResp.startsWith('+OK')) throw new Error(`POP3 PASS failed: ${passResp}`)

    // Get message count
    const statResp = await send('STAT')
    const count = parseInt(statResp.split(' ')[1] || '0')

    // Fetch latest N emails
    const start = Math.max(1, count - maxEmails + 1)
    for (let i = count; i >= start; i--) {
      try {
        await conn.write(encoder.encode(`RETR ${i}\r\n`))

        // Read multi-line response
        let raw = ''
        const buf = new Uint8Array(8192)
        while (true) {
          const n = await conn.read(buf)
          if (n === null) break
          raw += decoder.decode(buf.subarray(0, n))
          if (raw.includes('\r\n.\r\n')) break
        }

        // Parse basic email headers
        const fromMatch = raw.match(/^From:\s*(.+)$/mi)
        const toMatch = raw.match(/^To:\s*(.+)$/mi)
        const subjectMatch = raw.match(/^Subject:\s*(.+)$/mi)
        const dateMatch = raw.match(/^Date:\s*(.+)$/mi)
        const msgIdMatch = raw.match(/^Message-ID?:\s*(.+)$/mi)

        // Extract body (after blank line)
        const bodyStart = raw.indexOf('\r\n\r\n')
        let body = bodyStart > -1 ? raw.substring(bodyStart + 4) : ''
        body = body.replace(/\r\n\.\r\n$/, '').trim()
        // Strip MIME boundaries for plain text
        if (body.includes('Content-Type: text/plain')) {
          const textStart = body.indexOf('\r\n\r\n', body.indexOf('text/plain'))
          if (textStart > -1) body = body.substring(textStart + 4)
          const boundaryEnd = body.indexOf('\r\n--')
          if (boundaryEnd > -1) body = body.substring(0, boundaryEnd)
        }

        emails.push({
          from: fromMatch?.[1]?.trim() || 'unknown',
          to: toMatch?.[1]?.trim() || '',
          subject: subjectMatch?.[1]?.trim() || '(no subject)',
          body: body.substring(0, 5000), // Cap at 5KB
          date: dateMatch?.[1]?.trim() || new Date().toISOString(),
          messageId: msgIdMatch?.[1]?.trim() || `pop3-${i}-${Date.now()}`,
        })
      } catch { /* skip malformed email */ }
    }

    await send('QUIT')
    conn.close()
  } catch (err) {
    console.error('POP3 fetch error:', err)
  }

  return emails
}

// Extract email address from "Name <email>" format
function extractEmail(raw: string): string {
  const match = raw.match(/<([^>]+)>/)
  return match ? match[1] : raw.trim()
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, serviceKey)

    // Load SMTP config (used for POP3 — same server usually)
    const { data: smtpRow } = await supabase
      .from('crm_ai_settings')
      .select('value')
      .eq('key', 'smtp_config')
      .single()

    if (!smtpRow?.value) {
      return new Response(JSON.stringify({ error: 'SMTP not configured' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const smtp = smtpRow.value as SmtpConfig

    // Load sender accounts to know which inboxes to check
    const { data: sendersRow } = await supabase
      .from('crm_ai_settings')
      .select('value')
      .eq('key', 'sender_accounts')
      .single()

    const accounts: EmailAccount[] = sendersRow?.value as EmailAccount[] || [
      { email: smtp.from_email, name: smtp.from_name, is_default: true },
    ]

    // POP3 port: usually 995 (SSL) or 110 (plain)
    // Many mail servers use same host for SMTP and POP3
    const pop3Host = smtp.host.replace(/^smtp\./, 'pop.')
    const pop3Port = smtp.secure ? 995 : 110

    let totalNew = 0

    for (const account of accounts) {
      // Fetch emails via POP3
      const emails = await fetchPop3Emails({
        host: pop3Host,
        port: pop3Port,
        username: account.email || smtp.username,
        password: smtp.password,
        secure: smtp.secure,
        maxEmails: 30,
      })

      for (const email of emails) {
        // Check if we already have this message (by subject + from + approximate time)
        const fromEmail = extractEmail(email.from)
        const { data: existing } = await supabase
          .from('crm_inbox_messages')
          .select('id')
          .eq('from_email', fromEmail)
          .eq('subject', email.subject)
          .limit(1)

        if (existing?.length) continue // Already imported

        // Try to match to a CRM lead
        const { data: lead } = await supabase
          .from('crm_leads')
          .select('id')
          .eq('email', fromEmail)
          .limit(1)
          .maybeSingle()

        // Determine direction
        const isInbound = !accounts.some(a => a.email === fromEmail)

        // Insert message
        await supabase.from('crm_inbox_messages').insert({
          lead_id: lead?.id || null,
          direction: isInbound ? 'inbound' : 'outbound',
          subject: email.subject,
          body: email.body,
          from_email: fromEmail,
          to_email: extractEmail(email.to) || account.email,
          status: isInbound ? 'unread' : 'read',
          received_at: email.date ? new Date(email.date).toISOString() : new Date().toISOString(),
        })

        totalNew++
      }
    }

    return new Response(JSON.stringify({
      success: true,
      new_messages: totalNew,
      accounts_checked: accounts.length,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('fetch-inbox error:', message)
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
