import { data } from '../books.data'
import type { Book, BreadcrumbItem, SuttaItem, Translation } from '../types'
import { useRoute } from 'vitepress'

export function useBooks() {
  const books = data.books

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

  function findSutta(book: Book, transId: string, suttaId: string): SuttaItem | undefined {
    return flatToc(book, transId).find((s) => s.id === suttaId)
  }

  function getPrevNext(book: Book, transId: string, suttaId: string) {
    const list = flatToc(book, transId)
    const idx = list.findIndex((s) => s.id === suttaId)
    return {
      prev: idx > 0 ? list[idx - 1] : undefined,
      next: idx >= 0 && idx < list.length - 1 ? list[idx + 1] : undefined,
      index: idx,
      total: list.length,
    }
  }

  function parseRoute() {
    const route = useRoute()
    const path = route.path.replace(/\/$/, '') || '/'
    if (path === '/' || path === '') return { type: 'home' as const }
    const bookMatch = path.match(/\/kinh\/([^/]+)$/)
    if (bookMatch) return { type: 'book' as const, bookId: bookMatch[1] }
    const tocMatch = path.match(/\/kinh\/([^/]+)\/([^/]+)$/)
    if (tocMatch) return { type: 'toc' as const, bookId: tocMatch[1], transId: tocMatch[2] }
    const suttaMatch = path.match(/\/kinh\/([^/]+)\/([^/]+)\/([^/]+)$/)
    if (suttaMatch) {
      return {
        type: 'sutta' as const,
        bookId: suttaMatch[1],
        transId: suttaMatch[2],
        suttaId: suttaMatch[3],
      }
    }
    return { type: 'unknown' as const }
  }

  function buildBreadcrumb(
    bookId?: string,
    transId?: string,
    suttaCode?: string
  ): BreadcrumbItem[] {
    const items: BreadcrumbItem[] = [{ label: 'Kinh', path: '/' }]
    if (!bookId) return items
    const book = findBook(bookId)
    if (!book) return items
    items.push({
      label: book.tagline,
      path: transId || suttaCode ? `/kinh/${bookId}/` : undefined,
    })
    if (!transId) return items
    const trans = findTranslation(book, transId)
    if (!trans) return items
    items.push({
      label: trans.label,
      path: suttaCode ? `/kinh/${bookId}/${transId}/` : undefined,
    })
    if (suttaCode) items.push({ label: suttaCode })
    return items
  }

  return {
    books,
    findBook,
    findTranslation,
    flatToc,
    findSutta,
    getPrevNext,
    parseRoute,
    buildBreadcrumb,
  }
}
