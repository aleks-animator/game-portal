export function Plum({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <radialGradient id="plum-body" cx="38%" cy="32%" r="62%">
                    <stop offset="0%" stopColor="#ba68c8" />
                    <stop offset="100%" stopColor="#4a148c" />
                </radialGradient>
            </defs>
            <circle cx="30" cy="33" r="21" fill="url(#plum-body)" />
            {/* Crease */}
            <path d="M30 12 C29 18 28 26 28 33 C28 40 29 46 30 54" fill="none" stroke="rgba(80,0,100,0.35)" strokeWidth="2" strokeLinecap="round" />
            {/* Highlight */}
            <ellipse cx="21" cy="24" rx="7" ry="9" fill="rgba(255,255,255,0.28)" />
            {/* Stem */}
            <path d="M30 12 C29 8 31 5 33 7" fill="none" stroke="#5a3e1b" strokeWidth="2" strokeLinecap="round" />
            {/* Leaf */}
            <path d="M29 10 C26 4 20 6 22 10 C24 12 28 11 29 10Z" fill="#388e3c" />
        </svg>
    )
}
