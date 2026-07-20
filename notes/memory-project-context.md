---
name: project-context
description: "Why game-portal exists, full project vision, tech stack, architecture, and current state"
metadata: 
  node_type: memory
  type: project
  originSessionId: a28785a7-4416-4abb-ba60-bdd399dca977
---

## What this project is
A public game portal with multiple mini games focused on competition at two levels: individual and team.

## Core Vision
- Anyone can register and play
- Players join **fixed global teams** (e.g. cats, dogs, birds, seaanimals)
- Compete in mini games — each game reports a score via a common contract
- **Percentile-based points**: beat X% of players → get X points
- Leaderboards sliced many ways: per game, across games, individual, team
- Later: custom competitions with custom teams (CMS territory)

## Tech Stack
- **Vite + React + TypeScript** — core framework
- **Supabase** — auth (email/password, Google) + PostgreSQL
- **Framer Motion** — animation library
- **Sanity CMS** — later, for custom competitions
- **React Three Fiber** — planned for 3D lobby

## Architecture — Story + Game Pattern

Games are composed from two layers:

**Story** — the game world scenario (enemy approaches, duel combat, etc.)
- Owns: game status, score, win/loss logic
- Exposes a `StoryAPI` via React Context

**Game** — the player interaction mechanic (typing, memory cards, etc.)
- Consumes `StoryAPI` via `useStory()` hook
- Calls `emitQuality(number)` to signal how well the player did
- Calls `emitCombo({ combo1, combo2 })` to trigger story-level bonuses

### StoryAPI contract (`src/games/stories/storyContext.tsx`)
```ts
type StoryAPI = {
    gameStatus: GameStatus          // 'idle' | 'running' | 'over'
    score: number
    startGame: () => void
    emitQuality: (quality: number) => void
    renderSlot: (targetSlot: ReactNode) => ReactNode   // injects story visual
    emitCombo?: (combos: Record<string, boolean>) => void
    storyMessage?: string           // story can show messages in game UI
}
```

### StorySlot pattern
Game renders `<StorySlot targetSlot={<SomeGameElement />} />`.
Story's `renderSlot` wraps that element inside the story visual (e.g. puts it on the battlefield, or next to the enemy track).

### Wiring example
```tsx
export default function MemorizeFruitGame() {
    return (
        <EnemyTrackStory config={ENEMY_TRACK_CONFIG} enemyAnimation={foxAnimation}>
            <MemorizeFruit config={MEMORIZE_ENEMY_TRACK_CONFIG} />
        </EnemyTrackStory>
    )
}
```

## Current Folder Structure
```
src/
  games/
    stories/
      storyContext.tsx              ← StoryAPI type + StoryCtx + useStory() + StorySlot
      enemy-track/
        useEnemyTrack.ts            ← story logic hook
        EnemyTrack.tsx              ← story visual component
        EnemyTrackStory.tsx         ← wires hook + visual + StoryAPI
        enemyTrackConfig.ts         ← EnemyTrackConfig type + ENEMY_TRACK_CONFIG + FRUIT_TYPER_CONFIG
      duel/
        useDuel.ts                  ← story logic hook (HP, damage, enemy spawn)
        Duel.tsx                    ← story visual (battlefield, sprites, HP bars)
        DuelStory.tsx               ← wires hook + visual + StoryAPI + animation sequence
        duelConfig.ts               ← DuelConfig type + DUEL_CONFIG
    fruit-typer/
      FruitTyper.tsx                ← game: typing control + EnemyTrackStory
      FruitTyper.scss
    memorize-fruit/
      MemorizeFruit.tsx             ← game: memory card control. exports default (EnemyTrack) + MemorizeFruitDuelGame
      MemorizeFruit.scss
      gameConfig.ts                 ← MemorizeFruitConfig type + MEMORIZE_ENEMY_TRACK_CONFIG + MEMORIZE_DUEL_CONFIG
                                       also BETWEEN_ROUND_INTERVAL, BONUS_TIME_LIMIT constants
  components/
    AnimatedSprite.tsx              ← split-sprite idle breathing animation + attack/hit/heal/dead states
    AnimatedSprite.scss
    GameBoard.tsx                   ← reusable game wrapper (title, score, idle/over screens)
    GameBoard.scss
    Navbar.tsx
    MotionSandbox.tsx               ← dev sandbox for testing animations
  pages/
    GamesPage.tsx / .scss           ← lists all games with route links
    HomePage.tsx
    LoginPage.tsx / RegisterPage.tsx
    CompetitionPage.tsx
    AssetsPage.tsx
    SpriteSandbox.tsx               ← dev sandbox for sprite testing
  context/
    AuthContext.tsx
    PlayerContext.tsx               ← player auth state (id, nickname, teamId, etc.)
  hooks/
    useGameEnd.ts                   ← fires scoreService.gameEnded() when gameStatus → 'over'
    useStatusMessage.ts             ← timed status message with auto-clear
  services/
    scoreService.ts
    supabase.ts
  assets/
    fruits/                         ← SVG fruit components + PNG folder (png/)
    fruits/index.ts                 ← exports fruitNames[], fruitImages{}, FruitName type
    animals/                        ← SVG animal components + lottie/fox.json
    animated/
      fantasyvillains/              ← 15 sprite PNGs (1.png–15.png) + index.ts
      heros/                        ← 1 hero sprite PNG + index.ts
    portraits/
      fantasyvillains/              ← 15 close-up portrait PNGs (1.png–15.png) + index.ts
      heros/                        ← 1 hero portrait PNG
    backgrounds/
      battlefields/                 ← 2 battlefield background PNGs
      ultra-wide-paths/             ← 5 path background PNGs for enemy track
      markers/                      ← freeze zone marker PNGs
  types/
    index.ts                        ← GameStatus type ('idle' | 'running' | 'over')
  eventBridge.ts
  utils.ts
  App.tsx                           ← routes
```

## Routes (App.tsx)
- `/` — HomePage
- `/games` — GamesPage
- `/fruit-typer` — FruitTyperGame
- `/memorize-fruit` — MemorizeFruitGame (EnemyTrack story)
- `/memorize-fruit-duel` — MemorizeFruitDuelGame (Duel story)
- `/competition` — CompetitionPage
- `/sandbox` — MotionSandbox
- `/sprite-sandbox` — SpriteSandbox

## Config Architecture (IMPORTANT — cleaned up this session)

Each story owns its own config file:
- `duelConfig.ts` → `DuelConfig` type + `DUEL_CONFIG` constant
- `enemyTrackConfig.ts` → `EnemyTrackConfig` type + `ENEMY_TRACK_CONFIG` (memorize-fruit) + `FRUIT_TYPER_CONFIG` (fruit-typer)

Each game owns its own config:
- `memorize-fruit/gameConfig.ts` → `MemorizeFruitConfig` type + per-variant constants

**Rule:** Story configs live in the story folder. Game configs live in the game folder. Never cross-pollinate.

## MemorizeFruit Game Config
```ts
type MemorizeFruitConfig = {
    pairCount: number           // how many pairs on the board
    bonusTimeDecreasing: boolean // whether max bonus time shrinks each round
    bonusTimeDecrement: number  // how much it shrinks per round
}
```
- `MEMORIZE_ENEMY_TRACK_CONFIG`: pairCount=4, bonusTimeDecreasing=true, bonusTimeDecrement=0.25
- `MEMORIZE_DUEL_CONFIG`: pairCount=3, bonusTimeDecreasing=false, bonusTimeDecrement=0.2

## AnimatedSprite Component
Split-sprite technique: image cut in half (top/bottom), animated with CSS to breathe.
- States: `'idle' | 'attack' | 'hit' | 'heal' | 'dead'`
- Props: `src`, `state`, `intensity` (default 1), `speed` (default 1)
- In Duel: `intensity={1.5}` `speed={1.6}`
- **Mirror fix**: hero faces right by default. To mirror, apply `transform: scaleX(-1)` on the PARENT div, not on `.sprite-root` — CSS animations overwrite transform on the root.

## Duel Story — Combat Animation Sequence
Flat `setTimeout` pattern (never nested) in `DuelStory.tsx`:
```
t=0:    hero 'attack'
t=550:  enemy 'hit', hookEmitQuality(quality) called
t=1450: both 'idle'
t=1650: enemy 'attack' (skipped if enemyDies)
t=2200: hero 'hit', enemyAttack() called
t=3100: both 'idle'
```
`enemyDies` is pre-calculated before any state updates (can't read state synchronously after setting it).

## Quality Formula (MemorizeFruit)
```ts
const base = 2 - (neutralMatches * 0.25)
const timeBonus = neutralMatches === 0 && elapsed < BONUS_TIME_LIMIT ? timeLeft * 0.1 : 0
quality = base + timeBonus
```
- `quality >= 2` → "great damage!"
- `quality >= 1.5` → "moderate damage"
- else → "miss" (no damage dealt, no enemy counter-attack)

## Combo System (MemorizeFruit + Duel)
- `combo1` (3 streak): heal player by `config.healAmount`
- `combo2` (6 streak): heal player to full


## Score Contract
```ts
scoreService.gameEnded(gameId, score, player)
```
