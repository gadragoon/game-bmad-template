import type { AudioKey } from './audio/audioKeys'

export type PieceId = 'cha' | 'ma' | 'po' | 'jol'

export type Position = { col: number; row: number }
// col: 0–8 (좌→우), row: 0–9 (상→하)

export type Board = (PieceId | null)[][]
// board[row][col] — 10행 × 9열

export type AnimationSpec = {
  duration: number
  ease: 'ease-in' | 'ease-out' | 'linear'
}

export type PieceConfig = {
  id: PieceId
  symbol: string
  animation: AnimationSpec
  sound: AudioKey
  moves: (pos: Position, board: Board) => Position[]
}

export type ChapterConfig = Record<PieceId, PieceConfig>
