<script setup lang="ts">
import { withBase } from 'vitepress'
import type { BreadcrumbItem } from '../types'
import MaterialIcon from './MaterialIcon.vue'

defineProps<{ items: BreadcrumbItem[] }>()

function href(path: string) {
  return withBase(path)
}
</script>

<template>
  <nav
    class="flex flex-wrap items-center gap-2 mb-8 font-label text-label-sm text-onv/70 uppercase tracking-widest"
    aria-label="Breadcrumb"
  >
    <template v-for="(item, i) in items" :key="i">
      <MaterialIcon v-if="i > 0" name="chevron_right" class="text-[14px]" />
      <a
        v-if="item.path"
        :href="href(item.path)"
        class="hover:text-primary transition-colors"
      >{{ item.label }}</a>
      <span v-else class="text-on-var">{{ item.label }}</span>
    </template>
  </nav>
</template>
