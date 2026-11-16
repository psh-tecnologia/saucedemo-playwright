/**
 * ============================================================================
 *  FUNCIONALIDADE: Checkout
 * ============================================================================
 *  Cobre: compra ponta a ponta, campos obrigatórios (tabela de decisão), cálculo
 *  de subtotal/imposto/total e cancelamentos. Roteiro: docs/TEST-PLAN.md, seção 3.4
 * ============================================================================
 */
import { test, expect } from '../../src/fixtures'
import { ALL_PRODUCTS, PRODUCTS, TAX_RATE } from '../../src/data/products'
import { CUSTOMER } from '../../src/data/customers'
import { MESSAGES } from '../../src/data/messages'
import { expectedTotals } from '../../src/utils/money'

test.describe('Checkout', () => {
    test('CT-040 - Compra completa do início ao fim', { tag: ['@smoke'] }, async ({
        inventoryPage, cartPage, checkoutInfoPage, checkoutOverviewPage, checkoutCompletePage,
    }) => {
        const products = [PRODUCTS.backpack, PRODUCTS.bikeLight]

        // PREPARAR: produtos no carrinho
        await inventoryPage.goto()
        await inventoryPage.addToCart(...products)
        await inventoryPage.header.openCart()
        await cartPage.expectProducts(products)

        // AGIR: passo 1 (dados) e passo 2 (resumo)
        await cartPage.checkout()
        await checkoutInfoPage.fillAndContinue(CUSTOMER)
        await checkoutOverviewPage.expectLoaded()
        await expect(checkoutOverviewPage.items).toHaveCount(products.length)
        await checkoutOverviewPage.finish()

        // CONFERIR: pedido confirmado e carrinho vazio
        await checkoutCompletePage.expectOrderCompleted()
        await checkoutCompletePage.header.expectCartCount(0)

        await checkoutCompletePage.backHomeButton.click()
        await inventoryPage.expectLoaded()
    })

    test.describe('Dados do comprador', () => {
        test.beforeEach(async ({ inventoryPage, cartPage, checkoutInfoPage }) => {
            await inventoryPage.goto()
            await inventoryPage.addToCart(PRODUCTS.onesie)
            await cartPage.goto()
            await cartPage.checkout()
            await checkoutInfoPage.expectLoaded()
        })

        /**
         * Tabela de decisão dos campos obrigatórios. O sistema valida na ordem
         * Nome -> Sobrenome -> CEP, então a mensagem é a do PRIMEIRO campo vazio.
         */
        const { firstName, lastName, postalCode } = CUSTOMER
        const requiredFields = [
            { id: 'CT-041', cenario: 'todos os campos vazios', data: { firstName: '', lastName: '', postalCode: '' }, message: MESSAGES.checkout.firstNameRequired },
            { id: 'CT-042', cenario: 'sem nome', data: { firstName: '', lastName, postalCode }, message: MESSAGES.checkout.firstNameRequired },
            { id: 'CT-043', cenario: 'sem sobrenome', data: { firstName, lastName: '', postalCode }, message: MESSAGES.checkout.lastNameRequired },
            { id: 'CT-044', cenario: 'sem CEP', data: { firstName, lastName, postalCode: '' }, message: MESSAGES.checkout.postalCodeRequired },
        ]

        for (const row of requiredFields) {
            test(`${row.id} - Campo obrigatório: ${row.cenario}`, { tag: ['@regression'] }, async ({ checkoutInfoPage }) => {
                await checkoutInfoPage.fillAndContinue(row.data)

                await checkoutInfoPage.expectError(row.message)
            })
        }

        test('CT-045 - Cancelar no passo 1 volta ao carrinho', { tag: ['@regression'] }, async ({ checkoutInfoPage, cartPage }) => {
            await checkoutInfoPage.cancelButton.click()

            await cartPage.expectProducts([PRODUCTS.onesie])
        })
    })

    test('CT-046 - Subtotal, imposto de 8% e total conferem com o catálogo', { tag: ['@regression'] }, async ({
        inventoryPage, cartPage, checkoutInfoPage, checkoutOverviewPage,
    }) => {
        await inventoryPage.goto()
        await inventoryPage.addToCart(...ALL_PRODUCTS)
        await cartPage.goto()
        await cartPage.checkout()
        await checkoutInfoPage.fillAndContinue(CUSTOMER)

        // o esperado é calculado pelo teste a partir dos preços do catálogo
        const expected = expectedTotals(ALL_PRODUCTS.map(p => p.price), TAX_RATE)
        const actual = await checkoutOverviewPage.getTotals()

        expect(actual).toEqual(expected)
        await expect(checkoutOverviewPage.paymentInfo).not.toBeEmpty()
        await expect(checkoutOverviewPage.shippingInfo).not.toBeEmpty()
    })

    test('CT-047 - Cancelar no resumo volta à lista sem perder o carrinho', { tag: ['@regression'] }, async ({
        inventoryPage, cartPage, checkoutInfoPage, checkoutOverviewPage,
    }) => {
        await inventoryPage.goto()
        await inventoryPage.addToCart(PRODUCTS.backpack)
        await cartPage.goto()
        await cartPage.checkout()
        await checkoutInfoPage.fillAndContinue(CUSTOMER)

        await checkoutOverviewPage.cancelButton.click()

        await inventoryPage.expectLoaded()
        await inventoryPage.header.expectCartCount(1)
    })
})
