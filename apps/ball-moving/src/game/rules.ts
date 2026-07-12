export const GAME_RULES = {
  targetScore: 50,
  remainingBallMultiplier: 20,
  missPenaltyMin: 1,
  missPenaltyMax: 3,
  valueMin: 1,
  valueMax: 9,
  speedLevels: [0.65, 0.8, 1, 1.2, 1.4] as const,
} as const

export function randomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getWinReason(score: number, remainingBalls: number): string | null {
  if (score === GAME_RULES.targetScore) {
    return '分数正好定格在 50 分'
  }

  if (
    remainingBalls > 0 &&
    score === remainingBalls * GAME_RULES.remainingBallMultiplier
  ) {
    return `分数等于剩余 ${remainingBalls} 个球的 20 倍`
  }

  return null
}
