import { useNavigate } from 'react-router-dom'
import './GamesPage.scss'

type GameStatus = 'live' | 'soon'

const games: { id: string; title: string; description: string; path: string; status: GameStatus }[] = [
    {
        id: 'fruit-typer',
        title: 'Fruit Typer',
        description: 'Type fruit names to push back the enemy before it reaches your fruit.',
        path: '/fruit-typer',
        status: 'live',
    },
    {
        id: 'memorize-fruit',
        title: 'Memorize Fruit',
        description: 'Find the matching fruit pair to push back the enemy.',
        path: '/memorize-fruit',
        status: 'live',
    },
    {
        id: 'memorize-fruit-duel',
        title: 'Memorize Fruit: Duel',
        description: 'Find matching fruit pairs to deal damage in a turn-based duel.',
        path: '/memorize-fruit-duel',
        status: 'live',
    },
    {
        id: 'fruit-snake-duel',
        title: 'Fruit Snake: Duel',
        description: 'Slither to collect the target fruit and dodge obstacles to strike in a duel.',
        path: '/fruit-snake-duel',
        status: 'live',
    },
    {
        id: 'test-game',
        title: 'Test Game',
        description: 'Internal test game.',
        path: '/test-game',
        status: 'live',
    },
]

function GamesPage() {
    const navigate = useNavigate()

    return (
        <div className="games-page">
            <h1>Games</h1>
            <div className="games-grid">
                {games.map(game => (
                    <div
                        key={game.id}
                        className={`game-card game-card--${game.status}`}
                        onClick={() => game.status === 'live' && navigate(game.path)}
                    >
                        <h2>{game.title}</h2>
                        <p>{game.description}</p>
                        {game.status === 'soon' && <span className="badge">Coming Soon</span>}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GamesPage
