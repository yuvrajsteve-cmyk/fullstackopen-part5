const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request, context }) => {
    await context.clearCookies()
    try {
      await request.post('http://localhost:3003/api/testing/reset')
    } catch (e) {
      console.log('Reset failed')
    }

    try {
      await request.post('http://localhost:3003/api/users', {
        data: {
          username: 'testuser',
          name: 'satinderpal',
          password: 'testuser'
        }
      })
    } catch (e) {}

    try {
      await request.post('http://localhost:3003/api/users', {
        data: {
          username: 'anotheruser',
          name: 'seconduser',
          password: 'anotheruser'
        }
      })
    } catch (e) {}

    await page.goto('http://localhost:5173')
    await page.evaluate(() => window.localStorage.clear())
    await page.reload()

    await page.locator('#username').fill('testuser')
    await page.locator('#password').fill('testuser')
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByText('username satinderpal').waitFor()
  })

  describe('When a blog exists', () => {
    const uniqueTitle = `Testing Blog Deletion ${Math.random()}`

    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'create a new blog' }).click()
      await page.locator('#title').fill(uniqueTitle)
      await page.locator('#author').fill('Test Author')
      await page.locator('#url').fill('http://testurl.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.locator('.blog').getByText(uniqueTitle).waitFor()
    })

    test('the user who created the blog can delete it', async ({ page }) => {
      const blogBlock = page.locator('.blog', { hasText: uniqueTitle })
      await blogBlock.getByRole('button', { name: 'view' }).click()

      page.on('dialog', async dialog => {
        await dialog.accept()
      })

      await blogBlock.getByRole('button', { name: 'remove' }).click()
      await expect(blogBlock).not.toBeVisible()
    })

    test('only the user who created the blog sees the delete button', async ({ page }) => {
      await page.getByRole('button', { name: 'logout' }).click()

      await page.locator('#username').fill('anotheruser')
      await page.locator('#password').fill('anotheruser')
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByText('username seconduser').waitFor()

      const blogBlock = page.locator('.blog', { hasText: uniqueTitle })
      await blogBlock.getByRole('button', { name: 'view' }).click()

      await expect(blogBlock.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })
  })
})
