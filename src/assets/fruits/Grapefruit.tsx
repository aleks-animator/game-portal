export function Grapefruit({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <radialGradient id="gf-body" cx="40%" cy="35%" r="60%">
                    <stop offset="0%" stopColor="#ffcc80" />
                    <stop offset="70%" stopColor="#ffa040" />
                    <stop offset="100%" stopColor="#e65c00" />
                </radialGradient>
                <radialGradient id="gf-flesh" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fff" />
                    <stop offset="30%" stopColor="#ffb3b3" />
                    <stop offset="100%" stopColor="#ff5252" />
                </radialGradient>
            </defs>
            {/* Outer */}
            <circle cx="30" cy="32" r="22" fill="url(#gf-body)" />
            {/* Highlight */}
            <ellipse cx="20" cy="22" rx="8" ry="10" fill="rgba(255,255,255,0.3)" />
            {/* Navel */}
            <circle cx="30" cy="50" r="4" fill="rgba(0,0,0,0.12)" />
            <circle cx="30" cy="50" r="2" fill="rgba(0,0,0,0.18)" />
            {/* Segments hint */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                const rad = (angle * Math.PI) / 180
                return <line key={i} x1="30" y1="32" x2={30 + 16 * Math.cos(rad)} y2={32 + 16 * Math.sin(rad)}
                    stroke="rgba(200,100,0,0.2)" strokeWidth="1" />
            })}
            {/* Stem */}
            <path d="M30 10 C30 6 32 4 34 6" fill="none" stroke="#5a3e1b" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}
