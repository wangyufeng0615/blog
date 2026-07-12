export type BallShape = 'sphere' | 'roundedCube'
export type SelectionState = 'none' | 'explicit' | 'implicit'

export interface GameSnapshot {
  ready: boolean
  playerName: string
  score: number
  elapsedSeconds: number
  ballCount: number
  paused: boolean
  started: boolean
  speed: number
  selectedValue: number | null
  status: 'idle' | 'playing' | 'won'
}

export interface SavedBall {
  id: number
  value: number
  shape: BallShape
  size: number
  selection: SelectionState
  position: [number, number, number]
  velocity: [number, number, number]
}

export interface SaveGameV1 {
  version: 1
  playerName: string
  score: number
  elapsedSeconds: number
  speed: number
  paused: boolean
  nextBallId: number
  balls: SavedBall[]
}

export type GameEvent =
  | { type: 'notice'; message: string; tone?: 'info' | 'success' | 'danger' }
  | { type: 'won'; reason: string; elapsedSeconds: number }
