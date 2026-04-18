import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import type { PortfolioItem } from '@/lib/supabase'
import Seo from '@/components/Seo'

/* ── category labels & colours (matches PortfolioAdmin) ──── */
const CAT_META: Record<string, { label: string; color: string }> = {
  growth:          { label: 'Growth',          color: '#E8452A' },
  ads:             { label: 'Performance Ads', color: '#C9A96E' },
  content:         { label: 'Content',         color: '#6C7AE0' },
  funnel:          { label: 'Conversion',      color: '#3CBFAE' },
  intelligence:    { label: 'Intelligence',    color: '#C9A96E' },
  personalisation: { label: 'Personalization', color: '#00D4FF' },
}

const CATS = [
  { key: 'all',             label: 'All results' },
  { key: 'growth',          label: 'Growth' },
  { key: 'ads',             label: 'Performance Ads' },
  { key: 'content',         label: 'Content' },
  { key: 'funnel',          label: 'Conversion' },
  { key: 'intelligence',    label: 'Intelligence' },
  { key: 'personalisation', label: 'Personalization' },
]

/* ── hardcoded fallback — shown only when DB is empty/unreachable ── */
const FALLBACK_CASES: PortfolioItem[] = [
  {
    id: '1', title: '$40K → $120K/mo in 90 days', slug: 'foodco-growth', category: 'growth',
    client_name: 'FoodCo International', tags: ['Shopify', 'Revenue'],
    description: 'A Shopify food brand stuck at $40K/mo. We rebuilt their product ad strategy, automated email flows (welcome, cart recovery, post-purchase), and tripled their monthly revenue in one quarter.',
    results: { 'Revenue Growth': '+200%', 'Email Revenue': '+38%', 'Lower CPA': '-52%' },
    featured: true, published: true, sort_order: 0, created_at: '',
  },
  {
    id: '2', title: 'Every $1 in ads → $4.80 back', slug: 'nordshop-ads', category: 'ads',
    client_name: 'NordShop', tags: ['Google Shopping', 'Meta Ads'],
    description: 'An e-commerce store burning $8K/mo on ads with barely any return. We rebuilt their Google Shopping and Meta campaigns — AI testing 200+ product ad variations to find what converts.',
    results: { 'ROAS': '4.8×', 'Cost Per Order': '$18.40', 'Ad Spend Saved': '40%' },
    featured: true, published: true, sort_order: 1, created_at: '',
  },
  {
    id: '3', title: '30 days of content in 1 day', slug: 'velour-content', category: 'content',
    client_name: 'Velour Boutique', tags: ['Fashion', 'Content'],
    description: 'A fashion e-commerce brand drowning in content needs — product photos, Instagram posts, email campaigns. AI now creates a full month of on-brand content for 500+ SKUs in a single session.',
    results: { 'Content Output': '30×', 'Engagement': '+180%', 'Time Saved': '95%' },
    featured: false, published: true, sort_order: 2, created_at: '',
  },
  {
    id: '4', title: '62% more trial-to-paid conversions', slug: 'brandx-funnel', category: 'funnel',
    client_name: 'BrandX', tags: ['SaaS', 'Conversion'],
    description: 'A B2B SaaS company with a 1.2% trial conversion rate — plenty of signups but abysmal activation. We optimized the onboarding funnel, rebuilt landing pages, and added AI-driven nurture sequences.',
    results: { 'Conversion Rate': '+62%', 'Lead Quality': '2×', 'Bounce Rate': '-34%' },
    featured: false, published: true, sort_order: 3, created_at: '',
  },
  {
    id: '5', title: '28% organic growth, 340 new keywords', slug: 'magicmind-intelligence', category: 'intelligence',
    client_name: 'Magic Mind', tags: ['Health & Wellness', 'DTC'],
    description: "A health and wellness DTC brand missing massive search opportunities. AI found 340+ keywords their competitors weren't targeting — plus market gaps they could exploit to grow organically.",
    results: { 'Organic Growth': '+28%', 'New Keywords': '340+', 'Competitor Gaps': '12' },
    featured: false, published: true, sort_order: 4, created_at: '',
  },
  {
    id: '6', title: '5× lead quality, 67% more closed deals', slug: 'irving-personalisation', category: 'personalisation',
    client_name: 'Irving & Partners', tags: ['Professional Services', 'Lead Gen'],
    description: 'A professional services firm sending generic outreach to everyone. AI now personalizes every touchpoint — targeting prospects based on intent signals, firmographics, and engagement history.',
    results: { 'Lead Quality': '5×', 'Closed Deals': '+67%', 'Client LTV': '+41%' },
    featured: false, published: true, sort_order: 5, created_at: '',
  },
]

const STATS = [
  { num: '200+', label: 'Clients' },
  { num: '4.8×', label: 'Avg. ROAS' },
  { num: '3×',   label: 'Revenue Growth' },
  { num: '98%',  label: 'Retention' },
]

export default function Work() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    supabase
      .from('portfolio_items')
      .select('*')
      .eq('published', true)
      .order('sort_order')
      .then(({ data, error }) => {
        setItems(!error && data?.length ? data : FALLBACK_CASES)
        setLoaded(true)
      })
  }, [])

  const cases = loaded ? items : FALLBACK_CASES
  const filtered = activeCategory === 'all'
    ? cases
    : cases.filter(c => c.category === activeCategory)

  return (
    <>
      <Seo
        title="Client Results — AI Marketing Case Studies"
        description="See how we've helped brands triple revenue, cut ad costs by 40%, and scale with AI. Real numbers from real businesses across industries."
        canonicalPath="/results"
      />

      {/* ── PAGE HERO ─────────────────────────────────────── */}
      <section className="pt-36 pb-16 px-6 lg:px-12 bg-ink relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40vw] h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 70% at 100% 30%, rgba(232,69,42,0.06) 0%, transparent 65%)' }}
        />
        <div className="relative max-w-screen-xl mx-auto">
          <p className="eyebrow mb-5 reveal">Real client results</p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h1 className="font-display font-light leading-none reveal reveal-delay-1"
              style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
              Real results from<br />
              <em className="text-[#D4A853] italic">AI-powered marketing</em>
            </h1>
            <p className="text-smoke-dim max-w-xs leading-relaxed reveal reveal-delay-2" style={{ fontSize: '0.93rem' }}>
              Every number is real. Every result is from a brand we actually helped grow — across e-commerce, SaaS, services, and more.
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
          {filtered.map((item, i) => {
            const meta = CAT_META[item.category] || { label: item.category, color: '#E8452A' }
            const results = item.results ? Object.entries(item.results) : []
            return (
              <div
                key={item.id}
                className="bg-ink p-8 hover:bg-ink-2 transition-colors flex flex-col reveal"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-6 flex-wrap">
                  <span className="font-mono-custom text-[0.58rem] tracking-[0.16em] uppercase text-smoke-faint">{item.client_name}</span>
                  <span
                    className="font-mono-custom text-[0.55rem] tracking-[0.12em] uppercase px-2 py-0.5 flex-shrink-0"
                    style={{ color: meta.color, background: `${meta.color}12`, border: `1px solid ${meta.color}25` }}
                  >
                    {meta.label}
                  </span>
                </div>

                {/* Headline */}
                <h3
                  className="font-display font-light leading-tight mb-4 flex-1"
                  style={{ fontSize: 'clamp(1.3rem, 2vw, 1.8rem)', color: meta.color }}
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-smoke-dim leading-relaxed mb-6">{item.description}</p>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-6">
                    {item.tags.map(t => (
                      <span key={t} className="font-mono-custom text-[0.55rem] tracking-wider text-smoke-faint/60 uppercase">{t}</span>
                    ))}
                  </div>
                )}

                {/* Result metrics */}
                {results.length > 0 && (
                  <div className="pt-5 border-t border-white/5 grid grid-cols-3 gap-3">
                    {results.map(([label, val]) => (
                      <div key={label}>
                        <div className="font-display font-light text-xl leading-none mb-1" style={{ color: meta.color }}>{val}</div>
                        <div className="font-mono-custom text-[0.52rem] tracking-wide uppercase text-smoke-faint/60 leading-tight">{label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── CTA BAND ─────────────────────────────────────── */}
      <section className="bg-ink-2 py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <p className="eyebrow mb-4">Want results like these?</p>
            <h2 className="font-display font-light text-smoke leading-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
              Let's build your<br /><em className="text-[#D4A853] italic">growth plan</em>
            </h2>
            <p className="text-smoke-dim mt-3 max-w-md" style={{ fontSize: '0.93rem' }}>
              Every result above started with a free conversation. Tell us your goals and we'll show you exactly how we'd help — no commitment, no pressure.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
            <Link to="/contact" className="btn btn-primary">Get your free growth plan</Link>
            <Link to="/services" className="btn btn-ghost">See what we do →</Link>
          </div>
        </div>
      </section>
    </>
  )
}
