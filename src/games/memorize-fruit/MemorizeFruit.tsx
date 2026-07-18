import { type FruitName, fruitNames, fruitImages } from '../../assets/fruits'
import React, { useState, useRef, useEffect } from "react"
import { getRandomItem, shuffle } from "../../utils.ts"
import { type MemorizeFruitConfig, BONUS_TIME_LIMIT, BETWEEN_ROUND_INTERVAL, MEMORIZE_ENEMY_TRACK_CONFIG, MEMORIZE_DUEL_CONFIG  } from "./gameConfig.ts"
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


type Card = {
    id: number
    fruit: FruitName
    isFlipped: boolean
    isMatched: boolean
}

function MemorizeFruit ( { config } : {config: MemorizeFruitConfig} ) {
    const { gameStatus, score, startGame: storyStartGame, emitQuality, emitCombo, storyMessage, isLocked, overlay } = useStory()
    const [cards, setCards] = useState<Card[]>([])
    const [targetFruit, setTargetFruit] = useState<FruitName>('apple')
    const [flippedIds, setFlippedIds] = useState<number[]>([])
    const [neutralMatches, setNeutralMatches] = useState(0)
    const [timeLeft, setTimeLeft] = useState(BONUS_TIME_LIMIT)
    const roundStartRef = useRef<number>(0)
    const comboStreakRef = useRef(0)
    const bonusTimeLimitRef = useRef(BONUS_TIME_LIMIT)
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

    function startGame() {
        storyStartGame()
        startRound()
    }

    function startRound() {
        const target = getRandomItem(fruitNames)
        setTargetFruit(target)
        dealCards(target)
        setFlippedIds([])
        roundStartRef.current = Date.now()
        setNeutralMatches(0)
        setTimeLeft(bonusTimeLimitRef.current)
    }

    function calculateQuality(): number {
        const base = 2 - (neutralMatches * 0.25)
        const elapsed = (Date.now() - roundStartRef.current) / 1000
        const timeBonus = neutralMatches === 0 && elapsed < BONUS_TIME_LIMIT ? timeLeft * 0.1 : 0
        return base + timeBonus
    }


    function qualityMessage(quality: number): string {
        return quality >= 2 ? 'great damage!'
            : quality >= 1.5 ? 'moderate damage'
                : 'miss'
    }

    function dealCards(target: FruitName) {
        const selected = new Set<FruitName>()
        selected.add(target)

        while (selected.size < config.pairCount) {
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
                    if (config.bonusTimeDecreasing) {
                        bonusTimeLimitRef.current -= config.bonusTimeDecrement
                    }
                    const hasAllNeutrals = neutralMatches >= 3
                    if (hasAllNeutrals) { comboStreakRef.current += 1 } else { comboStreakRef.current = 0 }
                    emitCombo?.({ combo1: comboStreakRef.current >= 3, combo2: comboStreakRef.current >= 6 })
                    const quality = calculateQuality()
                    setTargetMatchedIds([firstId, secondId])
                    if (comboStreakRef.current < 3) showStatus(qualityMessage(quality))
                    emitQuality(quality)
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
                    setTimeout(() => setNeutralMatchedIds([]), 700)
                    setFlippedIds([])
                    setNeutralMatches(prev => prev + 1)
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
        >
            <div className="memorize-fruit">
                <StorySlot targetSlot={<img src={fruitImages[targetFruit]} alt={targetFruit} />} />
                <div className="game-layer">
                    {isLocked && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 20 }} />}
                    <div className="target-row">
                        <p className="target-label">Find: <strong>{targetFruit}</strong></p>
                        <div className="quality-bars">
                            <span className="quality-label">score</span>
                            <div className="quality-bar active" />
                            <div className={`quality-bar ${neutralMatches >= 1 ? 'active' : ''}`} />
                            <div className={`quality-bar ${neutralMatches >= 3 ? 'active' : ''}`} />
                        </div>
                    </div>
                    <div className="card-grid" style={{ '--cols': config.pairCount } as React.CSSProperties}>
                        {cards.map(card => (
                            <div key={card.id} className={`card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''} ${targetMatchedIds.includes(card.id) ? 'target-matched' : ''} ${neutralMatchedIds.includes(card.id) ? 'neutral-matched' : ''}`} onClick={() => handleCardClick(card)}>
                                <div className="card-front" />
                                <div className="card-back">
                                    <img src={fruitImages[card.fruit]} alt={card.fruit} />
                                    <span className="card-match-label">match</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="timer-row">
                        <span className="timer-label">bonus</span>
                        <div className="timer-bar-track">
                            <div className="timer-bar" style={{ width: `${(timeLeft / BONUS_TIME_LIMIT) * 100}%` }} />
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
        <DuelStory config={DUEL_CONFIG}>
            <MemorizeFruit config={MEMORIZE_DUEL_CONFIG} />
        </DuelStory>
    )
}
