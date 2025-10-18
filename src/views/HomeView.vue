<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-primary-900">
    <!-- Header -->
    <header class="bg-neutral-0 dark:bg-primary shadow-md">
      <div class="w-[92%] mx-auto px-6 py-6">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-extrabold text-neutral-900 dark:text-neutral-0">
            Where in the world?
          </h1>
          <ThemeToggle />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="w-[92%] mx-auto px-6 py-8">
      <!-- Search and Filter Controls -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <SearchInput 
          v-model="searchQuery"
          @search="handleSearch"
          :has-error="!!error"
        />
        <RegionFilter 
          v-model="selectedRegion"
          @change="handleRegionChange"
        />
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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
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
      <div v-if="!isLoading && !error && hasCountries" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-16">
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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 class="text-xl font-semibold mb-2">No countries found</h3>
          <p class="mb-4">
            {{ searchQuery || selectedRegion !== 'All' 
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
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useCountriesStore } from '@/stores/countries';
import { useThemeStore } from '@/stores/theme';
import type { CountryCard as CountryCardType, Region } from '@/types/country';
import CountryCard from '@/components/country/CountryCard.vue';
import SearchInput from '@/components/ui/SearchInput.vue';
import RegionFilter from '@/components/ui/RegionFilter.vue';
import ThemeToggle from '@/components/ui/ThemeToggle.vue';

const router = useRouter();
const countriesStore = useCountriesStore();

// Get reactive store data
const { 
  countries, 
  searchQuery, 
  selectedRegion, 
  isLoading, 
  error, 
  hasCountries,
  updateSearch,
  updateRegion,
  clearFilters,
  refetch 
} = storeToRefs(countriesStore);

// Handle search input
const handleSearch = (query: string) => {
  updateSearch(query);
};

// Handle region change
const handleRegionChange = (region: Region) => {
  updateRegion(region);
};

// Handle country card click
const handleCountryClick = (country: CountryCardType) => {
  // For now, just log the click - detail page will be implemented later
  console.log('Country clicked:', country);
  // router.push(`/country/${country.cca3}`);
};
</script>
