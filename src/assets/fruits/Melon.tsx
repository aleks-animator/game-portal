export function Melon({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <radialGradient id="melon-body" cx="40%" cy="35%" r="60%">
                    <stop offset="0%" stopColor="#dce775" />
                    <stop offset="100%" stopColor="#827717" />
                </radialGradient>
            </defs>
            <ellipse cx="30" cy="32" rx="22" ry="18" fill="url(#melon-body)" />
            {/* Net pattern */}
            {[-12, -4, 4, 12].map((offset, i) => (
                <path key={`v${i}`} d={`M${30 + offset} 14 C${30 + offset - 2} 22 ${30 + offset + 2} 40 ${30 + offset} 50`}
                    fill="none" stroke="rgba(100,80,0,0.3)" strokeWidth="1" />
            ))}
            {[20, 28, 36, 44].map((y, i) => (
                <path key={`h${i}`} d={`M8 ${y} C16 ${y - 3} 44 ${y - 3} 52 ${y}`}
                    fill="none" stroke="rgba(100,80,0,0.3)" strokeWidth="1" />
            ))}
            {/* Highlight */}
            <ellipse cx="20" cy="24" rx="7" ry="6" fill="rgba(255,255,255,0.25)" />
            {/* Stem */}
            <path d="M30 14 C30 10 32 7 34 9" fill="none" stroke="#5a3e1b" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}
