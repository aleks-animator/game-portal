import { villains } from '../../../assets/villains'
import { heroImages } from '../../../assets/animated/heros'
import { usePlayerContext } from '../../../context/PlayerContext.tsx'
import battlefieldBg from '../../../assets/backgrounds/battlefields/2.png'
import { AnimatedSprite, type SpriteState } from '../../../components/AnimatedSprite.tsx'
import './Duel.scss'

type Props = {
    playerHp: number
    maxPlayerHp: number
    enemyHp: number
    maxEnemyHp: number
    enemyCount: number
    villainOffset: number
    heroState?: SpriteState
    enemyState?: SpriteState
    message?: string
}

export function Duel({ playerHp, maxPlayerHp, enemyHp, maxEnemyHp, enemyCount, villainOffset, heroState, enemyState, message }: Props) {
    const { player } = usePlayerContext()
    const playerPct = Math.max(0, (playerHp / maxPlayerHp) * 100)
    const enemyPct = Math.max(0, (enemyHp / maxEnemyHp) * 100)
    const villain = villains[(villainOffset + enemyCount) % villains.length]

    return (
        <div className="duel">
            <img className="duel-bg" src={battlefieldBg} alt="" />
            <div className="duel-arena">
                <div className="duel-side player-side">
                    <AnimatedSprite src={heroImages[0]} intensity={1.5} speed={1.9} state={heroState} />
                </div>
                <div className="duel-side enemy-side">
                    <AnimatedSprite src={villain.sprite} intensity={1.5} speed={1.9} state={enemyState} />
                </div>
            </div>
            {message && (
                // keyed on the text so each new message re-triggers the pop-in animation
                <div className="duel-message" key={message}>
                    <span>{message}</span>
                </div>
            )}
            <div className="duel-footer">
                <div className="fighter-info">
                    <span className="fighter-name">{player?.nickname ?? 'Hero'}</span>
                    <div className="hp-bar">
                        <div className="hp-fill player-fill" style={{ width: `${playerPct}%` }} />
                    </div>
                    <span className="hp-text">HP {Math.ceil(playerHp)}</span>
                </div>
                <div className="fighter-info enemy-info">
                    <span className="fighter-name">{villain.name}</span>
                    <div className="hp-bar">
                        <div className="hp-fill enemy-fill" style={{ width: `${enemyPct}%` }} />
                    </div>
                    <span className="hp-text">HP {Math.ceil(enemyHp)}</span>
                </div>
            </div>
        </div>
    )
}
