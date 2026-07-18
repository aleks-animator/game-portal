import { useState, useRef, useEffect } from "react"
import type { GameStatus } from "../../../types"
import type { DuelConfig } from "./duelConfig.ts"

export function useDuel(config: DuelConfig) {
    const [gameStatus, setGameStatus] = useState<GameStatus>('idle')
    const [score, setScore] = useState(0)
    const [playerHp, setPlayerHp] = useState(config.playerHp)
    const [enemyHp, setEnemyHp] = useState(config.enemyHp)
    const [enemyCount, setEnemyCount] = useState(0)
    const [currentEnemyMaxHp, setCurrentEnemyMaxHp] = useState(config.enemyHp)
    const currentEnemyMaxHpRef = useRef(config.enemyHp)


    function startGame() {
        setGameStatus('running')
        setScore(0)
        setPlayerHp(config.playerHp)
        setEnemyHp(config.enemyHp)
        setEnemyCount(0)
        currentEnemyMaxHpRef.current = config.enemyHp
        setCurrentEnemyMaxHp(config.enemyHp)
    }

    function spawnNextEnemy() {
        currentEnemyMaxHpRef.current += config.enemyHpIncrement
        setCurrentEnemyMaxHp(currentEnemyMaxHpRef.current)
        setEnemyCount(prev => prev + 1)
        setEnemyHp(currentEnemyMaxHpRef.current)
        setScore(prev => prev + 1)
    }


    function healPlayer(amount: number) {
        setPlayerHp(prev => Math.min(prev + amount, config.playerHp))
    }

    function healPlayerFull() {
        setPlayerHp(config.playerHp)
    }

    function emitQuality(quality: number) {
        const playerDmg = quality * config.damageScale
        setEnemyHp(prev => Math.max(0, prev - playerDmg))
    }

    function enemyAttack() {
        const variance = (Math.random() * 2 - 1) * config.enemyDamageVariance
        const enemyDmg = config.enemyDamageBase * (1 + variance)
        console.log('enemyAttack fired, dmg:', enemyDmg)
        setPlayerHp(prev => Math.max(0, prev - enemyDmg))
    }

    useEffect(() => {
        if (gameStatus !== 'running') return
        if (playerHp <= 0) {
            setGameStatus('over')
            return
        }
        if (enemyHp <= 0) {
            spawnNextEnemy()
        }
    }, [enemyHp, playerHp])


    return { gameStatus, score, playerHp, enemyHp, enemyCount, currentEnemyMaxHp, startGame, emitQuality, enemyAttack, healPlayer, healPlayerFull }

}
