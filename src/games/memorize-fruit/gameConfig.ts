import type { GameMode } from "../../types"

export const BETWEEN_ROUND_INTERVAL = 900

// time limit for the round clock — labeled "bonus" in default mode, "remaining time" in strict mode
export const TIME_LIMIT = 10

// bonusTimeDecrement never drops the round's time limit below this floor
export const MIN_TIME_LIMIT = 3


export type MemorizeFruitConfig = {
    pairCount: number         // 3 pairs = 6 cards, 4 pairs = 8 cards
    // 'default': neutral matches just cost bonus score, round continues
    // 'strict': a neutral match or running out of time ends the round (quality 0)
    gameMode: GameMode
    bonusTimeDecreasing: boolean,
    bonusTimeDecrement: number
}

export const MEMORIZE_ENEMY_TRACK_CONFIG: MemorizeFruitConfig = {
    pairCount: 4,
    gameMode: 'default',
    bonusTimeDecreasing: true,
    bonusTimeDecrement: 0.25
}

export const MEMORIZE_DUEL_CONFIG: MemorizeFruitConfig = {
    pairCount: 3,
    gameMode: 'strict',
    bonusTimeDecreasing: true,
    bonusTimeDecrement: 0.5
}