<script setup lang="ts">
import { computed } from 'vue'
import { useBooks } from '../composables/useBooks'
import { useSearchPalette } from '../composables/useSearchPalette'
import { useLink } from '../composables/useLink'
import MaterialIcon from './MaterialIcon.vue'

const props = defineProps<{
  bookId: string
  transId: string
  suttaId?: string
}>()

const { findBook, findTranslation, findSutta, getPrevNext } = useBooks()
const { open: openSearch } = useSearchPalette()
const link = useLink()

defineEmits<{ 'open-font': []; noop: [msg: string] }>()

const book = computed(() => findBook(props.bookId))
const trans = computed(() => (book.value ? findTranslation(book.value, props.transId) : undefined))
const sutta = computed(() =>
  props.suttaId && book.value ? findSutta(book.value, props.transId, props.suttaId) : undefined
)

const progress = computed(() => {
  if (!book.value || !props.suttaId) return 0
  const { index, total } = getPrevNext(book.value, props.transId, props.suttaId)
  if (index < 0 || total === 0) return 0
  return Math.round(((index + 1) / total) * 100)
})

const tocUrl = computed(() => `/kinh/${props.bookId}/${props.transId}/`)
</script>

<template>
  <aside
    v-if="book && trans"
    class="hidden lg:flex flex-col w-64 shrink-0 sticky top-16 h-[calc(100vh-4rem)] p-5 gap-6 border-l border-ov bg-s2/60"
  >
    <div class="space-y-1">
      <p class="font-label text-label-sm text-primary opacity-60 uppercase tracking-widest">Đang đọc</p>
      <h4 class="font-display text-headline-md text-primary">{{ book.tagline }}</h4>
      <p class="font-label text-label-md text-onv opacity-80">{{ trans.label }}</p>
    </div>
    <nav class="flex flex-col gap-1.5">
      <a
        :href="link(tocUrl)"
        class="flex items-center gap-3 p-3 rounded-lg font-label text-label-md transition-all"
        :class="sutta ? 'text-onv hover:bg-s4 hover:text-primary' : 'text-primary bg-pc/20'"
      >
        <MaterialIcon name="list_alt" class="text-[20px]" /> Mục lục
      </a>
      <button
        type="button"
        class="flex items-center gap-3 p-3 rounded-lg text-onv hover:bg-s4 hover:text-primary transition-all font-label text-label-md text-left"
        @click="$emit('noop', 'Tính năng Ghi chú sẽ sớm ra mắt.')"
      >
        <MaterialIcon name="edit_note" class="text-[20px]" /> Ghi chú
      </button>
      <button
        type="button"
        class="flex items-center gap-3 p-3 rounded-lg text-onv hover:bg-s4 hover:text-primary transition-all font-label text-label-md text-left"
        @click="openSearch"
      >
        <MaterialIcon name="search" class="text-[20px]" /> Tìm nhanh
      </button>
      <button
        type="button"
        class="flex items-center gap-3 p-3 rounded-lg text-onv hover:bg-s4 hover:text-primary transition-all font-label text-label-md text-left"
        @click="$emit('open-font')"
      >
        <MaterialIcon name="settings" class="text-[20px]" /> Cài đặt
      </button>
    </nav>
    <div v-if="sutta" class="mt-auto pt-5 border-t border-ov">
      <p class="text-[11px] uppercase tracking-widest text-onv font-label mb-2">Tiến độ · {{ sutta.code }}</p>
      <div class="h-1.5 w-full bg-s4 rounded-full overflow-hidden">
        <div class="h-full bg-primary transition-all" :style="{ width: `${progress}%` }" />
      </div>
      <p class="text-[12px] mt-2 text-primary font-label">{{ progress }}% hoàn thành</p>
    </div>
    <div v-else class="mt-auto pt-5 border-t border-ov">
      <p class="text-[12px] font-label text-onv leading-relaxed opacity-80">
        Chọn một bài kinh trong mục lục để bắt đầu đọc.
      </p>
    </div>
  </aside>
</template>
