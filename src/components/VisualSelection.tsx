import { useState, useEffect } from "react"
import { shuffle } from "../utils.ts"
import './VisualSelection.scss'

type SelectionPhase = 'grid' | 'anticipation' | 'reveal'

type Props = {
    images: string[]
    selected: string
    selectionText?: string
    minCount?: number
    onComplete: () => void
    simple?: boolean
}

export function VisualSelection({ simple, images, selected, selectionText, minCount = 8, onComplete }: Props) {
    const [phase, setPhase] = useState<SelectionPhase>(simple ? 'reveal' : 'grid')
    const [shownImages, setShownImages] = useState<string[]>([])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [showName, setShowName] = useState(false)

    useEffect(() => {
        if (simple) return
        const targetCount = Math.min(
            minCount + Math.floor(Math.random() * 3),
            images.length
        )
        const remaining = shuffle(images.filter(image => image !== selected))
        const others = remaining.slice(0, targetCount - 1)
        const insertAt = 1 + Math.floor(Math.random() * (others.length - 1))
        const result = [...others.slice(0, insertAt), selected, ...others.slice(insertAt)]

        setShownImages(result)
        setSelectedIndex(insertAt)
    }, [])

    useEffect(() => {
        if (phase !== 'reveal') { setShowName(false); return }
        const t = setTimeout(() => setShowName(true), 1000)
        return () => clearTimeout(t)
    }, [phase])

    useEffect(() => {
        const duration =
            phase === 'grid'
                ? 2000
                : phase === 'anticipation'
                    ? 2500
                    : 2500
        const timeout = setTimeout(() => {
            switch (phase) {
                case 'grid':
                    setPhase('anticipation')
                    break

                case 'anticipation':
                    setPhase('reveal')
                    break

                case 'reveal':
                    onComplete()
                    break
            }
        }, duration)
        return () => clearTimeout(timeout)
    }, [phase])

    const rowCount = shownImages.length <= 2 ? 1 : shownImages.length <= 7 ? 2 : 3

    return (
        <div className="visual-selection">
            <div
                className="masonry"
                data-count={shownImages.length}
                style={{ gridTemplateRows: `repeat(${rowCount}, 1fr)` }}
            >
                {shownImages.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt=""
                        className={phase === 'anticipation' ? (index === selectedIndex ? 'anticipating' : 'fading') : ''}
                        style={{ '--i': index } as React.CSSProperties}
                    />
                ))}
            </div>

            {phase === 'reveal' && (
                <div className="reveal-overlay">
                    <img src={selected} alt="" className="reveal-image" />
                    {selectionText && (
                        <div className={`reveal-name ${showName ? 'visible' : ''}`}>
                            <span>{selectionText}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
