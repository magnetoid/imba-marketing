import { useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '@/components/Seo'

const CASES = [
  {
    id: '1',
    client: 'FoodCo International',
    category: 'growth',
    service: 'Shopify Growth',
    headline: '$40K → $120K/mo in 90 days',
    tags: ['Shopify', 'Revenue'],
    color: '#E8452A',
    desc: 'A Shopify food brand stuck at $40K/mo. We rebuilt their product ad strategy, automated email flows (welcome, cart recovery, post-purchase), and tripled their monthly revenue in one quarter.',
    results: [
      { label: 'Revenue Growth', val: '+200%' },
      { label: 'Email Revenue', val: '+38%' },
      { label: 'Lower CPA', val: '-52%' },
    ],
  },
  {
    id: '2',
    client: 'NordShop',
    category: 'ads',
    service: 'Product Ads',
    headline: 'Every $1 in ads → $4.80 back',
    tags: ['Google Shopping', 'Meta Ads'],
    color: '#C9A96E',
    desc: 'An e-commerce store burning $8K/mo on ads with barely any return. We rebuilt their Google Shopping and Meta campaigns — AI testing 200+ product ad variations to find what converts.',
    results: [
      { label: 'ROAS', val: '4.8×' },
      { label: 'Cost Per Order', val: '$18.40' },
      { label: 'Ad Spend Saved', val: '40%' },
    ],
  },
  {
    id: '3',
    client: 'Velour Boutique',
    category: 'content',
    service: 'Product Content',
    headline: '30 days of content in 1 day',
    tags: ['Fashion', 'Content'],
    color: '#6C7AE0',
    desc: 'A fashion e-commerce brand drowning in content needs — product photos, Instagram posts, email campaigns. AI now creates a full month of on-brand content for 500+ SKUs in a single session.',
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
    service: 'Checkout CRO',
    headline: '62% more checkout completions',
    tags: ['Conversion', 'Checkout'],
    color: '#3CBFAE',
    desc: 'A WooCommerce store with a 1.2% conversion rate — plenty of traffic but abysmal checkout completion. We optimized product pages, simplified checkout, and added smart cart recovery.',
    results: [
      { label: 'Conversion Rate', val: '+62%' },
      { label: 'Cart Recovery', val: '2×' },
      { label: 'Bounce Rate', val: '-34%' },
    ],
  },
  {
    id: '5',
    client: 'Magic Mind',
    category: 'intelligence',
    service: 'Product Intel',
    headline: '28% organic growth, 340 new keywords',
    tags: ['DTC', 'SEO'],
    color: '#C9A96E',
    desc: 'A DTC supplement brand missing massive search opportunities. AI found 340+ product keywords their competitors weren\'t targeting — plus pricing gaps they could exploit.',
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
    service: 'Email Personalization',
    headline: '5× email CTR, 67% more email sales',
    tags: ['Email', 'Personalization'],
    color: '#00D4FF',
    desc: 'An online bookstore sending the same emails to everyone. AI now personalizes every email — recommending books based on browsing history, past purchases, and reading preferences.',
    results: [
      { label: 'Email CTR', val: '5×' },
      { label: 'Email Revenue', val: '+67%' },
      { label: 'Customer LTV', val: '+41%' },
    ],
  },
]

const CATS = [
  { key: 'all',             label: 'All results' },
  { key: 'growth',          label: 'Store Growth' },
  { key: 'ads',             label: 'Product Ads' },
  { key: 'content',         label: 'Content' },
  { key: 'funnel',          label: 'Checkout CRO' },
  { key: 'intelligence',    label: 'Market Intel' },
  { key: 'personalisation', label: 'Personalization' },
]

const STATS = [
  { num: '200+', label: 'E-commerce clients' },
  { num: '4.8×', label: 'Avg. ROAS' },
  { num: '3×',   label: 'Avg. revenue growth' },
  { num: '98%',  label: 'Clients stay with us' },
]

export default function Work() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = activeCategory === 'all'
    ? CASES
    : CASES.filter(c => c.category === activeCategory)

  return (
    <>
      <Seo
        title="Client Results — Real E-Commerce Growth Stories"
        description="See how we've helped online stores triple revenue, cut ad costs by 40%, and scale with AI. Real numbers from real e-commerce brands."
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
          <p className="eyebrow mb-5 reveal">Real client results</p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h1 className="font-display font-light leading-none reveal reveal-delay-1"
              style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
              Real numbers from<br />
              <em className="text-gold italic">real online stores</em>
            </h1>
            <p className="text-smoke-dim max-w-xs leading-relaxed reveal reveal-delay-2" style={{ fontSize: '0.93rem' }}>
              Every number is real. Every result is from an e-commerce brand we actually helped grow. Shopify, WooCommerce, and custom stores.
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
            <p className="eyebrow mb-4">Want results like these?</p>
            <h2 className="font-display font-light text-smoke leading-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
              Let's build your<br /><em className="text-gold italic">growth plan</em>
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
