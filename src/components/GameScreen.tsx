import { GameHeader } from './GameHeader'
import { Board } from './Board'
import { Toolbar } from './Toolbar'
import { NumberPad } from './NumberPad'
import { PauseOverlay } from './PauseOverlay'
import { WinModal } from './WinModal'
import { useGameTimer } from '../hooks/useGameTimer'

export function GameScreen() {
  useGameTimer()

  return (
    <div className="flex flex-1 flex-col justify-center gap-4 px-4 py-3 sm:gap-5">
      <GameHeader />
      <Board />
      <Toolbar />
      <NumberPad />
      <PauseOverlay />
      <WinModal />
    </div>
  )
}
