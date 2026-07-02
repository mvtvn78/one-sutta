import { ref } from 'vue'

export type NotesPanelContext = {
  bookId: string
  transId: string
  suttaId?: string
  suttaCode?: string
  suttaTitle?: string
}

const isOpen = ref(false)
const context = ref<NotesPanelContext | null>(null)

export function useNotesPanel() {
  function open(ctx: NotesPanelContext) {
    context.value = ctx
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  return { isOpen, context, open, close }
}
