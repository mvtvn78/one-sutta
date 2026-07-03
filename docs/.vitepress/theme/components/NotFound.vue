<script setup lang="ts">
import { withBase } from 'vitepress'
import MaterialIcon from './MaterialIcon.vue'
</script>

<template>
  <div class="px-4 py-32 text-center">
    <p class="font-display text-display-lg text-primary mb-4">404</p>
    <p class="font-body text-body-lg text-onv mb-8">Không tìm thấy trang bạn yêu cầu.</p>
    <a
      :href="withBase('/')"
      class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-onp font-label text-label-md"
    >
      <MaterialIcon name="home" class="text-[18px]" /> Về trang chủ
    </a>
  </div>
</template>