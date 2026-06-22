import { GameProvider } from './state/GameContext'
import Board from './board/Board'
import PiecesLayer from './board/PiecesLayer'
import styles from './App.module.css'

function App() {
  return (
    <GameProvider>
      <div className={styles.boardContainer}>
        <Board />
        <PiecesLayer />
      </div>
    </GameProvider>
  )
}

export default App
