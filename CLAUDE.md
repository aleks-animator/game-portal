# Game Portal — Project Instructions

## Session memory
Always read at session start:
- notes/memory-project-context.md
- notes/memory-handover.md

On-demand only (read when relevant, not by default):
- notes/06-todo.md
- notes/07-snippets.md
- notes/memory-feedback-teaching.md
- notes/memory-user-profile.md

Update notes/memory-handover.md at end of major tasks. Do this proactively.

## Rules
Story configs → story folder. Game configs → game folder. Never cross-pollinate.
Pre-calculate values before calling setState (can't read state synchronously after setting it).
Animation sequences: flat setTimeout, never nested.