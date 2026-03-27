import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Testimonial } from '@/lib/supabase'
import Seo from '@/components/Seo'
import { useQuoteModal } from '@/contexts/QuoteModalContext'

const DEMO_TESTIMONIALS: Testimonial[] = [
  { id: '1', client_name: 'Sarah Andersen', client_role: 'CMO', client_company: 'FoodCo International', text: 'Our Shopify store was stuck at $40K/mo. Imba\'s AI completely transformed our ads and email flows — we hit $120K/mo within 90 days. Game changer.', featured: true, published: true },
  { id: '2', client_name: 'Marco Kessler', client_role: 'Growth Lead', client_company: 'NordShop', text: 'We were burning $8K/mo on ads with barely any return. Now every dollar brings back $4.80. Our ROAS tripled and our store has never been healthier.', featured: false, published: true },
  { id: '3', client_name: 'Julia Larsson', client_role: 'Founder', client_company: 'Velour Boutique', text: 'Running a fashion e-commerce brand is exhausting. Imba handles our product content, email campaigns, and ads with AI — I get a full month of content in a day.', featured: false, published: true },
]

const SERVICES = [
  { key: 'growth', icon: '◈', label: 'Grow Your Store on Autopilot', desc: 'AI runs your marketing 24/7 — optimizing ads, sending emails, and nurturing customers while you sleep.', color: '#E8452A', bg: 'rgba(232,69,42,0.06)' },
  { key: 'ads', icon: '▣', label: 'Get More from Every Ad Dollar', desc: 'AI manages product ads across Google Shopping, Meta, and TikTok — testing and scaling what converts.', color: '#C9A96E', bg: 'rgba(201,169,110,0.06)' },
  { key: 'personalisation', icon: '◉', label: 'Personalize Every Shopping Experience', desc: 'Show each customer products they actually want. AI personalizes emails, recommendations, and your site.', color: '#00D4FF', bg: 'rgba(0,212,255,0.06)' },
  { key: 'content', icon: '▶', label: 'Product Content at Scale', desc: 'AI creates product descriptions, social posts, email campaigns, and ad creatives — a month in a day.', color: '#6C7AE0', bg: 'rgba(108,122,224,0.06)' },
  { key: 'intelligence', icon: '◬', label: 'Know What Shoppers Want', desc: 'AI tracks trending products, competitor pricing, and customer behavior for smarter decisions.', color: '#3CBFAE', bg: 'rgba(60,191,174,0.06)' },
  { key: 'funnel', icon: '◫', label: 'Turn Browsers into Buyers', desc: 'AI finds where shoppers abandon your store and fixes it — better pages, smoother checkout, smart recovery.', color: '#E87A2A', bg: 'rgba(232,122,42,0.06)' },
]

export default function Home() {
  const { openModal } = useQuoteModal()
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEMO_TESTIMONIALS)

  useEffect(() => {
    supabase.from('testimonials').select('*').eq('published', true)
      .then(({ data }) => { if (data?.length) setTestimonials(data) })
  }, [])

  return (
    <>
      <Seo
        title="Imba Marketing — AI Marketing for E-Commerce Brands"
        description="AI-powered marketing that grows your online store. More sales, lower ad costs, product content at scale. Plans from $2,900/mo."
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          'name': 'Imba Marketing',
          'url': 'https://imbamarketing.com',
          'description': 'AI marketing agency for e-commerce brands. More sales, lower costs, faster growth.',
        }}
      />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 px-6 lg:px-12 bg-ink overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `radial-gradient(ellipse 80% 60% at 50% 40%, rgba(232,69,42,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 80% 20%, rgba(0,212,255,0.03) 0%, transparent 50%)`,
        }} />

        <div className="relative max-w-screen-xl mx-auto w-full">
          <div className="max-w-3xl">
            {/* Trust badge */}
            <div className="flex flex-wrap items-center gap-3 mb-8 reveal">
              <div className="badge-cyber">Trusted by 200+ E-Commerce Brands</div>
              <div className="trust-badges">
                {['Shopify', 'WooCommerce', 'Meta', 'Google'].map(p => (
                  <span key={p} className="platform-badge">{p}</span>
                ))}
              </div>
            </div>

            <h1 className="font-display font-light leading-[1.05] mb-8 reveal reveal-delay-1"
              style={{ fontSize: 'clamp(3.2rem, 7vw, 6rem)' }}>
              AI that sells<br />
              <em className="holo-text not-italic">more products</em><br />
              for your store.
            </h1>

            <p className="text-smoke-dim leading-relaxed mb-10 max-w-xl reveal reveal-delay-2" style={{ fontSize: '1.1rem', fontWeight: 300 }}>
              We plug AI into your e-commerce store to run better ads, create product content at scale, personalize every shopping experience, and recover abandoned carts — all on autopilot.
            </p>

            {/* Dual CTA */}
            <div className="flex flex-wrap items-center gap-4 mb-6 reveal reveal-delay-3">
              <button onClick={() => openModal()} className="btn btn-primary">
                Get your free growth plan →
              </button>
              <Link to="/pricing" className="btn btn-outline">
                See plans from $2,900/mo
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-6 reveal reveal-delay-4">
              {[
                { icon: '✓', text: 'No setup fees' },
                { icon: '✓', text: 'Cancel anytime' },
                { icon: '✓', text: 'Results in 48h' },
              ].map(({ icon, text }) => (
                <span key={text} className="trust-badge">
                  <span className="trust-badge-icon">{icon}</span>
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ SOCIAL PROOF BAR ═══════════════════ */}
      <section className="border-y border-white/5 bg-ink-2">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {[
              { num: '3×', label: 'Average Revenue Growth', color: '#E8452A' },
              { num: '4.8×', label: 'Average ROAS', color: '#C9A96E' },
              { num: '$2.4M', label: 'Revenue Generated for Clients', color: '#00D4FF' },
              { num: '98%', label: 'Client Retention Rate', color: '#3CBFAE' },
            ].map(({ num, label }, i) => (
              <div key={label} className={`py-8 px-6 lg:px-8 ${i < 3 ? 'border-r border-white/5' : ''}`}>
                <div className="highlight-number mb-1" style={{ fontSize: '2.8rem' }}>{num}</div>
                <div className="font-mono-custom text-[0.58rem] tracking-[0.16em] uppercase text-smoke-faint">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ BEFORE / AFTER ═══════════════════ */}
      <section className="py-24 px-6 lg:px-12 section-gradient-ember relative">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <p className="eyebrow justify-center mb-5 reveal">The difference AI makes</p>
            <h2 className="font-display font-light leading-tight reveal reveal-delay-1"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              What changes when you<br /><em className="text-gold italic">add AI to your store</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { before: 'Spending $8K/mo on ads with 1.2× ROAS', after: 'Same budget, 4.8× ROAS — every $1 brings back $4.80', metric: '300% better returns' },
              { before: 'Writing product descriptions one by one', after: 'AI creates descriptions for your entire catalog overnight', metric: '30× faster content' },
              { before: '70% of carts abandoned, no recovery', after: 'AI recovers 38% of abandoned carts automatically', metric: '38% cart recovery' },
              { before: 'Same homepage for every visitor', after: 'Each shopper sees personalized product recommendations', metric: '5× more engagement' },
              { before: 'Guessing which products to promote', after: 'AI shows you which products will trend next month', metric: 'Predict demand' },
              { before: '1.2% store conversion rate', after: 'AI optimizes every page — conversion rate hits 1.9%+', metric: '+62% conversions' },
            ].map(({ before, after, metric }, i) => (
              <div key={i} className="glass-card p-6 reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-smoke-faint text-[0.55rem]">✗</span>
                  </div>
                  <p className="text-sm text-smoke-faint leading-relaxed line-through decoration-smoke-faint/30">{before}</p>
                </div>
                <div className="flex items-start gap-3 mb-5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(60,191,174,0.15)' }}>
                    <span className="text-[0.55rem]" style={{ color: '#3CBFAE' }}>✓</span>
                  </div>
                  <p className="text-sm text-smoke leading-relaxed">{after}</p>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <span className="font-mono-custom text-[0.62rem] tracking-wider text-ember uppercase">{metric}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="angular-divider" />

      {/* ═══════════════════ SERVICES ═══════════════════ */}
      <section className="py-28 px-6 lg:px-12 bg-ink-2 relative">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-end mb-16">
            <div>
              <p className="eyebrow mb-5 reveal">AI for e-commerce</p>
              <h2 className="font-display font-light leading-tight reveal reveal-delay-1"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
                Six ways AI grows<br />
                <em className="text-gold italic">your online store.</em>
              </h2>
            </div>
            <p className="text-smoke-dim leading-relaxed reveal reveal-delay-2" style={{ fontSize: '0.95rem' }}>
              Each service solves a specific e-commerce problem. Get them individually or bundled together in one plan starting at $2,900/mo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map(({ key, icon, label, desc, color, bg }, i) => (
              <Link
                key={key}
                to={`/services/${key}`}
                className="glass-card gradient-border p-7 flex flex-col reveal group"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <div className="feature-icon-box" style={{ background: bg, color }}>
                  {icon}
                </div>
                <h3 className="font-display font-light text-smoke text-xl mb-3 group-hover:text-ember transition-colors">{label}</h3>
                <p className="text-sm text-smoke-dim leading-relaxed flex-1 mb-5">{desc}</p>
                <div className="font-mono-custom text-[0.62rem] tracking-[0.14em] uppercase flex items-center gap-2 transition-all duration-200 group-hover:gap-3"
                  style={{ color }}>
                  <span>Learn more</span><span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ INTEGRATIONS ═══════════════════ */}
      <section className="py-16 px-6 lg:px-12 bg-ink border-y border-white/5">
        <div className="max-w-screen-xl mx-auto">
          <p className="font-mono-custom text-[0.62rem] tracking-[0.2em] uppercase text-smoke-faint/40 mb-8 text-center reveal">
            Works with the tools you already use
          </p>
          <div className="integration-grid reveal reveal-delay-1">
            {['Shopify', 'Shopify Plus', 'WooCommerce', 'BigCommerce', 'Google Ads', 'Meta Ads', 'TikTok Ads', 'Klaviyo', 'Mailchimp', 'HubSpot', 'Google Analytics', 'Stripe'].map(p => (
              <div key={p} className="integration-item">{p}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section className="py-28 px-6 lg:px-12 section-gradient-cyber relative">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <p className="eyebrow justify-center mb-5 reveal">How it works</p>
            <h2 className="font-display font-light leading-tight reveal reveal-delay-1"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              From signup to results<br /><em className="text-gold italic">in 4 simple steps</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n: '01', title: 'Free strategy call', desc: 'Tell us about your store, your goals, and what\'s not working. We\'ll show you where the biggest revenue opportunities are.', color: '#E8452A' },
              { n: '02', title: 'Custom growth plan', desc: 'We design a plan for your specific store — which AI tools to deploy, what results to expect, and the timeline.', color: '#C9A96E' },
              { n: '03', title: 'AI goes live', desc: 'We connect to your store, set up the AI, and launch. First improvements visible within 48 hours. Full system live in 2–4 weeks.', color: '#00D4FF' },
              { n: '04', title: 'Revenue grows daily', desc: 'The AI learns and improves every day. Your marketing gets smarter, your costs go down, and your revenue compounds.', color: '#3CBFAE' },
            ].map(({ n, title, desc, color }, i) => (
              <div key={n} className="glass-card p-7 reveal stacked-card" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="font-mono-custom text-[0.65rem] tracking-wider mb-5" style={{ color }}>{n}</div>
                <h3 className="font-display font-light text-smoke text-xl mb-3">{title}</h3>
                <p className="text-sm text-smoke-dim leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CASE STUDIES ═══════════════════ */}
      <section className="py-28 px-6 lg:px-12 bg-ink-2">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
            <div>
              <p className="eyebrow mb-4 reveal">Real e-commerce results</p>
              <h2 className="font-display font-light leading-tight reveal reveal-delay-1"
                style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
                Numbers don't lie.<br /><em className="text-gold italic">Neither do our clients.</em>
              </h2>
            </div>
            <Link to="/results" className="btn btn-outline reveal reveal-delay-2">See all results →</Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { client: 'FoodCo International', type: 'Shopify Food Brand', headline: '$40K → $120K/mo', desc: 'Tripled monthly revenue in 90 days with AI-powered ads and automated email flows.', color: '#E8452A', metrics: [{ n: '+200%', l: 'Revenue' }, { n: '-52%', l: 'CPA' }, { n: '38%', l: 'Email uplift' }] },
              { client: 'NordShop', type: 'E-Commerce Fashion', headline: '4.8× ROAS', desc: 'Went from barely breaking even to $4.80 back for every $1 spent on ads.', color: '#C9A96E', metrics: [{ n: '4.8×', l: 'ROAS' }, { n: '-40%', l: 'CPA' }, { n: '3×', l: 'Ad scale' }] },
              { client: 'Velour Boutique', type: 'DTC Fashion', headline: '30 days in 1 day', desc: 'AI content engine creates a full month of product posts, emails, and ad creative in a single session.', color: '#6C7AE0', metrics: [{ n: '30×', l: 'Content' }, { n: '+180%', l: 'Engagement' }, { n: '95%', l: 'Time saved' }] },
            ].map(({ client, type, headline, desc, color, metrics }, i) => (
              <div key={client} className="glass-card stacked-card p-8 flex flex-col reveal"
                style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="font-mono-custom text-[0.58rem] tracking-[0.16em] uppercase text-smoke-faint">{client}</p>
                    <p className="font-mono-custom text-[0.55rem] tracking-wider uppercase mt-0.5" style={{ color }}>{type}</p>
                  </div>
                </div>
                <h3 className="font-display font-light leading-tight mb-3"
                  style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color }}>{headline}</h3>
                <p className="text-sm text-smoke-dim leading-relaxed mb-6 flex-1">{desc}</p>
                <div className="grid grid-cols-3 gap-3 pt-5 border-t border-white/5">
                  {metrics.map(({ n, l }) => (
                    <div key={l}>
                      <div className="font-display font-light text-lg leading-none mb-1" style={{ color }}>{n}</div>
                      <div className="font-mono-custom text-[0.5rem] tracking-wide uppercase text-smoke-faint/60">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section className="py-28 px-6 lg:px-12 section-gradient-gold">
        <div className="max-w-screen-xl mx-auto">
          <p className="eyebrow mb-4 reveal">Happy store owners</p>
          <h2 className="font-display font-light leading-tight mb-14 reveal reveal-delay-1"
            style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
            Don't take our word for it.<br /><em className="text-gold italic">Take theirs.</em>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={t.id} className="glass-card stacked-card p-8 relative reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="absolute top-5 right-6 font-display text-[5rem] font-light leading-none select-none"
                  style={{ color: 'rgba(232,69,42,0.06)' }}>"</div>
                {/* Stars */}
                <div className="flex gap-0.5 mb-5">
                  {[1,2,3,4,5].map(n => (
                    <svg key={n} width="14" height="14" viewBox="0 0 24 24" fill="#C9A96E" stroke="#C9A96E" strokeWidth="1.5">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                  ))}
                </div>
                <p className="font-display text-lg font-light italic text-smoke/80 leading-relaxed mb-6">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-mono-custom text-[0.6rem]"
                    style={{ background: 'rgba(232,69,42,0.1)', border: '1px solid rgba(232,69,42,0.2)', color: '#E8452A' }}>
                    {t.client_name.split(' ').map((w: string) => w[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm text-smoke font-medium">{t.client_name}</p>
                    <p className="font-mono-custom text-[0.58rem] tracking-wider text-smoke-faint">
                      {t.client_role ? `${t.client_role} · ` : ''}{t.client_company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ PRICING TEASER ═══════════════════ */}
      <section className="py-24 px-6 lg:px-12 bg-ink-2 border-y border-white/5">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-14">
            <p className="eyebrow justify-center mb-5 reveal">Simple pricing</p>
            <h2 className="font-display font-light leading-tight mb-4 reveal reveal-delay-1"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
              One monthly fee. <em className="text-gold italic">Everything included.</em>
            </h2>
            <p className="text-smoke-dim max-w-lg mx-auto reveal reveal-delay-2">
              No setup fees, no hidden costs, no long-term contracts. Pick a plan and start growing.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { name: 'Starter', price: '$2,900', desc: 'Growing stores ready to scale', color: '#3CBFAE' },
              { name: 'Growth', price: '$5,900', desc: 'Brands ready to dominate', color: '#E8452A', popular: true },
              { name: 'Enterprise', price: '$12,900', desc: 'Full AI marketing department', color: '#C9A96E' },
            ].map(({ name, price, desc, color, popular }, i) => (
              <div key={name}
                className={`glass-card p-8 text-center reveal ${popular ? 'pricing-highlight' : ''}`}
                style={{ transitionDelay: `${i * 80}ms` }}>
                {popular && (
                  <span className="inline-block font-mono-custom text-[0.55rem] tracking-[0.18em] uppercase px-3 py-1 bg-ember text-ink mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display font-light text-xl text-smoke mb-1">{name}</h3>
                <p className="font-mono-custom text-[0.6rem] tracking-wider uppercase mb-4" style={{ color }}>{desc}</p>
                <div className="font-display font-light text-smoke mb-1" style={{ fontSize: '2.8rem', lineHeight: 1 }}>{price}</div>
                <p className="font-mono-custom text-[0.6rem] text-smoke-faint tracking-wider">/month</p>
              </div>
            ))}
          </div>

          <div className="text-center reveal reveal-delay-3">
            <Link to="/pricing" className="btn btn-primary">
              See full pricing & features →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ CLIENTS ═══════════════════ */}
      <section className="py-14 px-6 lg:px-12 bg-ink">
        <div className="max-w-screen-xl mx-auto">
          <p className="font-mono-custom text-[0.62rem] tracking-[0.2em] uppercase text-smoke-faint/40 mb-6 text-center reveal">
            Trusted by e-commerce brands worldwide
          </p>
          <div className="logo-bar reveal reveal-delay-1">
            {['FoodCo International', 'NordShop', 'Velour Boutique', 'BrandX', 'Magic Mind', 'Irving Books', 'Prime Real Estate', 'Ogitive'].map(c => (
              <span key={c} className="logo-bar-item">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="cta-gradient relative">
        <div className="relative px-6 lg:px-12 py-24 max-w-screen-xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 z-10">
          <div>
            <h2 className="font-display font-light leading-tight text-ink"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
              Ready to grow your store?<br /><em>Plans from $2,900/mo.</em>
            </h2>
            <p className="text-ink/60 mt-4" style={{ fontSize: '0.95rem' }}>
              Free strategy call · No contracts · See results in 48 hours.
            </p>
          </div>
          <div className="flex flex-col gap-3 flex-shrink-0">
            <button onClick={() => openModal()}
              className="font-mono-custom text-[0.7rem] tracking-[0.14em] uppercase px-10 py-5 cursor-pointer"
              style={{ background: '#0A0A0B', color: '#F5F4F0', border: 'none' }}>
              Get your free growth plan →
            </button>
            <Link to="/pricing"
              className="font-mono-custom text-[0.65rem] tracking-[0.12em] uppercase text-center text-ink/50 hover:text-ink/80 transition-colors">
              Or see pricing →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
