import { test, expect } from '@playwright/test'

test.afterEach(async ({ page }) => {
  const response = await page.request.get('http://localhost:3000/api/v1/habits')
  const habits = await response.json()
  for (const habit of habits) {
    await page.request.delete(`http://localhost:3000/api/v1/habits/${habit._id}`)
  }
})

test('app loads and shows title', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('domcontentloaded')
  await page.waitForTimeout(2000)
  await expect(page).toHaveTitle('Life Tracker')
})

test('shows Life Tracker heading', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await expect(page.getByText('Life Tracker')).toBeVisible()
})

test('can create a daily habit', async ({ page }) => {
  await page.goto('http://localhost:3000/')
  await page.getByRole('button', { name: 'Create Habit' }).click()
  await page.getByRole('textbox', { name: 'New habit..' }).click()
  await page.getByRole('textbox', { name: 'New habit..' }).fill('E')
  await page.getByRole('textbox', { name: 'New habit..' }).fill('Exercise')
  await page.getByRole('button', { name: 'Add' }).click()
})
