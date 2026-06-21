import React from 'react'
import { BOARD } from '../constants'
import { CELL_SIZE, BOARD_PADDING } from './gridUtils'
import styles from './Board.module.css'

const viewBoxW = (BOARD.cols - 1) * CELL_SIZE + 2 * BOARD_PADDING
const viewBoxH = (BOARD.rows - 1) * CELL_SIZE + 2 * BOARD_PADDING

function Board() {
  return (
    <svg
      className={styles.board}
      viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="장기판"
    >
      <rect className={styles.background} width={viewBoxW} height={viewBoxH} />
      {Array.from({ length: BOARD.rows }, (_, row) => (
        <line
          key={`h-${row}`}
          className={styles.gridLine}
          x1={BOARD_PADDING}
          y1={BOARD_PADDING + row * CELL_SIZE}
          x2={BOARD_PADDING + (BOARD.cols - 1) * CELL_SIZE}
          y2={BOARD_PADDING + row * CELL_SIZE}
        />
      ))}
      {Array.from({ length: BOARD.cols }, (_, col) => (
        <line
          key={`v-${col}`}
          className={styles.gridLine}
          x1={BOARD_PADDING + col * CELL_SIZE}
          y1={BOARD_PADDING}
          x2={BOARD_PADDING + col * CELL_SIZE}
          y2={BOARD_PADDING + (BOARD.rows - 1) * CELL_SIZE}
        />
      ))}
    </svg>
  )
}

export default React.memo(Board)
