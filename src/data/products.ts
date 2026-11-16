/**
 * Catálogo esperado. Serve de "oráculo" para conferir nomes, preços e ordenação.
 * O `id` é o pedaço usado nos data-test dos botões: add-to-cart-<id> / remove-<id>.
 */
export interface Product {
    id: string
    name: string
    price: number
}

export const PRODUCTS = {
    backpack: { id: 'sauce-labs-backpack', name: 'Sauce Labs Backpack', price: 29.99 },
    bikeLight: { id: 'sauce-labs-bike-light', name: 'Sauce Labs Bike Light', price: 9.99 },
    boltTShirt: { id: 'sauce-labs-bolt-t-shirt', name: 'Sauce Labs Bolt T-Shirt', price: 15.99 },
    fleeceJacket: { id: 'sauce-labs-fleece-jacket', name: 'Sauce Labs Fleece Jacket', price: 49.99 },
    onesie: { id: 'sauce-labs-onesie', name: 'Sauce Labs Onesie', price: 7.99 },
    redTShirt: { id: 'test.allthethings()-t-shirt-(red)', name: 'Test.allTheThings() T-Shirt (Red)', price: 15.99 },
} satisfies Record<string, Product>

export const ALL_PRODUCTS: Product[] = Object.values(PRODUCTS)

/** Alíquota de imposto aplicada pelo Sauce Demo no resumo do pedido. */
export const TAX_RATE = 0.08
