# TypeScript Basics

## What is TypeScript?

TypeScript is a layer above JavaScript. In the end it's still JS — but it adds **types** to fix one of JavaScript's biggest weaknesses: JS doesn't care what type of data lives in a variable or function. This causes bugs that are hard to track down.

TypeScript catches these bugs **at compile time** (when you save/build) — before they ever reach the browser.

---

## Type Inference

TypeScript is smart enough to figure out types on its own:

```ts
const [count, setCount] = useState(0)
```

TypeScript sees `0` and infers `count` is of type `number`. You didn't have to tell it.

---

## Explicit Types (Generics)

Sometimes you write the type explicitly — especially with complex objects:

```ts
const [count, setCount] = useState<number>(0)
```

The `<number>` is called a **generic** — you're telling TypeScript exactly what type this holds.

---

## The `number` type

TypeScript has no `int`, `float`, or `double`. All numbers are just `number`:

```ts
const score: number = 42
const time: number = 3.14
```

---

## Defining Object Shapes with `type`

When your state is an object, you define its exact shape:

```ts
type Score = {
  id: string
  gameId: string
  playerId: string
  teamId: string
  value: number
  recordedAt: string  // ISO date string e.g. "2026-04-10T23:43:00Z"
}
```

TypeScript will enforce that every `Score` object has exactly these fields with exactly these types.

---

## Optional Properties `?`

TypeScript is strict — every field must be present unless marked optional with `?`:

```ts
type Game = {
  id: string
  name: string
  scoringDirection?: 'asc' | 'desc'  // optional — can be missing
}
```

Without `?` → mandatory. TypeScript throws an error if missing.

---

## Union Types

A field that can be one of several specific values:

```ts
type ScoreType = 'time' | 'points' | 'rank' | 'level'
```

TypeScript will reject any value not in this list. Great for preventing typos and invalid states.

---

## Named vs Inline Types

**Named** — define separately, reuse everywhere:
```ts
type BattleState = {
  status: string
  tick: number
}

const [state, setState] = useState<BattleState>(...)
```

**Inline** — quick, one-off, not reused:
```ts
const [state, setState] = useState<{
  attackerId: string | null
  isSkill: boolean
}>({ attackerId: null, isSkill: false })
```

Rule of thumb: if you'll use the shape in more than one place → name it.

---

## Dates are strings

There is no `Date` type in JSON or databases. Dates travel over the network as ISO strings:

```
"2026-04-10T23:43:00Z"
```

So in your types, dates are always `string`. Convert to a `Date` object only when you need to display or calculate with it in the UI.

---

## Function Types

Functions have types on two things — what goes **in** and what comes **out**:

```ts
function calculatePoints(scoreValue: number): number {
  // ...
}
```

- `scoreValue: number` — parameter type
- `: number` after `()` — return type

### `void` — when a function returns nothing

```ts
function saveScore(score: Score): void {
  // saves to database, returns nothing
}
```

### Return type inference

TypeScript can infer return types too. Your IDE will display what it inferred (e.g. `: JSX.Element`) even if you didn't write it. If TypeScript can figure it out — let it. Write it explicitly only when it matters for clarity or enforcement.

---

## `type` vs `interface`

You'll see both in the wild — they do roughly the same job:

```ts
type Player = { id: string; name: string }
interface Player { id: string; name: string }
```

In this project we always use `type`. Just know `interface` exists when reading other code.

---

## Type Aliases — giving meaning to primitives

Instead of scattering `string` everywhere, give it a meaningful name:

```ts
type Id = string
```

Now use it consistently:

```ts
type Score = {
  id: Id
  playerId: Id
  gameId: Id
  value: number
  recordedAt: string
}
```

**Why it matters:** Every entity in the system (player, game, team, score) gets an ID from the same system, same format, same rules. Like a dystopian registry — total control, one classification. And if the ID format ever changes, you update it in one place only.

---

## Where types live in this project

```
src/
  types/       ← all TypeScript type definitions live here
```

Types are shared across the whole app — components, services, hooks all import from here.
