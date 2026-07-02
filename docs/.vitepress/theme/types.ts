export interface TranslationMeta {
  id: string
  label: string
  lang: 'vi' | 'en'
  desc: string
}

export interface BookMeta {
  id: string
  title: string
  pali: string
  tagline: string
  hue: number
  description: string
  translations: TranslationMeta[]
}

export interface SuttaItem {
  id: string
  code: string
  title: string
  pali: string
  group: string
  description: string
  translation: string
  book: string
  url: string
  draft: boolean
  hasContent: boolean
}

export interface TocGroup {
  group: string
  items: SuttaItem[]
}

export interface Translation extends TranslationMeta {
  url: string
}

export interface Book extends BookMeta {
  url: string
  toc: TocGroup[]
  translations: Translation[]
}

export interface BooksData {
  books: Book[]
}

export interface BreadcrumbItem {
  label: string
  path?: string
  /** Full text for tooltip when label is truncated */
  title?: string
}

export interface Quote {
  text: string
  cite: string
}

export const QUOTES: Quote[] = [
  {
    text: 'Và này các tỷ-kheo, thế nào là Đời Sống Thiện? Ở đây, này các tỷ-kheo, vị đệ tử bậc thánh sau khi từ bỏ đời sống sai trái, nuôi sống bản thân bằng Đời Sống Thiện. Này các tỷ-kheo, đây gọi là Đời Sống Thiện.',
    cite: '4.5.4 — Thế Nào Là Thánh Đế Về Con Đường',
  },
  {
    text: 'Này các Tỷ-kheo, hãy tự mình là ngọn đèn cho chính mình, hãy tự mình nương tựa nơi chính mình, chớ nương tựa một nơi nào khác.',
    cite: 'Kinh Đại Bát Niết-bàn',
  },
  {
    text: 'Ý dẫn đầu các pháp, ý làm chủ, ý tạo tác. Nếu với ý ô nhiễm, nói năng hay hành động, khổ não sẽ theo ta, như xe theo chân vật kéo xe.',
    cite: 'Kinh Pháp Cú, kệ 1',
  },
]
