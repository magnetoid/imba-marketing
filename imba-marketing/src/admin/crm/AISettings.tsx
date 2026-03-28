import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import toast from 'react-hot-toast'
import {
  Settings, Loader2, CheckCircle2, AlertCircle, Mail,
  Save, Eye, EyeOff, Zap, BarChart3, RefreshCw, Brain, Globe,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────

interface AIProvider {
  id: string
  name: string
  api_key: string
  base_url: string | null
  default_model: string | null
  available_models: string[]
  enabled: boolean
  last_models_fetch: string | null
}

interface SmtpConfig {
  host: string; port: string; secure: boolean
  username: string; password: string; from_name: string; from_email: string
}

const EMPTY_SMTP: SmtpConfig = { host: '', port: '587', secure: false, username: '', password: '', from_name: 'Imba Marketing', from_email: '' }

const PROVIDER_META: Record<string, { placeholder: string; helpUrl: string; modelsEndpoint?: string; hasBaseUrl?: boolean }> = {
  anthropic: {
    placeholder: 'sk-ant-api03-…',
    helpUrl: 'https://console.anthropic.com/settings/keys',
  },
  openai: {
    placeholder: 'sk-…',
    helpUrl: 'https://platform.openai.com/api-keys',
    modelsEndpoint: 'https://api.openai.com/v1/models',
  },
  perplexity: {
    placeholder: 'pplx-…',
    helpUrl: 'https://www.perplexity.ai/settings/api',
  },
  ollama: {
    placeholder: 'ollama-…',
    helpUrl: 'https://ollama.com/cloud',
    hasBaseUrl: true,
  },
}

// ── Fetch models from provider APIs ─────────────────────

async function fetchModels(provider: AIProvider): Promise<string[]> {
  try {
    if (provider.id === 'anthropic') {
      // Anthropic doesn't have a models endpoint — return known models
      return [
        'claude-opus-4-6', 'claude-sonnet-4-6',
        'claude-haiku-4-5-20251001',
        'claude-sonnet-4-20250514',
      ]
    }
    if (provider.id === 'openai' && provider.api_key) {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      const url = isLocal ? 'https://api.openai.com/v1/models' : '/api/openai/v1/models'
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${provider.api_key}` },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json() as { data: Array<{ id: string }> }
      return data.data
        .map(m => m.id)
        .filter(id => id.startsWith('gpt-') || id.startsWith('o'))
        .sort()
    }
    if (provider.id === 'perplexity') {
      return [
        'sonar', 'sonar-pro', 'sonar-reasoning', 'sonar-reasoning-pro',
      ]
    }
    if (provider.id === 'ollama' && provider.base_url) {
      const base = provider.base_url.replace(/\/+$/, '')
      // Try native Ollama API first: GET /api/tags
      try {
        const res = await fetch(`${base}/api/tags`)
        if (res.ok) {
          const data = await res.json() as { models: Array<{ name: string; model?: string }> }
          if (data.models?.length) return data.models.map(m => m.model || m.name)
        }
      } catch { /* try next */ }
      // Try OpenAI-compatible: GET /v1/models
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        if (provider.api_key) headers['Authorization'] = `Bearer ${provider.api_key}`
        const res = await fetch(`${base}/v1/models`, { headers })
        if (res.ok) {
          const data = await res.json() as { data?: Array<{ id: string }>; models?: Array<{ id: string }> }
          const list = data.data || data.models || []
          if (list.length) return list.map(m => m.id)
        }
      } catch { /* try next */ }
      // Try base URL as-is (user might have entered full path)
      try {
        const res = await fetch(base)
        if (res.ok) {
          const data = await res.json() as { models?: Array<{ name: string; id?: string }> }
          if (data.models?.length) return data.models.map(m => m.id || m.name)
        }
      } catch { /* give up */ }
      throw new Error('Could not reach Ollama. Check the base URL (e.g. http://localhost:11434). Make sure Ollama is running and CORS is enabled.')
    }
    return []
  } catch (e) {
    console.error(`Failed to fetch models for ${provider.id}:`, e)
    return []
  }
}

// ── Component ───────────────────────────────────────────

export default function AISettings() {
  // AI Providers
  const [providers, setProviders] = useState<AIProvider[]>([])
  const [fetchingModels, setFetchingModels] = useState<string | null>(null)
  const [savingProviders, setSavingProviders] = useState(false)
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})

  // SMTP
  const [smtp, setSmtp] = useState<SmtpConfig>(EMPTY_SMTP)
  const [showSmtpPass, setShowSmtpPass] = useState(false)
  const [savingSmtp, setSavingSmtp] = useState(false)
  const [testingSmtp, setTestingSmtp] = useState(false)
  const [smtpTestResult, setSmtpTestResult] = useState<{ ok: boolean; message: string } | null>(null)

  // AI Behavior
  const [aiTone, setAiTone] = useState('professional')
  const [autoEnrich, setAutoEnrich] = useState(true)
  const [autoCategorize, setAutoCategorize] = useState(true)
  const [savingAI, setSavingAI] = useState(false)

  // Company Profile
  const [companyName, setCompanyName] = useState('Imba Marketing')
  const [companyDesc, setCompanyDesc] = useState('AI-powered marketing agency delivering smarter campaigns and real results.')
  const [usp, setUsp] = useState('We combine six proprietary AI systems with human strategy to help ambitious brands grow faster.')

  // Tracking
  const [ga4Id, setGa4Id] = useState('')
  const [gtmId, setGtmId] = useState('')
  const [fbPixelId, setFbPixelId] = useState('')
  const [customHeadScripts, setCustomHeadScripts] = useState('')
  const [savingTracking, setSavingTracking] = useState(false)

  // Email Sender Accounts
  const [senderAccounts, setSenderAccounts] = useState<Array<{ email: string; name: string; is_default: boolean }>>([
    { email: 'hello@imbamarketing.com', name: 'Imba Marketing', is_default: true },
    { email: 'marko@imbamarketing.com', name: 'Marko Tiosavljevic', is_default: false },
  ])
  const [savingSenders, setSavingSenders] = useState(false)

  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      // Load CRM settings (may not exist if migration not run)
      try {
        const crmRes = await supabase.from('crm_ai_settings').select('key, value')
        if (crmRes.data && !crmRes.error) {
          const m = Object.fromEntries(crmRes.data.map(r => [r.key, r.value]))
          if (m.smtp_config) setSmtp(m.smtp_config as SmtpConfig)
          if (m.ai_outreach_tone) setAiTone(m.ai_outreach_tone as string)
          if (m.ai_auto_enrich !== undefined) setAutoEnrich(Boolean(m.ai_auto_enrich))
          if (m.ai_inbox_auto_categorize !== undefined) setAutoCategorize(Boolean(m.ai_inbox_auto_categorize))
          if (m.company_profile) {
            const cp = m.company_profile as { company_name?: string; company_description?: string; usp?: string }
            if (cp.company_name) setCompanyName(cp.company_name)
            if (cp.company_description) setCompanyDesc(cp.company_description)
            if (cp.usp) setUsp(cp.usp)
          }
          if (m.sender_accounts) {
            setSenderAccounts(m.sender_accounts as Array<{ email: string; name: string; is_default: boolean }>)
          }
        }
      } catch { /* table may not exist */ }

      // Load tracking settings (may not have 'tracking' key yet)
      try {
        const trackingRes = await supabase.from('site_settings').select('key, value').eq('key', 'tracking').maybeSingle()
        if (trackingRes.data?.value) {
          const t = trackingRes.data.value as { ga4_id?: string; gtm_id?: string; fb_pixel_id?: string; custom_head_scripts?: string }
          if (t.ga4_id) setGa4Id(t.ga4_id)
          if (t.gtm_id) setGtmId(t.gtm_id)
          if (t.fb_pixel_id) setFbPixelId(t.fb_pixel_id)
          if (t.custom_head_scripts) setCustomHeadScripts(t.custom_head_scripts)
        }
      } catch { /* no tracking row yet */ }

      // Load AI providers (V006 — may not exist yet)
      let providersRes: { data: AIProvider[] | null; error: unknown } = { data: null, error: null }
      try {
        providersRes = await supabase.from('ai_providers').select('*').order('id') as typeof providersRes
      } catch { /* table may not exist */ }
      if (providersRes.data?.length) {
        setProviders(providersRes.data.map(p => ({
          ...p,
          available_models: (p.available_models as string[] | null) || [],
        })))
        // Migrate localStorage key if present
        const localKey = localStorage.getItem('anthropic_api_key')
        if (localKey) {
          const anthropic = providersRes.data.find(p => p.id === 'anthropic')
          if (anthropic && !anthropic.api_key) {
            await supabase.from('ai_providers').update({ api_key: localKey, enabled: true }).eq('id', 'anthropic')
            localStorage.removeItem('anthropic_api_key')
            setProviders(prev => prev.map(p => p.id === 'anthropic' ? { ...p, api_key: localKey, enabled: true } : p))
          }
        }
      } else if (providersRes.error) {
        // Table doesn't exist yet — show default providers for UI (save will fail gracefully)
        console.warn('ai_providers table not found — run V006 migration. Using defaults.')
        setProviders([
          { id: 'anthropic', name: 'Anthropic (Claude)', api_key: localStorage.getItem('anthropic_api_key') || '', base_url: null, default_model: 'claude-sonnet-4-20250514', available_models: ['claude-opus-4-6', 'claude-sonnet-4-6', 'claude-sonnet-4-20250514', 'claude-haiku-4-5-20251001'], enabled: true, last_models_fetch: null },
          { id: 'openai', name: 'OpenAI (GPT)', api_key: '', base_url: null, default_model: null, available_models: [], enabled: false, last_models_fetch: null },
          { id: 'perplexity', name: 'Perplexity', api_key: '', base_url: null, default_model: null, available_models: [], enabled: false, last_models_fetch: null },
          { id: 'ollama', name: 'Ollama Cloud', api_key: '', base_url: null, default_model: null, available_models: [], enabled: false, last_models_fetch: null },
        ])
      }
    } catch (e) {
      console.error('Error loading settings:', e)
    }
    setLoading(false)
  }

  // ── Provider handlers ─────────────────────────────────

  function updateProvider(id: string, update: Partial<AIProvider>) {
    setProviders(prev => prev.map(p => p.id === id ? { ...p, ...update } : p))
  }

  async function saveProviders() {
    setSavingProviders(true)
    try {
      // Try upsert (works if table exists, creates rows if needed)
      const promises = providers.map(p =>
        supabase.from('ai_providers').upsert({
          id: p.id,
          name: p.name,
          api_key: p.api_key,
          base_url: p.base_url,
          default_model: p.default_model,
          available_models: p.available_models,
          enabled: p.enabled,
          updated_at: new Date().toISOString(),
        })
      )
      const results = await Promise.all(promises)
      const failed = results.find(r => r.error)
      if (failed?.error) {
        // Table might not exist — fall back to localStorage for Anthropic
        const anthropic = providers.find(p => p.id === 'anthropic')
        if (anthropic?.api_key) localStorage.setItem('anthropic_api_key', anthropic.api_key)
        toast.error('ai_providers table not found — run V006 migration. Anthropic key saved to browser.')
      } else {
        // Remove localStorage key if DB save succeeded
        localStorage.removeItem('anthropic_api_key')
        toast.success('AI providers saved')
      }
    } catch {
      toast.error('Failed to save providers')
    }
    setSavingProviders(false)
  }

  async function handleFetchModels(provider: AIProvider) {
    setFetchingModels(provider.id)
    const models = await fetchModels(provider)
    updateProvider(provider.id, {
      available_models: models,
      last_models_fetch: new Date().toISOString(),
    })
    await supabase.from('ai_providers').update({
      available_models: models,
      last_models_fetch: new Date().toISOString(),
    }).eq('id', provider.id)
    setFetchingModels(null)
    if (models.length) toast.success(`Fetched ${models.length} models from ${provider.name}`)
    else toast.error(`No models found — check your API key`)
  }

  // ── SMTP handlers ─────────────────────────────────────

  async function saveSmtp() {
    setSavingSmtp(true)
    const { error } = await supabase.from('crm_ai_settings').upsert({ key: 'smtp_config', value: smtp, description: 'SMTP configuration' })
    setSavingSmtp(false)
    if (error) { toast.error(error.message); return }
    toast.success('SMTP saved')
  }

  async function testSmtp() {
    setTestingSmtp(true)
    setSmtpTestResult(null)

    // Validate required fields
    if (!smtp.host || !smtp.username || !smtp.password || !smtp.from_email) {
      setSmtpTestResult({ ok: false, message: 'Fill in all required SMTP fields (host, username, password, from email).' })
      setTestingSmtp(false)
      return
    }

    // Try Edge Function first (if deployed)
    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: smtp.from_email,
          to_name: smtp.from_name,
          subject: 'SMTP Test — Imba CRM',
          body: 'If you received this, your SMTP configuration is working correctly.\n\nSent from Imba Marketing CRM.',
          smtp,
        },
      })
      if (!error) {
        setSmtpTestResult({ ok: true, message: `Test email sent to ${smtp.from_email}! Check your inbox.` })
        toast.success('SMTP test email sent!')
        setTestingSmtp(false)
        return
      }
    } catch { /* Edge Function not deployed — continue */ }

    // Edge Function not available — validate config and save
    await saveSmtp()
    setSmtpTestResult({
      ok: true,
      message: `SMTP config saved. To test sending, deploy the send-email Edge Function (see guide below), or use the Outreach Pipeline to send a test email.`,
    })
    setTestingSmtp(false)
  }

  // ── AI + Company + Tracking + Senders ─────────────────

  async function saveAI() {
    setSavingAI(true)
    await Promise.all([
      supabase.from('crm_ai_settings').upsert({ key: 'ai_outreach_tone', value: aiTone }),
      supabase.from('crm_ai_settings').upsert({ key: 'ai_auto_enrich', value: autoEnrich }),
      supabase.from('crm_ai_settings').upsert({ key: 'ai_inbox_auto_categorize', value: autoCategorize }),
      supabase.from('crm_ai_settings').upsert({ key: 'company_profile', value: { company_name: companyName, company_description: companyDesc, usp } }),
    ])
    setSavingAI(false)
    toast.success('AI settings saved')
  }

  async function saveTracking() {
    setSavingTracking(true)
    const { error } = await supabase.from('site_settings').upsert({
      key: 'tracking',
      value: { ga4_id: ga4Id.trim(), gtm_id: gtmId.trim(), fb_pixel_id: fbPixelId.trim(), custom_head_scripts: customHeadScripts.trim() },
    })
    setSavingTracking(false)
    if (error) { toast.error(error.message); return }
    toast.success('Tracking saved — reload site to activate')
  }

  async function saveSenders() {
    setSavingSenders(true)
    const { error } = await supabase.from('crm_ai_settings').upsert({ key: 'sender_accounts', value: senderAccounts })
    setSavingSenders(false)
    if (error) { toast.error(error.message); return }
    toast.success('Sender accounts saved')
  }

  const sf = (k: keyof SmtpConfig) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setSmtp(p => ({ ...p, [k]: e.target.value }))

  if (loading) return <div className="flex justify-center items-center py-32"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-1">
        <Settings className="h-5 w-5 text-amber-500" />
        <h1 className="text-2xl font-semibold">CRM & AI Settings</h1>
      </div>
      <p className="text-muted-foreground text-sm mb-10">AI providers, SMTP, tracking, company profile, and sender accounts.</p>

      {/* ═══════════ AI PROVIDERS ═══════════ */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <Brain className="h-4 w-4 text-amber-500" />
          <h2 className="font-medium text-lg">AI Providers</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-6">Configure API keys for each AI provider. Keys are stored securely in the database — not in your browser.</p>

        <div className="space-y-6">
          {providers.map(provider => {
            const meta = PROVIDER_META[provider.id] || { placeholder: '', helpUrl: '' }
            const isActive = provider.enabled && provider.api_key
            return (
              <div key={provider.id} className={`border rounded-lg p-5 transition-colors ${isActive ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                    <h3 className="font-medium">{provider.name}</h3>
                    {isActive && <span className="text-xs text-emerald-500 font-medium">Active</span>}
                  </div>
                  <Switch
                    checked={provider.enabled}
                    onCheckedChange={v => updateProvider(provider.id, { enabled: v })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs">API Key</Label>
                    <div className="relative">
                      <Input
                        type={showKeys[provider.id] ? 'text' : 'password'}
                        value={provider.api_key}
                        onChange={e => updateProvider(provider.id, { api_key: e.target.value })}
                        placeholder={meta.placeholder}
                        className="pr-10 font-mono text-xs"
                      />
                      <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowKeys(p => ({ ...p, [provider.id]: !p[provider.id] }))}
                      >
                        {showKeys[provider.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    <a href={meta.helpUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-500 hover:underline">
                      Get API key →
                    </a>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs">Default Model</Label>
                    <div className="flex gap-2">
                      <Select
                        value={provider.default_model || ''}
                        onValueChange={v => updateProvider(provider.id, { default_model: v })}
                      >
                        <SelectTrigger className="flex-1 text-xs">
                          <SelectValue placeholder="Select model…" />
                        </SelectTrigger>
                        <SelectContent>
                          {provider.available_models.map(m => (
                            <SelectItem key={m} value={m} className="text-xs font-mono">{m}</SelectItem>
                          ))}
                          {!provider.available_models.length && (
                            <SelectItem value="__none__" disabled className="text-xs">Fetch models first</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFetchModels(provider)}
                        disabled={!provider.api_key || fetchingModels === provider.id}
                        title="Fetch available models"
                      >
                        {fetchingModels === provider.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                    {provider.available_models.length > 0 && (
                      <p className="text-xs text-muted-foreground">{provider.available_models.length} models available</p>
                    )}
                  </div>
                </div>

                {meta.hasBaseUrl && (
                  <div className="mt-3 flex flex-col gap-1.5">
                    <Label className="text-xs">Base URL</Label>
                    <Input
                      value={provider.base_url || ''}
                      onChange={e => updateProvider(provider.id, { base_url: e.target.value })}
                      placeholder="https://your-ollama-instance.com"
                      className="text-xs"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <Button onClick={saveProviders} disabled={savingProviders} className="mt-4 gap-2">
          {savingProviders ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save AI Providers
        </Button>
      </section>

      <Separator className="mb-10" />

      {/* ═══════════ EMAIL SENDER ACCOUNTS ═══════════ */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <Mail className="h-4 w-4 text-amber-500" />
          <h2 className="font-medium text-lg">Email Sender Accounts</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-5">Configure which email addresses can send outreach emails from the CRM.</p>

        <div className="space-y-3 mb-4">
          {senderAccounts.map((acc, i) => (
            <div key={i} className="flex items-center gap-3 border border-border rounded-lg p-3">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <Input
                  value={acc.email}
                  onChange={e => setSenderAccounts(prev => prev.map((a, j) => j === i ? { ...a, email: e.target.value } : a))}
                  placeholder="email@imbamarketing.com"
                  className="text-sm"
                />
                <Input
                  value={acc.name}
                  onChange={e => setSenderAccounts(prev => prev.map((a, j) => j === i ? { ...a, name: e.target.value } : a))}
                  placeholder="Sender name"
                  className="text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={acc.is_default}
                  onCheckedChange={() => setSenderAccounts(prev => prev.map((a, j) => ({ ...a, is_default: j === i })))}
                />
                <span className="text-xs text-muted-foreground w-12">{acc.is_default ? 'Default' : ''}</span>
              </div>
              {senderAccounts.length > 1 && (
                <Button variant="ghost" size="sm" onClick={() => setSenderAccounts(prev => prev.filter((_, j) => j !== i))}>×</Button>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setSenderAccounts(prev => [...prev, { email: '', name: '', is_default: false }])}>
            + Add sender
          </Button>
          <Button onClick={saveSenders} disabled={savingSenders} size="sm" className="gap-1">
            {savingSenders ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save senders
          </Button>
        </div>
      </section>

      <Separator className="mb-10" />

      {/* ═══════════ TRACKING ═══════════ */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="h-4 w-4 text-amber-500" />
          <h2 className="font-medium text-lg">Tracking & Analytics</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-5">Scripts are injected on the public site. Changes activate on next page load.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Google Analytics 4</Label>
            <Input value={ga4Id} onChange={e => setGa4Id(e.target.value)} placeholder="G-XXXXXXXXXX" className="font-mono text-xs" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Google Tag Manager</Label>
            <Input value={gtmId} onChange={e => setGtmId(e.target.value)} placeholder="GTM-XXXXXXX" className="font-mono text-xs" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Facebook Pixel ID</Label>
            <Input value={fbPixelId} onChange={e => setFbPixelId(e.target.value)} placeholder="123456789012345" className="font-mono text-xs" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Custom &lt;head&gt; scripts</Label>
            <Textarea value={customHeadScripts} onChange={e => setCustomHeadScripts(e.target.value)} placeholder="<script>..." rows={2} className="font-mono text-xs" />
          </div>
        </div>
        <Button onClick={saveTracking} disabled={savingTracking} size="sm" className="gap-1">
          {savingTracking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save tracking
        </Button>
        {(ga4Id || gtmId || fbPixelId) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {ga4Id && <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> GA4</span>}
            {gtmId && <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> GTM</span>}
            {fbPixelId && <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> FB Pixel</span>}
          </div>
        )}
      </section>

      <Separator className="mb-10" />

      {/* ═══════════ SMTP ═══════════ */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="h-4 w-4 text-amber-500" />
          <h2 className="font-medium text-lg">SMTP Configuration</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-5">Used to send outreach emails from the CRM.</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">SMTP Host</Label>
            <Input value={smtp.host} onChange={sf('host')} placeholder="smtp.gmail.com" className="text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Port</Label>
            <Input value={smtp.port} onChange={sf('port')} placeholder="587" className="text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Username</Label>
            <Input value={smtp.username} onChange={sf('username')} placeholder="you@domain.com" className="text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Password</Label>
            <div className="relative">
              <Input type={showSmtpPass ? 'text' : 'password'} value={smtp.password} onChange={sf('password')} placeholder="••••••••" className="pr-10 text-sm" />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowSmtpPass(p => !p)}>
                {showSmtpPass ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">From name</Label>
            <Input value={smtp.from_name} onChange={sf('from_name')} placeholder="Imba Marketing" className="text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">From email</Label>
            <Input value={smtp.from_email} onChange={sf('from_email')} placeholder="hello@imbamarketing.com" className="text-sm" />
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Switch id="smtp-secure" checked={smtp.secure} onCheckedChange={v => setSmtp(p => ({ ...p, secure: v }))} />
          <Label htmlFor="smtp-secure" className="font-normal text-sm">Use SSL/TLS (port 465)</Label>
        </div>
        {smtpTestResult && (
          <div className={`flex items-center gap-2 text-sm p-3 rounded mb-4 ${smtpTestResult.ok ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
            {smtpTestResult.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {smtpTestResult.message}
          </div>
        )}
        <div className="flex gap-2">
          <Button onClick={saveSmtp} disabled={savingSmtp} size="sm" className="gap-1">
            {savingSmtp ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save SMTP
          </Button>
          <Button variant="outline" size="sm" onClick={testSmtp} disabled={testingSmtp || !smtp.host || !smtp.username} className="gap-1">
            {testingSmtp ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />} Test
          </Button>
        </div>
      </section>

      <Separator className="mb-10" />

      {/* ═══════════ AI BEHAVIOR ═══════════ */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="h-4 w-4 text-amber-500" />
          <h2 className="font-medium text-lg">AI Behaviour</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-5">Control how AI generates content and processes data.</p>

        <div className="flex flex-col gap-5 mb-6">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Default email tone</Label>
            <Select value={aiTone} onValueChange={setAiTone}>
              <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['professional', 'casual', 'direct', 'consultative', 'enthusiastic'].map(t => (
                  <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="auto-enrich" checked={autoEnrich} onCheckedChange={setAutoEnrich} />
            <div>
              <Label htmlFor="auto-enrich" className="font-normal">Auto-enrich new leads</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Use AI to fill in missing data when leads are imported</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="auto-cat" checked={autoCategorize} onCheckedChange={setAutoCategorize} />
            <div>
              <Label htmlFor="auto-cat" className="font-normal">Auto-analyze inbox messages</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Automatically analyze sentiment & category when opening a message</p>
            </div>
          </div>
        </div>
      </section>

      <Separator className="mb-10" />

      {/* ═══════════ COMPANY PROFILE ═══════════ */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="h-4 w-4 text-amber-500" />
          <h2 className="font-medium text-lg">Company Profile</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-5">Injected into every AI prompt to personalize generated content.</p>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Company name</Label>
            <Input value={companyName} onChange={e => setCompanyName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Description</Label>
            <Input value={companyDesc} onChange={e => setCompanyDesc(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Unique selling point</Label>
            <Input value={usp} onChange={e => setUsp(e.target.value)} />
          </div>
        </div>
      </section>

      <Button onClick={saveAI} disabled={savingAI} className="gap-2">
        {savingAI ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save AI & Company Settings
      </Button>
    </div>
  )
}
