import { GameProvider } from './state/GameContext'
import { useGameState } from './state/GameContext'
import Opening from './scenes/Opening'
import ExperienceCha from './scenes/ExperienceCha'
import ExperienceMa from './scenes/ExperienceMa'
import ExperiencePo from './scenes/ExperiencePo'
import ExperienceJol from './scenes/ExperienceJol'
import Ending from './scenes/Ending'

function SceneRouter() {
  const { scene } = useGameState()
  switch (scene) {
    case 'opening': return <Opening />
    case 'cha':     return <ExperienceCha />
    case 'ma':      return <ExperienceMa />
    case 'po':      return <ExperiencePo />
    case 'jol':     return <ExperienceJol />
    case 'ending':  return <Ending />
    default:        return null
  }
}

function App() {
  return (
    <GameProvider>
      <SceneRouter />
    </GameProvider>
  )
}

export default App
