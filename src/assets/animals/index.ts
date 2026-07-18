import type React from 'react'
import { Cat } from './Cat'
import { Fox } from './Fox'
import { Bear } from './Bear'
import { Rabbit } from './Rabbit'
import { Crocodile } from './Crocodile'
import { Elephant } from './Elephant'
import { Dog } from './Dog'
import { TRex } from './TRex'

export type AnimalName = 'cat' | 'fox' | 'bear' | 'rabbit' | 'crocodile' | 'elephant' | 'dog' | 'trex'

export type AnimalComponent = React.FC<{ width?: number; height?: number }>

export const animalComponents: Record<AnimalName, AnimalComponent> = {
    cat: Cat,
    fox: Fox,
    bear: Bear,
    rabbit: Rabbit,
    crocodile: Crocodile,
    elephant: Elephant,
    dog: Dog,
    trex: TRex,
}

export const animalNames = Object.keys(animalComponents) as AnimalName[]
