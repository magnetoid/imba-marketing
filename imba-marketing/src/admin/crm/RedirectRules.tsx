import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Loader2, Plus, Trash2, Download, Link2 } from 'lucide-react'

type RedirectRule = {
  id: string
  from_path: string
  to_path: string
  status_code: number
  enabled: boolean
  created_at: string
}

const EMPTY = { from_path: '', to_path: '', status_code: 301, enabled: true }

function normalizePath(p: string) {
  const s = p.trim()
  if (!s) return ''
  if (s.startsWith('http://') || s.startsWith('https://')) return s
  return s.startsWith('/') ? s : `/${s}`
}

export default function RedirectRules() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [rows, setRows] = useState<RedirectRule[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)

  async function load() {
    setLoading(true)
    setError('')
    const { data, error: err } = await supabase.from('redirect_rules').select('*').order('created_at', { ascending: false })
    if (err) setError(err.message)
    setRows((data as any) || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const csv = useMemo(() => {
    const header = 'from_path,to_path,status_code,enabled'
    const lines = rows.map(r => {
      const f = JSON.stringify(r.from_path)
      const t = JSON.stringify(r.to_path)
      return `${f},${t},${r.status_code},${r.enabled}`
    })
    return [header, ...lines].join('\n')
  }, [rows])

  function downloadCsv() {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'redirect_rules.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  async function saveRule(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const from_path = normalizePath(form.from_path)
    const to_path = normalizePath(form.to_path)
    if (!from_path || !to_path) {
      setError('Both From and To paths are required')
      return
    }
    if (from_path === to_path) {
      setError('From and To paths must be different')
      return
    }

    setSaving(true)
    const payload = {
      from_path,
      to_path,
      status_code: form.status_code || 301,
      enabled: !!form.enabled,
    }

    const { error: err } = await supabase.from('redirect_rules').insert([payload])
    setSaving(false)
    if (err) {
      setError(err.message)
      return
    }
    setOpen(false)
    setForm(EMPTY)
    load()
  }

  async function toggleEnabled(id: string, enabled: boolean) {
    await supabase.from('redirect_rules').update({ enabled }).eq('id', id)
    load()
  }

  async function removeRule(id: string) {
    if (!confirm('Delete this redirect rule?')) return
    await supabase.from('redirect_rules').delete().eq('id', id)
    load()
  }

  return (
    <div className="p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase">AI CRM</p>
          <h1 className="text-2xl font-semibold text-foreground">Redirect Rules</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage redirects and export rules for your platform (Cloudflare/Coolify/Traefik).</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadCsv} disabled={rows.length === 0}>
            <Download className="h-4 w-4 mr-2" />Export CSV
          </Button>
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />New rule
          </Button>
        </div>
      </div>

      {error && (
        <Card className="p-4 mb-4 border border-destructive/30 bg-destructive/5">
          <div className="text-sm text-destructive">{error}</div>
        </Card>
      )}

      <Card className="p-4">
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-mono">From</TableHead>
                  <TableHead className="text-xs font-mono">To</TableHead>
                  <TableHead className="text-xs font-mono">Code</TableHead>
                  <TableHead className="text-xs font-mono">Enabled</TableHead>
                  <TableHead className="text-xs font-mono text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-sm text-muted-foreground py-6">No redirect rules yet.</TableCell>
                  </TableRow>
                ) : (
                  rows.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="text-xs font-mono text-muted-foreground">{r.from_path}</TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">{r.to_path}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[0.6rem] font-mono">{r.status_code}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch checked={r.enabled} onCheckedChange={(c) => toggleEnabled(r.id, c)} />
                          <span className="text-xs text-muted-foreground">{r.enabled ? 'on' : 'off'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={r.to_path.startsWith('http') ? r.to_path : r.to_path}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted"
                            title="Open target"
                          >
                            <Link2 className="h-4 w-4" />
                          </a>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => removeRule(r.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New redirect</DialogTitle>
          </DialogHeader>
          <form onSubmit={saveRule} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>From path</Label>
              <Input value={form.from_path} onChange={(e) => setForm(f => ({ ...f, from_path: e.target.value }))} placeholder="/old-page" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>To path</Label>
              <Input value={form.to_path} onChange={(e) => setForm(f => ({ ...f, to_path: e.target.value }))} placeholder="/new-page" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Status code</Label>
                <Input
                  type="number"
                  value={form.status_code}
                  onChange={(e) => setForm(f => ({ ...f, status_code: Number(e.target.value || 301) }))}
                  min={300}
                  max={399}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch checked={form.enabled} onCheckedChange={(c) => setForm(f => ({ ...f, enabled: c }))} />
                <span className="text-sm text-muted-foreground">Enabled</span>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

