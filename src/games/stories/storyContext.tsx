import { createContext, useContext, type ReactNode } from "react"
import type { GameStatus } from "../../types"

export type StoryAPI = {
    gameStatus: GameStatus
    score: number
    startGame: () => void
    emitQuality: (quality: number) => void
    renderSlot: (targetSlot: ReactNode) => ReactNode
    emitCombo?: (combos: Record<string, boolean>) => void
    storyMessage?: string
    isLocked: boolean
    overlay?: ReactNode
    coverImage?: string
}

const defaultAPI: StoryAPI = {
    gameStatus: 'idle',
    score: 0,
    startGame: () => {},
    emitQuality: () => {},
    renderSlot: () => null,
    storyMessage: '',
    isLocked: false
}

export const StoryCtx = createContext<StoryAPI>(defaultAPI)

export function useStory(): StoryAPI {
    return useContext(StoryCtx)
}

export function StorySlot({ targetSlot }: { targetSlot: ReactNode }) {
    const { renderSlot } = useStory()
    return <>{renderSlot(targetSlot)}</>
}
