import { test, expect } from '@playwright/test'
import { describe } from 'node:test'


describe('Note app', () => {
    test('user can log in', async ({page}) => {
        await page.goto('http://localhost:5173')

        await page.getByRole('button', { name: 'login'}).click()
    })
})