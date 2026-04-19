import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type Issue = {
  url: string
  severity: 'critical' | 'warning' | 'info'
  code: string
  message: string
  data?: Record<string, unknown>
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr))
}

function extractFirst(html: string, re: RegExp): string {
  const m = html.match(re)
  return (m?.[1] || '').trim()
}

async function requireAdminOrCron(req: Request) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const cronSecret = Deno.env.get('CRON_SECRET') || ''

  if (!supabaseUrl || !supabaseAnonKey) throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY')

  const cronHeader = req.headers.get('x-cron-secret') || ''
  if (cronSecret && cronHeader && cronHeader === cronSecret) {
    return { ok: true as const }
  }

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
    const auth = await requireAdminOrCron(req)
    if (!auth.ok) {
      return new Response(JSON.stringify({ error: auth.message }), {
        status: auth.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const siteUrl = (Deno.env.get('SITE_URL') || 'https://imbamarketing.com').replace(/\/$/, '')

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    }

    const body = await req.json().catch(() => ({}))
    const scope = (body?.scope as string) || 'all_published'

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    const { data: run, error: runErr } = await supabase
      .from('audit_runs')
      .insert([{ scope }])
      .select('id')
      .single()

    if (runErr || !run?.id) {
      throw new Error(runErr?.message || 'Failed to create audit run')
    }

    const paths: string[] = ['/', '/services', '/about', '/blog', '/contact', '/work', '/results', '/reviews', '/gallery', '/ai-projects']

    const { data: seoPages } = await supabase.from('seo_pages').select('path, title, description, canonical, noindex, structured_data')
    if (seoPages) {
      paths.push(...seoPages.map((p: any) => p.path).filter(Boolean))
    }

    const { data: posts } = await supabase.from('blog_posts').select('slug, seo_title, seo_description, published').eq('published', true)
    if (posts) {
      paths.push(...posts.map((p: any) => `/blog/${p.slug}`).filter(Boolean))
    }

    const { data: services } = await supabase.from('services').select('slug, published').eq('published', true)
    if (services) {
      paths.push(...services.map((s: any) => `/services/${s.slug}`).filter(Boolean))
    }

    const uniquePaths = uniq(paths.map((p) => (p.startsWith('/') ? p : `/${p}`)))
    const issues: Issue[] = []

    for (const path of uniquePaths) {
      const url = `${siteUrl}${path}`
      let res: Response
      try {
        res = await fetch(url, { redirect: 'follow' })
      } catch (e: any) {
        issues.push({ url, severity: 'critical', code: 'FETCH_FAILED', message: `Failed to fetch URL: ${e?.message || 'unknown error'}` })
        continue
      }

      if (!res.ok) {
        issues.push({ url, severity: 'critical', code: 'HTTP_STATUS', message: `Non-200 HTTP status: ${res.status}`, data: { status: res.status } })
        continue
      }

      const html = await res.text()
      const title = extractFirst(html, /<title[^>]*>([^<]*)<\/title>/i)
      const desc = extractFirst(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i)
      const canonical = extractFirst(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["'][^>]*>/i)

      if (!title) issues.push({ url, severity: 'critical', code: 'TITLE_MISSING', message: 'Missing <title>' })
      if (!desc) issues.push({ url, severity: 'warning', code: 'DESCRIPTION_MISSING', message: 'Missing meta description' })
      if (!canonical) issues.push({ url, severity: 'warning', code: 'CANONICAL_MISSING', message: 'Missing canonical link' })

      if (title && title.length > 70) issues.push({ url, severity: 'warning', code: 'TITLE_TOO_LONG', message: `Title is ${title.length} chars (target <= 60)` })
      if (desc && desc.length > 180) issues.push({ url, severity: 'warning', code: 'DESCRIPTION_TOO_LONG', message: `Description is ${desc.length} chars (target 120–160)` })
      if (desc && desc.length > 0 && desc.length < 80) issues.push({ url, severity: 'warning', code: 'DESCRIPTION_TOO_SHORT', message: `Description is ${desc.length} chars (target 120–160)` })
    }

    if (issues.length > 0) {
      const payload = issues.map((i) => ({
        run_id: run.id,
        url: i.url,
        code: i.code,
        severity: i.severity,
        message: i.message,
        data: i.data || {},
      }))
      await supabase.from('seo_issues').insert(payload)
    }

    const totals = issues.reduce(
      (acc, i) => {
        acc[i.severity] += 1
        return acc
      },
      { critical: 0, warning: 0, info: 0 } as any
    )

    await supabase.from('audit_runs').update({ totals, finished_at: new Date().toISOString() }).eq('id', run.id)

    return new Response(JSON.stringify({ run_id: run.id, totals, scanned: uniquePaths.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

