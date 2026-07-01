<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useBooks } from '../composables/useBooks'
import { usePreferences } from '../composables/usePreferences'
import { useSearchPalette } from '../composables/useSearchPalette'
import { useLink } from '../composables/useLink'
import MaterialIcon from './MaterialIcon.vue'

const { books } = useBooks()
const { themeIcon, toggleTheme, fontStep, setFontStep, FONT_STEPS } = usePreferences()
const { open: openSearch } = useSearchPalette()

const booksMenuOpen = ref(false)
const fontMenuOpen = ref(false)
const drawerOpen = ref(false)

const link = useLink()
const homeUrl = computed(() => link('/'))

const booksMenuRef = ref<HTMLElement | null>(null)
const fontMenuRef = ref<HTMLElement | null>(null)

function toggleBooksMenu(e: Event) {
  e.stopPropagation()
  booksMenuOpen.value = !booksMenuOpen.value
  fontMenuOpen.value = false
}

function toggleFontMenu(e: Event) {
  e.stopPropagation()
  fontMenuOpen.value = !fontMenuOpen.value
  booksMenuOpen.value = false
}

function closeMenus() {
  booksMenuOpen.value = false
  fontMenuOpen.value = false
}

function openMobileDrawer() {
  drawerOpen.value = true
}

function closeDrawer() {
  drawerOpen.value = false
}

defineExpose({ openMobileDrawer, drawerOpen, closeDrawer })

onMounted(() => {
  document.addEventListener('click', closeMenus)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenus)
})
</script>

<template>
  <header class="bg-bg/85 backdrop-blur-header sticky top-0 z-40 border-b border-ov transition-colors">
    <div class="flex items-center justify-between h-16 px-4 md:px-page-margin max-w-[1400px] mx-auto">
      <div class="flex items-center gap-8">
        <a :href="homeUrl" class="font-display text-headline-md text-on tracking-tight select-none">
          Kinh Nikaya
        </a>
        <nav class="hidden md:flex items-center gap-6 font-label text-label-md">
          <a :href="homeUrl" class="nav-link transition-colors text-primary font-bold border-b-2 border-primary">
            Trang chủ
          </a>
          <div class="relative" ref="booksMenuRef">
            <button
              type="button"
              class="nav-link flex items-center gap-1 transition-colors text-onv hover:text-primary"
              @click="toggleBooksMenu"
            >
              Kinh <MaterialIcon name="expand_more" class="text-[18px]" />
            </button>
            <div
              v-show="booksMenuOpen"
              class="panel-enter absolute left-0 top-full mt-2 w-64 bg-s3 hairline rounded-xl card-shadow p-2 z-50"
              @click.stop
            >
              <a
                v-for="book in books"
                :key="book.id"
                :href="link(book.url)"
                class="block px-3 py-2.5 rounded-lg hover:bg-s4 text-on text-body-md transition-colors"
                @click="closeMenus"
              >
                <span class="block font-label text-label-md">{{ book.title }}</span>
                <span class="block text-[12px] text-onv italic">{{ book.pali }}</span>
              </a>
            </div>
          </div>
        </nav>
      </div>
      <div class="flex items-center gap-1.5 md:gap-2">
        <button
          type="button"
          class="hidden sm:flex items-center gap-2 bg-s3 hairline rounded-full pl-3 pr-2 py-1.5 text-onv hover:border-o transition-colors"
          title="Tìm kiếm (Ctrl/Cmd+K)"
          @click="openSearch"
        >
          <MaterialIcon name="search" class="text-[19px]" />
          <span class="font-label text-label-md">Tìm kiếm...</span>
          <span class="text-[10px] border border-ov rounded px-1 py-0.5 ml-1 opacity-70">⌘K</span>
        </button>
        <button
          type="button"
          class="sm:hidden p-2 rounded-lg hover:bg-s3 transition-colors text-primary"
          title="Tìm kiếm"
          @click="openSearch"
        >
          <MaterialIcon name="search" />
        </button>
        <button
          type="button"
          class="p-2 rounded-lg hover:bg-s3 transition-colors text-primary"
          title="Đổi giao diện sáng/tối"
          @click="toggleTheme"
        >
          <MaterialIcon :name="themeIcon()" />
        </button>
        <div class="relative" ref="fontMenuRef">
          <button
            type="button"
            class="p-2 rounded-lg hover:bg-s3 transition-colors text-primary"
            title="Cỡ chữ"
            @click="toggleFontMenu"
          >
            <MaterialIcon name="format_size" />
          </button>
          <div
            v-show="fontMenuOpen"
            class="panel-enter absolute right-0 top-full mt-2 w-64 bg-s3 hairline rounded-xl card-shadow p-4 z-50"
            @click.stop
          >
            <p class="font-label text-label-sm text-onv uppercase tracking-widest mb-3">Cỡ chữ</p>
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="(step, i) in FONT_STEPS"
                :key="i"
                type="button"
                class="fs-btn rounded-lg py-2 font-label text-label-sm border border-ov hover:border-o transition-colors"
                :class="{ active: fontStep === i }"
                @click="setFontStep(i)"
              >
                A<span :style="{ fontSize: `${10 + i * 2}px` }">a</span>
              </button>
            </div>
            <p class="font-label text-[11px] text-onv mt-3 leading-relaxed">
              Áp dụng cho toàn bộ giao diện, giúp bạn đọc kinh thoải mái hơn.
            </p>
          </div>
        </div>
        <button
          type="button"
          class="md:hidden p-2 rounded-lg hover:bg-s3 transition-colors text-primary"
          @click="$emit('open-drawer')"
        >
          <MaterialIcon name="menu" />
        </button>
      </div>
    </div>
  </header>
</template>
