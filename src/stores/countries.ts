import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { useRoute, useRouter } from 'vue-router';
import Fuse from 'fuse.js';
import { countriesApi } from '@/api/countries';
import type { Region, CountryCard, SortBy, SortOrder } from '@/types/country';

export const useCountriesStore = defineStore('countries', () => {
  // Router for URL synchronization
  const route = useRoute();
  const router = useRouter();

  // Filter state
  const searchQuery = ref('');
  const selectedRegion = ref<Region>('All');
  const sortBy = ref<SortBy | null>(null);
  const sortOrder = ref<SortOrder>('asc');

  // Initialize filters from URL query parameters
  const initializeFiltersFromURL = () => {
    const query = route.query;
    
    // Initialize search query
    searchQuery.value = (query.search as string) || '';
    
    // Initialize region (validate against allowed regions)
    const region = query.region as string;
    const validRegions: Region[] = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
    selectedRegion.value = validRegions.includes(region as Region) ? (region as Region) : 'All';
    
    // Initialize sort by (validate against allowed values)
    const sortByParam = query.sortBy as string;
    const validSortBy: (SortBy | null)[] = ['name', 'population', null];
    sortBy.value = validSortBy.includes(sortByParam as SortBy) ? (sortByParam as SortBy) : null;
    
    // Initialize sort order (validate against allowed values)
    const sortOrderParam = query.sortOrder as string;
    const validSortOrder: SortOrder[] = ['asc', 'desc'];
    sortOrder.value = validSortOrder.includes(sortOrderParam as SortOrder) ? (sortOrderParam as SortOrder) : 'asc';
  };

  // Initialize filters from URL on store creation
  initializeFiltersFromURL();

  // Fetch all countries once
  const { 
    data: allCountries, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['countries'],
    queryFn: countriesApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
    retry: 3,                  // Retry failed requests
    retryDelay: 1000,          // 1 second between retries
  });

  // Client-side filtering with fuzzy search
  const countries = computed(() => {
    if (!allCountries.value) return [];
    
    let filtered = allCountries.value;
    
    // Filter by region first
    if (selectedRegion.value !== 'All') {
      filtered = filtered.filter(country => country.region === selectedRegion.value);
    }
    
    // Fuzzy search for country names (bonus point requirement)
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.trim().toLowerCase();
      
      // First try exact substring match for better performance
      let exactMatches = filtered.filter(country => 
        country.name.toLowerCase().includes(query)
      );
      
      // If we have exact matches, use them. Otherwise, use fuzzy search for typos
      if (exactMatches.length > 0) {
        filtered = exactMatches;
      } else {
        // Use fuzzy search for typo tolerance
        const fuse = new Fuse(filtered, {
          keys: ['name'],
          threshold: 0.45,
          includeScore: true,
          ignoreLocation: true,
          findAllMatches: true,
        });
        
        const results = fuse.search(searchQuery.value);
        filtered = results.map(result => result.item);
      }
    }
    
    // Sort the filtered results only if sortBy is selected
    if (sortBy.value) {
      const sorted = [...filtered].sort((a, b) => {
        let comparison = 0;
        
        if (sortBy.value === 'name') {
          comparison = a.name.localeCompare(b.name);
        } else if (sortBy.value === 'population') {
          comparison = a.population - b.population;
        }
        
        return sortOrder.value === 'desc' ? -comparison : comparison;
      });
      
      return sorted;
    }
    
    return filtered;
  });

  const hasCountries = computed(() => countries.value.length > 0);

  // Actions
  const updateSearch = (query: string) => {
    searchQuery.value = query;
  };

  const updateRegion = (region: Region) => {
    selectedRegion.value = region;
  };

  const updateSortBy = (by: SortBy | null) => {
    sortBy.value = by;
  };

  const updateSortOrder = (order: SortOrder) => {
    sortOrder.value = order;
  };

  const clearFilters = () => {
    searchQuery.value = '';
    selectedRegion.value = 'All';
    sortBy.value = null;
    sortOrder.value = 'asc';
  };

  // Update URL with current filter state
  const updateURL = () => {
    const query: Record<string, string> = {};
    
    if (searchQuery.value) {
      query.search = searchQuery.value;
    }
    
    if (selectedRegion.value !== 'All') {
      query.region = selectedRegion.value;
    }
    
    if (sortBy.value) {
      query.sortBy = sortBy.value;
      query.sortOrder = sortOrder.value;
    }
    
    // Update URL without triggering navigation
    router.replace({ query });
  };

  // Watch for filter changes and update URL
  watch([searchQuery, selectedRegion, sortBy, sortOrder], () => {
    updateURL();
  }, { deep: true });

  return {
    // State
    countries,
    searchQuery,
    selectedRegion,
    sortBy,
    sortOrder,
    isLoading,
    error,
    hasCountries,
    
    // Actions
    updateSearch,
    updateRegion,
    updateSortBy,
    updateSortOrder,
    clearFilters,
    refetch,
  };
});
