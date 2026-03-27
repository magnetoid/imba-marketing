import { useState, useEffect } from 'react'
import { useQuoteModal } from '@/contexts/QuoteModalContext'
import { supabase } from '@/lib/supabase'

const SERVICES = [
  'Grow my revenue on autopilot',
  'Get more from my ad spend',
  'Personalize my customer experience',
  'Create content faster',
  'Understand my market better',
  'Turn more visitors into buyers',
  'Full marketing solution',
  'Not sure yet — help me decide',
]

const BUDGETS = [
  'Under $3,000/mo',
  '$3,000 – $8,000/mo',
  '$8,000 – $20,000/mo',
  '$20,000 – $50,000/mo',
  '$50,000+/mo',
]

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '3px',
  color: '#F5F4F0',
  fontFamily: 'inherit',
  fontSize: '0.9rem',
  padding: '0.65rem 0.85rem',
  width: '100%',
  outline: 'none',
  boxSizing: 'border-box',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <label style={{
        fontFamily: 'DM Mono, monospace', fontSize: '0.58rem',
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'rgba(245,244,240,0.4)',
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}

export default function QuoteModal() {
  const { open, closeModal, preselectedService } = useQuoteModal()
  const [form, setForm] = useState({
    full_name: '', email: '', company: '', service_type: '', budget_range: '', message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setForm(f => ({ ...f, service_type: preselectedService || '' }))
      setSubmitted(false)
      setError('')
    }
  }, [open, preselectedService])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

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
    if (err) setError('Something went wrong. Please email us at hello@imbamarketing.com')
    else setSubmitted(true)
  }

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(8,8,10,0.88)',
        backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={e => { if (e.target === e.currentTarget) closeModal() }}
    >
      <div style={{
        background: '#111113',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: '4px',
        width: '100%', maxWidth: '580px',
        maxHeight: '90vh', overflowY: 'auto',
        position: 'relative',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.75rem 2rem 1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <p style={{
              fontFamily: 'DM Mono, monospace', fontSize: '0.6rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#E8452A', marginBottom: '0.4rem',
            }}>
              Free growth plan — we reply within 24h
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display, serif)', fontWeight: 300,
              fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#F5F4F0', lineHeight: 1.2,
            }}>
              Tell us about your business
            </h2>
          </div>
          <button
            onClick={closeModal}
            aria-label="Close"
            style={{
              color: 'rgba(245,244,240,0.3)', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1,
              padding: '0 0 0 1.5rem', marginTop: '-2px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#F5F4F0')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,244,240,0.3)')}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.75rem 2rem 2rem' }}>
          {submitted ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem 0' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%',
                background: 'rgba(232,69,42,0.12)', border: '1px solid rgba(232,69,42,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: '#E8452A', fontSize: '1.3rem' }}>✓</span>
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display, serif)', fontWeight: 300, fontSize: '1.6rem', color: '#F5F4F0', marginBottom: '0.5rem' }}>
                  We got your message!
                </h3>
                <p style={{ color: 'rgba(245,244,240,0.5)', lineHeight: 1.6, fontWeight: 300 }}>
                  We'll review everything and get back to you within 24 hours with a free growth plan tailored to your business.
                </p>
              </div>
              <button
                onClick={closeModal}
                style={{
                  alignSelf: 'flex-start', marginTop: '0.5rem',
                  fontFamily: 'DM Mono, monospace', fontSize: '0.65rem',
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: '#E8452A', background: 'none', border: 'none', cursor: 'pointer',
                }}
              >
                Close →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Your name *">
                  <input
                    value={form.full_name}
                    onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                    placeholder="Full name"
                    style={inputStyle}
                  />
                </Field>
                <Field label="Email *">
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@company.com"
                    style={inputStyle}
                  />
                </Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Company">
                  <input
                    value={form.company}
                    onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                    placeholder="Company name"
                    style={inputStyle}
                  />
                </Field>
                <Field label="What do you need help with?">
                  <select
                    value={form.service_type}
                    onChange={e => setForm(f => ({ ...f, service_type: e.target.value }))}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="">Choose one…</option>
                    {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Monthly budget">
                <select
                  value={form.budget_range}
                  onChange={e => setForm(f => ({ ...f, budget_range: e.target.value }))}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="">Choose a range…</option>
                  {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </Field>
              <Field label="What are you trying to achieve? *">
                <textarea
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us about your goals. What's working? What's not? What would success look like?"
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '96px' }}
                />
              </Field>
              {error && (
                <p style={{ color: '#E8452A', fontSize: '0.83rem' }}>{error}</p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    background: '#E8452A', color: '#F5F4F0', border: 'none',
                    padding: '0.85rem 2.5rem',
                    fontFamily: 'DM Mono, monospace', fontSize: '0.65rem',
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    cursor: submitting ? 'wait' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                    transition: 'opacity 0.2s',
                  }}
                >
                  {submitting ? 'Sending…' : 'Get my free growth plan →'}
                </button>
                <p style={{ fontSize: '0.72rem', color: 'rgba(245,244,240,0.25)', fontFamily: 'DM Mono, monospace' }}>
                  100% free
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
