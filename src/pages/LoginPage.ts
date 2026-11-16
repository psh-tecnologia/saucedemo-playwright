import { Page, Locator, expect } from '@playwright/test'

/**
 * Page Object da tela de login.
 * Os testes só chamam as ações e conferências daqui; se a tela mudar, o ajuste é num lugar só.
 */
export class LoginPage {
    readonly username: Locator
    readonly password: Locator
    readonly loginButton: Locator
    readonly errorMessage: Locator
    readonly errorCloseButton: Locator
    readonly errorIcons: Locator

    constructor(private readonly page: Page) {
        this.errorIcons = page.locator('.error_icon')
        this.username = page.getByTestId('username')
        this.password = page.getByTestId('password')
        this.loginButton = page.getByTestId('login-button')
        this.errorMessage = page.getByTestId('error')
        this.errorCloseButton = page.getByTestId('error-button')
    }

    async goto() {
        await this.page.goto('/')
        await expect(this.loginButton).toBeVisible()
    }

    /** Preenche usuário e senha (passe '' para deixar o campo vazio) e clica em Login. */
    async login(username: string, password: string) {
        await this.username.fill(username)
        await this.password.fill(password)
        await this.loginButton.click()
    }

    async expectError(message: string) {
        await expect(this.errorMessage).toHaveText(message)
        // o login recusado mantém o usuário na tela de login
        await expect(this.loginButton).toBeVisible()
    }

    /** Os dois campos ficam marcados em vermelho (classe input_error) quando há erro. */
    async expectFieldsHighlighted(highlighted: boolean) {
        for (const field of [this.username, this.password]) {
            if (highlighted) await expect(field).toHaveClass(/input_error/)
            else await expect(field).not.toHaveClass(/input_error/)
        }
    }
}
