export function Papaya({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <radialGradient id="papaya-body" cx="38%" cy="32%" r="62%">
                    <stop offset="0%" stopColor="#ffcc80" />
                    <stop offset="60%" stopColor="#ff9800" />
                    <stop offset="100%" stopColor="#e65100" />
                </radialGradient>
            </defs>
            {/* Body */}
            <path d="M30 54 C18 54 10 46 10 36 C10 24 18 14 22 10 C24 8 26 7 30 7 C34 7 36 8 38 10 C42 14 50 24 50 36 C50 46 42 54 30 54Z" fill="url(#papaya-body)" />
            {/* Center seed cavity */}
            <ellipse cx="30" cy="34" rx="8" ry="12" fill="rgba(180,80,0,0.2)" />
            {/* Seeds */}
            {[
                [28, 26], [32, 28], [30, 32], [28, 36], [32, 38], [30, 42]
            ].map(([cx, cy], i) => (
                <ellipse key={i} cx={cx} cy={cy} rx="2" ry="2.5" fill="#4a2000" opacity="0.7" />
            ))}
            {/* Highlight */}
            <ellipse cx="20" cy="22" rx="7" ry="9" fill="rgba(255,255,255,0.25)" />
            {/* Stem */}
            <path d="M30 7 C30 3 32 1 34 3" fill="none" stroke="#5a3e1b" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}
