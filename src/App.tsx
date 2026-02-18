import { GameProvider } from './context/GameContext';
import { GameBoard } from './components/game/GameBoard';
import { ErrorBoundary } from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <GameProvider>
        <GameBoard />
      </GameProvider>
    </ErrorBoundary>
  );
}

export default App;
