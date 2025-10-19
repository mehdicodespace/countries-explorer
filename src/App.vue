<script setup lang="ts">
import Header from '@/components/layout/Header.vue'
</script>

<template>
  <div id="app" class="min-h-screen bg-neutral-50 dark:bg-primary-900">
    <Header />
    <main class="w-[92%] mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <router-view />
    </main>
  </div>
</template>

<style scoped></style>
