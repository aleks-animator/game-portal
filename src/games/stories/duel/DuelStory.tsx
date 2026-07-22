import { type ReactNode, useCallback, useEffect, useRef, useState } from "react"
import { useDuel } from "./useDuel.ts"
import { StoryCtx, type StoryAPI } from "../storyContext.tsx"
import type { DuelConfig } from "./duelConfig.ts"
import { Duel } from "./Duel.tsx"
import type { SpriteState } from "../../../components/AnimatedSprite.tsx"
import { VisualSelection } from "../../../components/VisualSelection.tsx"
import { villains } from "../../../assets/villains.ts"
import { DUEL_ENEMIES } from "./duelEnemies.ts"
import { useSequenceLock } from "../../../hooks/useSequenceLock.ts"

type Props = {
    children: ReactNode
    config: DuelConfig
    coverImage?: string
}

export function DuelStory({ children, config, coverImage }: Props) {
    // the active enemy = villains[(villainOffset + count)]. Offset lives in a ref so the
    // hook's spawn logic always resolves the current enemy's abilities without stale closures.
    const villainOffsetRef = useRef(0)
    const resolveEnemy = useCallback(
        (count: number) => DUEL_ENEMIES[(villainOffsetRef.current + count) % DUEL_ENEMIES.length],
        []
    )
    const { gameStatus, score, playerHp, enemyHp, currentEnemyMaxHp, enemyCount, startGame: hookStartGame, emitQuality: hookEmitQuality, enemyAttack, healPlayer, healPlayerFull } = useDuel(config, resolveEnemy)
    const [storyMessage, setStoryMessage] = useState('')
    const [heroState, setHeroState] = useState<SpriteState>('idle')
    const [enemyState, setEnemyState] = useState<SpriteState>('idle')
    const { isLocked, beginSequence, endSequence } = useSequenceLock()
    const [overlay, setOverlay] = useState<ReactNode>(null)
    const [villainOffset, setVillainOffset] = useState(0)
    // lags behind the real (hook) enemyCount — the battlefield keeps showing the just-died
    // enemy's identity until the reveal overlay is about to cover the screen, instead of
    // instantly swapping to the new enemy's name/sprite while its death animation is playing
    const [displayEnemyCount, setDisplayEnemyCount] = useState(0)
    // difficulty channel (story→game). Bump `id` on every emit so the game's effect re-fires
    // even when consecutive enemies carry the same difficulty token.
    const diffIdRef = useRef(0)
    const [difficulty, setDifficulty] = useState<{ value: number; id: number }>()

    // Emit the active enemy's difficulty token whenever the enemy on the battlefield changes
    // (displayEnemyCount) or the game (re)starts. Deliberately NOT tied to the VisualSelection
    // intro — difficulty tracks the real enemy transition, so skipping/replacing the intro
    // later won't break the signal. displayEnemyCount is the enemy the game is actually
    // fighting, so this is the correct anchor.
    useEffect(() => {
        if (gameStatus !== 'running') return
        diffIdRef.current += 1
        setDifficulty({ value: resolveEnemy(displayEnemyCount).difficulty, id: diffIdRef.current })
    }, [gameStatus, displayEnemyCount, resolveEnemy])

    function startGame() {
        const offset = Math.floor(Math.random() * villains.length)
        villainOffsetRef.current = offset
        setVillainOffset(offset)
        setDisplayEnemyCount(0)   // a new game always starts at enemy 0 (matters on replay)
        const villain = villains[offset % villains.length]
        const enemy = DUEL_ENEMIES[offset % DUEL_ENEMIES.length]
        const seq = beginSequence()
        setOverlay(
            <VisualSelection
                images={villains.map(v => v.portrait)}
                selected={villain.portrait}
                selectionText={villain.name}
                selectionSubtitle={enemy.description}
                onComplete={() => {
                    setOverlay(null)
                    endSequence(seq)
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
        if (config.gameMode === 'default') {
            runTradeBlowsSequence(quality)
            return
        }
        if (quality <= 0) {
            runEnemyHitSequence()
        } else {
            runHeroHitSequence(quality)
        }
    }

    // currently unused — 'default' game mode trades hits every exchange, kept for a future
    // mode where hero and enemy both land hits from a single emitQuality call
    function runTradeBlowsSequence(quality: number) {
        const isMiss = quality < 1.5
        const enemyDies = !isMiss && Math.max(0, enemyHp - quality * config.damageScale) <= 0

        const seq = beginSequence()
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
            endSequence(seq)
        }, 3100)
    }

    // strict mode, quality > 0: hero lands a hit, enemy never swings back
    function runHeroHitSequence(quality: number) {
        // dodge ability: roll once, up-front. On a dodge no damage lands and the enemy
        // survives — the game already reported success and moved on, it never learns the
        // hit whiffed (the boundary staying clean).
        const enemy = resolveEnemy(enemyCount)
        const dodged = Math.random() < enemy.dodgeChance
        const enemyDies = !dodged && Math.max(0, enemyHp - quality * config.damageScale) <= 0

        const seq = beginSequence()
        setHeroState('attack')

        // t=550: hit lands (or is dodged)
        setTimeout(() => {
            if (dodged) {
                setEnemyState('dodge')
                showStoryMessage('Dodged!')
                return
            }
            hookEmitQuality(quality)
            setEnemyState('hit')
            showStoryMessage(`You hit enemy for ${Math.round(quality * config.damageScale)}`)
            if (enemyDies) setTimeout(() => setEnemyState('dead'), 900)
        }, 550)

        // t=1450: settle to idle. Ending our own token here is always safe — if the enemy
        // died and the enemyCount effect already opened a VisualSelection overlay, that
        // overlay is holding its own token, so the shared lock stays held either way.
        setTimeout(() => {
            setHeroState('idle')
            if (!enemyDies) setEnemyState('idle')
            endSequence(seq)
        }, 1450)
    }

    // strict mode, quality 0: enemy lands a hit, hero never swings.
    // double-attack ability: roll up-front; on success the enemy swings a second time.
    function runEnemyHitSequence() {
        const enemy = resolveEnemy(enemyCount)
        const doubleHit = Math.random() < enemy.doubleAttackChance

        const seq = beginSequence()
        if (doubleHit) showStoryMessage('Double attack!')

        // first swing — t=300 swing, t=850 hit
        setTimeout(() => setEnemyState('attack'), 300)
        setTimeout(() => {
            setHeroState('hit')
            showStoryMessage(`Enemy hit you for ${Math.round(enemyAttack())}`)
        }, 850)

        if (doubleHit) {
            // settle, then a second swing — t=1550 swing, t=2100 hit
            setTimeout(() => {
                setEnemyState('idle')
                setHeroState('idle')
            }, 1350)
            setTimeout(() => setEnemyState('attack'), 1550)
            setTimeout(() => {
                setHeroState('hit')
                showStoryMessage(`Enemy hit you for ${Math.round(enemyAttack())}`)
            }, 2100)
            setTimeout(() => {
                setEnemyState('idle')
                setHeroState('idle')
                endSequence(seq)
            }, 3000)
        } else {
            // t=1750: settle to idle
            setTimeout(() => {
                setEnemyState('idle')
                setHeroState('idle')
                endSequence(seq)
            }, 1750)
        }
    }

    useEffect(() => {
        if (gameStatus !== 'running') return
        if (enemyCount === 0) return
        const villain = villains[(villainOffset + enemyCount) % villains.length]
        const enemy = DUEL_ENEMIES[(villainOffset + enemyCount) % DUEL_ENEMIES.length]
        // hold the lock from the moment of the kill, but don't cover the battlefield yet —
        // wait for the death sprite (set 900ms after the hit, see runHeroHitSequence) to
        // actually be visible, plus 1s more, before the reveal overlay takes over
        const seq = beginSequence()
        const timeout = setTimeout(() => {
            // switch the battlefield to the new enemy right as the overlay is about to
            // cover it — the swap happens, but nobody sees it happen
            setDisplayEnemyCount(enemyCount)
            // clear the previous enemy's 'dead' sprite state here, while the overlay is
            // covering the battlefield. Otherwise the newly-revealed enemy would briefly
            // render in its death animation until the next emitQuality reset it to idle.
            setEnemyState('idle')
            setOverlay(
                <VisualSelection
                    images={villains.map(v => v.portrait)}
                    selected={villain.portrait}
                    selectionText={villain.name}
                    selectionSubtitle={enemy.description}
                    onComplete={() => {
                        setOverlay(null)
                        endSequence(seq)
                    }}
                />
            )
        }, 900 + 1000)
        return () => clearTimeout(timeout)
    }, [enemyCount])

    // while a kill is waiting to be revealed (enemyCount has moved on but the battlefield
    // hasn't switched to it yet), keep showing the dead enemy's HP bar as empty rather than
    // the new enemy's already-full HP
    const displayEnemyHp = enemyCount === displayEnemyCount ? enemyHp : 0

    // plain function — nothing observes its identity (no dep array, no React.memo), so a
    // useCallback here would be dead weight. See resolveEnemy above for a real one.
    const renderSlot = (_targetSlot: ReactNode) => (
        <Duel
            playerHp={playerHp}
            maxPlayerHp={config.playerHp}
            enemyHp={displayEnemyHp}
            maxEnemyHp={currentEnemyMaxHp}
            enemyCount={displayEnemyCount}
            villainOffset={villainOffset}
            heroState={heroState}
            enemyState={enemyState}
            message={storyMessage}
        />
    )

    const api: StoryAPI = {
        gameStatus,
        score,
        startGame,
        emitQuality,
        renderSlot,
        isLocked,
        overlay,
        storyMessage,
        coverImage,
        difficulty,
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
