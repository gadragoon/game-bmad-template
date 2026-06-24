import { useMemo } from 'react'
import { useGameState, useGameDispatch } from '../state/GameContext'
import { GYEBAEK_CHAPTER } from '../pieces/config/gyebaekChapter'
import { getValidMoves } from '../pieces/rules/ruleEngine'
import Piece from '../pieces/Piece'
import { BOARD } from '../constants'
import { CELL_SIZE, BOARD_PADDING, positionToCoords } from './gridUtils'
import type { PieceId, Position } from '../types'
import styles from './PiecesLayer.module.css'

const VIEWBOX_W = (BOARD.cols - 1) * CELL_SIZE + 2 * BOARD_PADDING  // 560
const VIEWBOX_H = (BOARD.rows - 1) * CELL_SIZE + 2 * BOARD_PADDING  // 620
const HINT_RADIUS = 22

export default function PiecesLayer() {
  const { board, selectedPiece } = useGameState()
  const dispatch = useGameDispatch()

  const pieces: { pieceId: PieceId; position: Position }[] = []
  board.forEach((row, rowIdx) => {
    row.forEach((cell, colIdx) => {
      if (cell !== null) {
        pieces.push({ pieceId: cell, position: { col: colIdx, row: rowIdx } })
      }
    })
  })

  const validMoves = useMemo(() => {
    if (!selectedPiece) return []
    for (let r = 0; r < BOARD.rows; r++) {
      for (let c = 0; c < BOARD.cols; c++) {
        if (board[r][c] === selectedPiece) {
          return getValidMoves(selectedPiece, { row: r, col: c }, board)
        }
      }
    }
    return []
  }, [selectedPiece, board])

  return (
    <svg
      className={styles.piecesLayer}
      viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* z-order 1: 배경 rect — 빈 칸 클릭 시 DESELECT (가장 아래) */}
      <rect
        width={VIEWBOX_W}
        height={VIEWBOX_H}
        fill="rgba(0,0,0,0)"
        className={styles.deselectRect}
        aria-hidden="true"
        onClick={() => { if (selectedPiece) dispatch({ type: 'DESELECT_PIECE' }) }}
      />
      {/* z-order 2: 힌트 원 — 유효 이동 칸 (rect 위, 기물 아래) */}
      {validMoves.map((pos) => {
        const { x, y } = positionToCoords(pos)
        return (
          <circle
            key={`hint-${pos.row}-${pos.col}`}
            cx={x}
            cy={y}
            r={HINT_RADIUS}
            className={styles.hintCircle}
            role="button"
            aria-label={`(${pos.row}, ${pos.col})로 이동`}
            onClick={(e) => {
              e.stopPropagation()
              dispatch({ type: 'MOVE_PIECE', to: pos })
            }}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                e.stopPropagation()
                dispatch({ type: 'MOVE_PIECE', to: pos })
              }
            }}
          />
        )
      })}
      {/* z-order 3: 기물 — 클릭 시 SELECT/DESELECT (가장 위) */}
      {pieces.map(({ pieceId, position }) => (
        <Piece
          key={pieceId}
          pieceId={pieceId}
          position={position}
          config={GYEBAEK_CHAPTER[pieceId]}
          isSelected={selectedPiece === pieceId}
        />
      ))}
    </svg>
  )
}
