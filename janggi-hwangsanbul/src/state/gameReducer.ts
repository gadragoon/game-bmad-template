import type { GameState, Action, Scene } from './gameTypes'

export const SCENE_ORDER: readonly Scene[] = [
  'opening', 'cha', 'ma', 'po', 'jol', 'ending',
] as const

const NARRATIVE_SCENES = new Set<Scene>(['opening', 'ending'])

export const initialState: GameState = {
  scene: 'opening',
  phase: null,
  selectedPiece: null,
  completedPieces: new Set(),
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
    case 'MOVE_PIECE':
      return { ...state, selectedPiece: null }
    case 'COMPLETE_PIECE':
      return { ...state, completedPieces: new Set([...state.completedPieces, action.id]) }
    default:
      return state
  }
}
