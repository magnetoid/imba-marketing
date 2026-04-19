import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type Issue = {
  severity: 'critical' | 'warning' | 'info'
  code: string
  message: string
  field?: string
}

function isObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v)
}

function validateJsonLd(value: unknown): Issue[] {
  const issues: Issue[] = []
  const arr = Array.isArray(value) ? value : value ? [value] : []

  if (arr.length === 0) {
    issues.push({ severity: 'warning', code: 'SCHEMA_MISSING', message: 'No structured data (JSON-LD) provided', field: 'structured_data' })
    return issues
  }

  const hasWebPage = arr.some((s) => isObject(s) && (s['@type'] === 'WebPage' || (Array.isArray(s['@type']) && (s['@type'] as any[]).includes('WebPage'))))
  if (!hasWebPage) {
    issues.push({ severity: 'warning', code: 'SCHEMA_MISSING_WEBPAGE', message: 'Missing WebPage schema in JSON-LD', field: 'structured_data' })
  }

  const faqSchemas = arr.filter((s) => isObject(s) && (s['@type'] === 'FAQPage' || (Array.isArray(s['@type']) && (s['@type'] as any[]).includes('FAQPage'))))
  if (faqSchemas.length > 0) {
    for (const faq of faqSchemas) {
      if (!isObject(faq)) continue
      const mainEntity = faq['mainEntity']
      if (!Array.isArray(mainEntity)) {
        issues.push({ severity: 'warning', code: 'FAQ_INVALID', message: 'FAQPage schema missing mainEntity array', field: 'structured_data' })
        continue
      }
      if (mainEntity.length < 1) {
        issues.push({ severity: 'warning', code: 'FAQ_EMPTY', message: 'FAQPage schema has no questions', field: 'structured_data' })
      }
    }
  }

  return issues
}

function validateMeta(input: { title?: string; description?: string; canonical?: string; noindex?: boolean }): Issue[] {
  const issues: Issue[] = []
  const title = (input.title || '').trim()
  const desc = (input.description || '').trim()
  const canonical = (input.canonical || '').trim()

  if (!title) {
    issues.push({ severity: 'critical', code: 'TITLE_MISSING', message: 'Missing title tag', field: 'title' })
  } else if (title.length > 70) {
    issues.push({ severity: 'warning', code: 'TITLE_TOO_LONG', message: `Title is ${title.length} chars (target <= 60)`, field: 'title' })
  } else if (title.length > 60) {
    issues.push({ severity: 'info', code: 'TITLE_SLIGHTLY_LONG', message: `Title is ${title.length} chars (target <= 60)`, field: 'title' })
  }

  if (!desc) {
    issues.push({ severity: 'warning', code: 'DESCRIPTION_MISSING', message: 'Missing meta description', field: 'description' })
  } else if (desc.length < 80) {
    issues.push({ severity: 'warning', code: 'DESCRIPTION_TOO_SHORT', message: `Description is ${desc.length} chars (target 120–160)`, field: 'description' })
  } else if (desc.length < 120) {
    issues.push({ severity: 'info', code: 'DESCRIPTION_SHORT', message: `Description is ${desc.length} chars (target 120–160)`, field: 'description' })
  } else if (desc.length > 180) {
    issues.push({ severity: 'warning', code: 'DESCRIPTION_TOO_LONG', message: `Description is ${desc.length} chars (target 120–160)`, field: 'description' })
  } else if (desc.length > 160) {
    issues.push({ severity: 'info', code: 'DESCRIPTION_SLIGHTLY_LONG', message: `Description is ${desc.length} chars (target 120–160)`, field: 'description' })
  }

  if (!input.noindex && !canonical) {
    issues.push({ severity: 'warning', code: 'CANONICAL_MISSING', message: 'Missing canonical URL override', field: 'canonical' })
  }

  return issues
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

    const body = await req.json()
    const issues: Issue[] = []

    issues.push(...validateMeta({
      title: body?.title,
      description: body?.description,
      canonical: body?.canonical,
      noindex: !!body?.noindex,
    }))

    if (body?.structured_data !== undefined && body?.structured_data !== null) {
      issues.push(...validateJsonLd(body.structured_data))
    }

    const score = Math.max(0, 100 - issues.reduce((acc, i) => acc + (i.severity === 'critical' ? 30 : i.severity === 'warning' ? 15 : 5), 0))

    return new Response(JSON.stringify({ score, issues }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

