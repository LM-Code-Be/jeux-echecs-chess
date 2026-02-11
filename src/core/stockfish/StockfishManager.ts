// Gestionnaire IA - joue des coups légaux avec un délai simulé selon la difficulté
// En mode difficile, l'IA préfère les captures et les coups donnant échec

import { Chess } from 'chess.js'
import type { DifficultyConfig } from './types'

export class StockfishManager {
  private isReady: boolean

  constructor() {
    this.isReady = false
  }

  // Initialise le moteur avec un délai de démarrage réaliste
  async initialize(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    this.isReady = true
  }

  // Calcule le meilleur coup à jouer depuis une position FEN
  // Le temps de réflexion varie selon le niveau de difficulté
  async getBestMove(fen: string, difficulty: DifficultyConfig): Promise<string> {
    if (!this.isReady) {
      throw new Error('Engine not initialized')
    }

    // Simule le temps de réflexion de l'IA
    await new Promise((resolve) => setTimeout(resolve, difficulty.movetime))

    const chess = new Chess(fen)
    const legalMoves = chess.moves({ verbose: true })

    if (legalMoves.length === 0) {
      throw new Error('No legal moves available')
    }

    let selectedMove = legalMoves[0]

    if (difficulty.skillLevel > 10) {
      // Les niveaux élevés préfèrent les captures et les coups donnant échec
      const goodMoves = legalMoves.filter(
        (m) => m.captured || m.san.includes('+') || m.san.includes('#')
      )
      selectedMove = goodMoves.length > 0
        ? goodMoves[Math.floor(Math.random() * goodMoves.length)]!
        : legalMoves[Math.floor(Math.random() * legalMoves.length)]!
    } else {
      // Les niveaux faibles jouent aléatoirement
      selectedMove = legalMoves[Math.floor(Math.random() * legalMoves.length)]!
    }

    // Format UCI : "e2e4" ou "e7e8q" pour une promotion en dame
    let uciMove = selectedMove.from + selectedMove.to
    if (selectedMove.promotion) {
      uciMove += selectedMove.promotion
    }

    return uciMove
  }

  // Analyse une position (non implémenté pour l'instant)
  async analyzePosition(_fen: string): Promise<void> {
    // À implémenter avec Stockfish WebAssembly
  }

  // Interrompt une analyse en cours
  stopAnalysis(): void {
    // Rien à faire ici pour l'instant
  }

  // Désactive le moteur (libère les ressources)
  terminate(): void {
    this.isReady = false
  }

  // Le moteur est-il prêt à recevoir des positions ?
  get ready(): boolean {
    return this.isReady
  }
}

export default StockfishManager
