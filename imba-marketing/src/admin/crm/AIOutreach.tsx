import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { callAI as callAIShared, loadAIProviders, type AIProvider } from '@/lib/ai'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import toast from 'react-hot-toast'
import {
  Mail, Sparkles, Loader2, Send, CheckCircle2,
  Pencil, Trash2, RefreshCw, Building2, Copy, Check,
  XCircle, ChevronDown, ChevronUp, Clock, MailOpen, MessageSquare,
  AlertTriangle, Zap, Users,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────

interface CRMLead {
  id: string
  company_name: string
  contact_name: string
  email: string
  industry: string
  ai_score: number
  ai_summary: string
}

interface SenderAccount {
  email: string
  name: string
  is_default: boolean
}

interface CompanyProfile {
  company_name?: string
  company_description?: string
  usp?: string
}

interface OutreachEmail {
  id: string
  lead_id: string
  subject: string
  body: string
  status: string
  ai_generated: boolean
  from_email: string | null
  rejection_reason: string | null
  sent_at: string | null
  created_at: string
  crm_leads?: { id: string; company_name: string; contact_name: string; email: string; ai_score?: number; industry?: string } | null
}

interface EmailEvent {
  id: string
  email_id: string
  event_type: string
  metadata: Record<string, unknown> | null
  created_at: string
}

type TabId = 'queue' | 'approved' | 'sent' | 'all'

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'queue', label: 'Queue', icon: <Clock className="h-3.5 w-3.5" /> },
  { id: 'approved', label: 'Approved', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  { id: 'sent', label: 'Sent', icon: <Send className="h-3.5 w-3.5" /> },
  { id: 'all', label: 'All', icon: <Mail className="h-3.5 w-3.5" /> },
]

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  draft:    { label: 'Draft',    color: 'text-muted-foreground', bg: 'bg-zinc-500/10' },
  approved: { label: 'Approved', color: 'text-blue-400',         bg: 'bg-blue-500/10' },
  sent:     { label: 'Sent',     color: 'text-emerald-400',      bg: 'bg-emerald-500/10' },
  opened:   { label: 'Opened',   color: 'text-cyan-400',         bg: 'bg-cyan-500/10' },
  replied:  { label: 'Replied',  color: 'text-purple-400',       bg: 'bg-purple-500/10' },
  bounced:  { label: 'Bounced',  color: 'text-red-400',          bg: 'bg-red-500/10' },
  rejected: { label: 'Rejected', color: 'text-orange-400',       bg: 'bg-orange-500/10' },
}

const EMAIL_TEMPLATE_TYPES = [
  { value: 'cold_outreach', label: 'Cold Outreach' },
  { value: 'follow_up', label: 'Follow-up' },
  { value: 're_engagement', label: 'Re-engagement' },
  { value: 'meeting_request', label: 'Meeting Request' },
]

function parseEmailJSON(text: string): { subject: string; body: string } {
  // Try direct parse
  try { return JSON.parse(text.trim()) } catch { /* continue */ }
  // Strip markdown code blocks
  const stripped = text.replace(/```(?:json)?\s*/g, '').replace(/```\s*/g, '').trim()
  try { return JSON.parse(stripped) } catch { /* continue */ }
  // Extract JSON object
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON found in AI response')
  return JSON.parse(match[0])
}

// ── Component ─────────────────────────────────────────

export default function AIOutreach() {
  const [activeTab, setActiveTab] = useState<TabId>('queue')
  const [leads, setLeads] = useState<CRMLead[]>([])
  const [emails, setEmails] = useState<OutreachEmail[]>([])
  const [providers, setProviders] = useState<AIProvider[]>([])
  const [senderAccounts, setSenderAccounts] = useState<SenderAccount[]>([])
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({})
  const [aiTone, setAiTone] = useState('professional')
  const [loading, setLoading] = useState(true)
  const [emailEvents, setEmailEvents] = useState<Record<string, EmailEvent[]>>({})

  // Generate dialog state
  const [generateOpen, setGenerateOpen] = useState(false)
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [selectedProvider, setSelectedProvider] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedSender, setSelectedSender] = useState('')
  const [templateType, setTemplateType] = useState('cold_outreach')
  const [customInstructions, setCustomInstructions] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generateProgress, setGenerateProgress] = useState({ current: 0, total: 0 })

  // Edit dialog state
  const [editDialog, setEditDialog] = useState<OutreachEmail | null>(null)
  const [editSubject, setEditSubject] = useState('')
  const [editBody, setEditBody] = useState('')
  const [editFrom, setEditFrom] = useState('')
  const [editSaving, setEditSaving] = useState(false)

  // Reject dialog state
  const [rejectDialog, setRejectDialog] = useState<OutreachEmail | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  // Expanded emails for sent view
  const [expandedEmails, setExpandedEmails] = useState<Set<string>>(new Set())

  // Sending state
  const [sendingId, setSendingId] = useState<string | null>(null)
  const [sendingAll, setSendingAll] = useState(false)

  // Clipboard
  const [copied, setCopied] = useState<string | null>(null)

  // ── Data loading ─────────────────────────────────────

  const load = useCallback(async () => {
    setLoading(true)

    // These tables always exist
    const [leadsRes, emailsRes] = await Promise.all([
      supabase.from('crm_leads').select('id,company_name,contact_name,email,industry,ai_score,ai_summary').order('created_at', { ascending: false }),
      supabase.from('crm_outreach_emails').select('*, crm_leads(id,company_name,contact_name,email,ai_score,industry)').order('created_at', { ascending: false }),
    ])
    setLeads((leadsRes.data as CRMLead[]) || [])
    setEmails((emailsRes.data as OutreachEmail[]) || [])

    // AI providers (V006 — may not exist)
    try {
      const providersRes = await supabase.from('ai_providers').select('*').eq('enabled', true).order('id')
      if (providersRes.data?.length) {
        setProviders(providersRes.data.map(p => ({
          ...p,
          available_models: (p.available_models as string[] | null) || [],
        })))
      }
    } catch {
      // Fallback: use shared provider loader
      const loaded = await loadAIProviders()
      setProviders(loaded)
    }

    // CRM settings (may not exist)
    try {
      const [sendersRes, profileRes, toneRes] = await Promise.all([
        supabase.from('crm_ai_settings').select('value').eq('key', 'sender_accounts').maybeSingle(),
        supabase.from('crm_ai_settings').select('value').eq('key', 'company_profile').maybeSingle(),
        supabase.from('crm_ai_settings').select('value').eq('key', 'ai_outreach_tone').maybeSingle(),
      ])

      if (sendersRes.data?.value) {
        const accs = sendersRes.data.value as SenderAccount[]
        setSenderAccounts(accs)
        const defaultAcc = accs.find(a => a.is_default) || accs[0]
        if (defaultAcc) setSelectedSender(defaultAcc.email)
      }

      if (profileRes.data?.value) {
        setCompanyProfile(profileRes.data.value as CompanyProfile)
      }

      if (toneRes.data?.value) {
        setAiTone(toneRes.data.value as string)
      }
    } catch { /* crm_ai_settings may not exist */ }

    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function loadEmailEvents(emailId: string) {
    if (emailEvents[emailId]) return
    const { data } = await supabase
      .from('crm_email_events')
      .select('*')
      .eq('email_id', emailId)
      .order('created_at', { ascending: true })
    if (data) {
      setEmailEvents(prev => ({ ...prev, [emailId]: data as EmailEvent[] }))
    }
  }

  // ── Computed data ────────────────────────────────────

  const drafts = emails.filter(e => e.status === 'draft')
  const approved = emails.filter(e => e.status === 'approved')
  const sentGroup = emails.filter(e => ['sent', 'opened', 'replied', 'bounced'].includes(e.status))
  const totalSent = sentGroup.length
  const totalOpened = emails.filter(e => e.status === 'opened' || e.status === 'replied').length
  const totalReplied = emails.filter(e => e.status === 'replied').length
  const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0
  const replyRate = totalSent > 0 ? Math.round((totalReplied / totalSent) * 100) : 0

  const leadsWithoutDraft = leads.filter(l => !emails.some(e => e.lead_id === l.id && e.status === 'draft'))

  function getFilteredEmails(): OutreachEmail[] {
    switch (activeTab) {
      case 'queue': return drafts
      case 'approved': return approved
      case 'sent': return sentGroup
      case 'all': return emails
    }
  }

  // ── Build AI prompt ──────────────────────────────────

  function buildPrompt(lead: CRMLead, type: string, tone: string, profile: CompanyProfile, instructions: string): string {
    const companyInfo = profile.company_name
      ? `Company: ${profile.company_name}. ${profile.company_description || ''} USP: ${profile.usp || ''}`
      : 'Company: Imba Marketing, an AI-powered marketing agency delivering smarter campaigns and real results.'

    const templateInstructions: Record<string, string> = {
      cold_outreach: `Write a personalized cold outreach email. Mention a specific pain point for their industry. Include one concrete result (invent a plausible example). CTA: reply or book a 15-min call. Max 120 words body.`,
      follow_up: `Write a follow-up email to someone who hasn't replied to a previous outreach. Be brief, add new value (a relevant insight or resource), and include a soft CTA. Max 100 words body.`,
      re_engagement: `Write a re-engagement email to a lead who went cold. Acknowledge time passed, share something new or relevant, and invite them to reconnect. Warm, non-pushy tone. Max 100 words body.`,
      meeting_request: `Write a meeting request email. Be specific about what the meeting would cover and the value for them. Suggest a concrete time frame. Max 100 words body.`,
    }

    return `You are writing an outreach email on behalf of: ${companyInfo}

Target lead:
- Name: ${lead.contact_name || 'the team'}
- Company: ${lead.company_name}
- Industry: ${lead.industry || 'Technology'}
- Context: ${lead.ai_summary || 'A growing company that could benefit from AI marketing systems.'}

Tone: ${tone}

Template type: ${type}
${templateInstructions[type] || templateInstructions.cold_outreach}

${instructions ? `Additional instructions: ${instructions}` : ''}

Requirements:
- Professional but human tone matching the "${tone}" style
- Non-generic subject line (no "quick question" or "hope you're well")
- Plain text body with \\n for line breaks

Return ONLY valid JSON (no markdown, no code fences):
{"subject": "string", "body": "string (plain text, \\n for line breaks)"}`
  }

  // ── Generate emails ──────────────────────────────────

  async function handleGenerate() {
    if (selectedLeads.length === 0) { toast.error('Select at least one lead.'); return }
    if (!selectedProvider) { toast.error('Select an AI provider.'); return }
    if (!selectedModel) { toast.error('Select a model.'); return }

    const provider = providers.find(p => p.id === selectedProvider)
    if (!provider) { toast.error('Provider not found.'); return }

    setGenerating(true)
    setGenerateProgress({ current: 0, total: selectedLeads.length })

    let successCount = 0
    for (const leadId of selectedLeads) {
      const lead = leads.find(l => l.id === leadId)
      if (!lead) continue

      try {
        const prompt = buildPrompt(lead, templateType, aiTone, companyProfile, customInstructions)
        const responseText = await callAIShared(provider, selectedModel, prompt, 'You are an expert B2B email copywriter. Return ONLY valid JSON — no markdown, no code blocks.')
        const { subject, body } = parseEmailJSON(responseText)

        await supabase.from('crm_outreach_emails').insert({
          lead_id: lead.id,
          subject,
          body,
          status: 'draft',
          ai_generated: true,
          from_email: selectedSender || null,
        })

        successCount++
        setGenerateProgress(prev => ({ ...prev, current: prev.current + 1 }))
      } catch (err) {
        console.error(`Failed to generate email for ${lead.company_name}:`, err)
        toast.error(`Failed for ${lead.company_name}`)
        setGenerateProgress(prev => ({ ...prev, current: prev.current + 1 }))
      }
    }

    setGenerating(false)
    setGenerateOpen(false)
    setSelectedLeads([])
    setCustomInstructions('')
    if (successCount > 0) {
      toast.success(`${successCount} email draft${successCount > 1 ? 's' : ''} created`)
      load()
    }
  }

  // ── Email actions ────────────────────────────────────

  async function approveEmail(id: string) {
    await supabase.from('crm_outreach_emails').update({ status: 'approved' }).eq('id', id)
    setEmails(prev => prev.map(e => e.id === id ? { ...e, status: 'approved' } : e))
    toast.success('Email approved')
  }

  async function approveAll() {
    const ids = drafts.map(e => e.id)
    if (ids.length === 0) return
    await supabase.from('crm_outreach_emails').update({ status: 'approved' }).in('id', ids)
    setEmails(prev => prev.map(e => ids.includes(e.id) ? { ...e, status: 'approved' } : e))
    toast.success(`${ids.length} emails approved`)
  }

  async function rejectEmail() {
    if (!rejectDialog) return
    await supabase.from('crm_outreach_emails').update({
      status: 'rejected',
      rejection_reason: rejectReason || null,
    }).eq('id', rejectDialog.id)
    setEmails(prev => prev.map(e => e.id === rejectDialog.id ? { ...e, status: 'rejected', rejection_reason: rejectReason } : e))
    setRejectDialog(null)
    setRejectReason('')
    toast.success('Email rejected')
  }

  async function deleteEmail(id: string) {
    if (!confirm('Delete this email?')) return
    await supabase.from('crm_outreach_emails').delete().eq('id', id)
    setEmails(prev => prev.filter(e => e.id !== id))
    toast.success('Deleted')
  }

  async function deleteAllDrafts() {
    if (!confirm(`Delete all ${drafts.length} drafts?`)) return
    const ids = drafts.map(e => e.id)
    await supabase.from('crm_outreach_emails').delete().in('id', ids)
    setEmails(prev => prev.filter(e => !ids.includes(e.id)))
    toast.success(`${ids.length} drafts deleted`)
  }

  async function sendEmail(email: OutreachEmail) {
    setSendingId(email.id)
    const toEmail = email.crm_leads?.email
    if (!toEmail) { toast.error('Lead has no email address.'); setSendingId(null); return }

    try {
      // Load SMTP config from settings
      const { data: smtpRow } = await supabase
        .from('crm_ai_settings')
        .select('value')
        .eq('key', 'smtp_config')
        .maybeSingle()

      const smtp = smtpRow?.value as { host: string; port: string; secure: boolean; username: string; password: string; from_name: string; from_email: string } | null

      if (!smtp?.host) {
        toast.error('SMTP not configured. Go to Settings to set up email sending.')
        setSendingId(null)
        return
      }

      // Use sender from email or SMTP default
      const fromEmail = email.from_email || smtp.from_email
      const senderName = senderAccounts.find(a => a.email === fromEmail)?.name || smtp.from_name

      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: toEmail,
          to_name: email.crm_leads?.contact_name,
          subject: email.subject,
          body: email.body,
          smtp: { ...smtp, from_email: fromEmail, from_name: senderName },
        },
      })

      if (!error) {
        await supabase.from('crm_outreach_emails').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', email.id)
        setEmails(prev => prev.map(e => e.id === email.id ? { ...e, status: 'sent', sent_at: new Date().toISOString() } : e))
        toast.success(`Email sent to ${toEmail}!`)
        setSendingId(null)
        return
      } else {
        toast.error(`Send failed: ${error.message}`)
      }
    } catch {
      // Edge function not available — fallback to mailto
    }

    // Fallback: open mailto
    window.open(`mailto:${toEmail}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`)
    await supabase.from('crm_outreach_emails').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', email.id)
    setEmails(prev => prev.map(e => e.id === email.id ? { ...e, status: 'sent', sent_at: new Date().toISOString() } : e))
    toast('Opened in your mail client — marked as sent.', { icon: '✉️' })
    setSendingId(null)
  }

  async function sendAll() {
    if (approved.length === 0) return
    if (!confirm(`Send all ${approved.length} approved emails?`)) return
    setSendingAll(true)
    let sent = 0
    for (const email of approved) {
      await sendEmail(email)
      sent++
    }
    setSendingAll(false)
    if (sent > 0) load()
  }

  async function markStatus(id: string, status: string) {
    await supabase.from('crm_outreach_emails').update({ status }).eq('id', id)
    setEmails(prev => prev.map(e => e.id === id ? { ...e, status } : e))
    toast.success(`Marked as ${status}`)
  }

  // ── Edit & save ──────────────────────────────────────

  function openEditDialog(email: OutreachEmail) {
    setEditDialog(email)
    setEditSubject(email.subject)
    setEditBody(email.body)
    setEditFrom(email.from_email || '')
  }

  async function saveEdit(andApprove: boolean) {
    if (!editDialog) return
    setEditSaving(true)
    const update: Record<string, unknown> = {
      subject: editSubject,
      body: editBody,
      from_email: editFrom || null,
    }
    if (andApprove) update.status = 'approved'
    await supabase.from('crm_outreach_emails').update(update).eq('id', editDialog.id)
    setEditDialog(null)
    setEditSaving(false)
    toast.success(andApprove ? 'Saved & approved' : 'Saved')
    load()
  }

  function copyEmail(email: OutreachEmail) {
    navigator.clipboard.writeText(`Subject: ${email.subject}\n\n${email.body}`)
    setCopied(email.id)
    setTimeout(() => setCopied(null), 2000)
  }

  function toggleExpand(id: string) {
    setExpandedEmails(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else {
        next.add(id)
        loadEmailEvents(id)
      }
      return next
    })
  }

  // ── Provider/model helpers ───────────────────────────

  const activeProvider = providers.find(p => p.id === selectedProvider)
  const availableModels = activeProvider?.available_models || []

  useEffect(() => {
    if (selectedProvider && activeProvider?.default_model) {
      setSelectedModel(activeProvider.default_model)
    } else if (selectedProvider && availableModels.length > 0) {
      setSelectedModel(availableModels[0])
    } else {
      setSelectedModel('')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvider])

  // ── Render helpers ───────────────────────────────────

  function renderStatusBadge(status: string) {
    const meta = STATUS_META[status] || STATUS_META.draft
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${meta.color} ${meta.bg}`}>
        {status === 'sent' && <Send className="h-2.5 w-2.5" />}
        {status === 'opened' && <MailOpen className="h-2.5 w-2.5" />}
        {status === 'replied' && <MessageSquare className="h-2.5 w-2.5" />}
        {status === 'bounced' && <AlertTriangle className="h-2.5 w-2.5" />}
        {status === 'draft' && <Pencil className="h-2.5 w-2.5" />}
        {status === 'approved' && <CheckCircle2 className="h-2.5 w-2.5" />}
        {status === 'rejected' && <XCircle className="h-2.5 w-2.5" />}
        {meta.label}
      </span>
    )
  }

  // ── Render: Stats Bar ────────────────────────────────

  function renderStatsBar() {
    const stats = [
      { label: 'Drafts', value: drafts.length, color: 'text-muted-foreground' },
      { label: 'Approved', value: approved.length, color: 'text-blue-400' },
      { label: 'Sent', value: totalSent, color: 'text-emerald-400' },
      { label: 'Open Rate', value: `${openRate}%`, color: 'text-cyan-400' },
      { label: 'Reply Rate', value: `${replyRate}%`, color: 'text-purple-400' },
    ]

    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-card border border-border rounded-lg px-4 py-3">
            <p className={`text-2xl font-mono font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    )
  }

  // ── Render: Queue tab (draft emails) ─────────────────

  function renderQueueCard(email: OutreachEmail) {
    const lead = email.crm_leads
    return (
      <div key={email.id} className="bg-card border border-border rounded-lg p-5 hover:border-border/60 transition-all">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <Building2 className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
            <span className="text-sm font-medium">{lead?.company_name || '—'}</span>
            {lead?.contact_name && <span className="text-xs text-muted-foreground">({lead.contact_name})</span>}
            {lead?.ai_score != null && (
              <Badge variant="secondary" className="text-xs py-0 h-5 font-mono">{lead.ai_score}</Badge>
            )}
            {email.ai_generated && (
              <Badge variant="secondary" className="text-xs gap-1 py-0 h-5">
                <Sparkles className="h-2.5 w-2.5" /> AI
              </Badge>
            )}
          </div>
          {renderStatusBadge(email.status)}
        </div>

        {/* Subject */}
        <p className="font-medium text-sm mb-1">{email.subject}</p>

        {/* Body preview */}
        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed whitespace-pre-line mb-1">{email.body}</p>

        {/* From */}
        {email.from_email && (
          <p className="text-xs text-muted-foreground mt-2">From: {email.from_email}</p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border flex-wrap">
          <Button size="sm" className="h-7 text-xs gap-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20"
            onClick={() => approveEmail(email.id)}>
            <CheckCircle2 className="h-3 w-3" /> Approve
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => openEditDialog(email)}>
            <Pencil className="h-3 w-3" /> Edit
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-orange-400" onClick={() => { setRejectDialog(email); setRejectReason('') }}>
            <XCircle className="h-3 w-3" /> Reject
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => copyEmail(email)}>
            {copied === email.id ? <><Check className="h-3 w-3 text-emerald-400" />Copied</> : <><Copy className="h-3 w-3" />Copy</>}
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => deleteEmail(email.id)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    )
  }

  // ── Render: Approved tab ─────────────────────────────

  function renderApprovedCard(email: OutreachEmail) {
    const lead = email.crm_leads
    return (
      <div key={email.id} className="bg-card border border-blue-500/20 rounded-lg p-5 hover:border-blue-500/30 transition-all">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Building2 className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
              <span className="text-sm font-medium">{lead?.company_name || '—'}</span>
              <span className="text-xs text-muted-foreground">{lead?.email}</span>
            </div>
            <p className="font-medium text-sm mb-1">{email.subject}</p>
            {email.from_email && (
              <p className="text-xs text-muted-foreground">From: {email.from_email}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">Approved {email.created_at ? new Date(email.created_at).toLocaleDateString() : ''}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => openEditDialog(email)}>
              <Pencil className="h-3 w-3" /> Edit
            </Button>
            <Button size="sm" className="h-7 text-xs gap-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
              disabled={sendingId === email.id} onClick={() => sendEmail(email)}>
              {sendingId === email.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />} Send
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ── Render: Sent tab ─────────────────────────────────

  function renderSentRow(email: OutreachEmail) {
    const lead = email.crm_leads
    const isExpanded = expandedEmails.has(email.id)
    const events = emailEvents[email.id] || []

    return (
      <div key={email.id} className="bg-card border border-border rounded-lg overflow-hidden transition-all">
        <button
          className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-muted/30 transition-colors"
          onClick={() => toggleExpand(email.id)}
        >
          <div className="min-w-0 flex-1 grid grid-cols-[1fr_1.5fr_auto_auto_auto] gap-4 items-center">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{lead?.company_name || '—'}</p>
              <p className="text-xs text-muted-foreground truncate">{lead?.contact_name}</p>
            </div>
            <p className="text-sm truncate">{email.subject}</p>
            <p className="text-xs text-muted-foreground whitespace-nowrap">{email.from_email || '—'}</p>
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              {email.sent_at ? new Date(email.sent_at).toLocaleDateString() : '—'}
            </p>
            {renderStatusBadge(email.status)}
          </div>
          {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
        </button>

        {isExpanded && (
          <div className="px-5 pb-5 border-t border-border">
            {/* Full body */}
            <div className="mt-4 mb-4">
              <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground/50 mb-2">Email body</p>
              <div className="bg-muted/30 rounded-md p-4 text-sm leading-relaxed whitespace-pre-line">{email.body}</div>
            </div>

            {/* Status actions */}
            <div className="flex items-center gap-2 mb-4">
              {email.status === 'sent' && (
                <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-cyan-400" onClick={() => markStatus(email.id, 'opened')}>
                  <MailOpen className="h-3 w-3" /> Mark opened
                </Button>
              )}
              {email.status === 'opened' && (
                <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-purple-400" onClick={() => markStatus(email.id, 'replied')}>
                  <MessageSquare className="h-3 w-3" /> Mark replied
                </Button>
              )}
              {(email.status === 'sent' || email.status === 'opened') && (
                <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-red-400" onClick={() => markStatus(email.id, 'bounced')}>
                  <AlertTriangle className="h-3 w-3" /> Mark bounced
                </Button>
              )}
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => copyEmail(email)}>
                {copied === email.id ? <><Check className="h-3 w-3 text-emerald-400" />Copied</> : <><Copy className="h-3 w-3" />Copy</>}
              </Button>
            </div>

            {/* Activity timeline */}
            {events.length > 0 && (
              <div>
                <p className="text-xs font-mono tracking-widest uppercase text-muted-foreground/50 mb-2">Activity</p>
                <div className="space-y-2">
                  {events.map(evt => (
                    <div key={evt.id} className="flex items-center gap-3 text-xs">
                      <span className="text-muted-foreground w-32 flex-shrink-0">
                        {new Date(evt.created_at).toLocaleString()}
                      </span>
                      {renderStatusBadge(evt.event_type)}
                      {evt.metadata && Object.keys(evt.metadata).length > 0 && (
                        <span className="text-muted-foreground">{JSON.stringify(evt.metadata)}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {events.length === 0 && (
              <p className="text-xs text-muted-foreground">No tracking events yet.</p>
            )}
          </div>
        )}
      </div>
    )
  }

  // ── Render: All tab ──────────────────────────────────

  function renderAllCard(email: OutreachEmail) {
    const lead = email.crm_leads
    return (
      <div key={email.id} className="bg-card border border-border rounded-lg p-4 hover:border-border/60 transition-all">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Building2 className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
              <span className="text-sm font-medium">{lead?.company_name || '—'}</span>
              <span className="text-xs text-muted-foreground">{lead?.email}</span>
              {email.ai_generated && (
                <Badge variant="secondary" className="text-xs gap-1 py-0 h-5">
                  <Sparkles className="h-2.5 w-2.5" /> AI
                </Badge>
              )}
            </div>
            <p className="font-medium text-sm mb-0.5">{email.subject}</p>
            <p className="text-xs text-muted-foreground line-clamp-1">{email.body}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {email.sent_at ? `Sent ${new Date(email.sent_at).toLocaleDateString()}` : `Created ${new Date(email.created_at).toLocaleDateString()}`}
              {email.from_email ? ` · From: ${email.from_email}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {renderStatusBadge(email.status)}
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => copyEmail(email)}>
              {copied === email.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            </Button>
            {email.status === 'draft' && (
              <Button size="sm" className="h-7 text-xs gap-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20"
                onClick={() => approveEmail(email.id)}>
                <CheckCircle2 className="h-3 w-3" /> Approve
              </Button>
            )}
            {email.status === 'approved' && (
              <Button size="sm" className="h-7 text-xs gap-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                disabled={sendingId === email.id} onClick={() => sendEmail(email)}>
                {sendingId === email.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />} Send
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => deleteEmail(email.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ── Main render ──────────────────────────────────────

  const filteredEmails = getFilteredEmails()

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-amber-500" />
          <h1 className="text-2xl font-semibold">AI Outreach</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
          <Button size="sm" className="gap-2 bg-amber-500 hover:bg-amber-600 text-black" onClick={() => setGenerateOpen(true)}>
            <Sparkles className="h-4 w-4" /> Generate Emails
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground text-sm mb-8">
        Draft, review, approve, and send AI-personalized outreach emails. Full pipeline from generation to tracking.
      </p>

      {/* Stats bar */}
      {renderStatsBar()}

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-border">
        {TABS.map(tab => {
          const count = tab.id === 'queue' ? drafts.length
            : tab.id === 'approved' ? approved.length
            : tab.id === 'sent' ? sentGroup.length
            : emails.length
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${
                activeTab === tab.id
                  ? 'border-amber-500 text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                activeTab === tab.id ? 'bg-amber-500/15 text-amber-400' : 'bg-muted text-muted-foreground'
              }`}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Bulk actions */}
      {activeTab === 'queue' && drafts.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={approveAll}>
            <CheckCircle2 className="h-3 w-3" /> Approve All ({drafts.length})
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-destructive hover:text-destructive" onClick={deleteAllDrafts}>
            <Trash2 className="h-3 w-3" /> Delete All Drafts
          </Button>
        </div>
      )}
      {activeTab === 'approved' && approved.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <Button size="sm" className="h-7 text-xs gap-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
            disabled={sendingAll} onClick={sendAll}>
            {sendingAll ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />} Send All ({approved.length})
          </Button>
        </div>
      )}
      {activeTab === 'sent' && sentGroup.length > 0 && (
        <div className="hidden md:grid grid-cols-[1fr_1.5fr_auto_auto_auto_auto] gap-4 px-5 py-2 text-xs font-mono tracking-widest uppercase text-muted-foreground/50 mb-2">
          <span>Lead</span>
          <span>Subject</span>
          <span>From</span>
          <span>Sent</span>
          <span>Status</span>
          <span></span>
        </div>
      )}

      {/* Email list */}
      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : filteredEmails.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <Mail className="h-10 w-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm">
            {activeTab === 'queue' ? 'No emails in queue. Click "Generate Emails" to create drafts.'
              : activeTab === 'approved' ? 'No approved emails. Approve drafts from the Queue tab.'
              : activeTab === 'sent' ? 'No sent emails yet.'
              : 'No emails yet. Generate from leads or compose manually.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredEmails.map(email => {
            if (activeTab === 'queue') return renderQueueCard(email)
            if (activeTab === 'approved') return renderApprovedCard(email)
            if (activeTab === 'sent') return renderSentRow(email)
            return renderAllCard(email)
          })}
        </div>
      )}

      {/* ═══════════ GENERATE EMAILS DIALOG ═══════════ */}
      <Dialog open={generateOpen} onOpenChange={open => { if (!generating) setGenerateOpen(open) }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" /> Generate Emails
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-5 py-2">
            {/* Select leads */}
            <div className="flex flex-col gap-2">
              <Label>Select leads ({leadsWithoutDraft.length} available)</Label>
              {leadsWithoutDraft.length === 0 ? (
                <p className="text-xs text-muted-foreground">All leads already have draft emails.</p>
              ) : (
                <>
                  <div className="flex gap-2 mb-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs"
                      onClick={() => setSelectedLeads(leadsWithoutDraft.map(l => l.id))}>
                      <Users className="h-3 w-3 mr-1" /> Select All
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs"
                      onClick={() => setSelectedLeads([])}>
                      Clear
                    </Button>
                    <span className="text-xs text-muted-foreground self-center ml-2">{selectedLeads.length} selected</span>
                  </div>
                  <div className="max-h-48 overflow-y-auto border border-border rounded-md divide-y divide-border">
                    {leadsWithoutDraft.map(lead => (
                      <label key={lead.id} className="flex items-center gap-3 px-3 py-2 hover:bg-muted/30 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={e => {
                            if (e.target.checked) setSelectedLeads(prev => [...prev, lead.id])
                            else setSelectedLeads(prev => prev.filter(id => id !== lead.id))
                          }}
                          className="rounded border-border"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{lead.company_name}</p>
                          <p className="text-xs text-muted-foreground truncate">{lead.contact_name} &middot; {lead.email}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs font-mono flex-shrink-0">{lead.ai_score}</Badge>
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>

            <Separator />

            {/* AI provider + model */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>AI Provider</Label>
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger><SelectValue placeholder="Select provider" /></SelectTrigger>
                  <SelectContent>
                    {providers.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                    {providers.length === 0 && (
                      <SelectItem value="" disabled>No providers configured</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Model</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger><SelectValue placeholder="Select model" /></SelectTrigger>
                  <SelectContent>
                    {availableModels.map(m => (
                      <SelectItem key={m} value={m} className="font-mono text-xs">{m}</SelectItem>
                    ))}
                    {availableModels.length === 0 && (
                      <SelectItem value="" disabled>No models — fetch in Settings</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sender + template type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Sender Account</Label>
                <Select value={selectedSender} onValueChange={setSelectedSender}>
                  <SelectTrigger><SelectValue placeholder="Select sender" /></SelectTrigger>
                  <SelectContent>
                    {senderAccounts.map(a => (
                      <SelectItem key={a.email} value={a.email}>
                        {a.name} ({a.email})
                      </SelectItem>
                    ))}
                    {senderAccounts.length === 0 && (
                      <SelectItem value="" disabled>No senders — configure in Settings</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Template Type</Label>
                <Select value={templateType} onValueChange={setTemplateType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {EMAIL_TEMPLATE_TYPES.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Custom instructions */}
            <div className="flex flex-col gap-1.5">
              <Label>Custom Instructions (optional)</Label>
              <Textarea
                value={customInstructions}
                onChange={e => setCustomInstructions(e.target.value)}
                rows={3}
                placeholder="e.g., Mention our new AI analytics product, use casual tone, include a case study reference..."
                className="text-sm"
              />
            </div>

            {/* Progress */}
            {generating && (
              <div className="flex items-center gap-3 p-3 rounded-md bg-amber-500/10 border border-amber-500/20">
                <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                <span className="text-sm text-amber-400">
                  Generating {generateProgress.current} of {generateProgress.total}...
                </span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setGenerateOpen(false)} disabled={generating}>Cancel</Button>
            <Button onClick={handleGenerate} disabled={generating || selectedLeads.length === 0 || !selectedProvider || !selectedModel}
              className="gap-2 bg-amber-500 hover:bg-amber-600 text-black">
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              Generate {selectedLeads.length > 0 ? `(${selectedLeads.length})` : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════ EDIT EMAIL DIALOG ═══════════ */}
      <Dialog open={!!editDialog} onOpenChange={open => { if (!open) setEditDialog(null) }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Email</DialogTitle>
          </DialogHeader>
          {editDialog && (
            <div className="flex flex-col gap-4 py-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" />
                {editDialog.crm_leads?.company_name} &middot; {editDialog.crm_leads?.contact_name}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>From</Label>
                <Select value={editFrom} onValueChange={setEditFrom}>
                  <SelectTrigger><SelectValue placeholder="Select sender" /></SelectTrigger>
                  <SelectContent>
                    {senderAccounts.map(a => (
                      <SelectItem key={a.email} value={a.email}>{a.name} ({a.email})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Subject</Label>
                <Input value={editSubject} onChange={e => setEditSubject(e.target.value)} />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Body</Label>
                <Textarea
                  value={editBody}
                  onChange={e => setEditBody(e.target.value)}
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setEditDialog(null)}>Cancel</Button>
            <Button variant="outline" onClick={() => saveEdit(false)} disabled={editSaving}>
              {editSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Save Draft
            </Button>
            <Button onClick={() => saveEdit(true)} disabled={editSaving}
              className="gap-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20">
              {editSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              <CheckCircle2 className="h-3.5 w-3.5" /> Save & Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════ REJECT DIALOG ═══════════ */}
      <Dialog open={!!rejectDialog} onOpenChange={open => { if (!open) setRejectDialog(null) }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Email</DialogTitle>
          </DialogHeader>
          {rejectDialog && (
            <div className="flex flex-col gap-4 py-2">
              <p className="text-sm text-muted-foreground">
                Rejecting email for <span className="text-foreground font-medium">{rejectDialog.crm_leads?.company_name}</span>:
                &ldquo;{rejectDialog.subject}&rdquo;
              </p>
              <div className="flex flex-col gap-1.5">
                <Label>Reason (optional)</Label>
                <Textarea
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  rows={3}
                  placeholder="Why is this email being rejected?"
                  className="text-sm"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog(null)}>Cancel</Button>
            <Button onClick={rejectEmail} className="gap-1 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/20">
              <XCircle className="h-3.5 w-3.5" /> Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
