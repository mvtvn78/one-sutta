<script setup lang="ts">
import { usePreferences } from '../composables/usePreferences'

const { showToast } = usePreferences()

function onFooterLink(e: Event) {
  e.preventDefault()
  showToast('Trang đang được xây dựng — sẽ sớm ra mắt.')
}
</script>

<template>
  <footer class="border-t border-ov bg-bg mt-16">
    <div class="max-w-reading mx-auto px-page-margin py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
      <div class="space-y-1">
        <p class="font-label text-label-md text-on">Kinh Nikaya — Thư viện kinh điển Nam truyền</p>
        <p class="font-label text-label-sm text-onv opacity-70">Giấy phép (CC0) — Nội dung thuộc về cộng đồng</p>
      </div>
      <nav class="flex gap-6 font-label text-label-md">
        <a href="#" class="text-onv hover:text-primary underline transition-colors" @click="onFooterLink">Hỏi–Đáp</a>
        <a href="#" class="text-onv hover:text-primary underline transition-colors" @click="onFooterLink">Giấy phép (CC0)</a>
        <a href="#" class="text-onv hover:text-primary underline transition-colors" @click="onFooterLink">Liên hệ</a>
      </nav>
    </div>
  </footer>
</template>
