import { Link } from 'react-router-dom'
import Seo from '@/components/Seo'

const SERVICES = [
  {
    key: 'growth', slug: 'growth',
    icon: '◈',
    label: 'AI Growth Marketing',
    tagline: 'Automated campaigns that get smarter every day',
    desc: 'AI drives your entire marketing engine — automating lead generation, nurturing sequences, and revenue optimization across every channel. Campaigns learn and improve continuously, so your growth compounds without adding headcount.',
    features: ['Marketing automation', 'Lead generation & nurturing', 'Revenue optimization', 'Multi-channel orchestration'],
    stat: '3×',
    statLabel: 'average revenue growth in year one',
    color: '#E8452A',
  },
  {
    key: 'ads', slug: 'ads',
    icon: '▣',
    label: 'AI Performance Ads',
    tagline: 'Every ad dollar optimized by AI in real-time',
    desc: 'AI manages your paid media across Google, Meta, TikTok, and LinkedIn — automatically testing creative, optimizing bids, and reallocating budget to what converts best, in real-time.',
    features: ['Google, Meta, TikTok & LinkedIn ads', 'Real-time ROAS optimization', 'AI creative testing', 'Cross-platform budget allocation'],
    stat: '300%',
    statLabel: 'better return on ad spend',
    color: '#C9A96E',
  },
  {
    key: 'personalisation', slug: 'personalisation',
    icon: '◉',
    label: 'AI Personalization',
    tagline: 'Right message, right person, right moment',
    desc: 'AI personalizes every touchpoint in the customer journey — dynamic content, behavioral targeting, email sequences, and on-site experiences — so every visitor gets messaging that resonates.',
    features: ['Dynamic content personalization', 'Behavioral targeting', 'Customer journey mapping', 'Email personalization'],
    stat: '5×',
    statLabel: 'higher engagement than generic messaging',
    color: '#00D4FF',
  },
  {
    key: 'content', slug: 'content',
    icon: '▶',
    label: 'AI Content Production',
    tagline: 'Brand content at scale, zero bottlenecks',
    desc: 'AI produces social posts, email campaigns, ad creatives, blog articles, and product descriptions — all in your brand voice. A full month of content in a single day, with no creative bottlenecks.',
    features: ['Social media content', 'Email & ad copy', 'Blog articles & SEO content', 'Product descriptions'],
    stat: '30×',
    statLabel: 'more content than doing it manually',
    color: '#6C7AE0',
  },
  {
    key: 'intelligence', slug: 'intelligence',
    icon: '◬',
    label: 'AI Analytics & Intelligence',
    tagline: 'Data-driven decisions, not guesswork',
    desc: 'AI continuously monitors your market — tracking competitors, analyzing customer behavior, identifying emerging trends, and surfacing the insights that actually move the needle for your business.',
    features: ['Market & competitor research', 'Customer behavior insights', 'Trend prediction', 'Performance dashboards'],
    stat: '28%',
    statLabel: 'average growth from new opportunities discovered',
    color: '#3CBFAE',
  },
  {
    key: 'funnel', slug: 'funnel',
    icon: '◫',
    label: 'AI Conversion Optimization',
    tagline: 'Turn more visitors into customers',
    desc: 'AI analyzes your entire funnel to find where prospects drop off — then fixes it. Smarter landing pages, faster A/B testing, checkout improvements, and behavioral triggers that recover lost conversions.',
    features: ['Funnel analysis & diagnostics', 'AI-powered A/B testing', 'Landing page optimization', 'Checkout & form improvement'],
    stat: '62%',
    statLabel: 'more visitors convert to customers',
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
        title="AI Marketing Services — Smarter Campaigns That Drive Real Revenue"
        description="Six AI-powered marketing services for ambitious brands: growth marketing, performance ads, personalization, content production, analytics, and conversion optimization. Plans from $2,900/mo."
        canonicalPath="/services"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          'name': 'Imba Marketing Services',
          'url': 'https://imbamarketing.com/services',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'AI Growth Marketing', 'url': 'https://imbamarketing.com/services/growth' },
            { '@type': 'ListItem', 'position': 2, 'name': 'AI Performance Ads', 'url': 'https://imbamarketing.com/services/ads' },
            { '@type': 'ListItem', 'position': 3, 'name': 'AI Personalization', 'url': 'https://imbamarketing.com/services/personalisation' },
            { '@type': 'ListItem', 'position': 4, 'name': 'AI Content Production', 'url': 'https://imbamarketing.com/services/content' },
            { '@type': 'ListItem', 'position': 5, 'name': 'AI Analytics & Intelligence', 'url': 'https://imbamarketing.com/services/intelligence' },
            { '@type': 'ListItem', 'position': 6, 'name': 'AI Conversion Optimization', 'url': 'https://imbamarketing.com/services/funnel' },
          ],
        }}
      />

      {/* ── PAGE HERO ─────────────────────────────────────── */}
      <section className="pt-36 pb-20 px-6 lg:px-12 section-gradient-cyber relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[50vw] h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 100% 100%, rgba(0,212,255,0.05) 0%, transparent 65%)' }}
        />
        <div className="relative max-w-screen-xl mx-auto">
          <p className="eyebrow mb-5 reveal">AI marketing agency</p>
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <div>
              <h1 className="font-display font-light leading-tight mb-6 reveal reveal-delay-1"
                style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
                AI marketing services that<br />
                <em className="text-[#D4A853] italic">drive real revenue.</em>
              </h1>
              <p className="text-smoke-dim leading-relaxed max-w-md reveal reveal-delay-2" style={{ fontSize: '0.95rem' }}>
                Six AI-powered services that cover every angle of modern marketing — from lead generation and paid media to content production and conversion optimization. Pick what you need, or get everything in one plan.
              </p>
            </div>
            <div className="hidden lg:flex flex-col gap-3 reveal reveal-delay-2">
              <div className="bg-ink-2 border border-white/5 p-6">
                <p className="font-mono-custom text-[0.62rem] tracking-[0.18em] uppercase text-smoke-faint mb-3">What our clients typically see</p>
                {[
                  { stat: '3×', label: 'average revenue growth in year one' },
                  { stat: '4.8×', label: 'return on ad spend across platforms' },
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
              From first call to<br /><em className="text-[#D4A853] italic">real results</em>
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
                { title: 'AI that actually works, 24/7', desc: "Your campaigns learn and optimize around the clock — not just during business hours. Our AI systems compound results while you focus on running your business." },
                { title: 'Every dollar tied to revenue', desc: "No vanity metrics. Every campaign we run is measured by what matters: revenue generated, cost per acquisition, and return on ad spend." },
                { title: 'Transparent, no black boxes', desc: "You see exactly what our AI is doing and why. Clear dashboards, plain-language reporting, and a team that explains the strategy behind every decision." },
                { title: 'US-based, serving brands worldwide', desc: 'Headquartered in Delaware, with an engineering team in Serbia. We work with ambitious brands globally and deliver first results within 48 hours.' },
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
              Offer AI marketing under <em className="text-[#D4A853] italic">your own brand</em>
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
              Not sure where to start?<br /><em>Let's build your AI marketing strategy.</em>
            </h2>
            <p className="text-ink/60 mt-3" style={{ fontSize: '0.95rem' }}>
              Free strategy call · No pressure · Plans from $2,900/mo.
            </p>
          </div>
          <Link to="/contact"
            className="flex-shrink-0 font-mono-custom text-[0.7rem] tracking-[0.14em] uppercase px-8 py-4"
            style={{ background: '#0A0A0B', color: '#F5F4F0' }}>
            Get Free Quote
          </Link>
        </div>
      </section>
    </>
  )
}
