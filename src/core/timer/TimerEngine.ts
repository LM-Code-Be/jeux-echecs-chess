// Moteur de chronomètre pour les deux joueurs, avec support de l'incrément Fischer

import type { Color } from '../engine/types'
import type { TimeControl, TimerCallbacks } from './types'

export class TimerEngine {
  private intervals: Map<Color, NodeJS.Timeout>
  private timeRemaining: Record<Color, number>
  private lastTickTime: number | null
  private callbacks: TimerCallbacks

  constructor(
    private config: TimeControl,
    callbacks: TimerCallbacks = {}
  ) {
    this.intervals = new Map()
    this.timeRemaining = {
      w: config.initialTime * 1000,
      b: config.initialTime * 1000,
    }
    this.lastTickTime = null
    this.callbacks = callbacks
  }

  // Lance le chronomètre pour un joueur donné
  start(color: Color): void {
    this.stop(color) // évite les doublons si le timer était déjà lancé
    this.lastTickTime = Date.now()

    const interval = setInterval(() => {
      const now = Date.now()
      const elapsed = this.lastTickTime ? now - this.lastTickTime : 0
      this.lastTickTime = now

      this.timeRemaining[color] -= elapsed

      if (this.timeRemaining[color] <= 0) {
        this.timeRemaining[color] = 0
        this.stop(color)
        this.callbacks.onTimeout?.(color)
      }

      this.callbacks.onTick?.(color, this.timeRemaining[color])
    }, 100) // mise à jour toutes les 100ms pour un affichage fluide

    this.intervals.set(color, interval)
  }

  // Arrête le chronomètre d'un joueur
  stop(color: Color): void {
    const interval = this.intervals.get(color)
    if (interval) {
      clearInterval(interval)
      this.intervals.delete(color)
    }
    this.lastTickTime = null
  }

  // Arrête les deux chronomètres (fin de partie, pause...)
  stopAll(): void {
    this.stop('w')
    this.stop('b')
  }

  // Ajoute l'incrément Fischer au temps du joueur qui vient de jouer
  addIncrement(color: Color): void {
    if (this.config.increment > 0) {
      this.timeRemaining[color] += this.config.increment * 1000
      this.callbacks.onTick?.(color, this.timeRemaining[color])
    }
  }

  // Passe le timer d'un joueur à l'autre (après un coup joué)
  switch(from: Color, to: Color): void {
    this.stop(from)
    this.addIncrement(from) // le joueur qui vient de jouer reçoit son incrément
    this.start(to)
  }

  // Remet les deux joueurs au temps initial
  reset(): void {
    this.stopAll()
    this.timeRemaining = {
      w: this.config.initialTime * 1000,
      b: this.config.initialTime * 1000,
    }
    this.callbacks.onTick?.('w', this.timeRemaining.w)
    this.callbacks.onTick?.('b', this.timeRemaining.b)
  }

  // Retourne le temps restant pour un joueur (en millisecondes)
  getTimeRemaining(color: Color): number {
    return this.timeRemaining[color]
  }

  // Retourne la configuration de contrôle du temps active
  getTimeControl(): TimeControl {
    return this.config
  }

  // Change le contrôle du temps et remet tout à zéro
  setTimeControl(timeControl: TimeControl): void {
    this.stopAll()
    this.config = timeControl
    this.reset()
  }

  // Met en pause tous les timers actifs
  pause(): void {
    this.intervals.forEach((_, color) => {
      this.stop(color)
    })
  }

  // Le chronomètre d'un joueur est-il en cours ?
  isRunning(color: Color): boolean {
    return this.intervals.has(color)
  }

  // Au moins un chronomètre tourne-t-il ?
  isAnyRunning(): boolean {
    return this.intervals.size > 0
  }
}

export default TimerEngine
