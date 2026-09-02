import clsx from 'clsx'
import { useGameStore } from '../store/gameStore'
import { DIFFICULTIES } from '../engine/sudoku'
import { UndoIcon, EraserIcon, PencilIcon, BulbIcon } from './icons'

function ToolButton({
  icon,
  label,
  badge,
  active,
  disabled,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  badge?: string | number
  active?: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'relative flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 transition-all duration-150',
        'active:scale-95 disabled:opacity-30 disabled:active:scale-100',
        active ? 'text-accent-400' : 'text-ink-300 hover:text-ink-100',
      )}
    >
      <span
        className={clsx(
          'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
          active ? 'bg-accent-500/15 ring-1 ring-accent-400/50' : 'bg-bg-700/60',
        )}
      >
        {icon}
      </span>
      <span className="text-[11px] font-medium leading-none">{label}</span>
      {badge !== undefined && (
        <span className="absolute -top-1 right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </button>
  )
}

export function Toolbar() {
  const notesMode = useGameStore((s) => s.notesMode)
  const toggleNotesMode = useGameStore((s) => s.toggleNotesMode)
  const eraseSelected = useGameStore((s) => s.eraseSelected)
  const undo = useGameStore((s) => s.undo)
  const historyLen = useGameStore((s) => s.history.length)
  const requestHint = useGameStore((s) => s.requestHint)
  const hintsUsed = useGameStore((s) => s.hintsUsed)
  const difficulty = useGameStore((s) => s.difficulty)
  const selected = useGameStore((s) => s.selected)
  const given = useGameStore((s) => s.given)

  const maxHints = DIFFICULTIES[difficulty].maxHints
  const hintsLeft = maxHints - hintsUsed
  const cellLocked = !selected || given[selected.row][selected.col]

  return (
    <div className="mx-auto flex w-full max-w-[min(92vw,520px)] items-stretch gap-1 rounded-2xl bg-bg-800/60 p-1.5 backdrop-blur">
      <ToolButton icon={<UndoIcon />} label="Deshacer" onClick={undo} disabled={historyLen === 0} />
      <ToolButton icon={<EraserIcon />} label="Borrar" onClick={eraseSelected} disabled={cellLocked} />
      <ToolButton
        icon={<PencilIcon width={18} height={18} />}
        label="Notas"
        active={notesMode}
        onClick={toggleNotesMode}
      />
      <ToolButton
        icon={<BulbIcon />}
        label="Pista"
        badge={hintsLeft}
        onClick={requestHint}
        disabled={hintsLeft <= 0}
      />
    </div>
  )
}
