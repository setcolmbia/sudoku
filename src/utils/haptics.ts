let enabled = true
export function setHapticsEnabled(v: boolean) {
  enabled = v
}

function vibrate(pattern: number | number[]) {
  if (!enabled) return
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return
  try {
    navigator.vibrate(pattern)
  } catch {
    // ignore unsupported environments
  }
}

export const haptics = {
  tap: () => vibrate(8),
  place: () => vibrate(12),
  error: () => vibrate([16, 40, 16]),
  win: () => vibrate([20, 60, 20, 60, 40]),
}
