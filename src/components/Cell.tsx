import { memo } from 'react'
import clsx from 'clsx'
import { useLongPress } from '../hooks/useLongPress'

interface CellProps {
  row: number
  col: number
  value: number
  given: boolean
  hinted: boolean
  error: boolean
  notes: boolean[]
  invalidNotes: boolean[]
  selected: boolean
  spotlighted: boolean
  peer: boolean
  highlightedDigit: number | null
  shake: boolean
  boxShade: boolean
  onTap: (row: number, col: number) => void
  onLongPress: (row: number, col: number) => void
  onRelease: () => void
}

function CellInner({
  row,
  col,
  value,
  given,
  hinted,
  error,
  notes,
  invalidNotes,
  selected,
  spotlighted,
  peer,
  highlightedDigit,
  shake,
  boxShade,
  onTap,
  onLongPress,
  onRelease,
}: CellProps) {
  const press = useLongPress({
    onTap: () => onTap(row, col),
    onLongPress: () => onLongPress(row, col),
    onRelease,
  })

  const borderRight = col % 3 === 2 && col !== 8
  const borderBottom = row % 3 === 2 && row !== 8
  const sameDigit = highlightedDigit !== null && value === highlightedDigit

  // Resolved as a single mutually-exclusive state so exactly one background
  // utility is ever applied — avoids relying on Tailwind's class-order cascade.
  const stateClass = error
    ? 'bg-bad-500/25 shadow-[inset_0_0_0_2px_var(--color-bad-500)]'
    : selected
      ? 'bg-brand-500/35 shadow-[inset_0_0_0_2px_var(--color-brand-400)]'
      : sameDigit
        ? 'bg-accent-500/[0.22]'
        : spotlighted
          ? 'bg-accent-500/[0.1]'
          : peer
            ? 'bg-brand-500/[0.08]'
            : boxShade
              ? 'bg-white/[0.035]'
              : 'bg-transparent'

  return (
    <div
      {...press}
      role="button"
      aria-label={`Casilla fila ${row + 1}, columna ${col + 1}`}
      className={clsx(
        'relative flex aspect-square items-center justify-center touch-none select-none',
        'font-display text-[clamp(19px,5.8vw,34px)] font-semibold transition-colors duration-150',
        borderRight && 'border-r-2 border-r-bg-950/70',
        borderBottom && 'border-b-2 border-b-bg-950/70',
        'border-r border-r-white/5 border-b border-b-white/5',
        stateClass,
        shake && 'animate-shake',
      )}
    >
      {value !== 0 ? (
        <span
          key={`${value}-${hinted}`}
          className={clsx(
            'animate-pop',
            given && 'text-ink-100',
            !given && !hinted && !error && 'text-brand-300',
            hinted && !error && 'text-accent-400',
            error && 'text-bad-400',
          )}
        >
          {value}
        </span>
      ) : (
        <div className="grid h-full w-full grid-cols-3 grid-rows-3 p-[2px]">
          {notes.map((on, i) => (
            <span
              key={i}
              className={clsx(
                'flex items-center justify-center text-[clamp(7px,1.9vw,10.5px)] font-medium leading-none',
                on
                  ? invalidNotes[i]
                    ? 'font-bold text-bad-400'
                    : highlightedDigit === i + 1
                      ? 'text-accent-400'
                      : 'text-ink-300'
                  : 'text-transparent',
              )}
            >
              {i + 1}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export const Cell = memo(CellInner)
