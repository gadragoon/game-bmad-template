import type { Position, Board } from '../../types'
import { BOARD } from '../../constants'

const DIRECTIONS = [
  { dr: -1, dc:  0 }, // 상
  { dr: +1, dc:  0 }, // 하
  { dr:  0, dc: -1 }, // 좌
  { dr:  0, dc: +1 }, // 우
] as const

export function getPoValidMoves(pos: Position, board: Board): Position[] {
  const result: Position[] = []

  for (const { dr, dc } of DIRECTIONS) {
    // Phase 1: cannon platform 탐색 (포의 경유 기물)
    let r = pos.row + dr
    let c = pos.col + dc
    let platformFound = false

    // 주의: 실제 장기에서 포는 포를 경유 기물로 사용 불가.
    // 단일 Po POC 제약으로 기물 타입 검사 없이 구현함 — 다중 Po 확장 시 재검토 필요.
    while (r >= 0 && r < BOARD.rows && c >= 0 && c < BOARD.cols) {
      if (board[r][c] !== null) {
        platformFound = true
        r += dr
        c += dc
        break
      }
      r += dr
      c += dc
    }

    if (!platformFound) continue

    // Phase 2: 경유 기물 이후 목적지 수집
    while (r >= 0 && r < BOARD.rows && c >= 0 && c < BOARD.cols) {
      if (board[r][c] !== null) break  // 단일 팀 POC + 포끼리 포획 불가
      result.push({ row: r, col: c })
      r += dr
      c += dc
    }
  }

  return result
}
