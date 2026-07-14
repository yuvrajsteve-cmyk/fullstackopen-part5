import { test, expect } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/blogs')
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
      await expect(page.getByText('Mandeep Singh').first()).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog', exact: false }).click()
      
      
      await page.locator('input[name="title"]').fill('React testing with Playwright')
      await page.locator('input[name="author"]').fill('Mandeep Singh')
      await page.locator('input[name="url"]').fill('https://playwright.dev')
      
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('React testing with Playwright').first()).toBeVisible()
    })

    test.describe('After creating a blog', () => {
      test.beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'new blog', exact: false }).click()
        
        await page.locator('input[name="title"]').fill('React patterns')
        await page.locator('input[name="author"]').fill('Mandeep Singh')
        await page.locator('input[name="url"]').fill('https://playwright.dev')
        
        await page.getByRole('button', { name: 'create' }).click()
        
        await expect(page.locator('.blog').filter({ hasText: 'React patterns' }).first()).toBeVisible()
      })

      test('a blog can be liked', async ({ page }) => {
        const blogElement = page.locator('.blog').filter({ hasText: 'React patterns' }).first()
        await expect(blogElement).toBeVisible()

       
        await blogElement.getByRole('button', { name: 'view' }).click()
        
      
        const likeButton = blogElement.getByRole('button', { name: 'like' })
        await expect(likeButton).toBeVisible()
        await likeButton.click()

        
        await expect(blogElement).toContainText('likes 1')
      })
    })
  })
})
