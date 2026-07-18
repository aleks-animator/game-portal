# Todo / Postponed

## Architecture
- Extract `gameStatus` and `score` into shared `useBaseStory` hook — repeated in every story hook
- Build story+game combo selector on GamesPage — pick combination from outside instead of hardcoding in game default exports
- Priority system for `statusMessage` vs `storyMessage` — story messages should win when active

## MemorizeFruit
- Refactor quality bars to reflect combo state instead of just neutralMatches
- Add click counter as quality factor (fewer clicks = better bonus)

## Duel Story
- Enemy portraits shown on enemy entry (visual only, no logic yet)
- Enemy customization — vary stats, weaknesses per enemy type (e.g. bear shaman weak to combo2)
- Wire AnimatedSprite states to duel combat state machine

## Sprites / Assets
- Replace villain PNGs with proper transparent background versions

## General
- Scores table / leaderboard
- Game polish pass after 3rd game is complete
- Balance pass across all games (qualityScale, damage numbers etc)
