import { ref, onMounted, onUnmounted } from 'vue'
import { useBooks } from './useBooks'

const isOpen = ref(false)

export function useSearchPalette() {
  const { books } = useBooks()

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function toggle() {
    isOpen.value = !isOpen.value
  }

  function buildSearchIndex() {
    const index: {
      type: string
      label: string
      sub: string
      path: string
    }[] = []

    for (const book of books) {
      index.push({
        type: 'Bộ kinh',
        label: book.title,
        sub: book.pali,
        path: book.url,
      })
      const flat: typeof book.toc[0]['items'] = []
      for (const g of book.toc) flat.push(...g.items)
      const seen = new Set<string>()
      for (const s of flat) {
        if (seen.has(s.id)) continue
        seen.add(s.id)
        index.push({
          type: book.tagline,
          label: `${s.code} · ${s.title}`,
          sub: s.pali,
          path: s.url,
        })
      }
    }
    return index
  }

  function onKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault()
      toggle()
    }
    if (e.key === 'Escape' && isOpen.value) {
      close()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', onKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', onKeydown)
  })

  return {
    isOpen,
    open,
    close,
    toggle,
    buildSearchIndex,
  }
}
