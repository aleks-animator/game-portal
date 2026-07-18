export function Coconut({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <radialGradient id="coconut-body" cx="38%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#8d6e63" />
                    <stop offset="100%" stopColor="#4e342e" />
                </radialGradient>
            </defs>
            {/* Body */}
            <ellipse cx="30" cy="34" rx="22" ry="20" fill="url(#coconut-body)" />
            {/* Fiber lines */}
            {[-14, -7, 0, 7, 14].map((offset, i) => (
                <path key={i}
                    d={`M${30 + offset} 14 C${28 + offset} 24 ${32 + offset} 44 ${30 + offset} 54`}
                    fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
            ))}
            {/* Three eyes */}
            <circle cx="24" cy="20" r="3" fill="#2d1b0e" />
            <circle cx="32" cy="18" r="3" fill="#2d1b0e" />
            <circle cx="38" cy="22" r="3" fill="#2d1b0e" />
            <circle cx="24" cy="20" r="1.5" fill="#1a0a00" />
            <circle cx="32" cy="18" r="1.5" fill="#1a0a00" />
            <circle cx="38" cy="22" r="1.5" fill="#1a0a00" />
            {/* Highlight */}
            <ellipse cx="20" cy="26" rx="6" ry="8" fill="rgba(255,255,255,0.12)" />
        </svg>
    )
}
