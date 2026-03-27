import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Testimonial } from '@/lib/supabase'
import Seo from '@/components/Seo'
import { useQuoteModal } from '@/contexts/QuoteModalContext'

const DEMO_TESTIMONIALS: Testimonial[] = [
  { id: '1', client_name: 'Sarah Andersen', client_role: 'CMO', client_company: 'FoodCo International', text: 'Our monthly revenue was stuck at $40K. Imba deployed their AI systems and within 90 days we hit $120K/mo. The ads, email flows, everything just works now.', featured: true, published: true },
  { id: '2', client_name: 'David Chen', client_role: 'CEO', client_company: 'Ogitive SaaS', text: 'We needed a marketing partner who understood tech. Imba\'s AI analytics uncovered segments we never knew existed — our pipeline tripled in one quarter.', featured: false, published: true },
  { id: '3', client_name: 'Nina Karlsson', client_role: 'Marketing Director', client_company: 'Prime Real Estate Group', text: 'Real estate marketing is competitive. Imba\'s AI personalization delivers the right listings to the right buyers automatically. Our lead quality improved 4x.', featured: false, published: true },
]

const SERVICES = [
  { num: '01', slug: 'growth', title: 'AI Growth Marketing', desc: 'Automated campaigns, intelligent lead generation, and revenue optimization engines that compound your growth month over month.', color: '#E8452A' },
  { num: '02', slug: 'ads', title: 'AI Performance Ads', desc: 'Cross-platform ad management across Google, Meta, TikTok, and LinkedIn with real-time ROAS optimization and budget allocation.', color: '#C9A96E' },
  { num: '03', slug: 'personalisation', title: 'AI Personalization', desc: 'Dynamic content delivery, behavioral targeting, and individualized customer journeys that convert browsers into loyal customers.', color: '#00D4FF' },
  { num: '04', slug: 'content', title: 'AI Content Production', desc: 'Brand-aligned content at scale — social posts, email sequences, ad creatives, and landing pages produced in hours, not weeks.', color: '#6C7AE0' },
  { num: '05', slug: 'intelligence', title: 'AI Analytics & Intelligence', desc: 'Market research, competitor tracking, customer sentiment analysis, and predictive insights that inform every strategic decision.', color: '#3CBFAE' },
  { num: '06', slug: 'funnel', title: 'AI Conversion Optimization', desc: 'Funnel analysis, multivariate testing, checkout streamlining, and abandonment recovery that maximize every visitor interaction.', color: '#E87A2A' },
]

const INDUSTRIES = [
  { name: 'E-Commerce & DTC', icon: '◈' },
  { name: 'SaaS & Tech', icon: '▣' },
  { name: 'Professional Services', icon: '◉' },
  { name: 'Health & Wellness', icon: '▶' },
  { name: 'Real Estate', icon: '◬' },
  { name: 'Food & Beverage', icon: '◫' },
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
        title="Imba Marketing — AI-Powered Marketing Agency | Smarter Campaigns, Real Results"
        description="Imba Marketing is an AI-powered marketing agency delivering smarter campaigns and real results. From e-commerce brands to SaaS and professional services, our six AI systems drive revenue, lower costs, and scale growth. Plans from $2,900/mo."
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          'name': 'Imba Marketing',
          'url': 'https://imbamarketing.com',
          'description': 'AI-powered marketing agency. Smarter campaigns, real results across e-commerce, SaaS, professional services, and more.',
        }}
      />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-6 lg:px-12 bg-ink overflow-hidden">
        {/* Animated gradient orb */}
        <div className="absolute pointer-events-none" style={{
          width: '60vw',
          height: '60vw',
          maxWidth: '800px',
          maxHeight: '800px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -55%)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,69,42,0.12) 0%, rgba(201,169,110,0.08) 30%, rgba(0,212,255,0.05) 55%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'pulse 8s ease-in-out infinite',
        }} />
        <style>{`@keyframes pulse { 0%, 100% { transform: translate(-50%, -55%) scale(1); opacity: 0.8; } 50% { transform: translate(-50%, -55%) scale(1.08); opacity: 1; } }`}</style>

        <div className="relative text-center max-w-5xl mx-auto">
          {/* Eyebrow */}
          <div className="flex justify-center mb-8 reveal">
            <div className="badge-cyber">AI-Powered Marketing Agency</div>
          </div>

          {/* Massive headline */}
          <h1 className="font-display font-light leading-[0.95] mb-8 reveal reveal-delay-1"
            style={{ fontSize: 'clamp(3.5rem, 8.5vw, 8rem)' }}>
            We Build Marketing<br />
            <em className="holo-text not-italic">That Thinks.</em>
          </h1>

          <p className="text-smoke-dim leading-relaxed mb-12 max-w-2xl mx-auto reveal reveal-delay-2" style={{ fontSize: '1.15rem', fontWeight: 300 }}>
            Six proprietary AI systems that transform how brands attract, convert, and retain customers. Less guesswork. More growth. Measurably better results from day one.
          </p>

          {/* Dual CTA */}
          <div className="flex flex-wrap justify-center items-center gap-5 mb-8 reveal reveal-delay-3">
            <button onClick={() => openModal()} className="btn btn-primary">
              Book a Strategy Call
            </button>
            <Link to="/results" className="btn btn-outline">
              See Our Work
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="relative w-full max-w-screen-lg mx-auto mt-16 reveal reveal-delay-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', overflow: 'hidden' }}>
            {[
              { num: '3×', label: 'Average Revenue Growth', color: '#E8452A' },
              { num: '4.8×', label: 'Average ROAS', color: '#C9A96E' },
              { num: '200+', label: 'Clients Served', color: '#00D4FF' },
              { num: '98%', label: 'Client Retention', color: '#3CBFAE' },
            ].map(({ num, label, color }) => (
              <div key={label} className="py-8 px-6 text-center" style={{ background: 'rgba(10,10,11,0.8)' }}>
                <div className="highlight-number mb-2" style={{ fontSize: '3rem', color }}>{num}</div>
                <div className="font-mono-custom text-[0.58rem] tracking-[0.16em] uppercase text-smoke-faint">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust line */}
        <div className="relative mt-12 reveal reveal-delay-4">
          <p className="font-mono-custom text-[0.6rem] tracking-[0.2em] uppercase text-smoke-faint/40 text-center">
            Trusted by brands like <span className="text-smoke-faint/60">FoodCo International</span> · <span className="text-smoke-faint/60">Ogitive</span> · <span className="text-smoke-faint/60">NordShop</span> · <span className="text-smoke-faint/60">Prime Real Estate</span> · <span className="text-smoke-faint/60">Magic Mind</span> · <span className="text-smoke-faint/60">Irving Books</span>
          </p>
        </div>
      </section>

      <div className="angular-divider" />

      {/* ═══════════════════ WHAT WE DO ═══════════════════ */}
      <section className="py-28 px-6 lg:px-12 bg-ink-2 relative">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-20">
            <p className="eyebrow mb-5 reveal">What we do</p>
            <h2 className="font-display font-light leading-tight reveal reveal-delay-1"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
              Six AI systems.<br />
              <em className="text-gold italic">One unstoppable strategy.</em>
            </h2>
          </div>

          <div className="flex flex-col">
            {SERVICES.map(({ num, slug, title, desc, color }, i) => (
              <Link
                key={slug}
                to={`/services/${slug}`}
                className="group reveal border-t border-white/5 last:border-b"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="grid grid-cols-12 gap-6 items-center py-10 lg:py-12 transition-all duration-300 group-hover:pl-4">
                  <div className="col-span-12 lg:col-span-1">
                    <span className="font-mono-custom text-[0.75rem] tracking-wider" style={{ color }}>{num}</span>
                  </div>
                  <div className="col-span-12 lg:col-span-4">
                    <h3 className="font-display font-light text-smoke leading-tight group-hover:text-ember transition-colors"
                      style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
                      {title}
                    </h3>
                  </div>
                  <div className="col-span-12 lg:col-span-5">
                    <p className="text-smoke-dim leading-relaxed" style={{ fontSize: '0.95rem' }}>{desc}</p>
                  </div>
                  <div className="col-span-12 lg:col-span-2 flex justify-end">
                    <span className="font-mono-custom text-[0.62rem] tracking-[0.14em] uppercase flex items-center gap-2 transition-all duration-200 group-hover:gap-4"
                      style={{ color }}>
                      <span>Explore</span><span className="text-lg">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="angular-divider" />

      {/* ═══════════════════ SOCIAL PROOF / RESULTS ═══════════════════ */}
      <section className="py-28 px-6 lg:px-12 section-gradient-ember relative">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
            <div>
              <p className="eyebrow mb-4 reveal">Proven results</p>
              <h2 className="font-display font-light leading-tight reveal reveal-delay-1"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
                Real clients.<br /><em className="text-gold italic">Real numbers.</em>
              </h2>
            </div>
            <Link to="/results" className="btn btn-outline reveal reveal-delay-2">View all case studies →</Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                client: 'FoodCo International',
                type: 'E-Commerce · Food & Beverage',
                headline: '$40K → $120K/mo',
                desc: 'Tripled monthly revenue in 90 days with AI-powered ads and automated email flows.',
                color: '#E8452A',
                metrics: [{ n: '+200%', l: 'Revenue' }, { n: '4.2×', l: 'ROAS' }, { n: '38%', l: 'Email uplift' }],
              },
              {
                client: 'Ogitive',
                type: 'SaaS · B2B Technology',
                headline: '3× Pipeline in 90 Days',
                desc: 'AI analytics identified high-intent segments and automated nurture sequences tripled qualified pipeline.',
                color: '#00D4FF',
                metrics: [{ n: '3×', l: 'Pipeline' }, { n: '-58%', l: 'CAC' }, { n: '+140%', l: 'MQLs' }],
              },
              {
                client: 'Prime Real Estate Group',
                type: 'Real Estate · Lead Gen',
                headline: '4× Lead Quality',
                desc: 'AI personalization matched listings to buyer profiles, dramatically improving lead quality and close rates.',
                color: '#C9A96E',
                metrics: [{ n: '4×', l: 'Lead quality' }, { n: '+90%', l: 'Close rate' }, { n: '-45%', l: 'Cost/lead' }],
              },
            ].map(({ client, type, headline, desc, color, metrics }, i) => (
              <div key={client} className="glass-card stacked-card p-8 flex flex-col reveal"
                style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="mb-6">
                  <p className="font-mono-custom text-[0.6rem] tracking-[0.16em] uppercase text-smoke-faint">{client}</p>
                  <p className="font-mono-custom text-[0.55rem] tracking-wider uppercase mt-1" style={{ color }}>{type}</p>
                </div>
                <h3 className="font-display font-light leading-tight mb-4"
                  style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color }}>{headline}</h3>
                <p className="text-sm text-smoke-dim leading-relaxed mb-8 flex-1">{desc}</p>
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5">
                  {metrics.map(({ n, l }) => (
                    <div key={l}>
                      <div className="font-display font-light text-xl leading-none mb-1" style={{ color }}>{n}</div>
                      <div className="font-mono-custom text-[0.5rem] tracking-wide uppercase text-smoke-faint/60">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ WHY IMBA ═══════════════════ */}
      <section className="py-28 px-6 lg:px-12 bg-ink relative">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <p className="eyebrow justify-center mb-5 reveal">Why Imba</p>
            <h2 className="font-display font-light leading-tight reveal reveal-delay-1"
              style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4rem)' }}>
              Built different.<br /><em className="text-gold italic">Built to perform.</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '◈', title: 'AI That Works 24/7', desc: 'Our systems never sleep. Campaigns optimize, content publishes, and leads nurture around the clock — even weekends.', color: '#E8452A', bg: 'rgba(232,69,42,0.06)' },
              { icon: '▣', title: 'Results in 48 Hours', desc: 'No 90-day ramp-up. Our AI deploys fast — most clients see measurable improvements within the first 48 hours.', color: '#C9A96E', bg: 'rgba(201,169,110,0.06)' },
              { icon: '◉', title: 'No Long-Term Contracts', desc: 'Month-to-month. We earn your business every 30 days. If we stop delivering, you stop paying. Simple.', color: '#00D4FF', bg: 'rgba(0,212,255,0.06)' },
              { icon: '◬', title: 'Dedicated Strategy Team', desc: 'AI handles execution. Humans handle strategy. Every client gets a dedicated strategist who knows your brand inside out.', color: '#3CBFAE', bg: 'rgba(60,191,174,0.06)' },
            ].map(({ icon, title, desc, color, bg }, i) => (
              <div key={title} className="glass-card gradient-border p-8 text-center reveal"
                style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="feature-icon-box mx-auto" style={{ background: bg, color }}>
                  {icon}
                </div>
                <h3 className="font-display font-light text-smoke text-lg mb-3 mt-5">{title}</h3>
                <p className="text-sm text-smoke-dim leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="angular-divider" />

      {/* ═══════════════════ INDUSTRIES ═══════════════════ */}
      <section className="py-28 px-6 lg:px-12 section-gradient-cyber relative">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <p className="eyebrow justify-center mb-5 reveal">Industries we serve</p>
            <h2 className="font-display font-light leading-tight reveal reveal-delay-1"
              style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4rem)' }}>
              AI marketing for<br /><em className="text-gold italic">every growth-stage brand.</em>
            </h2>
            <p className="text-smoke-dim max-w-xl mx-auto mt-6 reveal reveal-delay-2" style={{ fontSize: '0.95rem' }}>
              Our AI systems adapt to your industry, audience, and business model. Same intelligence, tailored execution.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            {INDUSTRIES.map(({ name, icon }, i) => (
              <div key={name} className="glass-card p-8 flex items-center gap-5 reveal group"
                style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="feature-icon-box flex-shrink-0" style={{
                  background: 'rgba(201,169,110,0.06)',
                  color: '#C9A96E',
                }}>
                  {icon}
                </div>
                <span className="font-display font-light text-smoke text-lg group-hover:text-gold transition-colors">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section className="py-28 px-6 lg:px-12 section-gradient-gold relative">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <p className="eyebrow justify-center mb-5 reveal">Client testimonials</p>
            <h2 className="font-display font-light leading-tight reveal reveal-delay-1"
              style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)' }}>
              Don't take our word for it.<br /><em className="text-gold italic">Take theirs.</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={t.id} className="glass-card stacked-card p-8 relative reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="absolute top-5 right-6 font-display text-[5rem] font-light leading-none select-none"
                  style={{ color: 'rgba(201,169,110,0.06)' }}>"</div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-5">
                  {[1,2,3,4,5].map(n => (
                    <svg key={n} width="14" height="14" viewBox="0 0 24 24" fill="#C9A96E" stroke="#C9A96E" strokeWidth="1.5">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                  ))}
                </div>

                <p className="font-display text-lg font-light italic text-smoke/80 leading-relaxed mb-8">{t.text}</p>

                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-mono-custom text-[0.6rem]"
                    style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)', color: '#C9A96E' }}>
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

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section className="cta-gradient relative">
        <div className="relative px-6 lg:px-12 py-28 max-w-screen-xl mx-auto text-center z-10">
          <h2 className="font-display font-light leading-tight text-ink mb-6"
            style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5rem)' }}>
            Ready to Transform<br /><em>Your Marketing?</em>
          </h2>
          <p className="text-ink/60 mb-10 max-w-xl mx-auto" style={{ fontSize: '1.05rem' }}>
            Book a free strategy call. We will audit your current marketing, show you where AI can drive the biggest gains, and build a custom growth plan — no strings attached.
          </p>
          <button onClick={() => openModal()}
            className="font-mono-custom text-[0.7rem] tracking-[0.14em] uppercase px-12 py-5 cursor-pointer transition-all duration-200 hover:scale-105"
            style={{ background: '#0A0A0B', color: '#F5F4F0', border: 'none' }}>
            Book Your Strategy Call →
          </button>
        </div>
      </section>
    </>
  )
}
