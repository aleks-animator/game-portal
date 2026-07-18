export function Blueberry({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <radialGradient id="blue-body" cx="38%" cy="30%" r="60%">
                    <stop offset="0%" stopColor="#7986cb" />
                    <stop offset="100%" stopColor="#283593" />
                </radialGradient>
            </defs>
            {/* Body */}
            <circle cx="30" cy="32" r="22" fill="url(#blue-body)" />
            {/* Crown at top */}
            <path d="M24 12 C26 8 28 10 30 8 C32 10 34 8 36 12" fill="none" stroke="#1a237e" strokeWidth="2" strokeLinecap="round" />
            {/* Crown dots */}
            <circle cx="24" cy="12" r="2" fill="#1a237e" />
            <circle cx="30" cy="10" r="2" fill="#1a237e" />
            <circle cx="36" cy="12" r="2" fill="#1a237e" />
            {/* Highlight */}
            <ellipse cx="22" cy="24" rx="7" ry="8" fill="rgba(255,255,255,0.25)" />
            {/* Subtle bloom */}
            <ellipse cx="30" cy="32" rx="18" ry="18" fill="rgba(150,170,255,0.1)" />
        </svg>
    )
}
