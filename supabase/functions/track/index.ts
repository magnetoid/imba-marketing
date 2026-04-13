// Supabase Edge Function — track
// Deploy: supabase functions deploy track --no-verify-jwt
// Serves a 1x1 transparent GIF and logs email open events

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// 1x1 transparent GIF
const PIXEL_GIF = Uint8Array.from(
  atob('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'),
  (c) => c.charCodeAt(0)
)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const pixelHeaders = {
  ...corsHeaders,
  'Content-Type': 'image/gif',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
}

function servePixel(): Response {
  return new Response(PIXEL_GIF, { status: 200, headers: pixelHeaders })
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)

    // Extract tracking_id from path (/track/{tracking_id}) or query param (?id=...)
    const pathParts = url.pathname.split('/').filter(Boolean)
    // The function is mounted at /track, so the tracking_id is the segment after "track"
    const trackIndex = pathParts.indexOf('track')
    const trackingId = (trackIndex >= 0 && pathParts[trackIndex + 1])
      ? pathParts[trackIndex + 1]
      : url.searchParams.get('id')

    if (!trackingId) {
      return servePixel()
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
      return servePixel()
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Look up the email by tracking_id
    const { data: email, error: lookupError } = await supabase
      .from('crm_outreach_emails')
      .select('id, status')
      .eq('tracking_id', trackingId)
      .single()

    if (lookupError || !email) {
      // Silently serve pixel — don't expose errors
      return servePixel()
    }

    const now = new Date().toISOString()
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'

    // Update email status to 'opened' if currently 'sent'
    if (email.status === 'sent') {
      const { error: updateError } = await supabase
        .from('crm_outreach_emails')
        .update({ status: 'opened', opened_at: now })
        .eq('id', email.id)

      if (updateError) {
        console.error(`Failed to update email ${email.id}: ${updateError.message}`)
      }
    }

    // Insert email event record
    const { error: eventError } = await supabase
      .from('crm_email_events')
      .insert({
        email_id: email.id,
        event_type: 'opened',
        metadata: {
          ip,
          user_agent: userAgent,
          timestamp: now,
          tracking_id: trackingId,
        },
      })

    if (eventError) {
      console.error(`Failed to insert event for email ${email.id}: ${eventError.message}`)
    }

    return servePixel()
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('track error:', message)
    // Always return the pixel, even on errors
    return servePixel()
  }
})
