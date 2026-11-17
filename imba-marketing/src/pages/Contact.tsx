import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import Seo from '@/components/Seo'
import { CtaBand } from '@/components/site'

// Interest chips from the 2026 redesign. The selection is saved to
// quote_requests.service_type / crm_leads.service_interest as before.
const INTERESTS = ['Marketing', 'Development', 'Automation', 'Not sure yet']

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
  const [params] = useSearchParams()
  const preset = params.get('interest')
  const [interests, setInterests] = useState<string[]>(preset && INTERESTS.includes(preset) ? [preset] : [])
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    company: '',
    budget_range: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function toggleInterest(label: string) {
    setInterests(cur => cur.includes(label) ? cur.filter(x => x !== label) : [...cur, label])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.full_name || !form.email || !form.message) {
      setError('Please fill in your name, email, and your goal.')
      return
    }
    setSubmitting(true)
    setError('')
    const service_type = interests.join(', ')
    const { error: err } = await supabase.from('quote_requests').insert([{ ...form, service_type }])
    setSubmitting(false)
    if (err) {
      setError('Something went wrong. Please try again or email us directly at hello@imbamarketing.com')
    } else {
      setSubmitted(true)

      // Auto-create CRM lead
      try {
        await supabase.from('crm_leads').insert({
          name: form.full_name,
          email: form.email,
          company: form.company || null,
          source: 'contact_form',
          stage: 'new',
          service_interest: service_type || null,
          budget_range: form.budget_range || null,
          notes: form.message || null,
          probability: 50,
        })
      } catch { /* best-effort */ }
    }
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <>
      <Seo
        title="Contact — Send an Inquiry"
        description="Describe what you need in a few sentences. We reply within one business day with questions or a proposal."
        canonicalPath="/contact"
        structuredData={[
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            'name': 'Contact Imba Marketing',
            'description': 'Send an inquiry. We reply within one business day with questions or a proposal.',
            'url': 'https://imbamarketing.com/contact'
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': FAQ.map(item => ({
              '@type': 'Question',
              'name': item.q,
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': item.a
              }
            }))
          }
        ]}
      />

      <section className="wrap py-[clamp(48px,7vw,96px)] grid gap-x-[72px] gap-y-10 [grid-template-columns:repeat(auto-fit,minmax(min(100%,400px),1fr))]">
        <div>
          <div className="kicker mb-6">Contact</div>
          <h1 className="font-display font-bold m-0 mb-7 text-[clamp(40px,5.6vw,80px)] leading-[.98] tracking-[-.04em]">Send an inquiry.</h1>
          <p className="text-[19px] leading-relaxed text-smoke-dim m-0 mb-9 max-w-[460px]">
            Describe what you need in a few sentences. We reply within one business day with questions or a proposal.
          </p>
          <div className="border-t border-line pt-5 text-base leading-[1.7] text-smoke-dim flex flex-col gap-4">
            <a href="mailto:hello@imbamarketing.com" className="text-smoke font-semibold hover:text-brand-text">hello@imbamarketing.com</a>
            <p className="m-0">1007 N Orange St, 4th Floor, Suite #3601<br />Wilmington, DE 19801, United States</p>
            <p className="m-0">Kragujevac, Serbia · +1 (650) 226-7172</p>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              {[
                { label: 'LinkedIn',  href: 'https://linkedin.com/company/imba-marketing' },
                { label: 'Instagram', href: 'https://instagram.com/imbamarketing' },
                { label: 'YouTube',   href: 'https://youtube.com/@imbamarketing' },
              ].map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="hover:text-smoke">{label}</a>
              ))}
            </div>
          </div>
        </div>

        <div>
          {submitted ? (
            <div className="border border-line bg-ink-2 p-10" role="status">
              <div aria-hidden="true" className="w-3.5 h-3.5 bg-brand mb-6" />
              <h2 className="font-display font-semibold text-[34px] leading-[1.05] tracking-[-.02em] m-0 mb-3">Inquiry sent.</h2>
              <p className="m-0 mb-6 text-smoke-dim text-[17px] leading-relaxed">We will reply within one business day. Meanwhile, see <Link to="/results" className="text-smoke underline decoration-brand decoration-2 underline-offset-4">what we've done for other businesses</Link>.</p>
              <Link to="/" className="font-semibold hover:text-brand-text">← Back to home</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-[22px]" noValidate>
              <fieldset className="border-0 p-0 m-0">
                <legend className="font-semibold text-[15px] mb-2.5">What do you need?</legend>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map(label => (
                    <button key={label} type="button" className="chip" aria-pressed={interests.includes(label)} onClick={() => toggleInterest(label)}>
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))]">
                <label className="flex flex-col gap-2 font-semibold text-[15px]">Name
                  <input className="form-input" required name="name" autoComplete="name" value={form.full_name} onChange={set('full_name')} />
                </label>
                <label className="flex flex-col gap-2 font-semibold text-[15px]">Work email
                  <input className="form-input" required type="email" name="email" autoComplete="email" value={form.email} onChange={set('email')} />
                </label>
              </div>
              <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))]">
                <label className="flex flex-col gap-2 font-semibold text-[15px]">Company or website
                  <input className="form-input" name="company" autoComplete="organization" value={form.company} onChange={set('company')} />
                </label>
                <label className="flex flex-col gap-2 font-semibold text-[15px]">Monthly budget
                  <select className="form-select" name="budget" value={form.budget_range} onChange={set('budget_range')}>
                    <option value="">Choose a range</option>
                    {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </label>
              </div>
              <label className="flex flex-col gap-2 font-semibold text-[15px]">Your goal
                <textarea className="form-textarea" required name="message" rows={5}
                  placeholder="What do you sell, and what should change in the next three months?"
                  value={form.message} onChange={set('message')} />
              </label>
              {error && <p role="alert" className="m-0 text-[15px] font-semibold text-smoke border-l-4 border-brand pl-3">{error}</p>}
              <button type="submit" className="btn btn-primary btn-lg self-start !px-8" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send inquiry →'}
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="border-t border-line">
        <div className="wrap py-[clamp(56px,8vw,96px)] grid gap-x-16 gap-y-8 lg:grid-cols-[1fr_1.4fr]">
          <h2 className="h-sub m-0">Common questions</h2>
          <div>
            {FAQ.map(item => (
              <details key={item.q} className="group border-t border-line py-5">
                <summary className="cursor-pointer list-none flex justify-between gap-4 font-display font-semibold text-xl tracking-[-.01em]">
                  {item.q}<span aria-hidden="true" className="font-mono-custom text-brand-text group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 mb-0 text-smoke-dim leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Prefer email? Write to us directly." sub="We have capacity for 3 new clients this month." to="mailto:hello@imbamarketing.com" label="Email us directly →" />
    </>
  )
}
