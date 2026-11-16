import { test as base, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'
import { InventoryPage } from './pages/InventoryPage'
import { ProductDetailsPage } from './pages/ProductDetailsPage'
import { CartPage } from './pages/CartPage'
import { CheckoutInfoPage } from './pages/CheckoutInfoPage'
import { CheckoutOverviewPage } from './pages/CheckoutOverviewPage'
import { CheckoutCompletePage } from './pages/CheckoutCompletePage'

/**
 * Fixtures: cada teste pede só os Page Objects que usa, já criados para a página dele.
 *   test('...', async ({ inventoryPage, cartPage }) => { ... })
 */
type Pages = {
    loginPage: LoginPage
    inventoryPage: InventoryPage
    productDetailsPage: ProductDetailsPage
    cartPage: CartPage
    checkoutInfoPage: CheckoutInfoPage
    checkoutOverviewPage: CheckoutOverviewPage
    checkoutCompletePage: CheckoutCompletePage
}

export const test = base.extend<Pages>({
    loginPage: async ({ page }, use) => use(new LoginPage(page)),
    inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
    productDetailsPage: async ({ page }, use) => use(new ProductDetailsPage(page)),
    cartPage: async ({ page }, use) => use(new CartPage(page)),
    checkoutInfoPage: async ({ page }, use) => use(new CheckoutInfoPage(page)),
    checkoutOverviewPage: async ({ page }, use) => use(new CheckoutOverviewPage(page)),
    checkoutCompletePage: async ({ page }, use) => use(new CheckoutCompletePage(page)),
})

export { expect }

/** Sessão vazia: usada nos testes que precisam começar deslogados (tela de login). */
export const LOGGED_OUT = { cookies: [], origins: [] }
