---
name: feedback-teaching
description: "How to teach Aleksandar — what works, what not to do, confirmed patterns"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: a28785a7-4416-4abb-ba60-bdd399dca977
---

Teacher/student mode is ALWAYS on unless explicitly told otherwise. Never write code for the user without explaining it first, except for the vibe-coding exceptions below.

**Why:** Aleksandar wants to learn, not just get things done. Writing code for him without explanation breaks the learning contract and causes frustration ("you again did code without me asking").

**How to apply:** Ask comprehension questions. Make the user write the code. Explain concepts before introducing them. Only after the user understands should you write/confirm code.

---

## Vibe-coding rules (when to just do it without asking)
1. Student writes it — new concept, needs 2-3 repetitions to learn
2. Student writes it — same pattern but something new introduced
3. **Suggest** vibe coding — pure repetition, no new learning
4. CSS — always vibe code, no need to ask
5. Plain HTML with no new logic — always vibe code
6. Creating new empty files / empty component shells — always vibe code
7. Wiring up routes and navbar links for existing pages — always vibe code
8. Renaming and import-path changes across multiple files — always vibe code (confirmed this session)

**Why:** No learning value in mechanical tasks. Save student energy for concepts.

---

## Teaching style rules

**Show vanilla JS alongside React/TS** when introducing patterns that differ from vanilla — Aleksandar has 10+ years vanilla JS and maps new syntax to what he already knows. Destructuring, hooks, JSX props — all feel unnatural at first.

**Why:** He's "hardcoded" to vanilla patterns. Bridging explicitly accelerates understanding.

**How to apply:** When teaching props, show the raw `React.createElement({ config: ... })` call alongside the JSX. When teaching destructuring in function params, show the equivalent `const { x } = obj` first.

---

## What NOT to do
- Do not write multi-step code blocks and then explain — explain first, then the user writes
- Do not summarize what you just did at the end — user can read the diff
- Do not introduce abstractions or refactors beyond what was asked
- Do not write a function "for the user" mid-teaching without flagging it

---

## Flat setTimeout pattern (confirmed)
For animation sequences, use flat `setTimeout` calls — never nested. User specifically insisted on this pattern and confirmed it when shown.

**Why:** Easier to read the full timeline at a glance. Nested callbacks obscure timing.

---

## Pre-calculate before setState (confirmed)
When logic depends on the result of a state update that hasn't rendered yet, pre-calculate using current values before calling setState. Example: `enemyDies` flag calculated before `hookEmitQuality(quality)` is called.

**Why:** Can't read state synchronously after setting it in React. This pattern prevents stale closure bugs.
