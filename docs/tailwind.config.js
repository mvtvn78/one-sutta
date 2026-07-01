import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = dirname(fileURLToPath(import.meta.url))

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    join(root, '.vitepress/theme/**/*.{vue,js,ts}'),
    join(root, 'index.md'),
    join(root, 'kinh/**/*.md'),
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Libre Caslon Text"', 'serif'],
        body: ['"Source Serif 4"', 'serif'],
        label: ['"Hanken Grotesk"', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['3rem', { lineHeight: '1.18', fontWeight: '400' }],
        'headline-lg': ['2rem', { lineHeight: '1.3', fontWeight: '400' }],
        'headline-lg-m': ['1.75rem', { lineHeight: '1.3', fontWeight: '400' }],
        'headline-md': ['1.5rem', { lineHeight: '1.4', fontWeight: '400' }],
        'body-lg': ['1.25rem', { lineHeight: '1.75', fontWeight: '400' }],
        'body-md': ['1.125rem', { lineHeight: '1.65', fontWeight: '400' }],
        'label-md': ['0.875rem', { lineHeight: '1.3', letterSpacing: '0.05em', fontWeight: '500' }],
        'label-sm': ['0.75rem', { lineHeight: '1.3', letterSpacing: '0.08em', fontWeight: '500' }],
      },
      spacing: {
        gutter: '1.5rem',
        'section-gap': '4rem',
        'page-margin': '2rem',
      },
      maxWidth: {
        reading: '46rem',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      colors: {
        bg: 'var(--bg)',
        'bg-hero': 'var(--bg-hero)',
        s1: 'var(--s-lowest)',
        s2: 'var(--s-low)',
        s3: 'var(--s)',
        s4: 'var(--s-high)',
        s5: 'var(--s-highest)',
        sb: 'var(--s-bright)',
        on: 'var(--on)',
        onv: 'var(--on-var)',
        primary: 'var(--primary)',
        onp: 'var(--on-primary)',
        pc: 'var(--primary-container)',
        onpc: 'var(--on-primary-container)',
        ov: 'var(--outline-var)',
        o: 'var(--outline)',
      },
    },
  },
  plugins: [],
}
