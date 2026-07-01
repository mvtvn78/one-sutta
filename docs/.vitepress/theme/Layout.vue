<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData } from 'vitepress'
import { useBooks } from './composables/useBooks'
import { usePreferences } from './composables/usePreferences'
import AppHeader from './components/AppHeader.vue'
import MobileDrawer from './components/MobileDrawer.vue'
import SearchPalette from './components/SearchPalette.vue'
import AppFooter from './components/AppFooter.vue'
import Toast from './components/Toast.vue'
import FabToc from './components/FabToc.vue'
import HomeHero from './components/HomeHero.vue'
import BookDetail from './components/BookDetail.vue'
import SuttaToc from './components/SuttaToc.vue'
import SuttaReading from './components/SuttaReading.vue'
import ReadingContextAside from './components/ReadingContextAside.vue'
import NotFound from './components/NotFound.vue'

const { frontmatter, page } = useData()
const { parseRoute } = useBooks()
const { showToast } = usePreferences()

const drawerOpen = ref(false)
const routeInfo = computed(() => parseRoute())

const layout = computed(() => {
  const fm = frontmatter.value.layout as string | undefined
  if (fm) return fm
  if (routeInfo.value.type === 'sutta') return 'sutta'
  if (routeInfo.value.type === 'toc') return 'toc'
  if (routeInfo.value.type === 'book') return 'book'
  if (routeInfo.value.type === 'home') return 'home'
  return 'unknown'
})

const showAside = computed(() => layout.value === 'toc' || layout.value === 'sutta')
const fabHref = computed(() => {
  const r = routeInfo.value
  if (r.type === 'sutta' || r.type === 'toc') {
    return `/kinh/${r.bookId}/${r.transId}/`
  }
  return '/'
})

function onNoop(msg: string) {
  showToast(msg)
}

function openFontFromAside() {
  showToast('Dùng nút cỡ chữ trên thanh tiêu đề để chỉnh cỡ chữ.')
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader @open-drawer="drawerOpen = true" />
    <MobileDrawer :open="drawerOpen" @close="drawerOpen = false" />
    <SearchPalette />
    <Toast />

    <main class="flex-1 min-h-screen">
      <div class="max-w-[1400px] mx-auto flex">
        <div class="flex-1 min-w-0">
          <HomeHero v-if="layout === 'home'" />
          <BookDetail
            v-else-if="layout === 'book' && routeInfo.type === 'book'"
            :book-id="routeInfo.bookId"
          />
          <SuttaToc
            v-else-if="layout === 'toc' && routeInfo.type === 'toc'"
            :book-id="routeInfo.bookId"
            :trans-id="routeInfo.transId"
          />
          <SuttaReading
            v-else-if="layout === 'sutta' && routeInfo.type === 'sutta'"
            :book-id="routeInfo.bookId"
            :trans-id="routeInfo.transId"
            :sutta-id="routeInfo.suttaId"
          />
          <NotFound v-else-if="layout === 'unknown' || page.isNotFound" />
        </div>
        <ReadingContextAside
          v-if="showAside && (routeInfo.type === 'toc' || routeInfo.type === 'sutta')"
          :book-id="routeInfo.bookId"
          :trans-id="routeInfo.transId"
          :sutta-id="routeInfo.type === 'sutta' ? routeInfo.suttaId : undefined"
          @noop="onNoop"
          @open-font="openFontFromAside"
        />
      </div>
    </main>

    <FabToc v-if="showAside" :href="fabHref" />
    <AppFooter />
  </div>
</template>
