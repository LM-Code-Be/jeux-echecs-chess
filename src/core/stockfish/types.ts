// Types pour le moteur IA

export type DifficultyLevel = 'beginner' | 'casual' | 'intermediate' | 'advanced' | 'expert'

// Paramètres d'un niveau de difficulté
export interface DifficultyConfig {
  name: string
  elo: number        // ELO indicatif du niveau
  depth: number      // profondeur de recherche maximale
  movetime: number   // temps de réflexion en millisecondes
  skillLevel: number // niveau de compétence (0-20)
}

// Un coup analysé par le moteur avec son évaluation
export interface AnalysisMove {
  move: string       // format UCI (ex: "e2e4")
  evaluation: number // en centipions (100 = 1 pion d'avantage)
  depth: number
}

// Résultat d'une analyse de position
export interface StockfishAnalysis {
  evaluation: number
  bestMoves: AnalysisMove[]
  depth: number
}

// Message envoyé au moteur UCI
export interface UCIMessage {
  type: 'uci' | 'isready' | 'position' | 'go' | 'stop' | 'quit'
  command: string
}

// Réponse reçue du moteur UCI
export interface StockfishResponse {
  type: 'bestmove' | 'info' | 'uciok' | 'readyok'
  data: string
}
