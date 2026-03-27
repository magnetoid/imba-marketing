import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Testimonial } from '@/lib/supabase'
import Seo from '@/components/Seo'
import { useQuoteModal } from '@/contexts/QuoteModalContext'

const DEMO_TESTIMONIALS: Testimonial[] = [
  { id: '1', client_name: 'Sarah Andersen', client_role: 'CMO', client_company: 'FoodCo International', text: 'We cut our ad costs by 40% and revenue jumped 89% in the first 3 months. Imba completely changed how we grow.', featured: true, published: true },
  { id: '2', client_name: 'Marco Kessler', client_role: 'Growth Lead', client_company: 'NordShop', text: 'We used to waste thousands on ads that didn\'t work. Now every dollar we spend brings back three. Best decision we made.', featured: false, published: true },
  { id: '3', client_name: 'Julia Larsson', client_role: 'Founder', client_company: 'Velour Boutique', text: 'I used to spend a whole week creating social media posts. Now I get a full month of content in one day — and it actually performs better.', featured: false, published: true },
]

const SERVICES = [
  { key: 'growth', icon: '◈', label: 'Grow Your Revenue on Autopilot', desc: 'We set up smart marketing that runs itself. Your campaigns get better every day, your leads improve, and your revenue grows — without adding to your workload.', color: '#E8452A' },
  { key: 'ads', icon: '▣', label: 'Get More from Every Ad Dollar', desc: 'Stop wasting money on ads that don\'t work. We make sure every dollar you spend on advertising brings back as much revenue as possible.', color: '#C9A96E' },
  { key: 'personalisation', icon: '◉', label: 'Make Every Customer Feel Special', desc: 'Send the right message to the right person at the right time. Your emails, website, and ads automatically adapt to each customer\'s interests.', color: '#00D4FF' },
  { key: 'content', icon: '▶', label: 'A Month of Content in One Day', desc: 'Never run out of things to post. We build you a content machine that creates on-brand posts, emails, and ads across all your platforms — fast.', color: '#6C7AE0' },
  { key: 'intelligence', icon: '◬', label: 'Know What Your Customers Want', desc: 'Stop guessing. Get clear answers about what your customers are looking for, what your competitors are doing, and where your biggest opportunities are.', color: '#3CBFAE' },
  { key: 'funnel', icon: '◫', label: 'Turn More Visitors into Buyers', desc: 'Find out exactly where you\'re losing potential customers and fix it. More of the people who visit your site will end up buying from you.', color: '#E87A2A' },
]

const STATS = [
  { num: '3', sup: '×', label: 'More Revenue' },
  { num: '40', sup: '%', label: 'Lower Ad Costs' },
  { num: '48', sup: 'h', label: 'To See First Results' },
  { num: '98', sup: '%', label: 'Clients Stay With Us' },
]

const RESULTS = [
  { client: 'FoodCo International', category: 'Revenue Growth', headline: '89% more revenue in 90 days', desc: 'We automated their marketing and helped them reach 4.2 million people — while spending less on ads than before.', color: '#E8452A' },
  { client: 'NordShop', category: 'Ad Performance', headline: 'Every $1 in ads → $4.80 back', desc: 'Their ads used to barely break even. We rebuilt their campaigns so every dollar spent brought back nearly five.', color: '#C9A96E' },
  { client: 'Velour Boutique', category: 'Content Creation', headline: '30 days of content in 1 day', desc: 'A fashion brand that struggled to post consistently. Now they have a month of quality content ready in a single session.', color: '#6C7AE0' },
  { client: 'BrandX', category: 'More Sales', headline: '62% more people bought', desc: 'We found where visitors were dropping off and fixed it. Their sales nearly doubled from the same amount of website traffic.', color: '#3CBFAE' },
  { client: 'Magic Mind', category: 'Market Insights', headline: '28% growth in 6 months', desc: 'We uncovered 12 opportunities their competitors were missing. They acted on them and grew steadily month after month.', color: '#C9A96E' },
]

export default function Home() {
  const { openModal } = useQuoteModal()
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEMO_TESTIMONIALS)
  const [activeService, setActiveService] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('testimonials').select('*').eq('published', true)
      .then(({ data }) => { if (data?.length) setTestimonials(data) })
  }, [])

  return (
    <>
      <Seo
        title="Imba Marketing — We Help Businesses Grow Faster with AI"
        description="Get more customers, lower your ad costs, and create content in a fraction of the time. We use AI to grow your business — no jargon, just results."
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          'name': 'Imba Marketing',
          'url': 'https://imbamarketing.com',
          'description': 'AI marketing agency that helps businesses get more customers and grow faster.',
        }}
      />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-20 px-6 lg:px-12 bg-ink overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
        <div className="absolute top-1/4 right-0 w-[50vw] h-[70vh] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 100% 40%, rgba(0,212,255,0.05) 0%, transparent 65%)' }} />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 0% 100%, rgba(232,69,42,0.06) 0%, transparent 65%)' }} />

        <div className="relative max-w-screen-xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-8 reveal">
                <div className="badge-cyber">Trusted by 200+ Businesses</div>
              </div>

              <h1 className="font-display font-light leading-[1.05] mb-8 reveal reveal-delay-1"
                style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
                Get more customers.<br />
                <em className="holo-text not-italic">Spend less.</em><br />
                Grow faster.
              </h1>

              <p className="text-smoke-dim leading-relaxed mb-10 max-w-lg reveal reveal-delay-2" style={{ fontSize: '1.05rem', fontWeight: 300 }}>
                We use AI to bring you more customers, lower your marketing costs, and free up your time. No complicated tech talk — just real results you can see in your bank account.
              </p>

              <div className="flex flex-wrap gap-4 reveal reveal-delay-3">
                <button onClick={() => openModal()} className="btn btn-primary">
                  Get your free growth plan →
                </button>
                <Link to="/results" className="btn btn-outline">
                  See client results
                </Link>
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-8 reveal reveal-delay-4">
                {STATS.map(({ num, sup, label }) => (
                  <div key={label}>
                    <div className="font-display font-light leading-none" style={{ fontSize: '2.2rem' }}>
                      <span className="stat-num">{num}</span>
                      <em className="text-ember not-italic text-xl">{sup}</em>
                    </div>
                    <div className="font-mono-custom text-[0.58rem] tracking-[0.16em] uppercase text-smoke-faint mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* What you get panel */}
            <div className="hidden lg:block relative reveal reveal-delay-2">
              <div className="relative bg-ink-2 border border-white/5 p-8 hud-card holo-shimmer">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                  <span className="eyebrow-cyber">What You Get</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-ember animate-pulse" />
                    <span className="data-readout">LIVE RESULTS</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { label: 'Ad Return', val: '4.8×', delta: '↑ For every $1 spent' },
                    { label: 'Lead Quality', val: '94%', delta: '↑ Better leads' },
                    { label: 'Cost Savings', val: '40%', delta: '↓ Lower ad costs' },
                    { label: 'Content Created', val: '847', delta: '↑ Pieces this month' },
                  ].map(({ label, val, delta }) => (
                    <div key={label} className="bg-ink-3 border border-white/5 p-4">
                      <p className="data-readout mb-2">{label}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display font-light text-2xl text-smoke">{val}</span>
                        <span className="font-mono-custom text-[0.58rem]" style={{ color: '#3CBFAE' }}>{delta}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  {[
                    { step: 'Finding your best customers', status: 'active' },
                    { step: 'Creating content for your brand', status: 'active' },
                    { step: 'Improving your ad campaigns', status: 'processing' },
                    { step: 'Turning visitors into buyers', status: 'active' },
                    { step: 'Getting smarter every day', status: 'active' },
                  ].map(({ step, status }) => (
                    <div key={step} className="flex items-center gap-3 py-2 border-b border-white/4 last:border-0">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status === 'processing' ? 'bg-gold animate-pulse' : 'bg-cyber'}`} />
                      <span className="font-mono-custom text-[0.62rem] text-smoke-dim tracking-wide flex-1">{step}</span>
                      <span className="font-mono-custom text-[0.55rem] tracking-[0.14em] uppercase"
                        style={{ color: status === 'processing' ? '#C9A96E' : '#3CBFAE' }}>
                        {status === 'processing' ? 'Running' : 'Active'}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-4 right-5 font-mono-custom text-[0.52rem] text-smoke-faint/20 tracking-widest select-none">
                  IMBA.MKT // v2.6
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="angular-divider" />

      {/* WHAT WE DO FOR YOU */}
      <section className="py-28 px-6 lg:px-12 bg-ink-2">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-end mb-16">
            <div>
              <p className="eyebrow mb-5 reveal">What we do for you</p>
              <h2 className="font-display font-light leading-tight reveal reveal-delay-1"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
                Six ways we help<br />
                <em className="text-gold italic">your business grow.</em>
              </h2>
            </div>
            <p className="text-smoke-dim leading-relaxed reveal reveal-delay-2" style={{ fontSize: '0.95rem' }}>
              Think of us as your marketing team that never sleeps. We handle the hard work — you enjoy the results. Every solution is tailored to your business and designed to pay for itself.
            </p>
          </div>

          <div className="services-grid">
            {SERVICES.map(({ key, icon, label, desc, color }, i) => (
              <div
                key={key}
                className="bg-ink-2 p-8 relative overflow-hidden transition-all duration-300 hover:bg-ink-3 reveal flex flex-col cursor-pointer hud-card"
                style={{ transitionDelay: `${i * 50}ms` }}
                onMouseEnter={() => setActiveService(key)}
                onMouseLeave={() => setActiveService(null)}
              >
                <span className="absolute top-4 right-5 font-display text-[4.5rem] font-light leading-none select-none"
                  style={{ color: 'rgba(255,255,255,0.025)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="w-10 h-10 border flex items-center justify-center mb-6 text-lg transition-all duration-300"
                  style={{ borderColor: activeService === key ? color : `${color}40`, color,
                    boxShadow: activeService === key ? `0 0 16px ${color}25` : 'none' }}>
                  {icon}
                </div>
                <h3 className="font-display font-light text-smoke text-xl mb-3">{label}</h3>
                <p className="text-sm text-smoke-dim leading-relaxed flex-1">{desc}</p>
                <div className="pt-5 mt-5 border-t border-white/5">
                  <Link to={`/services/${key}`}
                    className="font-mono-custom text-[0.62rem] tracking-[0.14em] uppercase flex items-center gap-2 transition-all duration-200 hover:gap-3"
                    style={{ color }}>
                    <span>Learn how it works</span><span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-28 px-6 lg:px-12 bg-ink">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <p className="eyebrow mb-5 reveal">How it works</p>
            <h2 className="font-display font-light leading-tight mb-10 reveal reveal-delay-1"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.8rem)' }}>
              Simple process.<br />
              <em className="text-gold italic">Real results.</em>
            </h2>
            {[
              { n: '01', title: 'We learn about your business', desc: 'Tell us about your goals, your customers, and what\'s not working. We\'ll find exactly where you\'re leaving money on the table.' },
              { n: '02', title: 'We build your growth plan', desc: 'We design a custom marketing plan built specifically for your business — not a cookie-cutter template. You\'ll know exactly what to expect.' },
              { n: '03', title: 'We set everything up', desc: 'We build and launch your marketing systems within 2–4 weeks. Everything works alongside your existing tools — zero disruption.' },
              { n: '04', title: 'You see results that grow', desc: 'Your marketing gets better every single day. We keep optimizing, you keep growing. Results compound month after month.' },
            ].map(({ n, title, desc }, i) => (
              <div key={n} className="flex gap-5 py-6 border-b border-white/5 group hover:pl-3 transition-all duration-300 reveal"
                style={{ transitionDelay: `${i * 80}ms` }}>
                <span className="font-mono-custom text-[0.7rem] text-ember opacity-70 mt-1 min-w-[2rem]">{n}</span>
                <div>
                  <h3 className="font-display text-xl text-smoke mb-1.5 group-hover:text-ember transition-colors">{title}</h3>
                  <p className="text-sm text-smoke-dim leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal reveal-delay-2">
            <div className="bg-ink-2 border border-white/5 p-8">
              <p className="font-mono-custom text-[0.62rem] tracking-[0.18em] uppercase text-smoke-faint mb-6">Why clients choose us</p>
              {[
                { title: 'It keeps working while you sleep', desc: "Your marketing doesn't stop when you close your laptop. Our systems run 24/7, finding new customers and improving results around the clock." },
                { title: 'You only pay for what works', desc: "Everything we build is tied to results you can measure — more revenue, more customers, lower costs. If it's not making you money, we fix it." },
                { title: 'No long-term contracts', desc: "We don't lock you in. Our clients stay because they see results — 98% of them choose to keep working with us. That's confidence, not obligation." },
                { title: 'Results start fast', desc: "See your first improvements within 48 hours. Full system live in 2–4 weeks. We move fast because you shouldn't have to wait to start growing." },
              ].map(({ title, desc }, i) => (
                <div key={title} className="flex gap-4 py-5 border-b border-white/5 last:border-0"
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

      <div className="angular-divider" />

      {/* CLIENT RESULTS */}
      <section className="py-28 px-6 lg:px-12 bg-ink-2">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
            <div>
              <p className="eyebrow mb-4 reveal">Real client results</p>
              <h2 className="font-display font-light leading-tight reveal reveal-delay-1"
                style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
                Numbers don't lie.<br /><em className="text-gold italic">Neither do our clients.</em>
              </h2>
            </div>
            <Link to="/results" className="btn btn-outline reveal reveal-delay-2">See all results →</Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {RESULTS.map(({ client, category, headline, desc, color }, i) => (
              <div key={client} className="bg-ink-2 p-8 hover:bg-ink-3 transition-colors reveal flex flex-col"
                style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                  <span className="font-mono-custom text-[0.58rem] tracking-[0.16em] uppercase text-smoke-faint">{client}</span>
                  <span className="font-mono-custom text-[0.56rem] tracking-[0.12em] uppercase px-2 py-0.5"
                    style={{ color, background: `${color}12`, border: `1px solid ${color}25` }}>{category}</span>
                </div>
                <h3 className="font-display font-light leading-tight mb-3 flex-1"
                  style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', color }}>{headline}</h3>
                <p className="text-sm text-smoke-dim leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28 px-6 lg:px-12 bg-ink">
        <div className="max-w-screen-xl mx-auto">
          <p className="eyebrow mb-4 reveal">Happy clients</p>
          <h2 className="font-display font-light leading-tight mb-14 reveal reveal-delay-1"
            style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
            Don't take our word for it.<br /><em className="text-gold italic">Take theirs.</em>
          </h2>
          <div className="grid md:grid-cols-3 gap-px bg-white/5">
            {testimonials.map((t, i) => (
              <div key={t.id} className="bg-ink p-8 relative reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="absolute top-5 right-6 font-display text-[5rem] font-light leading-none select-none"
                  style={{ color: 'rgba(232,69,42,0.05)' }}>"</div>
                <p className="font-display text-lg font-light italic text-smoke/80 leading-relaxed mb-6">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-mono-custom text-[0.6rem]"
                    style={{ background: 'rgba(232,69,42,0.1)', border: '1px solid rgba(232,69,42,0.2)', color: '#E8452A' }}>
                    {t.client_name.split(' ').map((w: string) => w[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm text-smoke font-medium">{t.client_name}</p>
                    <p className="font-mono-custom text-[0.58rem] tracking-wider text-smoke-faint">
                      {t.client_role ? `${t.client_role} · ` : ''}{t.client_company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section className="py-16 px-6 lg:px-12 bg-ink-2 border-t border-white/5">
        <div className="max-w-screen-xl mx-auto">
          <p className="font-mono-custom text-[0.62rem] tracking-[0.2em] uppercase text-smoke-faint/50 mb-8 text-center reveal">
            Trusted by businesses that want to grow
          </p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 reveal reveal-delay-1">
            {['FoodCo International', 'NordShop', 'Velour Boutique', 'BrandX', 'Magic Mind', 'Irving Books', 'Prime Real Estate', 'Ogitive'].map(c => (
              <span key={c} className="font-mono-custom text-[0.65rem] tracking-[0.14em] uppercase text-smoke-faint/35 hover:text-smoke-faint transition-colors">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden" style={{ background: '#E8452A' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 8px)',
        }} />
        <div className="relative px-6 lg:px-12 py-24 max-w-screen-xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          <div>
            <h2 className="font-display font-light leading-tight text-ink"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
              Ready to grow?<br /><em>Let's talk.</em>
            </h2>
            <p className="text-ink/60 mt-4" style={{ fontSize: '0.95rem' }}>
              Free 15-minute call · No pressure · See results in 48 hours.
            </p>
          </div>
          <button onClick={() => openModal()}
            className="flex-shrink-0 font-mono-custom text-[0.7rem] tracking-[0.14em] uppercase px-10 py-5 cursor-pointer"
            style={{ background: '#0A0A0B', color: '#F5F4F0', border: 'none' }}>
            Get your free growth plan →
          </button>
        </div>
      </section>
    </>
  )
}
