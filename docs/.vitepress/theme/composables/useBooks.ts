import { computed } from 'vue'
import { data } from '../books.data'
import type { Book, BreadcrumbItem, SuttaItem, Translation } from '../types'
import { useData, useRoute } from 'vitepress'

export type RouteInfo =
  | { type: 'home' }
  | { type: 'book'; bookId: string }
  | { type: 'toc'; bookId: string; transId: string }
  | { type: 'sutta'; bookId: string; transId: string; suttaId: string }
  | { type: 'unknown' }

export function useBooks() {
  const route = useRoute()
  const { site } = useData()
  const books = data.books

  function normalizeKinhPath(rawPath: string): string {
    let path = rawPath.replace(/\/$/, '') || '/'
    const base = site.value.base.replace(/\/$/, '')
    if (base && (path === base || path.startsWith(`${base}/`))) {
      path = path.slice(base.length) || '/'
    }
    path = path.replace(/\.html$/, '').replace(/\/index$/, '')
    if (!path.startsWith('/')) path = `/${path}`
    return path
  }

  function parseRoutePath(path: string): RouteInfo {
    if (path === '/' || path === '') return { type: 'home' }
    const bookMatch = path.match(/\/kinh\/([^/]+)$/)
    if (bookMatch) return { type: 'book', bookId: bookMatch[1] }
    const tocMatch = path.match(/\/kinh\/([^/]+)\/([^/]+)$/)
    if (tocMatch) return { type: 'toc', bookId: tocMatch[1], transId: tocMatch[2] }
    const suttaMatch = path.match(/\/kinh\/([^/]+)\/([^/]+)\/([^/]+)$/)
    if (suttaMatch) {
      return {
        type: 'sutta',
        bookId: suttaMatch[1],
        transId: suttaMatch[2],
        suttaId: suttaMatch[3],
      }
    }
    return { type: 'unknown' }
  }

  const routeInfo = computed(() => parseRoutePath(normalizeKinhPath(route.path)))

  function findBook(id: string): Book | undefined {
    return books.find((b) => b.id === id)
  }

  function findTranslation(book: Book, transId: string): Translation | undefined {
    return book.translations.find((t) => t.id === transId)
  }

  function flatToc(book: Book, transId: string): SuttaItem[] {
    const key = `${book.id}::${transId}`
    const items: SuttaItem[] = []
    for (const group of book.toc) {
      for (const item of group.items) {
        if (item.translation === transId || item.url.includes(`/${transId}/`)) {
          items.push(item)
        }
      }
    }
    const seen = new Set<string>()
    return items.filter((s) => {
      if (seen.has(s.id)) return false
      seen.add(s.id)
      return true
    })
  }

  function normalizeSuttaSlug(slug: string): string {
    return slug.replace(/\.html$/, '')
  }

  function findSutta(book: Book, transId: string, suttaId: string): SuttaItem | undefined {
    const id = normalizeSuttaSlug(suttaId)
    return flatToc(book, transId).find((s) => normalizeSuttaSlug(s.id) === id)
  }

  function getPrevNext(book: Book, transId: string, suttaId: string) {
    const list = flatToc(book, transId)
    const id = normalizeSuttaSlug(suttaId)
    const idx = list.findIndex((s) => normalizeSuttaSlug(s.id) === id)
    return {
      prev: idx > 0 ? list[idx - 1] : undefined,
      next: idx >= 0 && idx < list.length - 1 ? list[idx + 1] : undefined,
      index: idx,
      total: list.length,
    }
  }

  function parseRoute(): RouteInfo {
    return routeInfo.value
  }

  function buildBreadcrumb(
    bookId?: string,
    transId?: string,
    sutta?: { code?: string; title?: string }
  ): BreadcrumbItem[] {
    const items: BreadcrumbItem[] = [{ label: 'Kinh', path: '/' }]
    if (!bookId) return items
    const book = findBook(bookId)
    if (!book) return items
    items.push({
      label: book.tagline,
      path: transId || sutta ? `/kinh/${bookId}/` : undefined,
    })
    if (!transId) return items
    const trans = findTranslation(book, transId)
    if (!trans) return items
    items.push({
      label: trans.label,
      path: sutta ? `/kinh/${bookId}/${transId}/` : undefined,
    })
    if (sutta) {
      const code = sutta.code?.trim()
      const title = sutta.title?.trim()
      const label =
        code && title ? `${code}. ${title}` : code || title || ''
      if (label) items.push({ label, title: label })
    }
    return items
  }

  return {
    books,
    findBook,
    findTranslation,
    flatToc,
    findSutta,
    getPrevNext,
    routeInfo,
    parseRoute,
    buildBreadcrumb,
  }
}
