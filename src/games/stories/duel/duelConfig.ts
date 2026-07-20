import type { GameMode } from "../../../types"

export type DuelConfig = {
    playerHp: number
    enemyHp: number
    enemyHpIncrement: number
    damageScale: number
    enemyDamageBase: number
    enemyDamageVariance: number
    healAmount: number
    // 'default': hero and enemy trade blows every exchange (old behavior, currently unused)
    // 'strict': quality 0 → enemy hits only, quality > 0 → hero hits only
    gameMode: GameMode
}

export const DUEL_CONFIG: DuelConfig = {
    playerHp: 50,
    enemyHp: 50,
    enemyHpIncrement: 20,
    damageScale: 10,
    enemyDamageBase: 8,
    enemyDamageVariance: 0.2,
    healAmount: 20,
    gameMode: 'strict'
} as const

