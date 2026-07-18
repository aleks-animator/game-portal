export function Orange({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <radialGradient id="orange-body" cx="40%" cy="35%" r="60%">
                    <stop offset="0%" stopColor="#ffa040" />
                    <stop offset="100%" stopColor="#e06000" />
                </radialGradient>
            </defs>
            <circle cx="30" cy="32" r="22" fill="url(#orange-body)" />
            {/* Texture bumps */}
            <circle cx="22" cy="26" r="1.5" fill="rgba(0,0,0,0.1)" />
            <circle cx="34" cy="22" r="1.5" fill="rgba(0,0,0,0.1)" />
            <circle cx="40" cy="32" r="1.5" fill="rgba(0,0,0,0.1)" />
            <circle cx="36" cy="42" r="1.5" fill="rgba(0,0,0,0.1)" />
            <circle cx="24" cy="40" r="1.5" fill="rgba(0,0,0,0.1)" />
            <circle cx="18" cy="34" r="1.5" fill="rgba(0,0,0,0.1)" />
            {/* Navel */}
            <circle cx="30" cy="50" r="3" fill="rgba(0,0,0,0.15)" />
            <circle cx="30" cy="50" r="1.5" fill="rgba(0,0,0,0.2)" />
            {/* Highlight */}
            <ellipse cx="22" cy="24" rx="7" ry="9" fill="rgba(255,255,255,0.3)" />
            {/* Stem */}
            <path d="M30 10 C30 6 33 4 34 6" fill="none" stroke="#5a3e1b" strokeWidth="2" strokeLinecap="round" />
            <path d="M28 10 C26 6 28 3 30 10" fill="#27ae60" />
        </svg>
    )
}
