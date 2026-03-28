import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard, Film, Image, FileText, MessageSquare, LogOut, Loader2,
  FolderOpen, Tag, Upload, Globe, Users, Search, ArrowLeft, ChevronRight, Star,
  Send, Inbox, BarChart2, Settings, Sliders,
} from 'lucide-react'

const NAV_CMS = [
  { to: '/admin/dashboard',       label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/admin/hero-videos',     label: 'Hero Videos',    icon: Film },
  { to: '/admin/portfolio',       label: 'Portfolio',      icon: Image },
  { to: '/admin/media',           label: 'Media Library',  icon: FolderOpen },
  { to: '/admin/blog',            label: 'Blog',           icon: FileText },
  { to: '/admin/blog/categories', label: 'Categories',     icon: Tag },
  { to: '/admin/import',          label: 'Import / Export',icon: Upload },
  { to: '/admin/translations',    label: 'Translations',   icon: Globe },
  { to: '/admin/testimonials',    label: 'Testimonials',   icon: Star },
  { to: '/admin/quotes',          label: 'Quote Requests', icon: MessageSquare },
  { to: '/admin/seo',             label: 'SEO',            icon: Globe },
]

function NavItem({ to, label, icon: Icon, crm = false }: { to: string; label: string; icon: React.ElementType; crm?: boolean }) {
  return (
    <NavLink
      to={to}
      end={to === '/admin/crm'}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
          isActive
            ? crm
              ? 'bg-amber-500/10 text-amber-500 font-medium'
              : 'bg-primary/10 text-primary font-medium'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
        }`
      }
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      {label}
    </NavLink>
  )
}

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [session, setSession] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError('')
    setSigningIn(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setLoginError(error.message)
    setSigningIn(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  )

  if (!session) return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 pb-4">
          <div className="text-2xl font-semibold text-foreground">
            imba<span className="text-primary italic">.</span>admin
          </div>
          <CardTitle className="text-base text-muted-foreground font-normal">
            Sign in to your workspace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@imba.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {loginError && <p className="text-destructive text-sm">{loginError}</p>}
            <Button type="submit" disabled={signingIn} className="w-full">
              {signingIn ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in…</> : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )

  const isCRM = location.pathname.startsWith('/admin/crm')
  const isLanding = location.pathname === '/admin'

  // ── LANDING PAGE — No sidebar, full-width dashboard ──
  if (isLanding) {
    return (
      <div className="min-h-screen bg-background">
        {/* Top bar */}
        <header className="border-b border-border px-8 py-4 flex items-center justify-between">
          <span className="text-xl font-semibold text-foreground">
            imba<span className="text-primary italic">.</span>admin
          </span>
          <button
            onClick={() => supabase.auth.signOut()}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </header>

        {/* Landing content */}
        <div className="max-w-screen-lg mx-auto px-8 py-12">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-10">Choose a workspace to get started.</p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* CMS Card */}
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="group text-left border border-border rounded-xl p-8 hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">CMS</h2>
                  <p className="text-xs text-muted-foreground">Content Management</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Manage blog posts, portfolio, testimonials, hero videos, media library, SEO, and site settings.
              </p>
              <div className="mt-6 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Open CMS <ChevronRight className="h-4 w-4" />
              </div>
            </button>

            {/* CRM Card */}
            <button
              onClick={() => navigate('/admin/crm')}
              className="group text-left border border-border rounded-xl p-8 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground group-hover:text-amber-500 transition-colors">AI CRM</h2>
                  <p className="text-xs text-muted-foreground">Sales & Outreach</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI prospect finder, outreach pipeline, email queue, inbox, analytics, and CRM settings.
              </p>
              <div className="mt-6 flex items-center gap-1 text-sm font-medium text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                Open CRM <ChevronRight className="h-4 w-4" />
              </div>
            </button>
          </div>
        </div>

        <Outlet />
      </div>
    )
  }

  // ── CMS / CRM — With sidebar ──
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-60 bg-card border-r border-border flex flex-col flex-shrink-0">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between gap-2">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            title="Back to home"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="text-sm font-semibold">
              imba<span className={isCRM ? 'text-amber-500 italic' : 'text-primary italic'}>.</span>
              <span className={isCRM ? 'text-amber-500' : 'text-primary'}>{isCRM ? 'crm' : 'cms'}</span>
            </span>
          </button>
          <button
            onClick={() => navigate(isCRM ? '/admin/dashboard' : '/admin/crm')}
            className="flex items-center gap-1 text-[0.65rem] font-mono text-muted-foreground/50 hover:text-muted-foreground transition-colors border border-border rounded px-1.5 py-0.5"
            title={`Switch to ${isCRM ? 'CMS' : 'CRM'}`}
          >
            {isCRM ? 'CMS' : 'CRM'}<ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {/* CMS nav */}
        {!isCRM && (
          <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
            <p className="px-3 py-1 text-[0.6rem] font-mono tracking-widest uppercase text-muted-foreground/40 mb-1">Content</p>
            {NAV_CMS.map(item => (
              <NavItem key={item.to} {...item} />
            ))}
            <Separator className="my-2" />
            <p className="px-3 py-1 text-[0.6rem] font-mono tracking-widest uppercase text-muted-foreground/40 mb-1">Settings</p>
            <NavItem to="/admin/crm/settings" label="CMS & CRM Settings" icon={Sliders} />
          </nav>
        )}

        {/* CRM nav */}
        {isCRM && (
          <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
            <p className="px-3 py-1 text-[0.6rem] font-mono tracking-widest uppercase text-amber-500/40 mb-1">Pipeline</p>
            <NavItem to="/admin/crm" label="Pipeline" icon={Users} crm />
            <Separator className="my-2" />
            <p className="px-3 py-1 text-[0.6rem] font-mono tracking-widest uppercase text-amber-500/40 mb-1">AI Outreach</p>
            <NavItem to="/admin/crm/ai-search" label="Prospect Finder" icon={Search} crm />
            <NavItem to="/admin/crm/outreach" label="Outreach Pipeline" icon={Send} crm />
            <NavItem to="/admin/crm/inbox" label="Inbox" icon={Inbox} crm />
            <Separator className="my-2" />
            <p className="px-3 py-1 text-[0.6rem] font-mono tracking-widest uppercase text-amber-500/40 mb-1">Intelligence</p>
            <NavItem to="/admin/crm/analytics" label="Analytics" icon={BarChart2} crm />
            <NavItem to="/admin/crm/seo" label="SEO Manager" icon={Globe} crm />
            <Separator className="my-2" />
            <p className="px-3 py-1 text-[0.6rem] font-mono tracking-widest uppercase text-amber-500/40 mb-1">Settings</p>
            <NavItem to="/admin/crm/settings" label="Settings" icon={Settings} crm />
          </nav>
        )}

        {/* Sign out */}
        <div className="p-3 border-t border-border">
          <button
            onClick={() => supabase.auth.signOut()}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors w-full"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
