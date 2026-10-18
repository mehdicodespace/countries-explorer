import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Country } from '@/types/country'

const { mockGet } = vi.hoisted(() => ({ mockGet: vi.fn() }))

vi.mock('../config', () => ({
  createApiClient: () => ({ get: mockGet }),
}))

import { countriesApi } from '@/api/countries'

const makeCountry = (overrides: Partial<Country> = {}): Country => ({
  names: { common: 'Fiji', native: { fij: { common: 'Viti', official: 'Republic of Fiji' } } },
  codes: { alpha_3: 'FJI' },
  flag: { url_svg: 'https://flags.example/fj.svg' },
  population: 926276,
  region: 'Oceania',
  subregion: 'Melanesia',
  capitals: [{ name: 'Suva' }],
  currencies: { FJD: { name: 'Fijian dollar' } },
  languages: [{ name: 'English' }, { name: 'Fijian' }],
  tlds: ['.fj'],
  borders: [],
  ...overrides,
})

const apiResponse = (objects: Country[], total = objects.length) => ({
  data: { data: { objects, meta: { total } } },
})

describe('countriesApi', () => {
  beforeEach(() => mockGet.mockReset())

  it('loads every result page and maps API records to country cards', async () => {
    const firstPage = Array.from({ length: 100 }, (_, index) =>
      makeCountry({
        names: { common: `Country ${index}`, native: undefined },
        codes: { alpha_3: `C${String(index).padStart(2, '0')}` },
      }),
    )
    const lastCountry = makeCountry({ names: { common: 'Last Country' } })
    mockGet
      .mockResolvedValueOnce(apiResponse(firstPage, 101))
      .mockResolvedValueOnce(apiResponse([lastCountry], 101))

    const countries = await countriesApi.getAll()

    expect(countries).toHaveLength(101)
    expect(countries[0]).toEqual({
      id: 'C00',
      code: 'C00',
      name: 'Country 0',
      flag: 'https://flags.example/fj.svg',
      population: 926276,
      region: 'Oceania',
      capital: 'Suva',
    })
    expect(countries.at(-1)?.name).toBe('Last Country')
    expect(mockGet).toHaveBeenNthCalledWith(1, '', {
      params: { response_fields: expect.any(String), limit: 100, offset: 0 },
    })
    expect(mockGet).toHaveBeenNthCalledWith(2, '', {
      params: { response_fields: expect.any(String), limit: 100, offset: 100 },
    })
  })

  it('uses local flag and stable route ids for territories without API codes or flags', async () => {
    mockGet.mockResolvedValueOnce(
      apiResponse([
        makeCountry({
          names: { common: 'Somaliland' },
          codes: undefined,
          flag: undefined,
        }),
      ]),
    )

    const countries = await countriesApi.getAll()
    const country = countries[0]!

    expect(country.id).toBe('name-somaliland')
    expect(country.code).toBeUndefined()
    expect(country.flag).toBe('/flags/somaliland.svg')
  })

  it('maps country details and requests an ISO country by code', async () => {
    mockGet.mockResolvedValueOnce(apiResponse([makeCountry()]))

    const country = await countriesApi.getByCode('FJI')

    expect(country).toMatchObject({
      id: 'FJI',
      name: 'Fiji',
      nativeName: 'Viti',
      subregion: 'Melanesia',
      capital: 'Suva',
      topLevelDomain: '.fj',
      currencies: 'Fijian dollar',
      languages: 'English, Fijian',
      borders: [],
    })
    expect(mockGet).toHaveBeenCalledWith('/codes.alpha_3/FJI', {
      params: { response_fields: expect.any(String), limit: 1 },
    })
  })

  it('looks up a territory by name when its route id is local', async () => {
    mockGet.mockResolvedValueOnce(
      apiResponse([
        makeCountry({
          names: { common: 'Northern Cyprus' },
          codes: undefined,
          flag: undefined,
        }),
      ]),
    )

    const country = await countriesApi.getByCode('name-northern-cyprus')

    expect(mockGet).toHaveBeenCalledWith('/names.common/Northern%20Cyprus', {
      params: { response_fields: expect.any(String), limit: 1 },
    })
    expect(country.id).toBe('name-northern-cyprus')
    expect(country.flag).toBe('/flags/northern-cyprus.svg')
  })

  it('rejects detail requests when the API returns no country', async () => {
    mockGet.mockResolvedValueOnce(apiResponse([]))

    await expect(countriesApi.getByCode('XXX')).rejects.toThrow('Country not found')
  })
})
