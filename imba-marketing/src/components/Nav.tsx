import { useState, useEffect, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useQuoteModal } from '@/contexts/QuoteModalContext'

const SERVICES = [
  { to: '/services/growth', label: 'AI Growth Marketing', desc: 'Automated campaigns that compound growth', color: '#EF4444' },
  { to: '/services/ads', label: 'AI Performance Ads', desc: 'Cross-platform ROAS optimization', color: '#F59E0B' },
  { to: '/services/personalisation', label: 'AI Personalization', desc: 'Right message, right person, right time', color: '#3B82F6' },
  { to: '/services/content', label: 'AI Content Production', desc: 'Brand content at scale', color: '#EF4444' },
  { to: '/services/intelligence', label: 'AI Analytics & Intelligence', desc: 'Data-driven decisions', color: '#F59E0B' },
  { to: '/services/funnel', label: 'AI Conversion Optimization', desc: 'Turn visitors into customers', color: '#3B82F6' },
]

const COMPANY = [
  { to: '/about', label: 'About Us', desc: 'Our team, mission, and values' },
  { to: '/results', label: 'Client Results', desc: 'Real numbers from real brands' },
  { to: '/reviews', label: 'Reviews', desc: 'What our clients say' },
  { to: '/blog', label: 'Blog', desc: 'AI marketing insights & guides' },
  { to: '/contact', label: 'Contact', desc: 'Book a call or send a message' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaMenu, setMegaMenu] = useState<string | null>(null)
  const megaRef = useRef<HTMLDivElement>(null)
  const { openModal } = useQuoteModal()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Close mega menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaMenu(null)
      }
    }
    if (megaMenu) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [megaMenu])

  // Close mega menu on route change
  function closeMega() { setMegaMenu(null) }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 nav-blur transition-all duration-300 ${
          scrolled ? 'py-3 border-b border-zinc-800/80' : 'py-5 border-b border-transparent'
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 flex items-center justify-between" ref={megaRef}>

          {/* Logo */}
          <Link to="/" className="flex items-center group" onClick={closeMega}>
            <span className="font-semibold text-xl text-white tracking-tight">
              imba<span className="font-normal text-zinc-500">.marketing</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Services — mega menu trigger */}
            <button
              onMouseEnter={() => setMegaMenu('services')}
              onClick={() => setMegaMenu(megaMenu === 'services' ? null : 'services')}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1 ${
                megaMenu === 'services' ? 'text-white bg-zinc-800/60' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Services
              <svg width="10" height="10" viewBox="0 0 10 10" className={`transition-transform duration-200 ${megaMenu === 'services' ? 'rotate-180' : ''}`}>
                <path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            </button>

            {/* Company — mega menu trigger */}
            <button
              onMouseEnter={() => setMegaMenu('company')}
              onClick={() => setMegaMenu(megaMenu === 'company' ? null : 'company')}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1 ${
                megaMenu === 'company' ? 'text-white bg-zinc-800/60' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Company
              <svg width="10" height="10" viewBox="0 0 10 10" className={`transition-transform duration-200 ${megaMenu === 'company' ? 'rotate-180' : ''}`}>
                <path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            </button>

            {/* Blog — direct link */}
            <NavLink
              to="/blog"
              onClick={closeMega}
              className={({ isActive }) =>
                `text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-zinc-400 hover:text-white'
                }`
              }
            >
              Blog
            </NavLink>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            <Link to="/contact" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-4 py-2">
              Contact
            </Link>
            <button
              onClick={() => { openModal(); closeMega() }}
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-red-500/20"
            >
              Book a Call
            </button>
          </div>

          {/* Mobile burger */}
          <button
            className="lg:hidden flex flex-col gap-[5px] p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span className={`block h-[1.5px] w-5 bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
            <span className={`block h-[1.5px] w-5 bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-[1.5px] w-5 bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
          </button>
        </div>

        {/* ═══ MEGA MENU — SERVICES ═══ */}
        <div
          onMouseLeave={() => setMegaMenu(null)}
          className={`absolute left-0 right-0 top-full transition-all duration-300 overflow-hidden ${
            megaMenu === 'services'
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="bg-zinc-950/98 backdrop-blur-2xl border-b border-zinc-800/80">
            <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-8">
              <div className="grid lg:grid-cols-[2fr_1fr] gap-10">
                {/* Services grid */}
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-5">Our AI Marketing Services</p>
                  <div className="grid sm:grid-cols-2 gap-1">
                    {SERVICES.map(({ to, label, desc, color }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={closeMega}
                        className="group flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-800/50 transition-colors"
                      >
                        <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: color }} />
                        <div>
                          <p className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors">{label}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* CTA side panel */}
                <div className="hidden lg:flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/10">
                  <div>
                    <p className="text-lg font-bold text-white mb-2">Not sure which service?</p>
                    <p className="text-sm text-zinc-400 leading-relaxed">Book a free strategy call. We'll audit your marketing and recommend the right AI systems for your goals.</p>
                  </div>
                  <button
                    onClick={() => { openModal(); closeMega() }}
                    className="mt-6 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all w-full"
                  >
                    Book a Free Strategy Call →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ MEGA MENU — COMPANY ═══ */}
        <div
          onMouseLeave={() => setMegaMenu(null)}
          className={`absolute left-0 right-0 top-full transition-all duration-300 overflow-hidden ${
            megaMenu === 'company'
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="bg-zinc-950/98 backdrop-blur-2xl border-b border-zinc-800/80">
            <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-8">
              <div className="grid lg:grid-cols-[2fr_1fr] gap-10">
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-5">Company</p>
                  <div className="grid sm:grid-cols-2 gap-1">
                    {COMPANY.map(({ to, label, desc }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={closeMega}
                        className="group flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-800/50 transition-colors"
                      >
                        <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-zinc-600" />
                        <div>
                          <p className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors">{label}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Stats panel */}
                <div className="hidden lg:block p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/60">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-5">By The Numbers</p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { num: '3×', label: 'Revenue Growth' },
                      { num: '4.8×', label: 'Avg. ROAS' },
                      { num: '200+', label: 'Clients' },
                      { num: '98%', label: 'Retention' },
                    ].map(({ num, label }) => (
                      <div key={label}>
                        <div className="text-2xl font-extrabold text-white">{num}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ═══ MOBILE MENU ═══ */}
      <div
        className={`fixed inset-0 z-40 bg-zinc-950/98 backdrop-blur-xl flex flex-col pt-24 px-6 pb-8 overflow-y-auto transition-all duration-500 lg:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Mobile Services */}
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Services</p>
        <div className="flex flex-col gap-1 mb-8">
          {SERVICES.map(({ to, label, color }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-zinc-800/50 transition-colors"
            >
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
              <span className="text-lg font-semibold text-white">{label}</span>
            </Link>
          ))}
        </div>

        {/* Mobile Company */}
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Company</p>
        <div className="flex flex-col gap-1 mb-8">
          {COMPANY.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className="py-3 px-2 text-lg font-semibold text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/50 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-auto">
          <button
            onClick={() => { openModal(); setMobileOpen(false) }}
            className="w-full bg-red-500 hover:bg-red-600 text-white text-base font-semibold px-6 py-4 rounded-xl transition-all"
          >
            Book a Strategy Call
          </button>
          <div className="mt-4 flex justify-center">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </>
  )
}
