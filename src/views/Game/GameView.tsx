// Vue principale de jeu - plateau, timers, historique et contrôles

import { useEffect, useRef } from 'react'
import { useGameStore } from '@/stores/useGameStore'
import { useTimerStore } from '@/stores/useTimerStore'
import { useStockfishStore } from '@/stores/useStockfishStore'
import { ChessBoard } from '@/components/organisms/ChessBoard/ChessBoard'
import { TimerDisplay } from '@/components/molecules/TimerDisplay'
import { isTimeControlActive } from '@/core/timer/TimeControls'
import type { Square, PieceSymbol } from '@/core/engine/types'

interface GameViewProps {
  onBackToMenu: () => void
}

export function GameView({ onBackToMenu }: GameViewProps) {
  const {
    moveHistory,
    turn,
    inCheck,
    gameStatus,
    mode,
    resetGame,
    undoMove,
    engine,
    makeMove,
  } = useGameStore()

  const {
    initialize: initializeStockfish,
    isInitialized: stockfishInitialized,
    isThinking,
    requestMove,
    difficulty,
  } = useStockfishStore()

  const {
    whiteTime,
    blackTime,
    activeColor,
    preset,
    start: startTimer,
    switchTimer,
    stop: stopTimer,
    reset: resetTimer,
  } = useTimerStore()

  const previousMoveCountRef = useRef(0)
  const hasTimerStartedRef = useRef(false)

  // Gère le chronomètre en fonction des coups joués et de l'état de la partie
  useEffect(() => {
    if (!isTimeControlActive(preset)) return

    if (gameStatus !== 'playing') {
      stopTimer()
      hasTimerStartedRef.current = false
      return
    }

    // Premier coup joué : on démarre le timer des noirs (les blancs viennent de jouer)
    if (moveHistory.length === 1 && !hasTimerStartedRef.current) {
      startTimer('b')
      hasTimerStartedRef.current = true
      previousMoveCountRef.current = 1
      return
    }

    // Un nouveau coup a été joué : on passe le timer à l'autre joueur
    if (moveHistory.length > previousMoveCountRef.current && hasTimerStartedRef.current) {
      const previousTurn = turn === 'w' ? 'b' : 'w'
      switchTimer(previousTurn, turn)
      previousMoveCountRef.current = moveHistory.length
    }

    // Un coup a été annulé : on remet le timer à l'état correct
    if (moveHistory.length < previousMoveCountRef.current) {
      if (moveHistory.length === 0) {
        stopTimer()
        hasTimerStartedRef.current = false
      }
      previousMoveCountRef.current = moveHistory.length
    }
  }, [moveHistory.length, turn, gameStatus, preset, startTimer, switchTimer, stopTimer])

  // Initialise le moteur IA dès qu'on entre en mode IA
  useEffect(() => {
    if (mode === 'ai' && !stockfishInitialized) {
      initializeStockfish().catch((error) => {
        console.error('Failed to initialize AI engine:', error)
      })
    }
  }, [mode, stockfishInitialized, initializeStockfish])

  // Déclenche le coup de l'IA quand c'est son tour (joue les noirs)
  useEffect(() => {
    if (
      mode === 'ai' &&
      stockfishInitialized &&
      gameStatus === 'playing' &&
      turn === 'b' &&
      !isThinking
    ) {
      const currentFen = engine.getFen()

      // Petit délai pour que l'IA paraisse plus naturelle
      const thinkingDelay = difficulty === 'beginner' ? 500 : 300

      const timeout = setTimeout(() => {
        requestMove(currentFen)
          .then((uciMove) => {
            // Découpe le coup UCI format "e2e4" ou "e7e8q" (avec promotion)
            const from = uciMove.substring(0, 2) as Square
            const to = uciMove.substring(2, 4) as Square
            const promotion = uciMove.length > 4 ? (uciMove[4] as PieceSymbol) : undefined

            makeMove({ from, to, promotion })
          })
          .catch((error) => {
            console.error('AI move error:', error)
          })
      }, thinkingDelay)

      return () => clearTimeout(timeout)
    }
  }, [
    mode,
    stockfishInitialized,
    gameStatus,
    turn,
    isThinking,
    difficulty,
    engine,
    requestMove,
    makeMove,
  ])

  const handleResetGame = () => {
    resetGame()
    resetTimer()
    hasTimerStartedRef.current = false
    previousMoveCountRef.current = 0
  }

  const handleBackToMenu = () => {
    stopTimer()
    onBackToMenu()
  }

  const getTurnDisplay = () => {
    return turn === 'w' ? '⚪ Blancs' : '⚫ Noirs'
  }

  const getStatusDisplay = () => {
    if (gameStatus === 'checkmate') {
      return turn === 'w' ? '⚫ Noirs gagnent par échec et mat!' : '⚪ Blancs gagnent par échec et mat!'
    }
    if (gameStatus === 'stalemate') return 'Match nul - Pat'
    if (gameStatus === 'draw') return 'Match nul'
    if (inCheck) return '⚠️ Échec!'
    return getTurnDisplay()
  }

  return (
    <div className="flex h-full w-full bg-bg-primary">
      {/* Panneau gauche - contrôles et historique */}
      <div className="w-64 bg-bg-secondary p-6 flex flex-col gap-6 border-r border-accent-primary/20">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text-primary">Contrôles</h2>

          <button
            onClick={handleBackToMenu}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            ← Retour au menu
          </button>

          <button
            onClick={handleResetGame}
            className="w-full px-4 py-2 bg-accent-primary text-white rounded hover:bg-accent-secondary transition-colors"
          >
            🔄 Nouvelle partie
          </button>

          <button
            onClick={undoMove}
            disabled={moveHistory.length === 0}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ↩️ Annuler
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-text-primary">Statut</h3>
          <div className="p-3 bg-bg-primary rounded border border-accent-primary/30">
            <p className="text-text-primary font-medium text-center">
              {getStatusDisplay()}
            </p>
          </div>

          {/* Indicateur de réflexion de l'IA */}
          {mode === 'ai' && isThinking && (
            <div className="p-3 bg-blue-900/30 border border-blue-500 rounded animate-pulse">
              <p className="text-blue-400 font-bold text-center">🤖 IA réfléchit...</p>
            </div>
          )}
        </div>

        {/* Historique des coups en notation algébrique */}
        <div className="space-y-2 flex-1 overflow-hidden">
          <h3 className="text-lg font-semibold text-text-primary">
            Historique ({moveHistory.length} coups)
          </h3>
          <div className="bg-bg-primary rounded p-2 h-64 overflow-y-auto text-text-secondary text-sm font-mono">
            {moveHistory.length === 0 ? (
              <p className="text-center text-text-secondary/50 mt-4">Aucun coup joué</p>
            ) : (
              <div className="space-y-1">
                {moveHistory.map((move, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between hover:bg-accent-primary/10 px-2 py-1 rounded"
                  >
                    <span className="text-text-secondary/70">{Math.floor(index / 2) + 1}.</span>
                    <span className="flex-1 ml-2">{move.san}</span>
                    <span className="text-text-secondary/50 text-xs">
                      {move.from}-{move.to}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Centre - le plateau */}
      <div className="flex-1 flex items-center justify-center p-8">
        <ChessBoard boardWidth={Math.min(600, window.innerWidth - 400)} />
      </div>

      {/* Panneau droit - timers et infos */}
      <div className="w-64 bg-bg-secondary p-6 flex flex-col gap-6 border-l border-accent-primary/20">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text-primary">Informations</h2>

          {/* Chronomètres (uniquement si un contrôle du temps est actif) */}
          {isTimeControlActive(preset) && (
            <div className="space-y-3">
              <TimerDisplay
                time={blackTime}
                color="b"
                isActive={activeColor === 'b'}
              />
              <TimerDisplay
                time={whiteTime}
                color="w"
                isActive={activeColor === 'w'}
              />
            </div>
          )}

          <div className="space-y-2">
            <div className="p-3 bg-bg-primary rounded">
              <p className="text-text-secondary text-sm">Tour à jouer</p>
              <p className="text-text-primary font-bold text-lg">{getTurnDisplay()}</p>
            </div>

            <div className="p-3 bg-bg-primary rounded">
              <p className="text-text-secondary text-sm">Nombre de coups</p>
              <p className="text-text-primary font-bold text-lg">{moveHistory.length}</p>
            </div>

            {inCheck && (
              <div className="p-3 bg-red-900/30 border border-red-500 rounded animate-pulse">
                <p className="text-red-400 font-bold text-center">⚠️ ÉCHEC ⚠️</p>
              </div>
            )}

            {gameStatus !== 'playing' && (
              <div className="p-3 bg-green-900/30 border border-green-500 rounded">
                <p className="text-green-400 font-bold text-center">Partie terminée</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-end text-text-secondary text-xs space-y-1">
          <p>⌨️ Raccourcis:</p>
          <p>• Ctrl+Z: Annuler</p>
          <p>• Ctrl+N: Nouvelle partie</p>
          <p>• Esc: Menu</p>
        </div>
      </div>
    </div>
  )
}

export default GameView
