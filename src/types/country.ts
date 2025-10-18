// Country data interfaces based on REST Countries API v3.1
export interface Country {
  name: {
    common: string;
    official: string;
    nativeName?: {
      [key: string]: {
        official: string;
        common: string;
      };
    };
  };
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  population: number;
  region: string;
  capital: string[];
  cca3: string; // Country code for border countries
}

// Simplified country interface for the home page
export interface CountryCard {
  name: string;
  flag: string;
  population: number;
  region: string;
  capital: string;
  cca3: string;
}

// API response types
export interface CountriesResponse extends Array<Country> {}

// Filter and search types
export interface CountryFilters {
  search: string;
  region: string;
}

// Regions for the filter dropdown
export const REGIONS = [
  'All',
  'Africa',
  'Americas', 
  'Asia',
  'Europe',
  'Oceania'
] as const;

export type Region = typeof REGIONS[number];
