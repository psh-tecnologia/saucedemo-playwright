import { Page, Locator, expect } from '@playwright/test'
import { Header } from '../components/Header'
import { Product } from '../data/products'

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo'

/** Page Object da lista de produtos (/inventory.html). */
export class InventoryPage {
    readonly header: Header
    readonly title: Locator
    readonly items: Locator
    readonly itemNames: Locator
    readonly itemPrices: Locator
    readonly sortSelect: Locator

    constructor(private readonly page: Page) {
        this.header = new Header(page)
        this.title = page.getByTestId('title')
        this.items = page.getByTestId('inventory-item')
        this.itemNames = page.getByTestId('inventory-item-name')
        this.itemPrices = page.getByTestId('inventory-item-price')
        this.sortSelect = page.getByTestId('product-sort-container')
    }

    async goto() {
        await this.page.goto('/inventory.html')
        await this.expectLoaded()
    }

    async expectLoaded() {
        await expect(this.page).toHaveURL(/\/inventory\.html$/)
        await expect(this.title).toHaveText('Products')
    }

    addButton(product: Product): Locator {
        return this.page.getByTestId(`add-to-cart-${product.id}`)
    }

    removeButton(product: Product): Locator {
        return this.page.getByTestId(`remove-${product.id}`)
    }

    async addToCart(...products: Product[]) {
        for (const product of products) await this.addButton(product).click()
    }

    async removeFromCart(...products: Product[]) {
        for (const product of products) await this.removeButton(product).click()
    }

    async sortBy(option: SortOption) {
        await this.sortSelect.selectOption(option)
    }

    async getNames(): Promise<string[]> {
        return this.itemNames.allInnerTexts()
    }

    async getPrices(): Promise<number[]> {
        const texts = await this.itemPrices.allInnerTexts()
        return texts.map(t => Number(t.replace('$', '')))
    }

    async openProduct(product: Product) {
        await this.itemNames.filter({ hasText: product.name }).click()
    }
}
