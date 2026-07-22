import { useEffect, useState } from "react"
import './AnimatedSprite.scss'

export type SpriteState = 'idle' | 'attack' | 'hit' | 'heal' | 'dead' | 'dodge'

type Props = {
    src: string
    state?: SpriteState
    intensity?: number
    speed?: number
}

export function AnimatedSprite({ src, state = 'idle', intensity = 1, speed = 1 }: Props) {
    const [animClass, setAnimClass] = useState('')

    useEffect(() => {
        if (state === 'idle') { setAnimClass(''); return }
        setAnimClass(state)
        // 'dead' is terminal — hold the (forwards) collapse until the state is explicitly
        // reset to idle when the next enemy loads. Auto-clearing it would revert the sprite
        // to idle mid-death.
        if (state === 'dead') return
        const t = setTimeout(() => setAnimClass(''), 900)
        return () => clearTimeout(t)
    }, [state])

    return (
        <div
            className={`sprite-root ${animClass}`}
            style={{ '--intensity': intensity, '--speed': speed } as React.CSSProperties}
        >
            <img className="sprite-img sprite-top" src={src} alt="" />
            <img className="sprite-img sprite-bottom" src={src} alt="" />
        </div>
    )
}
