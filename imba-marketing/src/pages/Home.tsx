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
  { slug: 'growth', title: 'AI Growth Marketing', desc: 'Automated campaigns and revenue optimization engines that compound growth month over month.', color: '#EF4444' },
  { slug: 'ads', title: 'AI Performance Ads', desc: 'Cross-platform ad management with real-time ROAS optimization and smart budget allocation.', color: '#F59E0B' },
  { slug: 'personalisation', title: 'AI Personalization', desc: 'Dynamic content delivery and individualized journeys that convert browsers into customers.', color: '#3B82F6' },
  { slug: 'content', title: 'AI Content Production', desc: 'Brand-aligned content at scale — social, email, ads, and landing pages in hours, not weeks.', color: '#EF4444' },
  { slug: 'intelligence', title: 'AI Analytics & Intelligence', desc: 'Competitor tracking, sentiment analysis, and predictive insights for every decision.', color: '#F59E0B' },
  { slug: 'funnel', title: 'AI Conversion Optimization', desc: 'Funnel analysis, A/B testing, and abandonment recovery to maximize every interaction.', color: '#3B82F6' },
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
        title="Imba Marketing — AI-Powered Marketing Agency"
        description="Imba Marketing is an AI-powered marketing agency that helps ambitious brands grow faster with intelligent automation, performance ads, and data-driven strategy. Book a free strategy call today."
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          'name': 'Imba Marketing',
          'url': 'https://imbamarketing.com',
          'description': 'AI-powered marketing agency delivering smarter campaigns and real results.',
        }}
      />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 lg:px-12 overflow-hidden" style={{ background: '#09090B' }}>
        {/* Subtle radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(239,68,68,0.08) 0%, rgba(59,130,246,0.04) 40%, transparent 70%)',
        }} />

        <div className="relative text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-8 reveal">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wide uppercase"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              AI-Powered Marketing Agency
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-sans font-extrabold tracking-tighter leading-[0.95] mb-6 reveal reveal-delay-1"
            style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', color: '#FAFAF9' }}>
            <span className="gradient-text">Marketing that outperforms.</span>
            <br />
            Powered by AI.
          </h1>

          {/* Subtext */}
          <p className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed reveal reveal-delay-2" style={{ color: '#A1A1AA' }}>
            We combine six proprietary AI systems with human strategy to help ambitious brands attract, convert, and retain customers — faster and smarter than traditional agencies ever could.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-4 mb-20 reveal reveal-delay-3">
            <button onClick={() => openModal()} className="btn btn-primary btn-lg">
              Book a Strategy Call
            </button>
            <Link to="/results" className="btn btn-outline">
              See Our Work
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="relative w-full max-w-screen-lg mx-auto reveal reveal-delay-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { num: '3\u00D7', label: 'Revenue Growth' },
              { num: '4.8\u00D7', label: 'ROAS' },
              { num: '200+', label: 'Clients' },
              { num: '98%', label: 'Retention' },
            ].map(({ num, label }) => (
              <div key={label} className="glass-card text-center py-8 px-4">
                <div className="highlight-number mb-2" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>{num}</div>
                <div className="text-xs font-medium tracking-wide uppercase" style={{ color: '#52525B' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ TRUSTED BY ═══════════════════ */}
      <section className="py-10 px-6 lg:px-12" style={{ background: '#0F0F12', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#52525B' }}>Trusted by ambitious brands</span>
          <span className="hidden sm:inline" style={{ color: '#52525B' }}>|</span>
          {['FoodCo International', 'Ogitive', 'NordShop', 'Prime Real Estate', 'Magic Mind', 'Irving Books'].map(name => (
            <span key={name} className="text-sm font-medium" style={{ color: '#A1A1AA' }}>{name}</span>
          ))}
        </div>
      </section>

      {/* ═══════════════════ WHAT WE DO ═══════════════════ */}
      <section className="py-28 px-6 lg:px-12" style={{ background: '#09090B' }}>
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-sans font-bold tracking-tight leading-tight reveal"
              style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', color: '#FAFAF9' }}>
              What We Do
            </h2>
            <p className="text-base mt-4 max-w-xl mx-auto reveal reveal-delay-1" style={{ color: '#A1A1AA' }}>
              Six AI-powered services designed to cover every stage of your growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map(({ slug, title, desc, color }, i) => (
              <Link
                key={slug}
                to={`/services/${slug}`}
                className="glass-card p-7 group reveal"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="block w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                  <h3 className="font-sans font-semibold text-xl transition-colors group-hover:text-red-400" style={{ color: '#FAFAF9' }}>
                    {title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#A1A1AA' }}>{desc}</p>
                <span className="inline-flex items-center gap-1.5 mt-5 text-xs font-semibold uppercase tracking-wider transition-all group-hover:gap-3" style={{ color }}>
                  Learn more <span className="text-sm">&rarr;</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ RESULTS ═══════════════════ */}
      <section className="py-28 px-6 lg:px-12" style={{ background: '#0F0F12' }}>
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-sans font-bold tracking-tight leading-tight reveal"
              style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', color: '#FAFAF9' }}>
              Real Results
            </h2>
            <p className="text-base mt-4 max-w-xl mx-auto reveal reveal-delay-1" style={{ color: '#A1A1AA' }}>
              Every number backed by real clients, real data, and real revenue.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                client: 'FoodCo International',
                industry: 'E-Commerce',
                headline: '$40K to $120K/mo',
                desc: 'Tripled monthly revenue in 90 days with AI-powered ads and automated email flows.',
                metrics: [{ n: '+200%', l: 'Revenue' }, { n: '4.2\u00D7', l: 'ROAS' }, { n: '38%', l: 'Email Uplift' }],
              },
              {
                client: 'Ogitive',
                industry: 'SaaS',
                headline: '3\u00D7 Pipeline in 90 Days',
                desc: 'AI analytics identified high-intent segments and automated nurture sequences tripled qualified pipeline.',
                metrics: [{ n: '3\u00D7', l: 'Pipeline' }, { n: '-58%', l: 'CAC' }, { n: '+140%', l: 'MQLs' }],
              },
              {
                client: 'Prime Real Estate Group',
                industry: 'Real Estate',
                headline: '4\u00D7 Lead Quality',
                desc: 'AI personalization matched listings to buyer profiles, dramatically improving lead quality and close rates.',
                metrics: [{ n: '4\u00D7', l: 'Lead Quality' }, { n: '+90%', l: 'Close Rate' }, { n: '-45%', l: 'Cost/Lead' }],
              },
            ].map(({ client, industry, headline, desc, metrics }, i) => (
              <div key={client} className="glass-card p-8 flex flex-col reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="mb-5">
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#EF4444' }}>{industry}</span>
                  <p className="text-sm font-medium mt-1" style={{ color: '#A1A1AA' }}>{client}</p>
                </div>
                <h3 className="font-sans font-bold tracking-tight leading-tight mb-3"
                  style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: '#FAFAF9' }}>
                  {headline}
                </h3>
                <p className="text-sm leading-relaxed mb-8 flex-1" style={{ color: '#A1A1AA' }}>{desc}</p>
                <div className="grid grid-cols-3 gap-4 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {metrics.map(({ n, l }) => (
                    <div key={l}>
                      <div className="highlight-number text-xl leading-none mb-1">{n}</div>
                      <div className="text-[0.65rem] font-medium uppercase tracking-wide" style={{ color: '#52525B' }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 reveal">
            <Link to="/results" className="btn btn-outline">View All Case Studies &rarr;</Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section className="py-28 px-6 lg:px-12" style={{ background: '#09090B' }}>
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-sans font-bold tracking-tight leading-tight reveal"
              style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', color: '#FAFAF9' }}>
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Strategy Call', desc: 'We audit your current marketing, identify gaps, and map out where AI can drive the biggest impact for your brand.' },
              { step: '02', title: 'Custom Game Plan', desc: 'Your dedicated strategist builds a tailored plan combining the right AI systems for your goals and industry.' },
              { step: '03', title: 'AI Deployment', desc: 'We launch your campaigns within 48 hours. AI handles execution, optimization, and scaling around the clock.' },
              { step: '04', title: 'Growth & Scale', desc: 'Weekly reports, monthly strategy reviews, and continuous optimization ensure compounding returns over time.' },
            ].map(({ step, title, desc }, i) => (
              <div key={step} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="font-sans font-extrabold text-5xl tracking-tighter mb-4" style={{ color: '#52525B' }}>{step}</div>
                <h3 className="font-sans font-semibold text-lg mb-2" style={{ color: '#FAFAF9' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#A1A1AA' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section className="py-28 px-6 lg:px-12" style={{ background: '#0F0F12' }}>
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-sans font-bold tracking-tight leading-tight reveal"
              style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', color: '#FAFAF9' }}>
              What Our Clients Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={t.id} className="glass-card p-8 flex flex-col reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map(n => (
                    <svg key={n} width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="none">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                  ))}
                </div>

                <p className="text-base leading-relaxed mb-8 flex-1" style={{ color: '#FAFAF9' }}>
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="flex items-center gap-3 mt-auto pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#F59E0B' }}>
                    {t.client_name.split(' ').map((w: string) => w[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#FAFAF9' }}>{t.client_name}</p>
                    <p className="text-xs" style={{ color: '#A1A1AA' }}>
                      {t.client_role ? `${t.client_role}, ` : ''}{t.client_company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="cta-gradient">
        <div className="px-6 lg:px-12 py-28 max-w-screen-xl mx-auto text-center">
          <h2 className="font-sans font-extrabold tracking-tighter leading-tight mb-6"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: '#09090B' }}>
            Ready to Transform Your Marketing?
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: 'rgba(9,9,11,0.6)' }}>
            Book a free strategy call. We will audit your marketing, show you where AI drives the biggest gains, and build a custom growth plan — no strings attached.
          </p>
          <button onClick={() => openModal()}
            className="btn btn-lg cursor-pointer font-sans font-semibold text-sm tracking-wide"
            style={{ background: '#09090B', color: '#FAFAF9', padding: '1rem 2.5rem', borderRadius: '0.5rem', border: 'none' }}>
            Book Your Strategy Call &rarr;
          </button>
        </div>
      </section>
    </>
  )
}
