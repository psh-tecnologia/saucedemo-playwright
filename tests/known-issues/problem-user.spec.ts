/**
 * ============================================================================
 *  DEFEITOS CONHECIDOS: problem_user
 * ============================================================================
 *  O Sauce Demo oferece o problem_user, que tem defeitos de propósito. Estes testes
 *  descrevem o comportamento CORRETO e são marcados com test.fail(): enquanto o defeito
 *  existir, a falha é esperada e a suíte fica verde. Se um dia o defeito for corrigido,
 *  o Playwright acusa "passou inesperadamente" e o teste deve voltar a ser um teste normal.
 *
 *  Cada defeito está descrito em docs/TEST-PLAN.md, seção 4 (BUG-01 a BUG-03).
 * ============================================================================
 */
import { test, expect, LOGGED_OUT } from '../../src/fixtures'
import { USERS, PASSWORD } from '../../src/data/users'
import { ALL_PRODUCTS } from '../../src/data/products'

test.use({ storageState: LOGGED_OUT })

test.describe('Defeitos conhecidos - problem_user', { tag: ['@known-issue'] }, () => {
    test.beforeEach(async ({ loginPage, inventoryPage }) => {
        await loginPage.goto()
        await loginPage.login(USERS.problem, PASSWORD)
        await inventoryPage.expectLoaded()
    })

    test('BUG-01 - Cada produto deveria exibir a própria imagem', {
        annotation: { type: 'issue', description: 'BUG-01: todos os produtos exibem a mesma imagem quebrada (sl-404)' },
    }, async ({ page }) => {
        test.fail()
        const sources = await page.locator('.inventory_item_img img').evaluateAll(
            imgs => imgs.map(img => (img as HTMLImageElement).src),
        )
        expect(new Set(sources).size).toBe(ALL_PRODUCTS.length)
    })

    test('BUG-02 - Ordenar de Z a A deveria inverter a lista', {
        annotation: { type: 'issue', description: 'BUG-02: a ordenação não altera a ordem dos produtos' },
    }, async ({ inventoryPage }) => {
        test.fail()
        const expected = ALL_PRODUCTS.map(p => p.name).sort((a, b) => b.localeCompare(a))

        await inventoryPage.sortBy('za')

        expect(await inventoryPage.getNames()).toEqual(expected)
    })

    test('BUG-03 - Todos os produtos deveriam poder ir para o carrinho', {
        annotation: { type: 'issue', description: 'BUG-03: Add to cart não funciona para Bolt T-Shirt, Fleece Jacket e T-Shirt (Red)' },
    }, async ({ inventoryPage }) => {
        test.fail()
        await inventoryPage.addToCart(...ALL_PRODUCTS)

        await inventoryPage.header.expectCartCount(ALL_PRODUCTS.length)
    })
})
