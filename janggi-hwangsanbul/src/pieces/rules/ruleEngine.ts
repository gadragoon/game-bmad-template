import type { PieceId, Position, Board } from '../../types'
import { getChaValidMoves } from './cha'
import { getMaValidMoves } from './ma'
import { getPoValidMoves } from './po'
import { getJolValidMoves } from './jol'

const RULE_MAP: Record<PieceId, (pos: Position, board: Board) => Position[]> = {
  cha: getChaValidMoves,
  ma: getMaValidMoves,
  po: getPoValidMoves,
  jol: getJolValidMoves,
}

export function getValidMoves(pieceId: PieceId, pos: Position, board: Board): Position[] {
  return RULE_MAP[pieceId](pos, board)
}
