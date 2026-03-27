import { Link } from 'react-router-dom'
import { useQuoteModal } from '@/contexts/QuoteModalContext'

const SERVICES = [
  'AI Growth Marketing',
  'AI Performance Ads',
  'AI Personalization',
  'AI Content Production',
  'AI Analytics & Intelligence',
  'AI Conversion Optimization',
]
const COMPANY = [
  { label: 'About Us', to: '/about' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Client Results', to: '/results' },
  { label: 'Reviews', to: '/reviews' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
]
const SOCIAL = [
  { label: 'LI', href: 'https://linkedin.com/company/imba-marketing' },
  { label: 'X',  href: 'https://twitter.com/imbamarketing' },
  { label: 'IG', href: 'https://instagram.com/imbamarketing' },
  { label: 'YT', href: 'https://youtube.com/@imbamarketing' },
  { label: 'FV', href: 'https://fiverr.com/imbamarketing' },
]

export default function Footer() {
  const { openModal } = useQuoteModal()
  return (
    <footer className="bg-ink-3 border-t border-white/5">
      {/* Top strip */}
      <div className="border-b border-white/5 px-6 lg:px-12 py-6 flex items-center justify-between">
        <p className="font-mono-custom text-[0.6rem] tracking-[0.2em] text-smoke-faint uppercase">
          AI-Powered Marketing Agency — Smarter Campaigns, Real Results
        </p>
        <button onClick={() => openModal()} className="btn btn-primary text-[0.65rem]">
          Book a Strategy Call →
        </button>
      </div>

      {/* Main footer */}
      <div className="px-6 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="font-display font-light text-2xl text-smoke mb-4">
            imba<span className="text-ember italic">.</span>marketing
          </div>
          <p className="text-sm text-smoke-dim leading-relaxed max-w-xs mb-6">
            AI-powered marketing agency for ambitious brands. We build intelligent campaigns that drive revenue, lower costs, and scale faster than traditional marketing.
          </p>
          <div className="flex gap-2">
            {SOCIAL.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 border border-white/10 flex items-center justify-center font-mono-custom text-[0.6rem] text-smoke-dim hover:border-ember hover:text-ember transition-all"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <p className="font-mono-custom text-[0.6rem] tracking-[0.18em] uppercase text-smoke mb-5">What We Do</p>
          <ul className="flex flex-col gap-3">
            {SERVICES.map(s => (
              <li key={s}>
                <Link to="/services" className="text-sm text-smoke-dim hover:text-smoke transition-colors">
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <p className="font-mono-custom text-[0.6rem] tracking-[0.18em] uppercase text-smoke mb-5">Company</p>
          <ul className="flex flex-col gap-3">
            {COMPANY.map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="text-sm text-smoke-dim hover:text-smoke transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="font-mono-custom text-[0.6rem] tracking-[0.18em] uppercase text-smoke mb-5">Contact</p>
          <div className="flex flex-col gap-3 text-sm text-smoke-dim">
            <a href="mailto:hello@imbamarketing.com" className="hover:text-ember transition-colors">
              hello@imbamarketing.com
            </a>
            <p className="leading-relaxed">
              1007 N Orange St, 4th Floor<br />
              Suite #3601<br />
              Wilmington, Delaware 19801<br />
              United States
            </p>
            <p className="leading-relaxed">
              Kragujevac, Serbia<br />
              +1 (650) 226-7172
            </p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/5 px-6 lg:px-12 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="font-mono-custom text-[0.6rem] tracking-[0.1em] text-smoke-faint/50">
          © {new Date().getFullYear()} Imba Marketing LLC. All rights reserved.
        </p>
        <div className="flex gap-6">
          <Link to="/privacy" className="font-mono-custom text-[0.6rem] text-smoke-faint/50 hover:text-smoke-dim transition-colors">
            Privacy Policy
          </Link>
          <Link to="/admin" className="font-mono-custom text-[0.6rem] text-smoke-faint/30 hover:text-smoke-dim transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
