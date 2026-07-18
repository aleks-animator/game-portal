# Game Portal

A competitive mini-game portal built with React, TypeScript, and Vite. Players compete in skill-based games, earn scores, and (planned) compete on team leaderboards.

## Games

| Route | Game | Story mode |
|-------|------|------------|
| `/fruit-typer` | Type fruit names to push back an enemy | Enemy Track |
| `/memorize-fruit` | Match fruit pairs under time pressure | Enemy Track |
| `/memorize-fruit-duel` | Match fruit pairs to deal damage in turn-based combat | Duel |

## Tech stack

- **Vite + React + TypeScript**
- **Supabase** — auth and PostgreSQL
- **Framer Motion** — animations
- **Sass** — component styles

## Architecture

Each playable experience combines two layers:

- **Story** — world scenario (enemy track, duel combat, HP, win/loss)
- **Game** — player control mechanic (typing, memory cards, etc.)

Stories expose a `StoryAPI` via React Context. Games call `emitQuality(number)` to report how well the player performed; the story converts that into damage, pushback, or other effects.

```
<DuelStory config={DUEL_CONFIG}>
  <MemorizeFruit config={MEMORIZE_DUEL_CONFIG} />
</DuelStory>
```

See `notes/memory-project-context.md` for full architecture notes.

## Getting started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
git clone https://github.com/aleks-animator/game-portal.git
cd game-portal
npm install
cp .env.example .env
```

Fill in your Supabase credentials in `.env`:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

### Development

```bash
npm run dev
```

Open the URL shown in the terminal (default: `http://localhost:5173`).

### Build

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  games/           # Game controls (FruitTyper, MemorizeFruit, …)
  games/stories/   # Story modes (duel, enemy-track) + StoryAPI
  components/      # Shared UI (GameBoard, AnimatedSprite, …)
  pages/           # Portal pages (home, games list, auth)
  context/         # Auth and player state
  services/        # Supabase and scoring
  assets/          # Sprites, backgrounds, fruit images
notes/             # Architecture and session notes
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## License

Private — all rights reserved.
