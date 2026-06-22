import type { PieceId, AnimationSpec, Position } from './types'

// GDD 명세 숫자값은 이 파일에서만 정의한다 — 매직 넘버 금지
export const BOARD = { cols: 9, rows: 10 } as const

export const PIECE_ANIMATION = {
  cha: { duration: 500, ease: 'ease-in'  as const },
  ma:  { duration: 300, ease: 'ease-out' as const },
  po:  { duration: 150, ease: 'linear'   as const },
  jol: { duration: 400, ease: 'ease-in'  as const },
} satisfies Record<PieceId, AnimationSpec>

// 기물 초기 배치 좌표 — col: 0–8, row: 0–9 (board[row][col])
// po(4,2) → jol(4,5) → 착지(4,6~9): Story 1.7/2.4 포 점프 데모 가능한 배치
export const INITIAL_POSITIONS: Record<PieceId, Position> = {
  cha: { col: 0, row: 5 },  // 좌측 중단 — 차: 가로/세로 이동 공간 충분
  ma:  { col: 2, row: 7 },  // 좌측 하단 — 마: L자 이동 여유 공간
  po:  { col: 4, row: 2 },  // 중앙 상단 — 포: col 4에서 졸 넘어 착지 가능
  jol: { col: 4, row: 5 },  // 중앙       — 졸: 포의 경유 기물, 전진/횡보 가능
}
