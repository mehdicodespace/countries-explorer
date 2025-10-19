import type { Country, CountryCard, CountryDetail } from '@/types/country'
import { createApiClient } from './config'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://restcountries.com/v3.1'
export const apiClient = createApiClient(API_BASE_URL)

const transformCountry = (country: Country): CountryCard => ({
  name: country.name.common,
  flag: country.flags.svg,
  population: country.population,
  region: country.region,
  capital: country.capital?.[0] || 'N/A',
  cca3: country.cca3,
})

const transformCountryDetail = (country: Country): CountryDetail => {
  const nativeName = country.name.nativeName
    ? Object.values(country.name.nativeName)[0]?.common || country.name.common
    : country.name.common

  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map((c) => c.name)
        .join(', ')
    : 'N/A'

  const languages = country.languages ? Object.values(country.languages).join(', ') : 'N/A'
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

export const countriesApi = {
  getAll: async (): Promise<CountryCard[]> => {
    const response = await apiClient.get<Country[]>(
      '/all?fields=name,flags,population,region,capital,cca3',
    )
    return response.data.map(transformCountry)
  },

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

  getByCodes: async (codes: string[]): Promise<CountryCard[]> => {
    const codesString = codes.join(',')
    const response = await apiClient.get<Country[]>(
      `/alpha?codes=${codesString}&fields=name,flags,population,region,capital,cca3`,
    )
    return response.data.map(transformCountry)
  },
}
