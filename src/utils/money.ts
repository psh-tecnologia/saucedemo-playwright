/** Converte um texto como "Item total: $39.98" ou "$29.99" em número (39.98). */
export function parseMoney(text: string): number {
    const match = text.match(/\$(\d+(?:\.\d{1,2})?)/)
    if (!match) throw new Error(`Valor monetário não encontrado em: "${text}"`)
    return Number(match[1])
}

/** Arredonda para 2 casas, como uma tela de preço exibe. */
export function round2(value: number): number {
    return Math.round(value * 100) / 100
}

/** Subtotal, imposto e total esperados para uma lista de preços. */
export function expectedTotals(prices: number[], taxRate: number) {
    const subtotal = round2(prices.reduce((sum, p) => sum + p, 0))
    const tax = round2(subtotal * taxRate)
    return { subtotal, tax, total: round2(subtotal + tax) }
}
