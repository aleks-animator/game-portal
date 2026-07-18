import type { Id, Score, ScoringDirection } from './types'
import { saveScore, processGameResult} from "./services/scoreService.ts";

export const gameEnded = async (gameId: Id, playerId: Id, teamId: Id, value:number, direction: ScoringDirection  ) => {
    console.log("game ID: "+gameId)
    console.log("player ID: "+playerId)
    console.log("team ID: "+teamId)
    console.log("value:  "+value)

    const score: Score = {
        gameId: gameId,
        playerId: playerId,
        teamId: teamId,
        value: value,
        recordedAt: new Date().toISOString()
    }

    await saveScore(score)
    await processGameResult(gameId, playerId, value, direction)
}