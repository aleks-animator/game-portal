---
name: handover
description: "Detailed session handover — current state, what was just done, what's next, patterns to follow"
metadata: 
  node_type: memory
  type: project
  originSessionId: a28785a7-4416-4abb-ba60-bdd399dca977
---

## Session summary (2026-07-11)

This session was primarily config architecture cleanup + wiring MemorizeFruitConfig into the game. The Duel story and MemorizeFruit game were built in the previous session.

---

## What was done this session

### Config architecture cleanup
The project had a messy config situation. Story configs were living in the game folder (`memorize-fruit/gameConfig.ts`). Fixed by moving everything to where it belongs:

- `DUEL_CONFIG` → `src/games/stories/duel/duelConfig.ts` (type was already there)
- `ENEMY_TRACK_CONFIG` (for MemorizeFruit) → `src/games/stories/enemy-track/enemyTrackConfig.ts`
- `FRUIT_TYPER_CONFIG` (for FruitTyper) → `src/games/stories/enemy-track/enemyTrackConfig.ts`
- `EnemyTrackConfig` type moved from `useEnemyTrack.ts` → `enemyTrackConfig.ts` (matching pattern of DuelConfig in duelConfig.ts)
- `FruitTyper/gameConfig.ts` deleted entirely
- `qualityScale` merged into `EnemyTrackConfig` (was a separate `EnemyTrackStoryConfig` type — over-engineering)
- `memorize-fruit/gameConfig.ts` now contains ONLY MemorizeFruit-specific stuff

**Rule going forward:** Story configs in story folder. Game configs in game folder. Never cross-pollinate.

### MemorizeFruitConfig wired
New type in `memorize-fruit/gameConfig.ts`:
```ts
type MemorizeFruitConfig = {
    pairCount: number           // pairs on board (3 = 6 cards, 4 = 8 cards)
    bonusTimeDecreasing: boolean // whether max bonus time shrinks each round
    bonusTimeDecrement: number  // shrink amount per round
}
```
Two constants: `MEMORIZE_ENEMY_TRACK_CONFIG` and `MEMORIZE_DUEL_CONFIG`.

Wired into `MemorizeFruit`:
- `config.pairCount` used in `dealCards` instead of hardcoded `4`
- `bonusTimeLimitRef` (useRef) tracks current max — starts at `BONUS_TIME_LIMIT`, shrinks by `config.bonusTimeDecrement` after each target match (only if `config.bonusTimeDecreasing`)
- `startRound()` resets `timeLeft` to `bonusTimeLimitRef.current`
- Timer countdown (`setTimeLeft(prev => prev - 1)`) currently always runs — **TODO: make conditional on `bonusTimeDecreasing`**

### FruitTyper pushback bug fixed
`FRUIT_TYPER_CONFIG` was missing `qualityScale` — pushback computed `NaN` and enemy froze after first hit.

### DuelStory.tsx file rename
Was `duelStory.tsx` (lowercase d) on disk, causing TS1261 casing error. Renamed to `DuelStory.tsx`.

---

## Current state of each game

### FruitTyper (`/fruit-typer`)
- Complete and working
- Uses `EnemyTrackStory` with `FRUIT_TYPER_CONFIG`
- Typing control, penalty shake, perfect hit freeze zones

### MemorizeFruit (`/memorize-fruit` and `/memorize-fruit-duel`)
- Complete and working (two variants)
- Memory card grid, target fruit matching, neutral match penalty
- Bonus timer with shrinking max across rounds
- Quality formula: `base = 2 - (neutralMatches * 0.25)` + time bonus
- Combo system: 3-streak = heal, 6-streak = full heal
- `Wrong target!` feedback with shake animation on neutral match cards

### Duel story (used by MemorizeFruitDuelGame)
- HP bars, animated sprites, battlefield background
- Combat animation sequence (flat setTimeout, ~3.1s total)
- Enemy spawns with increasing HP (`enemyHpIncrement`)
- Hero mirrored via CSS on parent div (NOT on sprite-root — animation would overwrite transform)

---

## Since this handover was written — both "next to build" items are DONE

### 1. VisualSelection component — DONE
Built at [VisualSelection.tsx](src/components/VisualSelection.tsx) + `VisualSelection.scss`. Matches the agreed props plus one addition: `selectionText?: string` (villain name shown in the reveal bar) and a `simple?: boolean` escape hatch (skips straight to `'reveal'` phase).

Actual behavior:
- 3-phase state machine: `'grid'` (3s) → `'anticipation'` (2s) → `'reveal'` (4.5s), then calls `onComplete()`
- Grid picks `minCount` (default 8) + 0-2 random images, `selected` inserted at a random index ≥1
- CSS masonry grid (`VisualSelection.scss`) hand-tuned per `data-count` (2 through 10) for column spans
- Anticipation phase: selected image gets a glowing yellow outline (`.anticipating`), others go grayscale (`.fading`)
- Reveal phase: full-frame card-flip animation (`cardFlip` keyframe) on the selected image, with a name bar that fades in after 1s via `showName` state

**Wired into** [DuelStory.tsx](src/games/stories/duel/DuelStory.tsx): rendered as `overlay` both in `startGame()` (first villain) and in a `useEffect` on `enemyCount` change (subsequent villains). Villain data now comes from `src/assets/villains.ts` (not the `portraits/fantasyvillains/index.ts` array assumed in the original plan — check [villains.ts](src/assets/villains.ts) for the current shape, it wasn't re-read this pass).

### 2. Story pause mechanism — DONE
`isLocked: boolean` and `overlay?: ReactNode` are both real, non-optional-in-practice fields on `StoryAPI` ([storyContext.tsx](src/games/stories/storyContext.tsx)).
- `DuelStory` sets `isLocked` true/false around both the `VisualSelection` overlay and the combat animation sequence (t=0 to t=3100).
- `GameBoard.tsx` renders `overlay` in an absolutely-positioned layer above `children`, and hides `children` while `overlay` is set (`gameStatus === 'running' && !overlay`).
- `MemorizeFruit.tsx` checks `isLocked` to gate the timer countdown effect and `handleCardClick`, and dims the board with a semi-transparent layer while locked.

### Still open
- Balance pass (damage numbers, HP values, quality thresholds, timer speeds/bonus multipliers) — not touched.
- No other "next" item was identified this pass; re-derive from current code/git log rather than trusting older planning notes below, which are now stale.

---

## FruitSnakeDuels — NEW game built (2026-07-20)

New game `src/games/fruit-snake/` — a snake game wrapped in the **Duel** story (`DuelStory` + `DUEL_CONFIG`). Route `/fruit-snake-duel`, added to `App.tsx` GAME_ROUTES + Routes and to GamesPage. TS compiles clean (user verifies UI themselves — no browser test).

### Files
- `fruit-snake/gameConfig.ts` — `FruitSnakeConfig` type + `FRUIT_SNAKE_DUEL_CONFIG` (boardSize 9, targetGoal 5, initialSnakeLength 3, step/spawn speed with per-round decrement + floor, successQuality 1 / failQuality 0).
- `fruit-snake/FruitSnake.tsx` — `FruitSnake` game component + default export `FruitSnakeDuelGame` (wires DuelStory).
- `fruit-snake/FruitSnake.scss` — grid board (purple), green snake, pulsing target fruit.

### Mechanics (first simple version, matches user spec)
- 9×9 grid. One **target fruit** to collect; every other spawned fruit is an **obstacle**. Collect target → snake grows + new target spawns. Collect `targetGoal` (5) → `emitQuality(1)` (hero hits), new round.
- Hit wall / self / any obstacle → `emitQuality(0)` (enemy hits, strict mode), new round.
- Difficulty ramps **every round-end** (success OR fail): `roundRef++`, snake step faster + obstacle spawn faster (via `speedsForRound(r)`, both floored). Continuous across enemies; resets only on `startGame`.
- Steering: arrow keys + WASD, no 180° reversal (`lastDirRef`).

### Loop/lock architecture (important)
- Logic source of truth in **refs** (snake/target/obstacles/collected/round/dir/speeds), render state mirrors them — same refs-for-logic / state-for-render rule.
- Two self-rescheduling `setTimeout` loops (move + obstacle spawn) live in ONE effect keyed `[gameStatus, isLocked, round]`. `isLocked` (from DuelStory's useSequenceLock) tears the loops down → game auto-pauses during the VisualSelection enemy reveal AND the hit animation, then resumes. `round` dep restarts loops at the new speed.
- `roundActiveRef` flips false the instant an outcome fires, so an in-flight spawn/step tick can't act mid-transition. `endRound()` is guarded by it (idempotent).

### Open / TODO
- `useGameEnd("fruit-snake-duel", ...)` uses a **string placeholder id**, not a real DB game UUID (MemorizeFruit uses a UUID). Score reporting won't land until a real game id exists.
- No combo/heal wiring (emitCombo unused) — kept simple. Balance pass (speeds, quality/damage) untuned.

---

## Difficulty channel + Duel enemy abilities — built 2026-07-21

Full design + status: [design-difficulty-channel.md](design-difficulty-channel.md). Summary:
- **New story→game channel**: `StoryAPI.difficulty?: { value, id }` — opaque token, game interprets. Symmetric to `emitQuality` (game→story). `id` bumps per emit so repeats re-fire.
- **`duel/duelEnemies.ts`** (NEW): `DuelEnemy` type + `DUEL_ENEMIES`, fixed ability per villain index (15 enemies). Two ability categories: Duel-internal (bonusHp / dodgeChance / doubleAttackChance) vs cross-boundary (difficulty token).
- **`useDuel` signature changed**: now `useDuel(config, resolveEnemy)`. Applies bonusHp via `maxHpFor`.
- **DuelStory**: dodge (in runHeroHitSequence — skips damage, 'dodge' sprite), double-attack (runEnemyHitSequence — 2nd swing), `emitDifficulty` at both VisualSelection reveal points, subtitle passed to VisualSelection. Also resets `displayEnemyCount` in startGame (replay fix).
- **AnimatedSprite**: new `'dodge'` state + `sidestep` keyframe.
- **VisualSelection**: new `selectionSubtitle` prop (ability blurb under the name).
- **STILL PENDING**: FruitSnake does NOT yet read `difficulty` — token→condition lookup (map difficulty 1/2/3 to board size/speed/goal) is the next step, deliberately deferred.

---

## Key patterns — follow these strictly

### Animation sequences
Flat `setTimeout`, never nested:
```ts
setTimeout(() => { ... }, 550)
setTimeout(() => { ... }, 1450)
setTimeout(() => { ... }, 1650)
```

### Pre-calculate before setState
```ts
const enemyDies = Math.max(0, enemyHp - quality * config.damageScale) <= 0
// THEN call hookEmitQuality(quality) which triggers setState
```

### Refs vs State
- Ref: value used in logic/calculations but not directly rendered (positions, timers, counters)
- State: value that appears in JSX and needs to trigger re-render

### Mirror sprites
Apply `transform: scaleX(-1)` on the PARENT div of `<AnimatedSprite>`, never on the sprite root. CSS animations overwrite `transform` on the root.

### Config ownership
- Story config → story folder
- Game config → game folder
- Constants that never vary per variant → bare `export const` at top of config file

---

## Files to read first in a new session
1. `src/games/stories/storyContext.tsx` — the StoryAPI contract
2. `src/games/stories/duel/DuelStory.tsx` — how a story is wired
3. `src/games/memorize-fruit/MemorizeFruit.tsx` — how a game consumes the story
4. `src/games/stories/duel/duelConfig.ts` — DuelConfig type + DUEL_CONFIG
5. `src/games/stories/enemy-track/enemyTrackConfig.ts` — EnemyTrackConfig type + both configs
6. `src/games/memorize-fruit/gameConfig.ts` — MemorizeFruitConfig type
