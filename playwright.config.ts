import { defineConfig, devices } from '@playwright/test'

/**
 * Configuração geral da suíte.
 *
 * - testIdAttribute: 'data-test' -> o Sauce Demo marca os elementos com data-test="...",
 *   então page.getByTestId('login-button') já encontra <input data-test="login-button">.
 * - O projeto "setup" faz login uma vez e guarda a sessão (storageState); os demais testes
 *   já começam logados, sem repetir a tela de login em todo teste.
 * - PW_CHANNEL=chrome (opcional) usa o Google Chrome instalado em vez do Chromium do Playwright.
 */
const isCI = !!process.env.CI
const channel = process.env.PW_CHANNEL || undefined

export const STORAGE_STATE = '.auth/standard_user.json'

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: isCI,
    retries: isCI ? 2 : 0,
    workers: isCI ? 2 : undefined,
    timeout: 30_000,
    expect: { timeout: 5_000 },
    reporter: isCI
        ? [['github'], ['list'], ['html', { open: 'never' }]]
        : [['list'], ['html', { open: 'never' }]],
    use: {
        baseURL: 'https://www.saucedemo.com',
        testIdAttribute: 'data-test',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    projects: [
        {
            name: 'setup',
            testMatch: /.*\.setup\.ts/,
            use: { channel },
        },
        {
            name: 'chromium',
            dependencies: ['setup'],
            use: { ...devices['Desktop Chrome'], channel, storageState: STORAGE_STATE },
        },
    ],
})
