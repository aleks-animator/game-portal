export function Raspberry({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <radialGradient id="rasp-drupelet" cx="35%" cy="30%" r="60%">
                    <stop offset="0%" stopColor="#ff8a80" />
                    <stop offset="100%" stopColor="#c62828" />
                </radialGradient>
            </defs>
            {/* Drupelets in cluster shape */}
            {[
                [30, 16], // top
                [22, 22], [38, 22], // row 2
                [16, 30], [30, 28], [44, 30], // row 3
                [20, 38], [30, 40], [40, 38], // row 4
                [26, 48], [34, 48], // bottom
            ].map(([cx, cy], i) => (
                <g key={i}>
                    <circle cx={cx} cy={cy} r="8" fill="url(#rasp-drupelet)" />
                    <circle cx={cx} cy={cy} r="6" fill="none" stroke="rgba(180,0,0,0.2)" strokeWidth="1" />
                    <circle cx={cx - 2} cy={cy - 2} r="2" fill="rgba(255,255,255,0.3)" />
                    {/* Center dot */}
                    <circle cx={cx} cy={cy} r="1.5" fill="rgba(180,0,0,0.4)" />
                </g>
            ))}
            {/* Leaves at top */}
            <path d="M30 12 C28 6 22 6 22 10 C24 12 28 12 30 12Z" fill="#2e7d32" />
            <path d="M30 12 C32 6 38 6 38 10 C36 12 32 12 30 12Z" fill="#388e3c" />
            <path d="M30 12 C30 5 30 4 30 12Z" fill="#1b5e20" />
        </svg>
    )
}
