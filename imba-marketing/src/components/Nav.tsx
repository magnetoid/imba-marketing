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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 nav-blur transition-all duration-300 ${
          scrolled
            ? 'py-3 border-b border-zinc-800/80'
            : 'py-5 border-b border-transparent'
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12 flex items-center justify-between">

          {/* Logo — text only */}
          <Link to="/" className="flex items-center group">
            <span className="font-semibold text-xl text-white tracking-tight">
              imba<span className="font-normal text-zinc-500">.marketing</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-8">
            {LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-zinc-400 hover:text-white'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={() => openModal()}
              className="btn-primary text-sm font-medium px-5 py-2 rounded-lg"
            >
              Book a Call
            </button>
          </div>

          {/* Mobile burger */}
          <button
            className="lg:hidden flex flex-col gap-[5px] p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <span
              className={`block h-[1.5px] w-5 bg-white transition-all duration-300 ${
                open ? 'rotate-45 translate-y-[6.5px]' : ''
              }`}
            />
            <span
              className={`block h-[1.5px] w-5 bg-white transition-all duration-300 ${
                open ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-[1.5px] w-5 bg-white transition-all duration-300 ${
                open ? '-rotate-45 -translate-y-[6.5px]' : ''
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu — full-screen overlay */}
      <div
        className={`fixed inset-0 z-40 bg-zinc-950/95 backdrop-blur-xl flex flex-col justify-center px-8 transition-all duration-500 lg:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-6">
          {LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `text-4xl font-bold transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-zinc-500 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <button
            onClick={() => { openModal(); setOpen(false) }}
            className="btn-primary text-base font-medium px-6 py-3 rounded-lg self-start mt-6"
          >
            Book a Call
          </button>
          <div className="mt-4">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </>
  )
}
