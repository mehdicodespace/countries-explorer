import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useRoute, useRouter } from 'vue-router'
import Fuse from 'fuse.js'
import { countriesApi } from '@/api/countries'
import type { Region, CountryCard, SortBy, SortOrder } from '@/types/country'

export const useCountriesStore = defineStore('countries', () => {
  const route = useRoute()
  const router = useRouter()

  const searchQuery = ref('')
  const selectedRegion = ref<Region>('All')
  const sortBy = ref<SortBy | null>(null)
  const sortOrder = ref<SortOrder>('asc')

  const initializeFiltersFromURL = () => {
    const query = route.query

    searchQuery.value = (query.search as string) || ''

    const region = query.region as string
    const validRegions: Region[] = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania']
    selectedRegion.value = validRegions.includes(region as Region) ? (region as Region) : 'All'

    const sortByParam = query.sortBy as string
    const validSortBy: (SortBy | null)[] = ['name', 'population', null]
    sortBy.value = validSortBy.includes(sortByParam as SortBy) ? (sortByParam as SortBy) : null

    const sortOrderParam = query.sortOrder as string
    const validSortOrder: SortOrder[] = ['asc', 'desc']
    sortOrder.value = validSortOrder.includes(sortOrderParam as SortOrder)
      ? (sortOrderParam as SortOrder)
      : 'asc'
  }

  initializeFiltersFromURL()

  const {
    data: allCountries,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['countries'],
    queryFn: countriesApi.getAll,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
  })

  const countries = computed(() => {
    if (!allCountries.value) return []

    let filtered = allCountries.value

    if (selectedRegion.value !== 'All') {
      filtered = filtered.filter((country) => country.region === selectedRegion.value)
    }

    if (searchQuery.value.trim()) {
      const query = searchQuery.value.trim().toLowerCase()

      let exactMatches = filtered.filter((country) => country.name.toLowerCase().includes(query))

      if (exactMatches.length > 0) {
        filtered = exactMatches
      } else {
        const fuse = new Fuse(filtered, {
          keys: ['name'],
          threshold: 0.45,
          includeScore: true,
          ignoreLocation: true,
          findAllMatches: true,
        })

        const results = fuse.search(searchQuery.value)
        filtered = results.map((result) => result.item)
      }
    }

    if (sortBy.value) {
      const sorted = [...filtered].sort((a, b) => {
        let comparison = 0

        if (sortBy.value === 'name') {
          comparison = a.name.localeCompare(b.name)
        } else if (sortBy.value === 'population') {
          comparison = a.population - b.population
        }

        return sortOrder.value === 'desc' ? -comparison : comparison
      })

      return sorted
    }

    return filtered
  })

  const hasCountries = computed(() => countries.value.length > 0)

  // Actions
  const updateSearch = (query: string) => {
    searchQuery.value = query
  }

  const updateRegion = (region: Region) => {
    selectedRegion.value = region
  }

  const updateSortBy = (by: SortBy | null) => {
    sortBy.value = by
  }

  const updateSortOrder = (order: SortOrder) => {
    sortOrder.value = order
  }

  const clearFilters = () => {
    searchQuery.value = ''
    selectedRegion.value = 'All'
    sortBy.value = null
    sortOrder.value = 'asc'
  }

  // Update URL with current filter state
  const updateURL = () => {
    const query: Record<string, string> = {}

    if (searchQuery.value) {
      query.search = searchQuery.value
    }

    if (selectedRegion.value !== 'All') {
      query.region = selectedRegion.value
    }

    if (sortBy.value) {
      query.sortBy = sortBy.value
      query.sortOrder = sortOrder.value
    }

    router.replace({ query })
  }

  watch(
    [searchQuery, selectedRegion, sortBy, sortOrder],
    () => {
      updateURL()
    },
    { deep: true },
  )

  return {
    countries,
    searchQuery,
    selectedRegion,
    sortBy,
    sortOrder,
    isLoading,
    error,
    hasCountries,
    updateSearch,
    updateRegion,
    updateSortBy,
    updateSortOrder,
    clearFilters,
    refetch,
  }
})
