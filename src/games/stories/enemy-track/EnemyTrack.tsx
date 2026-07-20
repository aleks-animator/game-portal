import type { ReactNode } from "react"
import type { MotionValue } from "framer-motion"
import type { EnemyTrackConfig } from "./enemyTrackConfig.ts"
import zoneMarker from "../../../assets/backgrounds/markers/marker3.png";
import {motion, useTransform, type Variants} from "framer-motion";
import LottieReact from 'lottie-react'
const Lottie = (LottieReact as any).default ?? LottieReact

type EnemyTrackProps = {
    config: EnemyTrackConfig
    enemyPosition: MotionValue<number>
    isFrozen: boolean
    enemyAnimation: object
    targetSlot: ReactNode
    bounceX: MotionValue<number>
}



export function EnemyTrack({ config, enemyPosition, isFrozen, enemyAnimation, targetSlot, bounceX }: EnemyTrackProps) {
    const enemyX = useTransform(enemyPosition, [0, 1], ['0%', '100%'])

    const enemyVisualVariants: Variants = {
        normal: {
            filter: 'hue-rotate(0deg) saturate(1) brightness(1)',
            x: 0,
        },
        frozen: {
            filter: 'hue-rotate(180deg) saturate(3) brightness(1.8)',
            x: [0, -6, 6, -6, 6, 0],
            transition: {
                x: { duration: 0.4, ease: 'easeInOut' },
                filter: { duration: 0.2 }
            }
        }
    }

    return (
            <div className="track">
                {config.perfectHitZones?.map(zone => (
                    <div
                        key={zone}
                        className="track-zone"
                        style={{ left: `${zone * 100}%`, backgroundImage: `url(${zoneMarker})` }}
                    />
                ))}
                <span className="track-target" style={{ left: `${config.fruitPosition * 100}%` }}>
                        {targetSlot}
                    </span>
                <motion.div
                    className="track-enemy"
                    style={{ left: enemyX, translateX: '-50%', translateY: '-50%' }}
                    animate={isFrozen ? "frozen" : "normal"}
                    variants={enemyVisualVariants}
                >
                    <motion.div style={{ x: bounceX }}>
                        <Lottie animationData={enemyAnimation} style={{ width: 80, height: 80, transform: 'scaleX(-1)' }} />
                    </motion.div>
                </motion.div>
            </div>
    )
}
