import { Link } from 'react-router-dom'
import Seo from '@/components/Seo'

const SERVICES = [
  {
    key: 'growth', slug: 'growth',
    icon: '◈',
    label: 'Grow Your Revenue on Autopilot',
    tagline: 'Marketing that runs itself — and gets better every day',
    desc: 'We set up your marketing to run automatically. Your campaigns improve on their own, your best leads get found faster, and your revenue grows — without you having to lift a finger.',
    features: ['Automated campaigns', 'Smarter lead finding', 'Budget optimization', 'Revenue tracking'],
    stat: '3×',
    statLabel: 'average revenue growth in year one',
    color: '#E8452A',
  },
  {
    key: 'ads', slug: 'ads',
    icon: '▣',
    label: 'Get More from Every Ad Dollar',
    tagline: 'Stop wasting money on ads that don\'t convert',
    desc: 'We make your advertising work harder. Every dollar you spend on ads is automatically directed to what\'s working, while what\'s not gets cut. You get more customers for less money.',
    features: ['Ads on all platforms', 'Automatic testing', 'Smarter targeting', 'Real-time optimization'],
    stat: '300%',
    statLabel: 'better return on ad spend',
    color: '#C9A96E',
  },
  {
    key: 'personalisation', slug: 'personalisation',
    icon: '◉',
    label: 'Make Every Customer Feel Special',
    tagline: 'The right message, right person, right time',
    desc: 'Every customer sees content that\'s relevant to them — automatically. Your emails, website, and ads adapt to each person\'s interests, so they\'re more likely to buy.',
    features: ['Personalized emails', 'Smart website content', 'Targeted offers', 'Customer retention'],
    stat: '5×',
    statLabel: 'higher engagement than generic messages',
    color: '#00D4FF',
  },
  {
    key: 'content', slug: 'content',
    icon: '▶',
    label: 'A Month of Content in One Day',
    tagline: 'Never run out of things to post again',
    desc: 'We build you a content machine that creates posts, emails, and ads that sound exactly like your brand. One session produces a whole month of ready-to-publish content.',
    features: ['Brand-matched writing', 'All platforms covered', 'SEO-optimized', 'Automatic scheduling'],
    stat: '30×',
    statLabel: 'more content than doing it manually',
    color: '#6C7AE0',
  },
  {
    key: 'intelligence', slug: 'intelligence',
    icon: '◬',
    label: 'Know What Your Customers Want',
    tagline: 'Stop guessing, start knowing',
    desc: 'Get clear answers about your market: what customers are searching for, what competitors are doing, and where your biggest growth opportunities are hiding.',
    features: ['Competitor tracking', 'Customer insights', 'Trend spotting', 'Opportunity finder'],
    stat: '28%',
    statLabel: 'average growth from new opportunities found',
    color: '#3CBFAE',
  },
  {
    key: 'funnel', slug: 'funnel',
    icon: '◫',
    label: 'Turn More Visitors into Buyers',
    tagline: 'Same traffic, more sales',
    desc: 'We find exactly where potential customers are leaving your website without buying — and fix it. More of your existing visitors become paying customers.',
    features: ['Find where visitors drop off', 'Automatic testing', 'Better landing pages', 'Checkout optimization'],
    stat: '62%',
    statLabel: 'more people end up buying',
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
        title="What We Do — AI Marketing That Gets You More Customers"
        description="Six proven ways we help businesses grow: better ads, more content, smarter targeting, higher conversions. See how each one works and what results to expect."
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
      <section className="pt-36 pb-20 px-6 lg:px-12 bg-ink relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />
        <div className="absolute bottom-0 right-0 w-[50vw] h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 100% 100%, rgba(0,212,255,0.05) 0%, transparent 65%)' }}
        />
        <div className="relative max-w-screen-xl mx-auto">
          <p className="eyebrow mb-5 reveal">What we do for you</p>
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <div>
              <h1 className="font-display font-light leading-tight mb-6 reveal reveal-delay-1"
                style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
                Six ways to grow<br />
                <em className="text-gold italic">your business.</em>
              </h1>
              <p className="text-smoke-dim leading-relaxed max-w-md reveal reveal-delay-2" style={{ fontSize: '0.95rem' }}>
                Each service is designed to solve a specific problem: getting more customers, lowering costs, or freeing up your time. Pick what you need, or let us recommend the best combination for your goals.
              </p>
            </div>
            <div className="hidden lg:flex flex-col gap-3 reveal reveal-delay-2">
              <div className="bg-ink-2 border border-white/5 p-6">
                <p className="font-mono-custom text-[0.62rem] tracking-[0.18em] uppercase text-smoke-faint mb-3">What our clients typically see</p>
                {[
                  { stat: '3×', label: 'more revenue within a year' },
                  { stat: '40%', label: 'lower cost to get each customer' },
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
            <div className="bg-ink-2 border border-white/5 p-8">
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
      <section className="relative overflow-hidden" style={{ background: '#E8452A' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 8px)',
        }} />
        <div className="relative px-6 lg:px-12 py-20 max-w-screen-xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <h2 className="font-display font-light leading-tight text-ink"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.8rem)' }}>
              Not sure where to start?<br /><em>We'll help you figure it out.</em>
            </h2>
            <p className="text-ink/60 mt-3" style={{ fontSize: '0.95rem' }}>
              Free 15-minute call · No pressure · We'll tell you honestly what will work.
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
