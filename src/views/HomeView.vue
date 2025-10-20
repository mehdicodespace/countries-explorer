<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCountriesStore } from '@/stores/countries'
import { useMetadata } from '@/composables/useMetadata'
import type { CountryCard as CountryCardType } from '@/types/country'
import CountryCard from '@/components/country/CountryCard.vue'
import CountryFilters from '@/components/country/CountryFilters.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const router = useRouter()
const countriesStore = useCountriesStore()
const { updateMetadata } = useMetadata()

const { countries, isLoading, error, hasCountries } = storeToRefs(countriesStore)

// Set page metadata when component mounts
onMounted(() => {
  updateMetadata(
    'REST Countries API - Home',
    'Discover countries around the world. Search, filter, and explore detailed information about 195+ countries including population, region, capital, and more.',
    'countries, world map, country search, population, geography, flags, capitals, regions, world statistics, country data',
  )
})
</script>

<template>
  <div>
    <!-- Search and Filter Controls -->
    <div class="mb-8">
      <CountryFilters />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="py-12">
      <LoadingSpinner size="lg" text="Loading countries..." />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-500 dark:text-red-400 mb-4">
        <font-awesome-icon icon="exclamation-triangle" class="text-6xl mx-auto mb-6 text-red-400" />
        <h3 class="text-xl font-semibold mb-2">Failed to load countries</h3>
        <p class="text-neutral-500 dark:text-neutral-400 mb-4">{{ error.message }}</p>
        <button
          @click="() => countriesStore.refetch()"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Countries Grid -->
    <div
      v-if="!isLoading && !error && hasCountries"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-12"
    >
      <CountryCard
        v-for="country in countries"
        :key="country.cca3"
        :country="country"
        @click="(country) => router.push(`/country/${country.cca3}`)"
      />
    </div>

    <!-- Empty State - Only show when loading is finished and no countries -->
    <div v-else-if="!isLoading && !error && !hasCountries" class="text-center py-12">
      <div class="text-neutral-500 dark:text-neutral-400">
        <font-awesome-icon
          icon="search"
          class="text-6xl mx-auto mb-6 text-neutral-70 dark:text-neutral-300"
        />
        <h3 class="text-2xl font-semibold mb-2">No countries found</h3>
        <p class="text-lg mb-4">No countries available at the moment.</p>
      </div>
    </div>
  </div>
</template>
