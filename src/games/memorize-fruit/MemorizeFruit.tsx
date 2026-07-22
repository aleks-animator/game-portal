import { type FruitName, fruitNames, fruitImages } from '../../assets/fruits'
import React, { useState, useRef, useEffect } from "react"
import { getRandomItem, shuffle } from "../../utils.ts"
import { type MemorizeFruitConfig, TIME_LIMIT, MIN_TIME_LIMIT, BETWEEN_ROUND_INTERVAL, MEMORIZE_ENEMY_TRACK_CONFIG, MEMORIZE_DUEL_CONFIG  } from "./gameConfig.ts"
import { ENEMY_TRACK_CONFIG } from "../stories/enemy-track/enemyTrackConfig.ts"
import { DUEL_CONFIG } from "../stories/duel/duelConfig.ts"
import { usePlayerContext } from "../../context/PlayerContext.tsx"
import { useGameEnd } from "../../hooks/useGameEnd.ts"
import GameBoard from "../../components/GameBoard.tsx"
import foxAnimation from '../../assets/animals/lottie/fox.json'
import './MemorizeFruit.scss'
import { useStatusMessage } from "../../hooks/useStatusMessage.ts"
import { useStory, StorySlot } from "../stories/storyContext.tsx"
import { EnemyTrackStory } from "../stories/enemy-track/EnemyTrackStory.tsx"
import { DuelStory } from "../stories/duel/DuelStory.tsx"
import { duelCover } from "../../assets/gamecovers/duel"


type Card = {
    id: number
    fruit: FruitName
    isFlipped: boolean
    isMatched: boolean
}

// game-owned interpretation of the story's difficulty token → a concrete condition
type DifficultyCondition = {
    extraPairs: number   // additional card pairs (each pair = +2 cards)
    rowSwapMs: number    // if > 0, the two card rows swap positions on this interval
    flipMs: number       // if > 0, overrides the card flip duration (slower flips)
}

const DIFFICULTY_CONDITIONS: Record<number, DifficultyCondition> = {
    0: { extraPairs: 0, rowSwapMs: 0, flipMs: 0 },
    1: { extraPairs: 1, rowSwapMs: 0, flipMs: 0 },      // +2 cards
    2: { extraPairs: 0, rowSwapMs: 6000, flipMs: 0 },   // rows swap every 6s
    3: { extraPairs: 0, rowSwapMs: 0, flipMs: 600 },    // slower card flips
}

function MemorizeFruit ( { config } : {config: MemorizeFruitConfig} ) {
    const { gameStatus, score, startGame: storyStartGame, emitQuality, emitCombo, storyMessage, isLocked, overlay, coverImage, difficulty } = useStory()
    const [cards, setCards] = useState<Card[]>([])
    const [targetFruit, setTargetFruit] = useState<FruitName>('apple')
    const [flippedIds, setFlippedIds] = useState<number[]>([])
    const [neutralMatches, setNeutralMatches] = useState(0)
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
    // bumped each round so the timer bar (keyed on this) remounts and its CSS animation
    // restarts cleanly from 100% — see the .timer-bar comment in MemorizeFruit.scss
    const [roundKey, setRoundKey] = useState(0)
    const [rowsSwapped, setRowsSwapped] = useState(false)
    const roundStartRef = useRef<number>(0)
    const comboStreakRef = useRef(0)
    const timeLimitRef = useRef(TIME_LIMIT)
    const difficultyRef = useRef(0)
    const handledDiffIdRef = useRef<number | null>(null)
    const [isPenalized] = useState(false)
    const [targetMatchedIds, setTargetMatchedIds] = useState<number[]>([])
    const [neutralMatchedIds, setNeutralMatchedIds] = useState<number[]>([])
    const [statusMessage, showStatus] = useStatusMessage(1500)

    const { player } = usePlayerContext()

    useGameEnd('6ac6d978-706a-45f8-b942-b9b60216593e', score, gameStatus)

    useEffect(() => {
        if (gameStatus !== 'running') return
        if (isLocked) return
        if (timeLeft <= 0) return
        const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
        return () => clearTimeout(timer)
    }, [isLocked, timeLeft, gameStatus])

    // strict mode: running out of time ends the round immediately, quality 0
    useEffect(() => {
        if (config.gameMode !== 'strict') return
        if (gameStatus !== 'running') return
        if (isLocked) return
        if (timeLeft > 0) return
        showStatus('Time up!')
        emitQuality(0)
        decrementTimeLimit()
        setTimeout(() => startRound(), BETWEEN_ROUND_INTERVAL)
    }, [config.gameMode, timeLeft, isLocked, gameStatus])

    // Apply a new enemy's difficulty once its VisualSelection reveal has finished (game
    // unlocked). The difficulty event fires while the reveal overlay is still up (locked),
    // so we gate on !isLocked to defer until the reveal is done, then re-deal the round with
    // the new card count and announce it. De-duped by the event id → runs once per enemy.
    useEffect(() => {
        if (gameStatus !== 'running') return
        if (isLocked) return
        if (!difficulty) return
        if (difficulty.id === handledDiffIdRef.current) return
        handledDiffIdRef.current = difficulty.id
        difficultyRef.current = difficulty.value
        startRound()
        const cond = DIFFICULTY_CONDITIONS[difficulty.value] ?? DIFFICULTY_CONDITIONS[0]
        const note = cond.extraPairs > 0 ? `+${cond.extraPairs * 2} cards`
            : cond.rowSwapMs > 0 ? `rows swap every ${cond.rowSwapMs / 1000}s`
                : cond.flipMs > 0 ? 'slower card flips'
                    : ''
        if (note) showStatus(`Difficulty ${difficulty.value} — ${note}`)
    }, [difficulty, isLocked, gameStatus])

    // difficulty 2: swap the two card rows every rowSwapMs so memorised positions get
    // scrambled. A fresh interval is built per round (roundKey dep) — so the 6s clock
    // restarts each round — and torn down while locked (reveal/combat), so it never runs
    // behind an overlay. Not keyed on rowsSwapped: one steady interval, constant cadence.
    useEffect(() => {
        if (gameStatus !== 'running') return
        if (isLocked) return
        const rowSwapMs = DIFFICULTY_CONDITIONS[difficultyRef.current]?.rowSwapMs ?? 0
        if (rowSwapMs <= 0) return
        const interval = setInterval(() => setRowsSwapped(s => !s), rowSwapMs)
        return () => clearInterval(interval)
    }, [isLocked, gameStatus, roundKey])

    function startGame() {
        // reset per-game refs that ramp across rounds — otherwise "Play Again" inherits the
        // previous game's shrunken time limit / combo streak (only a page refresh reset them)
        timeLimitRef.current = TIME_LIMIT
        comboStreakRef.current = 0
        handledDiffIdRef.current = null
        storyStartGame()
        startRound()
    }

    // applied once per round-ending event (match, wrong match, or timeout) — not just on hits —
    // so difficulty ramps every round, not only on rounds that happen to land a match
    function decrementTimeLimit() {
        if (!config.bonusTimeDecreasing) return
        timeLimitRef.current = Math.max(MIN_TIME_LIMIT, timeLimitRef.current - config.bonusTimeDecrement)
    }

    function startRound() {
        const target = getRandomItem(fruitNames)
        setTargetFruit(target)
        dealCards(target)
        setFlippedIds([])
        roundStartRef.current = Date.now()
        setNeutralMatches(0)
        setTimeLeft(timeLimitRef.current)
        setRoundKey(k => k + 1)
        setRowsSwapped(false)   // each round starts in the un-swapped orientation
    }

    // base pairs + the current difficulty's extra pairs
    function effectivePairCount(): number {
        return config.pairCount + (DIFFICULTY_CONDITIONS[difficultyRef.current]?.extraPairs ?? 0)
    }

    function calculateQuality(): number {
        const base = 2 - (neutralMatches * 0.25)
        const elapsed = (Date.now() - roundStartRef.current) / 1000
        const timeBonus = neutralMatches === 0 && elapsed < TIME_LIMIT ? timeLeft * 0.1 : 0
        return base + timeBonus
    }

    // strict mode: quality is always in [1, 2] on a match (0 is reserved for round-ending misses)
    function calculateStrictQuality(): number {
        return 1 + 0.1 * timeLeft
    }

    function dealCards(target: FruitName) {
        const selected = new Set<FruitName>()
        selected.add(target)

        while (selected.size < effectivePairCount()) {
            selected.add(getRandomItem(fruitNames))
        }

        let currentCards = [...selected, ...selected]
        currentCards = shuffle(currentCards)

        const cardObjects = currentCards.map((fruit, index) => ({
            id: index,
            fruit: fruit,
            isFlipped: false,
            isMatched: false
        }))
        setCards(cardObjects)
    }

    function handleCardClick(card: Card) {
        if (isLocked) return
        if (card.isFlipped) return
        if (card.isMatched) return
        if (isPenalized) return
        if (flippedIds.length >= 2) return
        setCards(prev => prev.map(c =>
            c.id === card.id ? { ...c, isFlipped: true } : c
        ))
        const newFlippedIds = [...flippedIds, card.id]
        setFlippedIds(newFlippedIds)
        if (newFlippedIds.length === 2) {
            const [firstId, secondId] = newFlippedIds
            const firstCard = cards.find(c => c.id === firstId)
            const secondCard = cards.find(c => c.id === secondId)
            if (!firstCard || !secondCard) return
            if (firstCard.fruit === secondCard.fruit) {
                if (firstCard.fruit === targetFruit) {
                    decrementTimeLimit()
                    setTargetMatchedIds([firstId, secondId])

                    if (config.gameMode === 'strict') {
                        const quality = calculateStrictQuality()
                        emitQuality(quality)
                    } else {
                        const hasAllNeutrals = neutralMatches >= 3
                        if (hasAllNeutrals) { comboStreakRef.current += 1 } else { comboStreakRef.current = 0 }
                        emitCombo?.({ combo1: comboStreakRef.current >= 3, combo2: comboStreakRef.current >= 6 })
                        const quality = calculateQuality()
                        emitQuality(quality)
                    }
                    setTimeout(() => {
                        setTargetMatchedIds([])
                        startRound()
                    }, BETWEEN_ROUND_INTERVAL)
                } else {
                    setCards(prev => prev.map(c =>
                        c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
                    ))
                    setNeutralMatchedIds([firstId, secondId])
                    showStatus('Wrong target!')
                    setFlippedIds([])

                    if (config.gameMode === 'strict') {
                        emitQuality(0)
                        decrementTimeLimit()
                        setTimeout(() => {
                            setNeutralMatchedIds([])
                            startRound()
                        }, BETWEEN_ROUND_INTERVAL)
                    } else {
                        setTimeout(() => setNeutralMatchedIds([]), 700)
                        setNeutralMatches(prev => prev + 1)
                    }
                }
            } else {
                setTimeout(() => {
                    setCards(prev => prev.map(c =>
                        c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
                    ))
                    setFlippedIds([])
                }, 800)
            }
        }
    }

    // grid is 2 rows of `cols`. Rather than reorder the DOM (which would jump), keep card
    // order stable and slide each row into the other's place via a transform on the wrapper —
    // row-1 cards move down one row, row-2 cards move up — so the swap animates.
    const cols = Math.floor(cards.length / 2)
    // difficulty 3 overrides the flip duration (slower); 0 → falls back to the SCSS default
    const flipMs = DIFFICULTY_CONDITIONS[difficultyRef.current]?.flipMs ?? 0

    if (!player) return <p>Loading...</p>
    return (
        <GameBoard
            statusMessage={storyMessage || statusMessage}
            title="Memorize Fruit" score={score}
            gameStatus={gameStatus} onStart={startGame}
            playerName={player.nickname}
            idleMessage="Flip cards to find matching fruit pairs!"
            startMessage="Find target fast — extra matches boost your bonus!"
            overlay={overlay ?? undefined}
            coverImage={coverImage}
        >
            <div className="memorize-fruit">
                <StorySlot targetSlot={<img src={fruitImages[targetFruit]} alt={targetFruit} />} />
                <div className="game-layer" style={{ pointerEvents: isLocked ? 'none' : undefined }}>
                    <div className="target-row">
                        <p className="target-label">Find: <strong>{targetFruit}</strong></p>
                    </div>
                    <div className="card-grid" style={{ '--cols': cards.length / 2 || config.pairCount, '--flip-duration': flipMs > 0 ? `${flipMs}ms` : undefined } as React.CSSProperties}>
                        {cards.map((card, i) => {
                            const swapClass = rowsSwapped && cols > 0 ? (i < cols ? 'swap-down' : 'swap-up') : ''
                            return (
                                <div key={card.id} className={`card-slot ${swapClass}`}>
                                    <div className={`card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''} ${targetMatchedIds.includes(card.id) ? 'target-matched' : ''} ${neutralMatchedIds.includes(card.id) ? 'neutral-matched' : ''}`} onClick={() => handleCardClick(card)}>
                                        <div className="card-front" />
                                        <div className="card-back">
                                            <img src={fruitImages[card.fruit]} alt={card.fruit} />
                                            <span className="card-match-label">match</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="timer-row">
                        <span className="timer-label">{config.gameMode === 'strict' ? 'remaining' : 'bonus'}</span>
                        <div className="timer-bar-track">
                            <div
                                key={roundKey}
                                className="timer-bar"
                                style={{
                                    animationDuration: `${timeLimitRef.current}s`,
                                    animationPlayState: isLocked ? 'paused' : 'running'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </GameBoard>
    )
}

export default function MemorizeFruitGame() {
    return (
        <EnemyTrackStory config={ENEMY_TRACK_CONFIG} enemyAnimation={foxAnimation}>
            <MemorizeFruit config={MEMORIZE_ENEMY_TRACK_CONFIG}  />
        </EnemyTrackStory>
    )
}

export function MemorizeFruitDuelGame() {
    return (
        <DuelStory config={DUEL_CONFIG} coverImage={duelCover}>
            <MemorizeFruit config={MEMORIZE_DUEL_CONFIG} />
        </DuelStory>
    )
}
