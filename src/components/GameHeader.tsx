import { useGameStore } from '../store/gameStore'
import { formatTime } from '../hooks/useGameTimer'
import { DIFFICULTIES } from '../engine/sudoku'
import { BackIcon, PauseIcon, TimerIcon } from './icons'

export function GameHeader() {
  const difficulty = useGameStore((s) => s.difficulty)
  const elapsedSec = useGameStore((s) => s.elapsedSec)
  const mistakes = useGameStore((s) => s.mistakes)
  const pause = useGameStore((s) => s.pause)
  const backToMenu = useGameStore((s) => s.backToMenu)

  return (
    <div className="mx-auto flex w-full max-w-[min(92vw,520px)] items-center justify-between px-1 py-2">
      <button
        type="button"
        onClick={backToMenu}
        aria-label="Volver al menú"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-800/70 text-ink-300 transition hover:text-ink-100 active:scale-95"
      >
        <BackIcon width={18} height={18} />
      </button>

      <div className="flex flex-col items-center">
        <span className="font-display text-sm font-bold tracking-wide text-ink-100">
          {DIFFICULTIES[difficulty].label}
        </span>
        <span className="text-[11px] text-ink-500">
          {mistakes} {mistakes === 1 ? 'error' : 'errores'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-full bg-bg-800/70 px-3 py-1.5 text-sm font-semibold text-ink-100 tabular-nums">
          <TimerIcon width={16} height={16} className="text-brand-400" />
          {formatTime(elapsedSec)}
        </div>
        <button
          type="button"
          onClick={pause}
          aria-label="Pausar"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-800/70 text-ink-300 transition hover:text-ink-100 active:scale-95"
        >
          <PauseIcon width={16} height={16} />
        </button>
      </div>
    </div>
  )
}
