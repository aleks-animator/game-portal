export function Passionfruit({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <radialGradient id="passion-body" cx="38%" cy="32%" r="62%">
                    <stop offset="0%" stopColor="#ce93d8" />
                    <stop offset="100%" stopColor="#4a148c" />
                </radialGradient>
            </defs>
            <circle cx="30" cy="32" r="22" fill="url(#passion-body)" />
            {/* Dimple pattern */}
            {[
                [22, 22], [32, 20], [40, 26], [42, 36], [36, 44], [26, 46], [18, 40], [16, 30]
            ].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="3" fill="rgba(80,0,120,0.25)" />
            ))}
            {/* Highlight */}
            <ellipse cx="21" cy="23" rx="7" ry="8" fill="rgba(255,255,255,0.25)" />
            {/* Stem */}
            <path d="M30 10 C30 6 32 4 34 6" fill="none" stroke="#5a3e1b" strokeWidth="2" strokeLinecap="round" />
            <path d="M29 9 C26 3 20 5 22 9 C24 11 28 10 29 9Z" fill="#388e3c" />
        </svg>
    )
}
