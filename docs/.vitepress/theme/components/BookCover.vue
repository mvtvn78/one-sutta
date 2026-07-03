<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  bookId: string
  hue?: number
  class?: string
}>()

const hue = computed(() => props.hue ?? 0)

function coverSvg() {
  const h = hue.value
  const c1 = `hsl(${h} 35% 78%)`
  const c2 = `hsl(${h} 45% 22%)`
  const c3 = `hsl(${h} 55% 65%)`
  const lines = Array.from({ length: 12 })
    .map((_, i) => {
      const a = (i / 12) * Math.PI * 2
      const x1 = Math.cos(a) * 20
      const y1 = Math.sin(a) * 20
      const x2 = Math.cos(a) * 68
      const y2 = Math.sin(a) * 68
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${c1}" stroke-width="0.6" opacity="0.5"/>`
    })
    .join('')
  return `
  <svg viewBox="0 0 240 360" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g-${props.bookId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${c2}"/>
        <stop offset="100%" stop-color="var(--s-lowest)"/>
      </linearGradient>
    </defs>
    <rect width="240" height="360" fill="url(#g-${props.bookId})"/>
    <g transform="translate(120,145)" opacity="0.9">
      <circle r="70" fill="none" stroke="${c1}" stroke-width="0.75" opacity="0.55"/>
      <circle r="54" fill="none" stroke="${c1}" stroke-width="0.75" opacity="0.4"/>
      <circle r="6" fill="${c3}"/>
      ${lines}
      <circle r="30" fill="none" stroke="${c3}" stroke-width="1"/>
    </g>
    <rect x="18" y="18" width="204" height="324" fill="none" stroke="${c1}" stroke-width="0.75" opacity="0.35"/>
  </svg>`
}
</script>

<template>
  <div class="book-cover" :class="$props.class" v-html="coverSvg()" />
</template>
