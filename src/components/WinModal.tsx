import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { DIFFICULTIES } from '../engine/sudoku'
import { formatTime } from '../hooks/useGameTimer'
import { TrophyIcon } from './icons'

const CONFETTI_COLORS = ['#7c5cff', '#22d3ee', '#34d399', '#ffc857', '#fb6a6a']

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1.6,
        rotate: Math.random() * 360,
        drift: (Math.random() - 0.5) * 120,
        size: 6 + Math.random() * 6,
      })),
    [],
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
          animate={{ y: '120vh', x: p.drift, opacity: [1, 1, 0], rotate: p.rotate }}
          transition={{ delay: p.delay, duration: p.duration, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: 0,
            width: p.size,
            height: p.size * 0.4,
            background: p.color,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  )
}

export function WinModal() {
  const status = useGameStore((s) => s.status)
  const difficulty = useGameStore((s) => s.difficulty)
  const elapsedSec = useGameStore((s) => s.elapsedSec)
  const mistakes = useGameStore((s) => s.mistakes)
  const hintsUsed = useGameStore((s) => s.hintsUsed)
  const stats = useGameStore((s) => s.stats)
  const newGame = useGameStore((s) => s.newGame)
  const backToMenu = useGameStore((s) => s.backToMenu)

  const open = status === 'won'
  const best = stats[difficulty].bestTimeSec
  const isNewBest = open && best !== null && best === elapsedSec

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
        >
          <Confetti />
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
            className="relative z-10 w-full max-w-sm rounded-3xl border border-white/10 bg-bg-800 p-7 text-center shadow-panel"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-warn-500 to-brand-500 shadow-panel">
              <TrophyIcon width={30} height={30} className="text-white" />
            </div>
            <h2 className="font-display text-2xl font-extrabold text-ink-100">¡Sudoku resuelto!</h2>
            <p className="mt-1 text-sm text-ink-500">{DIFFICULTIES[difficulty].label}</p>

            {isNewBest && (
              <div className="mx-auto mt-3 w-fit rounded-full bg-warn-500/15 px-3 py-1 text-xs font-bold text-warn-500">
                🏆 Nuevo mejor tiempo
              </div>
            )}

            <div className="mt-5 grid grid-cols-3 gap-2">
              <Stat label="Tiempo" value={formatTime(elapsedSec)} />
              <Stat label="Errores" value={String(mistakes)} />
              <Stat label="Pistas" value={String(hintsUsed)} />
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => newGame(difficulty)}
                className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 font-display font-bold text-white transition active:scale-[0.98]"
              >
                Jugar otra partida
              </button>
              <button
                type="button"
                onClick={backToMenu}
                className="rounded-xl bg-bg-700 py-3 font-display font-semibold text-ink-300 transition hover:text-ink-100 active:scale-[0.98]"
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-bg-700/60 py-2.5">
      <div className="font-display text-lg font-bold text-ink-100 tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-ink-500">{label}</div>
    </div>
  )
}
