// Store central du jeu - gère la position, l'historique des coups et la sélection de pièces

import { create } from 'zustand'
import { ChessEngine } from '@/core/engine/ChessEngine'
import type {
  Move,
  MoveOptions,
  Square,
  GameMode,
  Color,
  GameStatus,
  Position,
} from '@/core/engine/types'

interface GameStore {
  // État courant
  gameId: string
  mode: GameMode
  engine: ChessEngine
  currentPosition: string // FEN
  moveHistory: Move[]
  currentMoveIndex: number
  turn: Color
  inCheck: boolean
  gameStatus: GameStatus
  selectedSquare: Square | null
  legalMovesForSelected: Square[]
  lastMove: Move | null

  // Actions
  makeMove: (moveOptions: MoveOptions) => boolean
  undoMove: () => boolean
  navigateToMove: (index: number) => void
  selectSquare: (square: Square | null) => void
  resetGame: () => void
  newGame: (mode: GameMode) => void
  loadPgn: (pgn: string) => boolean
  loadFen: (fen: string) => boolean
  getState: () => {
    fen: string
    pgn: string
    position: Position
    gameStatus: GameStatus
  }
}

const createInitialState = (mode: GameMode = 'local') => {
  const engine = new ChessEngine()
  return {
    gameId: crypto.randomUUID(),
    mode,
    engine,
    currentPosition: engine.getFen(),
    moveHistory: [],
    currentMoveIndex: -1,
    turn: 'w' as Color,
    inCheck: false,
    gameStatus: 'playing' as GameStatus,
    selectedSquare: null,
    legalMovesForSelected: [],
    lastMove: null,
  }
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialState(),

  // Joue un coup et met à jour tout l'état - retourne false si le coup est illégal
  makeMove: (moveOptions: MoveOptions) => {
    const { engine, currentMoveIndex, moveHistory } = get()

    // Si on est revenu en arrière dans l'historique, on tronque les coups suivants
    if (currentMoveIndex < moveHistory.length - 1) {
      const newHistory = moveHistory.slice(0, currentMoveIndex + 1)
      set({ moveHistory: newHistory })

      engine.reset()
      newHistory.forEach((move) => {
        engine.move({
          from: move.from,
          to: move.to,
          promotion: move.promotion,
        })
      })
    }

    const move = engine.move(moveOptions)

    if (!move) {
      return false
    }

    const state = engine.getState()

    set({
      currentPosition: state.fen,
      moveHistory: [...get().moveHistory, move],
      currentMoveIndex: get().currentMoveIndex + 1,
      turn: state.turn,
      inCheck: state.inCheck,
      gameStatus: state.status,
      selectedSquare: null,
      legalMovesForSelected: [],
      lastMove: move,
    })

    return true
  },

  // Annule le dernier coup - retourne false s'il n'y a rien à annuler
  undoMove: () => {
    const { engine, currentMoveIndex } = get()

    if (currentMoveIndex < 0) {
      return false
    }

    const move = engine.undo()

    if (!move) {
      return false
    }

    const state = engine.getState()

    set({
      currentPosition: state.fen,
      currentMoveIndex: currentMoveIndex - 1,
      turn: state.turn,
      inCheck: state.inCheck,
      gameStatus: state.status,
      selectedSquare: null,
      legalMovesForSelected: [],
      lastMove: currentMoveIndex > 0 ? get().moveHistory[currentMoveIndex - 1] : null,
    })

    return true
  },

  // Rejoue la partie jusqu'à un coup précis (pour naviguer dans l'historique)
  navigateToMove: (index: number) => {
    const { moveHistory, engine } = get()

    if (index < -1 || index >= moveHistory.length) {
      return
    }

    engine.reset()

    for (let i = 0; i <= index; i++) {
      const move = moveHistory[i]
      if (!move) continue

      engine.move({
        from: move.from,
        to: move.to,
        promotion: move.promotion,
      })
    }

    const state = engine.getState()

    set({
      currentPosition: state.fen,
      currentMoveIndex: index,
      turn: state.turn,
      inCheck: state.inCheck,
      gameStatus: state.status,
      selectedSquare: null,
      legalMovesForSelected: [],
      lastMove: index >= 0 ? moveHistory[index] : null,
    })
  },

  // Sélectionne une case et calcule les coups légaux de la pièce dessus
  selectSquare: (square: Square | null) => {
    const { engine, turn } = get()

    if (!square) {
      set({ selectedSquare: null, legalMovesForSelected: [] })
      return
    }

    const piece = engine.getPiece(square)

    // On ne peut sélectionner que ses propres pièces
    if (!piece || piece.color !== turn) {
      set({ selectedSquare: null, legalMovesForSelected: [] })
      return
    }

    const legalMoves = engine.getLegalMoves(square)
    const legalSquares = legalMoves.map((move) => move.to)

    set({
      selectedSquare: square,
      legalMovesForSelected: legalSquares,
    })
  },

  // Remet le plateau en position initiale en conservant le mode de jeu
  resetGame: () => {
    const { engine } = get()
    engine.reset()

    const state = engine.getState()

    set({
      currentPosition: state.fen,
      moveHistory: [],
      currentMoveIndex: -1,
      turn: state.turn,
      inCheck: false,
      gameStatus: 'playing',
      selectedSquare: null,
      legalMovesForSelected: [],
      lastMove: null,
    })
  },

  // Démarre une nouvelle partie dans le mode donné (local ou vs IA)
  newGame: (mode: GameMode) => {
    const newState = createInitialState(mode)
    set(newState)
  },

  // Charge une partie complète depuis sa notation PGN
  loadPgn: (pgn: string) => {
    const { engine } = get()

    if (!engine.loadPgn(pgn)) {
      return false
    }

    const moveHistory = engine.getMoveHistory()
    const state = engine.getState()

    set({
      currentPosition: state.fen,
      moveHistory,
      currentMoveIndex: moveHistory.length - 1,
      turn: state.turn,
      inCheck: state.inCheck,
      gameStatus: state.status,
      selectedSquare: null,
      legalMovesForSelected: [],
      lastMove: moveHistory.length > 0 ? moveHistory[moveHistory.length - 1] : null,
    })

    return true
  },

  // Charge une position spécifique depuis une notation FEN
  loadFen: (fen: string) => {
    const { engine } = get()

    if (!engine.loadFen(fen)) {
      return false
    }

    const state = engine.getState()

    set({
      currentPosition: fen,
      moveHistory: [],
      currentMoveIndex: -1,
      turn: state.turn,
      inCheck: state.inCheck,
      gameStatus: state.status,
      selectedSquare: null,
      legalMovesForSelected: [],
      lastMove: null,
    })

    return true
  },

  // Retourne les infos essentielles de la partie (utile pour les exports)
  getState: () => {
    const { engine } = get()
    return {
      fen: engine.getFen(),
      pgn: engine.getPgn(),
      position: engine.getPosition(),
      gameStatus: engine.getGameStatus(),
    }
  },
}))

export default useGameStore
