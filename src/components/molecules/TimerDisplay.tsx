// Affiche le chronomètre d'un joueur avec alerte visuelle quand le temps est bas

import { formatTime } from '@/core/timer/TimeControls'
import type { Color } from '@/core/engine/types'
import { cn } from '@/utils/cn'

interface TimerDisplayProps {
  time: number       // en millisecondes
  color: Color
  isActive: boolean
  isLowTime?: boolean
  playerName?: string
}

export function TimerDisplay({
  time,
  color,
  isActive,
  isLowTime = time < 30000, // alerte en dessous de 30 secondes
  playerName,
}: TimerDisplayProps) {
  const formattedTime = formatTime(time)
  const displayName = playerName || (color === 'w' ? 'Blancs' : 'Noirs')
  const icon = color === 'w' ? '⚪' : '⚫'

  return (
    <div
      className={cn(
        'p-4 rounded-lg border-2 transition-all duration-200',
        isActive && 'border-accent-primary bg-accent-primary/10 shadow-lg',
        !isActive && 'border-accent-primary/30 bg-bg-primary',
        isLowTime && isActive && 'animate-pulse border-red-500 bg-red-900/20'
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-text-secondary text-sm font-medium">
          {icon} {displayName}
        </span>
        {/* Indicateur clignotant quand le timer est actif */}
        {isActive && (
          <span className="text-xs text-accent-primary font-semibold animate-pulse">●</span>
        )}
      </div>

      {/* Temps affiché en gros - rouge quand il reste peu de temps */}
      <div
        className={cn(
          'text-3xl font-mono font-bold',
          isLowTime ? 'text-red-400' : 'text-text-primary'
        )}
      >
        {formattedTime}
      </div>

      {time === 0 && (
        <div className="mt-2 text-red-500 text-sm font-semibold">
          ⏱️ Temps écoulé !
        </div>
      )}
    </div>
  )
}

export default TimerDisplay
