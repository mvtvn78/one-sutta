import Dexie, { type EntityTable } from 'dexie'

export interface SuttaNote {
  id?: number
  key: string
  bookId: string
  transId: string
  suttaId: string
  suttaCode: string
  suttaTitle: string
  content: string
  createdAt: number
  updatedAt: number
}

export interface SuttaBookmark {
  id?: number
  key: string
  bookId: string
  transId: string
  suttaId: string
  suttaCode: string
  suttaTitle: string
  bookTagline: string
  transLabel: string
  url: string
  createdAt: number
}

export function itemKey(bookId: string, transId: string, suttaId: string): string {
  return `${bookId}::${transId}::${suttaId}`
}

/** @deprecated use itemKey */
export const noteKey = itemKey

class UserDatabase extends Dexie {
  notes!: EntityTable<SuttaNote, 'id'>
  bookmarks!: EntityTable<SuttaBookmark, 'id'>

  constructor() {
    super('nityata-sutta-notes')
    this.version(1).stores({
      notes: '++id, &key, bookId, transId, [bookId+transId], updatedAt',
    })
    this.version(2).stores({
      notes: '++id, &key, bookId, transId, [bookId+transId], updatedAt',
      bookmarks: '++id, &key, bookId, transId, createdAt',
    })
  }
}

let db: UserDatabase | null = null

export function getUserDb(): UserDatabase {
  if (typeof indexedDB === 'undefined') {
    throw new Error('IndexedDB is not available')
  }
  if (!db) db = new UserDatabase()
  return db
}

/** @deprecated use getUserDb */
export const getNotesDb = getUserDb
