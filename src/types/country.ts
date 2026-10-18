export interface Country {
  names: {
    common: string
    native?: Record<string, { common: string; official: string }>
  }
  codes?: {
    alpha_3?: string
  }
  flag?: {
    url_svg?: string
  }
  population: number
  region: string
  subregion?: string
  capitals?: { name: string } | { name: string }[]
  currencies?: { name: string } | Record<string, { name: string }>
  languages?: { name: string }[]
  tlds?: string | string[]
  borders?: string | string[]
}

export interface CountryCard {
  id: string
  code?: string
  name: string
  flag: string
  population: number
  region: string
  capital: string
}

export interface CountryDetail extends CountryCard {
  nativeName: string
  subregion: string
  topLevelDomain: string
  currencies: string
  languages: string
  borders: string[]
}

export interface CountriesResponse {
  data: {
    objects: Country[]
    meta: {
      total: number
    }
  }
}

export interface CountryFilters {
  search: string
  region: string
}

export const REGIONS = [
  'All',
  'Africa',
  'Americas',
  'Asia',
  'Europe',
  'Oceania',
  'Antarctic',
] as const

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
