import Seo from '@/components/Seo'
import { useQuoteModal } from '@/contexts/QuoteModalContext'

const PACKAGES = [
  {
    name: 'Growth Engine',
    tagline: 'Single AI system',
    price: '3,000',
    unit: '/month',
    color: '#3CBFAE',
    popular: false,
    description: 'One AI system built, deployed, and continuously optimised — ideal for businesses starting their AI marketing journey.',
    includes: [
      '1 AI system (choose any)',
      'Initial audit & system design',
      'Full build & integration',
      'Monthly optimisation review',
      'Performance dashboard',
      'Dedicated Slack channel',
    ],
    bestFor: 'Startups · SMBs · First AI system',
  },
  {
    name: 'Scale Stack',
    tagline: 'Multi-system deployment',
    price: '8,000',
    unit: '/month',
    color: '#C9A96E',
    popular: true,
    description: 'Two to three AI systems working together — the most popular choice for brands ready to unlock compounding growth.',
    includes: [
      '2–3 AI systems (your choice)',
      'Full-funnel audit & strategy',
      'All systems built & integrated',
      'Weekly optimisation calls',
      'Cross-system intelligence sharing',
      'Unified performance dashboard',
      'Dedicated account strategist',
    ],
    bestFor: 'Growth-stage brands · Series A+ · eCommerce',
  },
  {
    name: 'AI Marketing OS',
    tagline: 'Full-stack AI transformation',
    price: 'Custom',
    unit: 'tailored pricing',
    color: '#E8452A',
    popular: false,
    description: 'The complete AI marketing operating system — all six systems deployed, integrated, and continuously evolved for enterprise-level results.',
    includes: [
      'All 6 AI marketing systems',
      'Executive strategy sessions',
      'Custom AI model development',
      'Full tech stack integration',
      'Dedicated AI engineering team',
      'Real-time analytics suite',
      'Priority 24/7 support',
      'Quarterly growth roadmap',
    ],
    bestFor: 'Enterprise · High-growth brands · Series B+',
  },
]

const FAQ = [
  { q: 'Is there a minimum contract length?', a: 'We work on 3-month minimum engagements to ensure the AI systems have sufficient time to learn and deliver meaningful results. After 3 months, engagements are month-to-month.' },
  { q: 'What\'s included in the setup phase?', a: 'Setup includes a full marketing audit, system architecture design, AI model training, platform integrations, and launch. Setup is typically completed within 2–4 weeks at no additional cost.' },
  { q: 'Can I upgrade or add systems later?', a: 'Yes — you can add AI systems at any time. We recommend starting with the highest-impact system for your business and expanding as results compound.' },
  { q: 'Do you work with our existing tools?', a: 'Yes. We integrate with all major marketing platforms: Google Ads, Meta, HubSpot, Salesforce, Klaviyo, Shopify, and more. Our systems connect to your existing stack, not replace it.' },
  { q: 'What if we don\'t see results?', a: 'We\'ve never had a client that didn\'t see measurable improvement within 90 days. If you don\'t, we continue working at no additional cost until we deliver the agreed results.' },
]

export default function Pricing() {
  const { openModal } = useQuoteModal()

  return (
    <>
      <Seo
        title="Pricing — AI Marketing Systems"
        description="Transparent pricing for AI marketing systems. From single-system deployments to full AI marketing operating systems."
        canonicalPath="/pricing"
      />

      {/* ── HERO ──────────────────────────────────────── */}
      <section className="pt-36 pb-20 px-6 lg:px-12 bg-ink relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />
        <div className="relative max-w-screen-xl mx-auto text-center">
          <p className="eyebrow mb-6 reveal justify-center">Investment</p>
          <h1 className="font-display font-light leading-tight mb-6 reveal reveal-delay-1"
            style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
            Simple, transparent<br />
            <em className="text-gold italic">AI marketing pricing.</em>
          </h1>
          <p className="text-smoke-dim leading-relaxed max-w-2xl mx-auto reveal reveal-delay-2" style={{ fontSize: '1rem' }}>
            No hidden fees, no surprise invoices. Every package includes system design, build, integration, and continuous AI optimisation.
          </p>
        </div>
      </section>

      {/* ── PACKAGES ──────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-12 bg-ink-2">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-px bg-white/5">
            {PACKAGES.map(({ name, tagline, price, unit, color, popular, description, includes, bestFor }, i) => (
              <div
                key={name}
                className="bg-ink-2 p-8 relative flex flex-col reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {popular && (
                  <div className="absolute top-0 right-8 -translate-y-1/2">
                    <span className="font-mono-custom text-[0.55rem] tracking-[0.14em] uppercase px-3 py-1"
                      style={{ background: color, color: '#0A0A0B' }}>
                      Most popular
                    </span>
                  </div>
                )}

                <div className="mb-6 pb-6 border-b border-white/5">
                  <h2 className="font-display font-light text-smoke text-2xl mb-1">{name}</h2>
                  <p className="font-mono-custom text-[0.62rem] tracking-[0.16em] uppercase mb-5" style={{ color }}>{tagline}</p>
                  <div className="flex items-baseline gap-2">
                    {price === 'Custom' ? (
                      <span className="font-display font-light text-smoke" style={{ fontSize: '2.4rem' }}>Custom</span>
                    ) : (
                      <>
                        <span className="font-mono-custom text-smoke-faint text-sm">$</span>
                        <span className="font-display font-light text-smoke" style={{ fontSize: '2.4rem' }}>{price}</span>
                        <span className="font-mono-custom text-[0.62rem] tracking-wide text-smoke-faint">{unit}</span>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-smoke-dim text-sm leading-relaxed mb-6">{description}</p>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {includes.map(item => (
                    <li key={item} className="flex items-start gap-2.5">
                      <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
                      <span className="font-mono-custom text-[0.62rem] text-smoke-dim tracking-wide">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <div className="font-mono-custom text-[0.58rem] tracking-[0.14em] uppercase text-smoke-faint/50 mb-4">
                    Best for: {bestFor}
                  </div>
                  <button
                    onClick={() => openModal()}
                    className="w-full font-mono-custom text-[0.65rem] tracking-[0.14em] uppercase py-3.5 transition-all duration-200 hover:opacity-90"
                    style={{ background: color, color: '#0A0A0B' }}
                  >
                    {price === 'Custom' ? 'Get custom quote →' : 'Start with this plan →'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S ALWAYS INCLUDED ──────────────────── */}
      <section className="py-24 px-6 lg:px-12 bg-ink">
        <div className="max-w-screen-xl mx-auto">
          <p className="eyebrow mb-4 reveal text-center justify-center">Always included</p>
          <h2 className="font-display font-light leading-tight mb-14 text-center reveal reveal-delay-1"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
            Every plan includes<br /><em className="text-gold italic">these foundations</em>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {[
              { icon: '◈', title: 'Free audit', desc: 'Full marketing & funnel audit before we begin. No cost, no commitment.' },
              { icon: '▣', title: 'Custom architecture', desc: 'Every system designed specifically for your business — no templates.' },
              { icon: '◉', title: 'Full integration', desc: 'We connect to your entire stack. Zero disruption to existing campaigns.' },
              { icon: '◫', title: 'Continuous AI learning', desc: 'Your systems improve automatically with every data point collected.' },
            ].map(({ icon, title, desc }, i) => (
              <div key={title} className="bg-ink p-8 reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="text-ember text-xl mb-5">{icon}</div>
                <h3 className="font-display font-light text-smoke text-xl mb-3">{title}</h3>
                <p className="text-smoke-dim text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-12 bg-ink-2">
        <div className="max-w-screen-xl mx-auto max-w-3xl">
          <p className="eyebrow mb-4 reveal">Pricing questions</p>
          <h2 className="font-display font-light leading-tight mb-12 reveal reveal-delay-1"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
            Common questions<br /><em className="text-gold italic">answered</em>
          </h2>
          <div className="space-y-0">
            {FAQ.map(({ q, a }, i) => (
              <div key={q} className="border-b border-white/5 py-7 reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                <h3 className="font-display font-light text-smoke text-xl mb-3">{q}</h3>
                <p className="text-smoke-dim text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#E8452A' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 8px)',
        }} />
        <div className="relative px-6 lg:px-12 py-20 max-w-screen-xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <h2 className="font-display font-light leading-tight text-ink"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.8rem)' }}>
              Not sure which plan<br /><em>is right for you?</em>
            </h2>
            <p className="text-ink/60 mt-3" style={{ fontSize: '0.95rem' }}>
              Free strategy call · We'll recommend the best fit for your goals.
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex-shrink-0 font-mono-custom text-[0.7rem] tracking-[0.14em] uppercase px-8 py-4 cursor-pointer"
            style={{ background: '#0A0A0B', color: '#F5F4F0', border: 'none' }}>
            Book your free strategy call →
          </button>
        </div>
      </section>
    </>
  )
}
