export function Apple({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <radialGradient id="apple-body" cx="40%" cy="35%" r="60%">
                    <stop offset="0%" stopColor="#ff6b6b" />
                    <stop offset="100%" stopColor="#c0392b" />
                </radialGradient>
                <radialGradient id="apple-highlight" cx="30%" cy="25%" r="40%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </radialGradient>
            </defs>
            {/* Body */}
            <path d="M30 12 C14 12 8 24 8 34 C8 46 16 54 26 54 C28 54 30 52 30 52 C30 52 32 54 34 54 C44 54 52 46 52 34 C52 24 46 12 30 12Z" fill="url(#apple-body)" />
            {/* Highlight */}
            <ellipse cx="22" cy="24" rx="8" ry="10" fill="url(#apple-highlight)" />
            {/* Indent top */}
            <path d="M28 13 C28 10 30 8 30 8 C30 8 32 10 32 13" fill="none" stroke="#a93226" strokeWidth="1.5" strokeLinecap="round" />
            {/* Stem */}
            <path d="M30 8 C30 4 34 2 36 4" fill="none" stroke="#6b4226" strokeWidth="2" strokeLinecap="round" />
            {/* Leaf */}
            <path d="M30 6 C33 2 40 4 38 8 C36 10 30 8 30 6Z" fill="#27ae60" />
            <path d="M30 6 C34 6 38 8" fill="none" stroke="#1e8449" strokeWidth="0.8" />
        </svg>
    )
}
