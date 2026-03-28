import { Link, useParams, Navigate } from 'react-router-dom'
import { SERVICES_DATA, getServiceBySlug } from './data'
import Seo from '@/components/Seo'
import { useQuoteModal } from '@/contexts/QuoteModalContext'

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>()
  const service = getServiceBySlug(slug ?? '')
  const { openModal } = useQuoteModal()

  if (!service) return <Navigate to="/services" replace />

  const otherServices = SERVICES_DATA.filter(s => s.slug !== service.slug).slice(0, 4)

  return (
    <>
      <Seo
        title={`${service.label} | Imba Marketing`}
        description={service.heroDesc}
        canonicalPath={`/services/${service.slug}`}
      />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="pt-36 pb-20 px-6 lg:px-12 bg-ink relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[50vw] h-full pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 70% at 100% 30%, ${service.color}0A 0%, transparent 65%)` }}
        />
        <div className="relative max-w-screen-xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-8 font-mono-custom text-[0.62rem] tracking-widest uppercase">
            <Link to="/services" className="text-smoke-faint hover:text-smoke transition-colors">What We Do</Link>
            <span className="text-smoke-faint/30">→</span>
            <span style={{ color: service.color }}>{service.label}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <div>
              <div className="flex items-center gap-3 mb-6 reveal">
                <div className="w-10 h-10 border flex items-center justify-center text-lg"
                  style={{ borderColor: `${service.color}40`, color: service.color }}>
                  {service.icon}
                </div>
                <span className="font-mono-custom text-[0.65rem] tracking-[0.18em] uppercase" style={{ color: service.color }}>
                  {service.label}
                </span>
              </div>

              <h1 className="font-display font-light leading-tight mb-6 reveal reveal-delay-1"
                style={{ fontSize: 'clamp(2.6rem, 5vw, 4.8rem)' }}>
                <em className="text-[#D4A853] italic">{service.tagline}</em>
              </h1>

              <p className="text-smoke-dim leading-relaxed mb-8 reveal reveal-delay-2" style={{ fontSize: '0.97rem' }}>
                {service.heroDesc}
              </p>

              <div className="flex flex-wrap gap-4 reveal reveal-delay-3">
                <button onClick={() => openModal()} className="btn btn-primary">Get your free growth plan →</button>
                <Link to="/results" className="btn btn-ghost">See client results →</Link>
              </div>
            </div>

            {/* Stats */}
            <div className="reveal reveal-delay-2">
              <div className="grid grid-cols-2 gap-px bg-white/5">
                {service.stats.map(({ num, label }) => (
                  <div key={label} className="bg-ink-2 p-6">
                    <div className="font-display font-light leading-none mb-2" style={{ fontSize: '2.2rem', color: service.color }}>
                      {num}
                    </div>
                    <div className="font-mono-custom text-[0.6rem] tracking-[0.14em] uppercase text-smoke-faint leading-snug">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ──────────────────────────────────── */}
      <section className="bg-ink-2 py-24 px-6 lg:px-12">
        <div className="max-w-screen-xl mx-auto">
          <p className="eyebrow mb-4 reveal">What you get</p>
          <h2 className="font-display font-light leading-tight mb-14 reveal reveal-delay-1"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
            Everything included in<br />
            <em className="text-[#D4A853] italic">{service.label}</em>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {service.features.map(({ title, desc }, i) => (
              <div key={title}
                className="bg-ink-2 p-8 hover:bg-ink-3 transition-colors reveal"
                style={{ transitionDelay: `${i * 50}ms` }}>
                <div className="w-1.5 h-1.5 rounded-full mb-5" style={{ background: service.color }} />
                <h3 className="font-display font-light text-smoke text-xl mb-3">{title}</h3>
                <p className="text-smoke-dim text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-12 bg-ink">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="eyebrow mb-4 reveal">How it works</p>
            <h2 className="font-display font-light leading-tight mb-12 reveal reveal-delay-1"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
              From first call<br /><em className="text-[#D4A853] italic">to real results</em>
            </h2>
            {service.process.map(({ n, title, desc }, i) => (
              <div key={n}
                className="flex gap-5 py-6 border-b border-white/5 group hover:pl-3 transition-all duration-300 reveal"
                style={{ transitionDelay: `${i * 80}ms` }}>
                <span className="font-mono-custom text-[0.7rem] mt-1 min-w-[2rem] opacity-70" style={{ color: service.color }}>{n}</span>
                <div>
                  <h3 className="font-display text-xl text-smoke mb-1.5 group-hover:text-ember transition-colors">{title}</h3>
                  <p className="text-sm text-smoke-dim leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA side panel */}
          <div className="reveal reveal-delay-2 lg:pt-16">
            <div className="bg-ink-2 border border-white/5 p-8 sticky top-24">
              <p className="font-mono-custom text-[0.62rem] tracking-[0.18em] uppercase mb-3" style={{ color: service.color }}>
                Ready to get started?
              </p>
              <h3 className="font-display font-light text-smoke leading-tight mb-5"
                style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)' }}>
                Free growth plan,<br />no strings attached
              </h3>
              <p className="text-smoke-dim text-sm leading-relaxed mb-7">
                Tell us about your business and goals. We'll come back within 24 hours with a custom plan showing exactly how we'd help you grow — completely free.
              </p>
              <button onClick={() => openModal()} className="btn btn-primary w-full text-center block mb-4">
                Get your free growth plan →
              </button>
              <Link to="/results" className="btn btn-ghost w-full text-center block">
                See client results →
              </Link>
              <div className="mt-8 pt-6 border-t border-white/5">
                <p className="font-mono-custom text-[0.58rem] tracking-wider uppercase text-smoke-faint/40 mb-3">Always included</p>
                <ul className="space-y-2">
                  {['Free marketing review', 'Custom growth plan', 'Revenue impact estimate', 'No long-term contracts'].map(item => (
                    <li key={item} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: service.color }} />
                      <span className="font-mono-custom text-[0.6rem] text-smoke-dim tracking-wide">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLIENT RESULTS ───────────────────────────────────── */}
      {service.cases && service.cases.length > 0 && (
        <section className="bg-ink-2 py-24 px-6 lg:px-12 border-t border-white/5">
          <div className="max-w-screen-xl mx-auto">
            <p className="eyebrow mb-4 reveal">Real client results</p>
            <h2 className="font-display font-light leading-tight mb-12 reveal reveal-delay-1"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
              See what this looks like <em className="text-[#D4A853] italic">in practice</em>
            </h2>
            <div className="grid md:grid-cols-2 gap-px bg-white/5">
              {service.cases.map(({ client, headline, desc }, i) => (
                <div key={client}
                  className="bg-ink-2 p-10 hover:bg-ink-3 transition-colors reveal"
                  style={{ transitionDelay: `${i * 80}ms` }}>
                  <span className="font-mono-custom text-[0.58rem] tracking-[0.18em] uppercase text-smoke-faint mb-4 block">{client}</span>
                  <h3 className="font-display font-light leading-tight mb-4"
                    style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.4rem)', color: service.color }}>
                    {headline}
                  </h3>
                  <p className="text-smoke-dim text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link to="/results" className="btn btn-outline">See all client results →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-12 bg-ink">
        <div className="max-w-screen-xl mx-auto max-w-3xl">
          <p className="eyebrow mb-4 reveal">Common questions</p>
          <h2 className="font-display font-light leading-tight mb-12 reveal reveal-delay-1"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
            Everything you need<br /><em className="text-[#D4A853] italic">to know</em>
          </h2>
          <div className="space-y-0">
            {service.faq.map(({ q, a }, i) => (
              <div key={q}
                className="border-b border-white/5 py-7 reveal"
                style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="flex gap-5">
                  <span className="font-mono-custom text-[0.65rem] opacity-50 mt-1 min-w-[1.5rem] flex-shrink-0" style={{ color: service.color }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display font-light text-smoke text-xl mb-3">{q}</h3>
                    <p className="text-smoke-dim text-sm leading-relaxed">{a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OTHER SERVICES ─────────────────────────────────── */}
      <section className="bg-ink-2 py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-screen-xl mx-auto">
          <p className="eyebrow mb-4 reveal">Other ways we help</p>
          <h2 className="font-display font-light text-smoke mb-10 reveal reveal-delay-1"
            style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>
            Explore more <em className="text-[#D4A853] italic">services</em>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {otherServices.map((s, i) => (
              <Link key={s.slug} to={`/services/${s.slug}`}
                className="group bg-ink-2 p-6 hover:bg-ink-3 transition-colors reveal"
                style={{ transitionDelay: `${i * 50}ms` }}>
                <div className="w-8 h-8 border flex items-center justify-center mb-4 text-sm transition-colors"
                  style={{ borderColor: `${s.color}40`, color: s.color }}>
                  {s.icon}
                </div>
                <h3 className="font-display font-light text-smoke text-lg leading-snug mb-2 group-hover:text-ember transition-colors">{s.label}</h3>
                <p className="font-mono-custom text-[0.58rem] tracking-wider uppercase" style={{ color: s.color }}>{s.tagline}</p>
                <div className="mt-4 font-mono-custom text-[0.62rem] tracking-[0.12em] uppercase text-smoke-faint group-hover:text-smoke transition-colors">
                  Learn more →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ───────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: service.color }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 8px)',
        }} />
        <div className="relative px-6 lg:px-12 py-20 max-w-screen-xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <h2 className="font-display font-light leading-tight text-ink"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.8rem)' }}>
              Ready to get started?<br /><em>Let's build your growth plan.</em>
            </h2>
            <p className="text-ink/60 mt-3" style={{ fontSize: '0.95rem' }}>
              Free plan · No commitment · Results in 48 hours.
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
