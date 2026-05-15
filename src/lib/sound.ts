import { useGameStore } from '../store/useGameStore'

type Win = Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const w = window as Win
    const Ctor = w.AudioContext ?? w.webkitAudioContext
    if (!Ctor) return null
    try {
      ctx = new Ctor()
    } catch {
      return null
    }
  }
  return ctx
}

interface ToneOpts {
  type?: OscillatorType
  volume?: number
  delay?: number
}

function tone(freq: number, duration: number, opts: ToneOpts = {}) {
  if (!useGameStore.getState().soundEnabled) return
  const c = getCtx()
  if (!c) return
  if (c.state === 'suspended') c.resume().catch(() => undefined)
  const { type = 'sine', volume = 0.05, delay = 0 } = opts
  const t = c.currentTime + delay
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  gain.gain.setValueAtTime(volume, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration)
  osc.connect(gain).connect(c.destination)
  osc.start(t)
  osc.stop(t + duration)
}

export const sound = {
  correct() {
    tone(880, 0.12, { type: 'triangle', volume: 0.07 })
    tone(1320, 0.18, { type: 'triangle', volume: 0.06, delay: 0.08 })
  },
  wrong() {
    tone(180, 0.22, { type: 'sawtooth', volume: 0.045 })
  },
  tap() {
    tone(660, 0.04, { type: 'triangle', volume: 0.025 })
  },
  complete() {
    tone(523, 0.14, { type: 'triangle', volume: 0.07 }) // C5
    tone(659, 0.14, { type: 'triangle', volume: 0.07, delay: 0.11 }) // E5
    tone(784, 0.2, { type: 'triangle', volume: 0.07, delay: 0.22 }) // G5
  },
}
