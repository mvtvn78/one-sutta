<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSearchPalette } from '../composables/useSearchPalette'
import { useLink } from '../composables/useLink'
import MaterialIcon from './MaterialIcon.vue'

const { isOpen, close, buildSearchIndex } = useSearchPalette()
const link = useLink()
const query = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const results = ref(buildSearchIndex().slice(0, 8))

function renderResults(q: string) {
  const index = buildSearchIndex()
  const lower = q.trim().toLowerCase()
  results.value = !lower
    ? index.slice(0, 8)
    : index
        .filter((it) => (it.label + ' ' + it.sub).toLowerCase().includes(lower))
        .slice(0, 20)
}

watch(query, (q) => renderResults(q))

watch(isOpen, (open) => {
  if (open) {
    query.value = ''
    renderResults('')
    setTimeout(() => inputRef.value?.focus(), 30)
  }
})

function onClose() {
  close()
}
</script>

<template>
  <div
    v-show="isOpen"
    class="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
    role="dialog"
    aria-modal="true"
    aria-label="Tìm kiếm nhanh"
  >
    <div class="absolute inset-0 bg-black/55" @click="onClose" />
    <div class="fade-in relative w-full max-w-xl bg-s2 hairline rounded-2xl card-shadow overflow-hidden">
      <div class="flex items-center gap-3 px-5 py-4 border-b border-ov">
        <MaterialIcon name="search" class="text-onv" />
        <input
          ref="inputRef"
          v-model="query"
          type="text"
          placeholder="Tìm bộ kinh, bài kinh..."
          class="flex-1 bg-transparent outline-none font-body text-body-md text-on placeholder:text-onv/60"
        />
        <button type="button" class="text-onv hover:text-on" @click="onClose">
          <MaterialIcon name="close" />
        </button>
      </div>
      <div class="max-h-96 overflow-y-auto p-2">
        <template v-if="results.length">
          <a
            v-for="(item, i) in results"
            :key="i"
            :href="link(item.path)"
            class="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-s4 transition-colors"
            @click="onClose"
          >
            <div>
              <p class="text-on font-body text-body-md">{{ item.label }}</p>
              <p class="text-onv text-[12px] italic">{{ item.sub }}</p>
            </div>
            <span class="text-[11px] uppercase tracking-widest text-primary font-label">{{ item.type }}</span>
          </a>
        </template>
        <p v-else class="text-onv font-label text-label-md px-4 py-6 text-center">
          Không tìm thấy kết quả phù hợp.
        </p>
      </div>
    </div>
  </div>
</template>
