import { gameEnded } from '../../eventBridge'
import { useAuth} from "../../context/AuthContext.tsx";

const GAME_ID = '15225104-356f-41cf-819d-29abbba21719'
const TEAM_ID = 'abe3755f-74b8-445c-8a2f-1252400d8d67'

function TestGame() {
    const { user } = useAuth()
    // then use user?.id


    return (
        <div>
            <h1>Test Game</h1>
            <p>This is a temporary test game — will be deleted.</p>
            <button onClick={() => gameEnded(GAME_ID, user?.id ?? '', TEAM_ID, Math.floor(Math.random() * 1001), 'desc')}
            >
                End Game
            </button>
        </div>
    )
}

export default TestGame
