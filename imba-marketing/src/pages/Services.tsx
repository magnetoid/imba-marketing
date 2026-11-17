import { Link } from 'react-router-dom'
import Seo from '@/components/Seo'
import { PILLARS } from './services/data'
import { PageHero, CtaBand, CellGrid } from '@/components/site'

const SERVICES = [
  {
    key: 'growth', slug: 'growth',
    icon: '◈',
    label: 'AI Growth Marketing',
    tagline: 'Automated campaigns that get smarter every day',
    desc: 'AI drives your entire marketing engine — automating lead generation, nurturing sequences, and revenue optimization across every channel. Campaigns learn and improve continuously, so your growth compounds without adding headcount.',
    features: ['Marketing automation', 'Lead generation & nurturing', 'Revenue optimization', 'Multi-channel orchestration'],
    stat: '3×',
    statLabel: 'average revenue growth in year one',
    color: '#EF4444',
  },
  {
    key: 'ads', slug: 'ads',
    icon: '▣',
    label: 'AI Performance Ads',
    tagline: 'Every ad dollar optimized by AI in real-time',
    desc: 'AI manages your paid media across Google, Meta, TikTok, and LinkedIn — automatically testing creative, optimizing bids, and reallocating budget to what converts best, in real-time.',
    features: ['Google, Meta, TikTok & LinkedIn ads', 'Real-time ROAS optimization', 'AI creative testing', 'Cross-platform budget allocation'],
    stat: '300%',
    statLabel: 'better return on ad spend',
    color: '#D4A853',
  },
  {
    key: 'personalisation', slug: 'personalisation',
    icon: '◉',
    label: 'AI Personalization',
    tagline: 'Right message, right person, right moment',
    desc: 'AI personalizes every touchpoint in the customer journey — dynamic content, behavioral targeting, email sequences, and on-site experiences — so every visitor gets messaging that resonates.',
    features: ['Dynamic content personalization', 'Behavioral targeting', 'Customer journey mapping', 'Email personalization'],
    stat: '5×',
    statLabel: 'higher engagement than generic messaging',
    color: '#3B82F6',
  },
  {
    key: 'content', slug: 'content',
    icon: '▶',
    label: 'AI Content Production',
    tagline: 'Brand content at scale, zero bottlenecks',
    desc: 'AI produces social posts, email campaigns, ad creatives, blog articles, and product descriptions — all in your brand voice. A full month of content in a single day, with no creative bottlenecks.',
    features: ['Social media content', 'Email & ad copy', 'Blog articles & SEO content', 'Product descriptions'],
    stat: '30×',
    statLabel: 'more content than doing it manually',
    color: '#EF4444',
  },
  {
    key: 'intelligence', slug: 'intelligence',
    icon: '◬',
    label: 'AI Analytics & Intelligence',
    tagline: 'Data-driven decisions, not guesswork',
    desc: 'AI continuously monitors your market — tracking competitors, analyzing customer behavior, identifying emerging trends, and surfacing the insights that actually move the needle for your business.',
    features: ['Market & competitor research', 'Customer behavior insights', 'Trend prediction', 'Performance dashboards'],
    stat: '28%',
    statLabel: 'average growth from new opportunities discovered',
    color: '#D4A853',
  },
  {
    key: 'funnel', slug: 'funnel',
    icon: '◫',
    label: 'AI Conversion Optimization',
    tagline: 'Turn more visitors into customers',
    desc: 'AI analyzes your entire funnel to find where prospects drop off — then fixes it. Smarter landing pages, faster A/B testing, checkout improvements, and behavioral triggers that recover lost conversions.',
    features: ['Funnel analysis & diagnostics', 'AI-powered A/B testing', 'Landing page optimization', 'Checkout & form improvement'],
    stat: '62%',
    statLabel: 'more visitors convert to customers',
    color: '#E87A2A',
  },
]

const PROCESS = [
  { n: '01', title: 'We listen to your goals', desc: 'Tell us what you want to achieve. We\'ll look at your current marketing, find what\'s working and what\'s not, and show you exactly where the biggest opportunities are.' },
  { n: '02', title: 'We build your custom plan', desc: 'No templates. We design a marketing plan tailored to your business, your customers, and your budget. You\'ll know exactly what to expect before we start.' },
  { n: '03', title: 'We set everything up', desc: 'We build and connect everything within 2–4 weeks. Your existing tools keep working — we just make them work better. Zero disruption to your business.' },
  { n: '04', title: 'You see results grow', desc: 'Your marketing gets smarter every day. We keep improving, you keep growing. What starts as early wins turns into lasting, compounding growth.' },
]

export default function Services() {
  return (
    <>
      <Seo
        title="Services — Marketing, Development and Automation"
        description="Marketing, development and automation from one team: paid ads, SEO and content, websites and web apps, and AI agents and workflows. Six AI specialties included."
        canonicalPath="/services"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          'name': 'Imba Marketing Services',
          'url': 'https://imbamarketing.com/services',
          'itemListElement': [...PILLARS.map(p => ({ name: p.label, slug: p.slug })), ...SERVICES.map(s => ({ name: s.label, slug: s.slug }))]
            .map((s, i) => ({ '@type': 'ListItem', 'position': i + 1, 'name': s.name, 'url': `https://imbamarketing.com/services/${s.slug}` })),
        }}
      />

      <PageHero
        kicker="Services"
        title="Three services that work better together."
        lead="Imba runs your campaigns, builds your website or product, and automates the work in between. One team, one brief, one report."
      >
        <Link to="/contact" className="btn btn-primary btn-lg">Send an inquiry →</Link>
      </PageHero>

      {/* Pillars — same cards as the home page */}
      <section className="wrap pb-[clamp(56px,8vw,96px)]">
        <CellGrid min={300}>
          {PILLARS.map(p => (
            <Link key={p.slug} to={`/services/${p.slug}`} className="group p-8 pb-7 border-r border-b border-line flex flex-col gap-4 min-h-[340px] text-smoke hover:bg-ink-2">
              <span className="font-mono-custom text-[13px] text-brand-text">{p.icon}</span>
              <h2 className="font-display font-semibold text-[34px] leading-none tracking-[-.03em] m-0">{p.label}</h2>
              <p className="text-[17px] leading-normal text-smoke-dim m-0 flex-1">{p.heroDesc}</p>
              <span className="font-semibold text-[15px] group-hover:text-brand-text">Explore {p.label.toLowerCase()} →</span>
            </Link>
          ))}
        </CellGrid>
      </section>

      {/* The six AI specialties (existing service pages) */}
      <section className="bg-ink-2 border-y border-line" id="all-services">
        <div className="wrap py-[clamp(56px,8vw,104px)]">
          <div className="kicker mb-5">AI specialties</div>
          <h2 className="h-section m-0 mb-4 max-w-[860px]">AI marketing services that drive real revenue.</h2>
          <p className="lead m-0 mb-12 max-w-[680px]">
            Six AI-powered services that cover every angle of modern marketing — from lead generation and paid media to content production and conversion optimization. Pick what you need, or get everything in one plan.
          </p>
          <CellGrid min={340} className="bg-ink">
            {SERVICES.map(({ key, slug, label, tagline, desc, features, stat, statLabel }, i) => (
              <Link key={key} to={`/services/${slug}`} className="group p-8 border-r border-b border-line flex flex-col gap-3 hover:bg-ink-3">
                <span className="font-mono-custom text-[13px] text-brand-text">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-display font-semibold text-[26px] leading-tight tracking-[-.02em] m-0 text-smoke">{label}</h3>
                <p className="m-0 font-medium text-smoke">{tagline}</p>
                <p className="m-0 text-smoke-dim leading-relaxed">{desc}</p>
                <ul className="list-none m-0 p-0 flex-1">
                  {features.map(f => (
                    <li key={f} className="py-2 border-t border-line text-[15px] flex gap-3 text-smoke">
                      <span aria-hidden="true" className="font-mono-custom text-brand-text">→</span>{f}
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-line flex items-baseline gap-3">
                  <span className="font-display font-semibold text-[28px] text-smoke">{stat}</span>
                  <span className="text-sm text-smoke-dim">{statLabel}</span>
                </div>
                <span className="font-semibold text-[15px] text-smoke group-hover:text-brand-text">See how it works →</span>
              </Link>
            ))}
          </CellGrid>
        </div>
      </section>

      {/* Process + why clients choose us */}
      <section className="wrap py-[clamp(56px,8vw,104px)] grid gap-x-16 gap-y-12 lg:grid-cols-2">
        <div>
          <div className="kicker mb-5">How it works</div>
          <h2 className="h-sub m-0 mb-8">From first call to real results.</h2>
          <ol className="list-none m-0 p-0">
            {PROCESS.map(({ n, title, desc }) => (
              <li key={n} className="grid grid-cols-[48px_minmax(0,1fr)] gap-2 py-5 border-t border-line">
                <span className="font-mono-custom text-[13px] text-brand-text pt-1">{n}</span>
                <div>
                  <h3 className="font-display font-semibold text-[21px] m-0 mb-1.5">{title}</h3>
                  <p className="m-0 text-smoke-dim leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="border border-line bg-ink-2 p-[clamp(24px,3vw,40px)] self-start">
          <div className="kicker-muted mb-4">Why clients choose us</div>
          {[
            { title: 'AI that actually works, 24/7', desc: "Your campaigns learn and optimize around the clock — not just during business hours. Our AI systems compound results while you focus on running your business." },
            { title: 'Every dollar tied to revenue', desc: "No vanity metrics. Every campaign we run is measured by what matters: revenue generated, cost per acquisition, and return on ad spend." },
            { title: 'Transparent, no black boxes', desc: "You see exactly what our AI is doing and why. Clear dashboards, plain-language reporting, and a team that explains the strategy behind every decision." },
            { title: 'US-based, serving brands worldwide', desc: 'Headquartered in Delaware, with an engineering team in Serbia. We work with ambitious brands globally and deliver first results within 48 hours.' },
          ].map(({ title, desc }) => (
            <div key={title} className="py-4 border-t border-line">
              <p className="m-0 mb-1 font-semibold">{title}</p>
              <p className="m-0 text-smoke-dim leading-relaxed text-[15px]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* White label */}
      <section className="border-t border-line">
        <div className="wrap py-[clamp(48px,6vw,72px)] flex flex-wrap gap-8 items-center justify-between">
          <div className="max-w-[640px]">
            <div className="kicker mb-3">For agencies & resellers</div>
            <h2 className="h-sub m-0 mb-3">Offer AI marketing under your own brand.</h2>
            <p className="m-0 text-smoke-dim text-[17px]">You take the credit, we do the work. Add AI marketing to your services without hiring new people or building new tools.</p>
          </div>
          <Link to="/contact" className="btn btn-outline btn-lg">Ask about white label</Link>
        </div>
      </section>

      <CtaBand title="Not sure where to start? Tell us what you need." sub="Free strategy call · No pressure · Plans from $2,900/mo." />
    </>
  )
}

