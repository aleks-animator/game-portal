import type { Session, User } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'
import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

type AuthContextType = {
    session: Session | null
    user: User | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, nickname: string) => Promise<void>
    logout: () => Promise<void>
}
export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            setIsLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const login = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
    }
    const logout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    }

    const register = async (email: string, password: string, nickname: string) => {
        const { data , error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        const { error: playerError } = await  supabase.from('players').insert({
            id: data.user?.id,
            nickname,
            email
        })
        if (playerError) throw playerError
    }

    return (
        <AuthContext.Provider value={{ session, user, isLoading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    )
}
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used inside AuthProvider')
    return context
}