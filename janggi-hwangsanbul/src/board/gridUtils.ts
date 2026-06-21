import type { Position } from '../types'

export const CELL_SIZE = 60     // SVG 좌표계 1칸 크기
export const BOARD_PADDING = 40 // 격자 외곽 여백

export function positionToCoords(pos: Position): { x: number; y: number } {
  return {
    x: BOARD_PADDING + pos.col * CELL_SIZE,
    y: BOARD_PADDING + pos.row * CELL_SIZE,
  }
}
