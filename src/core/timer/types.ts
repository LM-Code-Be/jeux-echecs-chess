// Types pour le système de chronomètre

import type { Color } from '../engine/types'

// Un contrôle du temps : durée initiale + incrément par coup (style Fischer)
export interface TimeControl {
  name: string
  initialTime: number // en secondes
  increment: number   // secondes ajoutées après chaque coup
}

export type TimeControlPreset = 'bullet' | 'blitz' | 'rapid' | 'classical' | 'fischer' | 'custom' | 'none'

export interface TimerState {
  whiteTime: number    // temps restant en millisecondes
  blackTime: number    // temps restant en millisecondes
  isRunning: boolean
  activeColor: Color | null
  timeControl: TimeControl
}

// Fonctions de rappel appelées par le moteur timer
export interface TimerCallbacks {
  onTick?: (color: Color, timeRemaining: number) => void    // appelé toutes les 100ms
  onTimeout?: (color: Color) => void                        // appelé quand un joueur n'a plus de temps
}
