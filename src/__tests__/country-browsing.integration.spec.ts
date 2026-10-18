import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { countriesApi } from '@/api/countries'
import App from '@/App.vue'
import CountryDetail from '@/views/CountryDetail.vue'
import HomeView from '@/views/HomeView.vue'
import type { CountryCard, CountryDetail as CountryDetailModel } from '@/types/country'

vi.mock('@/api/countries', () => ({
  countriesApi: {
    getAll: vi.fn(),
    getByCode: vi.fn(),
    getByCodes: vi.fn(),
  },
}))

const countries: CountryCard[] = [
  {
    id: 'IND',
    code: 'IND',
    name: 'India',
    flag: '/flags/in.svg',
    population: 1400000000,
    region: 'Asia',
    capital: 'New Delhi',
  },
  {
    id: 'JPN',
    code: 'JPN',
    name: 'Japan',
    flag: '/flags/jp.svg',
    population: 125000000,
    region: 'Asia',
    capital: 'Tokyo',
  },
  {
    id: 'SGP',
    code: 'SGP',
    name: 'Singapore',
    flag: '/flags/sg.svg',
    population: 5700000,
    region: 'Asia',
    capital: 'Singapore',
  },
  {
    id: 'FJI',
    code: 'FJI',
    name: 'Fiji',
    flag: '/flags/fj.svg',
    population: 926276,
    region: 'Oceania',
    capital: 'Suva',
  },
  {
    id: 'ATA',
    code: 'ATA',
    name: 'Antarctica',
    flag: '/flags/aq.svg',
    population: 1000,
    region: 'Antarctic',
    capital: 'N/A',
  },
]

const japanDetail: CountryDetailModel = {
  ...countries[1]!,
  nativeName: 'Nihon',
  subregion: 'Eastern Asia',
  topLevelDomain: '.jp',
  currencies: 'Japanese yen',
  languages: 'Japanese',
  borders: [],
}

describe('country browsing integration', () => {
  let wrapper: VueWrapper | undefined
  let queryClient: QueryClient

  beforeEach(() => {
    vi.mocked(countriesApi.getAll).mockResolvedValue(countries)
    vi.mocked(countriesApi.getByCode).mockResolvedValue(japanDetail)
    vi.mocked(countriesApi.getByCodes).mockResolvedValue([])
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
    queryClient?.clear()
    vi.clearAllMocks()
  })

  const mountApp = async (initialUrl = '/') => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    })
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'home', component: HomeView },
        { path: '/country/:code', name: 'country-detail', component: CountryDetail, props: true },
      ],
    })
    await router.push(initialUrl)
    await router.isReady()
    wrapper = mount(App, {
      global: {
        plugins: [createPinia(), router, [VueQueryPlugin, { queryClient }]],
        stubs: { FontAwesomeIcon: true },
      },
    })
    await flushPromises()
    return { router, wrapper }
  }

  it('restores region and sort state from the URL and applies both to the results', async () => {
    const { router, wrapper } = await mountApp('/?region=Asia&sortBy=population&sortOrder=asc')

    expect(wrapper.findAll('h3').map((heading) => heading.text())).toEqual([
      'Singapore',
      'Japan',
      'India',
    ])
    expect(wrapper.text()).not.toContain('Fiji')
    expect(router.currentRoute.value.query).toMatchObject({
      region: 'Asia',
      sortBy: 'population',
      sortOrder: 'asc',
    })
  })

  it('accepts every configured region from the URL, including Antarctic', async () => {
    const { wrapper } = await mountApp('/?region=Antarctic')

    expect(wrapper.findAll('h3').map((heading) => heading.text())).toEqual(['Antarctica'])
    expect(wrapper.findAll('button').some((button) => button.text() === 'Antarctic')).toBe(true)
  })

  it('searches countries and writes the query string as the search changes', async () => {
    const { router, wrapper } = await mountApp()

    await wrapper.get('input[placeholder="Search for a country..."]').setValue('Fiji')
    await flushPromises()

    expect(wrapper.findAll('h3').map((heading) => heading.text())).toEqual(['Fiji'])
    expect(router.currentRoute.value.query.search).toBe('Fiji')

    await wrapper.get('input[placeholder="Search for a country..."]').setValue('')
    await flushPromises()

    expect(wrapper.findAll('h3')).toHaveLength(countries.length)
    expect(router.currentRoute.value.query.search).toBeUndefined()
  })

  it('opens a country detail page with the requested country data', async () => {
    const { router, wrapper } = await mountApp()

    await wrapper.findAll('h3').at(1)!.trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.fullPath).toBe('/country/JPN')
    expect(countriesApi.getByCode).toHaveBeenCalledWith('JPN')
    expect(wrapper.get('main h1').text()).toBe('Japan')
    expect(wrapper.text()).toContain('Japanese yen')
  })
})
