<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <button
    @click="router.push('/')"
    class="flex items-center gap-2 px-6 py-2 bg-white dark:bg-primary text-neutral-900 dark:text-white rounded-md shadow-md hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-0 cursor-pointer"
  >
    <font-awesome-icon icon="chevron-left" class="h-4 w-4" />
    <span class="font-semibold">Back</span>
  </button>
</template>
