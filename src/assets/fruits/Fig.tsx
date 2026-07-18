export function Fig({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <radialGradient id="fig-body" cx="38%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#9c6b98" />
                    <stop offset="100%" stopColor="#4a235a" />
                </radialGradient>
            </defs>
            {/* Body — teardrop */}
            <path d="M30 52 C18 52 10 44 10 36 C10 26 18 18 26 14 C28 10 30 8 30 8 C30 8 32 10 34 14 C42 18 50 26 50 36 C50 44 42 52 30 52Z" fill="url(#fig-body)" />
            {/* Vertical line */}
            <path d="M30 8 C30 14 29 28 29 36 C29 42 30 52 30 52" fill="none" stroke="rgba(100,30,80,0.4)" strokeWidth="1.5" />
            {/* Highlight */}
            <ellipse cx="22" cy="26" rx="7" ry="9" fill="rgba(255,255,255,0.2)" />
            {/* Stem */}
            <path d="M30 8 C30 5 32 3 34 5" fill="none" stroke="#5a3e1b" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}
