import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import toast from 'react-hot-toast'
import {
  Search, Sparkles, Loader2, Building2, Mail, Globe, Phone, Linkedin,
  CheckCircle2, Download, Star, Target, History, ChevronDown, ChevronUp,
  Users, SlidersHorizontal, Brain,
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
}

interface Prospect {
  company_name: string
  contact_name: string
  title: string
  email: string
  phone: string
  website: string
  linkedin_url: string
  industry: string
  company_size: string
  ai_score: number
  ai_summary: string
  match_reason: string
}

interface ICPConfig {
  industries: string
  companySize: string
  location: string
  revenueRange: string
  keySignals: string
  keywords: string
  prospectCount: number
}

interface SearchHistoryEntry {
  id?: string
  icp: ICPConfig
  provider_id: string
  model: string
  result_count: number
  created_at: string
}

// ── Constants ──────────────────────────────────────────

const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-1000', '1000+']
const REVENUE_RANGES = [
  'Under $1M',
  '$1M - $5M',
  '$5M - $20M',
  '$20M - $100M',
  '$100M - $500M',
  '$500M+',
]
const INDUSTRIES = [
  'E-commerce & Retail', 'SaaS & Tech', 'Real Estate', 'Healthcare',
  'Food & Beverage', 'Fashion & Beauty', 'Education & eLearning',
  'Finance & Fintech', 'Hospitality & Travel', 'Manufacturing',
  'Non-Profit', 'Legal & Professional Services', 'Entertainment & Media',
  'Automotive', 'Construction', 'Energy & Utilities', 'Logistics & Supply Chain',
  'Agriculture', 'Telecommunications', 'Other',
]

const DEFAULT_ICP: ICPConfig = {
  industries: '',
  companySize: '',
  location: '',
  revenueRange: '',
  keySignals: '',
  keywords: '',
  prospectCount: 10,
}

// ── AI Provider Call Helper ────────────────────────────

async function callAIProvider(
  provider: AIProvider,
  model: string,
  prompt: string,
): Promise<string> {
  const pid = provider.id

  if (pid === 'anthropic') {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': provider.api_key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-allow-browser': 'true',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error((err as { error?: { message?: string } }).error?.message || `Anthropic API error ${res.status}`)
    }
    const data = await res.json() as { content: Array<{ text: string }> }
    return data.content?.[0]?.text || ''
  }

  if (pid === 'openai' || pid === 'perplexity') {
    const baseUrl = pid === 'perplexity'
      ? 'https://api.perplexity.ai/chat/completions'
      : 'https://api.openai.com/v1/chat/completions'
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${provider.api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4096,
      }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error((err as { error?: { message?: string } }).error?.message || `${provider.name} API error ${res.status}`)
    }
    const data = await res.json() as { choices: Array<{ message: { content: string } }> }
    return data.choices?.[0]?.message?.content || ''
  }

  if (pid === 'ollama') {
    const base = provider.base_url || 'http://localhost:11434'
    const res = await fetch(`${base}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        stream: false,
      }),
    })
    if (!res.ok) throw new Error(`Ollama error ${res.status}`)
    const data = await res.json() as { message: { content: string } }
    return data.message?.content || ''
  }

  throw new Error(`Unsupported provider: ${pid}`)
}

function extractJSON<T>(text: string): T {
  const match = text.match(/[\[{][\s\S]*[\]}]/)
  if (!match) throw new Error('No JSON found in AI response')
  return JSON.parse(match[0]) as T
}

// ── Score color helper ─────────────────────────────────

function scoreColor(score: number): string {
  if (score > 70) return 'text-emerald-400'
  if (score >= 40) return 'text-amber-400'
  return 'text-red-400'
}

function scoreBg(score: number): string {
  if (score > 70) return 'bg-emerald-500/10'
  if (score >= 40) return 'bg-amber-500/10'
  return 'bg-red-500/10'
}

// ── Component ──────────────────────────────────────────

export default function AILeadSearcher() {
  // Providers
  const [providers, setProviders] = useState<AIProvider[]>([])
  const [selectedProviderId, setSelectedProviderId] = useState<string>('')
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [providersLoading, setProvidersLoading] = useState(true)

  // ICP Config
  const [icp, setIcp] = useState<ICPConfig>(DEFAULT_ICP)
  const [showIcpConfig, setShowIcpConfig] = useState(true)

  // Search state
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<Prospect[]>([])
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [imported, setImported] = useState<Set<number>>(new Set())
  const [importingAll, setImportingAll] = useState(false)
  const [importingSelected, setImportingSelected] = useState(false)

  // History
  const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>([])
  const [showHistory, setShowHistory] = useState(false)

  // ── Load providers + history on mount ────────────────

  const loadProviders = useCallback(async () => {
    setProvidersLoading(true)
    try {
      const { data, error } = await supabase
        .from('ai_providers')
        .select('*')
        .order('id')
      if (data?.length && !error) {
        const mapped: AIProvider[] = data.map(p => ({
          ...p,
          available_models: (p.available_models as string[] | null) || [],
        }))
        setProviders(mapped)

        const defaultProvider = mapped.find(p => p.enabled && p.default_model && p.api_key)
        if (defaultProvider) {
          setSelectedProviderId(defaultProvider.id)
          setSelectedModel(defaultProvider.default_model!)
        } else if (mapped.length) {
          const first = mapped.find(p => p.enabled && p.api_key) || mapped[0]
          setSelectedProviderId(first.id)
          if (first.default_model) setSelectedModel(first.default_model)
          else if (first.available_models.length) setSelectedModel(first.available_models[0])
        }
        setProvidersLoading(false)
        return
      }
    } catch { /* table may not exist */ }

    // Fallback: use localStorage Anthropic key
    const localKey = localStorage.getItem('anthropic_api_key') || ''
    const fallback: AIProvider[] = [{
      id: 'anthropic', name: 'Anthropic (Claude)', api_key: localKey, base_url: null,
      default_model: 'claude-sonnet-4-20250514',
      available_models: ['claude-opus-4-6', 'claude-sonnet-4-6', 'claude-sonnet-4-20250514', 'claude-haiku-4-5-20251001'],
      enabled: true,
    }]
    setProviders(fallback)
    if (localKey) {
      setSelectedProviderId('anthropic')
      setSelectedModel('claude-sonnet-4-20250514')
    }
    setProvidersLoading(false)
  }, [])

  const loadHistory = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('crm_prospect_searches')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
      if (data) {
        setSearchHistory(data.map(d => ({
          id: d.id,
          icp: d.icp as ICPConfig,
          provider_id: d.provider_id as string,
          model: d.model as string,
          result_count: d.result_count as number,
          created_at: d.created_at as string,
        })))
      }
    } catch { /* crm_prospect_searches table may not exist */ }
  }, [])

  useEffect(() => {
    loadProviders()
    loadHistory()
  }, [loadProviders, loadHistory])

  // ── Derived state ────────────────────────────────────

  const activeProvider = providers.find(p => p.id === selectedProviderId)
  const availableModels = activeProvider?.available_models || []

  // ── Handlers ─────────────────────────────────────────

  function handleProviderChange(providerId: string) {
    setSelectedProviderId(providerId)
    const provider = providers.find(p => p.id === providerId)
    if (provider?.default_model) {
      setSelectedModel(provider.default_model)
    } else if (provider?.available_models.length) {
      setSelectedModel(provider.available_models[0])
    } else {
      setSelectedModel('')
    }
  }

  function toggleSelect(idx: number) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  function toggleSelectAll() {
    if (selected.size === results.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(results.map((_, i) => i)))
    }
  }

  // ── Search ───────────────────────────────────────────

  async function search() {
    if (!activeProvider?.api_key) {
      toast.error('Select an AI provider with a valid API key in CRM Settings.')
      return
    }
    if (!selectedModel) {
      toast.error('Select a model to use.')
      return
    }
    if (!icp.industries && !icp.keywords) {
      toast.error('Provide at least an industry or keywords for the search.')
      return
    }

    setSearching(true)
    setResults([])
    setSelected(new Set())
    setImported(new Set())

    const prompt = `You are a B2B prospect researcher for Imba Marketing, an AI-powered marketing agency.

Find ${icp.prospectCount} potential business prospects matching this Ideal Customer Profile (ICP):

${icp.industries ? `- Industries: ${icp.industries}` : ''}
${icp.companySize ? `- Company size: ${icp.companySize} employees` : ''}
${icp.location ? `- Location: ${icp.location}` : ''}
${icp.revenueRange ? `- Revenue range: ${icp.revenueRange}` : ''}
${icp.keySignals ? `- Key signals: ${icp.keySignals}` : ''}
${icp.keywords ? `- Keywords: ${icp.keywords}` : ''}

For each prospect, provide:
- company_name: the company name
- contact_name: a decision-maker (CMO, CEO, VP Marketing, Head of Growth, etc.)
- title: their job title
- email: a realistic business email if findable (otherwise empty string)
- phone: international format phone (otherwise empty string)
- website: the company website URL
- linkedin_url: a LinkedIn profile URL (otherwise empty string)
- industry: their industry
- company_size: estimated employee count range
- ai_score: 1-100 score indicating how well they match the ICP and how likely they need AI marketing services
- ai_summary: 2-3 sentence summary of the company and why they are a good prospect
- match_reason: specific reason this prospect matches the ICP criteria

Return ONLY a valid JSON array. No markdown, no code blocks, no explanation — just the array.`

    try {
      const rawText = await callAIProvider(activeProvider, selectedModel, prompt)
      const prospects = extractJSON<Prospect[]>(rawText)

      // Normalize scores to numbers
      const normalized = prospects.map(p => ({
        ...p,
        ai_score: typeof p.ai_score === 'number' ? p.ai_score : parseInt(String(p.ai_score), 10) || 50,
      }))

      setResults(normalized)
      toast.success(`Found ${normalized.length} prospects`)

      // Save search to history table (may not exist if V006 not run)
      try {
        await supabase.from('crm_prospect_searches').insert({
          icp,
          provider_id: selectedProviderId,
          model: selectedModel,
          result_count: normalized.length,
        })
        loadHistory()
      } catch { /* table may not exist */ }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      toast.error(`AI search failed: ${msg}`)
    }

    setSearching(false)
  }

  // ── Import ───────────────────────────────────────────

  async function importProspects(indices: number[]) {
    const toImport = indices.filter(i => !imported.has(i))
    if (!toImport.length) {
      toast('All selected prospects have already been imported.')
      return
    }

    let successCount = 0
    for (const idx of toImport) {
      const p = results[idx]
      const { error } = await supabase.from('crm_leads').insert({
        company_name: p.company_name,
        contact_name: p.contact_name,
        title: p.title,
        email: p.email,
        phone: p.phone,
        website: p.website,
        linkedin_url: p.linkedin_url,
        industry: p.industry,
        company_size: p.company_size,
        ai_score: p.ai_score,
        ai_summary: p.ai_summary,
        source: 'ai_prospect_finder',
        status: 'new',
      })
      if (!error) {
        setImported(prev => new Set([...prev, idx]))
        successCount++
      }
    }

    toast.success(`${successCount} prospect${successCount !== 1 ? 's' : ''} imported to CRM`)
  }

  async function handleImportSelected() {
    setImportingSelected(true)
    await importProspects(Array.from(selected))
    setImportingSelected(false)
  }

  async function handleImportAll() {
    setImportingAll(true)
    await importProspects(results.map((_, i) => i))
    setImportingAll(false)
  }

  // ── Render ───────────────────────────────────────────

  if (providersLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <Target className="h-5 w-5 text-amber-500" />
        <h1 className="text-2xl font-semibold">AI Prospect Finder</h1>
      </div>
      <p className="text-muted-foreground text-sm mb-8">
        Define your Ideal Customer Profile, pick an AI provider, and discover high-quality prospects to import into your CRM.
      </p>

      {/* ═══════════ AI Provider Selector ═══════════ */}
      <div className="bg-card border border-border rounded-lg p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-4 w-4 text-amber-500" />
          <h2 className="font-medium">AI Provider</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Provider</Label>
            <Select value={selectedProviderId} onValueChange={handleProviderChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select provider..." />
              </SelectTrigger>
              <SelectContent>
                {providers.filter(p => p.enabled && p.api_key).map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {p.name}
                    </span>
                  </SelectItem>
                ))}
                {providers.filter(p => !p.enabled || !p.api_key).map(p => (
                  <SelectItem key={p.id} value={p.id} disabled>
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                      {p.name} (not configured)
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Model</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select model..." />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map(m => (
                  <SelectItem key={m} value={m} className="font-mono text-xs">{m}</SelectItem>
                ))}
                {!availableModels.length && (
                  <SelectItem value="_none" disabled className="text-xs">
                    No models available — configure in Settings
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        {!providers.some(p => p.enabled && p.api_key) && (
          <p className="text-xs text-red-400 mt-3">
            No AI providers configured. Go to CRM Settings to add an API key.
          </p>
        )}
      </div>

      {/* ═══════════ ICP Configuration ═══════════ */}
      <div className="bg-card border border-border rounded-lg mb-6">
        <button
          className="w-full flex items-center justify-between p-5 text-left"
          onClick={() => setShowIcpConfig(prev => !prev)}
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-amber-500" />
            <h2 className="font-medium">Ideal Customer Profile (ICP)</h2>
          </div>
          {showIcpConfig
            ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
            : <ChevronDown className="h-4 w-4 text-muted-foreground" />
          }
        </button>

        {showIcpConfig && (
          <div className="px-5 pb-5 pt-0">
            <Separator className="mb-5" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
              {/* Industry */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Industry</Label>
                <Select
                  value={icp.industries}
                  onValueChange={v => setIcp(p => ({ ...p, industries: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry..." />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map(ind => (
                      <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Or type multiple below in keywords</p>
              </div>

              {/* Company Size */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Company Size</Label>
                <Select
                  value={icp.companySize}
                  onValueChange={v => setIcp(p => ({ ...p, companySize: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any size" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_SIZES.map(s => (
                      <SelectItem key={s} value={s}>{s} employees</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Location</Label>
                <Input
                  value={icp.location}
                  onChange={e => setIcp(p => ({ ...p, location: e.target.value }))}
                  placeholder="US, Germany, UK, Global..."
                />
              </div>

              {/* Revenue Range */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Revenue Range</Label>
                <Select
                  value={icp.revenueRange}
                  onValueChange={v => setIcp(p => ({ ...p, revenueRange: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any revenue" />
                  </SelectTrigger>
                  <SelectContent>
                    {REVENUE_RANGES.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Key Signals */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Key Signals</Label>
                <Input
                  value={icp.keySignals}
                  onChange={e => setIcp(p => ({ ...p, keySignals: e.target.value }))}
                  placeholder="Recently raised funding, hiring for marketing..."
                />
              </div>

              {/* Keywords */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs">Keywords</Label>
                <Input
                  value={icp.keywords}
                  onChange={e => setIcp(p => ({ ...p, keywords: e.target.value }))}
                  placeholder="DTC, B2B SaaS, startup, growth-stage..."
                />
              </div>
            </div>

            {/* Prospect Count Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Number of prospects to find</Label>
                <span className="text-sm font-mono font-medium text-amber-500">{icp.prospectCount}</span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                step={5}
                value={icp.prospectCount}
                onChange={e => setIcp(p => ({ ...p, prospectCount: parseInt(e.target.value, 10) }))}
                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5</span>
                <span>25</span>
                <span>50</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Button */}
      <div className="mb-8">
        <Button
          onClick={search}
          disabled={searching}
          className="gap-2 bg-amber-500 hover:bg-amber-600 text-black"
          size="lg"
        >
          {searching
            ? <><Loader2 className="h-4 w-4 animate-spin" />Searching with {activeProvider?.name || 'AI'}...</>
            : <><Sparkles className="h-4 w-4" />Find Prospects with AI</>
          }
        </Button>
      </div>

      {/* ═══════════ Results Table ═══════════ */}
      {results.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-amber-500" />
              <p className="text-sm font-medium">
                {results.length} prospects found
              </p>
              <Badge variant="secondary" className="text-xs">
                {imported.size} imported
              </Badge>
              {selected.size > 0 && (
                <Badge variant="outline" className="text-xs text-amber-400 border-amber-400/30">
                  {selected.size} selected
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleImportSelected}
                disabled={importingSelected || selected.size === 0}
                className="gap-1.5"
              >
                {importingSelected
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Download className="h-3.5 w-3.5" />
                }
                Import Selected ({selected.size})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleImportAll}
                disabled={importingAll || imported.size === results.length}
                className="gap-1.5"
              >
                {importingAll
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Download className="h-3.5 w-3.5" />
                }
                Import All
              </Button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={selected.size === results.length && results.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-16">Score</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="hidden lg:table-cell">Industry</TableHead>
                  <TableHead className="hidden lg:table-cell">Size</TableHead>
                  <TableHead className="hidden xl:table-cell">Links</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((prospect, idx) => (
                  <TableRow
                    key={idx}
                    className={imported.has(idx) ? 'bg-emerald-500/5' : ''}
                  >
                    {/* Checkbox */}
                    <TableCell>
                      <Checkbox
                        checked={selected.has(idx)}
                        onCheckedChange={() => toggleSelect(idx)}
                        disabled={imported.has(idx)}
                      />
                    </TableCell>

                    {/* Score */}
                    <TableCell>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded ${scoreBg(prospect.ai_score)}`}>
                        <Star className={`h-3 w-3 ${scoreColor(prospect.ai_score)}`} />
                        <span className={`text-sm font-mono font-semibold ${scoreColor(prospect.ai_score)}`}>
                          {prospect.ai_score}
                        </span>
                      </div>
                    </TableCell>

                    {/* Company */}
                    <TableCell>
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-md bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Building2 className="h-3.5 w-3.5 text-amber-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{prospect.company_name}</p>
                          {prospect.website && (
                            <a
                              href={prospect.website.startsWith('http') ? prospect.website : `https://${prospect.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-amber-500 hover:underline truncate block"
                            >
                              {prospect.website}
                            </a>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Contact */}
                    <TableCell>
                      <p className="text-sm font-medium">{prospect.contact_name}</p>
                      <p className="text-xs text-muted-foreground">{prospect.title}</p>
                      {prospect.email && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Mail className="h-2.5 w-2.5" />
                          {prospect.email}
                        </span>
                      )}
                      {prospect.phone && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="h-2.5 w-2.5" />
                          {prospect.phone}
                        </span>
                      )}
                    </TableCell>

                    {/* Industry */}
                    <TableCell className="hidden lg:table-cell">
                      <Badge variant="secondary" className="text-xs">{prospect.industry}</Badge>
                    </TableCell>

                    {/* Size */}
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-xs text-muted-foreground">{prospect.company_size}</span>
                    </TableCell>

                    {/* Links */}
                    <TableCell className="hidden xl:table-cell">
                      <div className="flex items-center gap-2">
                        {prospect.website && (
                          <a
                            href={prospect.website.startsWith('http') ? prospect.website : `https://${prospect.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                            title="Website"
                          >
                            <Globe className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {prospect.linkedin_url && (
                          <a
                            href={prospect.linkedin_url.startsWith('http') ? prospect.linkedin_url : `https://${prospect.linkedin_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-blue-400"
                            title="LinkedIn"
                          >
                            <Linkedin className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      {imported.has(idx) ? (
                        <Badge variant="outline" className="text-emerald-400 border-emerald-400/30 text-xs gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Imported
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs gap-1 text-amber-500 hover:text-amber-400"
                          onClick={() => importProspects([idx])}
                        >
                          <Download className="h-3 w-3" /> Import
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Expanded detail — AI Summary for each */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
            {results.map((prospect, idx) => (
              <div
                key={idx}
                className={`border rounded-lg p-4 text-sm transition-colors ${
                  imported.has(idx) ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-border'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-xs flex items-center gap-1.5">
                    <Building2 className="h-3 w-3 text-amber-500" />
                    {prospect.company_name}
                  </span>
                  <span className={`text-xs font-mono ${scoreColor(prospect.ai_score)}`}>
                    Score: {prospect.ai_score}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                  {prospect.ai_summary}
                </p>
                {prospect.match_reason && (
                  <p className="text-xs text-amber-500/80 leading-relaxed">
                    <span className="font-medium">Match:</span> {prospect.match_reason}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════ Search History ═══════════ */}
      {searchHistory.length > 0 && (
        <div className="mt-8">
          <Separator className="mb-6" />
          <button
            className="w-full flex items-center justify-between mb-4"
            onClick={() => setShowHistory(prev => !prev)}
          >
            <div className="flex items-center gap-2">
              <History className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground/50">
                Recent Searches ({searchHistory.length})
              </p>
            </div>
            {showHistory
              ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
              : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            }
          </button>

          {showHistory && (
            <div className="flex flex-col gap-2">
              {searchHistory.map((entry, i) => {
                const icpData = entry.icp
                const label = [
                  icpData?.industries,
                  icpData?.location,
                  icpData?.companySize ? `${icpData.companySize} emp` : null,
                ].filter(Boolean).join(' / ') || 'General search'

                return (
                  <div
                    key={entry.id || i}
                    className="flex items-center justify-between text-sm text-muted-foreground bg-card border border-border rounded-lg px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <Search className="h-3.5 w-3.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm">{label}</p>
                        <p className="text-xs text-muted-foreground/60">
                          {entry.provider_id} / {entry.model}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs">{entry.result_count} prospects</p>
                      <p className="text-xs text-muted-foreground/60">
                        {new Date(entry.created_at).toLocaleDateString()} {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
