import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Loader2, Play, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react'

type AuditRun = {
  id: string
  scope: string
  totals: { critical?: number; warning?: number; info?: number }
  started_at: string
  finished_at: string | null
}

type SeoIssue = {
  id: string
  url: string
  code: string
  severity: 'critical' | 'warning' | 'info'
  message: string
  created_at: string
}

function severityBadge(sev: SeoIssue['severity']) {
  if (sev === 'critical') return <Badge variant="destructive" className="text-[0.6rem]">critical</Badge>
  if (sev === 'warning') return <Badge variant="secondary" className="text-[0.6rem] bg-yellow-500/15 text-yellow-500">warning</Badge>
  return <Badge variant="outline" className="text-[0.6rem]">info</Badge>
}

export default function SEOAudits() {
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [runs, setRuns] = useState<AuditRun[]>([])
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null)
  const [issues, setIssues] = useState<SeoIssue[]>([])
  const [issuesLoading, setIssuesLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedRun = useMemo(() => runs.find(r => r.id === selectedRunId) || null, [runs, selectedRunId])

  const loadRuns = useCallback(async () => {
    setLoading(true)
    setError('')
    const { data, error: err } = await supabase
      .from('audit_runs')
      .select('id, scope, totals, started_at, finished_at')
      .order('started_at', { ascending: false })
      .limit(20)
    if (err) setError(err.message)
    setRuns((data as any) || [])
    setLoading(false)
  }, [])

  const loadIssues = useCallback(async (runId: string) => {
    setIssuesLoading(true)
    setError('')
    const { data, error: err } = await supabase
      .from('seo_issues')
      .select('id, url, code, severity, message, created_at')
      .eq('run_id', runId)
      .order('severity', { ascending: true })
      .limit(500)
    if (err) setError(err.message)
    setIssues((data as any) || [])
    setIssuesLoading(false)
  }, [])

  useEffect(() => { loadRuns() }, [loadRuns])
  useEffect(() => {
    if (selectedRunId) loadIssues(selectedRunId)
    else setIssues([])
  }, [selectedRunId, loadIssues])

  async function runAudit() {
    setRunning(true)
    setError('')
    try {
      const { data, error: err } = await supabase.functions.invoke('seo-audit', { body: { scope: 'all_published' } })
      if (err) throw new Error(err.message)
      if (data?.error) throw new Error(data.error)
      await loadRuns()
      if (data?.run_id) setSelectedRunId(data.run_id)
    } catch (e: any) {
      setError(e.message || 'Failed to run audit')
    }
    setRunning(false)
  }

  const totals = selectedRun?.totals || {}
  const ok = (totals.critical || 0) === 0 && (totals.warning || 0) === 0

  return (
    <div className="p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase">AI CRM</p>
          <h1 className="text-2xl font-semibold text-foreground">SEO Audits</h1>
          <p className="text-sm text-muted-foreground mt-1">Run crawl-like checks for title, description, canonical, and HTTP status across core pages.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => loadRuns()} disabled={loading || running}>
            <RefreshCw className="h-4 w-4 mr-2" />Refresh
          </Button>
          <Button onClick={runAudit} disabled={running}>
            {running ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
            Run audit
          </Button>
        </div>
      </div>

      {error && (
        <Card className="p-4 mb-4 border border-destructive/30 bg-destructive/5">
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4" />{error}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-foreground">Recent runs</p>
            <p className="text-xs text-muted-foreground">{runs.length} shown</p>
          </div>
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs font-mono">Started</TableHead>
                    <TableHead className="text-xs font-mono">Scope</TableHead>
                    <TableHead className="text-xs font-mono">Critical</TableHead>
                    <TableHead className="text-xs font-mono">Warn</TableHead>
                    <TableHead className="text-xs font-mono">Done</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {runs.map(r => (
                    <TableRow
                      key={r.id}
                      className={`cursor-pointer ${selectedRunId === r.id ? 'bg-muted/20' : ''}`}
                      onClick={() => setSelectedRunId(r.id)}
                    >
                      <TableCell className="text-xs font-mono text-muted-foreground">{new Date(r.started_at).toLocaleString()}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{r.scope}</TableCell>
                      <TableCell className="text-xs font-mono">{r.totals?.critical || 0}</TableCell>
                      <TableCell className="text-xs font-mono">{r.totals?.warning || 0}</TableCell>
                      <TableCell className="text-xs">
                        {r.finished_at ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-foreground">Run details</p>
              <p className="text-xs text-muted-foreground">{selectedRun ? `Run ${selectedRun.id.slice(0, 8)}…` : 'Select a run'}</p>
            </div>
            {selectedRun && (
              <div className="flex items-center gap-2">
                {ok
                  ? <Badge variant="secondary" className="bg-green-500/15 text-green-500 text-[0.6rem]">healthy</Badge>
                  : <Badge variant="secondary" className="bg-yellow-500/15 text-yellow-500 text-[0.6rem]">needs work</Badge>
                }
              </div>
            )}
          </div>

          {selectedRun && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Critical</p>
                <p className="text-xl font-mono text-foreground">{totals.critical || 0}</p>
              </div>
              <div className="border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Warnings</p>
                <p className="text-xl font-mono text-foreground">{totals.warning || 0}</p>
              </div>
              <div className="border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Info</p>
                <p className="text-xl font-mono text-foreground">{totals.info || 0}</p>
              </div>
            </div>
          )}

          {!selectedRun ? (
            <div className="text-sm text-muted-foreground py-8">Select an audit run to view issues.</div>
          ) : issuesLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs font-mono">Severity</TableHead>
                    <TableHead className="text-xs font-mono">Code</TableHead>
                    <TableHead className="text-xs font-mono">Message</TableHead>
                    <TableHead className="text-xs font-mono">URL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issues.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-sm text-muted-foreground py-6">No issues found.</TableCell>
                    </TableRow>
                  ) : (
                    issues.map(i => (
                      <TableRow key={i.id}>
                        <TableCell>{severityBadge(i.severity)}</TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">{i.code}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{i.message}</TableCell>
                        <TableCell className="text-xs">
                          <a className="text-primary hover:underline" href={i.url} target="_blank" rel="noreferrer">Open</a>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

