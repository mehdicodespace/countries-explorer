import { expect, test } from '@playwright/test'

test('opens the country directory', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Where in the world?' })).toBeVisible()
  await expect(page.getByPlaceholder('Search for a country...')).toBeVisible()
})
