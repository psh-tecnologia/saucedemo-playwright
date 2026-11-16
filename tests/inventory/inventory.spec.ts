/**
 * ============================================================================
 *  FUNCIONALIDADE: Lista de produtos (inventário)
 * ============================================================================
 *  Cobre: exibição do catálogo, as 4 ordenações, incluir/remover do carrinho pela
 *  lista e a tela de detalhes do produto. Roteiro: docs/TEST-PLAN.md, seção 3.2
 * ============================================================================
 */
import { test, expect } from '../../src/fixtures'
import { ALL_PRODUCTS, PRODUCTS } from '../../src/data/products'
import { SortOption } from '../../src/pages/InventoryPage'

test.describe('Lista de produtos', () => {
    test.beforeEach(async ({ inventoryPage }) => {
        await inventoryPage.goto()
    })

    test('CT-020 - Exibe os 6 produtos do catálogo com nome, preço e imagem', { tag: ['@smoke'] }, async ({ inventoryPage }) => {
        await expect(inventoryPage.items).toHaveCount(ALL_PRODUCTS.length)

        for (const product of ALL_PRODUCTS) {
            const card = inventoryPage.items.filter({ hasText: product.name })
            await expect(card.getByTestId('inventory-item-price')).toHaveText(`$${product.price}`)
            await expect(card.getByRole('img')).toBeVisible()
            await expect(inventoryPage.addButton(product)).toBeVisible()
        }
    })

    /**
     * Ordenação: o "oráculo" é o próprio catálogo ordenado pelo teste.
     * Assim o teste não depende de uma lista fixa escrita à mão.
     */
    const byName = (a: string, b: string) => a.localeCompare(b)
    const sortCases: { id: string; option: SortOption; label: string; check: 'names' | 'prices'; expected: () => (string | number)[] }[] = [
        { id: 'CT-021', option: 'az', label: 'nome (A a Z)', check: 'names', expected: () => ALL_PRODUCTS.map(p => p.name).sort(byName) },
        { id: 'CT-022', option: 'za', label: 'nome (Z a A)', check: 'names', expected: () => ALL_PRODUCTS.map(p => p.name).sort(byName).reverse() },
        { id: 'CT-023', option: 'lohi', label: 'preço (menor para maior)', check: 'prices', expected: () => ALL_PRODUCTS.map(p => p.price).sort((a, b) => a - b) },
        { id: 'CT-024', option: 'hilo', label: 'preço (maior para menor)', check: 'prices', expected: () => ALL_PRODUCTS.map(p => p.price).sort((a, b) => b - a) },
    ]

    for (const c of sortCases) {
        test(`${c.id} - Ordenar por ${c.label}`, { tag: ['@regression'] }, async ({ inventoryPage }) => {
            await inventoryPage.sortBy(c.option)

            const actual = c.check === 'names' ? await inventoryPage.getNames() : await inventoryPage.getPrices()
            expect(actual).toEqual(c.expected())
        })
    }

    test('CT-025 - Adicionar produto atualiza o contador e troca o botão para Remove', { tag: ['@smoke'] }, async ({ inventoryPage }) => {
        await inventoryPage.addToCart(PRODUCTS.backpack)

        await inventoryPage.header.expectCartCount(1)
        await expect(inventoryPage.removeButton(PRODUCTS.backpack)).toBeVisible()
        await expect(inventoryPage.addButton(PRODUCTS.backpack)).toBeHidden()
    })

    test('CT-026 - Remover produto pela lista atualiza o contador', { tag: ['@regression'] }, async ({ inventoryPage }) => {
        await inventoryPage.addToCart(PRODUCTS.backpack, PRODUCTS.onesie)
        await inventoryPage.header.expectCartCount(2)

        await inventoryPage.removeFromCart(PRODUCTS.backpack)

        await inventoryPage.header.expectCartCount(1)
        await expect(inventoryPage.addButton(PRODUCTS.backpack)).toBeVisible()
    })

    test('CT-027 - Adicionar todos os produtos', { tag: ['@regression'] }, async ({ inventoryPage }) => {
        await inventoryPage.addToCart(...ALL_PRODUCTS)

        await inventoryPage.header.expectCartCount(ALL_PRODUCTS.length)
    })
})

test.describe('Detalhes do produto', () => {
    test('CT-028 - Detalhes mostram o mesmo nome e preço da lista', { tag: ['@regression'] }, async ({ inventoryPage, productDetailsPage }) => {
        await inventoryPage.goto()

        await inventoryPage.openProduct(PRODUCTS.fleeceJacket)

        await productDetailsPage.expectProduct(PRODUCTS.fleeceJacket)
    })

    test('CT-029 - Adicionar pelo detalhe e voltar mantém o item no carrinho', { tag: ['@regression'] }, async ({ inventoryPage, productDetailsPage }) => {
        await inventoryPage.goto()
        await inventoryPage.openProduct(PRODUCTS.bikeLight)

        await productDetailsPage.addButton.click()
        await productDetailsPage.header.expectCartCount(1)
        await productDetailsPage.backButton.click()

        await inventoryPage.expectLoaded()
        await expect(inventoryPage.removeButton(PRODUCTS.bikeLight)).toBeVisible()
    })
})
