import styles from '../scenes/Scene.module.css'

type Props = {
  text: string
  onContinue: () => void
}

export default function DialogueBox({ text, onContinue }: Props) {
  return (
    <div data-dialogue>
      <p className={styles.narrationText}>{text}</p>
      <button onClick={onContinue}>계속하기</button>
    </div>
  )
}
