/**
 * ============================================================================
 *  FUNCIONALIDADE: Login
 * ============================================================================
 *  Técnicas: tabela de decisão (usuário x senha), partição de equivalência
 *  (usuário válido / inexistente / bloqueado) e casos de borda (maiúsculas, espaço).
 *  Roteiro completo: docs/TEST-PLAN.md, seção 3.1
 * ============================================================================
 */
import { test, expect, LOGGED_OUT } from '../../src/fixtures'
import { USERS, PASSWORD, INVALID } from '../../src/data/users'
import { MESSAGES } from '../../src/data/messages'

// Estes testes precisam começar deslogados.
test.use({ storageState: LOGGED_OUT })

test.describe('Login', () => {
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.goto()
    })

    test('CT-001 - Login com usuário e senha válidos', { tag: ['@smoke'] }, async ({ loginPage, inventoryPage }) => {
        // AGIR
        await loginPage.login(USERS.standard, PASSWORD)

        // CONFERIR: abre a lista de produtos
        await inventoryPage.expectLoaded()
    })

    /**
     * Tabela de decisão: cada linha é uma combinação de entrada e a mensagem esperada.
     * Um teste por linha, gerado a partir da tabela (data-driven).
     */
    const invalidLogins = [
        { id: 'CT-002', cenario: 'usuário e senha vazios', username: '', password: '', message: MESSAGES.login.usernameRequired },
        { id: 'CT-003', cenario: 'usuário preenchido e senha vazia', username: USERS.standard, password: '', message: MESSAGES.login.passwordRequired },
        { id: 'CT-004', cenario: 'usuário vazio e senha preenchida', username: '', password: PASSWORD, message: MESSAGES.login.usernameRequired },
        { id: 'CT-005', cenario: 'usuário válido e senha errada', username: USERS.standard, password: INVALID.password, message: MESSAGES.login.invalidCredentials },
        { id: 'CT-006', cenario: 'usuário inexistente', username: INVALID.username, password: PASSWORD, message: MESSAGES.login.invalidCredentials },
        { id: 'CT-007', cenario: 'usuário em maiúsculas (diferencia maiúsc./minúsc.)', username: USERS.standard.toUpperCase(), password: PASSWORD, message: MESSAGES.login.invalidCredentials },
        { id: 'CT-008', cenario: 'usuário com espaço no início', username: ` ${USERS.standard}`, password: PASSWORD, message: MESSAGES.login.invalidCredentials },
        { id: 'CT-009', cenario: 'usuário bloqueado', username: USERS.lockedOut, password: PASSWORD, message: MESSAGES.login.lockedOut },
    ]

    for (const row of invalidLogins) {
        test(`${row.id} - Login recusado: ${row.cenario}`, { tag: ['@regression'] }, async ({ loginPage }) => {
            await loginPage.login(row.username, row.password)

            await loginPage.expectError(row.message)
            await loginPage.expectFieldsHighlighted(true)
        })
    }

    test('CT-010 - Fechar a mensagem de erro remove a mensagem e os ícones de erro', { tag: ['@regression'] }, async ({ loginPage }) => {
        // PREPARAR: provoca um erro (mensagem + ícone "x" nos dois campos)
        await loginPage.login('', '')
        await loginPage.expectError(MESSAGES.login.usernameRequired)
        await expect(loginPage.errorIcons).toHaveCount(2)

        // AGIR
        await loginPage.errorCloseButton.click()

        // CONFERIR: mensagem e ícones somem (a borda vermelha dos campos permanece, comportamento atual)
        await expect(loginPage.errorMessage).toBeHidden()
        await expect(loginPage.errorIcons).toHaveCount(0)
    })

    test('CT-011 - Senha digitada fica mascarada', { tag: ['@regression'] }, async ({ loginPage }) => {
        await expect(loginPage.password).toHaveAttribute('type', 'password')
    })
})

test.describe('Controle de acesso', () => {
    for (const path of ['/inventory.html', '/cart.html', '/checkout-step-one.html']) {
        test(`CT-012 - Acesso direto a ${path} sem login é bloqueado`, { tag: ['@regression'] }, async ({ page, loginPage }) => {
            await page.goto(path)

            await expect(page).toHaveURL('/')
            await loginPage.expectError(MESSAGES.login.notLoggedIn(path))
        })
    }

    test('CT-013 - Logout encerra a sessão', { tag: ['@smoke'] }, async ({ page, loginPage, inventoryPage }) => {
        // PREPARAR: entra no sistema
        await loginPage.goto()
        await loginPage.login(USERS.standard, PASSWORD)
        await inventoryPage.expectLoaded()

        // AGIR
        await inventoryPage.header.logout()

        // CONFERIR: volta ao login e a área interna não abre mais sem novo login
        await expect(loginPage.loginButton).toBeVisible()
        await page.goto('/inventory.html')
        await loginPage.expectError(MESSAGES.login.notLoggedIn('/inventory.html'))
    })
})
