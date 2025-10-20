<script setup lang="ts">
import type { CountryCard as CountryCardType } from '@/types/country'

interface Props {
  country: CountryCardType
}

interface Emits {
  (e: 'click', country: CountryCardType): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num)
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-flag.svg'
}
</script>

<template>
  <div
    class="bg-white dark:bg-primary rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
    @click="emit('click', country)"
  >
    <!-- Flag Image -->
    <div class="aspect-[4/3] overflow-hidden">
      <img
        :src="country.flag"
        :alt="`Flag of ${country.name}`"
        class="w-full h-full object-cover"
        loading="lazy"
        @error="handleImageError"
      />
    </div>

    <!-- Country Info -->
    <div class="p-4">
      <h3 class="text-lg font-extrabold text-neutral-900 dark:text-white mb-3">
        {{ country.name }}
      </h3>

      <div class="space-y-1 text-sm">
        <div class="flex items-center">
          <span class="font-semibold text-neutral-900 dark:text-white mr-2">Population:</span>
          <span class="text-neutral-700 dark:text-neutral-300">{{
            formatNumber(country.population)
          }}</span>
        </div>

        <div class="flex items-center">
          <span class="font-semibold text-neutral-900 dark:text-white mr-2">Region:</span>
          <span class="text-neutral-700 dark:text-neutral-300">{{ country.region }}</span>
        </div>

        <div class="flex items-center">
          <span class="font-semibold text-neutral-900 dark:text-white mr-2">Capital:</span>
          <span class="text-neutral-700 dark:text-neutral-300">{{ country.capital }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
