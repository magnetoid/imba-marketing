import { Link } from 'react-router-dom'
import { Logo } from '@/components/Nav'

/*
 * 2026 redesign footer. Keeps every link, address and social profile the old
 * footer carried; restyled to the flat, bordered look of the new design.
 */

const SERVICES = [
  { label: 'Marketing', to: '/services/marketing' },
  { label: 'Development', to: '/services/development' },
  { label: 'Automation', to: '/services/automation' },
  { label: 'All services', to: '/services' },
]
const SPECIALTIES = [
  { label: 'AI Growth Marketing', to: '/services/growth' },
  { label: 'AI Performance Ads', to: '/services/ads' },
  { label: 'AI Personalization', to: '/services/personalisation' },
  { label: 'AI Content Production', to: '/services/content' },
  { label: 'AI Analytics & Intelligence', to: '/services/intelligence' },
  { label: 'AI Conversion Optimization', to: '/services/funnel' },
]
const COMPANY = [
  { label: 'About', to: '/about' },
  { label: 'Case studies', to: '/results' },
  { label: 'Reviews', to: '/reviews' },
  { label: 'AI projects', to: '/ai-projects' },
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

function Col({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <p className="kicker-muted mb-4">{title}</p>
      <ul className="flex flex-col gap-2.5">
        {links.map(({ label, to }) => (
          <li key={to}><Link to={to} className="text-[15px] text-smoke-dim hover:text-smoke transition-colors">{label}</Link></li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="wrap py-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.3fr_1fr]">
        <div>
          <Link to="/" aria-label="Imba Marketing home" className="inline-block mb-4"><Logo size={20} /></Link>
          <p className="text-[15px] text-smoke-dim leading-relaxed max-w-xs mb-6">
            AI-powered marketing agency. We run your campaigns, build your website or product, and automate the work in between.
          </p>
          <div className="text-[15px] text-smoke-dim leading-relaxed flex flex-col gap-3">
            <a href="mailto:hello@imbamarketing.com" className="text-smoke hover:text-brand-text">hello@imbamarketing.com</a>
            <p>1007 N Orange St, 4th Floor, Suite #3601<br />Wilmington, Delaware 19801, United States</p>
            <p>Kragujevac, Serbia<br />+1 (650) 226-7172</p>
          </div>
        </div>
        <Col title="Services" links={SERVICES} />
        <Col title="AI specialties" links={SPECIALTIES} />
        <Col title="Company" links={COMPANY} />
      </div>

      <div className="border-t border-line">
        <div className="wrap py-6 flex flex-wrap gap-x-8 gap-y-4 items-center justify-between text-[15px] text-smoke-dim">
          <span className="font-display font-bold text-lg text-smoke">imba marketing</span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {SOCIAL.map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="hover:text-smoke">{label}</a>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 items-center">
            <span>&copy; {new Date().getFullYear()} Imba Marketing LLC</span>
            <Link to="/privacy" className="hover:text-smoke">Privacy</Link>
            {/* Full page load: admin runs in its own (always dark) shell */}
            <a href="/admin" className="hover:text-smoke">Admin</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
