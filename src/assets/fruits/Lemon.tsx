export function Lemon({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <radialGradient id="lemon-body" cx="40%" cy="35%" r="60%">
                    <stop offset="0%" stopColor="#fff176" />
                    <stop offset="100%" stopColor="#f9a825" />
                </radialGradient>
            </defs>
            {/* Body */}
            <path d="M10 30 C10 18 18 8 30 8 C38 8 46 12 50 20 C54 26 54 34 50 40 C46 48 38 52 30 52 C18 52 10 42 10 30Z" fill="url(#lemon-body)" />
            {/* Left bump */}
            <circle cx="10" cy="30" r="5" fill="#f9c600" />
            {/* Right bump */}
            <circle cx="50" cy="30" r="5" fill="#f9c600" />
            {/* Highlight */}
            <ellipse cx="22" cy="22" rx="7" ry="9" fill="rgba(255,255,255,0.35)" />
            {/* Texture lines */}
            <path d="M18 16 C24 14 36 14 42 16" fill="none" stroke="rgba(200,150,0,0.3)" strokeWidth="1" />
            <path d="M14 24 C20 22 40 22 46 24" fill="none" stroke="rgba(200,150,0,0.3)" strokeWidth="1" />
            {/* Stem */}
            <path d="M50 30 C54 26 56 24 54 22" fill="none" stroke="#5a8a2a" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    )
}
