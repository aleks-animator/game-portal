import { useCallback, useRef, useState } from "react"

// Reference-counted lock: any number of independent timed sequences (animations,
// overlays, etc.) can hold it concurrently. Locked as long as at least one is still
// active — a sequence ending never has to know whether some other sequence still needs it.
export function useSequenceLock() {
    const [active, setActive] = useState<Set<number>>(new Set())
    const nextId = useRef(0)

    const beginSequence = useCallback(() => {
        const id = nextId.current++
        setActive(prev => new Set(prev).add(id))
        return id
    }, [])

    const endSequence = useCallback((id: number) => {
        setActive(prev => {
            if (!prev.has(id)) return prev
            const next = new Set(prev)
            next.delete(id)
            return next
        })
    }, [])

    return { isLocked: active.size > 0, beginSequence, endSequence }
}
