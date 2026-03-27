import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Testimonial } from '@/lib/supabase'
import Seo from '@/components/Seo'
import { useQuoteModal } from '@/contexts/QuoteModalContext'

// Accent colors cycled per card
const COLORS = ['#3CBFAE', '#C9A96E', '#6C7AE0', '#00D4FF', '#E07A6C']

// Fallback reviews shown when DB is empty
const FALLBACK: Testimonial[] = [
  {
    id: 'f1',
    client_name: 'Predrag Kozica',
    client_role: undefined,
    client_company: 'Kozica Soaps',
    client_avatar_url: undefined,
    text: 'Imba Marketing completely changed our business. Their AI ad management took us from barely breaking even to $4.60 back for every $1 we spend — in just 8 weeks. The team is professional, they explain everything clearly, and they genuinely care about our results. Best marketing decision we ever made.',
    rating: 5,
    featured: true,
    published: true,
  },
  {
    id: 'f2',
    client_name: 'Bojan Ilić',
    client_role: 'CEO',
    client_company: 'Massive Movie Horse',
    client_avatar_url: undefined,
    text: 'Working with Imba has been incredible. Their AI marketing strategy helped us get 3x more qualified leads in just 90 days. What I love most is that they explain everything in plain language — no confusing tech jargon. Ljubica and the team guided us through every step and continue improving our results every month.',
    rating: 5,
    featured: true,
    published: true,
  },
  {
    id: 'f3',
    client_name: 'Dragan Dragovic',
    client_role: 'Developer & SEO Expert',
    client_company: 'Ogitive',
    client_avatar_url: undefined,
    text: 'We were losing leads in our funnel and didn\'t know why. Imba\'s AI analytics found the problem in a week and fixed it. Our acquisition costs dropped 38% and revenue went up — without spending more on ads. Their approach is simple: find what\'s broken, fix it, and make sure it stays fixed. Exactly what we needed.',
    rating: 5,
    featured: false,
    published: true,
  },
]

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 mb-6">
      {[1,2,3,4,5].map(n => (
        <svg key={n} width="14" height="14" viewBox="0 0 24 24" fill={n <= rating ? '#C9A96E' : 'none'}
          stroke={n <= rating ? '#C9A96E' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  )
}

export default function Reviews() {
  const { openModal } = useQuoteModal()
  const [reviews, setReviews] = useState<Testimonial[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    supabase
      .from('testimonials')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setReviews(data && data.length > 0 ? (data as Testimonial[]) : FALLBACK)
        setLoaded(true)
      })
  }, [])

  const display = loaded ? reviews : FALLBACK

  return (
    <>
      <Seo
        title="Client Reviews — What Brands Say About Our AI Marketing"
        description="Read what real brands say about working with Imba Marketing. Honest reviews from clients across industries who've seen real results."
        canonicalPath="/reviews"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          'name': 'Imba Marketing Client Reviews',
          'itemListElement': display.map((r, i) => ({
            '@type': 'ListItem',
            'position': i + 1,
            'item': {
              '@type': 'Review',
              'author': { '@type': 'Person', 'name': r.client_name },
              'reviewBody': r.text,
              'reviewRating': r.rating ? { '@type': 'Rating', 'ratingValue': r.rating, 'bestRating': 5 } : undefined,
              'itemReviewed': {
                '@type': 'Organization',
                'name': 'Imba Marketing',
                'url': 'https://imbamarketing.com',
              },
            },
          })),
        }}
      />

      {/* ── HERO ── */}
      <section className="pt-36 pb-20 px-6 lg:px-12 bg-ink relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[60vw] h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 0% 100%, rgba(0,212,255,0.04) 0%, transparent 65%)' }}
        />
        <div className="relative max-w-screen-xl mx-auto">
          <p className="eyebrow mb-5 reveal">What our clients say</p>
          <h1 className="font-display font-light leading-tight mb-6 reveal reveal-delay-1"
            style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
            What our clients say<br />
            <em className="text-gold italic">about working with us.</em>
          </h1>
          <p className="text-smoke-dim leading-relaxed max-w-lg reveal reveal-delay-2" style={{ fontSize: '0.95rem' }}>
            These are real reviews from real brands we've worked with — across e-commerce, SaaS, services, and more. We're proud of every partnership and every result.
          </p>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="py-24 px-6 lg:px-12 bg-ink-2">
        <div className="max-w-screen-lg mx-auto flex flex-col gap-8">
          {display.map((r, i) => {
            const color = COLORS[i % COLORS.length]
            const initial = initials(r.client_name)
            return (
              <article
                key={r.id}
                className="hud-card border border-white/8 bg-ink p-8 lg:p-12 reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Quote mark */}
                <div className="font-display text-[5rem] leading-none font-light mb-2 select-none"
                  style={{ color, opacity: 0.25 }}>
                  "
                </div>

                {r.rating && <StarRow rating={r.rating} />}

                <blockquote className="font-display font-light text-smoke leading-relaxed mb-8"
                  style={{ fontSize: 'clamp(1.15rem, 2vw, 1.5rem)' }}>
                  {r.text}
                </blockquote>

                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  {r.client_avatar_url ? (
                    <img src={r.client_avatar_url} alt={r.client_name}
                      className="w-12 h-12 rounded-sm object-cover flex-shrink-0"
                      style={{ border: `1px solid ${color}40` }} />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center font-mono-custom text-sm font-medium flex-shrink-0"
                      style={{ background: `${color}18`, border: `1px solid ${color}40`, color }}>
                      {initial}
                    </div>
                  )}
                  <div>
                    <p className="text-smoke font-medium text-sm">{r.client_name}</p>
                    <p className="text-smoke-faint text-xs mt-0.5">
                      {r.client_role ? `${r.client_role} · ` : ''}{r.client_company}
                    </p>
                  </div>

                  {/* Decorative line */}
                  <div className="flex-1 hidden sm:block">
                    <div className="h-px" style={{ background: `linear-gradient(90deg, ${color}30, transparent)` }} />
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 lg:px-12 bg-ink border-t border-white/5">
        <div className="max-w-screen-xl mx-auto text-center">
          <p className="eyebrow justify-center mb-5 reveal">Ready to be our next success story?</p>
          <h2 className="font-display font-light leading-tight mb-8 reveal reveal-delay-1"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            Join these businesses.<br />
            <em className="text-ember italic">Start growing today.</em>
          </h2>
          <button onClick={() => openModal()} className="btn btn-primary reveal reveal-delay-2">
            Get your free growth plan →
          </button>
        </div>
      </section>
    </>
  )
}
