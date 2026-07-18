export type Id = string;
export type ScoreType = "time" | "points" | "rank" | "level";

export type Score = {
    id?: Id;
    gameId: Id;
    playerId: Id;
    teamId: Id;
    value: number;
    recordedAt: string;
}
export type ScoringDirection = 'asc' | 'desc'

export type Game = {
    id: Id;
    name: string;
    scoreType: ScoreType;
    scoringDirection: ScoringDirection
}

export type Player = {
    id: Id;
    teamId: Id;
    nickname: string;
    avatar: string;
    createdAt: string;
    email: string;
}

export type Team = {
    id: Id;
    name: string;
    createdAt: string;
    avatar: string;
}

export type GameStatus = 'idle' | 'running' | 'over'