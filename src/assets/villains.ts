import { villainImages, villainNames } from './animated/fantasyvillains'
import { villainPortraits } from './portraits/fantasyvillains'

export type Villain = {
    name: string
    portrait: string
    sprite: string
}

export const villains: Villain[] = villainNames.map((name, i) => ({
    name,
    portrait: villainPortraits[i],
    sprite: villainImages[i],
}))
