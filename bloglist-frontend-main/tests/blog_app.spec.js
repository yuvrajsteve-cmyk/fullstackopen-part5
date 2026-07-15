const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    try {
      await request.post('http://localhost:3003/api/testing/reset')
    } catch (e) {
      console.log('Reset failed')
    }

    await page.goto('http://localhost:5173')
    await page.locator('#username').fill('testuser')
    await page.locator('#password').fill('testuser')
    await page.getByRole('button', { name: 'login' }).click()
    
    await page.getByText('username satinderpal').waitFor()
  })

  describe('When a blog exists', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'create a new blog' }).click()
      await page.locator('#title').fill('Testing Blog Deletion')
      await page.locator('#author').fill('Test Author')
      await page.locator('#url').fill('http://testurl.com')
      await page.getByRole('button', { name: 'create' }).click()
      
      await page.locator('.blog').getByText('Testing Blog Deletion').first().waitFor()
    })

    test('the user who created the blog can delete it', async ({ page }) => {
      const blogBlock = page.locator('.blog', { hasText: 'Testing Blog Deletion' }).first()
      await blogBlock.getByRole('button', { name: 'view' }).click()

      page.on('dialog', async dialog => {
        await dialog.accept()
      })

      await blogBlock.getByRole('button', { name: 'remove' }).click()
      await expect(blogBlock.getByText('Testing Blog Deletion')).not.toBeVisible()
    })
  })
})
