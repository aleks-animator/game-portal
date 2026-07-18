export function Guava({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <radialGradient id="guava-body" cx="38%" cy="32%" r="62%">
                    <stop offset="0%" stopColor="#c8e6c9" />
                    <stop offset="100%" stopColor="#2e7d32" />
                </radialGradient>
            </defs>
            <circle cx="30" cy="32" r="21" fill="url(#guava-body)" />
            {/* Crown */}
            <path d="M24 14 C26 10 28 12 30 10 C32 12 34 10 36 14" fill="none" stroke="#1b5e20" strokeWidth="2" strokeLinecap="round" />
            <path d="M24 14 C26 12 34 12 36 14 C36 16 24 16 24 14Z" fill="#388e3c" />
            {/* Highlight */}
            <ellipse cx="21" cy="24" rx="7" ry="8" fill="rgba(255,255,255,0.3)" />
            {/* Blush */}
            <ellipse cx="38" cy="38" rx="9" ry="9" fill="rgba(255,200,150,0.2)" />
            {/* Stem */}
            <path d="M30 11 C30 7 32 5 34 7" fill="none" stroke="#5a3e1b" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}
