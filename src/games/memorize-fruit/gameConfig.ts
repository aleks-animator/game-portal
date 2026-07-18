export const BETWEEN_ROUND_INTERVAL = 900

export const BONUS_TIME_LIMIT = 10


export type MemorizeFruitConfig = {
    pairCount: number         // 3 pairs = 6 cards, 4 pairs = 8 cards
    bonusTimeDecreasing: boolean,
    bonusTimeDecrement: number
}

export const MEMORIZE_ENEMY_TRACK_CONFIG: MemorizeFruitConfig = {
    pairCount: 4,
    bonusTimeDecreasing: true,
    bonusTimeDecrement: 0.25
}

export const MEMORIZE_DUEL_CONFIG: MemorizeFruitConfig = {
    pairCount: 3,
    bonusTimeDecreasing: false,
    bonusTimeDecrement: 0.2
}