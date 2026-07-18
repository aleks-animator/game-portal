export function Banana({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <linearGradient id="banana-body" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff176" />
                    <stop offset="50%" stopColor="#f9e04b" />
                    <stop offset="100%" stopColor="#f0a500" />
                </linearGradient>
                <linearGradient id="banana-shadow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(0,0,0,0.15)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </linearGradient>
            </defs>
            {/* Body — full crescent shape */}
            <path d="
                M14 48
                C12 42 12 34 16 26
                C20 18 26 12 34 9
                C42 6 50 8 52 13
                C50 15 46 13 40 15
                C32 18 26 24 22 32
                C18 40 18 48 20 52
                C17 52 15 51 14 48Z
            " fill="url(#banana-body)" />
            {/* Shadow on outer edge */}
            <path d="
                M14 48
                C12 42 12 34 16 26
                C20 18 26 12 34 9
                C38 8 42 8 46 10
                C42 10 36 12 30 17
                C22 24 18 34 16 44
                C15 47 14 48 14 48Z
            " fill="rgba(180,120,0,0.25)" />
            {/* Inner highlight curve */}
            <path d="M21 50 C19 44 20 34 25 26 C30 18 38 14 46 12"
                fill="none" stroke="rgba(255,255,200,0.7)" strokeWidth="2.5" strokeLinecap="round" />
            {/* Bottom tip */}
            <path d="M14 48 C11 50 10 54 13 55 C16 56 18 53 20 52"
                fill="#8B6914" />
            {/* Top tip */}
            <path d="M52 13 C55 11 57 8 55 7 C53 5 50 8 50 10"
                fill="#8B6914" />
        </svg>
    )
}
