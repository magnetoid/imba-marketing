import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Testimonial } from '@/lib/supabase'
import Seo from '@/components/Seo'
import { useQuoteModal } from '@/contexts/QuoteModalContext'

const DEMO_TESTIMONIALS: Testimonial[] = [
  { id: '1', client_name: 'Sarah Andersen', client_role: 'CMO', client_company: 'FoodCo International', text: 'Imba Marketing transformed our entire growth engine. The AI systems they built reduced our cost-per-acquisition by 40% in the first 90 days. Exceptional results.', featured: true, published: true },
  { id: '2', client_name: 'Marco Kessler', client_role: 'Growth Lead', client_company: 'NordShop', text: 'The AI-powered ad campaigns were unlike anything we had run before. Real-time optimisation at a scale our team could never achieve manually. 3× ROAS uplift.', featured: false, published: true },
  { id: '3', client_name: 'Julia Larsson', client_role: 'Founder', client_company: 'Velour Boutique', text: 'They built us an AI content engine that produces a month of content in a single day. The quality is indistinguishable from our best human-written pieces.', featured: false, published: true },
]

const SERVICES = [
  { key: 'growth', icon: '◈', label: 'AI Growth Systems', desc: 'Transform marketing and sales into an intelligent machine. We design AI-powered systems that automate workflows, optimise campaigns, and turn data into decisions — scaling faster with less effort.', color: '#E8452A' },
  { key: 'ads', icon: '▣', label: 'AI Performance Advertising', desc: 'Turn ad spend into predictable revenue. Our AI advertising systems continuously test creatives, audiences, and offers in real time — maximising ROI while eliminating wasted budget.', color: '#C9A96E' },
  { key: 'personalisation', icon: '◉', label: 'AI Personalisation', desc: 'Deliver the right message to the right customer at the perfect moment. We build AI systems that personalise content, outreach, and experiences at scale across every touchpoint.', color: '#00D4FF' },
  { key: 'content', icon: '▶', label: 'AI Content Engines', desc: 'Create endless high-quality content from a single idea. Our AI-powered engines generate, repurpose, and distribute videos, posts, and campaigns across every platform automatically.', color: '#6C7AE0' },
  { key: 'intelligence', icon: '◬', label: 'AI Data & Intelligence', desc: 'Stay ahead of competitors with real-time market insights. Our AI analyses trends, customer behaviour, and competitor activity — surfacing the exact actions that move revenue.', color: '#3CBFAE' },
  { key: 'funnel', icon: '◫', label: 'AI Funnel Optimisation', desc: 'Turn more visitors into customers. Using AI-driven analysis and testing, we identify exactly where your funnel leaks revenue and optimise every step to maximise conversions.', color: '#E87A2A' },
]

const STATS = [
  { num: '300', sup: '%', label: 'Avg. ROAS Improvement' },
  { num: '40', sup: '%', label: 'Lower CPA' },
  { num: '48', sup: 'h', label: 'Time to First Results' },
  { num: '98', sup: '%', label: 'Client Retention' },
]

const RESULTS = [
  { client: 'FoodCo International', category: 'AI Growth Systems', headline: '4.2M reach, 38% CTR lift', desc: 'Full-funnel AI growth system built from scratch. Automated lead scoring, content personalisation, and campaign optimisation.', color: '#E8452A' },
  { client: 'NordShop', category: 'AI Performance Advertising', headline: '3× ROAS in 90 days', desc: 'AI-powered ad system with real-time creative testing across 6 platforms. Cost-per-acquisition reduced by 40%.', color: '#C9A96E' },
  { client: 'Velour Boutique', category: 'AI Content Engines', headline: '30 days of content in 1 day', desc: 'Custom AI content engine generating brand-consistent posts, emails, and ads at scale — zero quality compromise.', color: '#6C7AE0' },
  { client: 'BrandX', category: 'AI Funnel Optimisation', headline: '+62% conversion rate', desc: 'Funnel audit revealed 4 critical leakage points. AI testing and optimisation doubled qualified leads within 6 weeks.', color: '#3CBFAE' },
  { client: 'Magic Mind', category: 'AI Data & Intelligence', headline: '12 competitor gaps uncovered', desc: 'AI market intelligence system revealed underserved keywords and audience segments driving 28% organic growth.', color: '#C9A96E' },
]

export default function Home() {
  const { openModal } = useQuoteModal()
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEMO_TESTIMONIALS)
  const [activeService, setActiveService] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('testimonials').select('*').eq('published', true)
      .then(({ data }) => { if (data?.length) setTestimonials(data) })
  }, [])

  return (
    <>
      <Seo
        title="AI Marketing Systems for Modern Brands — Imba Marketing"
        description="We build AI-powered growth engines that automate campaigns, personalise at scale, and turn data into predictable revenue. Lead the AI marketing revolution."
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          'name': 'Imba Marketing',
          'url': 'https://imbamarketing.com',
          'description': 'AI-powered marketing agency building growth systems for modern brands.',
        }}
      />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-20 px-6 lg:px-12 bg-ink overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
        <div className="absolute top-1/4 right-0 w-[50vw] h-[70vh] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 100% 40%, rgba(0,212,255,0.05) 0%, transparent 65%)' }} />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 0% 100%, rgba(232,69,42,0.06) 0%, transparent 65%)' }} />

        <div className="relative max-w-screen-xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-8 reveal">
                <div className="badge-cyber">AI-Powered Marketing</div>
              </div>

              <h1 className="font-display font-light leading-[1.05] mb-8 reveal reveal-delay-1"
                style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
                We build<br />
                <em className="holo-text not-italic">AI-driven</em><br />
                growth engines.
              </h1>

              <p className="text-smoke-dim leading-relaxed mb-10 max-w-lg reveal reveal-delay-2" style={{ fontSize: '1.05rem', fontWeight: 300 }}>
                Don't just join the AI revolution — lead it. We design intelligent marketing systems that automate campaigns, personalise at scale, and turn data into predictable revenue.
              </p>

              <div className="flex flex-wrap gap-4 reveal reveal-delay-3">
                <button onClick={() => openModal()} className="btn btn-primary">
                  Get your free strategy call →
                </button>
                <Link to="/results" className="btn btn-outline">
                  See our results
                </Link>
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-8 reveal reveal-delay-4">
                {STATS.map(({ num, sup, label }) => (
                  <div key={label}>
                    <div className="font-display font-light leading-none" style={{ fontSize: '2.2rem' }}>
                      <span className="stat-num">{num}</span>
                      <em className="text-ember not-italic text-xl">{sup}</em>
                    </div>
                    <div className="font-mono-custom text-[0.58rem] tracking-[0.16em] uppercase text-smoke-faint mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Dashboard panel */}
            <div className="hidden lg:block relative reveal reveal-delay-2">
              <div className="relative bg-ink-2 border border-white/5 p-8 hud-card holo-shimmer">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                  <span className="eyebrow-cyber">AI Growth Engine</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-ember animate-pulse" />
                    <span className="data-readout">LIVE</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { label: 'Campaign ROAS', val: '4.8×', delta: '↑ 23%' },
                    { label: 'Lead Quality Score', val: '94', delta: '↑ 31pts' },
                    { label: 'Cost per Acquisition', val: '$18.40', delta: '↓ 40%' },
                    { label: 'Content Published', val: '847', delta: '↑ 12×' },
                  ].map(({ label, val, delta }) => (
                    <div key={label} className="bg-ink-3 border border-white/5 p-4">
                      <p className="data-readout mb-2">{label}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display font-light text-2xl text-smoke">{val}</span>
                        <span className="font-mono-custom text-[0.58rem]" style={{ color: '#3CBFAE' }}>{delta}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  {[
                    { step: 'Data Ingestion & Modelling', status: 'active' },
                    { step: 'Audience Intelligence', status: 'active' },
                    { step: 'Creative Optimisation', status: 'processing' },
                    { step: 'Campaign Execution', status: 'active' },
                    { step: 'Continuous Learning Loop', status: 'active' },
                  ].map(({ step, status }) => (
                    <div key={step} className="flex items-center gap-3 py-2 border-b border-white/4 last:border-0">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status === 'processing' ? 'bg-gold animate-pulse' : 'bg-cyber'}`} />
                      <span className="font-mono-custom text-[0.62rem] text-smoke-dim tracking-wide flex-1">{step}</span>
                      <span className="font-mono-custom text-[0.55rem] tracking-[0.14em] uppercase"
                        style={{ color: status === 'processing' ? '#C9A96E' : '#3CBFAE' }}>
                        {status === 'processing' ? 'Running' : 'Active'}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-4 right-5 font-mono-custom text-[0.52rem] text-smoke-faint/20 tracking-widest select-none">
                  IMBA.MKT // v2.6
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="angular-divider" />

      {/* SERVICES */}
      <section className="py-28 px-6 lg:px-12 bg-ink-2">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-end mb-16">
            <div>
              <p className="eyebrow mb-5 reveal">What we build</p>
              <h2 className="font-display font-light leading-tight reveal reveal-delay-1"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
                Six AI systems.<br />
                <em className="text-gold italic">Infinite leverage.</em>
              </h2>
            </div>
            <p className="text-smoke-dim leading-relaxed reveal reveal-delay-2" style={{ fontSize: '0.95rem' }}>
              We don't run campaigns — we build intelligent marketing systems that run themselves, learn continuously, and compound results over time. Your vision, amplified by intelligence.
            </p>
          </div>

          <div className="services-grid">
            {SERVICES.map(({ key, icon, label, desc, color }, i) => (
              <div
                key={key}
                className="bg-ink-2 p-8 relative overflow-hidden transition-all duration-300 hover:bg-ink-3 reveal flex flex-col cursor-pointer hud-card"
                style={{ transitionDelay: `${i * 50}ms` }}
                onMouseEnter={() => setActiveService(key)}
                onMouseLeave={() => setActiveService(null)}
              >
                <span className="absolute top-4 right-5 font-display text-[4.5rem] font-light leading-none select-none"
                  style={{ color: 'rgba(255,255,255,0.025)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="w-10 h-10 border flex items-center justify-center mb-6 text-lg transition-all duration-300"
                  style={{ borderColor: activeService === key ? color : `${color}40`, color,
                    boxShadow: activeService === key ? `0 0 16px ${color}25` : 'none' }}>
                  {icon}
                </div>
                <h3 className="font-display font-light text-smoke text-xl mb-3">{label}</h3>
                <p className="text-sm text-smoke-dim leading-relaxed flex-1">{desc}</p>
                <div className="pt-5 mt-5 border-t border-white/5">
                  <Link to={`/services/${key}`}
                    className="font-mono-custom text-[0.62rem] tracking-[0.14em] uppercase flex items-center gap-2 transition-all duration-200 hover:gap-3"
                    style={{ color }}>
                    <span>Explore system</span><span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="py-28 px-6 lg:px-12 bg-ink">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <p className="eyebrow mb-5 reveal">Our approach</p>
            <h2 className="font-display font-light leading-tight mb-10 reveal reveal-delay-1"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.8rem)' }}>
              Intelligence-first.<br />
              <em className="text-gold italic">Results-obsessed.</em>
            </h2>
            {[
              { n: '01', title: 'Audit & Intelligence', desc: 'We analyse your current funnel, ad accounts, content, and data infrastructure. AI identifies the exact gaps costing you revenue.' },
              { n: '02', title: 'System Design', desc: 'We architect a bespoke AI marketing system mapped to your business goals — not off-the-shelf tools bolted together.' },
              { n: '03', title: 'Build & Deploy', desc: 'We build, integrate, and launch your AI systems within 2–4 weeks. Every component is tested before it touches your audience.' },
              { n: '04', title: 'Optimise & Scale', desc: 'The systems learn continuously. We monitor, tune, and expand capabilities as your growth compounds month over month.' },
            ].map(({ n, title, desc }, i) => (
              <div key={n} className="flex gap-5 py-6 border-b border-white/5 group hover:pl-3 transition-all duration-300 reveal"
                style={{ transitionDelay: `${i * 80}ms` }}>
                <span className="font-mono-custom text-[0.7rem] text-ember opacity-70 mt-1 min-w-[2rem]">{n}</span>
                <div>
                  <h3 className="font-display text-xl text-smoke mb-1.5 group-hover:text-ember transition-colors">{title}</h3>
                  <p className="text-sm text-smoke-dim leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal reveal-delay-2">
            <div className="bg-ink-2 border border-white/5 p-8">
              <p className="font-mono-custom text-[0.62rem] tracking-[0.18em] uppercase text-smoke-faint mb-6">Why imba.marketing</p>
              {[
                { title: 'Systems, not campaigns', desc: "We build AI engines that work autonomously — not one-off campaigns that die when the budget pauses. Compounding results, not renting attention." },
                { title: 'Revenue-first thinking', desc: "Every system we build is tied to a revenue metric. Beautiful marketing that doesn't convert is a cost centre. We build profit centres." },
                { title: 'Full-stack AI capability', desc: 'From custom GPT pipelines and ad automation to personalisation engines and predictive analytics — we build the full stack in-house.' },
                { title: 'Speed without chaos', desc: "First AI-driven results in 48 hours. Full system live in 2–4 weeks. We've engineered a deployment process that doesn't sacrifice quality for speed." },
              ].map(({ title, desc }, i) => (
                <div key={title} className="flex gap-4 py-5 border-b border-white/5 last:border-0"
                  style={{ transitionDelay: `${i * 60}ms` }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-cyber mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-smoke font-medium text-sm mb-1">{title}</p>
                    <p className="text-smoke-dim text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="angular-divider" />

      {/* RESULTS */}
      <section className="py-28 px-6 lg:px-12 bg-ink-2">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
            <div>
              <p className="eyebrow mb-4 reveal">Proven results</p>
              <h2 className="font-display font-light leading-tight reveal reveal-delay-1"
                style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
                Results that<br /><em className="text-gold italic">speak for themselves.</em>
              </h2>
            </div>
            <Link to="/results" className="btn btn-outline reveal reveal-delay-2">All case studies →</Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {RESULTS.map(({ client, category, headline, desc, color }, i) => (
              <div key={client} className="bg-ink-2 p-8 hover:bg-ink-3 transition-colors reveal flex flex-col"
                style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                  <span className="font-mono-custom text-[0.58rem] tracking-[0.16em] uppercase text-smoke-faint">{client}</span>
                  <span className="font-mono-custom text-[0.56rem] tracking-[0.12em] uppercase px-2 py-0.5"
                    style={{ color, background: `${color}12`, border: `1px solid ${color}25` }}>{category}</span>
                </div>
                <h3 className="font-display font-light leading-tight mb-3 flex-1"
                  style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', color }}>{headline}</h3>
                <p className="text-sm text-smoke-dim leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28 px-6 lg:px-12 bg-ink">
        <div className="max-w-screen-xl mx-auto">
          <p className="eyebrow mb-4 reveal">Client voice</p>
          <h2 className="font-display font-light leading-tight mb-14 reveal reveal-delay-1"
            style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
            What our clients <em className="text-gold italic">say.</em>
          </h2>
          <div className="grid md:grid-cols-3 gap-px bg-white/5">
            {testimonials.map((t, i) => (
              <div key={t.id} className="bg-ink p-8 relative reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="absolute top-5 right-6 font-display text-[5rem] font-light leading-none select-none"
                  style={{ color: 'rgba(232,69,42,0.05)' }}>"</div>
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

      {/* CLIENTS */}
      <section className="py-16 px-6 lg:px-12 bg-ink-2 border-t border-white/5">
        <div className="max-w-screen-xl mx-auto">
          <p className="font-mono-custom text-[0.62rem] tracking-[0.2em] uppercase text-smoke-faint/50 mb-8 text-center reveal">
            Trusted by growth-focused brands worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 reveal reveal-delay-1">
            {['FoodCo International', 'NordShop', 'Velour Boutique', 'BrandX', 'Magic Mind', 'Irving Books', 'Prime Real Estate', 'Ogitive'].map(c => (
              <span key={c} className="font-mono-custom text-[0.65rem] tracking-[0.14em] uppercase text-smoke-faint/35 hover:text-smoke-faint transition-colors">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden" style={{ background: '#E8452A' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 8px)',
        }} />
        <div className="relative px-6 lg:px-12 py-24 max-w-screen-xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          <div>
            <h2 className="font-display font-light leading-tight text-ink"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
              Don't just run ads.<br /><em>Build a growth machine.</em>
            </h2>
            <p className="text-ink/60 mt-4" style={{ fontSize: '0.95rem' }}>
              Free strategy call · No commitment · Results within 48 hours.
            </p>
          </div>
          <button onClick={() => openModal()}
            className="flex-shrink-0 font-mono-custom text-[0.7rem] tracking-[0.14em] uppercase px-10 py-5 cursor-pointer"
            style={{ background: '#0A0A0B', color: '#F5F4F0', border: 'none' }}>
            Book your free strategy call →
          </button>
        </div>
      </section>
    </>
  )
}
