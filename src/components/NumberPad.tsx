import { useMemo } from 'react'
import clsx from 'clsx'
import { useGameStore } from '../store/gameStore'
import { useLongPress } from '../hooks/useLongPress'

function DigitButton({ digit }: { digit: number }) {
  const inputDigit = useGameStore((s) => s.inputDigit)
  const toggleDigitHighlight = useGameStore((s) => s.toggleDigitHighlight)
  const active = useGameStore((s) => s.highlightedDigit === digit)
  const notesMode = useGameStore((s) => s.notesMode)
  const remaining = useGameStore((s) =>
    9 - s.values.flat().filter((v) => v === digit).length,
  )

  const press = useLongPress({
    onTap: () => inputDigit(digit),
    onLongPress: () => toggleDigitHighlight(digit),
  })

  const done = remaining <= 0

  return (
    <button
      {...press}
      type="button"
      aria-label={`Número ${digit}${active ? ' (resaltado)' : ''}`}
      className={clsx(
        'relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-2.5 sm:py-3',
        'font-display text-xl font-bold transition-all duration-150 active:scale-95 touch-none select-none',
        active
          ? 'bg-accent-500/90 text-bg-950 shadow-[0_0_0_2px_var(--color-accent-400)]'
          : 'bg-bg-700/80 text-ink-100 hover:bg-bg-600',
        done && !active && 'opacity-40',
        notesMode && !active && 'ring-1 ring-inset ring-brand-400/40',
      )}
    >
      {digit}
      <span
        className={clsx(
          'h-1 w-1 rounded-full',
          done ? 'bg-transparent' : active ? 'bg-bg-950/50' : 'bg-ink-500/50',
        )}
      />
    </button>
  )
}

export function NumberPad() {
  const digits = useMemo(() => Array.from({ length: 9 }, (_, i) => i + 1), [])
  return (
    <div className="mx-auto flex w-full max-w-[min(92vw,520px)] gap-1.5 sm:gap-2">
      {digits.map((d) => (
        <DigitButton key={d} digit={d} />
      ))}
    </div>
  )
}
