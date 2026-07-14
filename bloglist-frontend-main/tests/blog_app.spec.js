import { test, expect } from '@playwright/test'

test.describe('Blog app', () => {
  test.beforeEach(async ({ page }) => {

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {

    const usernameInput = page.getByLabel('username')
    const passwordInput = page.getByLabel('password')

    const loginButton = page.getByRole('button', { name: 'login' })

    await expect(usernameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(loginButton).toBeVisible()
  })
})