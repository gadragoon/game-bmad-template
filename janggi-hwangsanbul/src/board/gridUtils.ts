import type { Position, PieceId, Board } from '../types'

export const CELL_SIZE = 60     // SVG 좌표계 1칸 크기
export const BOARD_PADDING = 40 // 격자 외곽 여백

export function positionToCoords(pos: Position): { x: number; y: number } {
  return {
    x: BOARD_PADDING + pos.col * CELL_SIZE,
    y: BOARD_PADDING + pos.row * CELL_SIZE,
  }
}

export function findPiecePosition(pieceId: PieceId, board: Board): Position | null {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === pieceId) return { row, col }
    }
  }
  return null
}
