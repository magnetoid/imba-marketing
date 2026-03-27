import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Seo from '@/components/Seo'

const SERVICES = [
  'AI Growth Marketing',
  'AI Performance Ads',
  'AI Personalization',
  'AI Content Production',
  'AI Analytics & Intelligence',
  'AI Conversion Optimization',
  'Full AI Marketing Stack',
  'Not sure yet — help me decide',
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
    q: 'How soon will I see results?',
    a: 'Most clients see first improvements within 48 hours. Meaningful results — more revenue, lower costs, more customers — typically show up within 2–4 weeks.',
  },
  {
    q: 'Do you work with businesses outside the US?',
    a: 'Yes — we work with businesses in North America, Europe, the Middle East, and Asia. Our marketing tools work on every major platform worldwide.',
  },
  {
    q: 'What happens on the first call?',
    a: 'We listen to your goals, review your current marketing, and identify the biggest opportunities. Then we come back within 24 hours with a free growth plan tailored to your business.',
  },
  {
    q: 'Will this work with the tools I already use?',
    a: 'Yes — we integrate with all major platforms: Google Ads, Meta, HubSpot, Salesforce, Mailchimp, Shopify, WooCommerce, and many more. Whether you\'re in e-commerce, SaaS, or services, we build on what you have, not replace it.',
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
      setError('Please fill in your name, email, and what you need help with.')
      return
    }
    setSubmitting(true)
    setError('')
    const { error: err } = await supabase.from('quote_requests').insert([form])
    setSubmitting(false)
    if (err) {
      setError('Something went wrong. Please try again or email us directly at hello@imbamarketing.com')
    } else {
      setSubmitted(true)
    }
  }

  return (
    <>
      <Seo
        title="Contact — Let's Build Your AI Marketing Strategy"
        description="Tell us about your marketing goals and we'll create a free AI marketing strategy showing exactly how we'd help. No commitment, no pressure."
        canonicalPath="/contact"
      />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="pt-36 pb-20 px-6 lg:px-12 bg-ink relative overflow-hidden">
        <div className="max-w-screen-xl mx-auto relative z-10">
          <p className="eyebrow mb-6 reveal">Let's talk</p>
          <h1 className="font-display font-light leading-none mb-6 reveal reveal-delay-1"
            style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
            Let's talk about<br />
            <em className="text-gold italic">your marketing goals.</em>
          </h1>
          <p className="text-smoke-dim text-lg max-w-xl reveal reveal-delay-2"
            style={{ fontWeight: 300 }}>
            No sales pitch, no pressure. Tell us what you're trying to achieve and we'll come back with a free AI marketing strategy showing exactly how we'd help you get there.
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
                    Got it — we'll be in touch soon.
                  </h2>
                  <p className="text-smoke-dim text-base" style={{ fontWeight: 300 }}>
                    We'll review your message and get back to you within 24 hours with a custom growth plan. In the meantime, check out{' '}
                    <a href="/results" className="text-smoke underline underline-offset-4 hover:text-ember transition-colors">what we've done for other businesses</a>.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="form-label">Your name *</label>
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
                  <label className="form-label">Company or business name</label>
                  <input className="form-input" type="text" placeholder="Your company or brand"
                    value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="form-label">What do you need help with?</label>
                    <select className="form-select" value={form.service_type}
                      onChange={e => setForm(f => ({ ...f, service_type: e.target.value }))}>
                      <option value="">Choose one</option>
                      {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Monthly budget</label>
                    <select className="form-select" value={form.budget_range}
                      onChange={e => setForm(f => ({ ...f, budget_range: e.target.value }))}>
                      <option value="">Choose a range</option>
                      {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">What are you trying to achieve? *</label>
                  <textarea className="form-textarea" rows={5}
                    placeholder="Tell us about your goals. What's working? What's not? What would success look like for you?"
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
              <p className="eyebrow mb-5">Prefer email?</p>
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
                    1007 N Orange St, 4th Floor<br />
                    Suite #3601<br />
                    Wilmington, DE 19801
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="eyebrow mb-5">What to expect</p>
              <p className="text-smoke-dim text-base" style={{ fontWeight: 300 }}>
                We respond to every message within <span className="text-smoke">24 hours</span>. You'll get a free growth plan customized to your business — no strings attached.
              </p>
            </div>

            <div>
              <p className="eyebrow mb-5">Follow us</p>
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
              Ready to start growing?
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
