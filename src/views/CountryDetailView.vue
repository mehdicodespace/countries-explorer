<template>
  <div>
    <!-- Back Button -->
    <div class="mb-8">
      <BackButton />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="text-neutral-500 dark:text-neutral-400">
        <svg class="animate-spin h-8 w-8 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p class="text-center">Loading country details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-500 dark:text-red-400 mb-4">
        <svg class="h-16 w-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <h3 class="text-xl font-semibold mb-2">Failed to load country</h3>
        <p class="text-neutral-500 dark:text-neutral-400 mb-4">{{ error.message }}</p>
        <button
          @click="refetch"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Country Details -->
    <div
      v-else-if="country && country.name"
      class="flex flex-col lg:flex-row lg:items-center lg:gap-24"
    >
      <!-- Flag -->
      <div class="w-full lg:w-5/12 mb-8 lg:mb-0">
        <div
          class="aspect-[4/3] overflow-hidden rounded-lg shadow-lg max-w-sm mx-auto lg:max-w-none lg:mx-0"
        >
          <img
            :src="country.flag"
            :alt="`Flag of ${country.name}`"
            class="w-full h-full object-cover"
            loading="lazy"
            @error="handleImageError"
          />
        </div>
      </div>

      <!-- Country Info -->
      <div class="w-full lg:w-1/2">
        <h1 class="text-2xl lg:text-4xl font-extrabold text-neutral-900 dark:text-white mb-6">
          {{ country.name }}
        </h1>

        <!-- Country Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <!-- Left Column -->
          <div class="space-y-2">
            <div class="flex flex-wrap">
              <span class="font-semibold text-neutral-900 dark:text-white mr-2">Native Name:</span>
              <span class="text-neutral-900 dark:text-white">{{ country.nativeName }}</span>
            </div>
            <div class="flex flex-wrap">
              <span class="font-semibold text-neutral-900 dark:text-white mr-2">Population:</span>
              <span class="text-neutral-900 dark:text-white">{{
                formatNumber(country.population)
              }}</span>
            </div>
            <div class="flex flex-wrap">
              <span class="font-semibold text-neutral-900 dark:text-white mr-2">Region:</span>
              <span class="text-neutral-900 dark:text-white">{{ country.region }}</span>
            </div>
            <div class="flex flex-wrap">
              <span class="font-semibold text-neutral-900 dark:text-white mr-2">Sub Region:</span>
              <span class="text-neutral-900 dark:text-white">{{ country.subregion }}</span>
            </div>
            <div class="flex flex-wrap">
              <span class="font-semibold text-neutral-900 dark:text-white mr-2">Capital:</span>
              <span class="text-neutral-900 dark:text-white">{{ country.capital }}</span>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-2">
            <div class="flex flex-wrap">
              <span class="font-semibold text-neutral-900 dark:text-white mr-2"
                >Top Level Domain:</span
              >
              <span class="text-neutral-900 dark:text-white">{{ country.topLevelDomain }}</span>
            </div>
            <div class="flex flex-wrap">
              <span class="font-semibold text-neutral-900 dark:text-white mr-2">Currencies:</span>
              <span class="text-neutral-900 dark:text-white">{{ country.currencies }}</span>
            </div>
            <div class="flex flex-wrap">
              <span class="font-semibold text-neutral-900 dark:text-white mr-2">Languages:</span>
              <span class="text-neutral-900 dark:text-white">{{ country.languages }}</span>
            </div>
          </div>
        </div>

        <!-- Border Countries -->
        <div v-if="country?.borders && country.borders.length > 0" class="mt-8">
          <div class="flex flex-col sm:flex-row sm:items-start sm:gap-4">
            <span
              class="font-semibold text-neutral-900 dark:text-white mb-4 sm:mb-0 sm:whitespace-nowrap"
            >
              Border Countries:
            </span>
            <div class="flex flex-wrap gap-2">
              <!-- Loading state for border countries -->
              <div v-if="isLoadingBorders" class="text-neutral-500 dark:text-neutral-400 text-sm">
                Loading border countries...
              </div>
              <!-- Border country buttons -->
              <button
                v-else
                v-for="borderCountry in safeBorderCountries"
                :key="borderCountry.cca3"
                @click="navigateToCountry(borderCountry.cca3)"
                class="px-4 py-2 bg-white dark:bg-primary text-neutral-900 dark:text-white rounded-md shadow-md hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-0 text-sm cursor-pointer"
              >
                {{ borderCountry.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Country Data -->
    <div v-else class="text-center py-12">
      <div class="text-neutral-500 dark:text-neutral-400">
        <svg class="h-16 w-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <h3 class="text-xl font-semibold mb-2">Country data not available</h3>
        <p class="mb-4">The requested country information could not be loaded.</p>
        <button
          @click="refetch"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { countriesApi } from '@/api/countries'
import type { CountryCard } from '@/types/country'
import BackButton from '@/components/ui/BackButton.vue'

interface Props {
  code: string
}

const props = defineProps<Props>()
const router = useRouter()
const route = useRoute()

// Get the country code from route params (reactive)
const countryCode = computed(() => route.params.code as string)

// Fetch country details
const {
  data: country,
  isLoading,
  error,
  refetch,
} = useQuery({
  queryKey: ['country', countryCode],
  queryFn: () => countriesApi.getByCode(countryCode.value),
  enabled: computed(() => !!countryCode.value),
})

// Fetch border countries
const { data: borderCountries = [], isLoading: isLoadingBorders } = useQuery({
  queryKey: ['border-countries', country.value?.borders],
  queryFn: () => countriesApi.getByCodes(country.value?.borders || []),
  enabled: computed(() => !!(country.value?.borders && country.value.borders.length > 0)),
})

// Ensure borderCountries is always an array
const safeBorderCountries = computed(() => borderCountries.value || [])

// Format large numbers with commas
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num)
}

// Navigate to border country
const navigateToCountry = (code: string) => {
  router.push(`/country/${code}`)
}

// Handle image loading errors
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-flag.svg'
}
</script>
