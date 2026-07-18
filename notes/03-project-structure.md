# Project Structure & Routing

## Folder Structure

```
src/
  types/       ← TypeScript definitions (Score, Player, Game, Team...)
  hooks/       ← useTimer(), useLeaderboard(), usePlayer()
  services/    ← Supabase calls, score engine, percentile calculator
  components/  ← reusable UI pieces (Navbar, Leaderboard, PlayerCard...)
  context/     ← React Context providers (PlayerContext, GameContext...)
  pages/       ← full page components (HomePage, CompetitionPage...)
  games/       ← individual mini games
```

Rule: **if it's not UI, it doesn't go in components.**

---

## Types we defined — `src/types/index.ts`

```ts
export type Id = string
export type ScoreType = 'time' | 'points' | 'rank' | 'level'

export type Score = {
  id: Id
  gameId: Id
  playerId: Id
  teamId: Id
  value: number
  recordedAt: string
}

export type Game = {
  id: Id
  name: string
  scoreType: ScoreType
  scoringDirection: 'asc' | 'desc'
}

export type Player = {
  id: Id
  teamId: Id
  nickname: string
  avatarUrl: string
  createdAt: string
  email: string
}

export type Team = {
  id: Id
  name: string
  createdAt: string
  avatarUrl: string
}
```

---

## The Event Bridge — `src/eventBridge.ts`

The core contract of the portal. Any game calls this when it ends:

```ts
import type { Id } from './types'

export const gameEnded = (gameId: Id, playerId: Id, teamId: Id, value: number) => {
  console.log("game ID: " + gameId)
  console.log("player ID: " + playerId)
  console.log("team ID: " + teamId)
  console.log("value: " + value)
}
```

Any game, any mechanic — they all funnel through here into a unified format.

---

## Routing — React Router

📖 **SPA routing** — the browser loads one HTML file once. JavaScript watches the URL and swaps content in/out without full page reloads. URLs still change, back/forward still works.

### Setup in `main.tsx`

```tsx
<StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</StrictMode>
```

`BrowserRouter` watches the URL bar and makes routing available to the whole app. `StrictMode` is outermost — it's a dev tool that wraps everything.

### Defining routes in `App.tsx`

```tsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/competition" element={<CompetitionPage />} />
</Routes>
```

- `Routes` — looks at the current URL
- `Route` — if `path` matches → render `element`

### Navigation with `Link`

```tsx
import { Link } from 'react-router-dom'

<Link to="/">Home</Link>
<Link to="/competition">Competition</Link>
```

`Link` is like `<a>` but doesn't reload the page — just updates the URL and lets React Router swap the view.

### `import type` rule

Any time you import a TypeScript type, use `import type`:

```ts
import type { Id } from './types'
```

Regular `import` is for functions and values. `import type` is for types only.
