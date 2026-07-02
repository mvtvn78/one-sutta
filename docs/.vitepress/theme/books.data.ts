import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createContentLoader } from 'vitepress'
import type { Book, BookMeta, BooksData, SuttaItem, TocGroup, Translation } from './types'

const themeDir = dirname(fileURLToPath(import.meta.url))
const kinhDir = join(themeDir, '../../kinh')

function loadBookMetas(): Map<string, BookMeta> {
  const map = new Map<string, BookMeta>()
  if (!existsSync(kinhDir)) return map
  for (const entry of readdirSync(kinhDir)) {
    const bookDir = join(kinhDir, entry)
    if (!statSync(bookDir).isDirectory()) continue
    const metaPath = join(bookDir, 'meta.json')
    if (!existsSync(metaPath)) continue
    const meta = JSON.parse(readFileSync(metaPath, 'utf-8')) as BookMeta
    map.set(entry, { ...meta, id: meta.id || entry })
  }
  return map
}

function normalizeSuttaSlug(slug: string): string {
  return slug.replace(/\.html$/, '')
}

function parseSuttaPath(url: string): {
  bookId: string
  transId: string
  suttaId: string
} | null {
  const normalized = url.replace(/\/$/, '').replace(/\.html$/, '')
  const match = normalized.match(/\/kinh\/([^/]+)\/([^/]+)\/([^/]+)$/)
  if (!match) return null
  if (match[3] === 'index') return null
  return {
    bookId: match[1],
    transId: match[2],
    suttaId: normalizeSuttaSlug(match[3]),
  }
}

function hasBodyContent(src: string | undefined): boolean {
  if (!src) return false
  const body = src.replace(/^---[\s\S]*?---\s*/, '').trim()
  return body.length > 0
}

export default createContentLoader('kinh/**/*.md', {
  includeSrc: true,
  transform(rawData): BooksData {
    const bookMetas = loadBookMetas()
    const suttasByBookTrans = new Map<string, SuttaItem[]>()

    for (const page of rawData) {
      const url = page.url
      if (url.endsWith('/index') || url.match(/\/kinh\/[^/]+\/index$/)) continue

      const parsed = parseSuttaPath(url)
      if (!parsed) continue

      const { bookId, transId, suttaId } = parsed
      const fm = page.frontmatter as Record<string, unknown>
      const draft = Boolean(fm.draft)
      const hasContent = !draft && hasBodyContent(page.src)

      const item: SuttaItem = {
        id: suttaId,
        code: String(fm.code || ''),
        title: String(fm.title || ''),
        pali: String(fm.pali || ''),
        group: String(fm.group || 'Khác'),
        description: String(fm.description || ''),
        translation: String(fm.translation || transId),
        book: String(fm.book || bookId),
        url: page.url,
        draft,
        hasContent,
      }

      const key = `${bookId}::${transId}`
      if (!suttasByBookTrans.has(key)) suttasByBookTrans.set(key, [])
      suttasByBookTrans.get(key)!.push(item)
    }

    const books: Book[] = []

    for (const [bookId, meta] of bookMetas) {
      const translations: Translation[] = meta.translations.map((t) => ({
        ...t,
        url: `/kinh/${bookId}/${t.id}/`,
      }))

      const groupOrder: string[] = []
      const groupMap = new Map<string, SuttaItem[]>()

      for (const t of meta.translations) {
        const key = `${bookId}::${t.id}`
        const items = suttasByBookTrans.get(key) || []
        for (const s of items) {
          if (!groupMap.has(s.group)) {
            groupMap.set(s.group, [])
            groupOrder.push(s.group)
          }
          const existing = groupMap.get(s.group)!
          if (!existing.some((e) => e.id === s.id)) {
            existing.push(s)
          }
        }
      }

      const toc: TocGroup[] = groupOrder.map((group) => ({
        group,
        items: groupMap.get(group) || [],
      }))

      books.push({
        ...meta,
        id: bookId,
        url: `/kinh/${bookId}/`,
        translations,
        toc,
      })
    }

    books.sort((a, b) => a.title.localeCompare(b.title, 'vi'))

    return { books }
  },
})

export { parseSuttaPath }
