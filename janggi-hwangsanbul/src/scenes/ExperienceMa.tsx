import Board from '../board/Board'
import PiecesLayer from '../board/PiecesLayer'
import { useGameState, useGameDispatch } from '../state/GameContext'
import styles from './Scene.module.css'

export default function ExperienceMa() {
  const { phase } = useGameState()
  const dispatch = useGameDispatch()
  return (
    <div data-scene="ma" data-phase={phase ?? undefined} className={styles.scene}>
      <div className={styles.boardContainer}>
        <Board />
        <PiecesLayer />
      </div>
      {/* Story 2.4에서 intro/demo/play/dialogue 컨텐츠 추가 */}
      <button onClick={() => dispatch({ type: 'NEXT_SCENE' })}>계속하기</button>
    </div>
  )
}
