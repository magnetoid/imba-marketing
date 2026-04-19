import { Link } from 'react-router-dom'

const SERVICES = [
  { label: 'AI Growth Marketing', to: '/services/growth' },
  { label: 'AI Performance Ads', to: '/services/ads' },
  { label: 'AI Personalization', to: '/services/personalisation' },
  { label: 'AI Content Production', to: '/services/content' },
  { label: 'AI Analytics & Intelligence', to: '/services/intelligence' },
  { label: 'AI Conversion Optimization', to: '/services/funnel' },
]
const COMPANY = [
  { label: 'About Us', to: '/about' },
  { label: 'Client Results', to: '/results' },
  { label: 'Reviews', to: '/reviews' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
]
const SOCIAL = [
  { label: 'LinkedIn', href: 'https://linkedin.com/company/imba-marketing' },
  { label: 'X / Twitter', href: 'https://twitter.com/imbamarketing' },
  { label: 'Instagram', href: 'https://instagram.com/imbamarketing' },
  { label: 'YouTube', href: 'https://youtube.com/@imbamarketing' },
  { label: 'Fiverr', href: 'https://fiverr.com/imbamarketing' },
]

export default function Footer() {
  return (
    <footer className="bg-ink border-t border-white/5">

      {/* Main grid */}
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 py-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Brand */}
        <div>
          <Link to="/" className="inline-block mb-4">
            <span className="font-display font-light text-2xl text-smoke">
              imba<span className="font-normal text-smoke-faint">.marketing</span>
            </span>
          </Link>
          <p className="text-sm text-smoke-faint leading-relaxed max-w-xs mb-6">
            AI-powered marketing agency for ambitious brands. Intelligent campaigns that drive revenue and scale faster.
          </p>
          <div className="flex flex-col gap-2">
            {SOCIAL.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-smoke-faint hover:text-smoke transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <p className="text-sm font-semibold text-smoke uppercase tracking-wider mb-5">
            Services
          </p>
          <ul className="flex flex-col gap-3">
            {SERVICES.map(({ label: sLabel, to }) => (
              <li key={sLabel}>
                <Link
                  to={to}
                  className="text-sm text-smoke-faint hover:text-smoke transition-colors duration-200"
                >
                  {sLabel}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <p className="text-sm font-semibold text-smoke uppercase tracking-wider mb-5">
            Company
          </p>
          <ul className="flex flex-col gap-3">
            {COMPANY.map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="text-sm text-smoke-faint hover:text-smoke transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-sm font-semibold text-smoke uppercase tracking-wider mb-5">
            Contact
          </p>
          <div className="flex flex-col gap-3 text-sm text-smoke-faint">
            <a
              href="mailto:hello@imbamarketing.com"
              className="hover:text-smoke transition-colors duration-200"
            >
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

      {/* Quick links bar */}
      <div className="border-t border-white/5 max-w-screen-xl mx-auto px-6 lg:px-12 py-6">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-5">
          {[
            { label: 'Home', to: '/' },
            { label: 'Services', to: '/services' },
            { label: 'Results', to: '/results' },
            { label: 'Reviews', to: '/reviews' },
            { label: 'Gallery', to: '/gallery' },
            { label: 'Blog', to: '/blog' },
            { label: 'About', to: '/about' },
            { label: 'Contact', to: '/contact' },
          ].map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="text-sm text-smoke-faint hover:text-smoke transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-smoke-faint">
            &copy; {new Date().getFullYear()} Imba Marketing LLC. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="text-sm text-smoke-faint hover:text-smoke-dim transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              to="/admin"
              className="text-sm text-smoke-faint hover:text-smoke-dim transition-colors duration-200"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
