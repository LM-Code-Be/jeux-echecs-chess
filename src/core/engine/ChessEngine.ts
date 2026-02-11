// Wrapper autour de chess.js - toute la logique des règles d'échecs passe par ici

import { Chess, type PieceSymbol as ChessPieceSymbol, type Square as ChessSquare } from 'chess.js'
import type {
  Color,
  GameState,
  Move,
  MoveOptions,
  Piece,
  Position,
  Square,
  GameStatus,
  PieceSymbol,
} from './types'

export class ChessEngine {
  private chess: Chess

  constructor(fen?: string) {
    this.chess = fen ? new Chess(fen) : new Chess()
  }

  // Retourne un snapshot complet de la partie (position, tour, échec, fin de partie...)
  getState(): GameState {
    return {
      fen: this.chess.fen(),
      pgn: this.chess.pgn(),
      moveHistory: this.getMoveHistory(),
      turn: this.chess.turn() as Color,
      inCheck: this.chess.inCheck(),
      inCheckmate: this.chess.isCheckmate(),
      inStalemate: this.chess.isStalemate(),
      inDraw: this.chess.isDraw(),
      insufficientMaterial: this.chess.isInsufficientMaterial(),
      inThreefoldRepetition: this.chess.isThreefoldRepetition(),
      gameOver: this.chess.isGameOver(),
      status: this.getGameStatus(),
    }
  }

  // Tente de jouer un coup - retourne null si le coup est illégal
  move(moveOptions: MoveOptions): Move | null {
    try {
      const result = this.chess.move({
        from: moveOptions.from as ChessSquare,
        to: moveOptions.to as ChessSquare,
        promotion: moveOptions.promotion as ChessPieceSymbol | undefined,
      })

      if (!result) return null

      return {
        from: result.from as Square,
        to: result.to as Square,
        color: result.color as Color,
        piece: result.piece as PieceSymbol,
        captured: result.captured as PieceSymbol | undefined,
        promotion: result.promotion as PieceSymbol | undefined,
        flags: result.flags,
        san: result.san,
        lan: result.lan,
        before: result.before,
        after: result.after,
      }
    } catch {
      return null
    }
  }

  // Annule le dernier coup joué - retourne null s'il n'y a rien à annuler
  undo(): Move | null {
    const result = this.chess.undo()
    if (!result) return null

    return {
      from: result.from as Square,
      to: result.to as Square,
      color: result.color as Color,
      piece: result.piece as PieceSymbol,
      captured: result.captured as PieceSymbol | undefined,
      promotion: result.promotion as PieceSymbol | undefined,
      flags: result.flags,
      san: result.san,
      lan: result.lan,
      before: result.before,
      after: result.after,
    }
  }

  // Liste les coups légaux depuis une case donnée, ou tous les coups si aucune case spécifiée
  getLegalMoves(square?: Square): Move[] {
    const moves = this.chess.moves({
      square: square as ChessSquare | undefined,
      verbose: true,
    })

    return moves.map((move) => ({
      from: move.from as Square,
      to: move.to as Square,
      color: move.color as Color,
      piece: move.piece as PieceSymbol,
      captured: move.captured as PieceSymbol | undefined,
      promotion: move.promotion as PieceSymbol | undefined,
      flags: move.flags,
      san: move.san,
      lan: move.lan,
      before: move.before,
      after: move.after,
    }))
  }

  // Raccourci pour récupérer tous les coups légaux de la position actuelle
  getAllLegalMoves(): Move[] {
    return this.getLegalMoves()
  }

  // Vérifie si un coup d'une case à une autre est légal
  isLegalMove(from: Square, to: Square): boolean {
    const moves = this.getLegalMoves(from)
    return moves.some((move) => move.to === to)
  }

  // Retourne la pièce sur une case, ou null si la case est vide
  getPiece(square: Square): Piece | null {
    const piece = this.chess.get(square as ChessSquare)
    if (!piece) return null

    return {
      type: piece.type as PieceSymbol,
      color: piece.color as Color,
    }
  }

  // Construit un objet position (case → pièce) depuis l'état actuel du plateau
  getPosition(): Position {
    const board = this.chess.board()
    const position: Position = {}

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1']

    board.forEach((row, rankIndex) => {
      row.forEach((square, fileIndex) => {
        if (square) {
          const squareName = `${files[fileIndex]}${ranks[rankIndex]}` as Square
          position[squareName] = {
            type: square.type as PieceSymbol,
            color: square.color as Color,
          }
        }
      })
    })

    return position
  }

  // Retourne la position actuelle en notation FEN
  getFen(): string {
    return this.chess.fen()
  }

  // Charge une position depuis une chaîne FEN - retourne false si invalide
  loadFen(fen: string): boolean {
    try {
      this.chess.load(fen)
      return true
    } catch {
      return false
    }
  }

  // Retourne la partie en notation PGN
  getPgn(): string {
    return this.chess.pgn()
  }

  // Charge une partie depuis un PGN - retourne false si le format est incorrect
  loadPgn(pgn: string): boolean {
    try {
      this.chess.loadPgn(pgn)
      return true
    } catch {
      return false
    }
  }

  // Remet le plateau en position de départ
  reset(): void {
    this.chess.reset()
  }

  // Retourne la liste complète des coups joués dans la partie
  getMoveHistory(): Move[] {
    const history = this.chess.history({ verbose: true })
    return history.map((move) => ({
      from: move.from as Square,
      to: move.to as Square,
      color: move.color as Color,
      piece: move.piece as PieceSymbol,
      captured: move.captured as PieceSymbol | undefined,
      promotion: move.promotion as PieceSymbol | undefined,
      flags: move.flags,
      san: move.san,
      lan: move.lan,
      before: move.before,
      after: move.after,
    }))
  }

  // Qui joue ? Retourne 'w' (blancs) ou 'b' (noirs)
  getTurn(): Color {
    return this.chess.turn() as Color
  }

  // Le roi actif est-il en échec ?
  isInCheck(): boolean {
    return this.chess.inCheck()
  }

  // La partie est-elle terminée par échec et mat ?
  isCheckmate(): boolean {
    return this.chess.isCheckmate()
  }

  // La partie est-elle nulle par pat (aucun coup légal, sans être en échec) ?
  isStalemate(): boolean {
    return this.chess.isStalemate()
  }

  // La partie est-elle nulle pour une raison quelconque ?
  isDraw(): boolean {
    return this.chess.isDraw()
  }

  // La partie est-elle terminée (mat, pat, nulle...) ?
  isGameOver(): boolean {
    return this.chess.isGameOver()
  }

  // Détermine le statut précis de la partie
  getGameStatus(): GameStatus {
    if (this.chess.isCheckmate()) return 'checkmate'
    if (this.chess.isStalemate()) return 'stalemate'
    if (this.chess.isThreefoldRepetition()) return 'threefold_repetition'
    if (this.chess.isInsufficientMaterial()) return 'insufficient_material'
    if (this.chess.isDraw()) return 'draw'
    return 'playing'
  }

  // Retourne les cases accessibles depuis une case (utile pour afficher les déplacements possibles)
  getAttackedSquares(square: Square): Square[] {
    const moves = this.getLegalMoves(square)
    return moves.map((move) => move.to)
  }

  // Vérifie si une case est attaquée par les pièces d'une couleur donnée
  isSquareAttacked(square: Square, color: Color): boolean {
    return this.chess.isAttacked(square as ChessSquare, color)
  }

  // Affiche le plateau en ASCII - pratique pour déboguer dans la console
  ascii(): string {
    return this.chess.ascii()
  }

  // Crée une copie indépendante du moteur à la position actuelle
  clone(): ChessEngine {
    return new ChessEngine(this.getFen())
  }
}

export default ChessEngine
