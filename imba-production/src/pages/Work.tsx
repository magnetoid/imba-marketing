import { useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '@/components/Seo'

const CASES = [
  {
    id: '1',
    client: 'FoodCo International',
    category: 'growth',
    service: 'AI Growth Systems',
    headline: '4.2M reach · 38% CTR lift · +89% revenue',
    tags: ['AI', 'Growth'],
    color: '#E8452A',
    desc: 'Built a full-funnel AI growth system from scratch. Automated lead scoring, personalised outreach, and real-time campaign optimisation.',
    results: [
      { label: 'Revenue Growth', val: '+89%' },
      { label: 'CTR Improvement', val: '+38%' },
      { label: 'CPL Reduction', val: '-52%' },
    ],
  },
  {
    id: '2',
    client: 'NordShop',
    category: 'ads',
    service: 'AI Performance Advertising',
    headline: '3× ROAS · $18.40 CPA · -40% cost',
    tags: ['Ads', 'ROAS'],
    color: '#C9A96E',
    desc: 'AI-powered ad system with real-time creative testing across Meta, Google, and TikTok. CPL halved within 6 weeks.',
    results: [
      { label: 'ROAS', val: '4.8×' },
      { label: 'CPA', val: '$18.40' },
      { label: 'Cost Saving', val: '40%' },
    ],
  },
  {
    id: '3',
    client: 'Velour Boutique',
    category: 'content',
    service: 'AI Content Engines',
    headline: '30 days of content in 1 day · +180% engagement',
    tags: ['Content', 'AI'],
    color: '#6C7AE0',
    desc: 'Custom AI content engine generating brand-consistent posts, emails, and ad copy at scale — zero quality compromise.',
    results: [
      { label: 'Content Output', val: '30×' },
      { label: 'Engagement', val: '+180%' },
      { label: 'Time Saved', val: '95%' },
    ],
  },
  {
    id: '4',
    client: 'BrandX',
    category: 'funnel',
    service: 'AI Funnel Optimisation',
    headline: '+62% conversion rate · 2× qualified leads',
    tags: ['Funnel', 'CRO'],
    color: '#3CBFAE',
    desc: 'Funnel audit revealed 4 critical leakage points. AI testing doubled qualified leads in 6 weeks.',
    results: [
      { label: 'Conversion Rate', val: '+62%' },
      { label: 'Qualified Leads', val: '2×' },
      { label: 'Bounce Rate', val: '-34%' },
    ],
  },
  {
    id: '5',
    client: 'Magic Mind',
    category: 'intelligence',
    service: 'AI Data & Intelligence',
    headline: '12 competitor gaps · +28% organic growth',
    tags: ['SEO', 'Intelligence'],
    color: '#C9A96E',
    desc: 'AI market intelligence revealed underserved keyword clusters and audience segments the client had missed entirely.',
    results: [
      { label: 'Organic Growth', val: '+28%' },
      { label: 'New Keywords', val: '340+' },
      { label: 'Competitor Gaps', val: '12' },
    ],
  },
  {
    id: '6',
    client: 'Irving Books',
    category: 'personalisation',
    service: 'AI Personalisation',
    headline: '5× email CTR · +67% email conversion',
    tags: ['Email', 'Personalisation'],
    color: '#00D4FF',
    desc: 'Dynamic AI personalisation across email and website surfaces. Behavioural triggers and predictive segments drove massive uplifts.',
    results: [
      { label: 'Email CTR', val: '5×' },
      { label: 'Email Conv.', val: '+67%' },
      { label: 'LTV Increase', val: '+41%' },
    ],
  },
]

const CATS = [
  { key: 'all',             label: 'All results' },
  { key: 'growth',          label: 'AI Growth' },
  { key: 'ads',             label: 'Performance Ads' },
  { key: 'content',         label: 'Content Engine' },
  { key: 'funnel',          label: 'Funnel CRO' },
  { key: 'intelligence',    label: 'Data & Intel' },
  { key: 'personalisation', label: 'Personalisation' },
]

const STATS = [
  { num: '200+', label: 'Campaigns' },
  { num: '40%',  label: 'Lower CPA' },
  { num: '3×',   label: 'Avg. ROAS' },
  { num: '98%',  label: 'Retention' },
]

export default function Work() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = activeCategory === 'all'
    ? CASES
    : CASES.filter(c => c.category === activeCategory)

  return (
    <>
      <Seo
        title="Client Results — AI Marketing Case Studies"
        description="Real results from real AI marketing systems. Browse case studies across growth, performance advertising, content engines, personalisation, data intelligence, and funnel optimisation."
        canonicalPath="/results"
      />

      {/* ── PAGE HERO ─────────────────────────────────────── */}
      <section className="pt-36 pb-16 px-6 lg:px-12 bg-ink relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />
        <div className="absolute top-0 right-0 w-[40vw] h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 70% at 100% 30%, rgba(232,69,42,0.06) 0%, transparent 65%)' }}
        />
        <div className="relative max-w-screen-xl mx-auto">
          <p className="eyebrow mb-5 reveal">Client case studies</p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h1 className="font-display font-light leading-none reveal reveal-delay-1"
              style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
              Results that prove the<br />
              <em className="text-gold italic">power of AI marketing</em>
            </h1>
            <p className="text-smoke-dim max-w-xs leading-relaxed reveal reveal-delay-2" style={{ fontSize: '0.93rem' }}>
              Every number is real. Every result is from an AI system we designed, built, and deployed.
            </p>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────── */}
      <div className="border-y border-white/6 grid grid-cols-2 lg:grid-cols-4">
        {STATS.map(({ num, label }, i) => (
          <div key={label} className={`px-8 lg:px-10 py-7 ${i < 3 ? 'border-r border-white/6' : ''}`}>
            <div className="font-display font-light text-smoke leading-none" style={{ fontSize: '2.4rem' }}>
              <span>{num.replace(/[+%×]/g, '')}</span>
              <em className="text-ember not-italic">{num.match(/[+%×]/)?.[0] ?? ''}</em>
            </div>
            <div className="font-mono-custom text-[0.58rem] tracking-[0.18em] uppercase text-smoke-faint mt-1.5">{label}</div>
          </div>
        ))}
      </div>

      {/* ── CATEGORY FILTER ───────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-ink/95 border-b border-white/5" style={{ backdropFilter: 'blur(12px)' }}>
        <div className="px-6 lg:px-12 py-4 max-w-screen-xl mx-auto flex gap-1.5 overflow-x-auto">
          {CATS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className="flex-shrink-0 font-mono-custom text-[0.65rem] tracking-[0.12em] uppercase px-4 py-2 transition-all duration-200"
              style={{
                background: activeCategory === key ? '#E8452A' : 'transparent',
                color: activeCategory === key ? '#F5F4F0' : '#6B6A65',
                border: `1px solid ${activeCategory === key ? '#E8452A' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CASE STUDY GRID ───────────────────────────────── */}
      <section className="bg-ink py-12 px-6 lg:px-12">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className="bg-ink p-8 hover:bg-ink-2 transition-colors flex flex-col"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-6 flex-wrap">
                <span className="font-mono-custom text-[0.58rem] tracking-[0.16em] uppercase text-smoke-faint">{item.client}</span>
                <span
                  className="font-mono-custom text-[0.55rem] tracking-[0.12em] uppercase px-2 py-0.5 flex-shrink-0"
                  style={{ color: item.color, background: `${item.color}12`, border: `1px solid ${item.color}25` }}
                >
                  {item.service}
                </span>
              </div>

              {/* Headline */}
              <h3
                className="font-display font-light leading-tight mb-4 flex-1"
                style={{ fontSize: 'clamp(1.3rem, 2vw, 1.8rem)', color: item.color }}
              >
                {item.headline}
              </h3>

              {/* Description */}
              <p className="text-sm text-smoke-dim leading-relaxed mb-6">{item.desc}</p>

              {/* Tags */}
              <div className="flex gap-2 flex-wrap mb-6">
                {item.tags.map(t => (
                  <span key={t} className="font-mono-custom text-[0.55rem] tracking-wider text-smoke-faint/60 uppercase">{t}</span>
                ))}
              </div>

              {/* Result metrics */}
              <div className="pt-5 border-t border-white/5 grid grid-cols-3 gap-3">
                {item.results.map(({ label, val }) => (
                  <div key={label}>
                    <div className="font-display font-light text-xl leading-none mb-1" style={{ color: item.color }}>{val}</div>
                    <div className="font-mono-custom text-[0.52rem] tracking-wide uppercase text-smoke-faint/60 leading-tight">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BAND ─────────────────────────────────────── */}
      <section className="bg-ink-2 py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <p className="eyebrow mb-4">Ready to be next?</p>
            <h2 className="font-display font-light text-smoke leading-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
              Let's build your<br /><em className="text-gold italic">AI growth engine</em>
            </h2>
            <p className="text-smoke-dim mt-3 max-w-md" style={{ fontSize: '0.93rem' }}>
              Every result above started with a free strategy call. Tell us your goals and we'll design a custom AI system — no commitment, 24h reply.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
            <Link to="/contact" className="btn btn-primary">Get a free strategy call</Link>
            <Link to="/services" className="btn btn-ghost">Explore our systems →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
