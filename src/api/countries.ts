import type { Country, CountryCard } from '@/types/country';
import { createApiClient } from './config';

// Create API client
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://restcountries.com/v3.1';
export const apiClient = createApiClient(API_BASE_URL);

// Transform country data
const transformCountry = (country: Country): CountryCard => ({
  name: country.name.common,
  flag: country.flags.svg,
  population: country.population,
  region: country.region,
  capital: country.capital?.[0] || 'N/A',
  cca3: country.cca3,
});

// API functions
export const countriesApi = {
  // Fetch all countries
  getAll: async (): Promise<CountryCard[]> => {
    const response = await apiClient.get<Country[]>('/all?fields=name,flags,population,region,capital,cca3');
    return response.data.map(transformCountry);
  },
};
