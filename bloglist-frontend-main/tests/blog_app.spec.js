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

    await page.goto('http://localhost:5174')
    await page.evaluate(() => window.localStorage.clear())
    await page.reload()
  })

  test('Login succeeds with the correct username/password combination', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await page.getByLabel(/username/i).fill('testuser')
    await page.getByLabel(/password/i).fill('testuser')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('username satinderpal').first()).toBeVisible()
  })

  test('Login fails if the username/password is incorrect', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await page.getByLabel(/username/i).fill('testuser')
    await page.getByLabel(/password/i).fill('wrongpassword')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('wrong username and password').first()).toBeVisible()
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
      await page.getByLabel(/username/i).fill('testuser')
      await page.getByLabel(/password/i).fill('testuser')
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByText('username satinderpal').first().waitFor()
    })

    test('A logged-in user can create a blog', async ({ page }) => {
      const createTitle = `Playwright Routed E2E Blog ${Date.now()}-${Math.random()}`
      await page.getByRole('link', { name: 'create new' }).click()
      await page.locator('#title').fill(createTitle)
      await page.locator('#author').fill('Test Author')
      await page.locator('#url').fill('http://testurl.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByRole('link', { name: new RegExp(createTitle) }).first()).toBeVisible()
    })

    describe('When a blog exists', () => {
      let uniqueTitle

      beforeEach(async ({ page }) => {
        uniqueTitle = `Like and Delete Test ${Date.now()}-${Math.random()}`
        await page.getByRole('link', { name: 'create new' }).click()
        await page.locator('#title').fill(uniqueTitle)
        await page.locator('#author').fill('Test Author')
        await page.locator('#url').fill('http://testurl.com')
        await page.getByRole('button', { name: 'create' }).click()
        await page.getByRole('link', { name: new RegExp(uniqueTitle) }).first().waitFor()
      })

      test('A logged-in user can like blogs', async ({ page }) => {
        await page.getByRole('link', { name: new RegExp(uniqueTitle) }).first().click()
        await expect(page.getByText('likes 0').first()).toBeVisible()

        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes 1').first()).toBeVisible()
      })

      test('A logged-in user can delete a blog', async ({ page }) => {
        await page.getByRole('link', { name: new RegExp(uniqueTitle) }).first().click()

        page.on('dialog', async dialog => {
          await dialog.accept()
        })

        await page.getByRole('button', { name: 'remove' }).click()
        await expect(page.getByRole('link', { name: new RegExp(uniqueTitle) }).first()).not.toBeVisible()
      })
    })
  })
})
