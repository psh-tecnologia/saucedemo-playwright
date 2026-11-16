import { Page, Locator, expect } from '@playwright/test'

export interface CustomerInfo {
    firstName: string
    lastName: string
    postalCode: string
}

/** Page Object do passo 1 do checkout: dados do comprador (/checkout-step-one.html). */
export class CheckoutInfoPage {
    readonly firstName: Locator
    readonly lastName: Locator
    readonly postalCode: Locator
    readonly continueButton: Locator
    readonly cancelButton: Locator
    readonly errorMessage: Locator

    constructor(private readonly page: Page) {
        this.firstName = page.getByTestId('firstName')
        this.lastName = page.getByTestId('lastName')
        this.postalCode = page.getByTestId('postalCode')
        this.continueButton = page.getByTestId('continue')
        this.cancelButton = page.getByTestId('cancel')
        this.errorMessage = page.getByTestId('error')
    }

    async expectLoaded() {
        await expect(this.page).toHaveURL(/\/checkout-step-one\.html$/)
        await expect(this.firstName).toBeVisible()
    }

    async fill(info: CustomerInfo) {
        await this.firstName.fill(info.firstName)
        await this.lastName.fill(info.lastName)
        await this.postalCode.fill(info.postalCode)
    }

    async fillAndContinue(info: CustomerInfo) {
        await this.fill(info)
        await this.continueButton.click()
    }

    async expectError(message: string) {
        await expect(this.errorMessage).toHaveText(message)
        await this.expectLoaded()
    }
}
