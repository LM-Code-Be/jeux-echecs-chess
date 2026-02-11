// Types de base du jeu d'échecs - indépendants de tout framework

export type Color = 'w' | 'b'
export type PieceSymbol = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'
export type Square =
  | 'a8' | 'b8' | 'c8' | 'd8' | 'e8' | 'f8' | 'g8' | 'h8'
  | 'a7' | 'b7' | 'c7' | 'd7' | 'e7' | 'f7' | 'g7' | 'h7'
  | 'a6' | 'b6' | 'c6' | 'd6' | 'e6' | 'f6' | 'g6' | 'h6'
  | 'a5' | 'b5' | 'c5' | 'd5' | 'e5' | 'f5' | 'g5' | 'h5'
  | 'a4' | 'b4' | 'c4' | 'd4' | 'e4' | 'f4' | 'g4' | 'h4'
  | 'a3' | 'b3' | 'c3' | 'd3' | 'e3' | 'f3' | 'g3' | 'h3'
  | 'a2' | 'b2' | 'c2' | 'd2' | 'e2' | 'f2' | 'g2' | 'h2'
  | 'a1' | 'b1' | 'c1' | 'd1' | 'e1' | 'f1' | 'g1' | 'h1'

export interface Piece {
  type: PieceSymbol
  color: Color
}

// Représente un coup joué avec toutes ses métadonnées (notation, drapeaux, position avant/après)
export interface Move {
  from: Square
  to: Square
  color: Color
  piece: PieceSymbol
  captured?: PieceSymbol | undefined
  promotion?: PieceSymbol | undefined
  flags: string
  san: string   // notation algébrique courte (ex: "e4", "Nf3")
  lan: string   // notation algébrique longue (ex: "e2e4")
  before: string
  after: string
}

// Tous les états possibles d'une partie
export type GameStatus =
  | 'playing'
  | 'checkmate'
  | 'stalemate'
  | 'draw'
  | 'threefold_repetition'
  | 'insufficient_material'
  | 'fifty_move_rule'
  | 'resigned'
  | 'timeout'

// Snapshot complet de la partie à un instant donné
export interface GameState {
  fen: string
  pgn: string
  moveHistory: Move[]
  turn: Color
  inCheck: boolean
  inCheckmate: boolean
  inStalemate: boolean
  inDraw: boolean
  insufficientMaterial: boolean
  inThreefoldRepetition: boolean
  gameOver: boolean
  status: GameStatus
}

// Ce dont on a besoin pour jouer un coup (case de départ, d'arrivée, et pièce de promotion si pion)
export interface MoveOptions {
  from: Square
  to: Square
  promotion?: PieceSymbol | undefined
}

// Dictionnaire case → pièce représentant l'état du plateau
export interface Position {
  [square: string]: Piece | undefined
}

export type GameMode = 'local' | 'ai'

export type PlayerColor = 'white' | 'black' | 'random'

export interface GameConfig {
  mode: GameMode
  playerColor?: PlayerColor
  aiDifficulty?: 'beginner' | 'casual' | 'intermediate' | 'advanced' | 'expert'
  timeControl?: string
}
