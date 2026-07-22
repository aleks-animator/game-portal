// how long the death shake + red flash plays before the board resets for the next round
export const DEATH_SHAKE_MS = 500

// how long the win celebration + yellow flash plays before the board resets for the next round
export const WIN_CELEBRATE_MS = 500

export type FruitSnakeConfig = {
    cols: number                   // grid width in cells
    rows: number                   // grid height in cells
    targetGoal: number            // how many target fruits to collect to win a round → quality 1
    initialSnakeLength: number    // starting snake length at the top of each round

    // snake step speed — ms between moves. Shrinks each round (snake gets faster).
    initialStepMs: number
    stepDecrement: number         // ms shaved off per round
    minStepMs: number             // floor

    // obstacle (wrong fruit) spawn cadence — ms between spawns. Shrinks each round.
    initialSpawnMs: number
    spawnDecrement: number        // ms shaved off per round
    minSpawnMs: number            // floor

    successQuality: number        // quality emitted when a round is completed (hero hits)
    failQuality: number           // quality emitted on wall/self/wrong-fruit (enemy hits)
}

export const FRUIT_SNAKE_DUEL_CONFIG: FruitSnakeConfig = {
    cols: 7,
    rows: 5,
    targetGoal: 3,
    initialSnakeLength: 3,

    initialStepMs: 660,
    stepDecrement: 18,
    minStepMs: 110,

    initialSpawnMs: 4000,
    spawnDecrement: 220,
    minSpawnMs: 900,

    successQuality: 1,
    failQuality: 0,
}
