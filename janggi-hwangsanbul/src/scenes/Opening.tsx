import { useGameDispatch } from '../state/GameContext'
import { OPENING_NARRATION, SUMI_E_STYLE } from '../story/narration'
import styles from './Scene.module.css'

export default function Opening() {
  const dispatch = useGameDispatch()
  return (
    <div data-scene="opening" className={styles.scene}>
      <div
        data-scene-bg
        role="img"
        aria-label="황산벌 전장 배경"
        data-style-prompt={SUMI_E_STYLE.prompt}
        data-style-seed={SUMI_E_STYLE.seed}
        className={styles.sceneBackground}
      />
      <h1>{OPENING_NARRATION.title}</h1>
      {OPENING_NARRATION.paragraphs.map((paragraph, index) => (
        <p key={index} className={styles.narrationText}>{paragraph}</p>
      ))}
      <button onClick={() => dispatch({ type: 'NEXT_SCENE' })}>계속하기</button>
    </div>
  )
}
