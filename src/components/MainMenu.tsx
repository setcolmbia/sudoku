import { useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useGameStore } from '../store/gameStore'
import { DIFFICULTIES } from '../engine/sudoku'
import { formatTime } from '../hooks/useGameTimer'
import { SettingsModal } from './SettingsModal'
import { SettingsIcon, TrophyIcon, PlayIcon } from './icons'
import type { Difficulty } from '../types/sudoku'

const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'medium', 'hard']

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  easy: 'from-good-500/25 to-good-500/5 hover:from-good-500/35',
  medium: 'from-warn-500/25 to-warn-500/5 hover:from-warn-500/35',
  hard: 'from-bad-500/25 to-bad-500/5 hover:from-bad-500/35',
}

export function MainMenu() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [generating, setGenerating] = useState<Difficulty | null>(null)
  const newGame = useGameStore((s) => s.newGame)
  const resumeIfAny = useGameStore((s) => s.resumeIfAny)
  const status = useGameStore((s) => s.status)
  const difficulty = useGameStore((s) => s.difficulty)
  const elapsedSec = useGameStore((s) => s.elapsedSec)
  const stats = useGameStore((s) => s.stats)

  const hasSavedGame = status === 'paused'

  function startGame(d: Difficulty) {
    setGenerating(d)
    // Let the tap feedback and spinner paint before the (synchronous,
    // sometimes ~0.5s on "hard") puzzle generation blocks the main thread.
    window.setTimeout(() => {
      newGame(d)
      setGenerating(null)
    }, 30)
  }

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-10">
      <BackgroundGrid />

      <button
        type="button"
        onClick={() => setSettingsOpen(true)}
        aria-label="Ajustes"
        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-bg-800/70 text-ink-300 backdrop-blur transition hover:text-ink-100 active:scale-95"
      >
        <SettingsIcon width={18} height={18} />
      </button>

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mb-10 flex flex-col items-center text-center"
      >
        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-3xl font-black text-white shadow-panel animate-float">
          9
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink-100 sm:text-5xl">
          Sudoku <span className="bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent">Nova</span>
        </h1>
        <p className="mt-2 max-w-xs text-sm text-ink-500">
          Notas, resaltados inteligentes y pistas para un sudoku pulido de principio a fin.
        </p>
      </motion.div>

      {hasSavedGame && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          type="button"
          onClick={resumeIfAny}
          className="relative z-10 mb-4 flex w-full max-w-sm items-center justify-between rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-4 shadow-panel transition active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
              <PlayIcon width={18} height={18} className="text-white" />
            </span>
            <div className="text-left">
              <div className="font-display text-sm font-bold text-white">Continuar partida</div>
              <div className="text-xs text-white/70">
                {DIFFICULTIES[difficulty].label} · {formatTime(elapsedSec)}
              </div>
            </div>
          </div>
        </motion.button>
      )}

      <div className="relative z-10 flex w-full max-w-sm flex-col gap-3">
        {DIFFICULTY_ORDER.map((d, i) => {
          const best = stats[d].bestTimeSec
          return (
            <motion.button
              key={d}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              type="button"
              disabled={generating !== null}
              onClick={() => startGame(d)}
              className={clsx(
                'flex items-center justify-between rounded-2xl border border-white/10 bg-gradient-to-r px-5 py-4 text-left transition active:scale-[0.98] disabled:opacity-60',
                DIFFICULTY_STYLES[d],
              )}
            >
              <div>
                <div className="font-display text-base font-bold text-ink-100">
                  {DIFFICULTIES[d].label}
                </div>
                <div className="text-xs text-ink-500">{DIFFICULTIES[d].description}</div>
              </div>
              {generating === d ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-100/30 border-t-ink-100" />
              ) : (
                best !== null && (
                  <div className="flex items-center gap-1 rounded-full bg-black/20 px-2.5 py-1 text-xs font-semibold text-ink-300 tabular-nums">
                    <TrophyIcon width={13} height={13} className="text-warn-500" />
                    {formatTime(best)}
                  </div>
                )
              )}
            </motion.button>
          )
        })}
      </div>

      <p className="relative z-10 mt-10 text-center text-xs text-ink-500">
        Mantén presionada una casilla para resaltar su fila y columna.
      </p>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}

function BackgroundGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.06]">
      <div className="absolute left-1/2 top-1/2 h-[140vw] w-[140vw] -translate-x-1/2 -translate-y-1/2 rotate-12">
        <div className="grid h-full w-full grid-cols-9 grid-rows-9">
          {Array.from({ length: 81 }).map((_, i) => (
            <div key={i} className="border border-ink-100" />
          ))}
        </div>
      </div>
    </div>
  )
}
