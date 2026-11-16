import { Page, Locator, expect } from '@playwright/test'
import { Header } from '../components/Header'
import { Product } from '../data/products'

/** Page Object da tela de detalhes de um produto (/inventory-item.html?id=N). */
export class ProductDetailsPage {
    readonly header: Header
    readonly name: Locator
    readonly description: Locator
    readonly price: Locator
    readonly addButton: Locator
    readonly removeButton: Locator
    readonly backButton: Locator

    constructor(private readonly page: Page) {
        this.header = new Header(page)
        this.name = page.getByTestId('inventory-item-name')
        this.description = page.getByTestId('inventory-item-desc')
        this.price = page.getByTestId('inventory-item-price')
        this.addButton = page.getByTestId('add-to-cart')
        this.removeButton = page.getByTestId('remove')
        this.backButton = page.getByTestId('back-to-products')
    }

    async expectProduct(product: Product) {
        await expect(this.page).toHaveURL(/\/inventory-item\.html\?id=\d+/)
        await expect(this.name).toHaveText(product.name)
        await expect(this.price).toHaveText(`$${product.price}`)
        await expect(this.description).not.toBeEmpty()
    }
}
