export function Pomegranate({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <radialGradient id="pom-body" cx="38%" cy="35%" r="60%">
                    <stop offset="0%" stopColor="#ef5350" />
                    <stop offset="100%" stopColor="#8b1a1a" />
                </radialGradient>
            </defs>
            {/* Body */}
            <circle cx="30" cy="34" r="20" fill="url(#pom-body)" />
            {/* Crown */}
            <path d="M22 16 L24 10 L26 16 L28 8 L30 16 L32 8 L34 16 L36 10 L38 16" fill="none" stroke="#c62828" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 16 C24 14 36 14 38 16 C38 18 22 18 22 16Z" fill="#b71c1c" />
            {/* Subtle seed bumps */}
            {[
                [24, 28], [32, 26], [38, 32], [36, 40], [28, 44], [20, 38], [22, 30]
            ].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="3" fill="rgba(180,0,0,0.3)" />
            ))}
            {/* Highlight */}
            <ellipse cx="22" cy="26" rx="7" ry="8" fill="rgba(255,255,255,0.2)" />
        </svg>
    )
}
