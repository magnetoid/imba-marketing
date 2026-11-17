import { useCallback, useEffect, useState } from 'react'

/*
 * Light/dark theme for the public site (2026 redesign).
 *
 * The theme lives on <html data-theme="light"> so the CSS variables in
 * index.css flip for everything, including portalled modals. Only the public
 * layout applies it; on unmount (navigating to /admin) it is removed, so the
 * admin screens always render in the dark theme they were built for.
 * index.html applies the saved choice before first paint to avoid a flash.
 */

export type Theme = 'dark' | 'light'
const KEY = 'imba-theme'

function readSaved(): Theme {
  try {
    return localStorage.getItem(KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

function apply(theme: Theme) {
  const root = document.documentElement
  if (theme === 'light') root.dataset.theme = 'light'
  else delete root.dataset.theme
  const meta = document.querySelector('meta[name="theme-color"]')
  meta?.setAttribute('content', theme === 'light' ? '#F5F4EF' : '#09090B')
}

/** Applies the saved theme while the public layout is mounted. */
export function usePublicTheme() {
  useEffect(() => {
    apply(readSaved())
    return () => apply('dark')
  }, [])
}

/** Current theme plus a toggle that persists the visitor's choice. */
export function useThemeToggle() {
  const [theme, setTheme] = useState<Theme>(readSaved)
  const toggle = useCallback(() => {
    setTheme(prev => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      try { localStorage.setItem(KEY, next) } catch { /* private mode */ }
      apply(next)
      return next
    })
  }, [])
  return { theme, toggle }
}
