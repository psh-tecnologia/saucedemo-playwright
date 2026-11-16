# Sauce Demo · Testes E2E com Playwright + TypeScript

[![Playwright E2E](../../actions/workflows/playwright.yml/badge.svg)](../../actions/workflows/playwright.yml)

Suíte de testes automatizados ponta a ponta para a loja de demonstração
[Sauce Demo](https://www.saucedemo.com), cobrindo login, lista de produtos, carrinho e checkout.

> 🇺🇸 **English summary:** end-to-end test suite for [saucedemo.com](https://www.saucedemo.com) built with
> Playwright and TypeScript. It uses the Page Object Model with Playwright fixtures, a one-time login reused
> through `storageState`, data-driven tests built from decision tables, calculated oracles for sorting and
> order totals, tagged runs (`@smoke`, `@regression`, `@known-issue`) and a GitHub Actions pipeline that
> publishes the HTML report. Known defects of `problem_user` are documented as expected failures (`test.fail()`).
> The test plan is in [docs/TEST-PLAN.md](docs/TEST-PLAN.md) (Portuguese).

## O que tem aqui

| | |
|---|---|
| **42 testes** | 38 cenários funcionais + 3 defeitos conhecidos + 1 setup de login |
| **Plano de testes** | [docs/TEST-PLAN.md](docs/TEST-PLAN.md): estratégia, técnicas, cenários CT-xxx e defeitos BUG-xx |
| **Page Object Model** | uma classe por tela em `src/pages`, e o cabeçalho comum em `src/components` |
| **Fixtures** | os testes recebem os Page Objects prontos (`src/fixtures.ts`) |
| **Login reaproveitado** | o projeto `setup` faz login uma vez e grava a sessão (`storageState`) |
| **Data-driven** | tabelas de decisão viram um teste por linha (login e campos obrigatórios do checkout) |
| **Oráculos calculados** | ordenação e totais (subtotal + 8% de imposto) calculados pelo teste a partir do catálogo |
| **Defeitos documentados** | `problem_user` com `test.fail()` e anotação do defeito |
| **CI** | GitHub Actions a cada push/PR e toda segunda-feira, com relatório HTML como artefato |

## Técnicas de teste

- **Tabela de decisão:** login (usuário × senha) e campos obrigatórios do checkout
- **Partição de equivalência:** usuário válido, inexistente e bloqueado
- **Casos de borda:** usuário em maiúsculas e com espaço no início
- **Testes negativos e de controle de acesso:** páginas internas abertas sem login
- **Fluxo ponta a ponta:** da lista de produtos até a confirmação do pedido

## Estrutura

```
├── .github/workflows/playwright.yml   pipeline de CI
├── docs/TEST-PLAN.md                  plano de testes (cenários e defeitos)
├── src/
│   ├── components/Header.ts           carrinho e menu lateral, comuns às telas internas
│   ├── data/                          massa de dados: usuários, produtos, mensagens, comprador
│   ├── pages/                         Page Objects (Login, Inventory, Cart, Checkout...)
│   ├── utils/money.ts                 leitura de valores e cálculo dos totais esperados
│   └── fixtures.ts                    injeta os Page Objects nos testes
├── tests/
│   ├── auth.setup.ts                  login único e gravação da sessão
│   ├── login/                         CT-001 a CT-013
│   ├── inventory/                     CT-020 a CT-029
│   ├── cart/                          CT-030 a CT-034
│   ├── checkout/                      CT-040 a CT-047
│   └── known-issues/                  BUG-01 a BUG-03 (problem_user)
└── playwright.config.ts
```

## Como rodar

Pré-requisito: Node.js 20 ou superior.

```bash
npm ci
npx playwright install chromium
```

| Comando | O que faz |
|---|---|
| `npm test` | roda a suíte inteira |
| `npm run test:smoke` | só o caminho crítico (`@smoke`) |
| `npm run test:regression` | só os demais cenários (`@regression`) |
| `npm run test:headed` | roda com o navegador visível |
| `npm run typecheck` | checa os tipos TypeScript |
| `npm run report` | abre o relatório HTML da última execução |

Para usar o Google Chrome instalado em vez do Chromium do Playwright, defina `PW_CHANNEL=chrome`.

## Exemplo de teste

```ts
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
    await checkoutOverviewPage.finish()

    // CONFERIR: pedido confirmado e carrinho vazio
    await checkoutCompletePage.expectOrderCompleted()
    await checkoutCompletePage.header.expectCartCount(0)
})
```

## Autor

Paulo Henrique de Souza · Analista de QA · [LinkedIn](https://www.linkedin.com/in/paulohqsouza/)
