export function Pineapple({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <linearGradient id="pine-body" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fdd835" />
                    <stop offset="100%" stopColor="#f9a825" />
                </linearGradient>
            </defs>
            {/* Crown leaves */}
            <path d="M30 16 C28 8 22 4 24 10 C26 12 28 14 30 16Z" fill="#388e3c" />
            <path d="M30 16 C30 6 28 2 30 4 C32 2 30 6 30 16Z" fill="#2e7d32" />
            <path d="M30 16 C32 8 38 4 36 10 C34 12 32 14 30 16Z" fill="#388e3c" />
            <path d="M30 16 C24 10 18 8 20 12 C22 14 26 14 30 16Z" fill="#43a047" />
            <path d="M30 16 C36 10 42 8 40 12 C38 14 34 14 30 16Z" fill="#43a047" />
            {/* Body */}
            <ellipse cx="30" cy="36" rx="16" ry="20" fill="url(#pine-body)" />
            {/* Diamond pattern */}
            {[
                [24, 26], [32, 26], [40, 26],
                [20, 32], [28, 32], [36, 32], [44, 32],
                [24, 38], [32, 38], [40, 38],
                [20, 44], [28, 44], [36, 44],
                [24, 50], [32, 50],
            ].map(([cx, cy], i) => (
                <path key={i} d={`M${cx} ${cy-4} L${cx+4} ${cy} L${cx} ${cy+4} L${cx-4} ${cy}Z`}
                    fill="none" stroke="#e65100" strokeWidth="0.8" opacity="0.6" />
            ))}
            {/* Highlight */}
            <ellipse cx="22" cy="28" rx="6" ry="8" fill="rgba(255,255,255,0.2)" />
        </svg>
    )
}
