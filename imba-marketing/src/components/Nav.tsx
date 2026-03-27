import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useQuoteModal } from '@/contexts/QuoteModalContext'

const LINKS = [
  { to: '/services', label: 'Services' },
  { to: '/results', label: 'Results' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { openModal } = useQuoteModal()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 nav-blur border-b transition-all duration-500 ${
          scrolled ? 'py-3 border-white/5' : 'py-5 border-transparent'
        }`}
        style={{ borderColor: scrolled ? 'rgba(255,255,255,0.05)' : 'transparent' }}
      >
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* AI node mark */}
            <div className="relative w-5 h-5 opacity-40 group-hover:opacity-100 transition-all duration-300">
              <div className="absolute inset-0 border border-ember group-hover:border-cyber group-hover:shadow-[0_0_8px_rgba(0,212,255,0.5)] transition-all duration-300" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-ember group-hover:bg-cyber transition-all duration-300" />
            </div>
            <span
              className="font-display font-light tracking-wide text-smoke group-hover:text-smoke transition-colors"
              style={{ fontSize: '1.45rem' }}
            >
              imba<span className="text-ember italic group-hover:text-cyber transition-colors duration-300">.</span><span className="text-smoke-dim group-hover:text-smoke transition-colors duration-300">marketing</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-10">
            {LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `font-mono-custom text-[0.65rem] tracking-[0.18em] uppercase transition-colors ${
                    isActive ? 'text-ember' : 'text-smoke-dim hover:text-smoke'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="font-mono-custom text-[0.6rem] text-smoke-faint tracking-widest opacity-50 select-none">
              <TimecodeDisplay />
            </div>
            <LanguageSwitcher />
            <button onClick={() => openModal()} className="btn btn-primary text-[0.65rem]">
              Book a Call
            </button>
          </div>

          {/* Mobile burger */}
          <button
            className="lg:hidden flex flex-col gap-[6px] p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <span className={`block h-px w-6 bg-smoke transition-all ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block h-px w-6 bg-smoke transition-all ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-px w-6 bg-smoke transition-all ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 nav-blur flex flex-col justify-center px-8 transition-all duration-500 lg:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-8">
          {LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="font-display font-light text-5xl text-smoke hover:text-ember transition-colors"
            >
              {label}
            </NavLink>
          ))}
          <button
            onClick={() => { openModal(); setOpen(false) }}
            className="btn btn-primary self-start mt-4"
          >
            Free growth plan
          </button>
          <div className="mt-2">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </>
  )
}

function TimecodeDisplay() {
  const [time, setTime] = useState(formatTimecode())
  useEffect(() => {
    const t = setInterval(() => setTime(formatTimecode()), 1000)
    return () => clearInterval(t)
  }, [])
  return <>{time}</>
}

function formatTimecode() {
  const n = new Date()
  const pad = (x: number) => String(x).padStart(2, '0')
  return `${pad(n.getHours())}:${pad(n.getMinutes())}:${pad(n.getSeconds())}`
}
