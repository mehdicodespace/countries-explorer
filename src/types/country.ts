export interface Country {
  name: {
    common: string
    official: string
    nativeName?: {
      [key: string]: {
        official: string
        common: string
      }
    }
  }
  flags: {
    png: string
    svg: string
    alt?: string
  }
  population: number
  region: string
  subregion?: string
  capital: string[]
  cca3: string
  cca2?: string
  currencies?: {
    [key: string]: {
      name: string
      symbol: string
    }
  }
  languages?: {
    [key: string]: string
  }
  tld?: string[]
  borders?: string[]
}

export interface CountryCard {
  name: string
  flag: string
  population: number
  region: string
  capital: string
  cca3: string
}

export interface CountryDetail {
  name: string
  nativeName: string
  population: number
  region: string
  subregion: string
  capital: string
  flag: string
  topLevelDomain: string
  currencies: string
  languages: string
  borders: string[]
  cca3: string
}

export type CountriesResponse = Country[]

export interface CountryFilters {
  search: string
  region: string
}

export const REGIONS = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'] as const

export type Region = (typeof REGIONS)[number]

export type SortBy = 'name' | 'population'
export type SortOrder = 'asc' | 'desc'

export const SORT_BY_OPTIONS = [
  { value: 'name' as const, label: 'Name' },
  { value: 'population' as const, label: 'Population' },
] as const

export const SORT_ORDER_OPTIONS = [
  { value: 'asc' as const, label: 'Ascending' },
  { value: 'desc' as const, label: 'Descending' },
] as const
