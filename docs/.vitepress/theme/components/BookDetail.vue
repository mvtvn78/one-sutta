<script setup lang="ts">
import { computed } from 'vue'
import { useBooks } from '../composables/useBooks'
import { QUOTES } from '../types'
import { useLink } from '../composables/useLink'
import Breadcrumb from './Breadcrumb.vue'
import BookCover from './BookCover.vue'
import MaterialIcon from './MaterialIcon.vue'
import NotFound from './NotFound.vue'

const props = defineProps<{ bookId: string }>()
const { findBook, buildBreadcrumb } = useBooks()
const link = useLink()

const book = computed(() => findBook(props.bookId))
const quote = computed(() => {
  if (!book.value) return QUOTES[0]
  return QUOTES[book.value.hue % QUOTES.length]
})
const crumbs = computed(() => buildBreadcrumb(props.bookId))
</script>

<template>
  <div v-if="book" class="px-4 md:px-page-margin py-section-gap">
    <div class="max-w-[1200px] mx-auto">
      <Breadcrumb :items="crumbs" />
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div class="lg:col-span-7 space-y-12">
          <section class="space-y-5">
            <h1 class="font-display text-display-lg text-primary glow">{{ book.title }}</h1>
            <p class="font-body text-body-lg text-onv leading-relaxed max-w-reading">{{ book.description }}</p>
          </section>
          <nav class="space-y-4">
            <h2 class="font-label text-label-md text-primary uppercase tracking-[0.2em] opacity-70 pb-2 border-b border-ov">
              Các bản dịch hiện có
            </h2>
            <div class="space-y-2">
              <a
                v-for="t in book.translations"
                :key="t.id"
                :href="link(t.url)"
                class="group block p-5 rounded-xl hairline bg-s2/60 hover:bg-s4 transition-all duration-300"
              >
                <div class="flex justify-between items-center gap-4">
                  <div class="space-y-1">
                    <h3 class="font-display text-headline-md text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                      {{ t.label }}
                      <span class="text-[10px] font-label uppercase tracking-widest px-1.5 py-0.5 rounded bg-pc text-onpc">
                        {{ t.lang === 'vi' ? 'VI' : 'EN' }}
                      </span>
                    </h3>
                    <p class="font-body text-body-md text-onv opacity-80">{{ t.desc }}</p>
                  </div>
                  <MaterialIcon name="arrow_forward" class="text-primary opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 shrink-0" />
                </div>
              </a>
            </div>
          </nav>
          <div class="relative p-8 rounded-2xl bg-s2 border-l-4 border-primary">
            <MaterialIcon name="format_quote" class="absolute -top-3 -left-1 text-6xl text-primary/10 select-none" />
            <blockquote class="italic font-body text-body-lg text-onv leading-relaxed">"{{ quote.text }}"</blockquote>
            <cite class="block mt-4 font-label text-label-md text-primary tracking-widest uppercase opacity-70 not-italic">
              {{ quote.cite }}
            </cite>
          </div>
        </div>
        <div class="lg:col-span-5 lg:sticky lg:top-28 relative">
          <BookCover :book-id="book.id" :hue="book.hue" class="hairline card-shadow" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent pointer-events-none rounded-2xl" />
          <div class="absolute bottom-6 right-6">
            <a
              v-if="book.translations[0]"
              :href="link(book.translations[0].url)"
              class="bg-primary/90 text-onp px-4 py-3 rounded-full shadow-lg hover:bg-primary transition-colors flex items-center gap-2 backdrop-blur-sm"
            >
              <MaterialIcon name="auto_stories" />
              <span class="font-label text-label-md">Đọc ngay</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <NotFound v-else />
</template>
