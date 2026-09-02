import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { Switch } from './Switch'
import { SoundOnIcon, VibrateIcon, SparkleIcon, PencilIcon } from './icons'

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const settings = useGameStore((s) => s.settings)
  const updateSettings = useGameStore((s) => s.updateSettings)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-t-3xl bg-bg-800 p-6 shadow-panel sm:rounded-3xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-ink-100">Ajustes</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-bg-700 px-3 py-1 text-sm text-ink-300 hover:text-ink-100"
              >
                Cerrar
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              <Switch
                checked={settings.soundOn}
                onChange={(v) => updateSettings({ soundOn: v })}
                label="Sonido"
                description="Efectos al colocar y equivocarte"
                icon={<SoundOnIcon width={18} height={18} />}
              />
              <Switch
                checked={settings.hapticsOn}
                onChange={(v) => updateSettings({ hapticsOn: v })}
                label="Vibración"
                description="Retroalimentación háptica en móvil"
                icon={<VibrateIcon width={18} height={18} />}
              />
              <Switch
                checked={settings.highlightPeers}
                onChange={(v) => updateSettings({ highlightPeers: v })}
                label="Resaltar fila, columna y caja"
                description="Guía visual al seleccionar una casilla"
                icon={<SparkleIcon width={18} height={18} />}
              />
              <Switch
                checked={settings.autoCleanNotes}
                onChange={(v) => updateSettings({ autoCleanNotes: v })}
                label="Limpiar notas automáticamente"
                description="Quita candidatos obsoletos al colocar un número"
                icon={<PencilIcon width={16} height={16} />}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
