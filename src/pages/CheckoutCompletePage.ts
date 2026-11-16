import { Page, Locator, expect } from '@playwright/test'
import { Header } from '../components/Header'
import { MESSAGES } from '../data/messages'

/** Page Object da confirmação do pedido (/checkout-complete.html). */
export class CheckoutCompletePage {
    readonly header: Header
    readonly completeHeader: Locator
    readonly completeText: Locator
    readonly backHomeButton: Locator

    constructor(private readonly page: Page) {
        this.header = new Header(page)
        this.completeHeader = page.getByTestId('complete-header')
        this.completeText = page.getByTestId('complete-text')
        this.backHomeButton = page.getByTestId('back-to-products')
    }

    async expectOrderCompleted() {
        await expect(this.page).toHaveURL(/\/checkout-complete\.html$/)
        await expect(this.completeHeader).toHaveText(MESSAGES.checkout.completeHeader)
        await expect(this.completeText).toHaveText(MESSAGES.checkout.completeText)
    }
}
