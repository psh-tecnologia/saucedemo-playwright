import { Page, Locator, expect } from '@playwright/test'
import { parseMoney } from '../utils/money'

/** Page Object do passo 2 do checkout: resumo e totais (/checkout-step-two.html). */
export class CheckoutOverviewPage {
    readonly items: Locator
    readonly subtotal: Locator
    readonly tax: Locator
    readonly total: Locator
    readonly paymentInfo: Locator
    readonly shippingInfo: Locator
    readonly finishButton: Locator
    readonly cancelButton: Locator

    constructor(private readonly page: Page) {
        this.items = page.getByTestId('inventory-item')
        this.subtotal = page.getByTestId('subtotal-label')
        this.tax = page.getByTestId('tax-label')
        this.total = page.getByTestId('total-label')
        this.paymentInfo = page.getByTestId('payment-info-value')
        this.shippingInfo = page.getByTestId('shipping-info-value')
        this.finishButton = page.getByTestId('finish')
        this.cancelButton = page.getByTestId('cancel')
    }

    async expectLoaded() {
        await expect(this.page).toHaveURL(/\/checkout-step-two\.html$/)
        await expect(this.finishButton).toBeVisible()
    }

    /** Lê os três valores do resumo como números. */
    async getTotals() {
        return {
            subtotal: parseMoney(await this.subtotal.innerText()),
            tax: parseMoney(await this.tax.innerText()),
            total: parseMoney(await this.total.innerText()),
        }
    }

    async finish() {
        await this.finishButton.click()
    }
}
