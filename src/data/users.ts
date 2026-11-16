/**
 * Massa de dados: um usuário para cada situação.
 * Os usuários e a senha são públicos e aparecem na própria tela de login do Sauce Demo.
 */
export const PASSWORD = 'secret_sauce'

export const USERS = {
    standard: 'standard_user',
    lockedOut: 'locked_out_user',
    problem: 'problem_user',
    performanceGlitch: 'performance_glitch_user',
    error: 'error_user',
    visual: 'visual_user',
} as const

export const INVALID = {
    username: 'usuario_inexistente',
    password: 'senha_errada',
}
