import { useAuth } from "../context/AuthContext.tsx";
import { useNavigate } from 'react-router-dom'
import { useState } from "react";

function RegisterPage() {
    const { register } = useAuth()
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = new FormData(e.currentTarget)
        const email = form.get('email') as string
        const password = form.get('password') as string
        const confirmPassword = form.get('confirmPassword') as string
        const nickname = form.get('nickname') as string

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        try {
            await register(email, password, nickname)
            navigate('/')
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message)
            }
        }
    }
    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input type="email" name="email" />
                </div>
                <div>
                    <label>Nickname</label>
                    <input type="text" name="nickname" />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" name="password" />
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input type="password" name="confirmPassword" />
                </div>
                <button type="submit">Register</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    )
}

export default RegisterPage