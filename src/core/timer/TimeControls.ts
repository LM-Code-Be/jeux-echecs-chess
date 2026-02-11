// Presets de contrôle du temps - du bullet ultra-rapide au classique longue durée

import type { TimeControl, TimeControlPreset } from './types'

export const TIME_CONTROLS: Record<TimeControlPreset, TimeControl> = {
  bullet: {
    name: 'Bullet',
    initialTime: 60,   // 1 minute par joueur
    increment: 0,
  },
  blitz: {
    name: 'Blitz',
    initialTime: 180,  // 3 minutes
    increment: 2,      // +2s par coup
  },
  rapid: {
    name: 'Rapide',
    initialTime: 600,  // 10 minutes
    increment: 0,
  },
  classical: {
    name: 'Classique',
    initialTime: 1800, // 30 minutes
    increment: 0,
  },
  fischer: {
    name: 'Fischer (5+3)',
    initialTime: 300,  // 5 minutes
    increment: 3,      // +3s par coup
  },
  custom: {
    name: 'Personnalisé',
    initialTime: 600,
    increment: 0,
  },
  none: {
    name: 'Sans timer',
    initialTime: 0,
    increment: 0,
  },
}

// Retourne la configuration d'un preset donné
export function getTimeControl(preset: TimeControlPreset): TimeControl {
  return TIME_CONTROLS[preset]
}

// Formate des millisecondes en "M:SS" pour l'affichage
export function formatTime(milliseconds: number): string {
  if (milliseconds <= 0) return '0:00'

  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Un preset 'none' signifie qu'on joue sans limite de temps
export function isTimeControlActive(preset: TimeControlPreset): boolean {
  return preset !== 'none'
}
