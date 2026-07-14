// import { test, expect } from '@playwright/test'

// test.describe('Blog app', () => {
//   test.beforeEach(async ({ page, request }) => {
//     await request.post('http://localhost:3003/api/testing/reset')
//     await request.post('http://localhost:3003/api/users', {
//       data: {
//         name: 'Mandeep Singh',
//         username: 'mandeep',
//         password: 'password123'
//       }
//     })
//     await page.goto('http://localhost:5173')
//   })

//   test('Login form is shown', async ({ page }) => {
//     const usernameInput = page.getByLabel('username')
//     const passwordInput = page.getByLabel('password')
//     const loginButton = page.getByRole('button', { name: 'login' })

//     await expect(usernameInput).toBeVisible()
//     await expect(passwordInput).toBeVisible()
//     await expect(loginButton).toBeVisible()
//   })

//   test.describe('Login', () => {
//     test('succeeds with correct credentials', async ({ page }) => {
//       await page.getByLabel('username').fill('mandeep')
//       await page.getByLabel('password').fill('password123')
//       await page.getByRole('button', { name: 'login' }).click()

//       await expect(page.getByText('Mandeep Singh')).toBeVisible()
//     })

//     test('fails with wrong credentials', async ({ page }) => {
//       await page.getByLabel('username').fill('mandeep')
//       await page.getByLabel('password').fill('wrongpassword')
//       await page.getByRole('button', { name: 'login' }).click()

//       await expect(page.getByText('wrong', { exact: false })).toBeVisible()
//       await expect(page.getByText('Mandeep Singh')).not.toBeVisible()
//     })
//   })
// })


import { test, expect } from '@playwright/test'

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Mandeep Singh',
        username: 'mandeep',
        password: 'password123'
      }
    })
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

  test.describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('username').fill('mandeep')
      await page.getByLabel('password').fill('password123')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Mandeep Singh').first()).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('mandeep')
      await page.getByLabel('password').fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong', { exact: false })).toBeVisible()
      await expect(page.getByText('Mandeep Singh')).not.toBeVisible()
    })
  })

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByLabel('username').fill('mandeep')
      await page.getByLabel('password').fill('password123')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog', exact: false }).click()
      
      const inputs = await page.locator('input').all()
      await inputs[0].fill('React testing with Playwright')
      await inputs[1].fill('Mandeep Singh')
      await inputs[2].fill('https://playwright.dev')
      
      await page.locator('button[type="submit"]').click()

      await expect(page.getByText('React testing with Playwright').first()).toBeVisible()
    })
  })
})