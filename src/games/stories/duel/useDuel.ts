import { useState, useRef, useEffect } from "react"
import type { GameStatus } from "../../../types"
import type { DuelConfig } from "./duelConfig.ts"
import type { DuelEnemy } from "./duelEnemies.ts"

export function useDuel(config: DuelConfig, resolveEnemy: (count: number) => DuelEnemy) {
    const [gameStatus, setGameStatus] = useState<GameStatus>('idle')
    const [score, setScore] = useState(0)
    const [playerHp, setPlayerHp] = useState(config.playerHp)
    const [enemyHp, setEnemyHp] = useState(config.enemyHp)
    const [enemyCount, setEnemyCount] = useState(0)
    const [currentEnemyMaxHp, setCurrentEnemyMaxHp] = useState(config.enemyHp)
    const enemyCountRef = useRef(0)
    // read the resolver through a ref so spawn always sees the current villain offset / roster
    const resolveRef = useRef(resolveEnemy)
    resolveRef.current = resolveEnemy

    // full max HP for the nth enemy: base + linear ramp + that enemy's fixed bonusHp ability
    function maxHpFor(count: number) {
        return config.enemyHp + count * config.enemyHpIncrement + resolveRef.current(count).bonusHp
    }

    function startGame() {
        enemyCountRef.current = 0
        const hp = maxHpFor(0)
        setGameStatus('running')
        setScore(0)
        setPlayerHp(config.playerHp)
        setEnemyHp(hp)
        setEnemyCount(0)
        setCurrentEnemyMaxHp(hp)
    }

    function spawnNextEnemy() {
        enemyCountRef.current += 1
        const hp = maxHpFor(enemyCountRef.current)
        setEnemyCount(enemyCountRef.current)
        setCurrentEnemyMaxHp(hp)
        setEnemyHp(hp)
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

    // returns the damage dealt so the story can surface it ("Enemy hit you for N")
    function enemyAttack() {
        const variance = (Math.random() * 2 - 1) * config.enemyDamageVariance
        const enemyDmg = config.enemyDamageBase * (1 + variance)
        setPlayerHp(prev => Math.max(0, prev - enemyDmg))
        return enemyDmg
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
