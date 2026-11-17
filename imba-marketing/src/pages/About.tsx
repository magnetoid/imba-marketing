import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { TeamMember } from '@/lib/supabase'
import Seo from '@/components/Seo'
import { PageHero, CtaBand, CellGrid, Cell } from '@/components/site'

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

// Working principles from the 2026 redesign
const PRINCIPLES = [
  { title: 'Revenue first', desc: 'We report on leads and sales. Impressions and clicks are inputs.' },
  { title: 'AI where it helps', desc: 'We use AI for research, testing and repetitive work. People decide strategy and sign off on everything that ships.' },
  { title: 'Fixed scope, clear quote', desc: 'Every project starts with a written plan and a price, so you know what you are buying.' },
]

const SOCIAL = [
  { label: 'LinkedIn',    short: 'LI', href: 'https://linkedin.com/company/imba-marketing' },
  { label: 'X / Twitter', short: 'X',  href: 'https://twitter.com/imbamarketing' },
  { label: 'Instagram',   short: 'IG', href: 'https://instagram.com/imbamarketing' },
  { label: 'YouTube',     short: 'YT', href: 'https://youtube.com/@imbamarketing' },
]

export default function About() {
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
        title="About Us"
        description="A small team that markets, builds and automates. Since 2016 we've helped 200+ brands get more customers, lower their marketing costs and free up their time."
        canonicalPath="/about"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          'name': 'About Us — Imba Marketing',
          'description': 'A small team that markets, builds and automates, helping ambitious brands attract, convert, and retain customers.',
          'url': 'https://imbamarketing.com/about',
          'publisher': {
            '@type': 'Organization',
            'name': 'Imba Marketing',
            'url': 'https://imbamarketing.com'
          }
        }}
      />

      <PageHero
        kicker="About · Est. 2016 · Wilmington, Delaware & Kragujevac, Serbia"
        title="A small team that markets, builds and automates."
      >
        <div className="max-w-[720px] flex flex-col gap-5 lead">
          <p className="m-0">
            Most companies hire one agency for ads, another for the website and a freelancer for automations, then spend their time coordinating them. Imba puts all three under one brief so the campaign, the landing page and the follow-up are designed together.
          </p>
          <p className="m-0">
            Since 2016, we've helped over 200 brands — from e-commerce and SaaS to professional services and DTC — get more customers, lower their marketing costs, and free up their time.
          </p>
        </div>
      </PageHero>

      <section className="wrap pb-[clamp(56px,8vw,96px)]">
        <CellGrid min={300}>
          {PRINCIPLES.map(({ title, desc }) => (
            <Cell key={title}>
              <h2 className="font-display font-semibold text-2xl m-0 mb-2.5 tracking-[-.02em]">{title}</h2>
              <p className="m-0 text-smoke-dim leading-relaxed">{desc}</p>
            </Cell>
          ))}
        </CellGrid>
        <div className="grid grid-cols-2 lg:grid-cols-4 border-l border-line">
          {STATS.map(({ num, sup, label }) => (
            <div key={label} className="px-6 py-6 border-r border-b border-line">
              <div className="font-display font-semibold text-[clamp(30px,3.4vw,44px)] leading-none tracking-[-.03em]">{num}{sup}</div>
              <div className="mt-2 font-mono-custom text-xs uppercase tracking-[.06em] text-smoke-dim">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TEAM ──────────────────────────────────────────── */}
      <section className="wrap pb-[clamp(56px,8vw,96px)]">
        <h2 className="h-sub m-0 mb-7">Team</h2>
        <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr))]">
          {team.map(member => {
            const initials = member.name.split(' ').map(w => w[0]).join('')
            const linkedin = member.social_links?.linkedin
            return (
              <div key={member.id}>
                <div className="relative aspect-[4/5] border border-line hatch overflow-hidden">
                  {/* Initials sit underneath; the photo covers them when it loads */}
                  <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center font-display font-semibold text-5xl text-smoke-dim">{initials}</span>
                  {member.photo_url && (
                    <img
                      src={member.photo_url}
                      alt={member.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover object-top"
                      onError={e => { e.currentTarget.style.display = 'none' }}
                    />
                  )}
                </div>
                <div className="font-semibold text-[17px] mt-3">{member.name}</div>
                {member.role && <div className="text-smoke-dim text-[15px]">{member.role}</div>}
                {member.bio && <p className="mt-3 mb-0 text-smoke-dim text-[15px] leading-relaxed">{member.bio}</p>}
                {linkedin && (
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 font-semibold text-[15px] hover:text-brand-text">
                    LinkedIn →
                  </a>
                )}
              </div>
            )
          })}
        </div>
        <p className="mt-10 mb-0 font-mono-custom text-xs uppercase tracking-[.06em] text-smoke-dim">
          + A team of marketing specialists, content creators, and analysts across Europe & US
        </p>
      </section>

      {/* ── WHAT WE DO ──────────────────────────── */}
      <section className="bg-ink-2 border-y border-line">
        <div className="wrap py-[clamp(56px,8vw,96px)] grid gap-x-16 gap-y-10 lg:grid-cols-2">
          <div>
            <div className="kicker mb-5">What we do</div>
            <h2 className="h-sub m-0 mb-6">We make your marketing work harder for you.</h2>
            <div className="flex flex-col gap-4 text-smoke-dim text-[17px] leading-relaxed">
              <p className="m-0">We're an AI marketing agency that gets brands better results in less time. Whether you're in e-commerce, SaaS, professional services, or DTC, our AI systems deliver more customers, lower costs, and marketing that keeps improving on its own.</p>
              <p className="m-0">We don't just run ads or post content. We build complete AI marketing systems that work around the clock — finding customers, nurturing leads, and growing your revenue while you focus on your business.</p>
              <p className="m-0">From performance ads and content to personalization and predictive analytics, we cover every part of your marketing. And we explain everything in plain English — no tech jargon, no confusing reports.</p>
            </div>
          </div>
          <div>
            <div className="kicker-muted mb-4">How we help</div>
            <ul className="list-none m-0 p-0 grid sm:grid-cols-2 gap-x-6">
              {[
                'AI growth marketing', 'AI performance ads',
                'AI personalization', 'AI content production',
                'AI analytics & intelligence', 'AI conversion optimization',
                'E-commerce & DTC marketing', 'SaaS & lead generation',
                'Email & lifecycle marketing', 'SEO & search visibility',
                'Landing page optimization', 'White label for agencies',
              ].map(item => (
                <li key={item} className="py-3 border-t border-line flex gap-3 text-[15px]">
                  <span aria-hidden="true" className="font-mono-custom text-brand-text">→</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────────── */}
      <section className="wrap py-[clamp(56px,8vw,96px)]">
        <div className="kicker mb-5">Why clients choose us</div>
        <h2 className="h-sub m-0 mb-10">What makes us different.</h2>
        <CellGrid min={420}>
          {VALUES.map(({ n, title, desc }) => (
            <Cell key={n} className="!p-9">
              <span className="font-mono-custom text-[13px] text-brand-text">{n}</span>
              <h3 className="font-display font-semibold text-2xl mt-3 mb-3 tracking-[-.02em]">{title}</h3>
              <p className="m-0 text-smoke-dim leading-relaxed">{desc}</p>
            </Cell>
          ))}
        </CellGrid>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="border-t border-line">
        <div className="wrap py-[clamp(56px,8vw,96px)]">
          <h2 className="h-sub m-0 mb-10">Don't take our word for it. Take theirs.</h2>
          <CellGrid min={300}>
            {TESTIMONIALS.map(t => (
              <figure key={t.name} className="m-0 p-8 border-r border-b border-line flex flex-col gap-6">
                <blockquote className="m-0 text-[18px] leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</blockquote>
                <figcaption>
                  <span className="block font-semibold">{t.name}</span>
                  <span className="block text-sm text-smoke-dim">{t.role ? `${t.role} · ` : ''}{t.company}</span>
                </figcaption>
              </figure>
            ))}
          </CellGrid>
        </div>
      </section>

      {/* ── CLIENTS + SOCIAL ─────────────────────────────── */}
      <section className="border-t border-line">
        <div className="wrap py-[22px] flex flex-wrap items-center gap-x-10 gap-y-3 font-mono-custom text-xs uppercase tracking-[.06em] text-smoke-dim">
          <span>Trusted by</span>
          {CLIENTS.map(c => <span key={c} className="text-smoke">{c}</span>)}
        </div>
      </section>
      <section className="border-t border-line">
        <div className="wrap py-10 flex flex-wrap gap-6 items-center justify-between">
          <h2 className="font-display font-semibold text-2xl m-0 tracking-[-.02em]">Follow our work</h2>
          <div className="flex flex-wrap gap-2">
            {SOCIAL.map(({ label, short, href }) => (
              <a key={short} href={href} target="_blank" rel="noopener noreferrer" className="chip inline-flex items-center">{label}</a>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Ready to grow your business? Tell us what you need." sub="Free 15-minute call · No pressure · Results within 48 hours." />
    </>
  )
}
