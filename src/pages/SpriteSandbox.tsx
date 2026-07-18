import { useState } from "react"
import { AnimatedSprite, type SpriteState } from "../components/AnimatedSprite.tsx"

const featured = [1, 2, 3]
const medium = [4, 5, 6, 7]
const rest = [8, 10, 11, 12, 13, 14, 15]

function villainSrc(n: number) {
    return new URL(`../assets/animated/fantasyvillains/${n}.png`, import.meta.url).href
}

export default function SpriteSandbox() {
    const [state, setState] = useState<SpriteState>('idle')
    const [intensity, setIntensity] = useState(1)
    const [speed, setSpeed] = useState(1)

    function trigger(s: SpriteState) {
        setState('idle')
        setTimeout(() => setState(s), 10)
    }

    const controls = (
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#0f0f16cc', backdropFilter: 'blur(8px)', borderBottom: '1px solid #2c2c3d', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 24px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: '#aaa', marginRight: 4 }}>State</span>
            {(['idle', 'attack', 'hit', 'dead'] as SpriteState[]).map(s => (
                <button key={s} onClick={() => s === 'idle' ? setState('idle') : trigger(s)}
                    style={{ background: state === s ? '#7dd3fc' : '#26263a', border: '1px solid #37374f', color: state === s ? '#111' : '#ddd', padding: '6px 12px', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
                    {s}
                </button>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#999', marginLeft: 8 }}>
                Intensity
                <input type="range" min={0.3} max={2.5} step={0.1} value={intensity} onChange={e => setIntensity(Number(e.target.value))} style={{ width: 100 }} />
                Speed
                <input type="range" min={0.5} max={2} step={0.1} value={speed} onChange={e => setSpeed(Number(e.target.value))} style={{ width: 100 }} />
            </div>
        </div>
    )

    function card(n: number) {
        return (
            <div key={n} style={{ background: n % 2 === 0 ? '#1e1e2a' : '#ffffff', borderRadius: 16, border: '1px solid #2c2c3d', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 12, gap: 8 }}>
                <span style={{ fontSize: 11, color: '#888' }}>{n}</span>
                <div style={{ width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <AnimatedSprite src={villainSrc(n)} state={state} intensity={intensity} speed={speed} />
                </div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% 20%, #23233a, #0f0f16 70%)', color: '#eee', fontFamily: 'system-ui' }}>
            {controls}
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {featured.map(n => card(n))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                    {medium.map(n => card(n))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                    {rest.map(n => card(n))}
                </div>
            </div>
        </div>
    )
}
