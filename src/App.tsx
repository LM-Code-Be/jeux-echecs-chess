import { useState } from 'react'
import { MainMenu } from './views/Menu/MainMenu'
import { GameView } from './views/Game/GameView'
import { useGameStore } from './stores/useGameStore'
import { useTimerStore } from './stores/useTimerStore'
import type { GameMode } from './core/engine/types'
import type { TimeControlPreset } from './core/timer/types'

type View = 'menu' | 'game'

function App() {
  const [currentView, setCurrentView] = useState<View>('menu')
  const { newGame } = useGameStore()
  const { initialize: initializeTimer } = useTimerStore()

  const handleStartGame = (mode: GameMode, timeControl: TimeControlPreset) => {
    newGame(mode)
    initializeTimer(timeControl)
    setCurrentView('game')
  }

  const handleBackToMenu = () => {
    setCurrentView('menu')
  }

  return (
    <div className="h-full w-full overflow-hidden">
      {currentView === 'menu' && <MainMenu onStartGame={handleStartGame} />}
      {currentView === 'game' && <GameView onBackToMenu={handleBackToMenu} />}
    </div>
  )
}

export default App
