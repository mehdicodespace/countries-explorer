import { expect, test } from '@playwright/test'

const apiCountries = [
  {
    names: {
      common: 'India',
      native: { hin: { common: 'Bhārat', official: 'Republic of India' } },
    },
    codes: { alpha_3: 'IND' },
    flag: { url_svg: 'https://flags.example/india.svg' },
    population: 1_400_000_000,
    region: 'Asia',
    subregion: 'Southern Asia',
    capitals: [{ name: 'New Delhi' }],
    currencies: [{ name: 'Indian rupee' }],
    languages: [{ name: 'Hindi' }],
    tlds: ['.in'],
    borders: [],
  },
  {
    names: { common: 'Japan', native: { jpn: { common: 'Nihon', official: 'Japan' } } },
    codes: { alpha_3: 'JPN' },
    flag: { url_svg: 'https://flags.example/japan.svg' },
    population: 125_000_000,
    region: 'Asia',
    subregion: 'Eastern Asia',
    capitals: [{ name: 'Tokyo' }],
    currencies: [{ name: 'Japanese yen' }],
    languages: [{ name: 'Japanese' }],
    tlds: ['.jp'],
    borders: [],
  },
  {
    names: { common: 'Fiji', native: { fij: { common: 'Viti', official: 'Republic of Fiji' } } },
    codes: { alpha_3: 'FJI' },
    flag: { url_svg: 'https://flags.example/fiji.svg' },
    population: 926_276,
    region: 'Oceania',
    subregion: 'Melanesia',
    capitals: [{ name: 'Suva' }],
    currencies: [{ name: 'Fijian dollar' }],
    languages: [{ name: 'English' }],
    tlds: ['.fj'],
    borders: [],
  },
  {
    names: {
      common: 'Samoa',
      native: { smo: { common: 'Sāmoa', official: 'Independent State of Samoa' } },
    },
    codes: { alpha_3: 'WSM' },
    flag: { url_svg: 'https://flags.example/samoa.svg' },
    population: 200_000,
    region: 'Oceania',
    subregion: 'Polynesia',
    capitals: [{ name: 'Apia' }],
    currencies: [{ name: 'Samoan tālā' }],
    languages: [{ name: 'Samoan' }],
    tlds: ['.ws'],
    borders: [],
  },
  {
    names: { common: 'Somaliland', native: {} },
    population: 4_900_000,
    region: 'Africa',
    subregion: 'Eastern Africa',
    capitals: [{ name: 'Hargeisa' }],
    currencies: [{ name: 'Somaliland shilling' }],
    languages: [{ name: 'Somali' }],
    tlds: [],
    borders: [],
  },
]

const apiEnvelope = (objects: typeof apiCountries) => ({
  data: { objects, meta: { total: objects.length } },
})

test.beforeEach(async ({ page }) => {
  await page.route('https://flags.example/**', (route) =>
    route.fulfill({
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 1"><rect width="2" height="1" fill="#246"/></svg>',
    }),
  )

  await page.route('**/api/countries/v5**', async (route) => {
    const { pathname } = new URL(route.request().url())
    const codeMatch = pathname.match(/\/codes\.alpha_3\/([^/]+)$/)
    const nameMatch = pathname.match(/\/names\.common\/([^/]+)$/)

    if (codeMatch || nameMatch) {
      const key = decodeURIComponent((codeMatch ?? nameMatch)?.[1] ?? '')
      const country = codeMatch
        ? apiCountries.find((entry) => entry.codes?.alpha_3 === key)
        : apiCountries.find((entry) => entry.names.common === key)
      await route.fulfill({ json: apiEnvelope(country ? [country] : []) })
      return
    }

    await route.fulfill({ json: apiEnvelope(apiCountries) })
  })
})

test('loads countries and applies URL filters, sorting, and search', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Where in the world?' })).toBeVisible()
  await page.getByRole('button', { name: 'All Regions' }).click()
  await page.getByRole('option', { name: 'Oceania' }).click()
  await expect(page.locator('h3')).toHaveText(['Fiji', 'Samoa'])
  await expect(page).toHaveURL(/region=Oceania/)

  await page.getByRole('button', { name: 'Sort by...' }).click()
  await page.getByRole('option', { name: 'Population' }).click()
  await expect(page.locator('h3')).toHaveText(['Samoa', 'Fiji'])
  await expect(page).toHaveURL(/sortBy=population/)

  await page.getByRole('button', { name: 'Ascending' }).click()
  await page.getByRole('option', { name: 'Descending' }).click()
  await expect(page.locator('h3')).toHaveText(['Fiji', 'Samoa'])
  await expect(page).toHaveURL(/sortOrder=desc/)

  await page.getByRole('button', { name: 'Descending' }).click()
  await page.getByRole('option', { name: 'Ascending' }).click()
  await expect(page.locator('h3')).toHaveText(['Samoa', 'Fiji'])

  const search = page.getByPlaceholder('Search for a country...')
  await search.fill('Samoa')
  await expect(page.locator('h3')).toHaveText(['Samoa'])
  await expect(page).toHaveURL(/search=Samoa/)
})

test('opens a country detail page from its card', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('heading', { name: 'Japan', level: 3 }).click()

  await expect(page).toHaveURL(/\/country\/JPN$/)
  await expect(page.getByRole('heading', { name: 'Japan', level: 1 })).toBeVisible()
  await expect(page.getByText('Japanese yen')).toBeVisible()
  const flag = page.getByRole('img', { name: 'Flag of Japan' })
  await expect(flag).toHaveAttribute('src', 'https://flags.example/japan.svg')
  await expect(flag).toHaveClass(/object-contain/)
  await expect
    .poll(() => flag.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0)
})

test('loads a country detail page from a direct URL', async ({ page }) => {
  await page.goto('/country/JPN')

  await expect(page.getByRole('heading', { name: 'Japan', level: 1 })).toBeVisible()
  await expect(page.getByText('Tokyo')).toBeVisible()
})

test('uses a local flag and route for a territory without an API flag or code', async ({
  page,
}) => {
  await page.goto('/')

  const territoryCard = page.locator('div.cursor-pointer').filter({ hasText: 'Somaliland' })
  const cardFlag = territoryCard.getByRole('img', { name: 'Flag of Somaliland' })
  await expect(cardFlag).toHaveAttribute('src', '/flags/somaliland.svg')
  await expect(cardFlag).toHaveClass(/object-contain/)
  await expect
    .poll(() => cardFlag.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0)
  await territoryCard.getByRole('heading', { name: 'Somaliland' }).click()

  await expect(page).toHaveURL(/\/country\/name-somaliland$/)
  await expect(page.getByRole('heading', { name: 'Somaliland', level: 1 })).toBeVisible()
  await expect(page.getByRole('img', { name: 'Flag of Somaliland' })).toHaveAttribute(
    'src',
    '/flags/somaliland.svg',
  )
})
