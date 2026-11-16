/**
 * Setup de autenticação: faz login uma única vez com o standard_user e grava a sessão em
 * .auth/standard_user.json. Os testes do projeto "chromium" já começam logados a partir dela.
 */
import { test as setup, expect } from '@playwright/test'
import { LoginPage } from '../src/pages/LoginPage'
import { USERS, PASSWORD } from '../src/data/users'
import { STORAGE_STATE } from '../playwright.config'

setup('autenticar standard_user', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.goto()
    await loginPage.login(USERS.standard, PASSWORD)
    await expect(page).toHaveURL(/\/inventory\.html$/)
    await page.context().storageState({ path: STORAGE_STATE })
})
