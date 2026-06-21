import { createContext, useContext, useReducer, type ReactNode } from 'react'
import { gameReducer, initialState } from './gameReducer'
import type { GameState, Action } from './gameTypes'

const GameStateCtx = createContext<GameState | null>(null)
const GameDispatchCtx = createContext<React.Dispatch<Action> | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  return (
    <GameStateCtx.Provider value={state}>
      <GameDispatchCtx.Provider value={dispatch}>
        {children}
      </GameDispatchCtx.Provider>
    </GameStateCtx.Provider>
  )
}

export function useGameState(): GameState {
  const ctx = useContext(GameStateCtx)
  if (!ctx) throw new Error('[GameContext] useGameState must be inside GameProvider')
  return ctx
}

export function useGameDispatch(): React.Dispatch<Action> {
  const ctx = useContext(GameDispatchCtx)
  if (!ctx) throw new Error('[GameContext] useGameDispatch must be inside GameProvider')
  return ctx
}
