import { useRef } from 'react'

interface LongPressOptions {
  onTap: () => void
  onLongPress: () => void
  onRelease?: () => void
  delay?: number
}

/** Pointer-events based tap/long-press detector — works for mouse, touch and pen. */
export function useLongPress({ onTap, onLongPress, onRelease, delay = 380 }: LongPressOptions) {
  const timer = useRef<number | null>(null)
  const fired = useRef(false)

  function clear() {
    if (timer.current !== null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
  }

  function start() {
    fired.current = false
    clear()
    timer.current = window.setTimeout(() => {
      fired.current = true
      onLongPress()
    }, delay)
  }

  function end() {
    clear()
    if (fired.current) {
      onRelease?.()
    } else {
      onTap()
    }
    fired.current = false
  }

  function cancel() {
    clear()
    if (fired.current) onRelease?.()
    fired.current = false
  }

  return {
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault()
      start()
    },
    onPointerUp: () => end(),
    onPointerLeave: () => cancel(),
    onPointerCancel: () => cancel(),
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  }
}
