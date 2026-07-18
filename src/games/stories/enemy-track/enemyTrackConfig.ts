export type EnemyTrackConfig = {
    initialSpeed: number
    speedIncrement: number
    speedIncrementInterval: number
    maxPushbackBoundary: number
    startPosition: number
    fruitPosition: number
    perfectHitZones?: readonly number[]
    perfectHitZoneRadius?: number
    perfectHitFreezeDuration?: number
    penaltyFreezeDuration: number
    qualityScale: number
}

export const ENEMY_TRACK_CONFIG: EnemyTrackConfig = {
    initialSpeed: 1,
    speedIncrement: 0.16,
    penaltyFreezeDuration: 300,
    maxPushbackBoundary: 0.9,
    speedIncrementInterval: 5000,
    startPosition: 0.9,
    fruitPosition: 0.03,
    qualityScale: 0.15
} as const

export const FRUIT_TYPER_CONFIG: EnemyTrackConfig = {
    initialSpeed: 2,
    speedIncrement: 0.6,
    penaltyFreezeDuration: 300,
    maxPushbackBoundary: 0.9,
    speedIncrementInterval: 5000,
    perfectHitZones: [0.35, 0.65],
    perfectHitZoneRadius: 0.03,
    perfectHitFreezeDuration: 4000,
    startPosition: 0.9,
    fruitPosition: 0.03,
    qualityScale: 0.15
} as const
