import type { Country, CountriesResponse, CountryCard, CountryDetail } from '@/types/country'
import { createApiClient } from './config'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/countries/v5'
const PAGE_SIZE = 100
const LIST_FIELDS = 'names.common,codes.alpha_3,flag.url_svg,population,region,capitals'
const DETAIL_FIELDS =
  'names.common,names.native,codes.alpha_3,flag.url_svg,population,region,subregion,capitals,currencies,languages,tlds,borders'

// The API dataset also includes a few territories without ISO codes or hosted flag images.
const LOCAL_FLAG_OVERRIDES: Record<string, string> = {
  Abkhazia: '/flags/abkhazia.svg',
  'Northern Cyprus': '/flags/northern-cyprus.svg',
  Somaliland: '/flags/somaliland.svg',
  'South Ossetia': '/flags/south-ossetia.svg',
}

const createCountryId = (name: string) =>
  `name-${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`

const getLocalCountryName = (id: string) =>
  Object.keys(LOCAL_FLAG_OVERRIDES).find((name) => createCountryId(name) === id)

export const apiClient = createApiClient(API_BASE_URL)

const toArray = <T>(value: T | T[] | null | undefined): T[] => {
  if (value == null) return []
  return Array.isArray(value) ? value : [value]
}

const normalizeCurrencies = (value: Country['currencies']): { name: string }[] => {
  if (!value) return []
  if (Array.isArray(value)) return value
  if ('name' in value && typeof (value as { name?: unknown }).name === 'string') {
    return [value as { name: string }]
  }
  return Object.values(value as Record<string, { name: string }>)
}

const transformCountry = (country: Country): CountryCard => ({
  id: country.codes?.alpha_3 || createCountryId(country.names.common),
  code: country.codes?.alpha_3,
  name: country.names.common,
  flag:
    country.flag?.url_svg || LOCAL_FLAG_OVERRIDES[country.names.common] || '/placeholder-flag.svg',
  population: country.population,
  region: country.region,
  capital: toArray(country.capitals)[0]?.name || 'N/A',
})

const transformCountryDetail = (country: Country): CountryDetail => {
  const nativeName = Object.values(country.names.native ?? {})[0]?.common || country.names.common
  const currencies = normalizeCurrencies(country.currencies)
    .map((currency) => currency.name)
    .filter(Boolean)
    .join(', ')
  const languages = toArray(country.languages)
    .map((language) => language.name)
    .filter(Boolean)
    .join(', ')

  return {
    ...transformCountry(country),
    nativeName,
    subregion: country.subregion || 'N/A',
    topLevelDomain: toArray(country.tlds).join(', ') || 'N/A',
    currencies: currencies || 'N/A',
    languages: languages || 'N/A',
    borders: toArray(country.borders),
  }
}

const getObjects = async (params: Record<string, string | number>) => {
  const response = await apiClient.get<CountriesResponse>('', { params })
  return response.data.data
}

export const countriesApi = {
  getAll: async (): Promise<CountryCard[]> => {
    const firstPage = await getObjects({
      response_fields: LIST_FIELDS,
      limit: PAGE_SIZE,
      offset: 0,
    })
    const pages = [firstPage.objects]

    for (let offset = PAGE_SIZE; offset < firstPage.meta.total; offset += PAGE_SIZE) {
      const page = await getObjects({ response_fields: LIST_FIELDS, limit: PAGE_SIZE, offset })
      pages.push(page.objects)
    }

    return pages.flat().map(transformCountry)
  },

  getByCode: async (code: string): Promise<CountryDetail> => {
    const localCountryName = getLocalCountryName(code)
    const endpoint = localCountryName
      ? `/names.common/${encodeURIComponent(localCountryName)}`
      : `/codes.alpha_3/${encodeURIComponent(code)}`
    const response = await apiClient.get<CountriesResponse>(endpoint, {
      params: { response_fields: DETAIL_FIELDS, limit: 1 },
    })
    const country = response.data.data.objects[0]

    if (!country) {
      throw new Error('Country not found')
    }

    return transformCountryDetail(country)
  },

  getByCodes: async (codes: string[]): Promise<CountryCard[]> => {
    const countries = await Promise.all(codes.map((code) => countriesApi.getByCode(code)))
    return countries.map((country) => ({
      id: country.id,
      code: country.code,
      name: country.name,
      flag: country.flag,
      population: country.population,
      region: country.region,
      capital: country.capital,
    }))
  },
}
