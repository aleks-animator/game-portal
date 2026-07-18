export function Mango({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <radialGradient id="mango-body" cx="45%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#ffcc02" />
                    <stop offset="50%" stopColor="#ff9800" />
                    <stop offset="100%" stopColor="#e65100" />
                </radialGradient>
            </defs>
            {/* Body */}
            <path d="M30 52 C16 50 8 40 10 28 C12 16 22 10 30 10 C40 10 50 18 50 30 C50 44 42 54 30 52Z" fill="url(#mango-body)" />
            {/* Highlight */}
            <ellipse cx="22" cy="24" rx="8" ry="10" fill="rgba(255,255,255,0.25)" />
            {/* Blush */}
            <ellipse cx="40" cy="32" rx="8" ry="10" fill="rgba(220,50,0,0.2)" />
            {/* Stem */}
            <path d="M30 10 C29 6 30 3 32 5" fill="none" stroke="#5a3e1b" strokeWidth="2" strokeLinecap="round" />
            {/* Leaf */}
            <path d="M29 8 C25 2 18 4 22 8 C24 10 28 9 29 8Z" fill="#388e3c" />
            <path d="M22 8 C25 6 29 8 29 8" fill="none" stroke="#2e7d32" strokeWidth="0.8" />
        </svg>
    )
}
