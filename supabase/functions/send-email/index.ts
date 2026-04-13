// Supabase Edge Function — send-email
// Deploy: supabase functions deploy send-email --no-verify-jwt
// Deno runtime — uses native fetch for SMTP via smtp2go/resend fallback or nodemailer-compatible SMTP

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

interface EmailPayload {
  to: string
  to_name?: string
  subject: string
  body: string
  smtp: SmtpConfig
  email_id?: string          // crm_outreach_emails.id — for tracking injection
  tracking_base_url?: string // Public URL base (defaults to SUPABASE_URL env)
  skip_tracking?: boolean
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Inject a 1x1 tracking pixel into the email body.
 * If the body is HTML, append before </body> or at the end.
 * If the body is plain text, convert to minimal HTML and append.
 */
function injectTrackingPixel(body: string, trackingUrl: string): { html: string } {
  const pixel = `<img src="${trackingUrl}" width="1" height="1" alt="" style="display:block;border:0;width:1px;height:1px;" />`

  // Detect HTML
  const isHtml = /<[a-z][\s\S]*>/i.test(body)

  if (isHtml) {
    if (/<\/body>/i.test(body)) {
      return { html: body.replace(/<\/body>/i, `${pixel}</body>`) }
    }
    return { html: `${body}\n${pixel}` }
  }

  // Convert plain text to simple HTML, preserving line breaks
  const htmlBody = body
    .split('\n')
    .map(line => line.trim() ? `<p style="margin:0 0 1em 0">${line.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>` : '')
    .filter(Boolean)
    .join('\n')

  return {
    html: `<!DOCTYPE html><html><body style="font-family:system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.6;color:#111;max-width:600px">
${htmlBody}
${pixel}
</body></html>`,
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload: EmailPayload = await req.json()
    const { to, to_name, subject, body, smtp, email_id, skip_tracking } = payload

    if (!smtp?.host || !smtp?.username || !smtp?.password) {
      return new Response(JSON.stringify({ error: 'SMTP not configured' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // ── Tracking pixel injection ────────────────────────
    let finalBody = body
    let trackingId: string | null = null

    if (!skip_tracking && email_id) {
      // Generate tracking ID and save to DB
      trackingId = crypto.randomUUID()
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
        const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
        if (supabaseUrl && serviceKey) {
          const supabase = createClient(supabaseUrl, serviceKey)
          await supabase
            .from('crm_outreach_emails')
            .update({ tracking_id: trackingId })
            .eq('id', email_id)
        }
      } catch (e) {
        console.error('Failed to save tracking_id:', e)
      }

      // Build tracking URL — use payload override or derived from SUPABASE_URL
      const trackingBase = payload.tracking_base_url
        || Deno.env.get('SITE_URL')
        || Deno.env.get('SUPABASE_URL') || ''
      const trackingUrl = `${trackingBase.replace(/\/$/, '')}/functions/v1/track/${trackingId}`

      const injected = injectTrackingPixel(body, trackingUrl)
      finalBody = injected.html
    }

    // ── SMTP send ──────────────────────────────────────
    if (smtp.host.includes('smtp2go')) {
      const res = await fetch('https://api.smtp2go.com/v3/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: smtp.password,
          to: [to_name ? `${to_name} <${to}>` : to],
          sender: `${smtp.from_name} <${smtp.from_email}>`,
          subject,
          html_body: finalBody,
          text_body: body, // plain text fallback
        }),
      })
      const data = await res.json()
      if (!res.ok || data.data?.error) {
        throw new Error(data.data?.error || 'smtp2go send failed')
      }
    } else {
      // Generic SMTP via deno-smtp
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
        content: body,       // plain text
        html: finalBody,     // HTML with tracking pixel
      })
      await client.close()
    }

    return new Response(JSON.stringify({
      success: true,
      tracking_id: trackingId,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('send-email error:', message)
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
