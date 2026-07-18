import { useAuth} from "../context/AuthContext.tsx";
import { useNavigate } from 'react-router-dom'
import {useState} from "react";

function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = new FormData(e.currentTarget)
        const email = form.get('email') as string
        const password = form.get('password') as string

        try {
            await login(email, password)
            navigate('/')
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message)
            }
        }
    }
    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input type="email" name="email" />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" name="password" />
                </div>
                <button type="submit">Log In</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    )
}

export default LoginPage