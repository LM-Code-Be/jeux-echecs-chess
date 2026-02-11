// Composant plateau principal - gère les interactions (clic, drag&drop, promotion)

import { useCallback, useMemo, useState } from 'react'
import { Chessboard } from 'react-chessboard'
import type { Square as BoardSquare } from 'react-chessboard/dist/chessboard/types'
import { useGameStore } from '@/stores/useGameStore'
import type { Square, PieceSymbol } from '@/core/engine/types'
import { PromotionDialog } from '@/components/molecules/PromotionDialog'

interface ChessBoardProps {
  boardWidth?: number
  showCoordinates?: boolean
  orientation?: 'white' | 'black'
}

export function ChessBoard({
  boardWidth = 600,
  showCoordinates: _showCoordinates = true,
  orientation = 'white',
}: ChessBoardProps) {
  const {
    currentPosition,
    selectedSquare,
    legalMovesForSelected,
    makeMove,
    selectSquare,
    turn,
    gameStatus,
    engine,
  } = useGameStore()

  // Stocke le coup de promotion en attente (on attend que le joueur choisisse sa pièce)
  const [promotionMove, setPromotionMove] = useState<{
    from: Square
    to: Square
  } | null>(null)

  // Calcule les styles visuels des cases (case sélectionnée + points sur les cases légales)
  const customSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {}

    legalMovesForSelected.forEach((square) => {
      styles[square] = {
        background: 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%',
      }
    })

    if (selectedSquare) {
      styles[selectedSquare] = {
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
      }
    }

    return styles
  }, [selectedSquare, legalMovesForSelected])

  // Un pion qui atteint la dernière rangée doit être promu
  const isPromotionMove = useCallback(
    (from: Square, to: Square): boolean => {
      const piece = engine.getPiece(from)
      if (!piece || piece.type !== 'p') return false

      const toRank = to[1]
      return (piece.color === 'w' && toRank === '8') || (piece.color === 'b' && toRank === '1')
    },
    [engine]
  )

  const handleSquareClick = useCallback(
    (square: BoardSquare) => {
      const typedSquare = square as Square

      // Si une case est déjà sélectionnée et qu'on clique sur une destination légale → on joue
      if (selectedSquare && legalMovesForSelected.includes(typedSquare)) {
        if (isPromotionMove(selectedSquare, typedSquare)) {
          setPromotionMove({ from: selectedSquare, to: typedSquare })
          selectSquare(null)
          return
        }

        makeMove({
          from: selectedSquare,
          to: typedSquare,
        })
        selectSquare(null)
        return
      }

      // Sinon on sélectionne la case cliquée
      selectSquare(typedSquare)
    },
    [selectedSquare, legalMovesForSelected, makeMove, selectSquare, isPromotionMove]
  )

  const handlePieceDrop = useCallback(
    (sourceSquare: BoardSquare, targetSquare: BoardSquare): boolean => {
      const from = sourceSquare as Square
      const to = targetSquare as Square

      if (isPromotionMove(from, to)) {
        setPromotionMove({ from, to })
        return true
      }

      const result = makeMove({ from, to })
      return result
    },
    [makeMove, isPromotionMove]
  )

  const handlePromotionSelect = useCallback(
    (piece: PieceSymbol) => {
      if (!promotionMove) return

      makeMove({
        from: promotionMove.from,
        to: promotionMove.to,
        promotion: piece,
      })

      setPromotionMove(null)
    },
    [promotionMove, makeMove]
  )

  // On ne peut déplacer que ses propres pièces, et uniquement si la partie est en cours
  const isDraggablePiece = useCallback(
    ({ piece }: { piece: string }) => {
      if (gameStatus !== 'playing') return false

      const isWhitePiece = piece[0] === 'w'
      const isWhiteTurn = turn === 'w'

      return isWhitePiece === isWhiteTurn
    },
    [turn, gameStatus]
  )

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="rounded-lg overflow-hidden shadow-2xl"
        style={{ width: boardWidth, height: boardWidth }}
      >
        <Chessboard
          position={currentPosition}
          onSquareClick={handleSquareClick}
          onPieceDrop={handlePieceDrop}
          boardOrientation={orientation}
          customSquareStyles={customSquareStyles}
          boardWidth={boardWidth}
          arePiecesDraggable={true}
          isDraggablePiece={isDraggablePiece}
          customBoardStyle={{
            borderRadius: '4px',
          }}
          customDarkSquareStyle={{
            backgroundColor: 'var(--board-dark)',
          }}
          customLightSquareStyle={{
            backgroundColor: 'var(--board-light)',
          }}
          animationDuration={200}
        />
      </div>

      {/* Fenêtre de choix de promotion (apparaît uniquement quand un pion atteint la dernière rangée) */}
      {promotionMove && (
        <PromotionDialog color={turn} onSelect={handlePromotionSelect} />
      )}
    </div>
  )
}

export default ChessBoard
