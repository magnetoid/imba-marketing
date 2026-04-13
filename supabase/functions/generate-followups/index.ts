// Supabase Edge Function — generate-followups
// Deploy: supabase functions deploy generate-followups --no-verify-jwt
// Checks for sent outreach emails with no reply after 3 days and generates AI follow-up drafts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1. Find sent emails older than 3 days with no existing follow-up
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()

    const { data: staleEmails, error: staleError } = await supabase
      .from('crm_outreach_emails')
      .select('*')
      .eq('status', 'sent')
      .lt('sent_at', threeDaysAgo)

    if (staleError) throw new Error(`Failed to query stale emails: ${staleError.message}`)
    if (!staleEmails || staleEmails.length === 0) {
      return new Response(JSON.stringify({ count: 0, message: 'No stale emails found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Filter out emails that already have a follow-up
    const staleIds = staleEmails.map((e: Record<string, unknown>) => e.id)
    const { data: existingFollowups, error: followupError } = await supabase
      .from('crm_outreach_emails')
      .select('follow_up_of')
      .in('follow_up_of', staleIds)

    if (followupError) throw new Error(`Failed to check existing follow-ups: ${followupError.message}`)

    const followedUpIds = new Set(
      (existingFollowups || []).map((f: Record<string, unknown>) => f.follow_up_of)
    )
    const emailsNeedingFollowup = staleEmails.filter(
      (e: Record<string, unknown>) => !followedUpIds.has(e.id)
    )

    if (emailsNeedingFollowup.length === 0) {
      return new Response(JSON.stringify({ count: 0, message: 'All stale emails already have follow-ups' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 2. Load company profile
    const { data: companySettings } = await supabase
      .from('crm_ai_settings')
      .select('value')
      .eq('key', 'company_profile')
      .single()

    const companyProfile = companySettings?.value || 'A professional B2B company'

    // 3. Load AI provider config
    const { data: aiProvider, error: providerError } = await supabase
      .from('ai_providers')
      .select('*')
      .eq('enabled', true)
      .not('api_key', 'is', null)
      .limit(1)
      .single()

    if (providerError || !aiProvider) {
      throw new Error('No enabled AI provider with API key found')
    }

    const apiKey = aiProvider.api_key as string
    const model = (aiProvider.model as string) || 'claude-sonnet-4-20250514'

    let generatedCount = 0

    // 4. Process each stale email
    for (const email of emailsNeedingFollowup) {
      try {
        // Load lead data
        const { data: lead } = await supabase
          .from('crm_leads')
          .select('*')
          .eq('id', email.lead_id)
          .single()

        const leadName = lead?.name || lead?.first_name || 'there'
        const leadCompany = lead?.company || 'your company'
        const followUpNumber = ((email.follow_up_number as number) || 0) + 1

        const prompt = `You are writing a follow-up email for a B2B outreach campaign.

Company Profile: ${typeof companyProfile === 'string' ? companyProfile : JSON.stringify(companyProfile)}

Original email that was sent ${Math.round((Date.now() - new Date(email.sent_at as string).getTime()) / (1000 * 60 * 60 * 24))} days ago:
Subject: ${email.subject}
Body: ${email.body}

Recipient: ${leadName} at ${leadCompany}
This is follow-up #${followUpNumber}.

Write a concise, friendly follow-up email. Keep it short (3-5 sentences). Reference the original email naturally. Include a clear call to action.

Respond in this exact JSON format:
{"subject": "Re: ...", "body": "..."}`

        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            model,
            max_tokens: 800,
            system: 'You are a B2B email copywriter specializing in polite, effective follow-up emails. Always respond with valid JSON containing "subject" and "body" fields.',
            messages: [{ role: 'user', content: prompt }],
          }),
        })

        if (!res.ok) {
          const errBody = await res.text()
          console.error(`AI API error for email ${email.id}: ${res.status} ${errBody}`)
          continue
        }

        const aiData = await res.json()
        const aiText = aiData.content?.[0]?.text || ''

        // Parse AI response — extract JSON from the response
        const jsonMatch = aiText.match(/\{[\s\S]*"subject"[\s\S]*"body"[\s\S]*\}/)
        if (!jsonMatch) {
          console.error(`Failed to parse AI response for email ${email.id}: ${aiText}`)
          continue
        }

        const followUp = JSON.parse(jsonMatch[0])

        // 5. Insert follow-up email as draft
        const { data: insertedEmail, error: insertError } = await supabase
          .from('crm_outreach_emails')
          .insert({
            lead_id: email.lead_id,
            subject: followUp.subject,
            body: followUp.body,
            status: 'draft',
            follow_up_of: email.id,
            follow_up_number: followUpNumber,
            ai_generated: true,
          })
          .select('id')
          .single()

        if (insertError) {
          console.error(`Failed to insert follow-up for email ${email.id}: ${insertError.message}`)
          continue
        }

        // 6. Insert follow-up suggestion record
        const { error: suggestionError } = await supabase
          .from('crm_follow_up_suggestions')
          .insert({
            original_email_id: email.id,
            follow_up_email_id: insertedEmail?.id,
            lead_id: email.lead_id,
            suggested_subject: followUp.subject,
            suggested_body: followUp.body,
            follow_up_number: followUpNumber,
            status: 'pending',
          })

        if (suggestionError) {
          console.error(`Failed to insert suggestion for email ${email.id}: ${suggestionError.message}`)
        }

        generatedCount++
      } catch (emailError: unknown) {
        const message = emailError instanceof Error ? emailError.message : 'Unknown error'
        console.error(`Error processing email ${email.id}: ${message}`)
        continue
      }
    }

    return new Response(JSON.stringify({
      count: generatedCount,
      message: `Generated ${generatedCount} follow-up draft(s)`,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('generate-followups error:', message)
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
