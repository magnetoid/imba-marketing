import Seo from '@/components/Seo'
import { useQuoteModal } from '@/contexts/QuoteModalContext'

const PROJECTS = [
  {
    id: 'growth-engine',
    title: 'AI Growth Engine',
    tagline: 'Self-learning campaigns that compound revenue',
    desc: 'A fully autonomous marketing engine that runs 24/7 — generating leads, scoring them with AI, triggering personalized nurture sequences, and reallocating budget to the highest-performing channels. It learns from every interaction and gets smarter over time.',
    stack: ['Machine Learning', 'Marketing Automation', 'Predictive Analytics', 'Multi-Channel Orchestration'],
    metrics: [
      { label: 'Avg. Revenue Lift', value: '3×' },
      { label: 'Lead Quality', value: '+200%' },
      { label: 'Manual Work Reduced', value: '85%' },
    ],
    color: '#EF4444',
    icon: '◈',
    status: 'Production',
  },
  {
    id: 'ad-optimizer',
    title: 'AI Ad Optimizer',
    tagline: 'Real-time ROAS optimization across every platform',
    desc: 'Cross-platform ad management system that simultaneously tests creative variations, audiences, and bid strategies across Google, Meta, TikTok, and LinkedIn. It processes thousands of signals per second to allocate budget where returns are highest.',
    stack: ['Real-Time Bidding', 'Creative Testing', 'Cross-Platform API', 'Budget Allocation ML'],
    metrics: [
      { label: 'Avg. ROAS', value: '4.8×' },
      { label: 'Ad Variations Tested', value: '200+' },
      { label: 'Cost Reduction', value: '40%' },
    ],
    color: '#D4A853',
    icon: '▣',
    status: 'Production',
  },
  {
    id: 'personalization-ai',
    title: 'AI Personalization Engine',
    tagline: 'Every visitor gets messaging that resonates',
    desc: 'Behavioral targeting system that builds a real-time profile of every visitor and dynamically adjusts content, offers, email sequences, and on-site experiences. From first touch to repeat purchase, every interaction is tailored.',
    stack: ['Behavioral ML', 'Dynamic Content', 'Customer Journey AI', 'Real-Time Segmentation'],
    metrics: [
      { label: 'Engagement Lift', value: '5×' },
      { label: 'Conversion Rate', value: '+67%' },
      { label: 'Customer LTV', value: '+41%' },
    ],
    color: '#3B82F6',
    icon: '◉',
    status: 'Production',
  },
  {
    id: 'content-factory',
    title: 'AI Content Factory',
    tagline: '30 days of brand content in a single session',
    desc: 'Content generation system trained on your brand voice that produces social posts, email campaigns, ad creatives, blog articles, and product descriptions at scale. It maintains brand consistency across 500+ SKUs and dozens of channels.',
    stack: ['LLM Fine-Tuning', 'Brand Voice Training', 'Multi-Format Output', 'Quality Scoring'],
    metrics: [
      { label: 'Content Output', value: '30×' },
      { label: 'Time Saved', value: '95%' },
      { label: 'Brand Consistency', value: '99%' },
    ],
    color: '#EF4444',
    icon: '▶',
    status: 'Production',
  },
  {
    id: 'market-intelligence',
    title: 'AI Market Intelligence',
    tagline: 'Competitive insights that surface real opportunities',
    desc: 'Continuous market monitoring system that tracks competitors, analyzes search trends, identifies content gaps, and surfaces untapped keywords and audience segments. It turns raw data into actionable growth strategies.',
    stack: ['Competitive Analysis', 'Trend Prediction', 'Keyword Discovery', 'Opportunity Scoring'],
    metrics: [
      { label: 'Organic Growth', value: '+28%' },
      { label: 'New Keywords Found', value: '340+' },
      { label: 'Market Gaps Identified', value: '12' },
    ],
    color: '#D4A853',
    icon: '◬',
    status: 'Production',
  },
  {
    id: 'funnel-optimizer',
    title: 'AI Funnel Optimizer',
    tagline: 'Find and fix every conversion leak automatically',
    desc: 'Full-funnel diagnostic system that pinpoints exactly where prospects drop off — then deploys fixes automatically. AI-powered A/B testing, smart landing pages, checkout optimization, and behavioral triggers that recover lost revenue.',
    stack: ['Funnel Analytics', 'Automated A/B Testing', 'Behavioral Triggers', 'Checkout Optimization'],
    metrics: [
      { label: 'Conversion Lift', value: '+62%' },
      { label: 'Bounce Rate', value: '-34%' },
      { label: 'Revenue Recovered', value: '$2.4M' },
    ],
    color: '#3B82F6',
    icon: '◫',
    status: 'Production',
  },
]

export default function AIProjects() {
  const { openModal } = useQuoteModal()

  return (
    <>
      <Seo
        title="AI Projects — Proprietary Marketing Intelligence Systems"
        description="Explore the 6 proprietary AI systems powering our marketing campaigns. From growth engines to content factories — built for scale, speed, and results."
        canonicalPath="/ai-projects"
      />

      {/* ── HERO ──────────────────────────────────── */}
      <section className="pt-36 pb-20 px-6 lg:px-12 bg-ink relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[50vw] h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 60% at 0% 40%, rgba(59,130,246,0.06) 0%, transparent 65%)' }}
        />
        <div className="absolute top-0 right-0 w-[30vw] h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 50% at 100% 60%, rgba(239,68,68,0.04) 0%, transparent 65%)' }}
        />
        <div className="relative max-w-screen-xl mx-auto">
          <p className="eyebrow mb-5 reveal">Proprietary AI systems</p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <h1 className="font-display font-light leading-none mb-6 reveal reveal-delay-1"
                style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
                The AI behind<br />
                <em className="text-[#D4A853] italic">your growth</em>
              </h1>
              <p className="text-smoke-dim max-w-lg leading-relaxed reveal reveal-delay-2" style={{ fontSize: '0.95rem' }}>
                Six proprietary AI systems, built in-house, powering every campaign we run.
                Not off-the-shelf tools — custom intelligence designed for one thing: making your business grow faster.
              </p>
            </div>
            <div className="flex flex-col gap-2 reveal reveal-delay-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono-custom text-[0.65rem] tracking-widest uppercase text-smoke-faint">All systems operational</span>
              </div>
              <span className="font-mono-custom text-[0.55rem] tracking-wider text-smoke-faint/40">6 AI systems · 200+ deployments · 24/7 learning</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECT CARDS ─────────────────────────── */}
      <section className="bg-ink py-24 px-6 lg:px-12">
        <div className="max-w-screen-xl mx-auto flex flex-col gap-6">
          {PROJECTS.map((project, i) => (
            <div
              key={project.id}
              className="bg-ink-2 border border-white/5 hover:border-white/10 transition-all duration-300 reveal"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="grid lg:grid-cols-[1fr_340px]">
                {/* Main content */}
                <div className="p-8 lg:p-10">
                  {/* Header row */}
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className="w-12 h-12 flex items-center justify-center flex-shrink-0 border"
                      style={{ borderColor: `${project.color}30`, background: `${project.color}08`, color: project.color, fontSize: '1.3rem' }}
                    >
                      {project.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="font-display font-light text-smoke leading-tight"
                          style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' }}>
                          {project.title}
                        </h2>
                        <span
                          className="flex-shrink-0 font-mono-custom text-[0.5rem] tracking-[0.14em] uppercase px-2 py-0.5"
                          style={{ color: '#22C55E', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}
                        >
                          {project.status}
                        </span>
                      </div>
                      <p className="font-mono-custom text-[0.7rem] tracking-wide" style={{ color: project.color }}>
                        {project.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-smoke-dim leading-relaxed mb-6" style={{ fontSize: '0.9rem' }}>
                    {project.desc}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map(tech => (
                      <span
                        key={tech}
                        className="font-mono-custom text-[0.6rem] tracking-wider uppercase px-3 py-1.5 border border-white/8 text-smoke-faint/70"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metrics sidebar */}
                <div className="border-t lg:border-t-0 lg:border-l border-white/5 flex flex-row lg:flex-col">
                  {project.metrics.map(({ label, value }, mi) => (
                    <div
                      key={label}
                      className={`flex-1 p-6 lg:p-8 flex flex-col justify-center ${mi < project.metrics.length - 1 ? 'border-r lg:border-r-0 lg:border-b border-white/5' : ''}`}
                    >
                      <div className="font-display font-light leading-none mb-1" style={{ fontSize: '2rem', color: project.color }}>
                        {value}
                      </div>
                      <div className="font-mono-custom text-[0.55rem] tracking-[0.14em] uppercase text-smoke-faint/60">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW THEY WORK TOGETHER ────────────────── */}
      <section className="bg-ink-2 py-24 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-screen-xl mx-auto">
          <p className="eyebrow mb-4 reveal">Integrated intelligence</p>
          <h2 className="font-display font-light leading-tight mb-10 reveal reveal-delay-1"
            style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
            Six systems,<br /><em className="text-[#D4A853] italic">one brain</em>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { n: '01', title: 'Shared data layer', desc: 'Every system reads from and writes to the same customer intelligence graph. What one system learns, all systems benefit from.' },
              { n: '02', title: 'Cross-system triggers', desc: 'When the Ad Optimizer finds a high-converting audience, the Content Factory creates targeted assets and the Personalization Engine adjusts messaging — automatically.' },
              { n: '03', title: 'Compound learning', desc: 'Each campaign makes every future campaign smarter. The Growth Engine compounds results across all six systems, creating an unfair advantage that grows over time.' },
              { n: '04', title: 'Real-time adaptation', desc: 'Market shifts, competitor moves, seasonal changes — the Intelligence system detects them and the entire stack adapts within hours, not weeks.' },
              { n: '05', title: 'Human strategy layer', desc: 'AI handles execution at scale. Your dedicated strategist handles the thinking — setting goals, interpreting insights, and making the decisions that require human judgment.' },
              { n: '06', title: 'Full transparency', desc: 'Every AI decision is logged and explainable. You see exactly what each system did, why it did it, and what result it produced. No black boxes.' },
            ].map(({ n, title, desc }, i) => (
              <div key={n} className="bg-ink p-8 border border-white/5 reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                <span className="font-mono-custom text-[0.65rem] text-ember/70">{n}</span>
                <h3 className="font-display font-light text-smoke text-xl mt-3 mb-3">{title}</h3>
                <p className="text-smoke-dim leading-relaxed" style={{ fontSize: '0.85rem' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="cta-gradient">
        <div className="px-6 lg:px-12 py-24 max-w-screen-xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <h2 className="font-display font-light leading-tight text-ink"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
              Ready to put AI<br /><em>to work for you?</em>
            </h2>
            <p className="text-ink/60 mt-3" style={{ fontSize: '0.95rem' }}>
              Free strategy call · See which systems fit your business · No commitment.
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex-shrink-0 font-mono-custom text-[0.7rem] tracking-[0.14em] uppercase px-8 py-4 cursor-pointer"
            style={{ background: '#09090B', color: '#FAFAF9', border: 'none' }}
          >
            Get your AI growth plan
          </button>
        </div>
      </section>
    </>
  )
}
