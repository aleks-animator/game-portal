export function Watermelon({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            {/* Rind outer */}
            <path d="M6 54 L30 6 L54 54 Z" fill="#4caf50" />
            {/* Rind light inner */}
            <path d="M9 54 L30 10 L51 54 Z" fill="#81c784" />
            {/* Flesh */}
            <path d="M12 54 L30 14 L48 54 Z" fill="#ef5350" />
            {/* Seeds */}
            <ellipse cx="24" cy="42" rx="2" ry="3" fill="#1a1a1a" transform="rotate(-15,24,42)" />
            <ellipse cx="30" cy="34" rx="2" ry="3" fill="#1a1a1a" />
            <ellipse cx="36" cy="42" rx="2" ry="3" fill="#1a1a1a" transform="rotate(15,36,42)" />
            <ellipse cx="27" cy="48" rx="2" ry="3" fill="#1a1a1a" transform="rotate(-5,27,48)" />
            <ellipse cx="33" cy="48" rx="2" ry="3" fill="#1a1a1a" transform="rotate(5,33,48)" />
            {/* Highlight */}
            <path d="M22 46 C24 38 30 26 34 20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeLinecap="round" />
        </svg>
    )
}
