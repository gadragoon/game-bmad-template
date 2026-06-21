import type { PieceId, AnimationSpec } from './types'

// GDD 명세 숫자값은 이 파일에서만 정의한다 — 매직 넘버 금지
export const BOARD = { cols: 9, rows: 10 } as const

export const PIECE_ANIMATION = {
  cha: { duration: 500, ease: 'ease-in'  as const },
  ma:  { duration: 300, ease: 'ease-out' as const },
  po:  { duration: 150, ease: 'linear'   as const },
  jol: { duration: 400, ease: 'ease-in'  as const },
} satisfies Record<PieceId, AnimationSpec>
