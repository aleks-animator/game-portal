export function Avocado({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <radialGradient id="avo-skin" cx="40%" cy="35%" r="60%">
                    <stop offset="0%" stopColor="#558b2f" />
                    <stop offset="100%" stopColor="#1b5e20" />
                </radialGradient>
                <radialGradient id="avo-flesh" cx="45%" cy="40%" r="55%">
                    <stop offset="0%" stopColor="#f9f5c2" />
                    <stop offset="100%" stopColor="#aed581" />
                </radialGradient>
            </defs>
            {/* Outer skin */}
            <path d="M30 54 C18 54 10 44 10 36 C10 26 18 16 24 10 C26 6 28 4 30 4 C32 4 34 6 36 10 C42 16 50 26 50 36 C50 44 42 54 30 54Z" fill="url(#avo-skin)" />
            {/* Flesh */}
            <path d="M30 50 C20 50 14 43 14 37 C14 29 20 22 26 17 C28 13 29 12 30 12 C31 12 32 13 34 17 C40 22 46 29 46 37 C46 43 40 50 30 50Z" fill="url(#avo-flesh)" />
            {/* Pit */}
            <circle cx="30" cy="36" r="10" fill="#6d4c41" />
            <circle cx="30" cy="36" r="8" fill="#8d6e63" />
            <ellipse cx="27" cy="33" rx="3" ry="4" fill="rgba(255,255,255,0.2)" />
            {/* Stem */}
            <path d="M30 4 C30 1 32 0 33 2" fill="none" stroke="#5a3e1b" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}
