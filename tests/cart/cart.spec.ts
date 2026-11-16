/**
 * ============================================================================
 *  FUNCIONALIDADE: Carrinho
 * ============================================================================
 *  Cobre: conteúdo do carrinho, remoção, persistência após recarregar a página,
 *  navegação e o "Reset App State". Roteiro: docs/TEST-PLAN.md, seção 3.3
 * ============================================================================
 */
import { test, expect } from '../../src/fixtures'
import { PRODUCTS } from '../../src/data/products'

test.describe('Carrinho', () => {
    test.beforeEach(async ({ inventoryPage }) => {
        await inventoryPage.goto()
    })

    test('CT-030 - Carrinho lista os produtos adicionados com quantidade e preço', { tag: ['@smoke'] }, async ({ inventoryPage, cartPage }) => {
        const products = [PRODUCTS.backpack, PRODUCTS.boltTShirt]
        await inventoryPage.addToCart(...products)

        await inventoryPage.header.openCart()

        await cartPage.expectLoaded()
        await cartPage.expectProducts(products)
    })

    test('CT-031 - Remover produto dentro do carrinho', { tag: ['@regression'] }, async ({ inventoryPage, cartPage }) => {
        await inventoryPage.addToCart(PRODUCTS.backpack, PRODUCTS.onesie)
        await inventoryPage.header.openCart()

        await cartPage.remove(PRODUCTS.backpack)

        await cartPage.expectProducts([PRODUCTS.onesie])
        await cartPage.header.expectCartCount(1)
    })

    test('CT-032 - Carrinho é mantido ao recarregar a página', { tag: ['@regression'] }, async ({ page, inventoryPage, cartPage }) => {
        await inventoryPage.addToCart(PRODUCTS.fleeceJacket)
        await inventoryPage.header.openCart()

        await page.reload()

        await cartPage.expectProducts([PRODUCTS.fleeceJacket])
    })

    test('CT-033 - Continue Shopping volta para a lista sem perder os itens', { tag: ['@regression'] }, async ({ inventoryPage, cartPage }) => {
        await inventoryPage.addToCart(PRODUCTS.bikeLight)
        await inventoryPage.header.openCart()

        await cartPage.continueShoppingButton.click()

        await inventoryPage.expectLoaded()
        await inventoryPage.header.expectCartCount(1)
    })

    test('CT-034 - Reset App State esvazia o carrinho', { tag: ['@regression'] }, async ({ inventoryPage, cartPage }) => {
        await inventoryPage.addToCart(PRODUCTS.backpack, PRODUCTS.onesie)

        await inventoryPage.header.resetAppState()

        await inventoryPage.header.expectCartCount(0)
        await cartPage.goto()
        await expect(cartPage.items).toHaveCount(0)
    })
})
