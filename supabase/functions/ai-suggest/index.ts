import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function safeTrim(s: unknown) {
  return typeof s === 'string' ? s.trim() : ''
}

async function requireAdmin(req: Request) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
  if (!supabaseUrl || !supabaseAnonKey) throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY')

  const authHeader = req.headers.get('Authorization') || ''
  const token = authHeader.toLowerCase().startsWith('bearer ') ? authHeader.slice(7) : ''
  if (!token) return { ok: false, status: 401, message: 'Missing Authorization bearer token' }

  const authed = createClient(supabaseUrl, supabaseAnonKey, { global: { headers: { Authorization: `Bearer ${token}` } } })
  const { data, error } = await authed.auth.getUser()
  if (error || !data?.user) return { ok: false, status: 401, message: 'Invalid session' }

  const role = (data.user.app_metadata as any)?.role || (data.user.user_metadata as any)?.role
  if (role !== 'admin') return { ok: false, status: 403, message: 'Admin access required' }

  return { ok: true as const }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const admin = await requireAdmin(req)
    if (!admin.ok) {
      return new Response(JSON.stringify({ error: admin.message }), {
        status: admin.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !supabaseServiceRoleKey) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')

    const body = await req.json()
    const kind = safeTrim(body?.kind)
    if (!kind) throw new Error('Missing kind')

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)
    const { data: provider } = await supabase.from('ai_providers').select('api_key, default_model, enabled').eq('id', 'anthropic').single()
    if (!provider?.enabled || !provider?.api_key) throw new Error('Anthropic provider is disabled or missing api_key in ai_providers')

    let prompt = ''
    if (kind === 'blog_seo') {
      const title = safeTrim(body?.title)
      const excerpt = safeTrim(body?.excerpt)
      const content = safeTrim(body?.body)
      const category = safeTrim(body?.category)

      prompt = `You are a 2026 SEO + AEO expert.
Generate SEO fields for a blog post on Imba Marketing (https://imbamarketing.com).

Input:
Title: ${title}
Category: ${category || 'n/a'}
Excerpt: ${excerpt || 'n/a'}
Body (may be truncated): ${content.slice(0, 6000)}

Return ONLY valid JSON:
{
  "seo_title": string,  // <= 60 chars
  "seo_description": string, // 120-160 chars, CTA
  "excerpt": string, // 1-2 sentences
  "faq": [ {"q": string, "a": string} ] // exactly 3 Q&A for FAQPage
}`
    } else if (kind === 'blog_post') {
      const topic = safeTrim(body?.topic)
      if (!topic) throw new Error('Missing topic')

      prompt = `You are an expert content writer for Imba Marketing (AI-powered marketing systems and CRM).
Write a comprehensive, helpful blog post about: ${topic}

Requirements:
- Return ONLY valid JSON (no markdown code blocks)
- body must be HTML with only: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <blockquote>, <a>
- 900+ words, clear structure, answer-first sections
- Include exactly 3 FAQ Q&A entries suitable for FAQPage

Return JSON:
{
  "title": string,
  "slug": string,
  "excerpt": string,
  "body": string,
  "category": string,
  "tags": string[],
  "read_time_minutes": number,
  "seo_title": string,
  "seo_description": string,
  "faq": [ {"q": string, "a": string} ]
}`
    } else {
      throw new Error(`Unsupported kind: ${kind}`)
    }

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': provider.api_key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: provider.default_model || 'claude-3-5-sonnet-20240620',
        max_tokens: 1500,
        temperature: 0.2,
        system: 'Output ONLY valid JSON.',
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text()
      throw new Error(`Anthropic error: ${errText}`)
    }

    const aiData = await anthropicRes.json()
    const textContent = aiData?.content?.[0]?.text?.trim?.() || ''
    if (!textContent) throw new Error('AI response was empty')

    const jsonStr = textContent
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim()

    const parsed = JSON.parse(jsonStr)

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
