import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

export function useGameTimer() {
  const status = useGameStore((s) => s.status)
  const tick = useGameStore((s) => s.tick)

  useEffect(() => {
    if (status !== 'playing') return
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [status, tick])
}

export function formatTime(totalSec: number): string {
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}
