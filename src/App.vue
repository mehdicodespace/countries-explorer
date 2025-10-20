<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<template>
  <div id="app" class="min-h-screen bg-neutral-50 dark:bg-primary-900">
    <AppHeader />
    <main class="w-[92%] mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <router-view />
    </main>
  </div>
</template>

<style scoped></style>
