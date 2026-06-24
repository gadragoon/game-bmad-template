import { useRef } from 'react'
import type { PieceId, Position, PieceConfig } from '../types'
import { useGameDispatch } from '../state/GameContext'
import { positionToCoords } from '../board/gridUtils'
import ChaIcon from '../assets/svg/piece-cha.svg?react'
import MaIcon  from '../assets/svg/piece-ma.svg?react'
import PoIcon  from '../assets/svg/piece-po.svg?react'
import JolIcon from '../assets/svg/piece-jol.svg?react'
import styles from './Piece.module.css'

const SVG_MAP = {
  cha: ChaIcon,
  ma:  MaIcon,
  po:  PoIcon,
  jol: JolIcon,
} as const

type Props = {
  pieceId: PieceId
  position: Position
  config: PieceConfig  // Story 3.1에서 config.animation 사용 예정
  isSelected: boolean
}

function Piece({ pieceId, position, isSelected }: Props) {
  const pieceRef = useRef<SVGGElement>(null)  // Story 3.1: useGSAP({ scope: pieceRef })
  const dispatch = useGameDispatch()
  const { x, y } = positionToCoords(position)
  const SvgIcon = SVG_MAP[pieceId]

  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
    if (isSelected) {
      dispatch({ type: 'DESELECT_PIECE' })
    } else {
      dispatch({ type: 'SELECT_PIECE', id: pieceId })
    }
  }

  return (
    <g
      ref={pieceRef}
      className={`${styles.piece}${isSelected ? ` ${styles.selected}` : ''}`}
      transform={`translate(${x}, ${y})`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`기물 ${pieceId}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick(e)
        }
      }}
    >
      {/* 교점 기준 중앙 정렬: 60×60 SVG를 (-30,-30) 오프셋으로 배치 */}
      <SvgIcon x={-30} y={-30} width={60} height={60} />
    </g>
  )
}

export default Piece
