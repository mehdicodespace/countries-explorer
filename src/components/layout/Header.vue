<script setup lang="ts">
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
</script>

<template>
  <header class="bg-white dark:bg-primary shadow-md">
    <div class="w-[92%] mx-auto px-4 py-4 sm:px-6 sm:py-6">
      <div class="flex justify-between items-center">
        <h1 class="text-lg sm:text-xl md:text-2xl font-extrabold text-neutral-900 dark:text-white">
          Where in the world?
        </h1>
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>
