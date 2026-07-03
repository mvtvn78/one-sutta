<script setup lang="ts">
import { withBase } from 'vitepress'
import type { BreadcrumbItem } from '../types'
import MaterialIcon from './MaterialIcon.vue'

defineProps<{ items: BreadcrumbItem[]; maxLabelLength?: number }>()

const DEFAULT_MAX = 42

function href(path: string) {
  return withBase(path)
}

function displayLabel(label: string, isLast: boolean, max: number): string {
  if (!isLast || label.length <= max) return label
  return `${label.slice(0, max - 1).trimEnd()}…`
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
      <span
        v-else
        class="text-on-var max-w-[min(100%,14rem)] sm:max-w-[min(100%,20rem)] truncate"
        :title="item.title || (item.label.length > (maxLabelLength ?? DEFAULT_MAX) ? item.label : undefined)"
      >{{ displayLabel(item.label, i === items.length - 1, maxLabelLength ?? DEFAULT_MAX) }}</span>
    </template>
  </nav>
</template>
