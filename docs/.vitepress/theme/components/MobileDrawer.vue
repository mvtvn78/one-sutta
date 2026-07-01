<script setup lang="ts">
import { useBooks } from '../composables/useBooks'
import { usePreferences } from '../composables/usePreferences'
import { useSearchPalette } from '../composables/useSearchPalette'
import { useLink } from '../composables/useLink'
import MaterialIcon from './MaterialIcon.vue'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const { books } = useBooks()
const { toggleTheme, themeIcon } = usePreferences()
const { open: openSearch } = useSearchPalette()
const link = useLink()

function close() {
  emit('close')
}

function onSearch() {
  close()
  openSearch()
}

function onTheme() {
  toggleTheme()
}
</script>

<template>
  <div v-show="open" class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-black/50" @click="close" />
    <div class="fade-in absolute right-0 top-0 h-full w-[82%] max-w-xs bg-s2 border-l border-ov p-5 flex flex-col gap-6 overflow-y-auto">
      <div class="flex items-center justify-between">
        <span class="font-display text-headline-md text-primary">Menu</span>
        <button type="button" class="p-2 rounded-lg hover:bg-s4" @click="close">
          <MaterialIcon name="close" />
        </button>
      </div>
      <nav class="flex flex-col gap-1 font-label text-label-md">
        <a :href="link('/')" class="p-3 rounded-lg hover:bg-s4 text-on" @click="close">Trang chủ</a>
        <p class="px-3 pt-3 pb-1 text-label-sm text-onv uppercase tracking-widest">Các bộ kinh</p>
        <a
          v-for="book in books"
          :key="book.id"
          :href="link(book.url)"
          class="block p-3 rounded-lg hover:bg-s4 text-on"
          @click="close"
        >{{ book.title }}</a>
      </nav>
      <div class="mt-auto pt-4 border-t border-ov flex items-center gap-2">
        <button
          type="button"
          class="flex-1 p-3 rounded-lg bg-s4 flex items-center justify-center gap-2 text-primary font-label text-label-md"
          @click="onTheme"
        >
          <MaterialIcon :name="themeIcon()" /> Giao diện
        </button>
        <button
          type="button"
          class="flex-1 p-3 rounded-lg bg-s4 flex items-center justify-center gap-2 text-primary font-label text-label-md"
          @click="onSearch"
        >
          <MaterialIcon name="search" /> Tìm kiếm
        </button>
      </div>
    </div>
  </div>
</template>
