import { test, expect } from '@playwright/test'

test.afterEach(async ({ page }) => {
  const response = await page.request.get('http://localhost:3000/api/v1/habits')
  const habits = await response.json()
  for (const habit of habits) {
    if (habit.name.startsWith('TEST_')) {
      await page.request.delete(`http://localhost:3000/api/v1/habits/${habit._id}`)
    }
  }
})

test('app loads and shows title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Life Tracker')
})

test('shows Life Tracker heading', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await expect(page.getByText('Life Tracker')).toBeVisible()
})

test('create a new habit', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Create Habit' }).click()
  await page.getByRole('textbox', { name: 'New habit..' }).click()
  await page.getByRole('textbox', { name: 'New habit..' }).fill('TEST_Exercise')
  await page.getByRole('button', { name: 'Add' }).click()
  await expect(page.getByText('TEST_Exercise daily')).toBeVisible()
})

test('habit name cannot be empty', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Create Habit' }).click()
  await page.getByRole('button', { name: 'Add' }).click()
  await expect(page.getByText('Habit name cannot be empty')).toBeVisible()
  await expect(page.getByText('TEST_')).not.toBeVisible()
})

test('delete a habit', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Create Habit' }).click()

  await page
    .getByRole('textbox', { name: 'New habit..' })
    .fill('TEST_Delete')

  await page.getByRole('button', { name: 'Add' }).click()

  const habitItem = page.locator('li').filter({
    hasText: 'TEST_Delete'
  })

  await expect(habitItem).toBeVisible()

  await habitItem
    .getByRole('button', { name: /delete/i })
    .click()

  await page.reload()

  await expect(
    page.getByText('TEST_Delete')
  ).not.toBeVisible()
})
