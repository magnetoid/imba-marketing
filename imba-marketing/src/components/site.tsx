import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

/*
 * Small building blocks shared by the redesigned public pages (2026), so the
 * page hero, the lime CTA band and the bordered grids look identical
 * everywhere.
 */

export function PageHero({ kicker, title, lead, children }: {
  kicker: string
  title: ReactNode
  lead?: ReactNode
  children?: ReactNode
}) {
  return (
    <section className="wrap pt-[clamp(48px,7vw,96px)] pb-[clamp(40px,5vw,64px)]">
      <div className="kicker mb-6">{kicker}</div>
      <h1 className="h-page m-0 mb-7 max-w-[1000px]">{title}</h1>
      {(lead || children) && (
        <div className="flex flex-wrap gap-x-14 gap-y-6 items-end justify-between">
          {lead && <p className="lead m-0 max-w-[680px]">{lead}</p>}
          {children}
        </div>
      )}
    </section>
  )
}

export function CtaBand({
  title = 'Tell us what you need. Get a plan and a quote.',
  sub,
  to = '/contact',
  label = 'Send an inquiry →',
}: { title?: ReactNode; sub?: ReactNode; to?: string; label?: string }) {
  return (
    <section className="bg-brand text-brand-on">
      <div className="wrap py-[clamp(48px,7vw,88px)] flex flex-wrap gap-x-12 gap-y-7 items-center justify-between">
        <div className="max-w-[760px]">
          <h2 className="font-display font-bold m-0 text-[clamp(32px,4.8vw,68px)] leading-none tracking-[-.04em] text-brand-on [text-wrap:balance]">
            {title}
          </h2>
          {sub && <p className="mt-4 text-[17px] text-brand-on/75">{sub}</p>}
        </div>
        {/^(mailto:|https?:)/.test(to)
          ? <a href={to} className="btn btn-dark btn-lg !text-lg !px-8 !py-5">{label}</a>
          : <Link to={to} className="btn btn-dark btn-lg !text-lg !px-8 !py-5">{label}</Link>}
      </div>
    </section>
  )
}

/** Bordered cell grid: outer border via the wrapper, cells draw right/bottom. */
export function CellGrid({ min = 320, children, className = '' }: { min?: number; children: ReactNode; className?: string }) {
  return (
    <div
      className={`grid border-t border-l border-line ${className}`}
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${min}px), 1fr))` }}
    >
      {children}
    </div>
  )
}

export function Cell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-7 border-r border-b border-line ${className}`}>{children}</div>
}

export function Arrow() {
  return <span aria-hidden="true" className="font-mono-custom text-brand-text">→</span>
}
