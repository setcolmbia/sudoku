import clsx from 'clsx'

export function Switch({
  checked,
  onChange,
  label,
  description,
  icon,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
  icon?: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-xl bg-bg-700/50 px-4 py-3 text-left transition hover:bg-bg-700"
    >
      <div className="flex items-center gap-3">
        {icon && <span className="text-ink-300">{icon}</span>}
        <div>
          <div className="text-sm font-semibold text-ink-100">{label}</div>
          {description && <div className="text-xs text-ink-500">{description}</div>}
        </div>
      </div>
      <span
        className={clsx(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200',
          checked ? 'bg-brand-500' : 'bg-bg-600',
        )}
      >
        <span
          className={clsx(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5',
          )}
        />
      </span>
    </button>
  )
}
