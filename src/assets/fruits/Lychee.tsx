export function Lychee({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <radialGradient id="lychee-body" cx="38%" cy="32%" r="62%">
                    <stop offset="0%" stopColor="#ef9a9a" />
                    <stop offset="100%" stopColor="#b71c1c" />
                </radialGradient>
            </defs>
            {/* Body */}
            <circle cx="30" cy="33" r="21" fill="url(#lychee-body)" />
            {/* Bumpy texture */}
            {[
                [20, 22], [28, 18], [36, 20], [42, 26],
                [44, 34], [40, 42], [32, 46], [24, 44],
                [16, 38], [14, 30], [18, 24],
                [26, 28], [34, 28], [30, 36]
            ].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="3.5" fill="none" stroke="rgba(180,0,0,0.3)" strokeWidth="1.5" />
            ))}
            {/* Highlight */}
            <ellipse cx="21" cy="24" rx="7" ry="8" fill="rgba(255,255,255,0.25)" />
            {/* Stem */}
            <path d="M30 12 C29 8 31 5 33 7" fill="none" stroke="#5a3e1b" strokeWidth="2" strokeLinecap="round" />
            <path d="M29 10 C26 4 20 6 22 10 C24 12 28 11 29 10Z" fill="#388e3c" />
        </svg>
    )
}
