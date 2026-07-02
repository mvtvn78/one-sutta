<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { useNotesPanel } from '../composables/useNotesPanel'
import { useNotes, type NoteContext } from '../composables/useNotes'
import { useLink } from '../composables/useLink'
import type { SuttaNote } from '../lib/notesDb'
import MaterialIcon from './MaterialIcon.vue'

const { isOpen, context, close } = useNotesPanel()
const { getNote, saveNote, deleteNote, listNotesForTranslation } = useNotes()
const link = useLink()

const draft = ref('')
const saving = ref(false)
const savedAt = ref<number | null>(null)
const otherNotes = ref<SuttaNote[]>([])
const textareaRef = ref<HTMLTextAreaElement | null>(null)

let saveTimer: ReturnType<typeof setTimeout> | undefined

const hasSutta = computed(() => Boolean(context.value?.suttaId))

const panelTitle = computed(() => {
  if (!context.value) return 'Ghi chú'
  if (context.value.suttaId && context.value.suttaTitle) {
    return context.value.suttaTitle
  }
  return 'Ghi chú của bạn'
})

const panelSubtitle = computed(() => {
  if (!context.value?.suttaId) return 'Các bài kinh bạn đã ghi chú trong bản dịch này'
  const code = context.value.suttaCode
  return code ? `${code} · Lưu trên thiết bị này` : 'Lưu trên thiết bị này'
})

async function loadPanel() {
  const ctx = context.value
  if (!ctx) return

  const notes = await listNotesForTranslation(ctx.bookId, ctx.transId)
  otherNotes.value = ctx.suttaId
    ? notes.filter((n) => n.suttaId !== ctx.suttaId)
    : notes

  if (ctx.suttaId) {
    const note = await getNote(ctx.bookId, ctx.transId, ctx.suttaId)
    draft.value = note?.content ?? ''
    savedAt.value = note?.updatedAt ?? null
    setTimeout(() => textareaRef.value?.focus(), 50)
  } else {
    draft.value = ''
    savedAt.value = null
  }
}

watch(isOpen, (open) => {
  if (open) loadPanel()
  else {
    clearTimeout(saveTimer)
    draft.value = ''
    savedAt.value = null
    otherNotes.value = []
  }
})

watch(context, () => {
  if (isOpen.value) loadPanel()
})

function scheduleSave() {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => void persist(), 600)
}

async function persist() {
  const ctx = context.value
  if (!ctx?.suttaId) return
  saving.value = true
  try {
    const noteCtx: NoteContext = {
      bookId: ctx.bookId,
      transId: ctx.transId,
      suttaId: ctx.suttaId,
      suttaCode: ctx.suttaCode,
      suttaTitle: ctx.suttaTitle,
    }
    const saved = await saveNote(noteCtx, draft.value)
    savedAt.value = saved.content ? saved.updatedAt : null
    await loadPanel()
  } finally {
    saving.value = false
  }
}

async function onDelete() {
  const ctx = context.value
  if (!ctx?.suttaId) return
  await deleteNote(ctx.bookId, ctx.transId, ctx.suttaId)
  draft.value = ''
  savedAt.value = null
  await loadPanel()
}

function noteUrl(note: SuttaNote): string {
  return `/kinh/${note.bookId}/${note.transId}/${note.suttaId}.html`
}

function formatDate(ts: number): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(ts)
}

function preview(content: string): string {
  const line = content.replace(/\s+/g, ' ').trim()
  return line.length > 80 ? `${line.slice(0, 79)}…` : line
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) close()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div
    v-show="isOpen"
    class="fixed inset-0 z-50 flex justify-end"
    role="dialog"
    aria-modal="true"
    aria-label="Ghi chú"
  >
    <div class="absolute inset-0 bg-black/50" @click="close" />
    <div class="fade-in relative w-full max-w-md h-full bg-s2 border-l border-ov flex flex-col shadow-2xl">
      <header class="flex items-start justify-between gap-3 px-5 py-4 border-b border-ov shrink-0">
        <div class="min-w-0">
          <p class="font-label text-label-sm text-primary uppercase tracking-widest mb-1">Ghi chú</p>
          <h2 class="font-display text-headline-md text-on leading-snug truncate">{{ panelTitle }}</h2>
          <p class="font-label text-[12px] text-onv mt-1">{{ panelSubtitle }}</p>
        </div>
        <button type="button" class="p-2 rounded-lg hover:bg-s4 text-onv shrink-0" @click="close">
          <MaterialIcon name="close" />
        </button>
      </header>

      <div class="flex-1 overflow-y-auto p-5 space-y-6">
        <section v-if="hasSutta">
          <textarea
            ref="textareaRef"
            v-model="draft"
            rows="8"
            placeholder="Viết suy ngẫm, trích dẫn hay điểm cần nhớ về bài kinh này..."
            class="w-full bg-s3 hairline rounded-xl px-4 py-3 font-body text-body-md text-on outline-none focus:border-o resize-y min-h-[10rem]"
            @input="scheduleSave"
          />
          <div class="flex items-center justify-between mt-2 gap-3">
            <p class="font-label text-[11px] text-onv">
              <span v-if="saving">Đang lưu…</span>
              <span v-else-if="savedAt">Đã lưu · {{ formatDate(savedAt) }}</span>
              <span v-else>Tự động lưu khi bạn gõ</span>
            </p>
            <button
              v-if="draft.trim()"
              type="button"
              class="font-label text-[11px] text-onv hover:text-primary transition-colors"
              @click="onDelete"
            >
              Xóa ghi chú
            </button>
          </div>
        </section>

        <section v-else-if="otherNotes.length === 0" class="text-center py-12">
          <MaterialIcon name="edit_note" class="text-4xl text-primary/40 mb-3" />
          <p class="font-body text-body-md text-onv">Chưa có ghi chú nào trong bản dịch này.</p>
          <p class="font-label text-[12px] text-onv mt-2 opacity-80">Mở một bài kinh và bấm Ghi chú để bắt đầu.</p>
        </section>

        <section v-if="otherNotes.length">
          <h3 class="font-label text-label-sm text-onv uppercase tracking-widest mb-3">
            {{ hasSutta ? 'Ghi chú khác' : 'Tất cả ghi chú' }}
          </h3>
          <ul class="space-y-2">
            <li v-for="note in otherNotes" :key="note.key">
              <a
                :href="link(noteUrl(note))"
                class="block p-3 rounded-xl hairline bg-s3/60 hover:bg-s4 transition-colors"
                @click="close"
              >
                <p class="font-label text-label-md text-primary">{{ note.suttaCode || note.suttaId }}</p>
                <p class="font-display text-body-md text-on truncate">{{ note.suttaTitle || note.suttaId }}</p>
                <p class="font-body text-[13px] text-onv mt-1 line-clamp-2">{{ preview(note.content) }}</p>
                <p class="font-label text-[10px] text-onv/70 mt-2">{{ formatDate(note.updatedAt) }}</p>
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>
