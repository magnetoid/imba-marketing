// Supabase Edge Function — generate-seo
// Generates 2026-compliant AEO and SEO metadata (including Schema.org FAQ/WebPage) using Anthropic

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
    const { path, label } = await req.json()
    if (!path) throw new Error('Missing path parameter')

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      throw new Error('Missing SUPABASE_URL, SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY')
    }

    const authHeader = req.headers.get('Authorization') || ''
    const token = authHeader.toLowerCase().startsWith('bearer ') ? authHeader.slice(7) : ''
    if (!token) {
      return new Response(JSON.stringify({ error: 'Missing Authorization bearer token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const authed = createClient(supabaseUrl, supabaseAnonKey, { global: { headers: { Authorization: `Bearer ${token}` } } })
    const { data: userData, error: userErr } = await authed.auth.getUser()
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Invalid session' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const role = (userData.user.app_metadata as any)?.role || (userData.user.user_metadata as any)?.role
    if (role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    // 1. Get Anthropic key from DB
    const { data: provider, error: providerErr } = await supabase
      .from('ai_providers')
      .select('api_key, default_model, enabled')
      .eq('id', 'anthropic')
      .single()

    if (providerErr) {
      throw new Error(providerErr.message)
    }

    if (!provider?.enabled || !provider?.api_key) {
      throw new Error('Anthropic provider is disabled or missing api_key in ai_providers')
    }

    // 2. Build prompt for AEO / SEO 2026
    const prompt = `You are a world-class Technical SEO & AEO (Answer Engine Optimization) expert for the year 2026. 
You are optimizing a B2B SaaS website called "Imba Marketing" (URL: https://imbamarketing.com). 
Imba Marketing builds AI-powered marketing systems, CRM, and growth engines.

Your task: Generate highly optimized metadata and Schema.org structured data for the following page:
Path: ${path}
Label/Topic: ${label || 'General'}

Constraints for 2026 SEO/AEO:
1. "title": Catchy, max 60 characters. Must be highly clickable and entity-focused for SGE (Search Generative Experience).
2. "description": 120-160 characters. Must contain a clear value proposition, answer a potential user question, and end with a CTA.
3. "og_title": Optimized for social sharing (can be slightly more conversational than title).
4. "og_description": Social description.
5. "structured_data": Must be a JSON array containing valid Schema.org objects. 
   - ALWAYS include a "WebPage" schema.
   - ALWAYS include an "FAQPage" schema with exactly 3 highly relevant questions and concise, factual answers (this is critical for 2026 AEO voice search and featured snippets).

Return EXACTLY a valid JSON object matching this TypeScript interface (no markdown code blocks, just raw JSON):
{
  "title": string,
  "description": string,
  "og_title": string,
  "og_description": string,
  "structured_data": object[]
}`

    // 3. Call Anthropic Claude 3.5 Sonnet
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': provider.api_key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: provider.default_model || 'claude-3-5-sonnet-20240620',
        max_tokens: 1500,
        temperature: 0.2,
        system: "You are an expert SEO API that outputs ONLY valid JSON.",
        messages: [{ role: 'user', content: prompt }]
      })
    })

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text()
      throw new Error(`Anthropic error: ${errText}`)
    }

    const aiData = await anthropicRes.json()
    const textContent = aiData?.content?.[0]?.text?.trim?.() || ''
    if (!textContent) {
      throw new Error('AI response was empty')
    }

    // Clean potential markdown blocks
    const jsonStr = textContent
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim()
    const parsed = JSON.parse(jsonStr)

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
