import type { Position, Board } from '../../types'
import { BOARD } from '../../constants'

// 각 직교 방향과 해당 방향에서 Ma가 도달 가능한 2개 목적지 오프셋
const MA_STEPS: Array<{
  block: { dr: number; dc: number }
  targets: Array<{ dr: number; dc: number }>
}> = [
  { block: { dr: -1, dc:  0 }, targets: [{ dr: -2, dc: -1 }, { dr: -2, dc: +1 }] }, // 상
  { block: { dr: +1, dc:  0 }, targets: [{ dr: +2, dc: -1 }, { dr: +2, dc: +1 }] }, // 하
  { block: { dr:  0, dc: -1 }, targets: [{ dr: -1, dc: -2 }, { dr: +1, dc: -2 }] }, // 좌
  { block: { dr:  0, dc: +1 }, targets: [{ dr: -1, dc: +2 }, { dr: +1, dc: +2 }] }, // 우
]

export function getMaValidMoves(pos: Position, board: Board): Position[] {
  const result: Position[] = []
  for (const { block, targets } of MA_STEPS) {
    const br = pos.row + block.dr
    const bc = pos.col + block.dc
    // 인접 칸이 보드 안에 있고 기물이 있으면 → 막힘, 이 방향 skip
    if (br >= 0 && br < BOARD.rows && bc >= 0 && bc < BOARD.cols && board[br][bc] !== null) {
      continue
    }
    for (const { dr, dc } of targets) {
      const tr = pos.row + dr
      const tc = pos.col + dc
      if (tr < 0 || tr >= BOARD.rows || tc < 0 || tc >= BOARD.cols) continue
      if (board[tr][tc] !== null) continue  // 단일 팀 POC — 목적지 기물 있으면 제외
      result.push({ row: tr, col: tc })
    }
  }
  return result
}
