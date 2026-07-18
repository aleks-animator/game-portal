# Forms, Routing & React Patterns

## Hooks — the rules

Hooks (`useState`, `useContext`, `useNavigate` etc.) have one strict rule:

> **Hooks must be called at the top level of the component function — never inside other functions, conditions, or loops.**

```tsx
// ✅ correct
function LoginPage() {
  const navigate = useNavigate()  // top level
  const { login } = useAuth()     // top level

  const handleSubmit = async () => {
    navigate('/')  // using the hook's return value is fine anywhere
  }
}

// ❌ wrong
function LoginPage() {
  const handleSubmit = async () => {
    const navigate = useNavigate()  // hook inside a function — not allowed
  }
}
```

---

## Forms — controlled vs uncontrolled inputs

**Controlled** — React owns the value via `useState`. Good for live validation, disabling buttons, showing live feedback.

**Uncontrolled** — the DOM owns the value. Simpler, read on submit only.

For a simple login form — uncontrolled is fine:

```tsx
const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
  e.preventDefault()
  const form = new FormData(e.currentTarget)
  const email = form.get('email') as string
  const password = form.get('password') as string
}
```

---

## Event types in TypeScript

In vanilla JS:
```js
function handleSubmit(e) {
  e.preventDefault()
}
```

In TypeScript — when the function is defined separately, you must type `e` explicitly:
```tsx
const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => { ... }
```

- `React.SyntheticEvent` — React's wrapper around the browser event
- `<HTMLFormElement>` — the generic specifying it came from a `<form>`

When defined inline on the prop, TypeScript can infer it:
```tsx
<form onSubmit={(e) => { e.preventDefault() }}>
```

---

## `try/catch` for async errors

`login()` in `AuthContext` returns `Promise<void>` — it throws on error rather than returning one. Use `try/catch`:

```tsx
try {
  await login(email, password)
  navigate('/')
} catch (error) {
  if (error instanceof Error) {
    setErrorMessage(error.message)
  }
}
```

📖 **`instanceof Error`** — TypeScript types caught errors as `unknown` because anything can be thrown. This check narrows it to an actual `Error` object so you can safely access `.message`.

---

## Conditional rendering

In vanilla JS:
```js
if (errorMessage) {
  element.innerHTML = `<p>${errorMessage}</p>`
}
```

In JSX — `&&` short circuit:
```tsx
{errorMessage && <p>{errorMessage}</p>}
```

If `errorMessage` is `null` or empty string (falsy) — nothing renders. If it has a value — renders the `<p>`.

---

## `useNavigate` — programmatic routing

In vanilla JS: `window.location.href = '/'`

In React Router:
```tsx
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()
navigate('/')  // redirect to home
```

---

## Re-renders in development

In development with StrictMode, every component renders **at least twice**. This is intentional — React does it to catch side effects.

A `console.log` inside a component will fire on every render. So one log statement can appear 2-3 times — not a bug.

In production — StrictMode is off, only real re-renders happen.

---

## Destructuring — vanilla JS vs React convention

Vanilla JS style (also valid in React):
```tsx
const auth = useAuth()
auth.login(email, password)
```

React convention — destructuring:
```tsx
const { login } = useAuth()
login(email, password)
```

Both are identical. Destructuring is just shorthand — pull out only what you need.

Renaming while destructuring:
```tsx
const { login: signIn } = useAuth()
signIn(email, password)  // same function, different local name
```

---

## Complete `LoginPage.tsx`

```tsx
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = form.get('email') as string
    const password = form.get('password') as string

    try {
      await login(email, password)
      navigate('/')
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      }
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" />
        <input type="password" name="password" />
        <button type="submit">Log In</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  )
}

export default LoginPage
```
