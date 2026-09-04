import { expect, test } from '@playwright/test'

const storageKey = 'team-request-tracker.requests.v1'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate((key) => localStorage.removeItem(key), storageKey)
  await page.reload()
})

test('creates, edits, and persists a request', async ({ page }) => {
  await page.getByRole('button', { name: 'New request' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('Title *').fill('Prepare fictional partner brief')
  await dialog.getByLabel('Description').fill('Summarize public example materials for the workshop.')
  await dialog.getByLabel('Category *').selectOption('Research')
  await dialog.getByLabel('Priority *').selectOption('High')
  await dialog.getByLabel('Due date').fill('2099-10-20')
  await dialog.getByRole('button', { name: 'Create request' }).click()

  const card = page.locator('article').filter({ hasText: 'Prepare fictional partner brief' })
  await expect(card).toContainText('High priority')
  await card.getByRole('button', { name: 'Edit request' }).click()
  await page.getByRole('dialog').getByLabel('Status *').selectOption('Complete')
  await page.getByRole('button', { name: 'Save changes' }).click()
  await expect(card).toContainText('Complete')

  await page.reload()
  await expect(page.locator('article').filter({ hasText: 'Prepare fictional partner brief' })).toContainText('Complete')
})

test('combines filters and clears them', async ({ page }) => {
  await page.getByRole('searchbox', { name: 'Search', exact: true }).fill('dashboard')
  await page.getByRole('combobox', { name: 'Category', exact: true }).selectOption('Data')
  await page.getByRole('combobox', { name: 'Priority', exact: true }).selectOption('High')
  await page.getByRole('combobox', { name: 'Status', exact: true }).selectOption('In progress')
  await expect(page.locator('article')).toHaveCount(1)
  await expect(page.getByRole('heading', { name: 'Refresh quarterly dashboard' })).toBeVisible()

  await page.getByRole('combobox', { name: 'Category', exact: true }).selectOption('Research')
  await expect(page.getByRole('heading', { name: 'No matching requests' })).toBeVisible()
  await page.getByRole('button', { name: 'Clear all filters' }).click()
  await expect(page.locator('article')).toHaveCount(4)
})

test('supports keyboard dismissal and restores focus', async ({ page }) => {
  const opener = page.getByRole('button', { name: 'New request' })
  await opener.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByLabel('Title *')).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
  await expect(opener).toBeFocused()
})

test('shows the empty workspace and fits a mobile viewport', async ({ page }) => {
  await page.evaluate(([key, value]) => localStorage.setItem(key, value), [storageKey, '[]'])
  await page.setViewportSize({ width: 375, height: 812 })
  await page.reload()
  await expect(page.getByRole('heading', { name: 'No requests yet' })).toBeVisible()
  const sizes = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }))
  expect(sizes.page).toBeLessThanOrEqual(sizes.viewport)
})
