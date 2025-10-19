<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { countriesApi } from '@/api/countries'
import type { CountryCard } from '@/types/country'
import BackButton from '@/components/ui/BackButton.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

interface Props {
  code: string
}

const props = defineProps<Props>()
const router = useRouter()
const route = useRoute()

const countryCode = computed(() => route.params.code as string)

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

const { data: borderCountries = [], isLoading: isLoadingBorders } = useQuery({
  queryKey: ['border-countries', countryCode],
  queryFn: async () => {
    if (!country.value?.borders || country.value.borders.length === 0) {
      return []
    }
    return countriesApi.getByCodes(country.value.borders)
  },
  enabled: computed(() => !!(country.value?.borders && country.value.borders.length > 0)),
  staleTime: 0,
})

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num)
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-flag.svg'
}
</script>

<template>
  <div>
    <!-- Back Button -->
    <div class="mb-8">
      <BackButton />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="py-12">
      <LoadingSpinner size="lg" text="Loading country details..." />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-500 dark:text-red-400 mb-4">
        <font-awesome-icon icon="exclamation-triangle" class="text-6xl mx-auto mb-6 text-red-400" />
        <h3 class="text-xl font-semibold mb-2">Failed to load country</h3>
        <p class="text-neutral-500 dark:text-neutral-400 mb-4">{{ error.message }}</p>
        <button
          @click="() => refetch()"
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
              <div v-if="isLoadingBorders" class="text-sm">
                <LoadingSpinner size="sm" text="Loading border countries..." :centered="false" />
              </div>
              <!-- Border country buttons -->
              <template v-else-if="borderCountries && borderCountries.length > 0">
                <button
                  v-for="borderCountry in borderCountries"
                  :key="borderCountry.cca3"
                  @click="router.push(`/country/${borderCountry.cca3}`)"
                  class="px-4 py-2 bg-white dark:bg-primary text-neutral-900 dark:text-white rounded-md shadow-md hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-0 text-sm cursor-pointer"
                >
                  {{ borderCountry.name }}
                </button>
              </template>
              <!-- No border countries -->
              <div v-else class="text-neutral-500 dark:text-neutral-400 text-sm">
                No border countries
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Country Data -->
    <div v-else class="text-center py-12">
      <div class="text-neutral-500 dark:text-neutral-400">
        <font-awesome-icon
          icon="search"
          class="text-6xl mx-auto mb-6 text-neutral-300 dark:text-neutral-600"
        />
        <h3 class="text-2xl font-semibold mb-2">Country data not available</h3>
        <p class="text-lg mb-4">The requested country information could not be loaded.</p>
        <button
          @click="() => refetch()"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
</template>
