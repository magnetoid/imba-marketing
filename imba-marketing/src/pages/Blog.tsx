import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import type { BlogPost } from '@/lib/supabase'
import Seo from '@/components/Seo'

const STATIC_POSTS = [
  {
    id: '1',
    title: 'How to Build an AI Growth System That Compounds Over Time',
    excerpt: 'Most brands run ads. The best brands build systems. A deep-dive into how AI-powered growth systems create compounding revenue gains — and how to build one.',
    category: 'AI Marketing',
    date: 'March 8, 2026',
    read_time: 9,
    featured: true,
    slug: 'ai-growth-system-guide-2026',
  },
  {
    id: '2',
    title: 'Cutting CPA by 40%: The AI Performance Advertising Playbook',
    excerpt: 'How modern AI bidding, creative testing, and audience segmentation work together to systematically lower your cost per acquisition — without sacrificing volume.',
    category: 'Performance Advertising',
    date: 'March 30, 2025',
    read_time: 8,
    featured: false,
    slug: 'ai-performance-advertising-cpa-reduction',
  },
  {
    id: '3',
    title: 'AI Personalisation at Scale: From Segment-of-One to Revenue',
    excerpt: 'Personalisation is no longer optional. How leading eCommerce brands use AI to serve hyper-relevant experiences across email, ads, and on-site — automatically.',
    category: 'AI Marketing',
    date: 'January 13, 2025',
    read_time: 7,
    featured: false,
    slug: 'ai-personalisation-at-scale',
  },
  {
    id: '4',
    title: 'Building an AI Content Engine That Never Runs Dry',
    excerpt: 'Content at scale without headcount growth. How AI content engines automatically generate, optimise, and distribute brand content across every channel.',
    category: 'Content Strategy',
    date: 'December 25, 2024',
    read_time: 6,
    featured: false,
    slug: 'ai-content-engine-guide',
  },
  {
    id: '5',
    title: 'Marketing Analytics in the AI Era: What to Measure and Why',
    excerpt: 'Vanity metrics are dead. A practical guide to building an AI analytics stack that surfaces the signals that actually predict revenue growth.',
    category: 'Marketing Analytics',
    date: 'October 28, 2024',
    read_time: 7,
    featured: false,
    slug: 'ai-marketing-analytics-guide',
  },
  {
    id: '6',
    title: 'AI Funnel Optimisation: How to Stop Losing 70% of Your Traffic',
    excerpt: 'The average funnel loses 7 out of 10 visitors. AI funnel optimisation identifies exactly where and why — then fixes it automatically. Here\'s how.',
    category: 'Growth Systems',
    date: 'September 22, 2024',
    read_time: 5,
    featured: false,
    slug: 'ai-funnel-optimisation-guide',
  },
  {
    id: '7',
    title: 'The State of AI Marketing in 2026: What\'s Working Now',
    excerpt: 'From predictive audiences to autonomous campaign management — a comprehensive look at the AI marketing strategies delivering the highest ROI for growth brands.',
    category: 'AI Marketing',
    date: 'September 21, 2024',
    read_time: 6,
    featured: false,
    slug: 'state-of-ai-marketing-2026',
  },
  {
    id: '8',
    title: 'First-Party Data Strategy: Building Your AI Marketing Foundation',
    excerpt: 'Third-party cookies are gone. How to build a first-party data strategy that powers your AI systems and creates a durable competitive advantage.',
    category: 'Marketing Analytics',
    date: 'September 20, 2024',
    read_time: 5,
    featured: false,
    slug: 'first-party-data-ai-marketing',
  },
  {
    id: '9',
    title: 'Conversion Rate Optimisation with AI: Beyond A/B Testing',
    excerpt: 'Traditional A/B testing is too slow. AI-powered CRO tests hundreds of variants simultaneously and adapts in real-time. Here\'s the new paradigm.',
    category: 'Growth Systems',
    date: 'October 27, 2024',
    read_time: 6,
    featured: false,
    slug: 'ai-cro-beyond-ab-testing',
  },
  {
    id: '10',
    title: 'How to Integrate AI Marketing Systems with Your Existing Stack',
    excerpt: 'You don\'t need to rip and replace. How AI marketing systems layer on top of your existing tools — HubSpot, Klaviyo, Shopify, Google Ads — and amplify them.',
    category: 'Industry Insights',
    date: 'February 24, 2025',
    read_time: 6,
    featured: false,
    slug: 'ai-marketing-integration-guide',
  },
  {
    id: '11',
    title: 'ROAS 4× in 90 Days: Inside an AI Performance Advertising System',
    excerpt: 'A detailed case study breakdown: how we built and deployed an AI advertising system for an eCommerce brand that quadrupled their return on ad spend.',
    category: 'Performance Advertising',
    date: 'January 13, 2025',
    read_time: 8,
    featured: false,
    slug: 'roas-4x-ai-advertising-case-study',
  },
  {
    id: '12',
    title: 'Predictive Lead Scoring with AI: Never Miss a Hot Lead Again',
    excerpt: 'AI lead scoring models identify your best prospects before they raise their hand. How to build, train, and deploy a predictive scoring system for B2B growth.',
    category: 'Growth Systems',
    date: 'October 12, 2024',
    read_time: 7,
    featured: false,
    slug: 'predictive-lead-scoring-ai',
  },
]

const STATIC_CATEGORIES = ['All', 'AI Marketing', 'Growth Systems', 'Performance Advertising', 'Content Strategy', 'Marketing Analytics', 'Industry Insights']

const CAT_COLOR: Record<string, string> = {
  'AI Marketing': '#C9A96E',
  'Growth Systems': '#E8452A',
  'Performance Advertising': '#3CBFAE',
  'Content Strategy': '#8A8AFF',
  'Marketing Analytics': '#6C7AE0',
  'Industry Insights': '#00D4FF',
}

interface DisplayPost {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  read_time: number
  featured: boolean
  slug: string
}

function toDisplayPost(p: BlogPost): DisplayPost {
  const cat = (p.blog_categories?.name) || p.category || 'Uncategorised'
  return {
    id: p.id,
    title: p.title,
    excerpt: p.excerpt || '',
    category: cat,
    date: p.published_at
      ? new Date(p.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    read_time: p.read_time_minutes || 5,
    featured: false,
    slug: p.slug,
  }
}

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [livePosts, setLivePosts] = useState<DisplayPost[]>([])

  useEffect(() => {
    supabase.from('blog_posts')
      .select('*, blog_categories(name, slug)')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .then(({ data }) => {
        if (data?.length) setLivePosts(data.map(toDisplayPost))
      })
  }, [])

  const POSTS = livePosts.length > 0 ? livePosts : STATIC_POSTS
  const allCategories = livePosts.length > 0
    ? ['All', ...Array.from(new Set(livePosts.map(p => p.category)))]
    : STATIC_CATEGORIES

  const filtered = activeCategory === 'All'
    ? POSTS
    : POSTS.filter(p => p.category === activeCategory)

  const featured = POSTS.find(p => p.featured) || POSTS[0]

  return (
    <>
      <Seo
        title="Blog — AI Marketing Insights"
        description="Ideas, research, and perspective on AI marketing systems, growth strategies, and revenue optimisation from the Imba Marketing team."
        canonicalPath="/blog"
      />
      {/* ── PAGE HERO ─────────────────────────────────────── */}
      <section className="pt-36 pb-16 px-6 lg:px-12 bg-ink relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40vw] h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 70% at 100% 30%, rgba(201,169,110,0.05) 0%, transparent 65%)' }}
        />
        <div className="relative max-w-screen-xl mx-auto">
          <p className="eyebrow mb-5 reveal">AI marketing insights</p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h1 className="font-display font-light leading-none reveal reveal-delay-1"
              style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
              Expert tips,<br />
              <em className="text-[#D4A853] italic">real results</em>
            </h1>
            <p className="text-smoke-dim max-w-xs leading-relaxed reveal reveal-delay-2" style={{ fontSize: '0.93rem' }}>
              100+ articles on AI marketing systems, growth strategies, and converting traffic into revenue.
            </p>
          </div>
        </div>
      </section>

      {/* ── FEATURED POST ─────────────────────────────────── */}
      {activeCategory === 'All' && featured && (
        <section className="bg-ink px-6 lg:px-12 pb-8">
          <div className="max-w-screen-xl mx-auto">
            <Link
              to={`/blog/${featured.slug}`}
              className="grid lg:grid-cols-2 gap-0 border border-white/8 group cursor-pointer hover:border-white/15 transition-colors"
            >
              {/* Visual */}
              <div className="relative overflow-hidden bg-ink-3 aspect-video lg:aspect-auto">
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(135deg, rgba(201,169,110,0.12) 0%, rgba(232,69,42,0.08) 50%, transparent 100%)' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-display font-light text-smoke/20 select-none" style={{ fontSize: 'clamp(5rem, 12vw, 10rem)' }}>AI</div>
                  </div>
                </div>
                <div className="absolute inset-0" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)',
                }} />
                <div className="absolute top-4 left-4 font-mono-custom text-[0.58rem] tracking-widest uppercase px-2 py-1"
                  style={{ background: `${CAT_COLOR[featured.category] || '#E8452A'}22`, color: CAT_COLOR[featured.category] || '#E8452A', border: `1px solid ${CAT_COLOR[featured.category] || '#E8452A'}33` }}>
                  Featured · {featured.category}
                </div>
              </div>

              {/* Content */}
              <div className="bg-ink-2 p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-5">
                    <span className="font-mono-custom text-[0.6rem] tracking-widest text-smoke-faint uppercase">{featured.date}</span>
                    <span className="font-mono-custom text-[0.58rem] text-smoke-faint/50">{featured.read_time} min read</span>
                  </div>
                  <h2 className="font-display font-light text-smoke leading-tight mb-5"
                    style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)' }}>
                    {featured.title}
                  </h2>
                  <p className="text-smoke-dim leading-relaxed" style={{ fontSize: '0.93rem' }}>
                    {featured.excerpt}
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-3">
                  <span className="font-mono-custom text-[0.68rem] tracking-[0.14em] uppercase text-ember flex items-center gap-2 group-hover:gap-3 transition-all">
                    <span>Read article</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ── CATEGORY FILTER ───────────────────────────────── */}
      <div className="bg-ink border-b border-white/5 px-6 lg:px-12 py-5">
        <div className="max-w-screen-xl mx-auto flex gap-1.5 overflow-x-auto">
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex-shrink-0 font-mono-custom text-[0.65rem] tracking-[0.12em] uppercase px-4 py-2 transition-all duration-200"
              style={{
                background: activeCategory === cat ? '#E8452A' : 'transparent',
                color: activeCategory === cat ? '#F5F4F0' : '#6B6A65',
                border: `1px solid ${activeCategory === cat ? '#E8452A' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── POSTS GRID ────────────────────────────────────── */}
      <section className="bg-ink py-12 px-6 lg:px-12">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeCategory === 'All' ? POSTS.filter(p => !p.featured) : filtered).map((post, i) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group bg-ink-2 border border-white/5 hover:border-white/12 transition-all duration-300 flex flex-col reveal"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {/* Thumbnail area */}
              <div className="relative overflow-hidden aspect-video bg-ink-3 flex-shrink-0">
                <div className="absolute inset-0"
                  style={{ background: `radial-gradient(ellipse 70% 70% at 50% 50%, ${CAT_COLOR[post.category] || '#E8452A'}12 0%, transparent 70%)` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display font-light select-none" style={{ fontSize: '4rem', color: `${CAT_COLOR[post.category] || '#E8452A'}18` }}>
                    {post.category === 'AI Video' ? '◈' : post.category === 'TikTok' ? '◉' : post.category === 'Film' ? '◬' : post.category === 'Technology' ? '◰' : '▶'}
                  </span>
                </div>
                <div className="absolute inset-0" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)',
                }} />
                <div className="absolute top-3 left-3 font-mono-custom text-[0.55rem] tracking-widest uppercase px-2 py-1"
                  style={{ background: `${CAT_COLOR[post.category] || '#E8452A'}22`, color: CAT_COLOR[post.category] || '#E8452A', border: `1px solid ${CAT_COLOR[post.category] || '#E8452A'}33` }}>
                  {post.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono-custom text-[0.58rem] tracking-widest text-smoke-faint uppercase">{post.date}</span>
                  <span className="font-mono-custom text-[0.55rem] text-smoke-faint/40">{post.read_time} min</span>
                </div>
                <h3 className="font-display font-light text-smoke leading-tight mb-3 group-hover:text-ember transition-colors flex-1"
                  style={{ fontSize: '1.15rem' }}>
                  {post.title}
                </h3>
                <p className="text-smoke-dim leading-relaxed mb-5" style={{ fontSize: '0.82rem' }}>
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 mt-auto font-mono-custom text-[0.62rem] tracking-[0.14em] uppercase text-ember group-hover:gap-3 transition-all">
                  <span>Read more</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all on WordPress */}
        <div className="max-w-screen-xl mx-auto mt-12 text-center">
          <a
            href="https://www.imbamarketing.com/blog/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost inline-flex items-center gap-2"
          >
            View all 185+ articles on our blog ↗
          </a>
        </div>
      </section>

      {/* ── TOPICS STRIP ─────────────────────────────────── */}
      <section className="bg-ink-2 py-16 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-screen-xl mx-auto">
          <p className="font-mono-custom text-[0.62rem] tracking-[0.2em] uppercase text-smoke-faint/50 mb-8 text-center">Content pillars</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'AI Growth Systems', 'Performance Advertising', 'Conversion Optimisation',
              'Marketing Analytics', 'AI Personalisation', 'Content Engines',
              'First-Party Data', 'Lead Scoring', 'Funnel Optimisation',
              'B2B Marketing AI', 'eCommerce AI', 'Revenue Attribution',
            ].map(topic => (
              <span key={topic}
                className="font-mono-custom text-[0.62rem] tracking-[0.12em] uppercase px-3 py-2 border border-white/8 text-smoke-faint/50 hover:text-smoke-faint hover:border-white/15 transition-colors cursor-default">
                {topic}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ─────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#E8452A' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 8px)',
        }} />
        <div className="relative px-6 lg:px-12 py-20 max-w-screen-xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <h2 className="font-display font-light leading-tight text-ink"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.8rem)' }}>
              Ready to create something<br /><em>extraordinary?</em>
            </h2>
            <p className="text-ink/60 mt-3" style={{ fontSize: '0.95rem' }}>
              Talk to our team. Free quote, 24h reply, no commitment.
            </p>
          </div>
          <Link to="/contact"
            className="flex-shrink-0 font-mono-custom text-[0.7rem] tracking-[0.14em] uppercase px-8 py-4"
            style={{ background: '#0A0A0B', color: '#F5F4F0' }}>
            Get a free quote
          </Link>
        </div>
      </section>
    </>
  )
}
