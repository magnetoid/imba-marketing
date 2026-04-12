import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { loadAIProviders, getDefaultProvider, callAI, extractJSON, type AIProvider } from '@/lib/ai'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import toast from 'react-hot-toast'
import {
  BarChart2, Loader2, TrendingUp, Users, Mail,
  Target, RefreshCw, Brain, MessageSquare, Search, Send,
  CheckCircle2, Clock, ArrowUpRight,
} from 'lucide-react'

interface LiveStats {
  totalLeads: number
  newLeads: number
  qualifiedLeads: number
  contactedLeads: number
  convertedLeads: number
  lostLeads: number
  totalEmails: number
  draftEmails: number
  approvedEmails: number
  sentEmails: number
  openedEmails: number
  repliedEmails: number
  bouncedEmails: number
  avgScore: number
  stageBreakdown: { stage: string; count: number }[]
  sourceBreakdown: { source: string; count: number }[]
  chatConversations: number
  chatUnread: number
  inboxMessages: number
  inboxUnread: number
  leadsThisWeek: number
  leadsLastWeek: number
  emailsThisWeek: number
}

const STAGE_COLORS: Record<string, string> = {
  new: '#3B82F6', qualified: '#22C55E', contacted: '#D4A853',
  converted: '#A855F7', lost: '#64748B', proposal: '#F59E0B',
}

function BarRow({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div>
      <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
        <span className="capitalize">{label}</span>
        <span className="font-mono">{value}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color, sub }: {
  label: string; value: string | number; icon: React.ElementType; color: string; sub?: string
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted-foreground">{label}</p>
        <Icon className={`h-4 w-4 ${color}`} />
      </div>
      <p className={`text-3xl font-mono font-bold ${color}`}>{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground mt-1">{sub}</p>}
    </div>
  )
}

export default function AIAnalytics() {
  const [providers, setProviders] = useState<AIProvider[]>([])
  const [stats, setStats] = useState<LiveStats | null>(null)
  const [insights, setInsights] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [generatingInsights, setGeneratingInsights] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)

    // Load AI providers
    const loaded = await loadAIProviders()
    setProviders(loaded)

    // Parallel queries
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString()
    const twoWeeksAgo = new Date(now.getTime() - 14 * 86400000).toISOString()

    const [leadsRes, emailsRes, analyticsRes, chatRes, inboxRes, leadsWeekRes, leadsLastWeekRes, emailsWeekRes] = await Promise.all([
      supabase.from('crm_leads').select('status, ai_score, source'),
      supabase.from('crm_outreach_emails').select('status'),
      supabase.from('crm_analytics_snapshots').select('ai_insights').order('snapshot_date', { ascending: false }).limit(1).maybeSingle(),
      Promise.resolve(supabase.from('chat_conversations').select('id, unread_count, status')).catch(() => ({ data: null })),
      Promise.resolve(supabase.from('crm_inbox_messages').select('id, status')).catch(() => ({ data: null })),
      supabase.from('crm_leads').select('id').gte('created_at', weekAgo),
      supabase.from('crm_leads').select('id').gte('created_at', twoWeeksAgo).lt('created_at', weekAgo),
      supabase.from('crm_outreach_emails').select('id').gte('created_at', weekAgo),
    ])

    const leads: Array<{ status: string; ai_score: number | null; source: string | null }> = leadsRes.data || []
    const emails: Array<{ status: string }> = emailsRes.data || []
    const chatData = chatRes as { data: Array<{ id: string; unread_count: number; status: string }> | null }
    const inboxData = inboxRes as { data: Array<{ id: string; status: string }> | null }
    const chats = chatData?.data || []
    const inbox = inboxData?.data || []

    const stageMap: Record<string, number> = {}
    const sourceMap: Record<string, number> = {}
    leads.forEach((l: { status: string; source: string | null }) => {
      stageMap[l.status] = (stageMap[l.status] || 0) + 1
      const src = l.source || 'unknown'
      sourceMap[src] = (sourceMap[src] || 0) + 1
    })
    const totalScore = leads.reduce((s: number, l: { ai_score: number | null }) => s + (l.ai_score || 0), 0)

    setStats({
      totalLeads: leads.length,
      newLeads: leads.filter((l: { status: string }) => l.status === 'new').length,
      qualifiedLeads: leads.filter((l: { status: string }) => l.status === 'qualified').length,
      contactedLeads: leads.filter((l: { status: string }) => l.status === 'contacted').length,
      convertedLeads: leads.filter((l: { status: string }) => l.status === 'converted').length,
      lostLeads: leads.filter((l: { status: string }) => l.status === 'lost').length,
      totalEmails: emails.length,
      draftEmails: emails.filter((e: { status: string }) => e.status === 'draft').length,
      approvedEmails: emails.filter((e: { status: string }) => e.status === 'approved').length,
      sentEmails: emails.filter((e: { status: string }) => ['sent', 'opened', 'replied'].includes(e.status)).length,
      openedEmails: emails.filter((e: { status: string }) => ['opened', 'replied'].includes(e.status)).length,
      repliedEmails: emails.filter((e: { status: string }) => e.status === 'replied').length,
      bouncedEmails: emails.filter((e: { status: string }) => e.status === 'bounced').length,
      avgScore: leads.length > 0 ? Math.round(totalScore / leads.length) : 0,
      stageBreakdown: Object.entries(stageMap).map(([stage, count]) => ({ stage, count })).sort((a, b) => b.count - a.count),
      sourceBreakdown: Object.entries(sourceMap).map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count),
      chatConversations: chats.filter(c => c.status === 'active').length,
      chatUnread: chats.reduce((s, c) => s + (c.unread_count || 0), 0),
      inboxMessages: inbox.length,
      inboxUnread: inbox.filter((m: { status: string }) => m.status === 'unread').length,
      leadsThisWeek: leadsWeekRes.data?.length || 0,
      leadsLastWeek: leadsLastWeekRes.data?.length || 0,
      emailsThisWeek: emailsWeekRes.data?.length || 0,
    })

    if (analyticsRes.data?.ai_insights) {
      setInsights(analyticsRes.data.ai_insights as string[])
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function generateInsights() {
    const def = getDefaultProvider(providers)
    if (!def) { toast.error('Configure an AI provider in CRM Settings first.'); return }
    if (!stats) return
    setGeneratingInsights(true)

    const openRate = stats.sentEmails ? Math.round((stats.openedEmails / stats.sentEmails) * 100) : 0
    const replyRate = stats.sentEmails ? Math.round((stats.repliedEmails / stats.sentEmails) * 100) : 0
    const convRate = stats.totalLeads ? Math.round((stats.convertedLeads / stats.totalLeads) * 100) : 0
    const weekTrend = stats.leadsLastWeek > 0 ? Math.round(((stats.leadsThisWeek - stats.leadsLastWeek) / stats.leadsLastWeek) * 100) : 0

    const prompt = `Analyze these CRM metrics and provide 5 specific, actionable sales insights:

Lead Pipeline: ${stats.totalLeads} total | New: ${stats.newLeads} | Qualified: ${stats.qualifiedLeads} | Contacted: ${stats.contactedLeads} | Converted: ${stats.convertedLeads} | Lost: ${stats.lostLeads}
Avg AI Score: ${stats.avgScore}/100
Lead Sources: ${stats.sourceBreakdown.map(s => `${s.source}: ${s.count}`).join(', ') || 'none'}
This Week: ${stats.leadsThisWeek} new leads (${weekTrend > 0 ? '+' : ''}${weekTrend}% vs last week)

Email Outreach: ${stats.totalEmails} total | Drafts: ${stats.draftEmails} | Approved: ${stats.approvedEmails} | Sent: ${stats.sentEmails} | Opened: ${stats.openedEmails} | Replied: ${stats.repliedEmails} | Bounced: ${stats.bouncedEmails}
Open rate: ${openRate}% | Reply rate: ${replyRate}% | Conversion: ${convRate}%
Emails this week: ${stats.emailsThisWeek}

Chat: ${stats.chatConversations} active conversations, ${stats.chatUnread} unread
Inbox: ${stats.inboxMessages} messages, ${stats.inboxUnread} unread

Return ONLY a JSON array of 5 insight strings. No markdown.`

    try {
      const text = await callAI(def.provider, def.model, prompt,
        'You are a B2B sales analyst for an AI marketing agency. Give specific, actionable insights based on the data. Return only a JSON array of 5 strings.')
      const arr = extractJSON<string[]>(text)
      setInsights(arr)

      const today = new Date().toISOString().split('T')[0]
      await supabase.from('crm_analytics_snapshots').upsert({
        snapshot_date: today,
        total_leads: stats.totalLeads, qualified_leads: stats.qualifiedLeads,
        emails_sent: stats.sentEmails, emails_opened: stats.openedEmails,
        emails_replied: stats.repliedEmails, ai_insights: arr,
      })
      toast.success('Insights generated')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to generate insights')
    }
    setGeneratingInsights(false)
  }

  const openRate = stats?.sentEmails ? Math.round((stats.openedEmails / stats.sentEmails) * 100) : 0
  const replyRate = stats?.sentEmails ? Math.round((stats.repliedEmails / stats.sentEmails) * 100) : 0
  const convRate = stats?.totalLeads ? Math.round((stats.convertedLeads / stats.totalLeads) * 100) : 0
  const weekTrend = stats && stats.leadsLastWeek > 0 ? Math.round(((stats.leadsThisWeek - stats.leadsLastWeek) / stats.leadsLastWeek) * 100) : 0

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <BarChart2 className="h-5 w-5 text-amber-500" />
          <h1 className="text-2xl font-semibold">Analytics</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
          <Button size="sm" className="gap-2 bg-amber-500 hover:bg-amber-600 text-black" onClick={generateInsights} disabled={generatingInsights}>
            {generatingInsights ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Brain className="h-3.5 w-3.5" />}
            AI Insights
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground text-sm mb-8">Live pipeline metrics, outreach performance, and AI recommendations.</p>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : stats ? (
        <>
          {/* Top KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
            <StatCard label="Total Leads" value={stats.totalLeads} icon={Users} color="text-amber-400"
              sub={stats.leadsThisWeek > 0 ? `+${stats.leadsThisWeek} this week` : undefined} />
            <StatCard label="Avg AI Score" value={stats.avgScore} icon={Target} color="text-blue-400"
              sub={stats.avgScore >= 60 ? 'Good quality' : 'Needs improvement'} />
            <StatCard label="Emails Sent" value={stats.sentEmails} icon={Send} color="text-emerald-400"
              sub={`${stats.draftEmails} drafts pending`} />
            <StatCard label="Converted" value={stats.convertedLeads} icon={TrendingUp} color="text-purple-400"
              sub={`${convRate}% conversion rate`} />
            <StatCard label="Active Chats" value={stats.chatConversations} icon={MessageSquare} color="text-cyan-400"
              sub={stats.chatUnread > 0 ? `${stats.chatUnread} unread` : 'All read'} />
            <StatCard label="Week Trend" value={`${weekTrend > 0 ? '+' : ''}${weekTrend}%`} icon={ArrowUpRight}
              color={weekTrend >= 0 ? 'text-emerald-400' : 'text-red-400'}
              sub={`${stats.leadsThisWeek} vs ${stats.leadsLastWeek} last week`} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Email Funnel */}
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-5">
                <Mail className="h-4 w-4 text-emerald-400" />
                <p className="text-sm font-medium">Email Funnel</p>
              </div>
              <div className="flex flex-col gap-4 mb-5">
                <BarRow label="Total" value={stats.totalEmails} max={stats.totalEmails || 1} color="#3B82F6" />
                <BarRow label="Sent" value={stats.sentEmails} max={stats.totalEmails || 1} color="#22C55E" />
                <BarRow label="Opened" value={stats.openedEmails} max={stats.sentEmails || 1} color="#D4A853" />
                <BarRow label="Replied" value={stats.repliedEmails} max={stats.sentEmails || 1} color="#A855F7" />
                {stats.bouncedEmails > 0 && (
                  <BarRow label="Bounced" value={stats.bouncedEmails} max={stats.sentEmails || 1} color="#EF4444" />
                )}
              </div>
              <Separator className="mb-4" />
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-xl font-mono font-bold text-emerald-400">{openRate}%</p>
                  <p className="text-[10px] text-muted-foreground">Open rate</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-mono font-bold text-purple-400">{replyRate}%</p>
                  <p className="text-[10px] text-muted-foreground">Reply rate</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-mono font-bold text-amber-400">{convRate}%</p>
                  <p className="text-[10px] text-muted-foreground">Conv. rate</p>
                </div>
              </div>
            </div>

            {/* Lead Pipeline */}
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-5">
                <Users className="h-4 w-4 text-amber-400" />
                <p className="text-sm font-medium">Lead Pipeline</p>
              </div>
              {stats.stageBreakdown.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No leads yet</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {stats.stageBreakdown.map(row => (
                    <BarRow key={row.stage} label={row.stage} value={row.count} max={stats.totalLeads || 1} color={STAGE_COLORS[row.stage] || '#3B82F6'} />
                  ))}
                </div>
              )}
            </div>

            {/* Lead Sources */}
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-5">
                <Search className="h-4 w-4 text-blue-400" />
                <p className="text-sm font-medium">Lead Sources</p>
              </div>
              {stats.sourceBreakdown.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No leads yet</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {stats.sourceBreakdown.map(row => (
                    <BarRow key={row.source} label={row.source} value={row.count} max={stats.totalLeads || 1} color="#3B82F6" />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Status */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="flex items-center gap-3 bg-card border border-border rounded-lg p-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">{stats.approvedEmails}</p>
                <p className="text-[10px] text-muted-foreground">Emails awaiting send</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-card border border-border rounded-lg p-4">
              <Clock className="h-5 w-5 text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">{stats.draftEmails}</p>
                <p className="text-[10px] text-muted-foreground">Draft emails to review</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-card border border-border rounded-lg p-4">
              <MessageSquare className="h-5 w-5 text-cyan-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">{stats.chatUnread}</p>
                <p className="text-[10px] text-muted-foreground">Unread chat messages</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-card border border-border rounded-lg p-4">
              <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">{stats.inboxUnread}</p>
                <p className="text-[10px] text-muted-foreground">Unread inbox messages</p>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-5">
              <Brain className="h-4 w-4 text-amber-500" />
              <p className="text-sm font-medium">AI Sales Insights</p>
              {insights.length === 0 && (
                <span className="text-xs text-muted-foreground ml-1">— click "AI Insights" to generate</span>
              )}
            </div>
            {insights.length > 0 ? (
              <div className="flex flex-col gap-3">
                {insights.map((insight, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg">
                    <div className="w-5 h-5 rounded-full bg-amber-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px] font-mono font-bold text-amber-500">{i + 1}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Generate AI insights for personalized recommendations.</p>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  )
}
