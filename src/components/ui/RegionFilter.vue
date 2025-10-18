<template>
  <div class="relative">
    <Listbox v-model="modelValue" @update:model-value="handleRegionChange">
      <div class="relative">
        <!-- Filter Button -->
        <ListboxButton 
          class="relative w-48 cursor-pointer bg-neutral-0 dark:bg-primary text-left shadow-md rounded-lg py-4 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
        >
          <span class="block truncate text-neutral-900 dark:text-neutral-0">
            {{ modelValue === 'All' ? 'Filter by Region' : modelValue }}
          </span>
          <span class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <svg 
              class="h-5 w-5 text-neutral-500 dark:text-neutral-400 transition-transform duration-200"
              :class="{ 'rotate-180': isOpen }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </ListboxButton>

        <!-- Dropdown Options -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <ListboxOptions 
            class="absolute z-10 mt-1 w-full bg-neutral-0 dark:bg-primary shadow-lg max-h-60 rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none"
          >
            <ListboxOption
              v-for="region in regions"
              :key="region"
              :value="region"
              v-slot="{ active, selected }"
            >
              <li
                :class="[
                  active 
                    ? 'bg-blue-50 dark:bg-primary-900 text-blue-900 dark:text-blue-100' 
                    : 'text-neutral-900 dark:text-neutral-0',
                  'relative cursor-pointer select-none py-2 pl-4 pr-4'
                ]"
              >
                <span 
                  :class="[
                    selected ? 'font-semibold' : 'font-normal',
                    'block truncate'
                  ]"
                >
                  {{ region }}
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600 dark:text-blue-400"
                >
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue';
import type { Region } from '@/types/country';
import { REGIONS } from '@/types/country';

// Use defineModel for v-model
const modelValue = defineModel<Region>();

// Local state
const isOpen = ref(false);

// Available regions
const regions = REGIONS;

// Handle region change
const handleRegionChange = (value: Region) => {
  modelValue.value = value;
};
</script>
