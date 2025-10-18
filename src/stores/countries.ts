import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import Fuse from 'fuse.js';
import { countriesApi } from '@/api/countries';
import type { Region, CountryCard } from '@/types/country';

export const useCountriesStore = defineStore('countries', () => {
  // Filter state
  const searchQuery = ref('');
  const selectedRegion = ref<Region>('All');

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
      const fuse = new Fuse(filtered, {
        keys: ['name'],
        threshold: 0.4, // 0 = perfect match, 1 = match anything
        includeScore: true,
        minMatchCharLength: 2,
      });
      
      const results = fuse.search(searchQuery.value);
      filtered = results.map(result => result.item);
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

  const clearFilters = () => {
    searchQuery.value = '';
    selectedRegion.value = 'All';
  };

  return {
    // State
    countries,
    searchQuery,
    selectedRegion,
    isLoading,
    error,
    hasCountries,
    
    // Actions
    updateSearch,
    updateRegion,
    clearFilters,
    refetch,
  };
});
