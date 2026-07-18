export function Kiwi({ width = 60, height = 60 }: { width?: number; height?: number }) {
    return (
        <svg width={width} height={height} viewBox="0 0 60 60">
            <defs>
                <radialGradient id="kiwi-flesh" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f9f9e0" />
                    <stop offset="30%" stopColor="#c5e1a5" />
                    <stop offset="100%" stopColor="#558b2f" />
                </radialGradient>
            </defs>
            {/* Outer skin */}
            <ellipse cx="30" cy="32" rx="22" ry="24" fill="#795548" />
            {/* Skin texture */}
            <ellipse cx="30" cy="32" rx="22" ry="24" fill="none" stroke="#6d4c41" strokeWidth="0" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
                const rad = (angle * Math.PI) / 180
                const x1 = 30 + 18 * Math.cos(rad)
                const y1 = 32 + 20 * Math.sin(rad)
                const x2 = 30 + 22 * Math.cos(rad)
                const y2 = 32 + 24 * Math.sin(rad)
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#6d4c41" strokeWidth="1.5" />
            })}
            {/* Flesh */}
            <ellipse cx="30" cy="32" rx="18" ry="20" fill="url(#kiwi-flesh)" />
            {/* Seeds */}
            {[
                [30, 16], [38, 20], [42, 28], [40, 38], [34, 44], [26, 44], [20, 38], [18, 28], [22, 20]
            ].map(([cx, cy], i) => {
                const angle = (i * 40) - 90
                return <ellipse key={i} cx={cx} cy={cy} rx="2.5" ry="1.5" fill="#3e2723" transform={`rotate(${angle}, ${cx}, ${cy})`} />
            })}
            {/* Center */}
            <ellipse cx="30" cy="32" rx="5" ry="5" fill="#f9f9e0" />
            {/* Center lines */}
            {[0, 45, 90, 135].map((angle, i) => {
                const rad = (angle * Math.PI) / 180
                return <line key={i} x1={30 - 5 * Math.cos(rad)} y1={32 - 5 * Math.sin(rad)} x2={30 + 5 * Math.cos(rad)} y2={32 + 5 * Math.sin(rad)} stroke="#c5e1a5" strokeWidth="0.8" />
            })}
        </svg>
    )
}
