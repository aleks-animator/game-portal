export function Pear({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <radialGradient id="pear-body" cx="40%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#d4e157" />
                    <stop offset="100%" stopColor="#9caf00" />
                </radialGradient>
            </defs>
            {/* Body */}
            <path d="M30 54 C18 54 10 44 10 36 C10 28 16 24 20 22 C18 18 18 12 22 10 C26 8 34 8 38 10 C42 12 42 18 40 22 C44 24 50 28 50 36 C50 44 42 54 30 54Z" fill="url(#pear-body)" />
            {/* Highlight */}
            <ellipse cx="22" cy="30" rx="7" ry="10" fill="rgba(255,255,255,0.3)" />
            {/* Blush */}
            <ellipse cx="38" cy="40" rx="8" ry="10" fill="rgba(255,150,50,0.2)" />
            {/* Stem */}
            <path d="M30 10 C30 6 32 3 34 5" fill="none" stroke="#5a3e1b" strokeWidth="2" strokeLinecap="round" />
            {/* Leaf */}
            <path d="M29 8 C26 2 20 4 22 8 C24 10 28 9 29 8Z" fill="#388e3c" />
        </svg>
    )
}
