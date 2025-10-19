import type { Country, CountryCard, CountryDetail } from '@/types/country'
import { createApiClient } from './config'

// Create API client
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://restcountries.com/v3.1'
export const apiClient = createApiClient(API_BASE_URL)

// Transform country data for home page
const transformCountry = (country: Country): CountryCard => ({
  name: country.name.common,
  flag: country.flags.svg,
  population: country.population,
  region: country.region,
  capital: country.capital?.[0] || 'N/A',
  cca3: country.cca3,
})

// Transform country data for detail page
const transformCountryDetail = (country: Country): CountryDetail => {
  // Get native name (first available native name)
  const nativeName = country.name.nativeName
    ? Object.values(country.name.nativeName)[0]?.common || country.name.common
    : country.name.common

  // Format currencies
  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map((c) => c.name)
        .join(', ')
    : 'N/A'

  // Format languages
  const languages = country.languages ? Object.values(country.languages).join(', ') : 'N/A'

  // Format top level domain
  const topLevelDomain = country.tld?.[0] || 'N/A'

  return {
    name: country.name.common,
    nativeName,
    population: country.population,
    region: country.region,
    subregion: country.subregion || 'N/A',
    capital: country.capital?.[0] || 'N/A',
    flag: country.flags.svg,
    topLevelDomain,
    currencies,
    languages,
    borders: country.borders || [],
    cca3: country.cca3,
  }
}

// API functions
export const countriesApi = {
  // Fetch all countries
  getAll: async (): Promise<CountryCard[]> => {
    const response = await apiClient.get<Country[]>(
      '/all?fields=name,flags,population,region,capital,cca3',
    )
    return response.data.map(transformCountry)
  },

  // Fetch single country by code
  getByCode: async (code: string): Promise<CountryDetail> => {
    try {
      const response = await apiClient.get<Country>(
        `/alpha/${code}?fields=name,flags,population,region,subregion,capital,currencies,languages,tld,borders,cca3`,
      )

      if (!response.data) {
        throw new Error('Country not found')
      }

      const country = response.data
      if (!country || !country.name) {
        throw new Error('Invalid country data received')
      }

      return transformCountryDetail(country)
    } catch (error) {
      console.error('Error fetching country:', error)
      throw error
    }
  },

  // Fetch countries by codes (for border countries)
  getByCodes: async (codes: string[]): Promise<CountryCard[]> => {
    const codesString = codes.join(',')
    const response = await apiClient.get<Country[]>(
      `/alpha?codes=${codesString}&fields=name,flags,population,region,capital,cca3`,
    )
    return response.data.map(transformCountry)
  },
}
