export type DuelConfig = {
    playerHp: number
    enemyHp: number
    enemyHpIncrement: number
    damageScale: number
    enemyDamageBase: number
    enemyDamageVariance: number
    healAmount: number
}

export const DUEL_CONFIG: DuelConfig = {
    playerHp: 100,
    enemyHp: 50,
    enemyHpIncrement: 20,
    damageScale: 10,
    enemyDamageBase: 8,
    enemyDamageVariance: 0.2,
    healAmount: 20
} as const

