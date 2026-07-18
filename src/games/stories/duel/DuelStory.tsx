import { type ReactNode, useCallback, useEffect, useState } from "react"
import { useDuel } from "./useDuel.ts"
import { StoryCtx, type StoryAPI } from "../storyContext.tsx"
import type { DuelConfig } from "./duelConfig.ts"
import { Duel } from "./Duel.tsx"
import type { SpriteState } from "../../../components/AnimatedSprite.tsx"
import { VisualSelection } from "../../../components/VisualSelection.tsx"
import { villains } from "../../../assets/villains.ts"

type Props = {
    children: ReactNode
    config: DuelConfig
}

export function DuelStory({ children, config }: Props) {
    const { gameStatus, score, playerHp, enemyHp, currentEnemyMaxHp, enemyCount, startGame: hookStartGame, emitQuality: hookEmitQuality, enemyAttack, healPlayer, healPlayerFull } = useDuel(config)
    const [storyMessage, setStoryMessage] = useState('')
    const [heroState, setHeroState] = useState<SpriteState>('idle')
    const [enemyState, setEnemyState] = useState<SpriteState>('idle')
    const [isLocked, setIsLocked] = useState(false)
    const [overlay, setOverlay] = useState<ReactNode>(null)
    const [villainOffset, setVillainOffset] = useState(0)

    function startGame() {
        const offset = Math.floor(Math.random() * villains.length)
        setVillainOffset(offset)
        const villain = villains[(offset + enemyCount) % villains.length]
        setIsLocked(true)
        setOverlay(
            <VisualSelection
                images={villains.map(v => v.portrait)}
                selected={villain.portrait}
                selectionText={villain.name}
                onComplete={() => {
                    setOverlay(null)
                    setIsLocked(false)
                    hookStartGame()
                }}
            />
        )
    }

    function showStoryMessage(msg: string) {
        setStoryMessage(msg)
        setTimeout(() => setStoryMessage(''), 2000)
    }

    function emitQuality(quality: number) {
        const isMiss = quality < 1.5
        const enemyDies = !isMiss && Math.max(0, enemyHp - quality * config.damageScale) <= 0

        setIsLocked(true)
        setHeroState('attack')

        // t=550: hit lands
        setTimeout(() => {
            if (isMiss) {
                showStoryMessage('Miss!')
                return
            }
            hookEmitQuality(quality)
            setEnemyState('hit')
            showStoryMessage(quality < 2 ? 'Weak hit' : 'Strong hit!')
            if (enemyDies) setTimeout(() => setEnemyState('dead'), 900)
        }, 550)

        // t=1450: both settle to idle after first exchange
        setTimeout(() => {
            setHeroState('idle')
            if (!enemyDies) setEnemyState('idle')
        }, 1450)

        // t=1650: enemy swings — skipped if enemy died
        setTimeout(() => {
            if (enemyDies) return
            setEnemyState('attack')
        }, 1650)

        // t=2200: hero takes the hit (550ms after enemy swings — same delay as first exchange)
        setTimeout(() => {
            if (enemyDies) return
            setHeroState('hit')
            enemyAttack()
        }, 2200)

        // t=3100: both idle after counter
        setTimeout(() => {
            setEnemyState('idle')
            setHeroState('idle')
            setIsLocked(false)
        }, 3100)
    }

    useEffect(() => {
        if (gameStatus !== 'running') return
        if (enemyCount === 0) return
        const villain = villains[(villainOffset + enemyCount) % villains.length]
        setIsLocked(true)
        setOverlay(
            <VisualSelection
                images={villains.map(v => v.portrait)}
                selected={villain.portrait}
                selectionText={villain.name}
                onComplete={() => {
                    setOverlay(null)
                    setIsLocked(false)
                }}
            />
        )
    }, [enemyCount])

    const renderSlot = useCallback((_targetSlot: ReactNode) => (
        <Duel
            playerHp={playerHp}
            maxPlayerHp={config.playerHp}
            enemyHp={enemyHp}
            maxEnemyHp={currentEnemyMaxHp}
            enemyCount={enemyCount}
            villainOffset={villainOffset}
            heroState={heroState}
            enemyState={enemyState}
        />
    ), [playerHp, enemyHp, currentEnemyMaxHp, enemyCount, villainOffset, config, heroState, enemyState])

    const api: StoryAPI = {
        gameStatus,
        score,
        startGame,
        emitQuality,
        renderSlot,
        isLocked,
        overlay,
        storyMessage,
        emitCombo: (combos) => {
            if (combos.combo1) healPlayer(config.healAmount)
            if (combos.combo2) healPlayerFull()
        }
    }

    return (
        <StoryCtx.Provider value={api}>
            {children}
        </StoryCtx.Provider>
    )
}
