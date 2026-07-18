export function Apricot({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <radialGradient id="apricot-body" cx="38%" cy="32%" r="62%">
                    <stop offset="0%" stopColor="#ffcc80" />
                    <stop offset="60%" stopColor="#ffa726" />
                    <stop offset="100%" stopColor="#e65100" />
                </radialGradient>
            </defs>
            <circle cx="30" cy="33" r="21" fill="url(#apricot-body)" />
            {/* Crease */}
            <path d="M30 12 C29 18 28 26 28 33 C28 40 29 46 30 54" fill="none" stroke="rgba(180,80,0,0.3)" strokeWidth="2" strokeLinecap="round" />
            {/* Blush */}
            <ellipse cx="38" cy="36" rx="10" ry="12" fill="rgba(220,80,30,0.2)" />
            {/* Highlight */}
            <ellipse cx="21" cy="24" rx="7" ry="9" fill="rgba(255,255,255,0.3)" />
            {/* Stem */}
            <path d="M30 12 C29 8 31 5 33 7" fill="none" stroke="#5a3e1b" strokeWidth="2" strokeLinecap="round" />
            <path d="M29 10 C26 4 20 6 22 10 C24 12 28 11 29 10Z" fill="#388e3c" />
        </svg>
    )
}
