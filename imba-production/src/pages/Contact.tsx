import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Seo from '@/components/Seo'

const SERVICES = [
  'AI Growth Systems',
  'AI Performance Advertising',
  'AI Personalisation Systems',
  'AI Content Engines',
  'AI Data & Market Intelligence',
  'AI Funnel Optimisation',
  'Full AI Marketing Stack',
  'Other / Not sure yet',
]

const BUDGETS = [
  'Under $3,000/mo',
  '$3,000 – $8,000/mo',
  '$8,000 – $20,000/mo',
  '$20,000 – $50,000/mo',
  '$50,000+/mo',
]

const FAQ = [
  {
    q: 'How quickly will we see results?',
    a: 'Most clients see initial AI-driven improvements within 48 hours of system launch. Significant measurable results (ROAS uplift, lower CPA, higher conversion) typically appear within 2–4 weeks of full deployment.',
  },
  {
    q: 'Do you work with international clients?',
    a: 'Yes — we work with brands across North America, Europe, the Middle East, and Asia-Pacific. Our AI systems are platform-agnostic and work across all major ad networks and marketing tools globally.',
  },
  {
    q: 'What does the onboarding process look like?',
    a: 'We start with a free strategy call to audit your current setup and identify the highest-value AI opportunities. We then design your custom system, build and integrate it (2–4 weeks), and hand over a fully operational AI growth engine.',
  },
  {
    q: 'Can you integrate with our existing tools?',
    a: 'Yes — we integrate with all major platforms: Google Ads, Meta, HubSpot, Salesforce, Klaviyo, Shopify, and more. If you use a tool, we can almost certainly connect it to your AI system.',
  },
]

export default function Contact() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    company: '',
    service_type: '',
    budget_range: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.full_name || !form.email || !form.message) {
      setError('Please fill in name, email and message.')
      return
    }
    setSubmitting(true)
    setError('')
    const { error: err } = await supabase.from('quote_requests').insert([form])
    setSubmitting(false)
    if (err) {
      setError('Something went wrong. Please try again or email us directly.')
    } else {
      setSubmitted(true)
    }
  }

  return (
    <>
      <Seo
        title="Contact — Build Your AI Growth Engine"
        description="Tell us about your marketing goals and we'll design a custom AI system that turns them into measurable results. Free strategy call, no commitment."
        canonicalPath="/contact"
      />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="pt-36 pb-20 px-6 lg:px-12 bg-ink relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />
        <div className="max-w-screen-xl mx-auto relative z-10">
          <p className="eyebrow mb-6 reveal">Get in touch</p>
          <h1 className="font-display font-light leading-none mb-6 reveal reveal-delay-1"
            style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
            Let's build your<br />
            <em className="text-gold italic">AI growth engine.</em>
          </h1>
          <p className="text-smoke-dim text-lg max-w-xl reveal reveal-delay-2"
            style={{ fontWeight: 300 }}>
            Tell us about your marketing goals and we'll design a custom AI system that turns them into measurable results.
          </p>
        </div>
      </section>

      {/* ── FORM + INFO ──────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-12 bg-ink-2">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16">

          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="flex flex-col items-start gap-6 py-12">
                <div className="w-12 h-12 rounded-full bg-ember/15 flex items-center justify-center">
                  <span className="text-ember text-xl">✓</span>
                </div>
                <div>
                  <h2 className="font-display font-light text-3xl text-smoke mb-3">
                    Message sent.
                  </h2>
                  <p className="text-smoke-dim text-base" style={{ fontWeight: 300 }}>
                    We'll be in touch within 24 hours. In the meantime, browse{' '}
                    <a href="/results" className="text-smoke underline underline-offset-4 hover:text-ember transition-colors">our results</a>.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="form-label">Full name *</label>
                    <input className="form-input" type="text" placeholder="Jane Smith"
                      value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="form-label">Email *</label>
                    <input className="form-input" type="email" placeholder="jane@company.com"
                      value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                </div>

                <div>
                  <label className="form-label">Company</label>
                  <input className="form-input" type="text" placeholder="Your company or brand"
                    value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="form-label">Service type</label>
                    <select className="form-select" value={form.service_type}
                      onChange={e => setForm(f => ({ ...f, service_type: e.target.value }))}>
                      <option value="">Select a service</option>
                      {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Budget range</label>
                    <select className="form-select" value={form.budget_range}
                      onChange={e => setForm(f => ({ ...f, budget_range: e.target.value }))}>
                      <option value="">Select a range</option>
                      {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Tell us about your marketing goals *</label>
                  <textarea className="form-textarea" rows={5}
                    placeholder="What are your growth targets? What's currently not working? What tools do you use?"
                    value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
                </div>

                {error && (
                  <p className="text-ember text-sm">{error}</p>
                )}

                <div>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Sending…' : 'Send message →'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            <div>
              <p className="eyebrow mb-5">Direct contact</p>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="font-mono-custom text-[0.65rem] tracking-wider text-smoke-faint uppercase mb-1">Email</p>
                  <a href="mailto:hello@imbamarketing.com"
                    className="text-smoke hover:text-ember transition-colors text-base">
                    hello@imbamarketing.com
                  </a>
                </div>
                <div>
                  <p className="font-mono-custom text-[0.65rem] tracking-wider text-smoke-faint uppercase mb-1">Address</p>
                  <p className="text-smoke-dim text-base" style={{ fontWeight: 300 }}>
                    007 N Orange St, 4th Floor<br />
                    Suite #3601<br />
                    Wilmington, DE 19801
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="eyebrow mb-5">Response time</p>
              <p className="text-smoke-dim text-base" style={{ fontWeight: 300 }}>
                We respond to all enquiries within <span className="text-smoke">24 hours</span>, Monday to Friday.
              </p>
            </div>

            <div>
              <p className="eyebrow mb-5">Follow our work</p>
              <div className="flex gap-4">
                {[
                  { label: 'LinkedIn',  href: 'https://linkedin.com/company/imba-marketing' },
                  { label: 'Instagram', href: 'https://instagram.com/imbamarketing' },
                  { label: 'YouTube',   href: 'https://youtube.com/@imbamarketing' },
                ].map(({ label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="font-mono-custom text-[0.65rem] tracking-wider text-smoke-faint hover:text-smoke uppercase transition-colors">
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-12 bg-ink">
        <div className="max-w-screen-xl mx-auto">
          <p className="eyebrow mb-8 reveal">Common questions</p>
          <div className="max-w-2xl flex flex-col divide-y divide-white/8">
            {FAQ.map((item, i) => (
              <div key={i} className="py-5">
                <button
                  className="w-full flex items-center justify-between text-left gap-4 group"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-display font-light text-lg text-smoke group-hover:text-smoke transition-colors">
                    {item.q}
                  </span>
                  <span className="text-smoke-faint flex-shrink-0 transition-transform duration-200"
                    style={{ transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <p className="mt-3 text-smoke-dim text-base leading-relaxed" style={{ fontWeight: 300 }}>
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ─────────────────────────────────────────── */}
      <section className="py-16 px-6 lg:px-12 bg-ember">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-display font-light text-2xl text-white mb-1">
              Ready to start growing with AI?
            </p>
            <p className="text-white/70 text-sm" style={{ fontWeight: 300 }}>
              We have capacity for 3 new clients this month.
            </p>
          </div>
          <a href="mailto:hello@imbamarketing.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-ember font-mono-custom text-xs tracking-widest uppercase hover:bg-smoke transition-colors flex-shrink-0">
            Email us directly →
          </a>
        </div>
      </section>
    </>
  )
}
