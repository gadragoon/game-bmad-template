import styles from './Scene.module.css'

export default function Ending() {
  return (
    <div data-scene="ending" className={styles.scene}>
      <p>[황산벌 결말 내레이션 자리 — Story 2.7에서 작성]</p>
      {/* 계속하기 버튼 없음 — AC4: ending은 게임 종료 */}
    </div>
  )
}
