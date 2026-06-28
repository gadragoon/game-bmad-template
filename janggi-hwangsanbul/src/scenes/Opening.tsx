import { useGameDispatch } from '../state/GameContext'
import styles from './Scene.module.css'

export default function Opening() {
  const dispatch = useGameDispatch()
  return (
    <div data-scene="opening" className={styles.scene}>
      <p>[황산벌 오프닝 내레이션 자리 — Story 2.2에서 작성]</p>
      <button onClick={() => dispatch({ type: 'NEXT_SCENE' })}>계속하기</button>
    </div>
  )
}
