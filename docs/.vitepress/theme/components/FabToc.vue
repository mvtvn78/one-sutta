<script setup lang="ts">
import { withBase } from 'vitepress'
import MaterialIcon from './MaterialIcon.vue'

const props = defineProps<{ href: string }>()
</script>

<template>
  <a
    :href="withBase(props.href)"
    class="fixed bottom-6 right-6 z-40 lg:hidden w-14 h-14 rounded-full bg-primary text-onp flex items-center justify-center card-shadow active:scale-95 transition-transform"
    title="Mục lục"
  >
    <MaterialIcon name="menu_book" />
  </a>
</template>
