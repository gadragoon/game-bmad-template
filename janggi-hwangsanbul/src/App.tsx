import { GameProvider } from './state/GameContext'
import Board from './board/Board'

function App() {
  return (
    <GameProvider>
      <div id="app">
        <Board />
      </div>
    </GameProvider>
  )
}

export default App
