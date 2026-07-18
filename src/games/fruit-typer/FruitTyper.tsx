import { useState, useRef } from "react"
import { getRandomItem } from "../../utils.ts"
import { fruitNames, fruitImages, type FruitName } from '../../assets/fruits'
import { FRUIT_TYPER_CONFIG } from "../stories/enemy-track/enemyTrackConfig.ts"
import GameBoard from "../../components/GameBoard.tsx"
import { usePlayerContext } from "../../context/PlayerContext.tsx"
import { motion, useMotionValue, animate } from "framer-motion"
import './FruitTyper.scss'
import foxAnimation from '../../assets/animals/lottie/fox.json'
import { useGameEnd } from "../../hooks/useGameEnd.ts"
import { useStory, StorySlot } from "../stories/storyContext.tsx"
import { EnemyTrackStory } from "../stories/enemy-track/EnemyTrackStory.tsx"
import { useStatusMessage } from "../../hooks/useStatusMessage.ts"

function FruitTyper() {
    const { gameStatus, score, startGame: storyStartGame, emitQuality } = useStory()

    const [currentFruit, setCurrentFruit] = useState<FruitName>('apple')
    const [isPenalized, setIsPenalized] = useState(false)
    const [inputValue, setInputValue] = useState<string>('')
    const inputRef = useRef<HTMLInputElement>(null)

    const { player } = usePlayerContext()
    const penaltyShakeX = useMotionValue(0)
    const [statusMessage, showStatus] = useStatusMessage(1500)

    useGameEnd('51af155c-285d-486f-98b3-63e7371e9ea5', score, gameStatus)

    function calculatePushback(word: FruitName): number {
        return word.length * 0.05
    }

    function startGame() {
        storyStartGame()
        setTimeout(() => inputRef.current?.focus(), 50)
        setCurrentFruit(getRandomItem(fruitNames))
        setInputValue('')
    }

    function handleInput(value: string) {
        const correctSoFar = currentFruit.slice(0, value.length)
        setInputValue(value)
        if (value === currentFruit) {
            showStatus('Correct!')
            emitQuality(calculatePushback(currentFruit))
            setCurrentFruit(getRandomItem(fruitNames))
            setInputValue('')
        }
        if (value !== correctSoFar) {
            animate(penaltyShakeX, [0, -8, 8, -8, 8, 0], { duration: 0.3 })
            setIsPenalized(true)
            setTimeout(() => {
                setIsPenalized(false)
                setInputValue(value.slice(0, -1))
                setTimeout(() => inputRef.current?.focus(), 50)
            }, FRUIT_TYPER_CONFIG.penaltyFreezeDuration)
        }
    }

    if (!player) return <p>Loading...</p>
    return (
        <GameBoard statusMessage={statusMessage} idleMessage="Type the fruit name before it reaches you!" startMessage="Go! Type fast, push it back!" title="Fruit Typer" score={score} gameStatus={gameStatus} onStart={startGame} playerName={player.nickname}>
            <div className="fruit-typer">
                <StorySlot targetSlot={<img src={fruitImages[currentFruit]} alt={currentFruit} />} />
                <p className="fruit-word">{currentFruit}</p>
                <motion.div style={{ x: penaltyShakeX }}>
                    <input
                        disabled={isPenalized}
                        ref={inputRef}
                        className="fruit-input"
                        value={inputValue}
                        onChange={(e) => handleInput(e.target.value)}
                    />
                </motion.div>
            </div>
        </GameBoard>
    )
}

export default function FruitTyperGame() {
    return (
        <EnemyTrackStory config={FRUIT_TYPER_CONFIG} enemyAnimation={foxAnimation}>
            <FruitTyper />
        </EnemyTrackStory>
    )
}
