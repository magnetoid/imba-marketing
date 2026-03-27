import { useState } from 'react'
import Seo from '@/components/Seo'
import { useQuoteModal } from '@/contexts/QuoteModalContext'

const PLANS = [
  {
    name: 'Starter',
    price: '$2,900',
    period: '/mo',
    tagline: 'For growing brands ready to scale with AI marketing',
    color: '#3CBFAE',
    popular: false,
    features: [
      'AI ad management (1 platform)',
      'Marketing automation setup',
      'AI email campaigns (welcome, nurture, re-engagement)',
      'AI content creation (12 posts/mo)',
      'Monthly performance report',
      'Conversion tracking setup',
      'Dedicated account manager',
      'Cancel anytime',
    ],
    ideal: 'Brands spending $5K–$20K/mo on marketing',
    cta: 'Start growing',
  },
  {
    name: 'Growth',
    price: '$5,900',
    period: '/mo',
    tagline: 'For ambitious brands ready to dominate with AI',
    color: '#E8452A',
    popular: true,
    features: [
      'Everything in Starter, plus:',
      'AI ad management (all platforms)',
      'Dynamic retargeting campaigns',
      'AI personalization (emails + website)',
      'AI content engine (60+ posts/mo)',
      'Competitor & market intelligence',
      'Funnel optimization & A/B testing',
      'Weekly strategy calls',
      'Landing page optimization',
      'Audience segmentation & targeting',
    ],
    ideal: 'Brands spending $20K–$75K/mo on marketing',
    cta: 'Scale faster',
  },
  {
    name: 'Enterprise',
    price: '$12,900',
    period: '/mo',
    tagline: 'Full AI marketing department for high-growth brands',
    color: '#C9A96E',
    popular: false,
    features: [
      'Everything in Growth, plus:',
      'Custom AI models trained on your data',
      'Predictive analytics & demand forecasting',
      'Multi-brand / multi-market management',
      'Advanced customer lifetime value optimization',
      'AI-powered loyalty & retention programs',
      'White-glove onboarding & migration',
      'Priority support & Slack channel',
      'Quarterly business reviews',
      'Custom integrations & API access',
    ],
    ideal: 'Brands spending $75K+/mo on marketing',
    cta: 'Talk to us',
  },
]

const ADDONS = [
  { name: 'AI Video Ads', price: '$990/mo', desc: 'AI-generated product video ads for TikTok, Reels, and YouTube Shorts' },
  { name: 'Influencer AI Matching', price: '$790/mo', desc: 'AI finds and scores the best influencers for your brand and products' },
  { name: 'International Expansion', price: '$1,490/mo', desc: 'Localized ads, content, and campaigns for new markets' },
  { name: 'AI Chatbot & Support', price: '$690/mo', desc: 'AI-powered customer service bot trained on your brand, services, and knowledge base' },
]

const FAQ = [
  {
    q: 'Can I switch plans later?',
    a: 'Yes — you can upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle. No penalties.',
  },
  {
    q: 'Is there a setup fee?',
    a: 'No. Setup, onboarding, and initial AI training are all included in your monthly plan. You only pay the monthly fee.',
  },
  {
    q: 'What if I\'m not happy with the results?',
    a: 'You can cancel anytime — no long-term contracts. But 98% of our clients stay because they see real results within the first month.',
  },
  {
    q: 'How long until I see results?',
    a: 'Most clients see first improvements within 48 hours. Significant revenue impact typically shows within 2–4 weeks of full deployment.',
  },
  {
    q: 'What platforms do you integrate with?',
    a: 'We integrate with all major platforms — HubSpot, Salesforce, Google Ads, Meta, Mailchimp, Shopify, WooCommerce, and many more. Whether you\'re in e-commerce, SaaS, or services, we build on the tools you already use.',
  },
  {
    q: 'What\'s included in the onboarding?',
    a: 'Full audit of your brand, ad accounts, and marketing stack. We set up tracking, connect your tools, train the AI on your brand, and launch within 2–4 weeks.',
  },
]

const COMPARE = [
  { feature: 'AI ad management', starter: '1 platform', growth: 'All platforms', enterprise: 'All + custom' },
  { feature: 'AI content creation', starter: '12 posts/mo', growth: '60+ posts/mo', enterprise: 'Unlimited' },
  { feature: 'Email automation', starter: '3 core flows', growth: 'Full lifecycle', enterprise: 'Full + custom AI' },
  { feature: 'Personalization', starter: '—', growth: 'Email + website', enterprise: 'Omnichannel' },
  { feature: 'Competitor intelligence', starter: '—', growth: 'Monthly reports', enterprise: 'Real-time alerts' },
  { feature: 'Funnel optimization', starter: '—', growth: 'A/B testing', enterprise: 'Advanced multivariate' },
  { feature: 'Strategy calls', starter: 'Monthly', growth: 'Weekly', enterprise: 'Unlimited' },
  { feature: 'Custom AI models', starter: '—', growth: '—', enterprise: '✓' },
  { feature: 'Dedicated Slack channel', starter: '—', growth: '—', enterprise: '✓' },
]

export default function Pricing() {
  const { openModal } = useQuoteModal()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      <Seo
        title="Pricing — AI Marketing Plans for Growing Brands"
        description="Transparent monthly pricing for AI-powered marketing. No setup fees, no long-term contracts. Plans from $2,900/mo."
        canonicalPath="/pricing"
      />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="pt-36 pb-20 px-6 lg:px-12 bg-ink relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[50vw] h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 100% 40%, rgba(0,212,255,0.05) 0%, transparent 65%)' }}
        />
        <div className="relative max-w-screen-xl mx-auto text-center">
          <p className="eyebrow justify-center mb-5 reveal">Simple, transparent pricing</p>
          <h1 className="font-display font-light leading-tight mb-6 reveal reveal-delay-1"
            style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
            One monthly fee.<br />
            <em className="text-gold italic">Everything included.</em>
          </h1>
          <p className="text-smoke-dim leading-relaxed max-w-xl mx-auto reveal reveal-delay-2" style={{ fontSize: '1rem' }}>
            No setup fees. No hidden costs. No long-term contracts. Pick the plan that fits your brand, and start seeing results within 48 hours.
          </p>
        </div>
      </section>

      {/* ── PRICING CARDS ─────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-12 bg-ink-2">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {PLANS.map((plan, i) => (
              <div
                key={plan.name}
                className={`relative flex flex-col bg-ink border p-8 lg:p-10 reveal stacked-card ${
                  plan.popular ? 'pricing-highlight border-ember/40' : 'border-white/8'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="font-mono-custom text-[0.6rem] tracking-[0.18em] uppercase px-4 py-1.5 bg-ember text-ink">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-8">
                  <h3 className="font-display font-light text-2xl text-smoke mb-2">{plan.name}</h3>
                  <p className="font-mono-custom text-[0.6rem] tracking-wider uppercase mb-6" style={{ color: plan.color }}>
                    {plan.tagline}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display font-light text-smoke" style={{ fontSize: '3.2rem', lineHeight: 1 }}>
                      {plan.price}
                    </span>
                    <span className="font-mono-custom text-[0.7rem] text-smoke-faint">{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="flex-1 space-y-3 mb-8">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2.5">
                      {fi === 0 && plan.name !== 'Starter' ? (
                        <span className="font-mono-custom text-[0.62rem] text-smoke-dim tracking-wide">{f}</span>
                      ) : (
                        <>
                          <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: plan.color }} />
                          <span className="text-sm text-smoke-dim leading-relaxed">{f}</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>

                {/* Ideal for */}
                <p className="font-mono-custom text-[0.58rem] tracking-wider text-smoke-faint/50 uppercase mb-6">
                  Ideal for: {plan.ideal}
                </p>

                {/* CTA */}
                <button
                  onClick={() => openModal()}
                  className={`w-full font-mono-custom text-[0.65rem] tracking-[0.14em] uppercase py-4 transition-all duration-200 cursor-pointer ${
                    plan.popular
                      ? 'bg-ember text-ink hover:bg-ember-bright'
                      : 'border border-white/12 text-smoke-dim hover:border-white/25 hover:text-smoke'
                  }`}
                >
                  {plan.cta} →
                </button>
              </div>
            ))}
          </div>

          <p className="text-center mt-10 text-smoke-faint text-sm reveal">
            All plans include free onboarding, AI setup, and a dedicated account manager.{' '}
            <button onClick={() => openModal()} className="text-ember hover:underline underline-offset-4 cursor-pointer">
              Not sure which plan? Let us help →
            </button>
          </p>
        </div>
      </section>

      {/* ── COMPARISON TABLE ──────────────────────────────── */}
      <section className="py-20 px-6 lg:px-12 bg-ink">
        <div className="max-w-screen-xl mx-auto">
          <p className="eyebrow mb-4 reveal">Plan comparison</p>
          <h2 className="font-display font-light leading-tight mb-12 reveal reveal-delay-1"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
            See what's included in <em className="text-gold italic">each plan</em>
          </h2>

          <div className="overflow-x-auto reveal reveal-delay-2">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left py-4 pr-6 font-mono-custom text-[0.6rem] tracking-[0.18em] uppercase text-smoke-faint w-1/4">Feature</th>
                  <th className="text-center py-4 px-4 font-mono-custom text-[0.6rem] tracking-[0.18em] uppercase w-1/4" style={{ color: '#3CBFAE' }}>Starter</th>
                  <th className="text-center py-4 px-4 font-mono-custom text-[0.6rem] tracking-[0.18em] uppercase w-1/4" style={{ color: '#E8452A' }}>Growth</th>
                  <th className="text-center py-4 px-4 font-mono-custom text-[0.6rem] tracking-[0.18em] uppercase w-1/4" style={{ color: '#C9A96E' }}>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map(({ feature, starter, growth, enterprise }) => (
                  <tr key={feature} className="border-b border-white/5 hover:bg-ink-2/50 transition-colors">
                    <td className="py-4 pr-6 text-sm text-smoke-dim">{feature}</td>
                    <td className="py-4 px-4 text-center text-sm text-smoke-faint">{starter}</td>
                    <td className="py-4 px-4 text-center text-sm text-smoke">{growth}</td>
                    <td className="py-4 px-4 text-center text-sm text-smoke">{enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── ADD-ONS ──────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-12 bg-ink-2 border-t border-white/5">
        <div className="max-w-screen-xl mx-auto">
          <p className="eyebrow mb-4 reveal">Power-ups</p>
          <h2 className="font-display font-light leading-tight mb-12 reveal reveal-delay-1"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
            Add-ons for <em className="text-gold italic">extra firepower</em>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {ADDONS.map(({ name, price, desc }, i) => (
              <div key={name} className="bg-ink-2 p-8 hover:bg-ink-3 transition-colors reveal"
                style={{ transitionDelay: `${i * 60}ms` }}>
                <h3 className="font-display font-light text-smoke text-lg mb-2">{name}</h3>
                <p className="font-mono-custom text-[0.65rem] text-ember tracking-wider mb-3">{price}</p>
                <p className="text-sm text-smoke-dim leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT EVERY PLAN INCLUDES ─────────────────────── */}
      <section className="py-20 px-6 lg:px-12 bg-ink">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="eyebrow mb-4 reveal">What every plan includes</p>
            <h2 className="font-display font-light leading-tight mb-8 reveal reveal-delay-1"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
              No surprises.<br /><em className="text-gold italic">Just results.</em>
            </h2>
            <p className="text-smoke-dim leading-relaxed mb-8 reveal reveal-delay-2" style={{ fontSize: '0.95rem' }}>
              Every plan is designed to pay for itself within the first month. We tie everything to revenue — so you always know exactly what you're getting for your investment.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 reveal reveal-delay-2">
            {[
              { icon: '✓', text: 'Free onboarding & setup' },
              { icon: '✓', text: 'Dedicated account manager' },
              { icon: '✓', text: 'CRM & platform integrations' },
              { icon: '✓', text: 'AI trained on your brand' },
              { icon: '✓', text: 'Real-time performance dashboard' },
              { icon: '✓', text: 'Cancel anytime — no contracts' },
              { icon: '✓', text: 'Monthly ROI reporting' },
              { icon: '✓', text: '48-hour first results guarantee' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-start gap-3 py-3">
                <span className="text-ember text-sm flex-shrink-0 mt-0.5">{icon}</span>
                <span className="text-sm text-smoke-dim leading-relaxed">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-12 bg-ink-2">
        <div className="max-w-screen-xl mx-auto">
          <p className="eyebrow mb-4 reveal">Pricing questions</p>
          <h2 className="font-display font-light leading-tight mb-12 reveal reveal-delay-1"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
            Common <em className="text-gold italic">questions</em>
          </h2>
          <div className="max-w-2xl flex flex-col divide-y divide-white/8">
            {FAQ.map((item, i) => (
              <div key={i} className="py-5">
                <button
                  className="w-full flex items-center justify-between text-left gap-4 group"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-display font-light text-lg text-smoke group-hover:text-smoke transition-colors">
                    {item.q}
                  </span>
                  <span className="text-smoke-faint flex-shrink-0 transition-transform duration-200"
                    style={{ transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <p className="mt-3 text-smoke-dim text-base leading-relaxed" style={{ fontWeight: 300 }}>
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#E8452A' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 8px)',
        }} />
        <div className="relative px-6 lg:px-12 py-24 max-w-screen-xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          <div>
            <h2 className="font-display font-light leading-tight text-ink"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
              Ready to transform your marketing?<br /><em>Let's talk.</em>
            </h2>
            <p className="text-ink/60 mt-4" style={{ fontSize: '0.95rem' }}>
              Free strategy call · No commitment · See results in 48 hours.
            </p>
          </div>
          <button onClick={() => openModal()}
            className="flex-shrink-0 font-mono-custom text-[0.7rem] tracking-[0.14em] uppercase px-10 py-5 cursor-pointer"
            style={{ background: '#0A0A0B', color: '#F5F4F0', border: 'none' }}>
            Get your free growth plan →
          </button>
        </div>
      </section>
    </>
  )
}
