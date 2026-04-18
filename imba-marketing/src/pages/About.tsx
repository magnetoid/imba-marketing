import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import type { TeamMember } from '@/lib/supabase'
import Seo from '@/components/Seo'
import { useQuoteModal } from '@/contexts/QuoteModalContext'

/* ── fallback team shown when DB is empty/unreachable ──── */
const FALLBACK_TEAM: TeamMember[] = [
  {
    id: '1', name: 'Ljubica Jevremovic', slug: 'ljubica',
    role: 'Partner & Creative Director',
    bio: 'Ljubica has helped dozens of brands — from SaaS startups to global consumer brands — build AI-powered marketing that actually connects with people and drives real growth. She makes sure every campaign is not just creative, but profitable.',
    photo_url: '/team/ljubica.jpg',
    social_links: { linkedin: 'https://linkedin.com/in/ljubica-jevremovic' },
    sort_order: 0, published: true,
  },
  {
    id: '2', name: 'Marko Tiosavljevic', slug: 'marko',
    role: 'Partner & Marketing Strategist',
    bio: "20+ years helping businesses grow across e-commerce, SaaS, and professional services. Marko designs AI marketing strategies that consistently turn ad spend into revenue — making sure every client's growth plan is built for long-term, compounding results.",
    photo_url: '/team/marko.jpg',
    social_links: { linkedin: 'https://linkedin.com/in/marko-tiosavljevic' },
    sort_order: 1, published: true,
  },
]

const MEMBER_COLORS = ['#C9A96E', '#E8452A', '#3CBFAE', '#6C7AE0', '#00D4FF']

const VALUES = [
  {
    n: '01',
    title: 'Your results come first',
    desc: 'Everything we do is measured by one thing: did it make you money? Beautiful marketing that doesn\'t bring in customers is a waste. We build things that actually work.',
  },
  {
    n: '02',
    title: 'Plain talk, no jargon',
    desc: 'We explain everything in language you can understand. No buzzwords, no hiding behind complexity. You\'ll always know what we\'re doing, why, and what results to expect.',
  },
  {
    n: '03',
    title: 'We treat your business like ours',
    desc: 'We don\'t just run your marketing — we immerse ourselves in your business. We learn your customers, your market, and your goals. Your success is our success.',
  },
  {
    n: '04',
    title: 'Fast results, no cutting corners',
    desc: 'You\'ll see improvements within 48 hours. Full setup in 2–4 weeks. We move fast because you shouldn\'t have to wait to grow — but we never sacrifice quality for speed.',
  },
]

const STATS = [
  { num: '8', sup: '+', label: 'Years in AI marketing' },
  { num: '200', sup: '+', label: 'Campaigns delivered' },
  { num: '40', sup: '%', label: 'Average cost savings' },
  { num: '98', sup: '%', label: 'Client retention rate' },
]

const CLIENTS = [
  'FoodCo International', 'NordShop', 'Velour Boutique', 'Irving Books',
  'Kozica Soaps', 'Ogitive', 'Magic Mind', 'Prime Real Estate',
]

const TESTIMONIALS = [
  {
    name: 'Predrag Kozica',
    company: 'Kozica Soaps',
    text: 'Imba completely turned around our advertising. We went from barely breaking even to getting $4.20 back for every $1 spent — in just 8 weeks. These guys know what they\'re doing.',
  },
  {
    name: 'Bojan Ilić',
    role: 'CEO',
    company: 'Massive Movie Horse',
    text: 'Working with Imba was a game-changer. They helped us get 67% more sales from our email campaigns. The team explained everything clearly and delivered exactly what they promised.',
  },
  {
    name: 'Dragan Dragovic',
    role: 'Developer & SEO Expert',
    company: 'Ogitive',
    text: 'We used to spend the whole week creating content. Now we get 30 days of high-quality, brand-perfect content in a single session. The time and money we save is incredible.',
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
  const [team, setTeam] = useState<TeamMember[]>(FALLBACK_TEAM)

  useEffect(() => {
    supabase
      .from('team_members')
      .select('*')
      .eq('published', true)
      .order('sort_order')
      .then(({ data }) => {
        if (data?.length) setTeam(data)
      })
  }, [])

  return (
    <>
      <Seo
        title="About Imba Marketing — AI-Powered Marketing Agency"
        description="Since 2016, we've helped 200+ brands get more customers and grow revenue with AI-powered marketing. No jargon, just results."
        canonicalPath="/about"
      />
      {/* ── PAGE HERO ─────────────────────────────────────── */}
      <section className="pt-36 pb-20 px-6 lg:px-12 bg-ink relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[50vw] h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 0% 40%, rgba(201,169,110,0.06) 0%, transparent 65%)' }}
        />
        <div className="relative max-w-screen-xl mx-auto">
          <p className="eyebrow mb-6 reveal">Est. 2016 · Wilmington, Delaware & Kragujevac, Serbia</p>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-display font-light leading-tight mb-6 reveal reveal-delay-1"
                style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5rem)' }}>
                An AI marketing agency<br />
                <em className="text-[#D4A853] italic">built for ambitious</em><br />
                brands
              </h1>
              <p className="text-smoke-dim leading-relaxed mb-8 reveal reveal-delay-2" style={{ fontSize: '1rem' }}>
                Since 2016, we've helped over 200 brands — from e-commerce and SaaS to professional services and DTC — get more customers, lower their marketing costs, and free up their time. We use AI to do the heavy lifting across every channel and industry.
              </p>
              <div className="flex gap-4 reveal reveal-delay-3">
                <Link to="/results" className="btn btn-primary">See our client results</Link>
                <Link to="/contact" className="btn btn-ghost">Get in touch →</Link>
              </div>
            </div>

            {/* Mission visual */}
            <div className="relative aspect-[4/3] bg-ink-2 border border-white/5 overflow-hidden reveal reveal-delay-2 hidden lg:block">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center px-8">
                <div className="w-14 h-14 flex items-center justify-center border border-cyber/30"
                  style={{ background: 'rgba(0,212,255,0.08)' }}>
                  <span style={{ color: '#00D4FF', fontSize: '1.5rem' }}>◈</span>
                </div>
                <div>
                  <p className="font-mono-custom text-[0.58rem] tracking-[0.2em] uppercase text-smoke-faint mb-2">Our promise</p>
                  <p className="font-display font-light text-smoke/60 leading-snug" style={{ fontSize: '1.05rem' }}>
                    More customers, lower costs,<br />less work for you
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

      {/* ── WHAT WE DO ──────────────────────────── */}
      <section className="py-24 px-6 lg:px-12 bg-ink-2">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="eyebrow mb-4 reveal">What we do</p>
            <h2 className="font-display font-light leading-tight mb-8 reveal reveal-delay-1"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
              We make your marketing<br /><em className="text-[#D4A853] italic">work harder for you</em>
            </h2>
            <div className="space-y-5 text-smoke-dim leading-relaxed reveal reveal-delay-2" style={{ fontSize: '0.95rem' }}>
              <p>We're an AI marketing agency that gets brands better results in less time. Whether you're in e-commerce, SaaS, professional services, or DTC, our AI systems deliver more customers, lower costs, and marketing that keeps improving on its own.</p>
              <p>We don't just run ads or post content. We build complete AI marketing systems that work around the clock — finding customers, nurturing leads, and growing your revenue while you focus on your business.</p>
              <p>From performance ads and content to personalization and predictive analytics, we cover every part of your marketing. And we explain everything in plain English — no tech jargon, no confusing reports.</p>
            </div>
          </div>

          {/* What we help with */}
          <div className="reveal reveal-delay-2">
            <p className="font-mono-custom text-[0.65rem] tracking-[0.18em] uppercase text-smoke-faint mb-6">How we help</p>
            <div className="grid grid-cols-2 gap-x-4">
              {[
                'AI growth marketing', 'AI performance ads',
                'AI personalization', 'AI content production',
                'AI analytics & intelligence', 'AI conversion optimization',
                'E-commerce & DTC marketing', 'SaaS & lead generation',
                'Email & lifecycle marketing', 'SEO & search visibility',
                'Landing page optimization', 'White label for agencies',
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
          <p className="eyebrow mb-4 reveal">Meet us</p>
          <h2 className="font-display font-light leading-tight mb-14 reveal reveal-delay-1"
            style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
            The people who'll<br /><em className="text-[#D4A853] italic">grow your business</em>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl">
            {team.map((member, i) => {
              const color = MEMBER_COLORS[i % MEMBER_COLORS.length]
              const initials = member.name.split(' ').map(w => w[0]).join('')
              const linkedin = member.social_links?.linkedin
              return (
                <div key={member.id}
                  className="bg-ink-2 border border-white/5 overflow-hidden hover:border-white/10 transition-colors reveal"
                  style={{ transitionDelay: `${i * 100}ms` }}>
                  {/* Photo */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={member.photo_url || ''}
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
                      style={{ background: `${color}12`, color }}>
                      {initials}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-2/80 to-transparent" />
                  </div>
                  <div className="p-7">
                    <h3 className="font-display font-light text-smoke text-2xl mb-1">{member.name}</h3>
                    <p className="font-mono-custom text-[0.62rem] tracking-[0.16em] uppercase mb-4" style={{ color }}>{member.role}</p>
                    <p className="text-smoke-dim leading-relaxed mb-5" style={{ fontSize: '0.88rem' }}>{member.bio}</p>
                    <div className="flex items-center gap-3">
                      {linkedin && (
                        <a href={linkedin} target="_blank" rel="noopener noreferrer"
                          className="font-mono-custom text-[0.58rem] tracking-widest uppercase text-smoke-faint/40 hover:text-smoke-dim transition-colors">
                          LinkedIn →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="font-mono-custom text-[0.62rem] tracking-widest uppercase text-smoke-faint/35 mt-10 reveal">
            + A team of marketing specialists, content creators, and analysts across Europe & US
          </p>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-12 bg-ink-2">
        <div className="max-w-screen-xl mx-auto">
          <p className="eyebrow mb-4 reveal">Why clients choose us</p>
          <h2 className="font-display font-light leading-tight mb-14 reveal reveal-delay-1"
            style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
            What makes us<br /><em className="text-[#D4A853] italic">different</em>
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
          <p className="eyebrow mb-4 reveal">What clients say about us</p>
          <h2 className="font-display font-light leading-tight mb-14 reveal reveal-delay-1"
            style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
            Don't take our word for it. <em className="text-[#D4A853] italic">Take theirs.</em>
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
              Stay updated — follow <em className="text-[#D4A853] italic">imba.</em>
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
            Trusted by businesses that want to grow
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
              Ready to grow<br /><em>your business?</em>
            </h2>
            <p className="text-ink/60 mt-3" style={{ fontSize: '0.95rem' }}>
              Free 15-minute call · No pressure · Results within 48 hours.
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex-shrink-0 font-mono-custom text-[0.7rem] tracking-[0.14em] uppercase px-8 py-4 cursor-pointer"
            style={{ background: '#0A0A0B', color: '#F5F4F0', border: 'none' }}>
            Get your free growth plan
          </button>
        </div>
      </section>
    </>
  )
}
