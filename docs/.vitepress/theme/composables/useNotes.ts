import { getNotesDb, noteKey, type SuttaNote } from '../lib/notesDb'

export type NoteContext = {
  bookId: string
  transId: string
  suttaId: string
  suttaCode?: string
  suttaTitle?: string
}

export function useNotes() {
  function db() {
    return getNotesDb()
  }

  async function getNote(bookId: string, transId: string, suttaId: string): Promise<SuttaNote | undefined> {
    return db().notes.get({ key: noteKey(bookId, transId, suttaId) })
  }

  async function saveNote(ctx: NoteContext, content: string): Promise<SuttaNote> {
    const key = noteKey(ctx.bookId, ctx.transId, ctx.suttaId)
    const trimmed = content.trim()
    const now = Date.now()
    const existing = await db().notes.get({ key })

    if (!trimmed) {
      if (existing?.id != null) await db().notes.delete(existing.id)
      return {
        key,
        bookId: ctx.bookId,
        transId: ctx.transId,
        suttaId: ctx.suttaId,
        suttaCode: ctx.suttaCode || '',
        suttaTitle: ctx.suttaTitle || '',
        content: '',
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      }
    }

    if (existing?.id != null) {
      await db().notes.update(existing.id, {
        content: trimmed,
        suttaCode: ctx.suttaCode || existing.suttaCode,
        suttaTitle: ctx.suttaTitle || existing.suttaTitle,
        updatedAt: now,
      })
      return { ...existing, content: trimmed, updatedAt: now }
    }

    const note: SuttaNote = {
      key,
      bookId: ctx.bookId,
      transId: ctx.transId,
      suttaId: ctx.suttaId,
      suttaCode: ctx.suttaCode || '',
      suttaTitle: ctx.suttaTitle || '',
      content: trimmed,
      createdAt: now,
      updatedAt: now,
    }
    const id = await db().notes.add(note)
    return { ...note, id }
  }

  async function deleteNote(bookId: string, transId: string, suttaId: string): Promise<void> {
    const key = noteKey(bookId, transId, suttaId)
    await db().notes.where('key').equals(key).delete()
  }

  async function listNotesForTranslation(bookId: string, transId: string): Promise<SuttaNote[]> {
    const notes = await db()
      .notes.where('[bookId+transId]')
      .equals([bookId, transId])
      .toArray()
    return notes.sort((a, b) => b.updatedAt - a.updatedAt)
  }

  async function countNotesForTranslation(bookId: string, transId: string): Promise<number> {
    return db()
      .notes.where('[bookId+transId]')
      .equals([bookId, transId])
      .count()
  }

  async function listAllNotes(): Promise<SuttaNote[]> {
    const notes = await db().notes.toArray()
    return notes.sort((a, b) => b.updatedAt - a.updatedAt)
  }

  return {
    getNote,
    saveNote,
    deleteNote,
    listNotesForTranslation,
    listAllNotes,
    countNotesForTranslation,
  }
}
