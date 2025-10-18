<template>
  <div class="relative w-full sm:w-96">
    <!-- Search Icon -->
    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <font-awesome-icon 
        icon="search" 
        class="h-5 w-5 text-neutral-500 dark:text-neutral-400" 
      />
    </div>
    
    <!-- Input Field -->
    <input
      :value="modelValue"
      @input="handleInput"
      type="text"
      placeholder="Search for a country..."
      class="w-full pl-12 pr-4 py-4 bg-neutral-0 dark:bg-primary text-neutral-900 dark:text-neutral-0 placeholder-neutral-500 dark:placeholder-neutral-400 border-0 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
      :class="{
        'ring-2 ring-red-500 ring-opacity-50': hasError
      }"
    />
    
    <!-- Clear Button (when there's text) -->
    <button
      v-if="modelValue"
      @click="clearSearch"
      class="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors duration-200"
      type="button"
    >
      <font-awesome-icon icon="times" class="h-5 w-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  hasError?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  hasError: false,
});

// Use defineModel for v-model
const modelValue = defineModel<string>();

// Handle input changes immediately
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  modelValue.value = target.value;
};

// Clear search
const clearSearch = () => {
  modelValue.value = '';
};
</script>
