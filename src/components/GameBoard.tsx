import { type ReactNode, useEffect, useState } from "react"
import type { GameStatus } from "../types"
import { defaultCover } from "../assets/gamecovers/default"
import './GameBoard.scss'

export type GameBoardProps = {
    title: string
    score: number
    gameStatus: GameStatus
    playerName: string
    children: ReactNode
    onStart: () => void
    statusMessage?: string
    idleMessage?: string
    startMessage?: string
    skin?: 'light' | 'dark'
    overlay?: ReactNode
    coverImage?: string
}

function GameBoard({ title, score, children, gameStatus, playerName, onStart, statusMessage, idleMessage, startMessage, skin = 'light', overlay, coverImage = defaultCover }: GameBoardProps) {
    const [activeStartMessage, setActiveStartMessage] = useState('')

    useEffect(() => {
        if (gameStatus === 'running' && startMessage) {
            setActiveStartMessage(startMessage)
            const timer = setTimeout(() => setActiveStartMessage(''), 5000)
            return () => clearTimeout(timer)
        }
    }, [gameStatus])

    return (
        <div>
            <div className={`game-panel skin-${skin}`}>
                {overlay && <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>{overlay}</div>}

                <header className="game-header">
                    <h1 className="game-title">{title}</h1>
                    <span className="game-player">{playerName}</span>
                </header>

                {gameStatus === 'running' && (
                    <div className="game-score-bar">
                        <span className="score-label">Score</span>
                        <span className="score-value">{score}</span>
                    </div>
                )}

                <div className="game-content">
                    {gameStatus === 'idle' && (
                        <div className="game-screen game-screen--cover">
                            <img className="game-cover" src={coverImage} alt="" />
                            <button className="game-btn" onClick={onStart}>Start Game</button>
                        </div>
                    )}

                    {gameStatus === 'running' && !overlay && children}

                    {gameStatus === 'over' && (
                        <div className="game-screen">
                            <h2 className="game-over-title">Game Over</h2>
                            <p className="game-over-score">
                                Final Score <span>{score}</span>
                            </p>
                            <button className="game-btn" onClick={onStart}>Play Again</button>
                        </div>
                    )}
                </div>

                <footer className="game-footer">
                    <span className="game-status-message">
                        {gameStatus === 'idle' ? idleMessage : statusMessage || activeStartMessage}
                    </span>
                    <span className={`game-status-pill ${gameStatus}`}>{gameStatus}</span>
                </footer>

            </div>
        </div>
    )

}

export default GameBoard