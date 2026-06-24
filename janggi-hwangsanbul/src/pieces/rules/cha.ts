import type { Position, Board } from '../../types'
import { BOARD } from '../../constants'

const DIRECTIONS = [
  { dr: 0, dc: 1 },   // 우
  { dr: 0, dc: -1 },  // 좌
  { dr: 1, dc: 0 },   // 하
  { dr: -1, dc: 0 },  // 상
] as const

export function getChaValidMoves(pos: Position, board: Board): Position[] {
  const result: Position[] = []
  for (const { dr, dc } of DIRECTIONS) {
    let r = pos.row + dr
    let c = pos.col + dc
    while (r >= 0 && r < BOARD.rows && c >= 0 && c < BOARD.cols) {
      if (board[r][c] !== null) break
      result.push({ row: r, col: c })
      r += dr
      c += dc
    }
  }
  return result
}
