# Design — story→game "difficulty" channel + Duel enemy abilities

Status: **IMPLEMENTED 2026-07-21** on the story side. Snake does NOT yet interpret difficulty
(intentionally deferred — see "Still pending"). Original proposal kept below for rationale.

## What's built
- `StoryAPI.difficulty?: { value: number; id: number }` — story→game event channel
  ([storyContext.tsx]). `id` bumps per emit so repeat tokens still fire the game's effect.
- `duel/duelEnemies.ts` — `DuelEnemy` type + `DUEL_ENEMIES` (one fixed ability per villain
  index). 15 enemies: 0,1 dodge 20%; 2,3 bonus HP (+30,+60); 4,5 double-attack 30%;
  6,7 difficulty 1; 8,9 difficulty 2; 10,11 difficulty 3; 12-14 no ability.
- `useDuel(config, resolveEnemy)` — takes a resolver; `maxHpFor(n)` adds the enemy's
  `bonusHp`; tracks `enemyCountRef` for clean spawn HP.
- `DuelStory` — owns `villainOffsetRef` + `resolveEnemy`; rolls **dodge** in
  `runHeroHitSequence` (skips damage, plays 'dodge' sprite), rolls **double-attack** in
  `runEnemyHitSequence` (second swing). Difficulty is emitted by an **effect keyed on
  `[gameStatus, displayEnemyCount]`** — NOT from inside VisualSelection. It tracks the real
  enemy transition, so skipping/replacing the intro later won't break the signal.
  Also resets `displayEnemyCount` to 0 in `startGame` (replay correctness).
- `AnimatedSprite` — new `'dodge'` state + `sidestep` keyframe.
- `VisualSelection` — new `selectionSubtitle` prop; renders the ability blurb under the name,
  same 1s reveal timing.

## Still pending
- **Snake interpretation of difficulty** — the game still ignores `StoryAPI.difficulty`.
  Next: add the token→condition lookup in FruitSnake (see snake sketch below) mapping
  difficulty 1/2/3 to gameplay params (board size, speed, target goal, etc.).
- Balance pass on ability numbers.
- `useGameEnd` still uses a placeholder id, not a real game UUID.

---

# Original proposal (rationale)

Discussed 2026-07-20/21.

## The idea in one line
A generic **story→game** signal that mirrors the existing **game→story** `emitQuality`
signal. Story emits `difficulty`; the game decides what it means. Neither side imports
the other's config.

```
game → story:  emitQuality(n)      event, opaque scalar   story interprets → damage
story → game:  difficulty {..}     event, opaque scalar   game interprets  → its own condition
```

## Four corrections that shaped this (all from the user, all locked)

1. **Generic, not enemy/Duel-specific.** Difficulty is a channel any story can use.
   "Enemy" is just the *Duel story's* chosen source. Other stories could source it from a
   timer, boss phase, trap tile, wave counter, etc. The game must not know or care where it
   came from — same as the story doesn't know quality came from cards vs. snake.

2. **Event-shaped, not standing pull-state.** The source may be a *momentary event*
   ("a trap fired → difficulty spike"), which a plain reactive value can't represent (two
   identical values in a row wouldn't re-fire; there's no "moment"). Events are the general
   primitive; standing state (a Duel enemy) is just an event emitted when the state changes.

3. **An opaque *token*, NOT a ranked magnitude.** difficulty 5 is not architecturally
   "harder" than difficulty 2 — it's a label. The game maps each value to a condition via a
   **lookup**, never arithmetic on the number. How hard the mapped condition is = the game's
   decision, per token.

4. **Two categories of enemy ability** (Duel-specific): only ONE crosses the boundary.
   - extra HP  → handled entirely inside the Duel story (`useDuel` spawns with more HP)
   - 30% dodge → handled entirely inside the Duel story (`emitQuality` rolls dodge, no dmg)
   - difficulty → the ONLY ability pushed through the generic channel to the game

## The channel (contract)

`storyContext.tsx` — one optional field, so zero breakage for stories/games that ignore it:

```ts
export type StoryAPI = {
    // …existing…
    difficulty?: { value: number; id: number }   // story→game event; id bumps every emit
}
```

- `value` = opaque token (game looks it up).
- `id` = monotonic counter → this is what makes it an *event*: emitting the same `value`
  twice still fires, because `id` changed.

Mechanism note: React data flows *down*, so the story can't literally "call" the game the
way the game calls `emitQuality` upward. The event-object-with-id is the idiomatic downward
equivalent — the game **observes** it. The *semantics* are symmetric (opaque scalar event)
even though the *mechanism* can't be a mirror-image function call.

## Game side (consumer) — snake as the worked example

Mirror the event into a ref (refs-for-logic pattern) and interpret via a **lookup**, not math:

```ts
// snake's OWN interpretation table — arbitrary, game-owned, not ordered
const DIFFICULTY_CONDITIONS: Record<number, { goalBonus: number }> = {
    0: { goalBonus: 0 },
    5: { goalBonus: 1 },   // "difficulty 5" happens to mean +1 target for snake
    // …whatever snake decides each token means…
}

const { difficulty } = useStory()
const conditionRef = useRef(DIFFICULTY_CONDITIONS[0])
useEffect(() => {
    if (!difficulty) return
    conditionRef.current = DIFFICULTY_CONDITIONS[difficulty.value] ?? DIFFICULTY_CONDITIONS[0]
}, [difficulty?.id])

function effectiveTargetGoal() {
    return config.targetGoal + conditionRef.current.goalBonus
}
```

Replace semantics: the latest difficulty token is the active condition. Because it's a token
(not a magnitude), you never add tokens together — you look up the current one.
`step()`'s win check uses `effectiveTargetGoal()`; HUD shows `{collected} / {effectiveTargetGoal()}`.

## Story side (Duel as ONE producer)

Duel's difficulty *source* is the enemy. Enemy abilities live in the duel folder
(rule: story config → story folder), NOT in the shared visual `villains.ts`:

```ts
// src/games/stories/duel/duelEnemies.ts
export type DuelEnemy = {
    bonusHp: number       // story-internal (extra health)
    dodgeChance: number   // story-internal, 0..1
    difficulty: number    // the token forwarded to the game
}
export const DUEL_ENEMIES: DuelEnemy[] = [ /* one per villain slot, or a cycled pool */ ]
```

DuelStory: when `displayEnemyCount` changes (already under the reveal lock, so timing is
free), read the current enemy and emit a difficulty event:

```ts
// bump an id ref each time; set api.difficulty = { value: enemy.difficulty, id }
```

`bonusHp` / `dodgeChance` are consumed internally in `useDuel` and `emitQuality` — they
never touch the API. (Dodge fitting cleanly proves the boundary is right: on a dodge the
story just doesn't drop HP; the game already ended its round and never needed to know.)

## Blast radius
- New: `duel/duelEnemies.ts`
- Touched: `storyContext.tsx` (+1 optional field), `DuelStory.tsx` (emit event, apply HP/dodge),
  `useDuel.ts` (bonusHp on spawn, dodge roll), `FruitSnake.tsx` (observe + lookup)
- Untouched: EnemyTrackStory, both MemorizeFruit variants (field is optional)

## Suggested rollout (two commits)
1. Channel end-to-end with every enemy at difficulty 0 / empty lookup → pure plumbing,
   no behavior change.
2. Populate `DUEL_ENEMIES` with real abilities + wire HP/dodge → the balance work,
   isolated from the architectural change.

## Open decision for tomorrow
The token-lookup model above is the corrected design. Confirm it, then I implement.
