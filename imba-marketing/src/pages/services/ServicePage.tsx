import { Link, useParams, Navigate } from 'react-router-dom'
import { PILLARS, SERVICES_DATA, getServiceBySlug } from './data'
import Seo from '@/components/Seo'
import { PageHero, CtaBand, CellGrid, Cell } from '@/components/site'

/*
 * One template for every service page (2026 redesign): the three pillars
 * (/services/marketing|development|automation) and the six AI specialty pages
 * (/services/growth, /ads, …). Sections without data (stats, cases, FAQ) are
 * skipped, so pillars and specialties share the layout from the design:
 * hero → "What you get" grid → "How an engagement runs" → results → FAQ.
 */
export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>()
  const service = getServiceBySlug(slug ?? '')

  if (!service) return <Navigate to="/services" replace />

  const pillar = PILLARS.find(p => p.slug === service.slug)
  // Pillars link their specialties; specialties link back to the pillars.
  const related = pillar
    ? SERVICES_DATA.filter(s => pillar.related?.includes(s.slug))
    : PILLARS
  const interest = service.name ?? service.label
  const contactHref = `/contact?interest=${encodeURIComponent(pillar ? interest : 'Marketing')}`

  return (
    <>
      <Seo
        title={`${pillar ? `${service.label} — ${service.tagline}` : service.label}`}
        description={service.heroDesc}
        canonicalPath={`/services/${service.slug}`}
      />

      <nav aria-label="Breadcrumb" className="wrap pt-8 font-mono-custom text-xs uppercase tracking-[.08em] text-smoke-dim flex gap-2">
        <Link to="/services" className="hover:text-smoke">Services</Link>
        <span aria-hidden="true">/</span>
        <span className="text-smoke">{service.label}</span>
      </nav>

      <PageHero
        kicker={service.kicker ?? 'AI specialty · Marketing'}
        title={pillar ? service.tagline : service.label}
        lead={pillar ? service.heroDesc : <><span className="text-smoke">{service.tagline}.</span> {service.heroDesc}</>}
      >
        <Link to={contactHref} className="btn btn-primary btn-lg">Send an inquiry →</Link>
      </PageHero>

      {service.stats.length > 0 && (
        <section className="wrap pb-[clamp(40px,5vw,64px)]">
          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-l border-line">
            {service.stats.map(({ num, label }) => (
              <div key={label} className="p-6 border-r border-b border-line">
                <div className="font-display font-semibold text-[clamp(30px,3vw,42px)] leading-none tracking-[-.03em]">{num}</div>
                <div className="mt-2 text-[15px] text-smoke-dim leading-snug">{label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="wrap pb-[clamp(56px,8vw,96px)]">
        <div className="kicker-muted mb-4">What you get</div>
        <CellGrid min={340}>
          {service.features.map(({ title, desc }) => (
            <Cell key={title}>
              <h3 className="font-display font-semibold text-2xl leading-tight tracking-[-.02em] m-0 mb-2.5">{title}</h3>
              <p className="m-0 text-smoke-dim leading-relaxed">{desc}</p>
            </Cell>
          ))}
        </CellGrid>
      </section>

      <section className="bg-ink-2 border-y border-line">
        <div className="wrap py-[clamp(48px,7vw,88px)] grid gap-x-16 gap-y-8 lg:grid-cols-2">
          <h2 className="font-display font-bold m-0 text-[clamp(30px,3.6vw,48px)] leading-[1.02] tracking-[-.03em]">How an engagement runs</h2>
          <ol className="list-none m-0 p-0">
            {service.process.map(({ n, title, desc }) => (
              <li key={n} className="grid grid-cols-[48px_minmax(0,1fr)] gap-2 py-5 border-t border-line">
                <span className="font-mono-custom text-[13px] text-brand-text pt-1">{n}</span>
                <div>
                  <h3 className="font-display font-semibold text-[21px] m-0 mb-1.5 tracking-[-.01em]">{title}</h3>
                  <p className="m-0 text-smoke-dim leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {service.cases.length > 0 && (
        <section className="wrap py-[clamp(56px,8vw,96px)]">
          <div className="kicker mb-5">Client results</div>
          <h2 className="h-sub m-0 mb-10">What this looks like in practice.</h2>
          <div className="grid gap-7 md:grid-cols-2">
            {service.cases.map(({ client, headline, desc }) => (
              <article key={client + headline} className="border border-line bg-ink-2 p-7 flex flex-col gap-3.5">
                <span className="self-start font-mono-custom text-xs uppercase tracking-[.06em] text-brand-text border border-line px-2.5 py-1">{client}</span>
                <h3 className="font-display font-semibold text-[28px] leading-[1.08] tracking-[-.02em] m-0">{headline}</h3>
                <p className="m-0 text-smoke-dim leading-relaxed">{desc}</p>
              </article>
            ))}
          </div>
          <Link to="/results" className="inline-block mt-8 font-semibold hover:text-brand-text">See all case studies →</Link>
        </section>
      )}

      {service.faq.length > 0 && (
        <section className="border-t border-line">
          <div className="wrap py-[clamp(56px,8vw,96px)] grid gap-x-16 gap-y-8 lg:grid-cols-[1fr_1.4fr]">
            <h2 className="h-sub m-0">Common questions</h2>
            <div>
              {service.faq.map(({ q, a }) => (
                <details key={q} className="group border-t border-line py-5">
                  <summary className="cursor-pointer list-none flex justify-between gap-4 font-display font-semibold text-xl tracking-[-.01em]">
                    {q}<span aria-hidden="true" className="font-mono-custom text-brand-text group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 mb-0 text-smoke-dim leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-line">
        <div className="wrap py-[clamp(48px,7vw,80px)]">
          <div className="kicker-muted mb-4">{pillar ? 'AI specialties in this service' : 'Part of'}</div>
          <CellGrid min={260}>
            {related.map(s => (
              <Link key={s.slug} to={`/services/${s.slug}`} className="group p-7 border-r border-b border-line hover:bg-ink-2 flex flex-col gap-2">
                <span className="font-display font-semibold text-xl tracking-[-.02em] text-smoke">{s.label}</span>
                <span className="text-[15px] text-smoke-dim">{s.tagline}</span>
                <span className="mt-auto pt-3 font-semibold text-[15px] group-hover:text-brand-text">Explore →</span>
              </Link>
            ))}
          </CellGrid>
        </div>
      </section>

      <CtaBand to={contactHref} />
    </>
  )
}
