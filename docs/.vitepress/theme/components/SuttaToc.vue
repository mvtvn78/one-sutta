<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBooks } from '../composables/useBooks'
import { useLink } from '../composables/useLink'
import Breadcrumb from './Breadcrumb.vue'
import BookCover from './BookCover.vue'
import MaterialIcon from './MaterialIcon.vue'

const props = defineProps<{ bookId: string; transId: string }>()
const { findBook, findTranslation, flatToc, buildBreadcrumb } = useBooks()
const link = useLink()

const filter = ref('')

const book = computed(() => findBook(props.bookId))
const trans = computed(() => (book.value ? findTranslation(book.value, props.transId) : undefined))

const crumbs = computed(() => buildBreadcrumb(props.bookId, props.transId))

const groups = computed(() => {
  if (!book.value) return []
  const items = flatToc(book.value, props.transId)
  const q = filter.value.trim().toLowerCase()
  const groupMap = new Map<string, typeof items>()
  const order: string[] = []
  for (const item of items) {
    if (q && !(item.title + ' ' + item.pali + ' ' + item.code).toLowerCase().includes(q)) continue
    if (!groupMap.has(item.group)) {
      groupMap.set(item.group, [])
      order.push(item.group)
    }
    groupMap.get(item.group)!.push(item)
  }
  return order.map((g) => ({ group: g, items: groupMap.get(g) || [] }))
})
</script>

<template>
  <div v-if="book && trans" class="px-4 md:px-page-margin py-12 md:py-20">
    <div class="max-w-reading mx-auto">
      <Breadcrumb :items="crumbs" />
      <header class="text-center mb-14">
        <h1 class="font-display text-headline-lg md:text-display-lg text-on mb-3">{{ book.title }}</h1>
        <p class="font-body text-onv italic">{{ trans.label }}</p>
      </header>

      <div class="flex justify-center mb-section-gap">
        <div class="w-56 md:w-72">
          <BookCover :book-id="book.id" :hue="book.hue" class="hairline card-shadow" />
        </div>
      </div>

      <div class="mb-8 flex items-center gap-2">
        <MaterialIcon name="tune" class="text-onv text-[20px]" />
        <input
          v-model="filter"
          type="text"
          placeholder="Lọc bài kinh trong danh sách..."
          class="flex-1 bg-s2 hairline rounded-full px-4 py-2 font-body text-body-md text-on outline-none focus:border-o"
        />
      </div>

      <section class="space-y-4">
        <template v-for="g in groups" :key="g.group">
          <div class="pt-6 pb-2">
            <span class="font-label text-label-md text-primary/60 uppercase tracking-[0.2em] block mb-4 text-center">
              {{ g.group }}
            </span>
          </div>
          <a
            v-for="it in g.items"
            :key="it.id"
            :href="link(it.url)"
            class="group relative flex items-center justify-between p-4 md:p-5 rounded-xl hover:bg-s4 transition-all duration-300"
          >
            <div class="flex items-baseline gap-4 min-w-0">
              <span class="font-label text-label-md text-primary opacity-70 shrink-0">{{ it.code }}</span>
              <div class="space-y-1 min-w-0">
                <h3 class="font-display text-headline-md text-on group-hover:text-primary transition-colors truncate">
                  {{ it.title }}
                </h3>
                <p class="text-[13px] text-onv opacity-70 italic">{{ it.pali }}</p>
                <p class="text-[14px] text-onv opacity-80 font-body">{{ it.description }}</p>
              </div>
            </div>
            <MaterialIcon name="arrow_forward" class="text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 shrink-0" />
          </a>
        </template>
      </section>
    </div>
  </div>
</template>
