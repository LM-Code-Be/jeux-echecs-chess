// Store IA - gère l'état du moteur et les demandes de coups

import { create } from 'zustand'
import { StockfishManager } from '@/core/stockfish/StockfishManager'
import { getDifficultyConfig } from '@/core/stockfish/DifficultyLevels'
import type { DifficultyLevel } from '@/core/stockfish/types'

interface StockfishStore {
  // État
  manager: StockfishManager | null
  isInitialized: boolean
  isThinking: boolean
  difficulty: DifficultyLevel
  currentEvaluation: number
  error: string | null

  // Actions
  initialize: () => Promise<void>
  setDifficulty: (level: DifficultyLevel) => void
  requestMove: (fen: string) => Promise<string>
  stopThinking: () => void
  terminate: () => void
}

export const useStockfishStore = create<StockfishStore>((set, get) => ({
  // État initial
  manager: null,
  isInitialized: false,
  isThinking: false,
  difficulty: 'casual',
  currentEvaluation: 0,
  error: null,

  // Démarre le moteur IA (appelé au lancement du mode IA)
  initialize: async () => {
    const { manager } = get()

    // Si le moteur tourne déjà, inutile de le relancer
    if (manager?.ready) {
      set({ isInitialized: true })
      return
    }

    try {
      set({ error: null })
      const newManager = new StockfishManager()
      await newManager.initialize()

      set({
        manager: newManager,
        isInitialized: true,
        error: null,
      })
    } catch (error) {
      console.error('Failed to initialize AI engine:', error)
      set({
        error: error instanceof Error ? error.message : 'Failed to initialize AI engine',
        isInitialized: false,
      })
    }
  },

  // Change le niveau de difficulté de l'IA
  setDifficulty: (level: DifficultyLevel) => {
    set({ difficulty: level })
  },

  // Demande au moteur de calculer le meilleur coup depuis une position FEN
  requestMove: async (fen: string) => {
    const { manager, difficulty, isInitialized } = get()

    if (!manager || !isInitialized) {
      throw new Error('AI engine not initialized')
    }

    try {
      set({ isThinking: true, error: null })

      const difficultyConfig = getDifficultyConfig(difficulty)
      const bestMove = await manager.getBestMove(fen, difficultyConfig)

      set({ isThinking: false })
      return bestMove
    } catch (error) {
      console.error('Error getting move from AI:', error)
      set({
        isThinking: false,
        error: error instanceof Error ? error.message : 'Failed to get move',
      })
      throw error
    }
  },

  // Interrompt le calcul en cours
  stopThinking: () => {
    const { manager } = get()
    if (manager) {
      manager.stopAnalysis()
    }
    set({ isThinking: false })
  },

  // Éteint le moteur et remet l'état à zéro
  terminate: () => {
    const { manager } = get()
    if (manager) {
      manager.terminate()
    }
    set({
      manager: null,
      isInitialized: false,
      isThinking: false,
      error: null,
    })
  },
}))

export default useStockfishStore
