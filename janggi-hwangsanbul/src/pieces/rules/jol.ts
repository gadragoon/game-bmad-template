import type { Position, Board } from '../../types'
import { BOARD } from '../../constants'

export function getJolValidMoves(pos: Position, board: Board): Position[] {
  const candidates = [
    { row: pos.row + 1, col: pos.col },     // 전진 (후퇴 불가)
    { row: pos.row,     col: pos.col - 1 }, // 좌
    { row: pos.row,     col: pos.col + 1 }, // 우
  ]
  return candidates.filter(({ row, col }) =>
    row >= 0 && row < BOARD.rows &&
    col >= 0 && col < BOARD.cols &&
    board[row][col] === null
  )
}
