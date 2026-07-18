# Async, Context & Supabase

## Promises & async/await

Any operation that takes time (network request, database call) returns a **Promise** — a value that says "I'm working on it, I'll give you the result when done."

```ts
// Without await — you get a Promise, not the data
const result = supabase.from('scores').insert(score)  // ❌ result is a Promise

// With await — you wait for it, get the real value
const { data, error } = await supabase.from('scores').insert(score)  // ✅
```

### `async` keyword

- Enables `await` inside a function — you cannot use `await` without it
- Wraps the return value in a Promise automatically
- Any function that calls an `async` function and needs its result must also be `async`

```ts
export const saveScore = async (score: Score) => {
  const { data, error } = await supabase.from('scores').insert(score)
  if (error) throw error
  return data
}
```

### The async chain

`async/await` creates a chain — every caller that needs the result must also `await`, and therefore be `async`. The chain ends at UI event handlers (onClick etc.) where the browser fires and moves on without waiting.

```
saveScore (async)
  ← awaited by gameEnded (async)
    ← awaited by onClick handler (async, chain ends here)
```

### Supabase always returns `{ data, error }`

Every Supabase operation resolves to the same shape:
- `data` — the result (rows, inserted record, etc.) or null
- `error` — error details if something went wrong, or null

One will always be null, the other will have a value.

---

## Optimistic UI vs confirmed UI

**Optimistic UI** — update the UI immediately as if the operation succeeded, fix silently if it fails. Good for likes, reactions — feels fast.

**Confirmed UI** — wait for server confirmation before updating the UI. Required for competition scores — you cannot show a leaderboard position that wasn't actually saved. Integrity over speed.

---

## useEffect

Runs code **after** the component renders.

```tsx
useEffect(() => {
  // runs after render
}, [dependency])
```

The dependency array controls when it runs:
- `[]` — runs once, when the component first appears on screen
- `[someValue]` — runs every time `someValue` changes (must be state or props)
- nothing — runs after every single render

> In practice, the dependency array is almost always state or props — those are the only values React notices changing.

---

## SDK vs API

**API** — the contract a service exposes. Exists on the server. "Send a POST to this URL with this data."

**SDK** — a pre-written client library that wraps the API. Installed as a package. Makes API calls simple.

The API is the door. The SDK is the key someone already cut for you.

Supabase ships with TypeScript types in their SDK — so PHPStorm knows exactly what every function returns, no guessing.

---

## Context — deep dive

### Why Context exists

You can't prop-drill the whole project. Some data (logged in user, global settings) needs to be accessible anywhere without passing through every component in between.

### Two separate contexts in this project

**`AuthContext`** — Supabase session data:
- `session` — the Supabase session object (or null)
- `user` — the current auth user (or null)
- `isLoading` — true while Supabase checks for an existing session on page load
- `login()` — function any component can call
- `logout()` — function any component can call

**`PlayerContext`** — our app's Player profile (nickname, team, avatar) — loaded from the database after auth.

Why separate? Auth state comes from Supabase instantly. Player profile requires a database query and may not be ready yet. Keeping them separate handles edge cases (user authenticated but profile not yet loaded).

### How Context is built

Three parts work together:

**1. The type** — defines the shape of what the context holds:
```ts
type AuthContextType = {
  session: Session | null
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}
```

**2. The context object** — created by React:
```ts
export const AuthContext = createContext<AuthContextType | null>(null)
```

`null` as default — before the Provider sets a real value. Type must include `| null` to match.

**3. The Provider component** — our custom wrapper that holds state and logic:
```tsx
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  // ...state and functions...

  return (
    <AuthContext.Provider value={{ session, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### `children` prop

Anything placed between a component's opening and closing tags automatically becomes its `children` prop:

```tsx
// These two are identical:
<AuthProvider>
  <App />
</AuthProvider>

<AuthProvider children={<App />} />
```

`React.ReactNode` is the type for children — covers anything React can render (components, text, arrays).

### `AuthContext.Provider` vs `AuthProvider`

- **`AuthContext.Provider`** — React's built-in mechanism, requires a `value` prop
- **`AuthProvider`** — our custom wrapper, holds all state and logic, passes it to `AuthContext.Provider`

We could use `AuthContext.Provider` directly in `main.tsx` — but all the state and logic would live there. The custom wrapper keeps it organised in its own file.

### `.ts` vs `.tsx`

- `.ts` — pure TypeScript, no JSX (types, services, hooks)
- `.tsx` — TypeScript with JSX allowed (components, providers, pages)

---

## RLS — Row Level Security

Database rules that control who can read or modify which rows. Enforced at the database level, not just the app.

Policies we set up:

| Table | SELECT | INSERT | UPDATE |
|---|---|---|---|
| `teams` | Everyone | — | — |
| `games` | Everyone | — | — |
| `players` | Everyone | — | Own record only (`auth.uid() = id`) |
| `scores` | Everyone | Own scores only (`auth.uid() = player_id`) | — |

`auth.uid()` — Supabase function returning the currently logged in user's ID.

**`using`** — which rows can you access?
**`with check`** — after the change, is the result still valid?
