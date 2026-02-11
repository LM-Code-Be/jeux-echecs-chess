// Fenêtre modale de promotion - s'affiche quand un pion atteint la dernière rangée

import type { PieceSymbol, Color } from '@/core/engine/types'

interface PromotionDialogProps {
  color: Color
  onSelect: (piece: PieceSymbol) => void
  position?: { x: number; y: number }
}

export function PromotionDialog({ color, onSelect, position }: PromotionDialogProps) {
  // Les 4 pièces disponibles lors d'une promotion, avec leurs icônes Unicode
  const pieces: Array<{ symbol: PieceSymbol; name: string; icon: string }> = [
    { symbol: 'q', name: 'Dame',     icon: color === 'w' ? '♕' : '♛' },
    { symbol: 'r', name: 'Tour',     icon: color === 'w' ? '♖' : '♜' },
    { symbol: 'b', name: 'Fou',      icon: color === 'w' ? '♗' : '♝' },
    { symbol: 'n', name: 'Cavalier', icon: color === 'w' ? '♘' : '♞' },
  ]

  const dialogStyle = position
    ? {
        position: 'fixed' as const,
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }
    : {}

  return (
    <>
      {/* Fond semi-transparent derrière le dialogue */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200" />

      <div
        className="fixed inset-0 flex items-center justify-center z-50 animate-in zoom-in duration-200"
        style={position ? dialogStyle : {}}
      >
        <div className="bg-bg-secondary rounded-xl shadow-2xl border-2 border-accent-primary p-6 max-w-md">
          <h3 className="text-2xl font-bold text-text-primary mb-4 text-center">
            🎉 Promotion du pion !
          </h3>
          <p className="text-text-secondary text-center mb-6">
            Choisissez la pièce en laquelle vous souhaitez transformer votre pion :
          </p>

          <div className="grid grid-cols-2 gap-4">
            {pieces.map(({ symbol, name, icon }) => (
              <button
                key={symbol}
                onClick={() => onSelect(symbol)}
                className="flex flex-col items-center gap-3 p-6 bg-bg-primary hover:bg-accent-primary/20 border-2 border-accent-primary/30 hover:border-accent-primary rounded-lg transition-all transform hover:scale-105 active:scale-95"
              >
                <span className="text-6xl">{icon}</span>
                <span className="text-text-primary font-semibold text-lg">{name}</span>
              </button>
            ))}
          </div>

          <p className="text-text-secondary/70 text-xs text-center mt-6">
            Conseil : La Dame est généralement le meilleur choix !
          </p>
        </div>
      </div>
    </>
  )
}

export default PromotionDialog
