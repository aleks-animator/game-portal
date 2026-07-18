import type {Score} from '../types'
import { supabase } from './supabase.ts'
import type { ScoringDirection} from "../types";
import type { Id} from "../types";

export const saveScore = async (score: Score) => {
    const {error} = await supabase
        .from('scores')
        .insert({
            game_id: score.gameId,
            player_id: score.playerId,
            team_id: score.teamId,
            value: score.value,
            recorded_at: score.recordedAt,
        })

    if (error) throw error;
}

const calculatePercentile = (value: number, allScores: number[], direction: ScoringDirection) :number => {
    const totalScores = allScores.length
    const worseScores = allScores.filter(score =>
        direction === 'asc' ? value > score : value < score
    ).length

    return worseScores / totalScores * 100
}

const calculateTokens = (percentile: number): number => {
    if (percentile === 100) return 15  // 1st place
    if (percentile >= 98) return 10
    if (percentile >= 97) return 9
    if (percentile >= 96) return 8
    if (percentile >= 90) return 7
    if (percentile >= 80) return 6
    if (percentile >= 70) return 5
    if (percentile >= 60) return 4
    if (percentile >= 50) return 3
    return 1
}

const fetchGameScores = async (gameId: Id) => {
    const { data, error } = await supabase.from('scores').select('value').eq('game_id', gameId)
    if (error) throw error
    return data.map(row => row.value)
}

export const processGameResult = async (gameId: Id, playerId: Id, scoreValue: number, direction: ScoringDirection)=> {
    const allScores = await fetchGameScores(gameId)
    const calculatedPercentile = calculatePercentile(scoreValue, allScores, direction)
    const tokensToGive =  calculateTokens(calculatedPercentile)

    const { error: playerError } = await supabase.rpc('increment_tokens', {
        player_id: playerId,
        amount: tokensToGive
    })
    if (playerError) throw playerError
}