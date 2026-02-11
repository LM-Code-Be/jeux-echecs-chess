// Menu principal - choix du mode de jeu, du contrôle du temps et du niveau IA

import { useState } from 'react'
import type { GameMode } from '@/core/engine/types'
import type { TimeControlPreset } from '@/core/timer/types'
import type { DifficultyLevel } from '@/core/stockfish/types'
import { TIME_CONTROLS } from '@/core/timer/TimeControls'
import { DIFFICULTY_LEVELS } from '@/core/stockfish/DifficultyLevels'
import { useStockfishStore } from '@/stores/useStockfishStore'

interface MainMenuProps {
  onStartGame: (mode: GameMode, timeControl: TimeControlPreset) => void
}

export function MainMenu({ onStartGame }: MainMenuProps) {
  const [selectedTimeControl, setSelectedTimeControl] = useState<TimeControlPreset>('blitz')
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('casual')
  const { setDifficulty } = useStockfishStore()

  const timeControlOptions: TimeControlPreset[] = ['bullet', 'blitz', 'rapid', 'classical', 'fischer', 'none']
  const difficultyOptions: DifficultyLevel[] = ['beginner', 'casual', 'intermediate', 'advanced', 'expert']

  const handleStartAI = () => {
    setDifficulty(selectedDifficulty)
    onStartGame('ai', selectedTimeControl)
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-bg-primary">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-text-primary mb-2">♔ Échecs Pro ♔</h1>
          <p className="text-text-secondary text-lg">
            Jeu d'échecs avec IA et contrôle du temps
          </p>
        </div>

        <div className="space-y-6 max-w-md mx-auto">
          {/* Sélecteur de contrôle du temps */}
          <div className="space-y-3">
            <label className="text-text-primary font-semibold text-lg block">
              ⏱️ Contrôle du temps
            </label>
            <div className="grid grid-cols-3 gap-2">
              {timeControlOptions.map((preset) => {
                const tc = TIME_CONTROLS[preset]
                return (
                  <button
                    key={preset}
                    onClick={() => setSelectedTimeControl(preset)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedTimeControl === preset
                        ? 'bg-accent-primary text-white border-2 border-accent-primary'
                        : 'bg-bg-secondary text-text-secondary border-2 border-accent-primary/30 hover:border-accent-primary/60'
                    }`}
                  >
                    <div className="font-bold">{tc.name}</div>
                    {preset !== 'none' && (
                      <div className="text-xs opacity-80">
                        {tc.initialTime / 60}min {tc.increment > 0 && `+${tc.increment}s`}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sélecteur de niveau IA */}
          <div className="space-y-3">
            <label className="text-text-primary font-semibold text-lg block">
              🎯 Niveau IA
            </label>
            <div className="grid grid-cols-5 gap-2">
              {difficultyOptions.map((diff) => {
                const config = DIFFICULTY_LEVELS[diff]
                return (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                      selectedDifficulty === diff
                        ? 'bg-accent-primary text-white border-2 border-accent-primary'
                        : 'bg-bg-secondary text-text-secondary border-2 border-accent-primary/30 hover:border-accent-primary/60'
                    }`}
                  >
                    <div className="font-bold">{config.name}</div>
                    <div className="text-xs opacity-70">{config.elo}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Boutons de démarrage */}
          <div className="space-y-4">
            <button
              onClick={() => onStartGame('local', selectedTimeControl)}
              className="w-full px-8 py-4 bg-accent-primary text-white text-xl font-semibold rounded-lg hover:bg-accent-secondary transition-all transform hover:scale-105 shadow-lg"
            >
              <div className="flex items-center justify-center gap-3">
                <span>👥</span>
                <span>1 vs 1 Local</span>
              </div>
            </button>

            <button
              onClick={handleStartAI}
              className="w-full px-8 py-4 bg-accent-secondary text-white text-xl font-semibold rounded-lg hover:bg-accent-primary transition-all transform hover:scale-105 shadow-lg"
            >
              <div className="flex items-center justify-center gap-3">
                <span>🤖</span>
                <span>vs IA ({DIFFICULTY_LEVELS[selectedDifficulty].name})</span>
              </div>
            </button>
          </div>

          <div className="pt-4 text-text-secondary text-sm">
            <p>Drag &amp; drop ou clic pour déplacer les pièces</p>
            <p>La promotion du pion est disponible !</p>
          </div>
        </div>

        <div className="text-text-secondary text-xs">
          <p>Version 1.1.0</p>
        </div>
      </div>
    </div>
  )
}

export default MainMenu
