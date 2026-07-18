export function Cherry({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <radialGradient id="cherry-left" cx="35%" cy="30%" r="60%">
                    <stop offset="0%" stopColor="#ff6b6b" />
                    <stop offset="100%" stopColor="#c0392b" />
                </radialGradient>
                <radialGradient id="cherry-right" cx="35%" cy="30%" r="60%">
                    <stop offset="0%" stopColor="#e74c3c" />
                    <stop offset="100%" stopColor="#922b21" />
                </radialGradient>
            </defs>
            {/* Stems */}
            <path d="M22 32 C22 20 30 14 30 8" fill="none" stroke="#5a8a2a" strokeWidth="2" strokeLinecap="round" />
            <path d="M38 32 C38 22 30 14 30 8" fill="none" stroke="#5a8a2a" strokeWidth="2" strokeLinecap="round" />
            {/* Leaf */}
            <path d="M30 10 C34 4 42 6 40 12 C38 14 30 12 30 10Z" fill="#27ae60" />
            <path d="M30 10 C35 10 40 12 40 12" fill="none" stroke="#1e8449" strokeWidth="0.8" />
            {/* Left cherry */}
            <circle cx="20" cy="42" r="12" fill="url(#cherry-left)" />
            <ellipse cx="16" cy="37" rx="4" ry="3" fill="rgba(255,255,255,0.3)" />
            {/* Right cherry */}
            <circle cx="40" cy="44" r="12" fill="url(#cherry-right)" />
            <ellipse cx="36" cy="39" rx="4" ry="3" fill="rgba(255,255,255,0.3)" />
        </svg>
    )
}
