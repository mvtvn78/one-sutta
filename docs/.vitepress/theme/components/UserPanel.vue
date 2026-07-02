<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useUserPanel, type UserPanelTab } from '../composables/useUserPanel'
import { useBookmarks } from '../composables/useBookmarks'
import { useNotes } from '../composables/useNotes'
import { useLink } from '../composables/useLink'
import type { SuttaBookmark } from '../lib/notesDb'
import type { SuttaNote } from '../lib/notesDb'
import MaterialIcon from './MaterialIcon.vue'

const { isOpen, activeTab, close, setTab } = useUserPanel()
const { listAllBookmarks } = useBookmarks()
const { listAllNotes } = useNotes()
const link = useLink()

const bookmarks = ref<SuttaBookmark[]>([])
const notes = ref<SuttaNote[]>([])
const loading = ref(false)

const tabs: { id: UserPanelTab; label: string; icon: string }[] = [
  { id: 'bookmarks', label: 'BookMark', icon: 'bookmark' },
  { id: 'notes', label: 'Ghi chú', icon: 'edit_note' },
]

async function loadData() {
  loading.value = true
  try {
    const [bm, nt] = await Promise.all([listAllBookmarks(), listAllNotes()])
    bookmarks.value = bm
    notes.value = nt
  } finally {
    loading.value = false
  }
}

watch(isOpen, (open) => {
  if (open) loadData()
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) close()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))

function formatDate(ts: number): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(ts)
}

function preview(content: string): string {
  const line = content.replace(/\s+/g, ' ').trim()
  return line.length > 100 ? `${line.slice(0, 99)}…` : line
}

function noteUrl(note: SuttaNote): string {
  return `/kinh/${note.bookId}/${note.transId}/${note.suttaId}.html`
}

function onItemClick() {
  close()
}
</script>

<template>
  <div
    v-show="isOpen"
    class="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4"
    role="dialog"
    aria-modal="true"
    aria-label="Thư viện cá nhân"
  >
    <div class="absolute inset-0 bg-black/55" @click="close" />
    <div class="fade-in relative w-full max-w-lg bg-s2 hairline rounded-2xl card-shadow overflow-hidden flex flex-col max-h-[min(80vh,640px)]">
      <header class="flex items-center justify-between px-5 py-4 border-b border-ov shrink-0">
        <div class="flex items-center gap-2">
          <MaterialIcon name="person" class="text-primary text-[22px]" />
          <h2 class="font-display text-headline-md text-on">Thư viện của bạn</h2>
        </div>
        <button type="button" class="p-2 rounded-lg hover:bg-s4 text-onv" @click="close">
          <MaterialIcon name="close" />
        </button>
      </header>

      <div class="flex border-b border-ov shrink-0">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="flex-1 flex items-center justify-center gap-2 py-3 font-label text-label-md transition-colors border-b-2 -mb-px"
          :class="activeTab === tab.id
            ? 'text-primary border-primary'
            : 'text-onv border-transparent hover:text-on'"
          @click="setTab(tab.id)"
        >
          <MaterialIcon :name="tab.icon" class="text-[18px]" />
          {{ tab.label }}
          <span
            v-if="tab.id === 'bookmarks' && bookmarks.length"
            class="text-[10px] px-1.5 py-0.5 rounded-full bg-pc text-onpc"
          >{{ bookmarks.length }}</span>
          <span
            v-if="tab.id === 'notes' && notes.length"
            class="text-[10px] px-1.5 py-0.5 rounded-full bg-pc text-onpc"
          >{{ notes.length }}</span>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-3">
        <div v-if="loading" class="py-12 text-center font-label text-label-md text-onv">Đang tải…</div>

        <template v-else-if="activeTab === 'bookmarks'">
          <div v-if="bookmarks.length === 0" class="py-12 text-center px-4">
            <MaterialIcon name="bookmark_border" class="text-4xl text-primary/40 mb-3" />
            <p class="font-body text-body-md text-onv">Chưa có bài kinh nào được đánh dấu.</p>
            <p class="font-label text-[12px] text-onv mt-2 opacity-80">
              Mở một bài kinh và bấm biểu tượng bookmark để lưu lại.
            </p>
          </div>
          <ul v-else class="space-y-2">
            <li v-for="bm in bookmarks" :key="bm.key">
              <a
                :href="link(bm.url)"
                class="block p-4 rounded-xl hover:bg-s4 transition-colors"
                @click="onItemClick"
              >
                <p class="font-label text-[11px] text-primary uppercase tracking-widest">
                  {{ bm.bookTagline }} · {{ bm.transLabel }}
                </p>
                <p class="font-display text-headline-md text-on mt-1">
                  <span class="text-primary/80">{{ bm.suttaCode }}</span>
                  <span v-if="bm.suttaTitle"> · {{ bm.suttaTitle }}</span>
                </p>
                <p class="font-label text-[10px] text-onv/70 mt-2">Đánh dấu · {{ formatDate(bm.createdAt) }}</p>
              </a>
            </li>
          </ul>
        </template>

        <template v-else>
          <div v-if="notes.length === 0" class="py-12 text-center px-4">
            <MaterialIcon name="edit_note" class="text-4xl text-primary/40 mb-3" />
            <p class="font-body text-body-md text-onv">Chưa có ghi chú nào.</p>
            <p class="font-label text-[12px] text-onv mt-2 opacity-80">
              Mở một bài kinh và bấm Ghi chú ở thanh bên để viết suy ngẫm.
            </p>
          </div>
          <ul v-else class="space-y-2">
            <li v-for="note in notes" :key="note.key">
              <a
                :href="link(noteUrl(note))"
                class="block p-4 rounded-xl hover:bg-s4 transition-colors"
                @click="onItemClick"
              >
                <p class="font-label text-[11px] text-primary uppercase tracking-widest">
                  {{ note.suttaCode }}
                </p>
                <p class="font-display text-headline-md text-on mt-0.5 truncate">{{ note.suttaTitle || note.suttaId }}</p>
                <p class="font-body text-[13px] text-onv mt-2 line-clamp-2">{{ preview(note.content) }}</p>
                <p class="font-label text-[10px] text-onv/70 mt-2">Cập nhật · {{ formatDate(note.updatedAt) }}</p>
              </a>
            </li>
          </ul>
        </template>
      </div>
    </div>
  </div>
</template>
