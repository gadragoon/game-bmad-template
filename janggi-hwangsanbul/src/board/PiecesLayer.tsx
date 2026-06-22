import { useGameState } from '../state/GameContext'
import { GYEBAEK_CHAPTER } from '../pieces/config/gyebaekChapter'
import Piece from '../pieces/Piece'
import { BOARD } from '../constants'
import { CELL_SIZE, BOARD_PADDING } from './gridUtils'
import type { PieceId, Position } from '../types'
import styles from './PiecesLayer.module.css'

const VIEWBOX_W = (BOARD.cols - 1) * CELL_SIZE + 2 * BOARD_PADDING  // 560
const VIEWBOX_H = (BOARD.rows - 1) * CELL_SIZE + 2 * BOARD_PADDING  // 620

export default function PiecesLayer() {
  const { board } = useGameState()

  const pieces: { pieceId: PieceId; position: Position }[] = []
  board.forEach((row, rowIdx) => {
    row.forEach((cell, colIdx) => {
      if (cell !== null) {
        pieces.push({ pieceId: cell, position: { col: colIdx, row: rowIdx } })
      }
    })
  })

  return (
    <svg
      className={styles.piecesLayer}
      viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {pieces.map(({ pieceId, position }) => (
        <Piece
          key={pieceId}
          pieceId={pieceId}
          position={position}
          config={GYEBAEK_CHAPTER[pieceId]}
        />
      ))}
    </svg>
  )
}
