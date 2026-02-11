// Déclarations de types pour le module stockfish (pour l'intégration future)

declare module 'stockfish' {
  interface StockfishEngine {
    postMessage(command: string): void
    onmessage: (line: string) => void
  }

  function Stockfish(): StockfishEngine

  export default Stockfish
}
