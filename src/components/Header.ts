import { Page, Locator, expect } from '@playwright/test'

/**
 * Cabeçalho comum a todas as telas internas: carrinho (com contador) e menu lateral.
 * Fica num componente separado para não repetir em cada Page Object.
 */
export class Header {
    readonly cartLink: Locator
    readonly cartBadge: Locator
    readonly openMenuButton: Locator
    readonly closeMenuButton: Locator
    readonly logoutLink: Locator
    readonly resetAppStateLink: Locator
    readonly allItemsLink: Locator

    constructor(private readonly page: Page) {
        this.cartLink = page.getByTestId('shopping-cart-link')
        this.cartBadge = page.getByTestId('shopping-cart-badge')
        this.openMenuButton = page.getByRole('button', { name: 'Open Menu' })
        this.closeMenuButton = page.getByRole('button', { name: 'Close Menu' })
        this.logoutLink = page.getByTestId('logout-sidebar-link')
        this.resetAppStateLink = page.getByTestId('reset-sidebar-link')
        this.allItemsLink = page.getByTestId('inventory-sidebar-link')
    }

    async openCart() {
        await this.cartLink.click()
    }

    async openMenu() {
        await this.openMenuButton.click()
        await expect(this.logoutLink).toBeVisible()
    }

    async logout() {
        await this.openMenu()
        await this.logoutLink.click()
    }

    async resetAppState() {
        await this.openMenu()
        await this.resetAppStateLink.click()
        await this.closeMenuButton.click()
    }

    /** Confere o número no ícone do carrinho; 0 significa que o contador nem aparece. */
    async expectCartCount(count: number) {
        if (count === 0) {
            await expect(this.cartBadge).toBeHidden()
        } else {
            await expect(this.cartBadge).toHaveText(String(count))
        }
    }
}
