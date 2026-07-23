import { useState, useCallback } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { CountdownOverlay } from './components/CountdownOverlay';
import { RaceScreen } from './components/RaceScreen';
import { ResultsScreen } from './components/ResultsScreen';
import type { GamePhase, FinishEntry } from './types';

function App() {
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [names, setNames] = useState<string[]>([]);
  const [finishOrder, setFinishOrder] = useState<FinishEntry[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const handleStartRace = useCallback((playerNames: string[]) => {
    setNames(playerNames);
    setPhase('countdown');
  }, []);

  const handleCountdownComplete = useCallback(() => {
    setPhase('racing');
  }, []);

  const handleRaceComplete = useCallback((order: FinishEntry[]) => {
    setFinishOrder(order);
    setPhase('results');
  }, []);

  const handleRaceAgain = useCallback(() => {
    setFinishOrder([]);
    setPhase('countdown');
  }, []);

  const handleEditNames = useCallback(() => {
    setFinishOrder([]);
    setPhase('setup');
  }, []);

  return (
    <div className="app">
      <button
        className="sound-toggle"
        onClick={() => setSoundEnabled(s => !s)}
        title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
      >
        {soundEnabled ? '🔊' : '🔇'}
      </button>

      {phase === 'setup' && (
        <SetupScreen onStart={handleStartRace} initialNames={names} />
      )}

      {phase === 'countdown' && (
        <CountdownOverlay
          onComplete={handleCountdownComplete}
          soundEnabled={soundEnabled}
        />
      )}

      {phase === 'racing' && (
        <RaceScreen
          names={names}
          onRaceComplete={handleRaceComplete}
          soundEnabled={soundEnabled}
        />
      )}

      {phase === 'results' && (
        <ResultsScreen
          finishOrder={finishOrder}
          onRaceAgain={handleRaceAgain}
          onEditNames={handleEditNames}
        />
      )}
    </div>
  );
}

export default App;
