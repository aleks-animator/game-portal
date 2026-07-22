import { villains } from "../../../assets/villains"

// Fixed ability per enemy — each villain index has a stable identity. The story resolves
// the active enemy with the same rotation it uses for visuals: (villainOffset + count).
//
// Two categories (see notes/design-difficulty-channel.md):
//   - Duel-internal (bonusHp, dodgeChance, doubleAttackChance) — handled inside the story/hook
//   - difficulty — an opaque token pushed to the GAME via StoryAPI.difficulty; the game
//     decides what it means. 0 = no difficulty signal.
export type DuelEnemy = {
    description: string         // ability blurb shown under the name in VisualSelection ('' = none)
    bonusHp: number            // extra spawn HP (Duel-internal)
    dodgeChance: number        // 0..1 chance to negate a hero hit (Duel-internal)
    doubleAttackChance: number // 0..1 chance to strike twice when attacking (Duel-internal)
    difficulty: number         // opaque token forwarded to the game (0 = none)
}

const DODGE_CHANCE = 0.20
const DOUBLE_ATTACK_CHANCE = 0.30
const BONUS_HP_LOW = 30
const BONUS_HP_HIGH = 60

const NONE: DuelEnemy = {
    description: '',
    bonusHp: 0,
    dodgeChance: 0,
    doubleAttackChance: 0,
    difficulty: 0,
}

const DIFFICULTY_TEXT = 'Makes things a bit harder'

// 15 villains, fixed assignment by index:
//   0,1     dodge (20%)
//   2,3     bonus HP (low, then higher)
//   4,5     double attack (30%)
//   6,7     difficulty 1
//   8,9     difficulty 2
//   10,11   difficulty 3
//   12,13,14  no ability (fixed, plain)
const ABILITY_BY_INDEX: Record<number, DuelEnemy> = {
    0:  { ...NONE, dodgeChance: DODGE_CHANCE, description: 'Evasive — 20% chance to dodge your strike' },
    1:  { ...NONE, dodgeChance: DODGE_CHANCE, description: 'Evasive — 20% chance to dodge your strike' },
    2:  { ...NONE, bonusHp: BONUS_HP_LOW,  description: 'Thick-skinned — extra health' },
    3:  { ...NONE, bonusHp: BONUS_HP_HIGH, description: 'Armored — a lot of extra health' },
    4:  { ...NONE, doubleAttackChance: DOUBLE_ATTACK_CHANCE, description: 'Frenzied — 30% chance to strike twice' },
    5:  { ...NONE, doubleAttackChance: DOUBLE_ATTACK_CHANCE, description: 'Frenzied — 30% chance to strike twice' },
    6:  { ...NONE, difficulty: 1, description: DIFFICULTY_TEXT },
    7:  { ...NONE, difficulty: 1, description: DIFFICULTY_TEXT },
    8:  { ...NONE, difficulty: 2, description: DIFFICULTY_TEXT },
    9:  { ...NONE, difficulty: 2, description: DIFFICULTY_TEXT },
    10: { ...NONE, difficulty: 3, description: DIFFICULTY_TEXT },
    11: { ...NONE, difficulty: 3, description: DIFFICULTY_TEXT },
}

export const DUEL_ENEMIES: DuelEnemy[] = villains.map((_, i) => ABILITY_BY_INDEX[i] ?? NONE)
