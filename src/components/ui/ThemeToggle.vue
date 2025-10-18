<template>
  <button
    @click="toggleTheme"
    class="flex items-center space-x-2 text-neutral-900 dark:text-neutral-0 hover:opacity-80 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg px-2 py-1"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <!-- Moon Icon (Dark Mode) -->
    <font-awesome-icon 
      v-if="isDark"
      icon="moon" 
      class="h-5 w-5" 
    />
    
    <!-- Sun Icon (Light Mode) -->
    <font-awesome-icon 
      v-else
      icon="sun" 
      class="h-5 w-5" 
    />
    
    <span class="font-semibold text-sm">
      {{ isDark ? 'Dark Mode' : 'Light Mode' }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();
const { isDark } = storeToRefs(themeStore);
const { toggleTheme } = themeStore;
</script>
