<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData } from 'vitepress'
import { useBooks } from './composables/useBooks'
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
import NotesPanel from './components/NotesPanel.vue'
import UserPanel from './components/UserPanel.vue'
import NotFound from './components/NotFound.vue'

const { frontmatter, page } = useData()
const { routeInfo } = useBooks()

const drawerOpen = ref(false)

const layout = computed(() => {
  const fm = frontmatter.value.layout as string | undefined
  if (fm) return fm
  if (routeInfo.value.type === 'sutta') return 'sutta'
  if (routeInfo.value.type === 'toc') return 'toc'
  if (routeInfo.value.type === 'book') return 'book'
  if (routeInfo.value.type === 'home') return 'home'
  return 'unknown'
})

const view = computed(() => {
  const r = routeInfo.value
  const fm = frontmatter.value

  switch (layout.value) {
    case 'book':
      return {
        type: 'book' as const,
        bookId: r.type === 'book' ? r.bookId : String(fm.book || ''),
      }
    case 'toc':
      return {
        type: 'toc' as const,
        bookId: r.type === 'toc' ? r.bookId : String(fm.book || ''),
        transId: r.type === 'toc' ? r.transId : String(fm.translation || ''),
      }
    case 'sutta':
      return {
        type: 'sutta' as const,
        bookId: r.type === 'sutta' ? r.bookId : String(fm.book || ''),
        transId: r.type === 'sutta' ? r.transId : String(fm.translation || ''),
        suttaId: r.type === 'sutta' ? r.suttaId : '',
      }
    default:
      return { type: layout.value as 'home' | 'unknown' }
  }
})

const showAside = computed(() => view.value.type === 'toc' || view.value.type === 'sutta')
const fabHref = computed(() => {
  const v = view.value
  if (v.type === 'sutta' || v.type === 'toc') {
    return `/kinh/${v.bookId}/${v.transId}/`
  }
  return '/'
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader @open-drawer="drawerOpen = true" />
    <MobileDrawer :open="drawerOpen" @close="drawerOpen = false" />
    <SearchPalette />
    <NotesPanel />
    <UserPanel />
    <Toast />

    <main class="flex-1 min-h-screen">
      <div class="max-w-[1400px] mx-auto flex">
        <div class="flex-1 min-w-0">
          <HomeHero v-if="layout === 'home'" />
          <BookDetail
            v-else-if="view.type === 'book' && view.bookId"
            :book-id="view.bookId"
          />
          <SuttaToc
            v-else-if="view.type === 'toc' && view.bookId && view.transId"
            :book-id="view.bookId"
            :trans-id="view.transId"
          />
          <SuttaReading
            v-else-if="view.type === 'sutta' && view.bookId && view.transId && view.suttaId"
            :book-id="view.bookId"
            :trans-id="view.transId"
            :sutta-id="view.suttaId"
          />
          <NotFound v-else-if="layout === 'unknown' || page.isNotFound" />
        </div>
        <ReadingContextAside
          v-if="showAside && (view.type === 'toc' || view.type === 'sutta')"
          :book-id="view.bookId"
          :trans-id="view.transId"
          :sutta-id="view.type === 'sutta' ? view.suttaId : undefined"
        />
      </div>
    </main>

    <FabToc v-if="showAside" :href="fabHref" />
    <AppFooter />
  </div>
</template>
