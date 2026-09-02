let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

interface Tone {
  freq: number
  duration: number
  type?: OscillatorType
  delay?: number
  gain?: number
}

function playTones(tones: Tone[]) {
  const audio = getCtx()
  if (!audio) return
  const now = audio.currentTime

  for (const { freq, duration, type = 'sine', delay = 0, gain = 0.16 } of tones) {
    const osc = audio.createOscillator()
    const g = audio.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, now + delay)
    g.gain.setValueAtTime(0.0001, now + delay)
    g.gain.exponentialRampToValueAtTime(gain, now + delay + 0.012)
    g.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration)
    osc.connect(g)
    g.connect(audio.destination)
    osc.start(now + delay)
    osc.stop(now + delay + duration + 0.02)
  }
}

let enabled = true
export function setSoundEnabled(v: boolean) {
  enabled = v
}

function guarded(fn: () => void) {
  if (!enabled) return
  try {
    fn()
  } catch {
    // audio unsupported/blocked — fail silently
  }
}

export const sfx = {
  tap: () => guarded(() => playTones([{ freq: 520, duration: 0.06, gain: 0.08 }])),
  place: () => guarded(() => playTones([{ freq: 660, duration: 0.09, gain: 0.14 }])),
  note: () => guarded(() => playTones([{ freq: 880, duration: 0.05, gain: 0.07, type: 'triangle' }])),
  erase: () => guarded(() => playTones([{ freq: 320, duration: 0.08, gain: 0.1, type: 'triangle' }])),
  error: () =>
    guarded(() =>
      playTones([
        { freq: 220, duration: 0.14, gain: 0.16, type: 'sawtooth' },
        { freq: 160, duration: 0.16, gain: 0.14, type: 'sawtooth', delay: 0.05 },
      ]),
    ),
  hint: () =>
    guarded(() =>
      playTones([
        { freq: 740, duration: 0.1, gain: 0.12, type: 'triangle' },
        { freq: 990, duration: 0.12, gain: 0.12, type: 'triangle', delay: 0.08 },
      ]),
    ),
  select: () => guarded(() => playTones([{ freq: 440, duration: 0.05, gain: 0.06 }])),
  win: () =>
    guarded(() =>
      playTones([
        { freq: 523.25, duration: 0.16, gain: 0.14 },
        { freq: 659.25, duration: 0.16, gain: 0.14, delay: 0.12 },
        { freq: 783.99, duration: 0.16, gain: 0.14, delay: 0.24 },
        { freq: 1046.5, duration: 0.3, gain: 0.16, delay: 0.36 },
      ]),
    ),
}
