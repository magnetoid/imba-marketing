import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, ImageOff, Maximize2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { MediaFile } from '@/lib/supabase'
import Seo from '@/components/Seo'

// Image Grid Component with loading states
const GalleryImage = ({ img, index, onClick }: { img: MediaFile, index: number, onClick: (i: number) => void }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  return (
    <div
      className="mb-3 sm:mb-4 break-inside-avoid cursor-pointer group relative overflow-hidden rounded-md bg-ink-light/20 reveal"
      style={{ transitionDelay: `${Math.min(index * 30, 300)}ms` }}
      onClick={() => onClick(index)}
      role="button"
      tabIndex={0}
      aria-label={`View image ${index + 1}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick(index)}
    >
      {/* Loading Skeleton */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-smoke/5 animate-pulse min-h-[250px]">
          <Loader2 className="w-5 h-5 text-smoke/40 animate-spin" />
        </div>
      )}
      
      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-smoke/5 min-h-[250px]">
          <ImageOff className="w-6 h-6 text-smoke/40 mb-2" />
          <span className="text-xs text-smoke/50 font-mono-custom">Failed to load</span>
        </div>
      )}

      {/* Optimized Image (Using loading="lazy" for initial page load speed) */}
      <img
        src={img.url}
        alt={img.alt || img.caption || `Gallery image ${index + 1}`}
        className={`w-full block transition-all duration-700 ${
          isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100 group-hover:scale-[1.03]'
        }`}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
      />
      
      {/* Hover Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {img.caption && (
        <div className="absolute bottom-0 left-0 right-0 px-4 py-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <p className="font-mono-custom text-[0.7rem] tracking-wide text-smoke/90 line-clamp-2">{img.caption}</p>
        </div>
      )}
      
      {/* Expand icon */}
      <div className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
        <Maximize2 className="w-4 h-4 text-smoke/90" />
      </div>
    </div>
  )
}

export default function Gallery() {
  const [images, setImages] = useState<MediaFile[]>([])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [direction, setDirection] = useState(0)
  const [lightboxLoading, setLightboxLoading] = useState(true)
  
  const lightboxRef = useRef<HTMLDivElement>(null)

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

  const openLightbox = (i: number) => {
    setLightboxIndex(i)
    setDirection(0)
    setLightboxLoading(true)
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
  }

  const goNext = useCallback(() => {
    if (lightboxIndex === null) return
    setDirection(1)
    setLightboxLoading(true)
    setLightboxIndex(lightboxIndex < images.length - 1 ? lightboxIndex + 1 : 0)
  }, [lightboxIndex, images.length])

  const goPrev = useCallback(() => {
    if (lightboxIndex === null) return
    setDirection(-1)
    setLightboxLoading(true)
    setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : images.length - 1)
  }, [lightboxIndex, images.length])

  // Keyboard navigation & Focus trapping
  useEffect(() => {
    if (lightboxIndex === null) return
    
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)
    
    // Focus management for accessibility
    setTimeout(() => {
      lightboxRef.current?.focus()
    }, 100)
    
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [lightboxIndex, goNext, goPrev])

  const current = lightboxIndex !== null ? images[lightboxIndex] : null

  // Swipe handlers for mobile
  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity
  
  const handleDragEnd = (_: any, { offset, velocity }: any) => {
    const swipe = swipePower(offset.x, velocity.x)
    if (swipe < -swipeConfidenceThreshold) {
      goNext()
    } else if (swipe > swipeConfidenceThreshold) {
      goPrev()
    }
  }

  // Animation variants for slider
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

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

      {/* ── RESPONSIVE MASONRY GALLERY ───────────────────────── */}
      <section className="bg-ink px-3 sm:px-4 lg:px-6 py-6 min-h-screen">
        {images.length === 0 ? (
          <div className="max-w-screen-xl mx-auto text-center py-24">
            <p className="text-smoke-faint font-mono-custom text-sm">Gallery coming soon.</p>
          </div>
        ) : (
          <div className="max-w-[1800px] mx-auto columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4">
            {images.map((img, i) => (
              <GalleryImage key={img.id} img={img} index={i} onClick={openLightbox} />
            ))}
          </div>
        )}
      </section>

      {/* ── FULLSCREEN LIGHTBOX WITH KEN BURNS ───────────────────── */}
      <AnimatePresence initial={false} custom={direction}>
        {lightboxIndex !== null && current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] bg-black/98 flex items-center justify-center outline-none"
            onClick={closeLightbox}
            ref={lightboxRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Image Gallery Fullscreen"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={lightboxIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={handleDragEnd}
                  className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Ken Burns Image Container */}
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    {lightboxLoading && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <Loader2 className="w-8 h-8 text-smoke/50 animate-spin" />
                      </div>
                    )}
                    
                    {/* Ken Burns Effect applied to the active image */}
                    <motion.img
                      src={current.url}
                      alt={current.alt || current.caption || `Image ${lightboxIndex + 1}`}
                      className={`max-w-[100vw] max-h-[100vh] sm:max-w-[90vw] sm:max-h-[85vh] object-contain select-none transition-opacity duration-700 ${lightboxLoading ? 'opacity-0' : 'opacity-100'}`}
                      initial={{ scale: 1 }}
                      animate={{ 
                        scale: [1, 1.05, 1],
                        x: ["0%", "1%", "-1%", "0%"],
                        y: ["0%", "-1%", "1%", "0%"]
                      }}
                      transition={{ 
                        duration: 25, 
                        ease: "linear", 
                        repeat: Infinity 
                      }}
                      onLoad={() => setLightboxLoading(false)}
                      draggable={false}
                    />
                  </div>
                  
                  {/* Caption */}
                  {current.caption && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="absolute bottom-8 left-0 right-0 px-6 pointer-events-none z-20"
                    >
                      <div className="max-w-2xl mx-auto bg-black/60 backdrop-blur-md p-4 rounded-lg text-center border border-smoke/10 pointer-events-auto">
                        <p className="font-mono-custom text-[0.75rem] tracking-wide text-smoke/90">
                          {current.caption}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <button
              className="absolute top-4 sm:top-6 right-4 sm:right-6 w-12 h-12 flex items-center justify-center bg-black/20 hover:bg-black/50 backdrop-blur-sm rounded-full text-smoke/60 hover:text-smoke transition-all z-30"
              onClick={closeLightbox}
              aria-label="Close gallery"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="absolute top-6 left-6 font-mono-custom text-[0.7rem] tracking-widest text-smoke-faint/60 z-30 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
              {lightboxIndex + 1} / {images.length}
            </div>

            {/* Navigation Arrows */}
            <button
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/20 hover:bg-black/50 backdrop-blur-sm rounded-full text-smoke/60 hover:text-smoke transition-all z-30 group"
              onClick={e => { e.stopPropagation(); goPrev() }}
              aria-label="Previous image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transform group-hover:-translate-x-1 transition-transform">
                <path d="M15 4l-8 8 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/20 hover:bg-black/50 backdrop-blur-sm rounded-full text-smoke/60 hover:text-smoke transition-all z-30 group"
              onClick={e => { e.stopPropagation(); goNext() }}
              aria-label="Next image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="transform group-hover:translate-x-1 transition-transform">
                <path d="M9 4l8 8-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
