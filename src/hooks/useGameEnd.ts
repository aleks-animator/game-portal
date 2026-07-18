import type { GameStatus } from "../types";
import { useEffect } from "react";
import { usePlayerContext } from "../context/PlayerContext.tsx";
import { gameEnded} from "../eventBridge.ts";

export function useGameEnd(gameId: string, score: number, gameStatus: GameStatus) {
    const { player } = usePlayerContext()
    useEffect(() => {
        if (gameStatus !== 'over') return
        if (!player) return
        gameEnded(gameId, player.id, player.teamId, score, 'desc')
    }, [gameStatus])
}