import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import toast from 'react-hot-toast'
import {
  Inbox, Mail, Sparkles, Loader2, Plus, Reply,
  ArrowDownLeft, ArrowUpRight, AlertCircle, CheckCircle2, MessageSquare, Search,
  BarChart3, Clock, Activity, History
} from 'lucide-react'

interface InboxMessage {
  id: string
  lead_id: string | null
  direction: 'inbound' | 'outbound'
  subject: string | null
  body: string
  from_email: string | null
  to_email: string | null
  status: string
  type: string
  priority: string
  metadata: any
  ai_sentiment: string | null
  ai_category: string | null
  ai_suggested_reply: string | null
  received_at: string
  created_at: string
  resolved_at: string | null
  crm_leads?: { company_name: string; contact_name: string } | null
}

interface AuditLog {
  id: string
  action: string
  details: any
  created_at: string
}

interface CRMLead { id: string; company_name: string; contact_name: string; email: string }

const SENTIMENT_COLOR: Record<string, string> = {
  positive: 'text-emerald-400 border-emerald-400/30',
  neutral:  'text-muted-foreground border-border',
  negative: 'text-red-400 border-red-400/30',
}

const PRIORITY_COLOR: Record<string, string> = {
  low: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  normal: 'text-slate-300 border-slate-500/30 bg-slate-500/10',
  high: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  urgent: 'text-red-400 border-red-400/30 bg-red-400/10',
}

const TYPE_COLOR: Record<string, string> = {
  sales: 'text-emerald-400 border-emerald-400/30',
  support: 'text-purple-400 border-purple-400/30',
  contact: 'text-amber-400 border-amber-400/30',
  general: 'text-slate-400 border-slate-400/30',
}

const CATEGORY_ICON: Record<string, typeof Mail> = {
  question: MessageSquare, objection: AlertCircle, meeting_request: CheckCircle2, bounce: AlertCircle,
}

export default function AIInbox() {
  const [apiKey] = useState(() => localStorage.getItem('anthropic_api_key') || '')
  const [messages, setMessages] = useState<InboxMessage[]>([])
  const [leads, setLeads] = useState<CRMLead[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<InboxMessage | null>(null)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loadingLogs, setLoadingLogs] = useState(false)
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'resolved' | 'archived'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'sales' | 'support' | 'contact' | 'general'>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'normal' | 'high' | 'urgent'>('all')
  const [search, setSearch] = useState('')
  
  const [addDialog, setAddDialog] = useState(false)
  const [analyzing, setAnalyzing] = useState<string | null>(null)
  const [addForm, setAddForm] = useState({
    lead_id: '', direction: 'inbound' as 'inbound' | 'outbound',
    subject: '', body: '', from_email: '', to_email: '', type: 'general', priority: 'normal'
  })
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const [msgsRes, leadsRes] = await Promise.all([
      supabase.from('crm_inbox_messages').select('*, crm_leads(company_name, contact_name)').order('received_at', { ascending: false }),
      supabase.from('crm_leads').select('id,company_name,contact_name,email').order('company_name'),
    ])
    setMessages((msgsRes.data as InboxMessage[]) || [])
    setLeads((leadsRes.data as CRMLead[]) || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const channel = supabase.channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'crm_inbox_messages' },
        (payload) => {
          const newMessage = payload.new as InboxMessage
          toast.success(`New message received from ${newMessage.from_email || 'Unknown'}`)
          setMessages(prev => [newMessage, ...prev])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  useEffect(() => {
    if (selected) {
      loadAuditLogs(selected.id)
    } else {
      setAuditLogs([])
    }
  }, [selected?.id])

  async function loadAuditLogs(messageId: string) {
    setLoadingLogs(true)
    const { data } = await supabase.from('crm_inbox_audit_logs').select('*').eq('message_id', messageId).order('created_at', { ascending: false })
    setAuditLogs(data || [])
    setLoadingLogs(false)
  }

  async function updateMessageStatus(id: string, newStatus: string) {
    const updateData: any = { status: newStatus }
    if (newStatus === 'resolved') {
      updateData.resolved_at = new Date().toISOString()
    }
    
    await supabase.from('crm_inbox_messages').update(updateData).eq('id', id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...updateData } : m))
    if (selected?.id === id) setSelected(p => p ? { ...p, ...updateData } : p)
    toast.success(`Marked as ${newStatus}`)
  }

  async function updateMessagePriority(id: string, newPriority: string) {
    await supabase.from('crm_inbox_messages').update({ priority: newPriority }).eq('id', id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, priority: newPriority } : m))
    if (selected?.id === id) setSelected(p => p ? { ...p, priority: newPriority } : p)
    toast.success(`Priority updated`)
  }

  async function analyzeMessage(msg: InboxMessage) {
    if (!apiKey) { toast.error('Add your Anthropic API key in Settings first.'); return }
    setAnalyzing(msg.id)
    const prompt = `Analyze this inbound message.
From: ${msg.from_email || 'unknown'}
Subject: ${msg.subject || '(no subject)'}
Body: ${msg.body}

Return ONLY valid JSON:
{
  "sentiment": "positive" | "neutral" | "negative",
  "category": "question" | "objection" | "meeting_request" | "bounce",
  "suggested_reply": "string (professional reply, 3-4 sentences)"
}`
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey, 'anthropic-version': '2023-06-01',
          'anthropic-dangerous-allow-browser': 'true', 'content-type': 'application/json',
        },
        body: JSON.stringify({ model: 'claude-opus-4-6', max_tokens: 500, messages: [{ role: 'user', content: prompt }] }),
      })
      const data = await res.json()
      const json = JSON.parse(data.content?.[0]?.text?.match(/\{[\s\S]*\}/)?.[0] || '{}')
      await supabase.from('crm_inbox_messages').update({
        ai_sentiment: json.sentiment, ai_category: json.category,
        ai_suggested_reply: json.suggested_reply, status: msg.status === 'unread' ? 'read' : msg.status,
      }).eq('id', msg.id)
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, ...json, status: msg.status === 'unread' ? 'read' : msg.status } : m))
      if (selected?.id === msg.id) setSelected(p => p ? { ...p, ...json, status: p.status === 'unread' ? 'read' : p.status } : p)
      toast.success('Message analyzed')
    } catch { toast.error('Analysis failed') }
    setAnalyzing(null)
  }

  async function handleAdd() {
    setSaving(true)
    await supabase.from('crm_inbox_messages').insert({
      lead_id: addForm.lead_id || null, direction: addForm.direction,
      subject: addForm.subject || null, body: addForm.body,
      from_email: addForm.from_email || null, to_email: addForm.to_email || null, status: 'unread',
      type: addForm.type, priority: addForm.priority
    })
    setAddDialog(false)
    setAddForm({ lead_id: '', direction: 'inbound', subject: '', body: '', from_email: '', to_email: '', type: 'general', priority: 'normal' })
    setSaving(false)
    toast.success('Message logged')
    load()
  }

  const displayMessages = messages.filter(m => {
    if (statusFilter !== 'all' && m.status !== statusFilter) return false
    if (typeFilter !== 'all' && m.type !== typeFilter) return false
    if (priorityFilter !== 'all' && m.priority !== priorityFilter) return false
    return true
  }).filter(m =>
    !search ||
    m.subject?.toLowerCase().includes(search.toLowerCase()) ||
    m.from_email?.toLowerCase().includes(search.toLowerCase()) ||
    m.crm_leads?.company_name?.toLowerCase().includes(search.toLowerCase())
  )

  const unreadCount = messages.filter(m => m.status === 'unread').length

  // Reporting metrics
  const metrics = useMemo(() => {
    const inbound = messages.filter(m => m.direction === 'inbound')
    const resolved = inbound.filter(m => m.status === 'resolved' && m.resolved_at)
    
    let totalResponseTimeMs = 0
    resolved.forEach(m => {
      const created = new Date(m.created_at).getTime()
      const resolvedAt = new Date(m.resolved_at!).getTime()
      totalResponseTimeMs += (resolvedAt - created)
    })
    
    const avgResponseHours = resolved.length > 0 ? (totalResponseTimeMs / resolved.length) / (1000 * 60 * 60) : 0
    const resolutionRate = inbound.length > 0 ? (resolved.length / inbound.length) * 100 : 0

    return {
      total: inbound.length,
      resolved: resolved.length,
      avgResponseHours: avgResponseHours.toFixed(1),
      resolutionRate: resolutionRate.toFixed(1)
    }
  }, [messages])

  const [activeTab, setActiveTab] = useState<'inbox' | 'reporting'>('inbox')

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <Inbox className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Unified Inbox</h1>
            <p className="text-sm text-muted-foreground">Centralized communications & web forms</p>
          </div>
          {unreadCount > 0 && <Badge className="bg-amber-500 text-black text-xs ml-2">{unreadCount} new</Badge>}
        </div>
        <Button size="sm" className="gap-2 bg-amber-500 hover:bg-amber-600 text-black" onClick={() => setAddDialog(true)}>
          <Plus className="h-4 w-4" /> Log message
        </Button>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex w-full justify-start border-b mb-6 shrink-0">
          <button 
            onClick={() => setActiveTab('inbox')}
            className={`px-6 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === 'inbox' ? 'border-amber-500 text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            Inbox
          </button>
          <button 
            onClick={() => setActiveTab('reporting')}
            className={`px-6 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === 'reporting' ? 'border-amber-500 text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            Reporting
          </button>
        </div>

        {activeTab === 'inbox' && (
          <div className="flex-1 flex flex-col min-h-0 m-0">
          {/* Filters + Search */}
          <div className="flex items-center gap-3 mb-5 flex-wrap shrink-0 bg-card/50 p-2 rounded-lg border">
            <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
              <SelectTrigger className="w-[130px] h-8 text-xs bg-background"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={(v: any) => setTypeFilter(v)}>
              <SelectTrigger className="w-[130px] h-8 text-xs bg-background"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="contact">Contact</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={(v: any) => setPriorityFilter(v)}>
              <SelectTrigger className="w-[130px] h-8 text-xs bg-background"><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative ml-auto">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sender or subject…" className="pl-8 h-8 text-xs w-64 bg-background" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
            {/* List */}
            <div className="lg:col-span-5 flex flex-col gap-2 overflow-y-auto pr-2 pb-4">
              {loading ? (
                <div className="flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
              ) : displayMessages.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground border border-dashed rounded-xl bg-card/30">
                  <Inbox className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No messages found.</p>
                </div>
              ) : displayMessages.map(msg => {
                const CatIcon = CATEGORY_ICON[msg.ai_category || ''] || Mail
                return (
                  <button key={msg.id} onClick={() => { setSelected(msg); if (msg.status === 'unread' && !msg.ai_sentiment) analyzeMessage(msg) }}
                    className={`text-left p-4 bg-card border rounded-xl transition-all ${selected?.id === msg.id ? 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : `border-border hover:border-border/80 ${msg.status === 'unread' ? 'border-l-2 border-l-amber-400 bg-amber-500/[0.02]' : ''}`}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {msg.direction === 'inbound' ? <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-400" /> : <ArrowUpRight className="h-3.5 w-3.5 text-blue-400" />}
                        <span className="text-sm font-medium truncate max-w-[150px]">{msg.crm_leads?.company_name || msg.from_email || 'Unknown'}</span>
                        {msg.status === 'unread' && <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{new Date(msg.received_at).toLocaleDateString()}</span>
                    </div>
                    {msg.subject && <p className="text-xs font-medium mb-1.5 truncate text-foreground/90">{msg.subject}</p>}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{msg.body}</p>
                    
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <Badge variant="outline" className={`text-[9px] h-5 px-1.5 ${TYPE_COLOR[msg.type] || TYPE_COLOR.general}`}>
                        {msg.type}
                      </Badge>
                      {msg.priority !== 'normal' && (
                        <Badge variant="outline" className={`text-[9px] h-5 px-1.5 ${PRIORITY_COLOR[msg.priority] || PRIORITY_COLOR.normal}`}>
                          {msg.priority}
                        </Badge>
                      )}
                      {(msg.ai_sentiment || msg.ai_category) && (
                        <>
                          <div className="w-px h-3 bg-border mx-1" />
                          {msg.ai_category && <CatIcon className="h-3 w-3 text-muted-foreground" />}
                          {msg.ai_sentiment && <span className={`text-[10px] font-medium ${SENTIMENT_COLOR[msg.ai_sentiment]?.split(' ')[0]}`}>{msg.ai_sentiment}</span>}
                        </>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Detail */}
            <div className="lg:col-span-7 bg-card border rounded-xl flex flex-col min-h-0 overflow-hidden shadow-sm">
              {selected ? (
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="p-5 border-b bg-muted/20 shrink-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h2 className="text-lg font-medium tracking-tight mb-1">{selected.subject || '(No subject)'}</h2>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>From: <span className="text-foreground">{selected.from_email || 'Unknown'}</span></span>
                          <span>•</span>
                          <span>{new Date(selected.received_at).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Select value={selected.status} onValueChange={(v) => updateMessageStatus(selected.id, v)}>
                          <SelectTrigger className="h-8 w-[110px] text-xs bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unread">Unread</SelectItem>
                            <SelectItem value="read">Read</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={selected.priority} onValueChange={(v) => updateMessagePriority(selected.id, v)}>
                          <SelectTrigger className={`h-8 w-[100px] text-xs ${PRIORITY_COLOR[selected.priority] || ''}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="urgent">Urgent</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 items-center">
                      <Badge variant="outline" className={TYPE_COLOR[selected.type] || TYPE_COLOR.general}>{selected.type.toUpperCase()}</Badge>
                      {selected.ai_sentiment && (
                        <Badge variant="outline" className={`gap-1 ${SENTIMENT_COLOR[selected.ai_sentiment] || ''}`}>
                          <Sparkles className="h-3 w-3" /> {selected.ai_sentiment}
                        </Badge>
                      )}
                      {!selected.ai_sentiment && selected.direction === 'inbound' && (
                        <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1" onClick={() => analyzeMessage(selected)} disabled={analyzing === selected.id}>
                          {analyzing === selected.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 text-amber-500" />}
                          Analyze
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-5">
                    {/* Message Body */}
                    <div className="bg-background rounded-lg p-4 border text-sm whitespace-pre-wrap leading-relaxed mb-6">
                      {selected.body}
                    </div>

                    {/* Metadata Grid */}
                    {selected.metadata && Object.keys(selected.metadata).length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-xs font-mono tracking-wider text-muted-foreground uppercase mb-3">Submission Data</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(selected.metadata).map(([k, v]) => (
                            <div key={k} className="bg-muted/30 p-3 rounded border">
                              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{k.replace(/_/g, ' ')}</div>
                              <div className="text-sm font-medium">{String(v)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Suggestion */}
                    {selected.ai_suggested_reply && (
                      <div className="border border-amber-500/20 bg-amber-500/5 rounded-xl p-5 mb-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/50" />
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="h-4 w-4 text-amber-500" />
                          <span className="text-xs font-medium text-amber-600 dark:text-amber-400">AI Suggested Reply</span>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap mb-4">{selected.ai_suggested_reply}</p>
                        <div className="flex gap-2">
                          <Button size="sm" className="h-8 text-xs gap-1.5 bg-amber-500 text-black hover:bg-amber-600"
                            onClick={() => window.open(`mailto:${selected.from_email || ''}?subject=Re: ${encodeURIComponent(selected.subject || '')}&body=${encodeURIComponent(selected.ai_suggested_reply || '')}`)}>
                            <Reply className="h-3.5 w-3.5" /> Draft in Email Client
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Audit Logs */}
                    <div>
                      <h3 className="text-xs font-mono tracking-wider text-muted-foreground uppercase mb-3 flex items-center gap-2">
                        <History className="h-3.5 w-3.5" /> Audit Trail
                      </h3>
                      {loadingLogs ? (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin" /> Loading history...</div>
                      ) : auditLogs.length === 0 ? (
                        <div className="text-xs text-muted-foreground">No history available.</div>
                      ) : (
                        <div className="relative pl-3 space-y-4 border-l border-border/50 ml-1">
                          {auditLogs.map(log => (
                            <div key={log.id} className="relative">
                              <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-border" />
                              <p className="text-xs font-medium text-foreground">
                                {log.action.replace(/_/g, ' ')}
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {new Date(log.created_at).toLocaleString()}
                              </p>
                              {log.details && Object.keys(log.details).length > 0 && (
                                <div className="mt-1.5 bg-muted/30 rounded p-2 text-[10px] font-mono text-muted-foreground break-all">
                                  {JSON.stringify(log.details)}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-12">
                  <div className="h-16 w-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-4">
                    <Mail className="h-8 w-8 opacity-40" />
                  </div>
                  <p className="text-base font-medium text-foreground">Select a message</p>
                  <p className="text-sm mt-1 text-center max-w-xs">Choose a message from the list to view details, metadata, and AI insights.</p>
                </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reporting' && (
          <div className="flex-1 overflow-y-auto m-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card border rounded-xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5"><Inbox className="w-24 h-24" /></div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Inbound</p>
              <h3 className="text-4xl font-light tracking-tight">{metrics.total}</h3>
              <p className="text-xs text-muted-foreground mt-2">Messages received</p>
            </div>
            
            <div className="bg-card border rounded-xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5"><Clock className="w-24 h-24" /></div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Avg Resolution Time</p>
              <h3 className="text-4xl font-light tracking-tight">{metrics.avgResponseHours} <span className="text-xl text-muted-foreground">hrs</span></h3>
              <p className="text-xs text-muted-foreground mt-2">From received to resolved</p>
            </div>
            
            <div className="bg-card border rounded-xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5"><Activity className="w-24 h-24" /></div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Resolution Rate</p>
              <h3 className="text-4xl font-light tracking-tight">{metrics.resolutionRate}%</h3>
              <p className="text-xs text-muted-foreground mt-2">{metrics.resolved} of {metrics.total} resolved</p>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-6 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-amber-500" /> Activity Breakdown</h3>
            <div className="h-64 flex items-end gap-4 pb-6 border-b border-dashed">
              {/* Dummy chart for illustration */}
              {[40, 70, 45, 90, 60, 100, 85].map((val, i) => (
                <div key={i} className="flex-1 bg-amber-500/20 hover:bg-amber-500/30 rounded-t-sm relative group transition-all" style={{ height: `${val}%` }}>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover border shadow-sm text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {val} msgs
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-muted-foreground font-mono">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>Log a message</DialogTitle></DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Direction</Label>
                <Select value={addForm.direction} onValueChange={v => setAddForm(p => ({ ...p, direction: v as 'inbound' | 'outbound' }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inbound">Inbound (they wrote to us)</SelectItem>
                    <SelectItem value="outbound">Outbound (we wrote to them)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Type</Label>
                <Select value={addForm.type} onValueChange={v => setAddForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="contact">Contact</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Lead</Label>
                <Select value={addForm.lead_id} onValueChange={v => setAddForm(p => ({ ...p, lead_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Link to lead" /></SelectTrigger>
                  <SelectContent>{leads.map(l => <SelectItem key={l.id} value={l.id}>{l.company_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>From email</Label>
                <Input value={addForm.from_email} onChange={e => setAddForm(p => ({ ...p, from_email: e.target.value }))} placeholder="sender@domain.com" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Priority</Label>
                <Select value={addForm.priority} onValueChange={v => setAddForm(p => ({ ...p, priority: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Subject</Label>
              <Input value={addForm.subject} onChange={e => setAddForm(p => ({ ...p, subject: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Body *</Label>
              <Textarea value={addForm.body} onChange={e => setAddForm(p => ({ ...p, body: e.target.value }))} rows={5} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialog(false)}>Cancel</Button>
            <Button className="bg-amber-500 text-black hover:bg-amber-600" onClick={handleAdd} disabled={saving || !addForm.body}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Log message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
