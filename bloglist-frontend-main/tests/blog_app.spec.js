const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, context }) => {
    await context.clearCookies()
    await page.goto('http://localhost:5173')
    await page.evaluate(() => window.localStorage.clear())
    await page.reload()

    await page.locator('#username').fill('testuser')
    await page.locator('#password').fill('testuser')
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByText('username satinderpal').waitFor()
  })

  describe('When multiple blogs exist', () => {
    const timestamp = Date.now()
    const titleA = `Sorting Blog A ${timestamp}`
    const titleB = `Sorting Blog B ${timestamp}`

    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'create a new blog' }).click()
      await page.locator('#title').fill(titleA)
      await page.locator('#author').fill('Author A')
      await page.locator('#url').fill('http://url1.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.locator('.blog').getByText(titleA).first().waitFor()

      await page.getByRole('button', { name: 'create a new blog' }).click()
      await page.locator('#title').fill(titleB)
      await page.locator('#author').fill('Author B')
      await page.locator('#url').fill('http://url2.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.locator('.blog').getByText(titleB).first().waitFor()
    })

    test('blogs are arranged in the order according to likes, most likes first', async ({ page }) => {
      const blockB = page.locator('.blog', { hasText: titleB }).first()
      await blockB.getByRole('button', { name: 'view' }).click()

      const likeButtonB = blockB.getByRole('button', { name: 'like' })
      await likeButtonB.click()
      await page.locator('.blog', { hasText: titleB }).first().getByText('likes 1').waitFor()
      await likeButtonB.click()
      await page.locator('.blog', { hasText: titleB }).first().getByText('likes 2').waitFor()

      const blockA = page.locator('.blog', { hasText: titleA }).first()
      await blockA.getByRole('button', { name: 'view' }).click()
      await blockA.getByRole('button', { name: 'like' }).click()
      await page.locator('.blog', { hasText: titleA }).first().getByText('likes 1').waitFor()

      await page.waitForTimeout(1000)

      const boxB = await blockB.boundingBox()
      const boxA = await blockA.boundingBox()

      expect(boxB.y).toBeLessThan(boxA.y)
    })
  })
})
