import type { GameState, Action, Scene } from './gameTypes'
import type { Board, PieceId, Position } from '../types'
import { INITIAL_POSITIONS, BOARD } from '../constants'
import { getValidMoves } from '../pieces/rules/ruleEngine'

export const SCENE_ORDER: readonly Scene[] = [
  'opening', 'cha', 'ma', 'po', 'jol', 'ending',
] as const

const NARRATIVE_SCENES = new Set<Scene>(['opening', 'ending'])

function createInitialBoard(): Board {
  const board: Board = Array.from(
    { length: BOARD.rows },
    () => Array<PieceId | null>(BOARD.cols).fill(null)
  )
  for (const [id, pos] of Object.entries(INITIAL_POSITIONS) as [PieceId, Position][]) {
    board[pos.row][pos.col] = id
  }
  return board
}

export const initialState: GameState = {
  scene: 'opening',
  phase: null,
  selectedPiece: null,
  completedPieces: new Set(),
  board: createInitialBoard(),
}

export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'NEXT_SCENE': {
      const idx = SCENE_ORDER.indexOf(state.scene)
      if (idx === SCENE_ORDER.length - 1) return state
      const next = SCENE_ORDER[idx + 1]
      return {
        ...state,
        scene: next,
        phase: NARRATIVE_SCENES.has(next) ? null : 'intro',
        selectedPiece: null,
      }
    }
    case 'SET_PHASE':
      return { ...state, phase: action.phase }
    case 'SELECT_PIECE':
      return { ...state, selectedPiece: action.id }
    case 'DESELECT_PIECE':
      return { ...state, selectedPiece: null }
    case 'MOVE_PIECE': {
      if (!state.selectedPiece) return state
      if (action.to.row < 0 || action.to.row >= BOARD.rows ||
          action.to.col < 0 || action.to.col >= BOARD.cols) return state
      // 현재 위치 탐색
      let currentPos: Position | null = null
      outer: for (let r = 0; r < BOARD.rows; r++) {
        for (let c = 0; c < BOARD.cols; c++) {
          if (state.board[r][c] === state.selectedPiece) {
            currentPos = { row: r, col: c }
            break outer
          }
        }
      }
      if (!currentPos) return state
      // 룰 엔진 검증 — 불법 이동 무시
      const valid = getValidMoves(state.selectedPiece, currentPos, state.board)
      const isLegal = valid.some(p => p.row === action.to.row && p.col === action.to.col)
      if (!isLegal) return state
      const nextBoard = state.board.map(row => [...row]) as Board
      nextBoard[currentPos.row][currentPos.col] = null
      nextBoard[action.to.row][action.to.col] = state.selectedPiece
      return { ...state, selectedPiece: null, board: nextBoard }
    }
    case 'COMPLETE_PIECE':
      return { ...state, completedPieces: new Set([...state.completedPieces, action.id]) }
    default:
      return state
  }
}
