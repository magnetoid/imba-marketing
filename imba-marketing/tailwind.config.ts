import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Theme tokens are CSS variables (space-separated RGB channels, see
        // index.css) so the public site can flip between the dark and light
        // themes of the 2026 redesign while opacity modifiers (bg-ink/95) work.
        ink: {
          DEFAULT: 'rgb(var(--c-bg) / <alpha-value>)',
          2: 'rgb(var(--c-surface) / <alpha-value>)',
          3: 'rgb(var(--c-surface-2) / <alpha-value>)',
          4: 'rgb(var(--c-surface-2) / <alpha-value>)',
        },
        smoke: {
          DEFAULT: 'rgb(var(--c-fg) / <alpha-value>)',
          dim: 'rgb(var(--c-muted) / <alpha-value>)',
          faint: 'rgb(var(--c-faint) / <alpha-value>)',
        },
        // Lime brand accent. `brand` fills; `brand-text` is the accent used for
        // text, which darkens in the light theme to stay readable.
        brand: {
          DEFAULT: 'rgb(var(--c-accent) / <alpha-value>)',
          text: 'rgb(var(--c-accent-text) / <alpha-value>)',
          on: 'rgb(var(--c-on-accent) / <alpha-value>)',
        },
        line: 'rgb(var(--c-line-rgb) / var(--c-line-a))',
        // Legacy accents: still used by the admin screens.
        ember: {
          DEFAULT: '#EF4444',
          dim: '#991B1B',
          bright: '#F87171',
        },
        gold: {
          DEFAULT: '#D4A853',
          dim: '#92400E',
        },
        cyber: {
          DEFAULT: '#3B82F6',
          dim: '#1E3A5F',
          glow: 'rgba(59,130,246,0.15)',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        sans: ['Instrument Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem', letterSpacing: '0.06em' }],
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'gradient': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
