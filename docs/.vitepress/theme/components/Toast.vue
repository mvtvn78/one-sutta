<script setup lang="ts">
import { usePreferences } from '../composables/usePreferences'

const { toastMessage, toastVisible } = usePreferences()
</script>

<template>
  <div
    class="toast fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
    :class="toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'"
  >
    <div class="bg-s4 hairline rounded-full px-5 py-2.5 font-label text-label-md text-on card-shadow">
      {{ toastMessage }}
    </div>
  </div>
</template>
