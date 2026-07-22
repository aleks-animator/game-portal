import React, { useCallback, useEffect, useRef, useState } from "react"
import { type FruitName, fruitNames, fruitImages } from "../../assets/fruits"
import { getRandomItem } from "../../utils.ts"
import { usePlayerContext } from "../../context/PlayerContext.tsx"
import { useGameEnd } from "../../hooks/useGameEnd.ts"
import GameBoard from "../../components/GameBoard.tsx"
import { useStory, StorySlot } from "../stories/storyContext.tsx"
import { DuelStory } from "../stories/duel/DuelStory.tsx"
import { DUEL_CONFIG } from "../stories/duel/duelConfig.ts"
import { duelCover } from "../../assets/gamecovers/duel"
import { type FruitSnakeConfig, FRUIT_SNAKE_DUEL_CONFIG, DEATH_SHAKE_MS, WIN_CELEBRATE_MS } from "./gameConfig.ts"
import "./FruitSnake.scss"

type Cell = { x: number; y: number }
type Fruit = Cell & { fruit: FruitName }
type Dir = { x: number; y: number }

const DIRECTIONS: Record<string, Dir> = {
    ArrowUp: { x: 0, y: -1 }, KeyW: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 }, KeyS: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 }, KeyA: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }, KeyD: { x: 1, y: 0 },
}

const cellKey = (c: Cell) => `${c.x},${c.y}`

function FruitSnake({ config }: { config: FruitSnakeConfig }) {
    const { gameStatus, score, startGame: storyStartGame, emitQuality, isLocked, overlay, coverImage } = useStory()
    const { player } = usePlayerContext()

    // ── render state ──
    const [snake, setSnake] = useState<Cell[]>([])
    const [target, setTarget] = useState<Fruit | null>(null)
    const [obstacles, setObstacles] = useState<Fruit[]>([])
    const [collected, setCollected] = useState(0)
    const [round, setRound] = useState(0)
    const [isDying, setIsDying] = useState(false)
    const [isWinning, setIsWinning] = useState(false)

    // ── logic source of truth (read inside the timer loops, immune to stale closures) ──
    const snakeRef = useRef<Cell[]>([])
    const targetRef = useRef<Fruit | null>(null)
    const obstaclesRef = useRef<Fruit[]>([])
    const collectedRef = useRef(0)
    const roundRef = useRef(0)
    // the target fruit type is fixed for the whole round — you collect the same fruit 5×.
    // Only its position changes between collects; the type is chosen once in startRound.
    const roundFruitRef = useRef<FruitName>('apple')
    // buffered turns — up to 2 queued, committed one per step. Lets a fast two-key
    // combo (e.g. up then left) both register and turn over consecutive steps instead
    // of the second press stomping the first.
    const dirQueueRef = useRef<Dir[]>([])
    const lastDirRef = useRef<Dir>({ x: 1, y: 0 })    // direction of the last committed step
    const stepMsRef = useRef(config.initialStepMs)
    const spawnMsRef = useRef(config.initialSpawnMs)
    // true only while a round is actively being played — flipped false the instant an
    // outcome fires so an in-flight spawn tick can't act during the round transition
    const roundActiveRef = useRef(false)
    const moveTimerRef = useRef<ReturnType<typeof setTimeout>>()
    const spawnTimerRef = useRef<ReturnType<typeof setTimeout>>()

    useGameEnd("fruit-snake-duel", score, gameStatus)

    // difficulty for a given round index (round 0 = base, faster/denser as it climbs)
    function speedsForRound(r: number) {
        return {
            stepMs: Math.max(config.minStepMs, config.initialStepMs - r * config.stepDecrement),
            spawnMs: Math.max(config.minSpawnMs, config.initialSpawnMs - r * config.spawnDecrement),
        }
    }

    function isCorner(c: Cell): boolean {
        return (c.x === 0 || c.x === config.cols - 1) && (c.y === 0 || c.y === config.rows - 1)
    }

    // excludeCorners keeps the target out of the 4 corner cells — cornered there, the
    // snake only has two approach directions and can trap itself against the walls
    function randomFreeCell(occupied: Set<string>, excludeCorners = false): Cell | null {
        const free: Cell[] = []
        for (let y = 0; y < config.rows; y++) {
            for (let x = 0; x < config.cols; x++) {
                const cell = { x, y }
                if (occupied.has(cellKey(cell))) continue
                if (excludeCorners && isCorner(cell)) continue
                free.push(cell)
            }
        }
        return free.length ? free[Math.floor(Math.random() * free.length)] : null
    }

    function occupiedCells(): Set<string> {
        const set = new Set<string>()
        snakeRef.current.forEach(c => set.add(cellKey(c)))
        obstaclesRef.current.forEach(c => set.add(cellKey(c)))
        if (targetRef.current) set.add(cellKey(targetRef.current))
        return set
    }

    function spawnTarget() {
        const cell = randomFreeCell(occupiedCells(), true)
        if (!cell) return
        // reuse the round's fixed fruit — only the position is new
        const fruit: Fruit = { ...cell, fruit: roundFruitRef.current }
        targetRef.current = fruit
        setTarget(fruit)
    }

    // begin a fresh round: recentre the snake, clear the field, drop one target
    function startRound() {
        const r = roundRef.current
        const { stepMs, spawnMs } = speedsForRound(r)
        stepMsRef.current = stepMs
        spawnMsRef.current = spawnMs

        const midX = Math.floor(config.cols / 2)
        const midY = Math.floor(config.rows / 2)
        const body: Cell[] = []
        for (let i = 0; i < config.initialSnakeLength; i++) {
            body.push({ x: midX - i, y: midY }) // head first, tail extends left → moving right
        }
        snakeRef.current = body
        obstaclesRef.current = []
        targetRef.current = null
        roundFruitRef.current = getRandomItem(fruitNames)  // one fruit type for the whole round
        collectedRef.current = 0
        dirQueueRef.current = []
        lastDirRef.current = { x: 1, y: 0 }

        setSnake(body)
        setObstacles([])
        setCollected(0)
        setTarget(null)
        spawnTarget()

        roundActiveRef.current = true
    }

    // a round ended — tell the story, bump difficulty, deal a fresh round.
    // The move/spawn loops are gated on isLocked, so they stay paused through the
    // story's hit animation and only resume once it releases the lock.
    // On a death (wall/self/obstacle) the snake stays put and flashes red for
    // DEATH_SHAKE_MS before the board resets, so the hit actually reads as a hit.
    // On a win, it flashes yellow with a different (bounce, not shake) motion for
    // WIN_CELEBRATE_MS instead, so success reads distinctly from a death.
    function endRound(success: boolean) {
        if (!roundActiveRef.current) return
        roundActiveRef.current = false
        emitQuality(success ? config.successQuality : config.failQuality)
        roundRef.current += 1
        setRound(roundRef.current)
        if (success) {
            setIsWinning(true)
            setTimeout(() => {
                setIsWinning(false)
                startRound()
            }, WIN_CELEBRATE_MS)
        } else {
            setIsDying(true)
            setTimeout(() => {
                setIsDying(false)
                startRound()
            }, DEATH_SHAKE_MS)
        }
    }

    function step() {
        if (!roundActiveRef.current) return

        // pull the next buffered turn (one per step); with none queued, keep gliding straight
        const dir = dirQueueRef.current.shift() ?? lastDirRef.current
        lastDirRef.current = dir

        const body = snakeRef.current
        const head = body[0]
        const newHead: Cell = { x: head.x + dir.x, y: head.y + dir.y }

        // wall
        if (newHead.x < 0 || newHead.x >= config.cols || newHead.y < 0 || newHead.y >= config.rows) {
            endRound(false)
            return
        }
        // self — tail vacates this step (unless we grow), so it's not a collision
        const willGrow = !!targetRef.current && newHead.x === targetRef.current.x && newHead.y === targetRef.current.y
        const bodyToCheck = willGrow ? body : body.slice(0, -1)
        if (bodyToCheck.some(c => c.x === newHead.x && c.y === newHead.y)) {
            endRound(false)
            return
        }
        // wrong fruit (obstacle)
        if (obstaclesRef.current.some(o => o.x === newHead.x && o.y === newHead.y)) {
            endRound(false)
            return
        }

        if (willGrow) {
            const nextBody = [newHead, ...body] // keep tail → grow by one
            snakeRef.current = nextBody
            setSnake(nextBody)
            collectedRef.current += 1
            setCollected(collectedRef.current)
            targetRef.current = null
            setTarget(null)

            if (collectedRef.current >= config.targetGoal) {
                endRound(true)
                return
            }
            spawnTarget()
        } else {
            const nextBody = [newHead, ...body.slice(0, -1)] // move: add head, drop tail
            snakeRef.current = nextBody
            setSnake(nextBody)
        }
    }

    function spawnObstacle() {
        if (!roundActiveRef.current) return
        const cell = randomFreeCell(occupiedCells())
        if (!cell) return
        // never spawn an obstacle that looks like the round's target fruit — otherwise a
        // "safe-looking" fruit on the board is actually a kill. Filter against the round's
        // fixed type (not targetRef, which is briefly null between collects).
        const pool = fruitNames.filter(f => f !== roundFruitRef.current)
        const next = [...obstaclesRef.current, { ...cell, fruit: getRandomItem(pool) }]
        obstaclesRef.current = next
        setObstacles(next)
    }

    // ── the two game loops. Both self-reschedule and are torn down whenever the game
    // pauses (isLocked during the story's reveal/hit sequences) or stops. The `round`
    // dep restarts them with the new round's (faster) cadence. ──
    useEffect(() => {
        if (gameStatus !== "running") return
        if (isLocked) return

        function move() {
            step()
            moveTimerRef.current = setTimeout(move, stepMsRef.current)
        }
        function spawn() {
            spawnObstacle()
            spawnTimerRef.current = setTimeout(spawn, spawnMsRef.current)
        }
        moveTimerRef.current = setTimeout(move, stepMsRef.current)
        spawnTimerRef.current = setTimeout(spawn, spawnMsRef.current)

        return () => {
            clearTimeout(moveTimerRef.current)
            clearTimeout(spawnTimerRef.current)
        }
    }, [gameStatus, isLocked, round])

    // keyboard steering — queues a direction for the next step, never a direct reversal
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            const dir = DIRECTIONS[e.code]
            if (!dir) return
            e.preventDefault()
            const queue = dirQueueRef.current
            // validate against the last *queued* turn (or the last committed one if the
            // buffer is empty) — this is what lets a rapid up→left combo turn a clean
            // corner while still blocking a 180° reversal that would eat the snake
            const ref = queue.length ? queue[queue.length - 1] : lastDirRef.current
            if (dir.x === ref.x && dir.y === ref.y) return      // same direction — ignore
            if (dir.x === -ref.x && dir.y === -ref.y) return    // 180° reversal — blocked
            if (queue.length >= 2) return                       // buffer full
            queue.push(dir)
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [])

    function startGame() {
        roundRef.current = 0
        setRound(0)
        storyStartGame()
        startRound()
    }

    if (!player) return <p>Loading...</p>

    return (
        <GameBoard
            title="Fruit Snake: Duel"
            score={score}
            gameStatus={gameStatus}
            onStart={startGame}
            playerName={player.nickname}
            idleMessage="Collect the target fruit — dodge everything else!"
            startMessage="Arrow keys / WASD to steer. Grab 5 targets to strike!"
            overlay={overlay ?? undefined}
            coverImage={coverImage}
        >
            <div className="fruit-snake">
                <StorySlot targetSlot={null} />

                <div className="snake-hud">
                    <span className="hud-target">
                        Target: <strong>{target ? target.fruit : "—"}</strong>
                    </span>
                    <span className="hud-progress">{collected} / {config.targetGoal}</span>
                </div>

                <div
                    className={`snake-board${isDying ? " dying" : ""}${isWinning ? " winning" : ""}`}
                    style={{
                        "--cols": config.cols,
                        "--rows": config.rows,
                        pointerEvents: isLocked ? "none" : undefined,
                    } as React.CSSProperties}
                >
                    {Array.from({ length: config.rows * config.cols }, (_, i) => {
                        const x = i % config.cols
                        const y = Math.floor(i / config.cols)
                        const headIdx = snake.findIndex(c => c.x === x && c.y === y)
                        const isHead = headIdx === 0
                        const isBody = headIdx > 0
                        const targetHere = target && target.x === x && target.y === y ? target : null
                        const obstacleHere = obstacles.find(o => o.x === x && o.y === y)
                        const isSnakeDying = (isHead || isBody) && isDying
                        const isSnakeWinning = (isHead || isBody) && isWinning
                        return (
                            <div
                                key={i}
                                className={`snake-cell${isHead ? " head" : ""}${isBody ? " body" : ""}${isSnakeDying ? " dying" : ""}${isSnakeWinning ? " winning" : ""}`}
                            >
                                {targetHere && (
                                    <img className="cell-fruit target" src={fruitImages[targetHere.fruit]} alt={targetHere.fruit} />
                                )}
                                {obstacleHere && !targetHere && (
                                    <img className="cell-fruit obstacle" src={fruitImages[obstacleHere.fruit]} alt={obstacleHere.fruit} />
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </GameBoard>
    )
}

export default function FruitSnakeDuelGame() {
    return (
        <DuelStory config={DUEL_CONFIG} coverImage={duelCover}>
            <FruitSnake config={FRUIT_SNAKE_DUEL_CONFIG} />
        </DuelStory>
    )
}
