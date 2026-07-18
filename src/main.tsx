import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider} from "./context/AuthContext.tsx";
import { PlayerProvider} from "./context/PlayerContext.tsx";
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <PlayerProvider>
                    <App />
                </PlayerProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
)
