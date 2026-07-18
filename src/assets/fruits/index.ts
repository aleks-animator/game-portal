import type React from 'react'

import applePng from './png/apple.png'
import bananaPng from './png/banana.png'
import orangePng from './png/orange.png'
import strawberryPng from './png/strawberry.png'
import grapePng from './png/grape.png'
import watermelonPng from './png/watermelon.png'
import pineapplePng from './png/pineapple.png'
import mangoPng from './png/mango.png'
import peachPng from './png/peach.png'
import pearPng from './png/pear.png'
import cherryPng from './png/cherry.png'
import lemonPng from './png/lemon.png'
import limePng from './png/lime.png'
import blueberryPng from './png/blueberry.png'
import raspberryPng from './png/raspberry.png'
import kiwiPng from './png/kiwi.png'
import coconutPng from './png/coconut.png'
import papayaPng from './png/papaya.png'
import pomegranatePng from './png/pomegranate.png'
import figPng from './png/fig.png'
import plumPng from './png/plum.png'
import apricotPng from './png/apricot.png'
import melonPng from './png/melon.png'
import grapefruitPng from './png/grapefruit.png'
import passionfruitPng from './png/passionfruit.png'
import guavaPng from './png/guava.png'
import dragonfruitPng from './png/dragonfruit.png'
import lycheePng from './png/lychee.png'
import starfruitPng from './png/starfruit.png'
import avocadoPng from './png/avocado.png'
import { Apple } from './Apple'
import { Banana } from './Banana'
import { Orange } from './Orange'
import { Strawberry } from './Strawberry'
import { Grape } from './Grape'
import { Watermelon } from './Watermelon'
import { Pineapple } from './Pineapple'
import { Mango } from './Mango'
import { Peach } from './Peach'
import { Pear } from './Pear'
import { Cherry } from './Cherry'
import { Lemon } from './Lemon'
import { Lime } from './Lime'
import { Blueberry } from './Blueberry'
import { Raspberry } from './Raspberry'
import { Kiwi } from './Kiwi'
import { Coconut } from './Coconut'
import { Papaya } from './Papaya'
import { Pomegranate } from './Pomegranate'
import { Fig } from './Fig'
import { Plum } from './Plum'
import { Apricot } from './Apricot'
import { Melon } from './Melon'
import { Grapefruit } from './Grapefruit'
import { Passionfruit } from './Passionfruit'
import { Guava } from './Guava'
import { Dragonfruit } from './Dragonfruit'
import { Lychee } from './Lychee'
import { Starfruit } from './Starfruit'
import { Avocado } from './Avocado'

export type FruitName =
    | 'apple' | 'banana' | 'orange' | 'strawberry' | 'grape'
    | 'watermelon' | 'pineapple' | 'mango' | 'peach' | 'pear'
    | 'cherry' | 'lemon' | 'lime' | 'blueberry' | 'raspberry'
    | 'kiwi' | 'coconut' | 'papaya' | 'pomegranate' | 'fig'
    | 'plum' | 'apricot' | 'melon' | 'grapefruit' | 'passionfruit'
    | 'guava' | 'dragonfruit' | 'lychee' | 'starfruit' | 'avocado'

export type FruitComponent = React.FC<{ width?: number; height?: number }>

export const fruitComponents: Record<FruitName, FruitComponent> = {
    apple: Apple,
    banana: Banana,
    orange: Orange,
    strawberry: Strawberry,
    grape: Grape,
    watermelon: Watermelon,
    pineapple: Pineapple,
    mango: Mango,
    peach: Peach,
    pear: Pear,
    cherry: Cherry,
    lemon: Lemon,
    lime: Lime,
    blueberry: Blueberry,
    raspberry: Raspberry,
    kiwi: Kiwi,
    coconut: Coconut,
    papaya: Papaya,
    pomegranate: Pomegranate,
    fig: Fig,
    plum: Plum,
    apricot: Apricot,
    melon: Melon,
    grapefruit: Grapefruit,
    passionfruit: Passionfruit,
    guava: Guava,
    dragonfruit: Dragonfruit,
    lychee: Lychee,
    starfruit: Starfruit,
    avocado: Avocado,
}

export const fruitNames = Object.keys(fruitComponents) as FruitName[]

export const fruitImages: Record<FruitName, string> = {
    apple: applePng,
    banana: bananaPng,
    orange: orangePng,
    strawberry: strawberryPng,
    grape: grapePng,
    watermelon: watermelonPng,
    pineapple: pineapplePng,
    mango: mangoPng,
    peach: peachPng,
    pear: pearPng,
    cherry: cherryPng,
    lemon: lemonPng,
    lime: limePng,
    blueberry: blueberryPng,
    raspberry: raspberryPng,
    kiwi: kiwiPng,
    coconut: coconutPng,
    papaya: papayaPng,
    pomegranate: pomegranatePng,
    fig: figPng,
    plum: plumPng,
    apricot: apricotPng,
    melon: melonPng,
    grapefruit: grapefruitPng,
    passionfruit: passionfruitPng,
    guava: guavaPng,
    dragonfruit: dragonfruitPng,
    lychee: lycheePng,
    starfruit: starfruitPng,
    avocado: avocadoPng,
}
