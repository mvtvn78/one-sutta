import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Nityata Sutta',
  description: 'Tài liệu và ghi chú cho dự án Nityata Sutta.',
  base: '/nityata-sutta/',
  themeConfig: {
    nav: [
      { text: 'Trang chủ', link: '/' },
      { text: 'Bắt đầu', link: '/guide/' }
    ],
    sidebar: [
      {
        text: 'Hướng dẫn',
        items: [
          { text: 'Bắt đầu', link: '/guide/' },
          { text: 'Giới thiệu', link: '/' }
        ]
      }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/' }]
  }
})
