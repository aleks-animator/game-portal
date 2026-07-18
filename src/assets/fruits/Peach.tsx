export function Peach({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <radialGradient id="peach-body" cx="40%" cy="35%" r="60%">
                    <stop offset="0%" stopColor="#ffcc80" />
                    <stop offset="60%" stopColor="#ffb74d" />
                    <stop offset="100%" stopColor="#ff8f00" />
                </radialGradient>
                <radialGradient id="peach-blush" cx="70%" cy="60%" r="50%">
                    <stop offset="0%" stopColor="rgba(255,100,80,0.5)" />
                    <stop offset="100%" stopColor="rgba(255,100,80,0)" />
                </radialGradient>
            </defs>
            {/* Body */}
            <circle cx="30" cy="33" r="21" fill="url(#peach-body)" />
            {/* Blush */}
            <circle cx="30" cy="33" r="21" fill="url(#peach-blush)" />
            {/* Crease */}
            <path d="M30 12 C30 18 28 28 28 33 C28 38 30 48 30 54" fill="none" stroke="rgba(200,80,40,0.4)" strokeWidth="2" strokeLinecap="round" />
            {/* Highlight */}
            <ellipse cx="22" cy="24" rx="7" ry="9" fill="rgba(255,255,255,0.3)" />
            {/* Stem */}
            <path d="M30 12 C29 8 30 5 32 7" fill="none" stroke="#5a3e1b" strokeWidth="2" strokeLinecap="round" />
            {/* Leaf */}
            <path d="M29 10 C26 4 20 6 22 10 C24 12 28 11 29 10Z" fill="#388e3c" />
        </svg>
    )
}
