import type { PieceId, Position, Board } from '../types'

export type Scene = 'opening' | 'cha' | 'ma' | 'po' | 'jol' | 'ending'
export type ExperiencePhase = 'intro' | 'demo' | 'play' | 'dialogue'

export type GameState = {
  scene: Scene
  phase: ExperiencePhase | null
  selectedPiece: PieceId | null
  completedPieces: Set<PieceId>
  board: Board  // (PieceId | null)[][] — 10행×9열, board[row][col]
}

export type Action =
  | { type: 'NEXT_SCENE' }
  | { type: 'SET_PHASE'; phase: ExperiencePhase }
  | { type: 'SELECT_PIECE'; id: PieceId }
  | { type: 'DESELECT_PIECE' }
  | { type: 'MOVE_PIECE'; to: Position }
  | { type: 'COMPLETE_PIECE'; id: PieceId }
