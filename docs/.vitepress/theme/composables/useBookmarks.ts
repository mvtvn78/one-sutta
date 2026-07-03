import { getUserDb, itemKey, type SuttaBookmark } from '../lib/notesDb'

export type BookmarkContext = {
  bookId: string
  transId: string
  suttaId: string
  suttaCode?: string
  suttaTitle?: string
  bookTagline?: string
  transLabel?: string
  url?: string
}

export function useBookmarks() {
  function db() {
    return getUserDb()
  }

  function suttaUrl(bookId: string, transId: string, suttaId: string): string {
    return `/kinh/${bookId}/${transId}/${suttaId}.html`
  }

  async function isBookmarked(bookId: string, transId: string, suttaId: string): Promise<boolean> {
    const row = await db().bookmarks.get({ key: itemKey(bookId, transId, suttaId) })
    return Boolean(row)
  }

  async function addBookmark(ctx: BookmarkContext): Promise<SuttaBookmark> {
    const key = itemKey(ctx.bookId, ctx.transId, ctx.suttaId)
    const existing = await db().bookmarks.get({ key })
    if (existing) return existing

    const bookmark: SuttaBookmark = {
      key,
      bookId: ctx.bookId,
      transId: ctx.transId,
      suttaId: ctx.suttaId,
      suttaCode: ctx.suttaCode || '',
      suttaTitle: ctx.suttaTitle || '',
      bookTagline: ctx.bookTagline || '',
      transLabel: ctx.transLabel || '',
      url: ctx.url || suttaUrl(ctx.bookId, ctx.transId, ctx.suttaId),
      createdAt: Date.now(),
    }
    const id = await db().bookmarks.add(bookmark)
    return { ...bookmark, id }
  }

  async function removeBookmark(bookId: string, transId: string, suttaId: string): Promise<void> {
    await db().bookmarks.where('key').equals(itemKey(bookId, transId, suttaId)).delete()
  }

  async function toggleBookmark(ctx: BookmarkContext): Promise<boolean> {
    const key = itemKey(ctx.bookId, ctx.transId, ctx.suttaId)
    const existing = await db().bookmarks.get({ key })
    if (existing) {
      await db().bookmarks.delete(existing.id!)
      return false
    }
    await addBookmark(ctx)
    return true
  }

  async function listAllBookmarks(): Promise<SuttaBookmark[]> {
    const items = await db().bookmarks.toArray()
    return items.sort((a, b) => b.createdAt - a.createdAt)
  }

  return {
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    listAllBookmarks,
  }
}
