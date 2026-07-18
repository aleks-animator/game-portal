export function Dragonfruit({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <radialGradient id="df-body" cx="38%" cy="32%" r="62%">
                    <stop offset="0%" stopColor="#f48fb1" />
                    <stop offset="100%" stopColor="#ad1457" />
                </radialGradient>
            </defs>
            {/* Body */}
            <ellipse cx="30" cy="32" rx="18" ry="22" fill="url(#df-body)" />
            {/* Scales */}
            {[
                [30, 10], [22, 14], [38, 14],
                [16, 20], [30, 18], [44, 20],
                [14, 28], [46, 28],
                [16, 36], [44, 36],
                [20, 44], [40, 44],
                [26, 50], [34, 50],
            ].map(([cx, cy], i) => (
                <path key={i} d={`M${cx} ${cy} C${cx - 5} ${cy - 6} ${cx + 5} ${cy - 6} ${cx} ${cy}Z`}
                    fill="#e91e8c" opacity="0.7" />
            ))}
            {/* Highlight */}
            <ellipse cx="22" cy="24" rx="6" ry="8" fill="rgba(255,255,255,0.25)" />
        </svg>
    )
}
