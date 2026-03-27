import { Link } from 'react-router-dom'
import Seo from '@/components/Seo'

const SERVICES = [
  {
    key: 'growth', slug: 'growth',
    icon: '◈',
    label: 'Grow Your Store on Autopilot',
    tagline: 'Your e-commerce marketing runs itself — and gets better daily',
    desc: 'AI manages your entire e-commerce marketing stack. Product campaigns improve on their own, email flows nurture customers automatically, and your Shopify revenue grows — without adding headcount.',
    features: ['Automated product campaigns', 'Smart email flows', 'Budget optimization', 'Revenue attribution'],
    stat: '3×',
    statLabel: 'average store revenue growth in year one',
    color: '#E8452A',
  },
  {
    key: 'ads', slug: 'ads',
    icon: '▣',
    label: 'Get More from Every Ad Dollar',
    tagline: 'AI-powered product ads that actually convert',
    desc: 'AI manages your product ads across Google Shopping, Meta, TikTok, and more — automatically testing creative, optimizing bids, and scaling what sells best across your catalog.',
    features: ['Google Shopping & Meta ads', 'Dynamic product creative', 'Automated bid management', 'Cross-platform ROAS tracking'],
    stat: '300%',
    statLabel: 'better return on ad spend',
    color: '#C9A96E',
  },
  {
    key: 'personalisation', slug: 'personalisation',
    icon: '◉',
    label: 'Personalize Every Shopping Experience',
    tagline: 'Show each shopper products they actually want',
    desc: 'AI personalizes your entire customer journey — product recommendations, email content, on-site experience, and retargeting ads — so every shopper sees what\'s most relevant to them.',
    features: ['Smart product recommendations', 'Personalized email campaigns', 'Dynamic website content', 'Cart recovery optimization'],
    stat: '5×',
    statLabel: 'higher engagement than generic messaging',
    color: '#00D4FF',
  },
  {
    key: 'content', slug: 'content',
    icon: '▶',
    label: 'Product Content at Scale',
    tagline: 'Product descriptions, social posts, ads — all AI-created',
    desc: 'AI creates product descriptions, collection pages, social posts, email campaigns, and ad creatives that match your brand voice — a full month of e-commerce content in a single day.',
    features: ['Product descriptions', 'Social media content', 'Email campaigns', 'Ad creative generation'],
    stat: '30×',
    statLabel: 'more content than doing it manually',
    color: '#6C7AE0',
  },
  {
    key: 'intelligence', slug: 'intelligence',
    icon: '◬',
    label: 'Know What Shoppers Want',
    tagline: 'Competitor pricing, trending products, customer insights',
    desc: 'AI tracks competitor pricing, trending products, and customer search behavior — giving you the data to stock the right products, price competitively, and target the right shoppers.',
    features: ['Competitor price tracking', 'Product trend analysis', 'Customer search insights', 'Keyword opportunity mapping'],
    stat: '28%',
    statLabel: 'average organic growth from new opportunities',
    color: '#3CBFAE',
  },
  {
    key: 'funnel', slug: 'funnel',
    icon: '◫',
    label: 'Turn Browsers into Buyers',
    tagline: 'Same traffic, more orders — better checkout, smarter recovery',
    desc: 'AI finds where shoppers abandon your store and fixes it. Better product pages, smoother checkout, smarter cart recovery emails — more of your existing visitors complete their purchase.',
    features: ['Cart abandonment recovery', 'Checkout optimization', 'Product page testing', 'Exit-intent campaigns'],
    stat: '62%',
    statLabel: 'more shoppers complete checkout',
    color: '#E87A2A',
  },
]

const PROCESS = [
  { n: '01', title: 'We listen to your goals', desc: 'Tell us what you want to achieve. We\'ll look at your current marketing, find what\'s working and what\'s not, and show you exactly where the biggest opportunities are.' },
  { n: '02', title: 'We build your custom plan', desc: 'No templates. We design a marketing plan tailored to your business, your customers, and your budget. You\'ll know exactly what to expect before we start.' },
  { n: '03', title: 'We set everything up', desc: 'We build and connect everything within 2–4 weeks. Your existing tools keep working — we just make them work better. Zero disruption to your business.' },
  { n: '04', title: 'You see results grow', desc: 'Your marketing gets smarter every day. We keep improving, you keep growing. What starts as early wins turns into lasting, compounding growth.' },
]

export default function Services() {
  return (
    <>
      <Seo
        title="What We Do — AI Marketing for E-Commerce Brands"
        description="Six AI-powered services that grow your online store: product ads, personalized shopping, content at scale, checkout optimization. Plans from $2,900/mo."
        canonicalPath="/services"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          'name': 'Imba Marketing Services',
          'url': 'https://imbamarketing.com/services',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Grow Your Revenue on Autopilot', 'url': 'https://imbamarketing.com/services/growth' },
            { '@type': 'ListItem', 'position': 2, 'name': 'Get More from Every Ad Dollar', 'url': 'https://imbamarketing.com/services/ads' },
            { '@type': 'ListItem', 'position': 3, 'name': 'Make Every Customer Feel Special', 'url': 'https://imbamarketing.com/services/personalisation' },
            { '@type': 'ListItem', 'position': 4, 'name': 'A Month of Content in One Day', 'url': 'https://imbamarketing.com/services/content' },
            { '@type': 'ListItem', 'position': 5, 'name': 'Know What Your Customers Want', 'url': 'https://imbamarketing.com/services/intelligence' },
            { '@type': 'ListItem', 'position': 6, 'name': 'Turn More Visitors into Buyers', 'url': 'https://imbamarketing.com/services/funnel' },
          ],
        }}
      />

      {/* ── PAGE HERO ─────────────────────────────────────── */}
      <section className="pt-36 pb-20 px-6 lg:px-12 section-gradient-cyber relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />
        <div className="absolute bottom-0 right-0 w-[50vw] h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 100% 100%, rgba(0,212,255,0.05) 0%, transparent 65%)' }}
        />
        <div className="relative max-w-screen-xl mx-auto">
          <p className="eyebrow mb-5 reveal">AI for e-commerce</p>
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <div>
              <h1 className="font-display font-light leading-tight mb-6 reveal reveal-delay-1"
                style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
                Six ways AI grows<br />
                <em className="text-gold italic">your online store.</em>
              </h1>
              <p className="text-smoke-dim leading-relaxed max-w-md reveal reveal-delay-2" style={{ fontSize: '0.95rem' }}>
                Each service solves a specific e-commerce challenge: more sales, better ads, product content at scale, or smoother checkout. Pick what you need, or get everything in one plan.
              </p>
            </div>
            <div className="hidden lg:flex flex-col gap-3 reveal reveal-delay-2">
              <div className="bg-ink-2 border border-white/5 p-6">
                <p className="font-mono-custom text-[0.62rem] tracking-[0.18em] uppercase text-smoke-faint mb-3">What e-commerce clients typically see</p>
                {[
                  { stat: '3×', label: 'store revenue growth in year one' },
                  { stat: '4.8×', label: 'average ROAS on product ads' },
                  { stat: '48h', label: 'until you see first improvements' },
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
          <p className="eyebrow mb-12 reveal">Choose what you need</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map(({ key, slug, icon, label, tagline, desc, features, stat, statLabel, color }, i) => (
              <div
                key={key}
                className="glass-card gradient-border p-8 relative overflow-hidden reveal flex flex-col"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {/* Ghost number */}
                <span className="absolute top-4 right-5 font-display text-[4.5rem] font-light leading-none select-none"
                  style={{ color: 'rgba(255,255,255,0.03)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Icon */}
                <div className="feature-icon-box text-lg"
                  style={{ background: `${color}10`, color }}>
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
                    <span>See how it works</span>
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
            <p className="eyebrow mb-4 reveal">How it works</p>
            <h2 className="font-display font-light leading-tight mb-12 reveal reveal-delay-1"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
              From first call to<br /><em className="text-gold italic">real results</em>
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
            <div className="glass-card p-8">
              <p className="font-mono-custom text-[0.62rem] tracking-[0.18em] uppercase text-smoke-faint mb-6">Why clients choose us</p>
              {[
                { title: 'It keeps working while you sleep', desc: "Your marketing doesn't stop when you close your laptop. Our systems run 24/7, getting you more customers and better results around the clock." },
                { title: 'Every dollar tied to results', desc: "We don't do fluffy marketing. Everything we build is measured by what matters: more revenue, more customers, lower costs. Period." },
                { title: 'No jargon, no confusion', desc: "We explain everything in plain language. You'll always know what we're doing, why we're doing it, and what results to expect." },
                { title: 'Based in the US, serving worldwide', desc: 'Headquartered in Delaware, with a team in Serbia. We work with businesses globally and deliver first results within 48 hours.' },
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
              Offer AI marketing under <em className="text-gold italic">your own brand</em>
            </h2>
            <p className="text-smoke-dim mt-3" style={{ fontSize: '0.9rem' }}>
              You take the credit, we do the work. Add AI marketing to your services without hiring new people or building new tools.
            </p>
          </div>
          <Link to="/contact" className="btn btn-primary flex-shrink-0">Ask about white label</Link>
        </div>
      </section>

      {/* ── CTA BAND ─────────────────────────────────────── */}
      <section className="cta-gradient relative">
        <div className="relative px-6 lg:px-12 py-20 max-w-screen-xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 z-10">
          <div>
            <h2 className="font-display font-light leading-tight text-ink"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.8rem)' }}>
              Not sure where to start?<br /><em>We'll help you figure it out.</em>
            </h2>
            <p className="text-ink/60 mt-3" style={{ fontSize: '0.95rem' }}>
              Free strategy call · No pressure · Plans from $2,900/mo.
            </p>
          </div>
          <Link to="/contact"
            className="flex-shrink-0 font-mono-custom text-[0.7rem] tracking-[0.14em] uppercase px-8 py-4"
            style={{ background: '#0A0A0B', color: '#F5F4F0' }}>
            Get your free growth plan
          </Link>
        </div>
      </section>
    </>
  )
}
