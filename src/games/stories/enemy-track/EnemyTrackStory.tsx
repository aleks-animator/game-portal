import { type ReactNode, useState } from "react"
import { useMotionValue, animate } from "framer-motion"
import { useEnemyTrack } from "./useEnemyTrack.ts"
import type { EnemyTrackConfig } from "./enemyTrackConfig.ts"
import { EnemyTrack } from "./EnemyTrack.tsx"
import { StoryCtx, type StoryAPI } from "../storyContext.tsx"

type Props = {
    children: ReactNode
    config: EnemyTrackConfig
    enemyAnimation: object
}

export function EnemyTrackStory({ children, config, enemyAnimation }: Props) {
    const { gameStatus, score, isFrozen, enemyPosition, startGame, emitQuality: hookEmitQuality, resetPosition } = useEnemyTrack(config)
    const [storyMessage, setStoryMessage] = useState('')
    const bounceX = useMotionValue(0)

    function emitQuality(quality: number) {
        hookEmitQuality(quality)
        animate(bounceX, [0, 30, 0], { duration: 0.4, ease: 'easeInOut' })
    }

    function emitCombo(combos: Record<string, boolean>) {
        if (combos.combo1) {
            resetPosition()
            setStoryMessage('Combo!!! Enemy is back at start!')
            setTimeout(() => setStoryMessage(''), 2000)
        }
    }


    const renderSlot = (targetSlot: ReactNode) => (
        <EnemyTrack
            config={config}
            enemyPosition={enemyPosition}
            isFrozen={isFrozen}
            enemyAnimation={enemyAnimation}
            targetSlot={targetSlot}
            bounceX={bounceX}
        />
    )

    const api: StoryAPI = { gameStatus, score, startGame, emitQuality, renderSlot, isLocked: false, emitCombo, storyMessage }

    return (
        <StoryCtx.Provider value={api}>
            {children}
        </StoryCtx.Provider>
    )
}
