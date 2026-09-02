import { useGameStore } from './store/gameStore'
import { MainMenu } from './components/MainMenu'
import { GameScreen } from './components/GameScreen'

function App() {
  const status = useGameStore((s) => s.status)

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
      {status === 'menu' ? <MainMenu /> : <GameScreen />}
    </div>
  )
}

export default App
