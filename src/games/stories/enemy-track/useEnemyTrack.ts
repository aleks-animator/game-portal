import { useState, useEffect, useRef } from "react"
import { useMotionValue } from "framer-motion"
import type { GameStatus } from "../../../types"
import type { EnemyTrackConfig } from "./enemyTrackConfig.ts"

export function useEnemyTrack(config: EnemyTrackConfig) {
    const [gameStatus, setGameStatus] = useState<GameStatus>('idle')
    const [score, setScore] = useState(0)
    const [isFrozen, setIsFrozen] = useState(false)
    const enemyPosition = useMotionValue(1)
    const enemyPositionRef = useRef(1)
    const speedRef = useRef(0)
    const isFrozenRef = useRef(false)
    const gameStatusRef = useRef(gameStatus)
    gameStatusRef.current = gameStatus

    function startGame() {
        speedRef.current = config.initialSpeed
        enemyPosition.set(config.startPosition)
        enemyPositionRef.current = config.startPosition
        setGameStatus('running')
        setScore(0)
    }

    function emitQuality(quality: number) {
        // freeze zone check BEFORE pushback (check current position)
        if (!isFrozenRef.current && config.perfectHitZones && config.perfectHitZoneRadius && config.perfectHitFreezeDuration) {
            for (const zone of config.perfectHitZones) {
                if (Math.abs(enemyPositionRef.current - zone) <= config.perfectHitZoneRadius) {
                    setTimeout(() => {
                        isFrozenRef.current = true
                        setIsFrozen(true)
                        setTimeout(() => {
                            isFrozenRef.current = false
                            setIsFrozen(false)
                        }, config.perfectHitFreezeDuration)
                    }, 400)
                }
            }
        }
        enemyPositionRef.current = Math.min(
            enemyPositionRef.current + quality * config.qualityScale,
            config.maxPushbackBoundary
        )
    }

    function resetPosition() {
        enemyPositionRef.current = config.startPosition
        enemyPosition.set(config.startPosition)
    }

    // — Game loop —
    useEffect(() => {
        const interval = setInterval(() => {
            if (isFrozenRef.current) return
            if (gameStatusRef.current !== 'running') return

            enemyPositionRef.current -= speedRef.current / 1000
            enemyPosition.set(enemyPositionRef.current)
            if (enemyPositionRef.current <= config.fruitPosition) {
                setGameStatus('over')
            }
        }, 50)

        return () => clearInterval(interval)
    }, [])


    // - Increase Speed
    useEffect(() => {
        const interval = setInterval(() => {
            if (gameStatusRef.current !== 'running') return
            speedRef.current += config.speedIncrement
        }, config.speedIncrementInterval)
        return () => clearInterval(interval)
    }, [])

    // — Score count —
    useEffect(() => {
        const interval = setInterval(() => {
            if (gameStatusRef.current !== 'running') return
            setScore(prev => prev + 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [])



    return { gameStatus, score, isFrozen, enemyPosition, startGame, emitQuality, resetPosition }
}