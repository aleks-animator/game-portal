import {Route, Routes} from "react-router-dom";
import CompetitionPage from "./pages/CompetitionPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import Navbar from "./components/Navbar.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import TestGame from "./games/test-game/TestGame.tsx";
import AssetsPage from "./pages/AssetsPage.tsx";
import FruitTyper from "./games/fruit-typer/FruitTyper.tsx";
import MemorizeFruit, { MemorizeFruitDuelGame } from "./games/memorize-fruit/MemorizeFruit.tsx";
import GamesPage from "./pages/GamesPage.tsx";
import SpriteSandbox from "./pages/SpriteSandbox.tsx";

function App() {
  return (
    <div>
      <h1>Game Portal</h1>
        <Navbar/>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/competition" element={<CompetitionPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/test-game" element={<TestGame />} />
            <Route path="/assets" element={<AssetsPage />} />
            <Route path="/fruit-typer" element={<FruitTyper />} />
            <Route path="/memorize-fruit" element={<MemorizeFruit />} />
            <Route path="/memorize-fruit-duel" element={<MemorizeFruitDuelGame />} />
            <Route path="/sprite-sandbox" element={<SpriteSandbox />} />
        </Routes>
    </div>
  )
}

export default App
