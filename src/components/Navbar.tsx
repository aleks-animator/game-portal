import {Link} from "react-router-dom";
import { usePlayerContext } from "../context/PlayerContext.tsx";

function Navbar() {
    const { player } = usePlayerContext()

    return (
        <div>
            <Link to="/">Home</Link> | <Link to="/games">Games</Link> | <Link to="/competition">Competition</Link> | <Link to="/login">Login</Link> | <Link to="/register">Register</Link> {player && <span> | {player.nickname}</span>}
        </div>)
}


export default Navbar