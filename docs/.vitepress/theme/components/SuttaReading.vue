<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useData, Content } from 'vitepress'
import { useBooks } from '../composables/useBooks'
import { useNotesPanel } from '../composables/useNotesPanel'
import { useBookmarks } from '../composables/useBookmarks'
import { useLink } from '../composables/useLink'
import Breadcrumb from './Breadcrumb.vue'
import MaterialIcon from './MaterialIcon.vue'
import NotFound from './NotFound.vue'

const props = defineProps<{ bookId: string; transId: string; suttaId: string }>()
const { frontmatter } = useData()
const { findBook, findTranslation, findSutta, getPrevNext, buildBreadcrumb } = useBooks()
const { open: openNotes } = useNotesPanel()
const { isBookmarked, toggleBookmark } = useBookmarks()
const link = useLink()

const bookmarked = ref(false)

const book = computed(() => findBook(props.bookId))
const trans = computed(() => (book.value ? findTranslation(book.value, props.transId) : undefined))
const sutta = computed(() =>
  book.value ? findSutta(book.value, props.transId, props.suttaId) : undefined
)

async function refreshBookmark() {
  bookmarked.value = await isBookmarked(props.bookId, props.transId, props.suttaId)
}

onMounted(() => refreshBookmark())
watch(() => [props.bookId, props.transId, props.suttaId], () => refreshBookmark())

async function toggleBookmarkState() {
  bookmarked.value = await toggleBookmark({
    bookId: props.bookId,
    transId: props.transId,
    suttaId: props.suttaId,
    suttaCode: String(frontmatter.value.code || sutta.value?.code || ''),
    suttaTitle: String(frontmatter.value.title || sutta.value?.title || ''),
    bookTagline: book.value?.tagline,
    transLabel: trans.value?.label,
    url: sutta.value?.url,
  })
}

const crumbs = computed(() =>
  buildBreadcrumb(props.bookId, props.transId, {
    code: String(frontmatter.value.code || sutta.value?.code || ''),
    title: String(frontmatter.value.title || sutta.value?.title || ''),
  })
)

const nav = computed(() =>
  book.value ? getPrevNext(book.value, props.transId, props.suttaId) : { prev: undefined, next: undefined }
)

const isEmpty = computed(() => {
  if (frontmatter.value.draft) return true
  if (sutta.value && !sutta.value.hasContent) return true
  return false
})

function openNotesPanel() {
  openNotes({
    bookId: props.bookId,
    transId: props.transId,
    suttaId: props.suttaId,
    suttaCode: String(frontmatter.value.code || sutta.value?.code || ''),
    suttaTitle: String(frontmatter.value.title || sutta.value?.title || ''),
  })
}
</script>

<template>
  <div v-if="book && trans" class="flex">
    <article class="flex-1 min-w-0 px-4 sm:px-gutter py-12 md:py-16">
      <div class="max-w-reading mx-auto reading">
        <div class="flex items-start justify-between gap-3 mb-8">
          <Breadcrumb class="!mb-0 flex-1 min-w-0" :items="crumbs" />
          <div class="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              class="flex items-center gap-1.5 px-3 py-2 rounded-full hairline bg-s3 font-label text-label-sm hover:bg-s4 transition-colors"
              :class="bookmarked ? 'text-primary' : 'text-onv'"
              :title="bookmarked ? 'Bỏ đánh dấu' : 'Đánh dấu bài kinh'"
              @click="toggleBookmarkState"
            >
              <MaterialIcon :name="bookmarked ? 'bookmark' : 'bookmark_border'" class="text-[18px]" />
              <span class="hidden sm:inline">{{ bookmarked ? 'Đã lưu' : 'Lưu' }}</span>
            </button>
            <button
              type="button"
              class="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-full hairline bg-s3 text-primary font-label text-label-sm hover:bg-s4 transition-colors"
              @click="openNotesPanel"
            >
              <MaterialIcon name="edit_note" class="text-[18px]" /> Ghi chú
            </button>
          </div>
        </div>
        <header class="mb-section-gap">
          <h1 class="font-display text-display-lg text-primary glow mb-3 leading-tight">
            {{ frontmatter.code }}. {{ String(frontmatter.title || '').toUpperCase() }}
          </h1>
          <p class="font-label text-label-md text-onv tracking-[0.2em] uppercase opacity-70 mb-2">
            {{ frontmatter.pali }}
          </p>
          <p class="font-body text-body-md text-onv/80 italic mb-6">{{ trans.label }}</p>
          <div class="h-px w-24 bg-pc" />
        </header>

        <div v-if="isEmpty" class="my-16 flex flex-col items-center text-center gap-4 py-16 rounded-2xl hairline bg-s2/50">
          <MaterialIcon name="auto_stories" class="text-4xl text-primary/50" />
          <p class="font-display text-headline-md text-on">Nội dung đang được biên soạn</p>
          <p class="font-body text-onv max-w-sm">
            Bản dịch "{{ trans.label }}" cho bài kinh này chưa được số hoá. Bạn có thể xem qua bản dịch khác của bộ kinh này.
          </p>
          <a
            :href="link(book.url)"
            class="mt-2 px-5 py-2 rounded-full border border-primary/40 text-primary font-label text-label-md hover:bg-primary/10 transition-colors"
          >
            Xem các bản dịch khác
          </a>
        </div>
        <div v-else class="font-body text-body-lg text-on/90">
          <Content />
        </div>

        <div class="mt-section-gap flex flex-col items-center gap-4 opacity-60">
          <div class="h-px w-16" style="background: var(--outline-var)" />
          <span class="font-label text-label-md tracking-[0.4em]">-ooo-</span>
        </div>

        <div class="mt-14 grid grid-cols-1 md:grid-cols-2 gap-5">
          <a
            v-if="nav.prev"
            :href="link(nav.prev.url)"
            class="group flex flex-col p-6 rounded-xl hairline bg-s2/40 hover:border-o transition-all"
          >
            <span class="text-label-md font-label text-onv mb-2 flex items-center gap-2">
              <MaterialIcon name="arrow_back" class="text-[18px]" /> Bài trước
            </span>
            <span class="font-display text-headline-md text-primary">{{ nav.prev.code }}. {{ nav.prev.title }}</span>
          </a>
          <div v-else />
          <a
            v-if="nav.next"
            :href="link(nav.next.url)"
            class="group flex flex-col p-6 rounded-xl hairline bg-s2/40 hover:border-o transition-all text-right"
          >
            <span class="text-label-md font-label text-onv mb-2 flex items-center justify-end gap-2">
              Bài tiếp theo <MaterialIcon name="arrow_forward" class="text-[18px]" />
            </span>
            <span class="font-display text-headline-md text-primary">{{ nav.next.code }}. {{ nav.next.title }}</span>
          </a>
        </div>
      </div>
    </article>
  </div>
  <NotFound v-else />
</template>
