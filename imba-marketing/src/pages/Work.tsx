import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { PortfolioItem } from '@/lib/supabase'
import Seo from '@/components/Seo'
import { PageHero, CtaBand } from '@/components/site'

/* ── category labels (match PortfolioAdmin) ──── */
const CAT_META: Record<string, { label: string }> = {
  growth:          { label: 'Growth' },
  ads:             { label: 'Performance Ads' },
  content:         { label: 'Content' },
  funnel:          { label: 'Conversion' },
  intelligence:    { label: 'Intelligence' },
  personalisation: { label: 'Personalization' },
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
  { num: '3×',   label: 'Revenue growth' },
  { num: '98%',  label: 'Retention' },
]

/*
 * Case studies — 2026 redesign. Same data as before (Supabase
 * `portfolio_items`, falling back to the built-in cases), shown as the
 * redesign's bordered cards: image, service tag, client, summary, metrics.
 */
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
  // Only offer filters that have at least one case
  const cats = CATS.filter(c => c.key === 'all' || cases.some(x => x.category === c.key))

  return (
    <>
      <Seo
        title="Case Studies — AI Marketing Results"
        description="See how we've helped brands triple revenue, cut ad costs by 40%, and scale with AI. Real numbers from real businesses across industries."
        canonicalPath="/results"
      />

      <PageHero
        kicker="Case studies"
        title="Work we can show numbers for."
        lead="Every number is real. Every result is from a brand we actually helped grow — across e-commerce, SaaS, services, and more."
      />

      <section className="wrap">
        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-l border-line">
          {STATS.map(({ num, label }) => (
            <div key={label} className="px-6 py-6 border-r border-b border-line">
              <div className="font-display font-semibold text-[clamp(30px,3.4vw,44px)] leading-none tracking-[-.03em]">{num}</div>
              <div className="mt-2 font-mono-custom text-xs uppercase tracking-[.06em] text-smoke-dim">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap pt-10 pb-[clamp(56px,8vw,96px)]">
        <div role="group" aria-label="Filter by service" className="flex flex-wrap gap-2 mb-8">
          {cats.map(({ key, label }) => (
            <button key={key} type="button" className="chip" aria-pressed={activeCategory === key} onClick={() => setActiveCategory(key)}>
              {label}
            </button>
          ))}
        </div>

        <div className="grid gap-7 [grid-template-columns:repeat(auto-fit,minmax(min(100%,480px),1fr))]">
          {filtered.map(item => {
            const meta = CAT_META[item.category] || { label: item.category }
            const results = item.results ? Object.entries(item.results) : []
            return (
              <article key={item.id} className="border border-line bg-ink-2 flex flex-col">
                {item.thumbnail_url && (
                  <img src={item.thumbnail_url} alt="" loading="lazy" className="block w-full aspect-video object-cover border-b border-line" />
                )}
                <div className="p-7 flex flex-col gap-3.5 flex-1">
                  <span className="self-start font-mono-custom text-xs uppercase tracking-[.06em] text-brand-text border border-line px-2.5 py-1">{meta.label}</span>
                  {item.client_name && <p className="m-0 text-smoke-dim text-[15px]">{item.client_name}</p>}
                  <h2 className="font-display font-semibold text-[28px] leading-[1.08] tracking-[-.02em] m-0">{item.title}</h2>
                  {item.description && <p className="m-0 text-smoke-dim leading-relaxed">{item.description}</p>}
                  {item.tags && item.tags.length > 0 && (
                    <p className="m-0 font-mono-custom text-xs uppercase tracking-[.06em] text-smoke-dim">{item.tags.join(' · ')}</p>
                  )}
                  {results.length > 0 && (
                    <div className="mt-auto grid grid-cols-3 gap-4 border-t border-line pt-4">
                      {results.map(([label, val]) => (
                        <div key={label}>
                          <div className="font-display font-semibold text-[26px] text-smoke leading-none">{val}</div>
                          <div className="mt-1.5 text-sm text-smoke-dim">{label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <CtaBand
        title="Want results like these? Get a plan and a quote."
        sub="Every result above started with a free conversation. No commitment, no pressure."
      />
    </>
  )
}
