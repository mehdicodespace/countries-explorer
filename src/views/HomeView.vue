<template>
  <div>
    <!-- Search and Filter Controls -->
    <div class="flex flex-col lg:flex-row lg:flex-wrap lg:justify-between lg:items-end gap-6 mb-8">
      <!-- Search Input -->
      <div class="w-full lg:w-auto lg:flex-shrink-0">
        <SearchInput v-model="searchQuery" @search="handleSearch" :has-error="!!error" />
      </div>

      <!-- Filter Controls -->
      <div
        class="flex flex-col sm:flex-row sm:flex-wrap gap-4 lg:flex-nowrap lg:flex-shrink-0 min-w-0"
      >
        <!-- Region Filter -->
        <div class="flex-1 sm:flex-none sm:min-w-0">
          <div
            class="cursor-pointer"
            @click="regionDropdownRef?.$el.querySelector('button')?.click()"
          >
            <label
              class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <font-awesome-icon icon="globe" class="h-4 w-4" />
              Region
            </label>
            <div @click.stop>
              <DropdownInput
                ref="regionDropdownRef"
                v-model="selectedRegion"
                :options="regionOptions"
                placeholder="Filter by Region"
                width="w-full sm:w-48"
              />
            </div>
          </div>
        </div>

        <!-- Sort By Filter -->
        <div class="flex-1 sm:flex-none sm:min-w-0">
          <div
            class="cursor-pointer"
            @click="sortByDropdownRef?.$el.querySelector('button')?.click()"
          >
            <label
              class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <font-awesome-icon icon="sort" class="h-4 w-4" />
              Sort By
            </label>
            <div @click.stop>
              <DropdownInput
                ref="sortByDropdownRef"
                v-model="sortBy"
                :options="sortByOptions"
                placeholder="Sort by..."
                width="w-full sm:w-40"
              />
            </div>
          </div>
        </div>

        <!-- Sort Order Filter -->
        <div class="flex-1 sm:flex-none sm:min-w-0">
          <div
            class="cursor-pointer"
            @click="sortOrderDropdownRef?.$el.querySelector('button')?.click()"
          >
            <label
              class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <font-awesome-icon icon="arrows-up-down" class="h-4 w-4" />
              Order
            </label>
            <div @click.stop>
              <DropdownInput
                ref="sortOrderDropdownRef"
                v-model="sortOrder"
                :options="sortOrderOptions"
                placeholder="Order..."
                width="w-full sm:w-32"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="ml-4 text-neutral-500 dark:text-neutral-400">Loading countries...</p>
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
        <h3 class="text-xl font-semibold mb-2">Failed to load countries</h3>
        <p class="text-neutral-500 dark:text-neutral-400 mb-4">{{ error.message }}</p>
        <button
          @click="() => refetch()"
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
        @click="handleCountryClick"
      />
    </div>

    <!-- Empty State - Only show when loading is finished and no countries -->
    <div v-else-if="!isLoading && !error && !hasCountries" class="text-center py-12">
      <div class="text-neutral-500 dark:text-neutral-400">
        <svg class="h-16 w-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <h3 class="text-xl font-semibold mb-2">No countries found</h3>
        <p class="mb-4">
          {{
            searchQuery || selectedRegion !== 'All'
              ? 'Try adjusting your search or filter criteria.'
              : 'No countries available at the moment.'
          }}
        </p>
        <button
          v-if="searchQuery || selectedRegion !== 'All'"
          @click="clearFilters"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Clear Filters
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useCountriesStore } from '@/stores/countries'
import { useThemeStore } from '@/stores/theme'
import type { CountryCard as CountryCardType, Region } from '@/types/country'
import { SORT_BY_OPTIONS, SORT_ORDER_OPTIONS, REGIONS } from '@/types/country'
import CountryCard from '@/components/country/CountryCard.vue'
import SearchInput from '@/components/ui/forms/SearchInput.vue'
import DropdownInput from '@/components/ui/forms/DropdownInput.vue'

const router = useRouter()
const countriesStore = useCountriesStore()

// Dropdown refs
const regionDropdownRef = ref()
const sortByDropdownRef = ref()
const sortOrderDropdownRef = ref()

// Get reactive store data
const {
  countries,
  searchQuery,
  selectedRegion,
  sortBy,
  sortOrder,
  isLoading,
  error,
  hasCountries,
} = storeToRefs(countriesStore)

// Get store actions
const { updateSearch, updateRegion, updateSortBy, updateSortOrder, clearFilters, refetch } =
  countriesStore

// Dropdown options
const regionOptions = REGIONS.map((region) => ({
  value: region,
  label: region === 'All' ? 'All Regions' : region,
}))

const sortByOptions = SORT_BY_OPTIONS.map((option) => ({
  value: option.value,
  label: option.label,
}))

const sortOrderOptions = SORT_ORDER_OPTIONS.map((option) => ({
  value: option.value,
  label: option.label,
}))

// Handle search input
const handleSearch = (query: string) => {
  updateSearch(query)
}

// Watch for dropdown changes
watch(selectedRegion, (newRegion) => {
  updateRegion(newRegion)
})

watch(sortBy, (newSortBy) => {
  updateSortBy(newSortBy)
})

watch(sortOrder, (newSortOrder) => {
  updateSortOrder(newSortOrder)
})

// Handle country card click
const handleCountryClick = (country: CountryCardType) => {
  router.push(`/country/${country.cca3}`)
}
</script>
