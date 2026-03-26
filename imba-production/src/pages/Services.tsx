import { Link } from 'react-router-dom'
import Seo from '@/components/Seo'

const SERVICES = [
  {
    key: 'growth', slug: 'growth',
    icon: '◈',
    label: 'AI Growth Systems',
    tagline: 'Transform marketing and sales into an intelligent machine',
    desc: 'We design AI-powered growth systems that automate workflows, optimise campaigns, and turn data into decisions — scaling faster with less effort. From lead scoring to revenue attribution, every component works together to drive compounding growth.',
    features: ['AI workflow automation', 'Campaign intelligence', 'Lead scoring & nurturing', 'Predictive analytics'],
    stat: '3×',
    statLabel: 'average revenue growth in year one',
    color: '#E8452A',
  },
  {
    key: 'ads', slug: 'ads',
    icon: '▣',
    label: 'AI Performance Advertising',
    tagline: 'Turn ad spend into predictable revenue',
    desc: 'Our AI advertising systems continuously test creatives, audiences, and offers in real time — maximising ROI while eliminating wasted budget. Real-time optimisation at a scale no human team can match.',
    features: ['Cross-platform ad automation', 'Real-time creative testing', 'Audience intelligence', 'Budget optimisation'],
    stat: '300%',
    statLabel: 'average ROAS improvement',
    color: '#C9A96E',
  },
  {
    key: 'personalisation', slug: 'personalisation',
    icon: '◉',
    label: 'AI Personalisation Systems',
    tagline: 'The right message to the right person at the perfect moment',
    desc: 'We build AI systems that personalise content, outreach, and experiences at scale across every touchpoint. Dynamic personalisation turns generic messaging into individual conversations — driving engagement and loyalty that compounds.',
    features: ['Dynamic content personalisation', 'Behavioural segmentation', 'Email & SMS personalisation', 'Website personalisation'],
    stat: '5×',
    statLabel: 'higher engagement vs. generic messaging',
    color: '#00D4FF',
  },
  {
    key: 'content', slug: 'content',
    icon: '▶',
    label: 'AI Content Engines',
    tagline: 'Create endless high-quality content from a single idea',
    desc: 'Our AI-powered engines generate, repurpose, and distribute videos, posts, and campaigns across every platform automatically. One brand session produces a month of content — all brand-consistent, all optimised for performance.',
    features: ['Automated content generation', 'Multi-platform repurposing', 'Brand voice training', 'SEO-optimised output'],
    stat: '30×',
    statLabel: 'content output vs. manual creation',
    color: '#6C7AE0',
  },
  {
    key: 'intelligence', slug: 'intelligence',
    icon: '◬',
    label: 'AI Data & Market Intelligence',
    tagline: 'Stay ahead of competitors with real-time market insights',
    desc: 'Our AI analyses trends, customer behaviour, and competitor activity — surfacing the exact actions that move revenue. Stop guessing and start making decisions backed by intelligence that updates continuously.',
    features: ['Competitor intelligence', 'Market trend analysis', 'Customer behaviour modelling', 'Keyword opportunity mapping'],
    stat: '28%',
    statLabel: 'average organic growth uplift',
    color: '#3CBFAE',
  },
  {
    key: 'funnel', slug: 'funnel',
    icon: '◫',
    label: 'AI Funnel Optimisation',
    tagline: 'Turn more visitors into customers',
    desc: 'Using AI-driven analysis and testing, we identify exactly where your funnel leaks revenue and optimise every step to maximise conversions. From landing pages to checkout — every touchpoint is an opportunity to convert.',
    features: ['Funnel leak detection', 'A/B & multivariate testing', 'Conversion rate optimisation', 'Checkout & landing page AI'],
    stat: '62%',
    statLabel: 'average conversion rate improvement',
    color: '#E87A2A',
  },
]

const PROCESS = [
  { n: '01', title: 'Discovery & Audit', desc: 'We analyse your full marketing stack, funnel, ad accounts, and data infrastructure. AI-driven gap analysis reveals exactly where revenue is being lost.' },
  { n: '02', title: 'System Architecture', desc: 'We design a bespoke AI marketing system tailored to your goals, integrations, and competitive landscape. No templates — every system is custom-built.' },
  { n: '03', title: 'Build & Integration', desc: 'We build, test, and integrate your AI systems with existing tools. Live in 2–4 weeks with zero disruption to ongoing campaigns.' },
  { n: '04', title: 'Scale & Optimise', desc: 'Your systems continuously learn and improve. We expand capabilities as results compound — turning initial wins into lasting growth machines.' },
]

export default function Services() {
  return (
    <>
      <Seo
        title="AI Marketing Services — Growth, Ads, Content & More"
        description="Six AI marketing systems built to generate, optimise, and scale revenue autonomously. Growth systems, performance advertising, personalisation, content engines, data intelligence, and funnel optimisation."
        canonicalPath="/services"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          'name': 'Imba Marketing AI Services',
          'url': 'https://imbamarketing.com/services',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'AI Growth Systems', 'url': 'https://imbamarketing.com/services/growth' },
            { '@type': 'ListItem', 'position': 2, 'name': 'AI Performance Advertising', 'url': 'https://imbamarketing.com/services/ads' },
            { '@type': 'ListItem', 'position': 3, 'name': 'AI Personalisation Systems', 'url': 'https://imbamarketing.com/services/personalisation' },
            { '@type': 'ListItem', 'position': 4, 'name': 'AI Content Engines', 'url': 'https://imbamarketing.com/services/content' },
            { '@type': 'ListItem', 'position': 5, 'name': 'AI Data & Market Intelligence', 'url': 'https://imbamarketing.com/services/intelligence' },
            { '@type': 'ListItem', 'position': 6, 'name': 'AI Funnel Optimisation', 'url': 'https://imbamarketing.com/services/funnel' },
          ],
        }}
      />

      {/* ── PAGE HERO ─────────────────────────────────────── */}
      <section className="pt-36 pb-20 px-6 lg:px-12 bg-ink relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />
        <div className="absolute bottom-0 right-0 w-[50vw] h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 100% 100%, rgba(0,212,255,0.05) 0%, transparent 65%)' }}
        />
        <div className="relative max-w-screen-xl mx-auto">
          <p className="eyebrow mb-5 reveal">What we build</p>
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <div>
              <h1 className="font-display font-light leading-tight mb-6 reveal reveal-delay-1"
                style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
                6 AI systems.<br />
                <em className="text-gold italic">Unlimited scale.</em>
              </h1>
              <p className="text-smoke-dim leading-relaxed max-w-md reveal reveal-delay-2" style={{ fontSize: '0.95rem' }}>
                We don't deliver reports or run campaigns. We build intelligent marketing systems that generate, optimise, and scale revenue autonomously — so your team can focus on strategy, not execution.
              </p>
            </div>
            <div className="hidden lg:flex flex-col gap-3 reveal reveal-delay-2">
              <div className="bg-ink-2 border border-white/5 p-6">
                <p className="font-mono-custom text-[0.62rem] tracking-[0.18em] uppercase text-smoke-faint mb-3">Why AI marketing works</p>
                {[
                  { stat: '300%', label: 'average ROAS improvement' },
                  { stat: '40%', label: 'lower cost per acquisition' },
                  { stat: '2/3', label: 'of marketers say AI tools improve campaign performance' },
                ].map(({ stat, label }) => (
                  <div key={stat} className="flex items-center gap-4 py-2.5 border-b border-white/5 last:border-0">
                    <span className="font-display font-light text-2xl text-ember w-14 flex-shrink-0">{stat}</span>
                    <span className="font-mono-custom text-[0.62rem] text-smoke-dim tracking-wide">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES GRID ─────────────────────────────────── */}
      <section className="bg-ink-2 py-20 px-6 lg:px-12" id="all-services">
        <div className="max-w-screen-xl mx-auto">
          <p className="eyebrow mb-12 reveal">All systems</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {SERVICES.map(({ key, slug, icon, label, tagline, desc, features, stat, statLabel, color }, i) => (
              <div
                key={key}
                className="bg-ink-2 p-8 relative overflow-hidden transition-colors duration-300 hover:bg-ink-3 reveal flex flex-col"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {/* Ghost number */}
                <span className="absolute top-4 right-5 font-display text-[4.5rem] font-light leading-none select-none"
                  style={{ color: 'rgba(255,255,255,0.03)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Icon */}
                <div className="w-10 h-10 border flex items-center justify-center mb-6 text-lg"
                  style={{ borderColor: `${color}40`, color }}>
                  {icon}
                </div>

                <h3 className="font-display font-light text-smoke text-xl mb-1.5">{label}</h3>
                <p className="font-mono-custom text-[0.6rem] tracking-[0.14em] uppercase mb-4" style={{ color }}>{tagline}</p>
                <p className="text-sm text-smoke-dim leading-relaxed mb-5">{desc}</p>

                {/* Features */}
                <ul className="space-y-1.5 mb-6 flex-1">
                  {features.map(f => (
                    <li key={f} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: color }} />
                      <span className="font-mono-custom text-[0.62rem] text-smoke-dim tracking-wide">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Stat + Learn more */}
                <div className="pt-5 border-t border-white/5">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-display font-light text-2xl" style={{ color }}>{stat}</span>
                    <span className="font-mono-custom text-[0.58rem] text-smoke-faint tracking-wide">{statLabel}</span>
                  </div>
                  <Link
                    to={`/services/${slug}`}
                    className="font-mono-custom text-[0.62rem] tracking-[0.14em] uppercase flex items-center gap-2 transition-colors duration-200 hover:gap-3"
                    style={{ color }}
                  >
                    <span>Learn more</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ───────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-12 bg-ink">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="eyebrow mb-4 reveal">How we work</p>
            <h2 className="font-display font-light leading-tight mb-12 reveal reveal-delay-1"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
              From brief to<br /><em className="text-gold italic">live AI system</em>
            </h2>
            {PROCESS.map(({ n, title, desc }, i) => (
              <div key={n}
                className="flex gap-5 py-6 border-b border-white/5 group hover:pl-3 transition-all duration-300 reveal"
                style={{ transitionDelay: `${i * 80}ms` }}>
                <span className="font-mono-custom text-[0.7rem] text-ember opacity-70 mt-1 min-w-[2rem]">{n}</span>
                <div>
                  <h3 className="font-display text-xl text-smoke mb-1.5 group-hover:text-ember transition-colors">{title}</h3>
                  <p className="text-sm text-smoke-dim leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Why choose panel */}
          <div className="reveal reveal-delay-2 lg:pt-20">
            <div className="bg-ink-2 border border-white/5 p-8">
              <p className="font-mono-custom text-[0.62rem] tracking-[0.18em] uppercase text-smoke-faint mb-6">Why Imba Marketing</p>
              {[
                { title: 'Systems, not campaigns', desc: "We build AI engines that work autonomously — not one-off campaigns that die when the budget pauses. Compounding results, not renting attention." },
                { title: 'Revenue-first thinking', desc: "Every system we build is tied to a revenue metric. Beautiful marketing that doesn't convert is a cost centre. We build profit centres." },
                { title: 'Full-stack AI capability', desc: 'From custom GPT pipelines and ad automation to personalisation engines and predictive analytics — we build the full stack in-house.' },
                { title: 'Worldwide delivery', desc: 'Based in Delaware, US & Serbia. We deploy AI systems globally and deliver first results within 48 hours of launch.' },
              ].map(({ title, desc }, i) => (
                <div key={title}
                  className="flex gap-4 py-5 border-b border-white/5 last:border-0"
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

      {/* ── WHITE LABEL STRIP ─────────────────────────────── */}
      <section className="bg-ink-2 border-t border-white/5 py-16 px-6 lg:px-12">
        <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-lg">
            <p className="eyebrow mb-3">For agencies & resellers</p>
            <h2 className="font-display font-light text-smoke leading-tight" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>
              White label AI marketing — <em className="text-gold italic">your brand, our systems</em>
            </h2>
            <p className="text-smoke-dim mt-3" style={{ fontSize: '0.9rem' }}>
              Offer our full range of AI marketing systems under your own branding. Expand your service offering without hiring AI engineers or building new infrastructure.
            </p>
          </div>
          <Link to="/contact" className="btn btn-primary flex-shrink-0">Enquire about white label</Link>
        </div>
      </section>

      {/* ── CTA BAND ─────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#E8452A' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 8px)',
        }} />
        <div className="relative px-6 lg:px-12 py-20 max-w-screen-xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <h2 className="font-display font-light leading-tight text-ink"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.8rem)' }}>
              Don't just market smarter.<br /><em>Market intelligently.</em>
            </h2>
            <p className="text-ink/60 mt-3" style={{ fontSize: '0.95rem' }}>
              Free consultation · No commitment · Reply within 24 hours.
            </p>
          </div>
          <Link to="/contact"
            className="flex-shrink-0 font-mono-custom text-[0.7rem] tracking-[0.14em] uppercase px-8 py-4"
            style={{ background: '#0A0A0B', color: '#F5F4F0' }}>
            Get a free consultation
          </Link>
        </div>
      </section>
    </>
  )
}
