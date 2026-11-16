# Plano de testes: Sauce Demo

## 1. Objetivo e escopo

Validar os fluxos principais de compra da loja de demonstração [Sauce Demo](https://www.saucedemo.com):
login, lista de produtos, carrinho e checkout, com testes E2E automatizados em Playwright + TypeScript.

**Fora do escopo:** testes visuais (`visual_user`), desempenho (`performance_glitch_user`),
acessibilidade e compatibilidade entre navegadores (a suíte roda em Chromium).

## 2. Estratégia

| Item | Decisão |
|---|---|
| Nível | E2E pela interface, do ponto de vista do usuário |
| Padrão de projeto | Page Object Model + fixtures do Playwright (`src/fixtures.ts`) |
| Localizadores | atributo `data-test` do próprio site (`testIdAttribute`), que não muda com o layout |
| Sessão | login feito uma vez no projeto `setup` e reaproveitado (`storageState`); só os testes de login começam deslogados |
| Massa de dados | um usuário para cada situação (`src/data/users.ts`) e catálogo como oráculo (`src/data/products.ts`) |
| Oráculos | ordenação e totais calculados pelo próprio teste a partir do catálogo, sem valores fixos escritos à mão |
| Etiquetas | `@smoke` (caminho crítico), `@regression` (demais cenários), `@known-issue` (defeitos conhecidos) |
| Execução contínua | GitHub Actions a cada push/PR e toda segunda-feira, com relatório HTML como artefato |

### Técnicas de teste aplicadas

- **Tabela de decisão:** combinações de usuário/senha no login (CT-002 a CT-009) e de campos obrigatórios no checkout (CT-041 a CT-044).
- **Partição de equivalência:** usuário válido, inexistente e bloqueado.
- **Casos de borda:** usuário em maiúsculas e com espaço no início (CT-007, CT-008).
- **Testes negativos:** acesso direto a páginas internas sem login (CT-012).
- **Testes orientados a dados:** cada linha das tabelas vira um teste (`for ... of` gerando `test()`).

## 3. Cenários

Legenda de prioridade: 🔴 alta · 🟠 média.

### 3.1 Login e controle de acesso (`tests/login/login.spec.ts`)

| ID | Cenário | Entrada | Resultado esperado | Prior. |
|---|---|---|---|---|
| CT-001 | Login válido | `standard_user` / `secret_sauce` | Abre a lista de produtos | 🔴 |
| CT-002 | Usuário e senha vazios | vazio / vazio | `Username is required` | 🔴 |
| CT-003 | Senha vazia | `standard_user` / vazio | `Password is required` | 🔴 |
| CT-004 | Usuário vazio | vazio / `secret_sauce` | `Username is required` | 🟠 |
| CT-005 | Senha errada | `standard_user` / `senha_errada` | `Username and password do not match...` | 🔴 |
| CT-006 | Usuário inexistente | `usuario_inexistente` / `secret_sauce` | `Username and password do not match...` | 🔴 |
| CT-007 | Usuário em maiúsculas | `STANDARD_USER` / `secret_sauce` | `Username and password do not match...` | 🟠 |
| CT-008 | Espaço antes do usuário | ` standard_user` / `secret_sauce` | `Username and password do not match...` | 🟠 |
| CT-009 | Usuário bloqueado | `locked_out_user` / `secret_sauce` | `Sorry, this user has been locked out.` | 🔴 |
| CT-010 | Fechar mensagem de erro | erro de login + fechar (X) | Mensagem e ícones de erro somem (a borda vermelha dos campos permanece) | 🟠 |
| CT-011 | Senha mascarada | campo de senha | `type="password"` | 🟠 |
| CT-012 | Acesso direto sem login | `/inventory.html`, `/cart.html`, `/checkout-step-one.html` | Volta ao login com `You can only access '<página>' when you are logged in.` | 🔴 |
| CT-013 | Logout | menu > Logout | Volta ao login; a área interna não abre sem novo login | 🔴 |

### 3.2 Lista de produtos (`tests/inventory/inventory.spec.ts`)

| ID | Cenário | Resultado esperado | Prior. |
|---|---|---|---|
| CT-020 | Exibição do catálogo | 6 produtos com nome, preço, imagem e botão Add to cart | 🔴 |
| CT-021 | Ordenar por nome A a Z | Nomes em ordem alfabética | 🟠 |
| CT-022 | Ordenar por nome Z a A | Nomes em ordem alfabética inversa | 🟠 |
| CT-023 | Ordenar por preço crescente | Preços do menor para o maior | 🟠 |
| CT-024 | Ordenar por preço decrescente | Preços do maior para o menor | 🟠 |
| CT-025 | Adicionar ao carrinho | Contador = 1 e o botão vira Remove | 🔴 |
| CT-026 | Remover pela lista | Contador diminui e o botão volta a Add to cart | 🟠 |
| CT-027 | Adicionar todos | Contador = 6 | 🟠 |
| CT-028 | Detalhes do produto | Mesmo nome e preço da lista, com descrição | 🟠 |
| CT-029 | Adicionar pelo detalhe e voltar | Item continua no carrinho ao voltar à lista | 🟠 |

### 3.3 Carrinho (`tests/cart/cart.spec.ts`)

| ID | Cenário | Resultado esperado | Prior. |
|---|---|---|---|
| CT-030 | Conteúdo do carrinho | Produtos adicionados, quantidade 1 e preço do catálogo | 🔴 |
| CT-031 | Remover no carrinho | Item sai da lista e o contador diminui | 🟠 |
| CT-032 | Recarregar a página | Carrinho mantido | 🟠 |
| CT-033 | Continue Shopping | Volta à lista sem perder os itens | 🟠 |
| CT-034 | Reset App State | Contador zerado e carrinho vazio | 🟠 |

### 3.4 Checkout (`tests/checkout/checkout.spec.ts`)

| ID | Cenário | Resultado esperado | Prior. |
|---|---|---|---|
| CT-040 | Compra completa (E2E) | `Thank you for your order!`, carrinho vazio, Back Home volta à lista | 🔴 |
| CT-041 | Todos os campos vazios | `First Name is required` | 🔴 |
| CT-042 | Sem nome | `First Name is required` | 🔴 |
| CT-043 | Sem sobrenome | `Last Name is required` | 🔴 |
| CT-044 | Sem CEP | `Postal Code is required` | 🔴 |
| CT-045 | Cancelar no passo 1 | Volta ao carrinho com os itens | 🟠 |
| CT-046 | Totais do pedido | Subtotal = soma dos preços; imposto = 8% arredondado; total = subtotal + imposto | 🔴 |
| CT-047 | Cancelar no resumo | Volta à lista sem perder o carrinho | 🟠 |

## 4. Defeitos encontrados (`tests/known-issues/problem-user.spec.ts`)

O `problem_user` reproduz defeitos de propósito. Os testes descrevem o comportamento correto e usam
`test.fail()`: a falha é esperada enquanto o defeito existir.

| ID | Defeito | Passos | Esperado | Obtido | Severidade |
|---|---|---|---|---|---|
| BUG-01 | Imagens dos produtos erradas | Login com `problem_user` | Cada produto com a sua imagem | Todos exibem a mesma imagem quebrada (`sl-404`) | Média |
| BUG-02 | Ordenação não funciona | `problem_user` > ordenar Z a A | Lista invertida | A ordem não muda | Média |
| BUG-03 | Add to cart não funciona em 3 produtos | `problem_user` > Add to cart em todos | Contador = 6 | Contador = 3; Bolt T-Shirt, Fleece Jacket e T-Shirt (Red) não entram no carrinho | Alta |

### Observação de produto (não automatizada como defeito)

- O checkout pode ser iniciado com o carrinho **vazio** e o pedido é concluído com total $0.00
  ("Thank you for your order!"). Não há requisito publicado dizendo o contrário, então fica registrado
  como ponto a confirmar com o produto, e não como defeito.
- Ao fechar a mensagem de erro do login, os ícones somem mas a borda vermelha dos campos continua até
  a próxima tentativa (CT-010 confere o comportamento atual).
