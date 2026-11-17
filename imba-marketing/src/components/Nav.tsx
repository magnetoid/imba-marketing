import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useThemeToggle } from '@/lib/theme'

/*
 * 2026 redesign header: sticky bar with the square lime logo mark, the three
 * service pillars + case studies + about, a light/dark toggle and the
 * "Send an inquiry" CTA. Secondary pages (blog, reviews, gallery, AI projects)
 * live in the footer and the mobile menu.
 */

const PRIMARY = [
  { to: '/services/marketing', label: 'Marketing' },
  { to: '/services/development', label: 'Development' },
  { to: '/services/automation', label: 'Automation' },
  { to: '/results', label: 'Case studies' },
  { to: '/about', label: 'About' },
]

const SECONDARY = [
  { to: '/services', label: 'All services' },
  { to: '/blog', label: 'Blog' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/ai-projects', label: 'AI projects' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

export function Logo({ size = 22 }: { size?: number }) {
  return (
    <span className="font-display font-bold flex items-center gap-2 text-smoke" style={{ fontSize: size, letterSpacing: '-.02em' }}>
      <span aria-hidden="true" className="inline-block bg-brand" style={{ width: size * 0.55, height: size * 0.55 }} />
      imba
    </span>
  )
}

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggle } = useThemeToggle()
  const { pathname } = useLocation()

  useEffect(() => { setMobileOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `py-1.5 border-b-2 transition-colors ${isActive ? 'text-smoke border-brand' : 'text-smoke-dim border-transparent hover:text-smoke'}`

  return (
    <header className="sticky top-0 z-50 bg-ink border-b border-line">
      <div className="wrap py-3.5 flex items-center gap-7">
        <Link to="/" aria-label="Imba Marketing home"><Logo /></Link>

        <nav aria-label="Main" className="hidden lg:flex flex-1 items-center gap-[22px] text-[15px]">
          {PRIMARY.map(({ to, label }) => (
            <NavLink key={to} to={to} className={linkClass}>{label}</NavLink>
          ))}
        </nav>

        <div className="ml-auto lg:ml-0 flex items-center gap-2.5">
          <div className="hidden md:block"><LanguageSwitcher /></div>
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="font-mono-custom text-xs text-smoke-dim hover:text-smoke border border-line px-3 min-h-[40px] transition-colors"
          >
            {theme === 'dark' ? 'LIGHT' : 'DARK'}
          </button>
          {/* wrapper carries the breakpoint: .btn sets display and would override `hidden` */}
          <span className="hidden sm:inline-flex">
            <Link to="/contact" className="btn btn-primary !py-2.5 !px-[18px] !text-[15px] !min-h-[40px]">
              Send an inquiry
            </Link>
          </span>
          <button
            type="button"
            className="lg:hidden flex flex-col justify-center gap-[5px] w-10 h-10 items-center border border-line"
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <span className={`block h-[1.5px] w-5 bg-smoke transition-transform ${mobileOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
            <span className={`block h-[1.5px] w-5 bg-smoke transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-[1.5px] w-5 bg-smoke transition-transform ${mobileOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div id="mobile-menu" className="lg:hidden fixed inset-x-0 top-[69px] bottom-0 bg-ink border-t border-line overflow-y-auto">
          <nav aria-label="Mobile" className="wrap py-6 flex flex-col">
            {PRIMARY.map(({ to, label }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) => `font-display text-3xl font-semibold py-3 border-b border-line ${isActive ? 'text-brand-text' : 'text-smoke'}`}>
                {label}
              </NavLink>
            ))}
            <div className="grid grid-cols-2 gap-x-6 mt-6">
              {SECONDARY.map(({ to, label }) => (
                <NavLink key={to} to={to} className="py-2.5 text-smoke-dim hover:text-smoke">{label}</NavLink>
              ))}
            </div>
            <Link to="/contact" className="btn btn-primary btn-lg mt-8">Send an inquiry →</Link>
            <div className="mt-6"><LanguageSwitcher /></div>
          </nav>
        </div>
      )}
    </header>
  )
}
