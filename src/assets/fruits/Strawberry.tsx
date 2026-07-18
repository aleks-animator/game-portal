export function Strawberry({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <radialGradient id="straw-body" cx="40%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#ff6b81" />
                    <stop offset="100%" stopColor="#c0392b" />
                </radialGradient>
            </defs>
            {/* Body */}
            <path d="M30 54 C18 46 8 36 8 24 C8 16 14 12 20 14 C24 15 28 18 30 18 C32 18 36 15 40 14 C46 12 52 16 52 24 C52 36 42 46 30 54Z" fill="url(#straw-body)" />
            {/* Seeds */}
            {[
                [22, 26], [30, 22], [38, 26], [20, 34], [30, 32], [40, 34], [25, 42], [35, 42]
            ].map(([cx, cy], i) => (
                <ellipse key={i} cx={cx} cy={cy} rx="1.5" ry="2" fill="#f9e04b" transform={`rotate(-10, ${cx}, ${cy})`} />
            ))}
            {/* Highlight */}
            <ellipse cx="22" cy="26" rx="6" ry="8" fill="rgba(255,255,255,0.25)" />
            {/* Leaves */}
            <path d="M30 18 C28 10 22 8 20 12 C24 12 28 16 30 18Z" fill="#27ae60" />
            <path d="M30 18 C30 8 28 4 30 6 C32 4 30 8 30 18Z" fill="#2ecc71" />
            <path d="M30 18 C32 10 38 8 40 12 C36 12 32 16 30 18Z" fill="#27ae60" />
        </svg>
    )
}
