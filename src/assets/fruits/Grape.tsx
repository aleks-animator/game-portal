export function Grape({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <radialGradient id="grape-single" cx="35%" cy="30%" r="60%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#6b21a8" />
                </radialGradient>
            </defs>
            {/* Stem */}
            <path d="M30 6 C30 4 32 2 34 4" fill="none" stroke="#5a3e1b" strokeWidth="2" strokeLinecap="round" />
            {/* Leaf */}
            <path d="M28 8 C24 4 18 6 20 10 C22 12 28 10 28 8Z" fill="#27ae60" />
            {/* Grapes cluster - bottom to top */}
            {[
                { cx: 30, cy: 50 },
                { cx: 22, cy: 44 }, { cx: 38, cy: 44 },
                { cx: 30, cy: 40 },
                { cx: 16, cy: 38 }, { cx: 44, cy: 38 },
                { cx: 24, cy: 34 }, { cx: 36, cy: 34 },
                { cx: 30, cy: 30 },
                { cx: 20, cy: 28 }, { cx: 40, cy: 28 },
                { cx: 28, cy: 22 }, { cx: 36, cy: 22 },
            ].map(({ cx, cy }, i) => (
                <g key={i}>
                    <circle cx={cx} cy={cy} r="7" fill="url(#grape-single)" />
                    <ellipse cx={cx - 2} cy={cy - 2} rx="2.5" ry="2" fill="rgba(255,255,255,0.3)" />
                </g>
            ))}
        </svg>
    )
}
