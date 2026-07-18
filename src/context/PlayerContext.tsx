import type { Player} from "../types";
import { createContext, useContext } from 'react'
import { useState, useEffect } from 'react'
import { useAuth } from "./AuthContext.tsx";
import { supabase } from '../services/supabase'


type PlayerContextType = {
    player: Player | null
    isLoading: boolean
}

export const PlayerContext = createContext<PlayerContextType | null>(null)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
    const [player, setPlayer] = useState<Player | null>(null)
    const [isLoading, setIsLoading] = useState(true)


    const { user } = useAuth()

    useEffect(() => {
        if (user) {
            fetchUser()
        } else {
            setPlayer(null)
        }
    }, [user])

    const fetchUser = async () => {
        const { data } = await supabase.from('players').select('*').eq('id', user?.id).single()
        setPlayer({
            id: data.id,
            teamId: data.team_id,
            nickname: data.nickname,
            avatar: data.avatar,
            createdAt: data.created_at,
            email: data.email
        })
        setIsLoading(false)
    }

    return (
        <PlayerContext.Provider value={{ player, isLoading }}>
            {children}
        </PlayerContext.Provider>
    )
}

export function usePlayerContext() {
    const context = useContext(PlayerContext)
    if (!context) throw new Error('usePlayerContext must be used inside PlayerProvider')
    return context
}