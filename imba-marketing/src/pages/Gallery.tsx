import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { MediaFile } from '@/lib/supabase'
import Seo from '@/components/Seo'

export default function Gallery() {
  const [images, setImages] = useState<MediaFile[]>([])
  const [lightbox, setLightbox] = useState<number | null>(null)

  useEffect(() => {
    supabase
      .from('media_files')
      .select('*')
      .like('filename', 'gallery/%')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data?.length) setImages(data)
      })
  }, [])

  const openLightbox = (i: number) => setLightbox(i)
  const closeLightbox = () => setLightbox(null)

  const goNext = useCallback(() => {
    if (lightbox === null) return
    setLightbox(lightbox < images.length - 1 ? lightbox + 1 : 0)
  }, [lightbox, images.length])

  const goPrev = useCallback(() => {
    if (lightbox === null) return
    setLightbox(lightbox > 0 ? lightbox - 1 : images.length - 1)
  }, [lightbox, images.length])

  /* Keyboard navigation */
  useEffect(() => {
    if (lightbox === null) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [lightbox, goNext, goPrev])

  const current = lightbox !== null ? images[lightbox] : null

  return (
    <>
      <Seo
        title="Gallery — Imba Marketing"
        description="A look at our work, our team, and the brands we've helped grow with AI-powered marketing."
        canonicalPath="/gallery"
      />

      {/* ── HERO ──────────────────────────────────── */}
      <section className="pt-36 pb-20 px-6 lg:px-12 bg-ink relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40vw] h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 70% at 100% 30%, rgba(239,68,68,0.06) 0%, transparent 65%)' }}
        />
        <div className="relative max-w-screen-xl mx-auto">
          <p className="eyebrow mb-5 reveal">Behind the scenes</p>
          <h1 className="font-display font-light leading-none reveal reveal-delay-1"
            style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
            Our work,<br />
            <em className="text-[#D4A853] italic">up close</em>
          </h1>
        </div>
      </section>

      {/* ── MASONRY GALLERY ───────────────────────── */}
      <section className="bg-ink px-3 sm:px-4 lg:px-6 py-6">
        {images.length === 0 ? (
          <div className="max-w-screen-xl mx-auto text-center py-24">
            <p className="text-smoke-faint font-mono-custom text-sm">Gallery coming soon.</p>
          </div>
        ) : (
          <div className="max-w-[1800px] mx-auto columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4">
            {images.map((img, i) => (
              <div
                key={img.id}
                className="mb-3 sm:mb-4 break-inside-avoid cursor-pointer group relative overflow-hidden reveal"
                style={{ transitionDelay: `${Math.min(i * 30, 300)}ms` }}
                onClick={() => openLightbox(i)}
              >
                <img
                  src={img.url}
                  alt={img.alt || img.caption || ''}
                  className="w-full block transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="font-mono-custom text-[0.65rem] tracking-wide text-smoke/90">{img.caption}</p>
                  </div>
                )}
                {/* Expand icon */}
                <div className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-smoke/80">
                    <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── FULLSCREEN LIGHTBOX ───────────────────── */}
      {lightbox !== null && current && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-smoke/60 hover:text-smoke transition-colors z-10"
            onClick={closeLightbox}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-6 left-6 font-mono-custom text-[0.65rem] tracking-widest text-smoke-faint/50 z-10">
            {lightbox + 1} / {images.length}
          </div>

          {/* Prev */}
          <button
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-smoke/40 hover:text-smoke transition-colors z-10"
            onClick={e => { e.stopPropagation(); goPrev() }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 4l-8 8 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Next */}
          <button
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-smoke/40 hover:text-smoke transition-colors z-10"
            onClick={e => { e.stopPropagation(); goNext() }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 4l8 8-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Image */}
          <div
            className="max-w-[90vw] max-h-[85vh] flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={current.url}
              alt={current.alt || ''}
              className="max-w-full max-h-[80vh] object-contain select-none"
              draggable={false}
            />
            {current.caption && (
              <p className="mt-4 font-mono-custom text-[0.7rem] tracking-wide text-smoke-faint/70 text-center max-w-lg">
                {current.caption}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── CTA BAND ──────────────────────────────── */}
      <section className="cta-gradient">
        <div className="px-6 lg:px-12 py-24 max-w-screen-xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <h2 className="font-display font-light leading-tight text-ink"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
              Want to see your brand<br /><em>in our gallery?</em>
            </h2>
            <p className="text-ink/60 mt-3" style={{ fontSize: '0.95rem' }}>
              Let's create something worth showing off.
            </p>
          </div>
          <a
            href="/contact"
            className="flex-shrink-0 font-mono-custom text-[0.7rem] tracking-[0.14em] uppercase px-8 py-4"
            style={{ background: '#09090B', color: '#FAFAF9' }}
          >
            Start a project
          </a>
        </div>
      </section>
    </>
  )
}
