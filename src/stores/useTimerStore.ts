// Store du chronomètre - gère le temps restant des deux joueurs

import { create } from 'zustand'
import { TimerEngine } from '@/core/timer/TimerEngine'
import { getTimeControl, isTimeControlActive } from '@/core/timer/TimeControls'
import type { TimeControl, TimeControlPreset } from '@/core/timer/types'
import type { Color } from '@/core/engine/types'

interface TimerStore {
  // État
  whiteTime: number
  blackTime: number
  isRunning: boolean
  activeColor: Color | null
  timeControl: TimeControl
  preset: TimeControlPreset
  engine: TimerEngine | null

  // Actions
  initialize: (preset: TimeControlPreset) => void
  start: (color: Color) => void
  stop: () => void
  switchTimer: (from: Color, to: Color) => void
  reset: () => void
  setTimeControl: (preset: TimeControlPreset) => void
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  // État initial - pas de timer actif
  whiteTime: 0,
  blackTime: 0,
  isRunning: false,
  activeColor: null,
  timeControl: getTimeControl('none'),
  preset: 'none',
  engine: null,

  // Configure le timer avec le preset choisi et crée le moteur
  initialize: (preset: TimeControlPreset) => {
    const timeControl = getTimeControl(preset)

    if (!isTimeControlActive(preset)) {
      // Pas de timer pour ce mode
      set({
        preset,
        timeControl,
        whiteTime: 0,
        blackTime: 0,
        isRunning: false,
        activeColor: null,
        engine: null,
      })
      return
    }

    const engine = new TimerEngine(timeControl, {
      onTick: (color, time) => {
        // Met à jour le temps du joueur actif en temps réel
        if (color === 'w') {
          set({ whiteTime: time })
        } else {
          set({ blackTime: time })
        }
      },
      onTimeout: (_color) => {
        // Le joueur a épuisé son temps - on arrête tout
        set({ isRunning: false, activeColor: null })
      },
    })

    set({
      preset,
      timeControl,
      whiteTime: timeControl.initialTime * 1000,
      blackTime: timeControl.initialTime * 1000,
      engine,
    })
  },

  // Démarre le chronomètre d'un joueur
  start: (color: Color) => {
    const { engine, preset } = get()
    if (!engine || !isTimeControlActive(preset)) return

    engine.start(color)
    set({ isRunning: true, activeColor: color })
  },

  // Arrête tous les chronomètres
  stop: () => {
    const { engine } = get()
    if (!engine) return

    engine.stopAll()
    set({ isRunning: false, activeColor: null })
  },

  // Passe le chronomètre d'un joueur à l'autre (après un coup)
  switchTimer: (from: Color, to: Color) => {
    const { engine, preset } = get()
    if (!engine || !isTimeControlActive(preset)) return

    engine.switch(from, to)
    set({ isRunning: true, activeColor: to })
  },

  // Remet les deux joueurs au temps de départ
  reset: () => {
    const { engine, timeControl } = get()
    if (!engine) return

    engine.reset()
    set({
      whiteTime: timeControl.initialTime * 1000,
      blackTime: timeControl.initialTime * 1000,
      isRunning: false,
      activeColor: null,
    })
  },

  // Change le contrôle du temps (arrête les timers en cours et réinitialise)
  setTimeControl: (preset: TimeControlPreset) => {
    const { engine } = get()
    engine?.stopAll()

    get().initialize(preset)
  },
}))

export default useTimerStore
