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

## Next to build

### 1. VisualSelection component
**Purpose:** Dramatic enemy intro reveal between duel rounds.

**Props agreed:**
```ts
type Props = {
    images: string[]       // all available portraits to pick from
    selected: string       // the actual enemy portrait to reveal
    minCount?: number      // minimum to show in grid (default 8)
    onComplete: () => void // called when reveal animation finishes
}
```

**Behavior:**
- Randomly picks 8-10 images from `images` array (must include `selected`)
- Displays them in a masonry grid, fading in one by one, fast
- 1-2s anticipation pause (some animation/icon)
- Selected image gets dramatic reveal — expands to fill the full game frame
- Selected is NOT visually distinguished in grid until reveal begins
- Auto-calls `onComplete()` after reveal — no CTA button yet
- Takes full game frame width/height (not browser fullscreen)

**Where it will be used:** `DuelStory.tsx` — shown when `enemyCount` changes (new enemy spawned). Portrait images come from `src/assets/portraits/fantasyvillains/index.ts` (`villainPortraits` array).

### 2. Story pause mechanism
**Purpose:** Lock game input during story animation sequences (e.g. 3.1s duel combat).

**Approach:** Add `isLocked?: boolean` to `StoryAPI`. Game checks it in `handleCardClick` before processing. Story sets it true at start of animation sequence, false at end.

**Why not done yet:** Intro (VisualSelection) runs during 'idle' state so no conflict. Pause is needed for mid-game combat lock — can be added after intro.

### 3. Balance pass
- Damage numbers, HP values, quality thresholds
- Timer speeds and bonus multipliers

### 4. Enemy intro wiring into DuelStory
After VisualSelection exists: track `enemyCount` changes in `DuelStory`, show `VisualSelection` overlay with correct portrait, resume game on `onComplete`.

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
