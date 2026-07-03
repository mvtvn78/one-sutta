import { defineConfig } from 'vitepress'

const siteUrl = process.env.SITE_URL || 'https://mvtvn78.github.io'

const antiFlashScript = `
(function(){
  try {
    var t = localStorage.getItem('nityata-theme');
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.setAttribute('data-theme', 'dark');
    var steps = ['93.75%','100%','115%','130%'];
    var f = parseInt(localStorage.getItem('nityata-font-step') || '1', 10);
    if (f >= 0 && f < steps.length) document.documentElement.style.fontSize = steps[f];
  } catch(e) {}
})();
`.trim()

export default defineConfig({
  title: 'Kinh Nikaya',
  description: 'Thư viện kinh điển Nam truyền — Ngũ Bộ Kinh Nikaya',
  lang: 'vi-VN',
  base: '/one-sutta',
  lastUpdated: true,
  srcExclude: ['kinh/README.md'],
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&family=Hanken+Grotesk:wght@400;500;600;700&display=swap',
      },
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..500,0..1&display=swap',
      },
    ],
    ['script', {}, antiFlashScript],
  ],
  themeConfig: {
    nav: [],
    sidebar: false,
  },
  sitemap: {
    hostname: siteUrl,
    lastmodDateOnly: true,
    transformItems(items) {
      return items.map((item) => {
        const path = (item.url || '/').replace(/\/$/, '') || '/'
        if (path === '/' || path === '/index.html') {
          return { ...item, changefreq: 'weekly', priority: 1 }
        }
        const depth = path.replace(/^\//, '').split('/').filter(Boolean).length
        if (depth === 2) return { ...item, changefreq: 'monthly', priority: 0.9 }
        if (depth === 3) return { ...item, changefreq: 'monthly', priority: 0.8 }
        return { ...item, changefreq: 'yearly', priority: 0.7 }
      })
    },
  },
})
