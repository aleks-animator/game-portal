# React Fundamentals

## What is a Component?

A component is just a **function that returns UI**:

```tsx
function PlayerCard() {
  return <div>Aleksandar</div>
}
```

That's it. A function, returns JSX.

📖 **JSX** — HTML-like syntax inside JavaScript/TypeScript. React compiles it into real browser code.

---

## Pages vs Components

Two different things — easy to confuse:

**Pages** — full screens you navigate to:
- Home, Competition, Game, Account Settings

**Components** — reusable UI pieces that live *inside* pages:
- Leaderboard, Timer, PlayerCard, BestScorePanel, Controls

The same `Leaderboard` component can appear on the Home page AND the Competition page. That's the point of components — reuse.

```
CompetitionPage
  ├── Leaderboard        ← reusable component
  ├── PersonalScores     ← reusable component
  └── TeamChart          ← reusable component
```

---

## Props — passing data down

📖 **Props** — short for properties. Data passed *into* a component from outside. Like function arguments, but for UI.

```tsx
function PlayerCard({ name }: { name: string }) {
  return <div>{name}</div>
}

// used like this:
<PlayerCard name="Aleksandar" />
```

The `name` data lives in the **parent**. The parent owns it and passes it down.

---

## Data flows down, events flow up

This is one of React's core rules:

> Data flows **down** via props. Events flow **up** via functions.

The parent creates a function and passes it **down** as a prop. The child calls it when something happens. The parent reacts.

```tsx
function GamePage() {
  const [isGameOver, setIsGameOver] = useState(false)

  function handleGameEnd() {
    setIsGameOver(true)  // parent decides what happens
  }

  return <GameBoard onGameEnd={handleGameEnd} />  // function passed down
}

function GameBoard({ onGameEnd }: { onGameEnd: () => void }) {
  return <button onClick={onGameEnd}>End Game</button>  // child calls it
}
```

---

## The pre-formatted form metaphor

This is the key insight — it *looks* like the parent is handing decision power to the child. It isn't.

Think of it like a manager handing a worker a **pre-formatted form**. The worker fills it in (calls the function) and sends it back. The form was already designed to trigger exactly what the manager needs. The worker has no say in what happens next.

```tsx
return <GameBoard onGameEnd={handleGameEnd} />
//                          ↑
//                 the pre-formatted form
```

`GameBoard` doesn't choose `handleGameEnd`. It receives it, calls it, and that's it. The decision was baked in before the child ever saw it.

---

## The technical flow — step by step

1. User clicks button in `GameBoard` (child)
2. Child calls `onGameEnd()` — the form goes back to parent
3. Parent receives it — `handleGameEnd` executes
4. `handleGameEnd` calls `setIsGameOver(true)`
5. Parent state changes → React re-renders

The child triggered the **chain**. The parent owns every **link** in it.

---

## State vs Context

| | Scope | Lives in |
|---|---|---|
| **State** `useState` | One component (and children via props) | The component itself |
| **Context** `useContext` | The whole app — any component anywhere | A Provider at the top of the tree |

- `useState` — *"this component needs to remember something"*
- `useContext` — *"this component needs something that belongs to the whole app"*

### State promotion

State starts local. It gets "promoted" higher as more components need it:

1. One component needs it → `useState` in that component
2. A few nearby components need it → pass via props
3. Many components everywhere need it → move to Context

### The vanilla JS equivalent

In the old memory-game project, `gameState.js` was a global object any module could read or update:

```js
let gameState = {
  mode: 'normal-mode',
  team: 'cats',
  playerName: null,
  // ...
}
```

That was a hand-rolled Context equivalent. The difference in React: Context is **reactive** — when it updates, every component using it automatically re-renders. In vanilla JS you had to trigger UI updates manually.

> **Key insight:** `gameState` in vanilla JS = Context in React. Not the same as `useState`.
