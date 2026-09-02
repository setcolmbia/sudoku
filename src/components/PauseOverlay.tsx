import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { DIFFICULTIES } from '../engine/sudoku'
import { PauseIcon, PlayIcon } from './icons'

export function PauseOverlay() {
  const status = useGameStore((s) => s.status)
  const resume = useGameStore((s) => s.resume)
  const backToMenu = useGameStore((s) => s.backToMenu)
  const newGame = useGameStore((s) => s.newGame)
  const difficulty = useGameStore((s) => s.difficulty)

  const open = status === 'paused'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-bg-950/85 p-6 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="flex w-full max-w-xs flex-col items-center gap-5 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bg-800 text-ink-300">
              <PauseIcon width={26} height={26} />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-ink-100">Juego en pausa</h2>
              <p className="mt-1 text-sm text-ink-500">{DIFFICULTIES[difficulty].label}</p>
            </div>
            <div className="flex w-full flex-col gap-2.5">
              <button
                type="button"
                onClick={resume}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 font-display font-bold text-white transition active:scale-[0.98]"
              >
                <PlayIcon width={16} height={16} />
                Reanudar
              </button>
              <button
                type="button"
                onClick={() => newGame(difficulty)}
                className="rounded-xl bg-bg-700 py-3 font-display font-semibold text-ink-300 transition hover:text-ink-100 active:scale-[0.98]"
              >
                Reiniciar partida
              </button>
              <button
                type="button"
                onClick={backToMenu}
                className="rounded-xl py-3 font-display font-semibold text-ink-500 transition hover:text-ink-100 active:scale-[0.98]"
              >
                Menú principal
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
