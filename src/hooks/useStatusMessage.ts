import { useState } from "react"


export function useStatusMessage(duration: number) {
    const [statusMessage, setMessage] = useState<string>('')

    function showStatus(message: string) {
        setMessage(message)
        setTimeout(() => {
            setMessage("")
        }, duration)
    }

    return [statusMessage, showStatus] as const
}