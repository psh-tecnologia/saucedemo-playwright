import { Page, Locator, expect } from '@playwright/test'
import { Header } from '../components/Header'
import { Product } from '../data/products'

/** Page Object do carrinho (/cart.html). */
export class CartPage {
    readonly header: Header
    readonly title: Locator
    readonly items: Locator
    readonly continueShoppingButton: Locator
    readonly checkoutButton: Locator

    constructor(private readonly page: Page) {
        this.header = new Header(page)
        this.title = page.getByTestId('title')
        this.items = page.getByTestId('inventory-item')
        this.continueShoppingButton = page.getByTestId('continue-shopping')
        this.checkoutButton = page.getByTestId('checkout')
    }

    async goto() {
        await this.page.goto('/cart.html')
        await this.expectLoaded()
    }

    async expectLoaded() {
        await expect(this.page).toHaveURL(/\/cart\.html$/)
        await expect(this.title).toHaveText('Your Cart')
    }

    item(product: Product): Locator {
        return this.items.filter({ hasText: product.name })
    }

    async remove(product: Product) {
        await this.page.getByTestId(`remove-${product.id}`).click()
    }

    /** Confere que o carrinho tem exatamente estes produtos, com quantidade 1 e o preço do catálogo. */
    async expectProducts(products: Product[]) {
        await expect(this.items).toHaveCount(products.length)
        for (const product of products) {
            const row = this.item(product)
            await expect(row.getByTestId('inventory-item-name')).toHaveText(product.name)
            await expect(row.getByTestId('inventory-item-price')).toHaveText(`$${product.price}`)
            await expect(row.getByTestId('item-quantity')).toHaveText('1')
        }
    }

    async checkout() {
        await this.checkoutButton.click()
    }
}
