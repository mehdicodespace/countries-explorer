<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCountriesStore } from '@/stores/countries'
import { SORT_BY_OPTIONS, SORT_ORDER_OPTIONS, REGIONS } from '@/types/country'
import SearchInput from '@/components/ui/forms/SearchInput.vue'
import DropdownInput from '@/components/ui/forms/DropdownInput.vue'

const countriesStore = useCountriesStore()

const regionDropdownRef = ref()
const sortByDropdownRef = ref()
const sortOrderDropdownRef = ref()

const { searchQuery, selectedRegion, sortBy, sortOrder, error } = storeToRefs(countriesStore)

const { updateSearch, updateRegion, updateSortBy, updateSortOrder } = countriesStore

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

const handleSearch = (query: string) => {
  updateSearch(query)
}

watch(selectedRegion, (newRegion) => {
  updateRegion(newRegion)
})

watch(sortBy, (newSortBy) => {
  updateSortBy(newSortBy)
})

watch(sortOrder, (newSortOrder) => {
  updateSortOrder(newSortOrder)
})
</script>

<template>
  <div class="flex flex-col lg:flex-row lg:flex-wrap lg:justify-between lg:items-end gap-6">
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
              width="w-full sm:w-36"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
