export function Starfruit({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <radialGradient id="star-body" cx="50%" cy="40%" r="55%">
                    <stop offset="0%" stopColor="#fff176" />
                    <stop offset="100%" stopColor="#f9a825" />
                </radialGradient>
            </defs>
            {/* 5-pointed star fruit cross section */}
            <path d="
                M30 8
                L34 22 L48 22 L36 30 L40 44 L30 36 L20 44 L24 30 L12 22 L26 22 Z
            " fill="url(#star-body)" />
            {/* Ridge lines */}
            <path d="M30 8 L30 36" fill="none" stroke="rgba(180,120,0,0.3)" strokeWidth="1" />
            <path d="M48 22 L20 44" fill="none" stroke="rgba(180,120,0,0.3)" strokeWidth="1" />
            <path d="M12 22 L40 44" fill="none" stroke="rgba(180,120,0,0.3)" strokeWidth="1" />
            {/* Highlight */}
            <ellipse cx="24" cy="22" rx="5" ry="4" fill="rgba(255,255,255,0.35)" transform="rotate(-20, 24, 22)" />
        </svg>
    )
}
