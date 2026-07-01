<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useBooks } from '../composables/useBooks'
import { QUOTES } from '../types'
import { useLink } from '../composables/useLink'
import BookCover from './BookCover.vue'
import MaterialIcon from './MaterialIcon.vue'

const { books } = useBooks()
const link = useLink()
const idx = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

function draw() {
  /* reactive via idx */
}

function goToDot(i: number) {
  idx.value = i
  resetTimer()
}

function resetTimer() {
  clearInterval(timer)
  timer = setInterval(() => {
    idx.value = (idx.value + 1) % QUOTES.length
  }, 6000)
}

onMounted(() => resetTimer())
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <section class="px-4 md:px-page-margin pt-14 md:pt-20 pb-section-gap">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-14">
      <div class="flex-1 text-center md:text-left">
        <div class="inline-block mb-6 px-3 py-1 rounded-full border border-primary/40 text-primary font-label text-label-sm uppercase">
          Lời Phật dạy
        </div>
        <div class="relative min-h-[9rem]">
          <blockquote class="fade-in font-body text-body-lg text-on italic leading-relaxed">
            "{{ QUOTES[idx].text }}"
          </blockquote>
          <div class="fade-in flex items-center justify-center md:justify-start gap-4 mt-6">
            <div class="h-px w-10" style="background: var(--outline-var)" />
            <cite class="not-italic font-label text-label-sm text-onv tracking-widest uppercase">
              {{ QUOTES[idx].cite }}
            </cite>
          </div>
        </div>
        <div class="flex items-center justify-center md:justify-start gap-3 mt-2">
          <button
            v-for="(_, i) in QUOTES"
            :key="i"
            type="button"
            class="h-2 rounded-full transition-all"
            :style="{
              background: i === idx ? 'var(--primary)' : 'var(--outline-var)',
              width: i === idx ? '20px' : '8px',
            }"
            :aria-label="`Trích dẫn ${i + 1}`"
            @click="goToDot(i)"
          />
        </div>
      </div>
      <div class="w-full max-w-[300px] shrink-0">
        <BookCover book-id="hero" :hue="38" class="card-shadow border border-ov" />
      </div>
    </div>
  </section>

  <section class="px-4 md:px-page-margin pb-24">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col items-center mb-14 text-center">
        <h2 class="font-display text-headline-lg text-on mb-4">Ngũ Bộ Kinh Nikaya</h2>
        <div class="w-16 h-1 bg-primary rounded-full" />
        <p class="max-w-xl mt-5 text-onv font-body text-body-md">
          Chọn một bộ kinh để xem các bản dịch hiện có và bắt đầu đọc.
        </p>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
        <a
          v-for="book in books"
          :key="book.id"
          :href="link(book.url)"
          class="group block text-center space-y-4"
        >
          <div class="relative hairline card-shadow transition-transform duration-500 group-hover:-translate-y-3 overflow-hidden rounded-2xl">
            <BookCover :book-id="book.id" :hue="book.hue" />
            <div class="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/55 via-black/5 to-transparent">
              <p class="text-white/90 font-label text-label-sm">{{ book.pali }}</p>
            </div>
          </div>
          <p class="font-display text-headline-md text-primary group-hover:opacity-80 transition-opacity">
            {{ book.title }}
          </p>
        </a>
      </div>
    </div>
  </section>
</template>
