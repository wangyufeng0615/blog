import { useCallback, useEffect, useRef, useState } from 'react'
import { GameEngine } from '../engine/GameEngine'
import type { GameEvent, GameSnapshot } from '../game/types'
import {
  ClockIcon,
  LoadIcon,
  OrbIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  SaveIcon,
  ScoreIcon,
  TrashIcon,
  UserIcon,
} from './icons'

const INITIAL_SNAPSHOT: GameSnapshot = {
  ready: false,
  playerName: 'PLAYER',
  score: 0,
  elapsedSeconds: 0,
  ballCount: 0,
  paused: false,
  started: false,
  speed: 1,
  selectedValue: null,
  status: 'idle',
}

interface NoticeState {
  id: number
  message: string
  tone: 'info' | 'success' | 'danger'
}

interface WinState {
  reason: string
  elapsedSeconds: number
}

function formatTime(totalSeconds: number): string {
  const seconds = Math.floor(totalSeconds)
  const minutes = Math.floor(seconds / 60)
  return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
}

export function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const engineRef = useRef<GameEngine | null>(null)
  const noticeTimerRef = useRef<number | null>(null)
  const [snapshot, setSnapshot] = useState<GameSnapshot>(INITIAL_SNAPSHOT)
  const [playerName, setPlayerName] = useState('PLAYER')
  const [showIntro, setShowIntro] = useState(true)
  const [notice, setNotice] = useState<NoticeState | null>(null)
  const [win, setWin] = useState<WinState | null>(null)

  const handleGameEvent = useCallback((event: GameEvent) => {
    if (event.type === 'won') {
      setWin({ reason: event.reason, elapsedSeconds: event.elapsedSeconds })
      return
    }

    if (noticeTimerRef.current !== null) window.clearTimeout(noticeTimerRef.current)
    setNotice({ id: Date.now(), message: event.message, tone: event.tone ?? 'info' })
    noticeTimerRef.current = window.setTimeout(() => setNotice(null), 2200)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const engine = new GameEngine(canvas, setSnapshot, handleGameEvent)
    engineRef.current = engine

    return () => {
      engine.destroy()
      engineRef.current = null
      if (noticeTimerRef.current !== null) window.clearTimeout(noticeTimerRef.current)
    }
  }, [handleGameEvent])

  const startGame = () => {
    const name = playerName.trim() || 'PLAYER'
    setPlayerName(name)
    engineRef.current?.start(name)
    setShowIntro(false)
  }

  const restartGame = () => {
    engineRef.current?.restart()
    setWin(null)
  }

  const controlsDisabled = !snapshot.ready || snapshot.status === 'idle'
  const actionDisabled = controlsDisabled || snapshot.paused || snapshot.status === 'won'

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <section className="cabinet" aria-label="小球移动重置版 3D 游戏">
        <aside className="left-rail">
          <header className="brand">
            <div className="brand-mark" aria-hidden="true"><span /></div>
            <div>
              <h1>小球移动重置版</h1>
              <p>by GPT-5.6 Sol</p>
            </div>
          </header>

          <div className="hud" aria-label="游戏信息">
            <HudItem icon={<UserIcon />} label="玩家" value={snapshot.playerName} tone="cyan" compact />
            <HudItem icon={<ScoreIcon />} label="得分" value={String(snapshot.score)} tone="amber" />
            <HudItem icon={<ClockIcon />} label="时间" value={formatTime(snapshot.elapsedSeconds)} tone="cyan" />
            <HudItem icon={<OrbIcon />} label="小球" value={String(snapshot.ballCount)} tone="pink" />
          </div>

          <div className="legacy-plate" aria-label="版本信息">
            <span>2015</span>
            <i />
            <span>2026</span>
            <small>GPT-5.6 SOL EDITION</small>
          </div>
        </aside>

        <section className="arena-column">
          <div className="arena-frame">
            <div className="corner corner-tl" />
            <div className="corner corner-tr" />
            <div className="corner corner-bl" />
            <div className="corner corner-br" />
            <canvas ref={canvasRef} className="game-canvas" aria-label="3D 小球竞技场" />

            {snapshot.ready && snapshot.status === 'playing' && snapshot.ballCount === 0 && !showIntro ? (
              <div className="empty-prompt" aria-live="polite">
                <span className="empty-orbit" />
                <strong>竞技场待命</strong>
                <small>点击“添加”生成第一个小球</small>
              </div>
            ) : null}

            {snapshot.paused && snapshot.status !== 'won' ? (
              <div className="pause-overlay" aria-live="polite">
                <PauseIcon />
                <strong>时间暂停</strong>
              </div>
            ) : null}

            <div className="arena-status">
              <span className={`status-dot ${snapshot.paused ? 'paused' : ''}`} />
              <span>{snapshot.paused ? 'SIMULATION PAUSED' : 'RAPIER PHYSICS ONLINE'}</span>
              <span className="arena-status-spacer" />
              <span>{snapshot.selectedValue === null ? 'NO TARGET' : `TARGET ${snapshot.selectedValue}`}</span>
            </div>
          </div>

          <footer className="rule-strip">
            <span className="info-icon">i</span>
            <span>点选小球，再删除得分</span>
            <i />
            <span>点空白处扣 1–3 分</span>
            <i />
            <span>正好 50 分即可获胜</span>
          </footer>
        </section>

        <aside className="right-rail" aria-label="游戏控制">
          <div className="rail-heading"><span />控制台<span /></div>
          <div className="controls">
            <ControlButton
              icon={<PlusIcon />}
              label="添加"
              tone="cyan"
              disabled={actionDisabled}
              onClick={() => engineRef.current?.addBall()}
            />
            <ControlButton
              icon={<TrashIcon />}
              label="删除"
              tone="pink"
              disabled={actionDisabled || snapshot.ballCount === 0}
              onClick={() => engineRef.current?.deleteSelected()}
            />
            <ControlButton
              icon={snapshot.paused ? <PlayIcon /> : <PauseIcon />}
              label={snapshot.paused ? '继续' : '暂停'}
              tone="amber"
              disabled={controlsDisabled || !snapshot.started || snapshot.status === 'won'}
              onClick={() => engineRef.current?.togglePause()}
            />
            <ControlButton
              icon={<SaveIcon />}
              label="存档"
              tone="cyan"
              disabled={controlsDisabled}
              onClick={() => engineRef.current?.save()}
            />
            <ControlButton
              icon={<LoadIcon />}
              label="读档"
              tone="cyan"
              disabled={controlsDisabled}
              onClick={() => engineRef.current?.load()}
            />
          </div>

          <div className="speed-panel">
            <div className="speed-title"><span>速度</span><small>VELOCITY</small></div>
            <div className="speed-controls">
              <button
                type="button"
                aria-label="降低速度"
                disabled={actionDisabled || snapshot.speed <= 0.65}
                onClick={() => engineRef.current?.changeSpeed(-1)}
              >−</button>
              <strong>{snapshot.speed.toFixed(2)}×</strong>
              <button
                type="button"
                aria-label="提高速度"
                disabled={actionDisabled || snapshot.speed >= 1.4}
                onClick={() => engineRef.current?.changeSpeed(1)}
              >＋</button>
            </div>
          </div>

          <div className="vent" aria-hidden="true">
            {Array.from({ length: 6 }, (_, index) => <span key={index} />)}
          </div>
        </aside>
      </section>

      {showIntro ? (
        <div className="modal-backdrop">
          <section className="intro-modal" role="dialog" aria-modal="true" aria-labelledby="intro-title">
            <div className="intro-copy">
              <p className="modal-year">2015 / 2026</p>
              <h2 id="intro-title">小球移动重置版</h2>
              <p className="modal-copy">欢迎回来，玩家。熟悉的规则，现在有了新的物理世界。</p>
              <p className="creator-credit">by GPT-5.6 Sol</p>

              <div className="rule-list">
                <div><b>01</b><span>添加随机分值的小球或方块</span></div>
                <div><b>02</b><span>点选目标，再按删除累加分数</span></div>
                <div><b>03</b><span>正好 50 分，或分数等于球数 × 20 时获胜</span></div>
              </div>

              <label className="name-field">
                <span>玩家代号</span>
                <input
                  value={playerName}
                  maxLength={16}
                  autoFocus
                  onChange={(event) => setPlayerName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && snapshot.ready) startGame()
                  }}
                />
              </label>
              <button className="start-button" type="button" disabled={!snapshot.ready} onClick={startGame}>
                <span>{snapshot.ready ? '进入竞技场' : '正在启动物理引擎'}</span>
                <i>→</i>
              </button>
            </div>

            <figure className="original-preview">
              <div className="original-image-frame">
                <img src={`${import.meta.env.BASE_URL}assets/original-game.png`} alt="2015 年原版小球移动游戏画面" />
              </div>
              <figcaption>原版画面 · 2015</figcaption>
            </figure>
          </section>
        </div>
      ) : null}

      {win ? (
        <div className="modal-backdrop win-backdrop">
          <section className="win-modal" role="dialog" aria-modal="true" aria-labelledby="win-title">
            <div className="win-halo" />
            <span className="win-kicker">CHALLENGE COMPLETE</span>
            <h2 id="win-title">你赢了</h2>
            <p>{win.reason}</p>
            <div className="win-stats">
              <div><small>最终得分</small><strong>{snapshot.score}</strong></div>
              <div><small>完成用时</small><strong>{formatTime(win.elapsedSeconds)}</strong></div>
            </div>
            <button type="button" className="start-button" onClick={restartGame}><span>再来一局</span><i>↻</i></button>
          </section>
        </div>
      ) : null}

      {notice ? (
        <div key={notice.id} className={`toast toast-${notice.tone}`} role="status">
          <span />{notice.message}
        </div>
      ) : null}
    </main>
  )
}

interface HudItemProps {
  icon: React.ReactNode
  label: string
  value: string
  tone: 'cyan' | 'amber' | 'pink'
  compact?: boolean
}

function HudItem({ icon, label, value, tone, compact = false }: HudItemProps) {
  return (
    <div className={`hud-item hud-${tone} ${compact ? 'hud-compact' : ''}`}>
      <div className="hud-label">{icon}<span>{label}</span></div>
      <strong title={value}>{value}</strong>
    </div>
  )
}

interface ControlButtonProps {
  icon: React.ReactNode
  label: string
  tone: 'cyan' | 'pink' | 'amber'
  disabled: boolean
  onClick: () => void
}

function ControlButton({ icon, label, tone, disabled, onClick }: ControlButtonProps) {
  return (
    <button type="button" className={`control-button control-${tone}`} disabled={disabled} onClick={onClick}>
      {icon}<span>{label}</span>
    </button>
  )
}
