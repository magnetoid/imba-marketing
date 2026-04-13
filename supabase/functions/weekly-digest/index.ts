// Supabase Edge Function — weekly-digest
// Sends a Monday morning pipeline summary to admin/agent emails.
// Deploy: supabase functions deploy weekly-digest --no-verify-jwt
// Schedule: pg_cron or external cron: 0 8 * * 1 (8am every Monday)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface SmtpConfig {
  host: string
  port: string
  secure: boolean
  username: string
  password: string
  from_name: string
  from_email: string
}

interface SenderAccount {
  email: string
  name: string
  is_default: boolean
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function fmtNum(n: number): string {
  return new Intl.NumberFormat('en-US').format(n)
}

async function sendViaSmtp(smtp: SmtpConfig, to: string, subject: string, html: string) {
  if (smtp.host.includes('smtp2go')) {
    const res = await fetch('https://api.smtp2go.com/v3/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: smtp.password,
        to: [to],
        sender: `${smtp.from_name} <${smtp.from_email}>`,
        subject,
        html_body: html,
      }),
    })
    const data = await res.json()
    if (!res.ok || data.data?.error) throw new Error(data.data?.error || 'smtp2go send failed')
    return
  }

  const SmtpClient = (await import('https://deno.land/x/smtp@v0.7.0/mod.ts')).SmtpClient
  const client = new SmtpClient()
  await client.connectTLS({
    hostname: smtp.host,
    port: parseInt(smtp.port) || (smtp.secure ? 465 : 587),
    username: smtp.username,
    password: smtp.password,
  })
  await client.send({
    from: `${smtp.from_name} <${smtp.from_email}>`,
    to,
    subject,
    content: html.replace(/<[^>]+>/g, ''), // plain text fallback
    html,
  })
  await client.close()
}

function buildDigestHtml(stats: {
  newLeads: number
  leadsLastWeek: number
  qualifiedLeads: number
  convertedLeads: number
  topProspects: Array<{ name: string; company: string; score: number }>
  draftEmails: number
  approvedEmails: number
  emailsSentThisWeek: number
  emailsOpenedThisWeek: number
  emailsRepliedThisWeek: number
  chatUnread: number
  inboxUnread: number
  recentQuotes: Array<{ name: string; company: string; service: string; date: string }>
  generatedAt: string
}): string {
  const trend = stats.leadsLastWeek > 0
    ? Math.round(((stats.newLeads - stats.leadsLastWeek) / stats.leadsLastWeek) * 100)
    : 0
  const trendLabel = trend > 0 ? `+${trend}%` : `${trend}%`
  const trendColor = trend >= 0 ? '#22C55E' : '#EF4444'

  const openRate = stats.emailsSentThisWeek > 0
    ? Math.round((stats.emailsOpenedThisWeek / stats.emailsSentThisWeek) * 100) : 0
  const replyRate = stats.emailsSentThisWeek > 0
    ? Math.round((stats.emailsRepliedThisWeek / stats.emailsSentThisWeek) * 100) : 0

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Weekly Pipeline Digest</title>
</head>
<body style="margin:0;padding:0;background:#F5F5F4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;background:#FFFFFF">

<!-- Header -->
<div style="padding-bottom:24px;border-bottom:2px solid #EF4444">
  <h1 style="margin:0;font-size:28px;font-weight:700;color:#18181B;letter-spacing:-0.02em">Weekly Pipeline Digest</h1>
  <p style="margin:4px 0 0;font-size:14px;color:#71717A">Imba Marketing CRM — ${stats.generatedAt}</p>
</div>

<!-- Key Numbers -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0">
  <tr>
    <td width="50%" style="padding:16px;background:#FAFAF9;border-radius:8px">
      <p style="margin:0;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#71717A">New Leads</p>
      <p style="margin:6px 0 0;font-size:32px;font-weight:800;color:#18181B">${stats.newLeads}</p>
      <p style="margin:4px 0 0;font-size:12px;color:${trendColor};font-weight:600">${trendLabel} vs last week</p>
    </td>
    <td width="12"></td>
    <td width="50%" style="padding:16px;background:#FAFAF9;border-radius:8px">
      <p style="margin:0;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#71717A">Qualified</p>
      <p style="margin:6px 0 0;font-size:32px;font-weight:800;color:#18181B">${stats.qualifiedLeads}</p>
      <p style="margin:4px 0 0;font-size:12px;color:#71717A">${stats.convertedLeads} converted</p>
    </td>
  </tr>
</table>

<!-- Outreach Summary -->
<h2 style="margin:32px 0 12px;font-size:18px;font-weight:700;color:#18181B">Outreach This Week</h2>
<table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#3F3F46">
  <tr><td style="padding:8px 0;border-bottom:1px solid #E7E5E4">Emails sent</td><td align="right" style="padding:8px 0;border-bottom:1px solid #E7E5E4;font-weight:600">${stats.emailsSentThisWeek}</td></tr>
  <tr><td style="padding:8px 0;border-bottom:1px solid #E7E5E4">Opened</td><td align="right" style="padding:8px 0;border-bottom:1px solid #E7E5E4;font-weight:600">${stats.emailsOpenedThisWeek} <span style="color:#71717A;font-size:12px">(${openRate}%)</span></td></tr>
  <tr><td style="padding:8px 0;border-bottom:1px solid #E7E5E4">Replied</td><td align="right" style="padding:8px 0;border-bottom:1px solid #E7E5E4;font-weight:600">${stats.emailsRepliedThisWeek} <span style="color:#71717A;font-size:12px">(${replyRate}%)</span></td></tr>
  <tr><td style="padding:8px 0">Awaiting your review</td><td align="right" style="padding:8px 0;font-weight:600;color:#EF4444">${stats.draftEmails} drafts</td></tr>
</table>

${stats.topProspects.length > 0 ? `
<!-- Top Prospects -->
<h2 style="margin:32px 0 12px;font-size:18px;font-weight:700;color:#18181B">Top Prospects to Contact</h2>
<table width="100%" cellpadding="0" cellspacing="0">
${stats.topProspects.map(p => `
  <tr>
    <td style="padding:12px 0;border-bottom:1px solid #E7E5E4">
      <p style="margin:0;font-size:14px;font-weight:600;color:#18181B">${p.name}</p>
      <p style="margin:2px 0 0;font-size:12px;color:#71717A">${p.company}</p>
    </td>
    <td align="right" style="padding:12px 0;border-bottom:1px solid #E7E5E4">
      <span style="display:inline-block;padding:4px 10px;background:#FEF3C7;color:#92400E;font-size:12px;font-weight:700;border-radius:999px">Score: ${p.score}</span>
    </td>
  </tr>`).join('')}
</table>
` : ''}

${stats.recentQuotes.length > 0 ? `
<!-- Recent Quote Requests -->
<h2 style="margin:32px 0 12px;font-size:18px;font-weight:700;color:#18181B">Recent Quote Requests</h2>
${stats.recentQuotes.map(q => `
<div style="padding:12px 16px;background:#FEF2F2;border-left:3px solid #EF4444;margin-bottom:8px;border-radius:4px">
  <p style="margin:0;font-size:14px;font-weight:600;color:#18181B">${q.name} ${q.company ? `· ${q.company}` : ''}</p>
  <p style="margin:4px 0 0;font-size:12px;color:#71717A">${q.service || 'General inquiry'} — ${q.date}</p>
</div>`).join('')}
` : ''}

<!-- Action Required -->
${(stats.draftEmails + stats.chatUnread + stats.inboxUnread) > 0 ? `
<div style="margin:32px 0;padding:20px;background:#FEF3C7;border-radius:8px;border:1px solid #FCD34D">
  <p style="margin:0;font-size:14px;font-weight:700;color:#92400E">⚠ Your attention needed</p>
  <ul style="margin:8px 0 0;padding-left:20px;font-size:13px;color:#78350F;line-height:1.8">
    ${stats.draftEmails > 0 ? `<li><strong>${stats.draftEmails}</strong> email drafts awaiting approval</li>` : ''}
    ${stats.chatUnread > 0 ? `<li><strong>${stats.chatUnread}</strong> unread chat messages from visitors</li>` : ''}
    ${stats.inboxUnread > 0 ? `<li><strong>${stats.inboxUnread}</strong> unread messages in inbox</li>` : ''}
  </ul>
</div>
` : `
<div style="margin:32px 0;padding:16px;background:#F0FDF4;border-radius:8px;border:1px solid #86EFAC">
  <p style="margin:0;font-size:14px;color:#166534">✓ All caught up — no pending actions</p>
</div>
`}

<!-- Footer -->
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #E7E5E4;text-align:center">
  <p style="margin:0;font-size:12px;color:#71717A">Sent by Imba Marketing CRM · Weekly digest</p>
</div>

</div>
</body>
</html>`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    if (!supabaseUrl || !serviceKey) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required')
    }
    const supabase = createClient(supabaseUrl, serviceKey)

    // Load SMTP config
    const { data: smtpRow } = await supabase
      .from('crm_ai_settings')
      .select('value')
      .eq('key', 'smtp_config')
      .maybeSingle()

    if (!smtpRow?.value) {
      return new Response(JSON.stringify({ error: 'SMTP not configured' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    const smtp = smtpRow.value as SmtpConfig

    // Load sender accounts — these are the recipients
    const { data: sendersRow } = await supabase
      .from('crm_ai_settings')
      .select('value')
      .eq('key', 'sender_accounts')
      .maybeSingle()

    const recipients: SenderAccount[] = sendersRow?.value as SenderAccount[] || [
      { email: smtp.from_email, name: smtp.from_name, is_default: true },
    ]

    // ── Gather stats ─────────────────────────────────
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString()
    const twoWeeksAgo = new Date(now.getTime() - 14 * 86400000).toISOString()

    const [
      newLeadsRes, lastWeekLeadsRes, allLeadsRes,
      emailsRes, sentWeekRes,
      chatRes, inboxRes, quotesRes, topProspectsRes,
    ] = await Promise.all([
      supabase.from('crm_leads').select('id').gte('created_at', weekAgo),
      supabase.from('crm_leads').select('id').gte('created_at', twoWeeksAgo).lt('created_at', weekAgo),
      supabase.from('crm_leads').select('status'),
      supabase.from('crm_outreach_emails').select('status'),
      supabase.from('crm_outreach_emails').select('status, sent_at, opened_at, replied_at').gte('sent_at', weekAgo),
      supabase.from('chat_conversations').select('unread_count'),
      supabase.from('crm_inbox_messages').select('id').eq('status', 'unread'),
      supabase.from('quote_requests').select('full_name, company, service_type, created_at').gte('created_at', weekAgo).order('created_at', { ascending: false }).limit(5),
      supabase.from('crm_leads').select('contact_name, name, company_name, company, ai_score')
        .not('ai_score', 'is', null)
        .in('status', ['new', 'qualified'])
        .order('ai_score', { ascending: false })
        .limit(5),
    ])

    const allLeads: Array<{ status: string }> = allLeadsRes.data || []
    const emails: Array<{ status: string }> = emailsRes.data || []
    const sentWeek: Array<{ status: string; sent_at: string | null; opened_at: string | null; replied_at: string | null }> = sentWeekRes.data || []
    const chats: Array<{ unread_count: number | null }> = chatRes.data || []

    const stats = {
      newLeads: newLeadsRes.data?.length || 0,
      leadsLastWeek: lastWeekLeadsRes.data?.length || 0,
      qualifiedLeads: allLeads.filter(l => l.status === 'qualified').length,
      convertedLeads: allLeads.filter(l => l.status === 'converted').length,
      draftEmails: emails.filter(e => e.status === 'draft').length,
      approvedEmails: emails.filter(e => e.status === 'approved').length,
      emailsSentThisWeek: sentWeek.length,
      emailsOpenedThisWeek: sentWeek.filter(e => e.opened_at || e.status === 'opened' || e.status === 'replied').length,
      emailsRepliedThisWeek: sentWeek.filter(e => e.replied_at || e.status === 'replied').length,
      chatUnread: chats.reduce((s, c) => s + (c.unread_count || 0), 0),
      inboxUnread: inboxRes.data?.length || 0,
      topProspects: (topProspectsRes.data || []).map((p: {
        contact_name?: string; name?: string; company_name?: string; company?: string; ai_score: number
      }) => ({
        name: p.contact_name || p.name || 'Unknown',
        company: p.company_name || p.company || '',
        score: p.ai_score || 0,
      })),
      recentQuotes: (quotesRes.data || []).map((q: {
        full_name: string; company: string | null; service_type: string | null; created_at: string
      }) => ({
        name: q.full_name || 'Unknown',
        company: q.company || '',
        service: q.service_type || '',
        date: new Date(q.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      })),
      generatedAt: now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
    }

    // Build HTML
    const subject = `Weekly Pipeline — ${fmtNum(stats.newLeads)} new leads${stats.draftEmails > 0 ? `, ${stats.draftEmails} drafts to review` : ''}`
    const html = buildDigestHtml(stats)

    // Send to all recipients
    let sent = 0
    const errors: string[] = []
    for (const recipient of recipients) {
      try {
        await sendViaSmtp(smtp, recipient.email, subject, html)
        sent++
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e)
        errors.push(`${recipient.email}: ${msg}`)
      }
    }

    return new Response(JSON.stringify({
      success: true,
      sent,
      recipients: recipients.length,
      errors: errors.length ? errors : undefined,
      stats: {
        new_leads: stats.newLeads,
        drafts: stats.draftEmails,
        emails_this_week: stats.emailsSentThisWeek,
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('weekly-digest error:', message)
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
