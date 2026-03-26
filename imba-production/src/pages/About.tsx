import { Link } from 'react-router-dom'
import Seo from '@/components/Seo'
import { useQuoteModal } from '@/contexts/QuoteModalContext'

const TEAM = [
  {
    name: 'Ljubica Jevremovic',
    role: 'Partner & Creative Director',
    bio: 'A creative strategist who has built AI-driven campaigns for Silicon Valley brands and global e-commerce leaders. She bridges the gap between creative excellence and AI-powered performance — ensuring every campaign is as compelling as it is measurable.',
    initials: 'LJ',
    color: '#C9A96E',
    image: '/team/ljubica.jpg',
    linkedin: 'https://linkedin.com/in/ljubica-jevremovic',
    instagram: 'https://instagram.com/imbamarketing',
  },
  {
    name: 'Marko Tiosavljevic',
    role: 'Partner & Marketing Strategist',
    bio: '20+ years in growth marketing and digital strategy. Marko architects the AI systems that transform marketing spend into measurable revenue — ensuring every client\'s growth engine is built for long-term compounding results.',
    initials: 'MT',
    color: '#E8452A',
    image: '/team/marko.jpg',
    linkedin: 'https://linkedin.com/in/marko-tiosavljevic',
    instagram: 'https://instagram.com/imbamarketing',
  },
]

const VALUES = [
  {
    n: '01',
    title: 'Intelligence-first design',
    desc: 'We build AI systems, not campaigns. Every solution is engineered to learn, adapt, and compound results over time — making your marketing smarter with every data point.',
  },
  {
    n: '02',
    title: 'Revenue-first thinking',
    desc: 'Beautiful marketing that doesn\'t convert is a cost centre. Every system we design is tied to a revenue metric: leads, conversions, ROAS, or retention.',
  },
  {
    n: '03',
    title: 'True partnership',
    desc: 'We immerse ourselves in your brand, competitive landscape, and customer behaviour. Your goals guide every AI decision we make.',
  },
  {
    n: '04',
    title: 'Speed without compromise',
    desc: 'First results in 48 hours is our standard. We\'ve engineered an AI deployment process that delivers fast without cutting corners.',
  },
]

const STATS = [
  { num: '8', sup: '+', label: 'Years in business' },
  { num: '200', sup: '+', label: 'Campaigns' },
  { num: '40', sup: '%', label: 'Lower CPA' },
  { num: '98', sup: '%', label: 'Retention' },
]

const CLIENTS = [
  'FoodCo International', 'NordShop', 'Velour Boutique', 'Irving Books',
  'Kozica Soaps', 'Ogitive', 'Magic Mind', 'Prime Real Estate',
]

const TESTIMONIALS = [
  {
    name: 'Predrag Kozica',
    company: 'Kozica Soaps',
    text: 'Imba Marketing built us an AI system that transformed our ad performance. ROAS went from 1.8× to 4.2× in just 8 weeks. The team is exceptional.',
  },
  {
    name: 'Bojan Ilić',
    role: 'CEO',
    company: 'Massive Movie Horse',
    text: 'Great cooperation with the Imba team. Their AI personalisation system increased our email conversion rate by 67%. Highly recommended.',
  },
  {
    name: 'Dragan Dragovic',
    role: 'Developer & SEO Expert',
    company: 'Ogitive',
    text: 'The AI content engine they built generates 30 days of optimised content in a single session. Quality is consistently high and brand-perfect.',
  },
]

const SOCIAL = [
  { label: 'LinkedIn',    short: 'LI', href: 'https://linkedin.com/company/imba-marketing' },
  { label: 'X / Twitter', short: 'X',  href: 'https://twitter.com/imbamarketing' },
  { label: 'Instagram',   short: 'IG', href: 'https://instagram.com/imbamarketing' },
  { label: 'YouTube',     short: 'YT', href: 'https://youtube.com/@imbamarketing' },
]

export default function About() {
  const { openModal } = useQuoteModal()
  return (
    <>
      <Seo
        title="About Imba Marketing"
        description="A next-generation AI marketing agency built for results. We build intelligent marketing systems that generate measurable revenue for businesses worldwide."
        canonicalPath="/about"
      />
      {/* ── PAGE HERO ─────────────────────────────────────── */}
      <section className="pt-36 pb-20 px-6 lg:px-12 bg-ink relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />
        <div className="absolute top-0 left-0 w-[50vw] h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 0% 40%, rgba(201,169,110,0.06) 0%, transparent 65%)' }}
        />
        <div className="relative max-w-screen-xl mx-auto">
          <p className="eyebrow mb-6 reveal">Est. 2016 · Wilmington, Delaware & Kragujevac, Serbia</p>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-display font-light leading-tight mb-6 reveal reveal-delay-1"
                style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5rem)' }}>
                A next-generation<br />
                <em className="text-gold italic">AI marketing agency</em><br />
                built for results
              </h1>
              <p className="text-smoke-dim leading-relaxed mb-8 reveal reveal-delay-2" style={{ fontSize: '1rem' }}>
                We are a team of AI marketing strategists, data scientists, and growth engineers dedicated to building intelligent marketing systems that generate measurable revenue for businesses worldwide.
              </p>
              <div className="flex gap-4 reveal reveal-delay-3">
                <Link to="/results" className="btn btn-primary">See our results</Link>
                <Link to="/contact" className="btn btn-ghost">Get in touch →</Link>
              </div>
            </div>

            {/* AI visual */}
            <div className="relative aspect-[4/3] bg-ink-2 border border-white/5 overflow-hidden reveal reveal-delay-2 hidden lg:block">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center px-8">
                <div className="w-14 h-14 flex items-center justify-center border border-cyber/30"
                  style={{ background: 'rgba(0,212,255,0.08)' }}>
                  <span style={{ color: '#00D4FF', fontSize: '1.5rem' }}>◈</span>
                </div>
                <div>
                  <p className="font-mono-custom text-[0.58rem] tracking-[0.2em] uppercase text-smoke-faint mb-2">Our mission</p>
                  <p className="font-display font-light text-smoke/60 leading-snug" style={{ fontSize: '1.05rem' }}>
                    Building AI systems that help<br />brands generate real revenue
                  </p>
                </div>
                <div className="font-mono-custom text-[0.52rem] text-smoke-faint/25 tracking-widest">
                  imbamarketing.com · 2016 – {new Date().getFullYear()}
                </div>
              </div>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(0,212,255,0.04) 0%, transparent 70%)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────── */}
      <div className="border-y border-white/6 grid grid-cols-2 lg:grid-cols-4">
        {STATS.map(({ num, sup, label }, i) => (
          <div key={label} className={`px-8 lg:px-12 py-8 ${i < 3 ? 'border-r border-white/6' : ''}`}>
            <div className="font-display font-light text-smoke leading-none" style={{ fontSize: '3rem' }}>
              {num}<em className="text-ember not-italic">{sup}</em>
            </div>
            <div className="font-mono-custom text-[0.6rem] tracking-[0.18em] uppercase text-smoke-faint mt-2">{label}</div>
          </div>
        ))}
      </div>

      {/* ── MISSION / WHAT WE DO ──────────────────────────── */}
      <section className="py-24 px-6 lg:px-12 bg-ink-2">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="eyebrow mb-4 reveal">What we do</p>
            <h2 className="font-display font-light leading-tight mb-8 reveal reveal-delay-1"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
              We build systems that<br /><em className="text-gold italic">generate revenue</em>
            </h2>
            <div className="space-y-5 text-smoke-dim leading-relaxed reveal reveal-delay-2" style={{ fontSize: '0.95rem' }}>
              <p>We are a team of AI marketing strategists, data scientists, and growth engineers dedicated to building intelligent marketing systems that generate measurable revenue for businesses worldwide.</p>
              <p>We combine deep marketing expertise with cutting-edge AI to create systems that don't just look good — they drive clicks, conversions, and lasting brand growth.</p>
              <p>From AI growth systems and performance advertising to content engines, personalisation, market intelligence, and funnel optimisation — we cover every growth lever, every channel, every business goal.</p>
            </div>
          </div>

          {/* Services list */}
          <div className="reveal reveal-delay-2">
            <p className="font-mono-custom text-[0.65rem] tracking-[0.18em] uppercase text-smoke-faint mb-6">What we build</p>
            <div className="grid grid-cols-2 gap-x-4">
              {[
                'AI Growth Systems', 'AI Performance Advertising',
                'AI Personalisation Systems', 'AI Content Engines',
                'AI Data & Intelligence', 'AI Funnel Optimisation',
                'Competitor Analysis', 'Conversion Optimisation',
                'Email Marketing AI', 'Social Media Automation',
                'SEO Intelligence', 'White Label Services',
              ].map(s => (
                <div key={s} className="flex items-center gap-2 py-2.5 border-b border-white/5">
                  <div className="w-1 h-1 rounded-full bg-ember flex-shrink-0" />
                  <span className="font-mono-custom text-[0.62rem] tracking-wide text-smoke-dim">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ──────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-12 bg-ink">
        <div className="max-w-screen-xl mx-auto">
          <p className="eyebrow mb-4 reveal">The team</p>
          <h2 className="font-display font-light leading-tight mb-14 reveal reveal-delay-1"
            style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
            The people behind<br /><em className="text-gold italic">the intelligence</em>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl">
            {TEAM.map((member, i) => (
              <div key={member.name}
                className="bg-ink-2 border border-white/5 overflow-hidden hover:border-white/10 transition-colors reveal"
                style={{ transitionDelay: `${i * 100}ms` }}>
                {/* Photo */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                    onError={e => {
                      const el = e.currentTarget
                      el.style.display = 'none'
                      const fallback = el.nextElementSibling as HTMLElement
                      if (fallback) fallback.style.display = 'flex'
                    }}
                  />
                  {/* Fallback initials */}
                  <div className="hidden absolute inset-0 items-center justify-center font-mono-custom text-4xl font-medium"
                    style={{ background: `${member.color}12`, color: member.color }}>
                    {member.initials}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-2/80 to-transparent" />
                </div>
                <div className="p-7">
                  <h3 className="font-display font-light text-smoke text-2xl mb-1">{member.name}</h3>
                  <p className="font-mono-custom text-[0.62rem] tracking-[0.16em] uppercase mb-4" style={{ color: member.color }}>{member.role}</p>
                  <p className="text-smoke-dim leading-relaxed mb-5" style={{ fontSize: '0.88rem' }}>{member.bio}</p>
                  <div className="flex items-center gap-3">
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                        className="font-mono-custom text-[0.58rem] tracking-widest uppercase text-smoke-faint/40 hover:text-smoke-dim transition-colors">
                        LinkedIn →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="font-mono-custom text-[0.62rem] tracking-widest uppercase text-smoke-faint/35 mt-10 reveal">
            + AI engineers, data analysts, and growth specialists across Europe & US
          </p>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-12 bg-ink-2">
        <div className="max-w-screen-xl mx-auto">
          <p className="eyebrow mb-4 reveal">Why choose us</p>
          <h2 className="font-display font-light leading-tight mb-14 reveal reveal-delay-1"
            style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
            What we build,<br /><em className="text-gold italic">why it matters</em>
          </h2>
          <div className="grid md:grid-cols-2 gap-px bg-white/5">
            {VALUES.map(({ n, title, desc }, i) => (
              <div key={n}
                className="bg-ink-2 p-10 hover:bg-ink-3 transition-colors reveal"
                style={{ transitionDelay: `${i * 80}ms` }}>
                <span className="font-mono-custom text-[0.65rem] text-ember/70">{n}</span>
                <h3 className="font-display font-light text-smoke text-2xl mt-3 mb-4">{title}</h3>
                <p className="text-smoke-dim leading-relaxed" style={{ fontSize: '0.9rem' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-12 bg-ink">
        <div className="max-w-screen-xl mx-auto">
          <p className="eyebrow mb-4 reveal">Client voice</p>
          <h2 className="font-display font-light leading-tight mb-14 reveal reveal-delay-1"
            style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
            What our clients <em className="text-gold italic">say</em>
          </h2>
          <div className="grid md:grid-cols-3 gap-px bg-white/5">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className="bg-ink p-8 relative reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="absolute top-5 right-6 font-display text-[5rem] font-light leading-none select-none"
                  style={{ color: 'rgba(232,69,42,0.05)' }}>"</div>
                <p className="font-display text-lg font-light italic text-smoke/80 leading-relaxed mb-6">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-mono-custom text-[0.6rem]"
                    style={{ background: 'rgba(232,69,42,0.1)', border: '1px solid rgba(232,69,42,0.2)', color: '#E8452A' }}>
                    {t.name.split(' ').map(w => w[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm text-smoke font-medium">{t.name}</p>
                    <p className="font-mono-custom text-[0.58rem] tracking-wider text-smoke-faint">
                      {t.role ? `${t.role} · ` : ''}{t.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOLLOW US ─────────────────────────────────────── */}
      <section className="py-16 px-6 lg:px-12 bg-ink border-t border-white/5">
        <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <p className="eyebrow mb-2 reveal">Follow our work</p>
            <h2 className="font-display font-light text-smoke reveal reveal-delay-1" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
              Stay inspired — follow <em className="text-gold italic">imba.</em>
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 reveal reveal-delay-2">
            {SOCIAL.map(({ label, short, href }) => (
              <a
                key={short}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 border border-white/10 hover:border-ember hover:text-ember transition-all group"
              >
                <span className="font-mono-custom text-[0.6rem] tracking-widest uppercase text-smoke-dim group-hover:text-ember transition-colors">{short}</span>
                <span className="text-sm text-smoke-dim group-hover:text-smoke transition-colors">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENTS ───────────────────────────────────────── */}
      <section className="py-16 px-6 lg:px-12 bg-ink-2 border-t border-white/5">
        <div className="max-w-screen-xl mx-auto">
          <p className="font-mono-custom text-[0.62rem] tracking-[0.2em] uppercase text-smoke-faint/50 mb-8 text-center reveal">
            Trusted by brands worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 reveal reveal-delay-1">
            {CLIENTS.map(c => (
              <span key={c} className="font-mono-custom text-[0.65rem] tracking-[0.14em] uppercase text-smoke-faint/35 hover:text-smoke-faint transition-colors">
                {c}
              </span>
            ))}
          </div>
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
              Ready to transform<br /><em>your marketing?</em>
            </h2>
            <p className="text-ink/60 mt-3" style={{ fontSize: '0.95rem' }}>
              Free consultation · No commitment · Reply within 24 hours.
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex-shrink-0 font-mono-custom text-[0.7rem] tracking-[0.14em] uppercase px-8 py-4 cursor-pointer"
            style={{ background: '#0A0A0B', color: '#F5F4F0', border: 'none' }}>
            Get a free strategy call
          </button>
        </div>
      </section>
    </>
  )
}
