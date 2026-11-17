import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Testimonial } from '@/lib/supabase'
import Seo from '@/components/Seo'
import { PILLARS } from '@/pages/services/data'
import { CtaBand, CellGrid } from '@/components/site'

/*
 * Home — 2026 redesign ("Statement" hero). Structure and copy for the hero,
 * the three services and "How it works" come from the redesign; the client
 * names, results and testimonials (Supabase `testimonials`, with the old
 * fallbacks) are the content the site already had.
 */

const DEMO_TESTIMONIALS: Testimonial[] = [
  { id: '1', client_name: 'Sarah Andersen', client_role: 'CMO', client_company: 'FoodCo International', text: 'Our monthly revenue was stuck at $40K. Imba deployed their AI systems and within 90 days we hit $120K/mo. The ads, email flows, everything just works now.', featured: true, published: true },
  { id: '2', client_name: 'David Chen', client_role: 'CEO', client_company: 'Ogitive SaaS', text: 'We needed a marketing partner who understood tech. Imba\'s AI analytics uncovered segments we never knew existed — our pipeline tripled in one quarter.', featured: false, published: true },
  { id: '3', client_name: 'Nina Karlsson', client_role: 'Marketing Director', client_company: 'Prime Real Estate Group', text: 'Real estate marketing is competitive. Imba\'s AI personalization delivers the right listings to the right buyers automatically. Our lead quality improved 4x.', featured: false, published: true },
]

const CLIENTS = ['FoodCo International', 'Ogitive', 'NordShop', 'Prime Real Estate', 'Magic Mind', 'Irving Books']

const STATS = [
  { num: '3×', label: 'Revenue growth' },
  { num: '4.8×', label: 'Average ROAS' },
  { num: '200+', label: 'Clients' },
  { num: '98%', label: 'Retention' },
]

const RESULTS = [
  {
    client: 'FoodCo International', service: 'Marketing',
    headline: '$40K to $120K/mo',
    desc: 'Tripled monthly revenue in 90 days with AI-powered ads and automated email flows.',
    metrics: [{ n: '+200%', l: 'Revenue' }, { n: '4.2×', l: 'ROAS' }, { n: '38%', l: 'Email uplift' }],
  },
  {
    client: 'Ogitive', service: 'Marketing + Automation',
    headline: '3× pipeline in 90 days',
    desc: 'AI analytics identified high-intent segments and automated nurture sequences tripled qualified pipeline.',
    metrics: [{ n: '3×', l: 'Pipeline' }, { n: '-58%', l: 'CAC' }, { n: '+140%', l: 'MQLs' }],
  },
  {
    client: 'Prime Real Estate Group', service: 'Automation',
    headline: '4× lead quality',
    desc: 'AI personalization matched listings to buyer profiles, dramatically improving lead quality and close rates.',
    metrics: [{ n: '4×', l: 'Lead quality' }, { n: '+90%', l: 'Close rate' }, { n: '-45%', l: 'Cost/lead' }],
  },
]

const STEPS = [
  { title: 'Inquiry', desc: 'Tell us what you sell and what you want to change. We reply within one business day.' },
  { title: 'Audit', desc: 'We review your channels, site and tools, then send a plan with scope, timeline and a fixed quote.' },
  { title: 'Build', desc: 'Campaigns, pages and workflows go live in short sprints. You see progress every week.' },
  { title: 'Run and report', desc: 'We keep optimising and send one report that covers spend, leads and revenue.' },
]

export default function Home() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEMO_TESTIMONIALS)

  useEffect(() => {
    supabase.from('testimonials').select('*').eq('published', true)
      .then(({ data }) => { if (data?.length) setTestimonials(data) })
  }, [])

  return (
    <>
      <Seo
        title="AI-Powered Marketing Agency"
        description="Imba runs your campaigns, builds your website or product, and automates the work in between. AI-powered marketing, development and automation from one team."
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          'name': 'Imba Marketing',
          'url': 'https://imbamarketing.com',
          'description': 'AI-powered marketing agency: marketing, development and automation from one team.',
        }}
      />

      {/* ── HERO ───────────────────────────────────────── */}
      <section className="wrap pt-[clamp(56px,9vw,120px)] pb-[clamp(40px,6vw,72px)]">
        <div className="kicker mb-7">AI-powered marketing agency</div>
        <h1 className="h-hero m-0">
          Get found.<br />Get built.<br />
          <span className="bg-brand text-brand-on px-[.12em] [box-decoration-break:clone]">Get automated.</span>
        </h1>
        <div className="flex flex-wrap gap-x-14 gap-y-6 items-end justify-between mt-11">
          <p className="lead m-0 max-w-[560px]">
            Imba runs your campaigns, builds your website or product, and automates the work in between. One team, one brief, one report.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/contact" className="btn btn-primary btn-lg">Send an inquiry →</Link>
            <Link to="/results" className="btn btn-outline btn-lg">See case studies</Link>
          </div>
        </div>
      </section>

      {/* ── CLIENTS + NUMBERS ──────────────────────────── */}
      <section className="border-y border-line" aria-label="Clients">
        <div className="wrap py-[22px] flex flex-wrap items-center gap-x-10 gap-y-3 font-mono-custom text-xs uppercase tracking-[.06em] text-smoke-dim">
          <span>Trusted by</span>
          {CLIENTS.map(name => <span key={name} className="text-smoke">{name}</span>)}
        </div>
      </section>
      <section className="wrap">
        <div className="grid grid-cols-2 lg:grid-cols-4 border-l border-line">
          {STATS.map(({ num, label }) => (
            <div key={label} className="px-6 py-7 border-r border-b border-line">
              <div className="font-display font-semibold text-[clamp(32px,3.6vw,48px)] leading-none tracking-[-.03em]">{num}</div>
              <div className="mt-2 font-mono-custom text-xs uppercase tracking-[.06em] text-smoke-dim">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ───────────────────────────────────── */}
      <section className="wrap py-[clamp(56px,8vw,104px)]">
        <h2 className="h-section m-0 mb-10 max-w-[800px] reveal">Three services that work better together.</h2>
        <CellGrid min={300}>
          {PILLARS.map(p => (
            <Link key={p.slug} to={`/services/${p.slug}`}
              className="group p-8 pb-7 border-r border-b border-line flex flex-col gap-4 min-h-[340px] text-smoke hover:bg-ink-2">
              <span className="font-mono-custom text-[13px] text-brand-text">{p.icon}</span>
              <h3 className="font-display font-semibold text-[34px] leading-none tracking-[-.03em] m-0">{p.label}</h3>
              <p className="text-[17px] leading-normal text-smoke-dim m-0 flex-1">
                {{
                  marketing: 'Paid campaigns, SEO, content and email, planned and optimised with AI so budget goes where it converts.',
                  development: 'Websites, online stores and web apps that load fast, rank well and turn visitors into customers.',
                  automation: 'AI agents and workflows that handle lead follow-up, reporting and repetitive admin without extra headcount.',
                }[p.slug] ?? p.heroDesc}
              </p>
              <span className="font-semibold text-[15px] group-hover:text-brand-text">Explore {p.label.toLowerCase()} →</span>
            </Link>
          ))}
        </CellGrid>
        <Link to="/services#all-services" className="inline-block mt-6 text-smoke-dim hover:text-smoke text-[15px]">
          Plus six AI specialties: growth, ads, personalization, content, analytics and conversion →
        </Link>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────── */}
      <section className="bg-ink-2 border-y border-line">
        <div className="wrap py-[clamp(56px,8vw,104px)]">
          <div className="kicker mb-5">How it works</div>
          <h2 className="h-section m-0 mb-12">From inquiry to results in four steps.</h2>
          <div className="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr))]">
            {STEPS.map(({ title, desc }, i) => (
              <div key={title} className={`pt-5 border-t-2 ${i === 0 ? 'border-brand' : 'border-line'} reveal`} style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="font-mono-custom text-[13px] text-smoke-dim mb-3">Step {i + 1}</div>
                <h3 className="font-display font-semibold text-2xl m-0 mb-2.5 tracking-[-.02em]">{title}</h3>
                <p className="m-0 text-smoke-dim leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESULTS ────────────────────────────────────── */}
      <section className="wrap py-[clamp(56px,8vw,104px)]">
        <div className="flex flex-wrap gap-6 items-end justify-between mb-10">
          <div>
            <div className="kicker mb-5">Case studies</div>
            <h2 className="h-section m-0">Work we can show numbers for.</h2>
          </div>
          <Link to="/results" className="btn btn-outline">All case studies →</Link>
        </div>
        <div className="grid gap-7 [grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))]">
          {RESULTS.map(({ client, service, headline, desc, metrics }) => (
            <article key={client} className="border border-line bg-ink-2 p-7 flex flex-col gap-3.5">
              <span className="self-start font-mono-custom text-xs uppercase tracking-[.06em] text-brand-text border border-line px-2.5 py-1">{service}</span>
              <p className="m-0 text-smoke-dim text-[15px]">{client}</p>
              <h3 className="font-display font-semibold text-[28px] leading-[1.08] tracking-[-.02em] m-0">{headline}</h3>
              <p className="m-0 text-smoke-dim leading-relaxed flex-1">{desc}</p>
              <div className="grid grid-cols-3 gap-4 border-t border-line pt-4">
                {metrics.map(({ n, l }) => (
                  <div key={l}>
                    <div className="font-display font-semibold text-[24px] text-smoke leading-none">{n}</div>
                    <div className="mt-1.5 text-sm text-smoke-dim">{l}</div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────── */}
      <section className="border-t border-line">
        <div className="wrap py-[clamp(56px,8vw,104px)]">
          <div className="kicker mb-5">Clients</div>
          <h2 className="h-section m-0 mb-12">What our clients say.</h2>
          <div className="grid border-t border-l border-line [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))]">
            {testimonials.slice(0, 6).map(t => (
              <figure key={t.id} className="m-0 p-8 border-r border-b border-line flex flex-col gap-6">
                <blockquote className="m-0 text-[19px] leading-relaxed text-smoke flex-1">&ldquo;{t.text}&rdquo;</blockquote>
                <figcaption className="flex items-center gap-3">
                  <span aria-hidden="true" className="w-10 h-10 bg-brand text-brand-on font-mono-custom text-xs font-medium flex items-center justify-center">
                    {t.client_name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                  </span>
                  <span>
                    <span className="block font-semibold">{t.client_name}</span>
                    <span className="block text-sm text-smoke-dim">{t.client_role ? `${t.client_role}, ` : ''}{t.client_company}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
          <Link to="/reviews" className="inline-block mt-6 font-semibold hover:text-brand-text">Read all reviews →</Link>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
