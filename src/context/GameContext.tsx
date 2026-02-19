import React, { createContext, useContext, useReducer, useMemo, useEffect, ReactNode } from 'react';
import { GameState } from '../types/game.types';
import { GameAction } from './gameActions';
import { gameReducer, createInitialState } from './gameReducer';
import { Shoe } from '../lib/deck/Shoe';
import { DealerAI } from '../lib/dealer/DealerAI';
import { BasicStrategy } from '../lib/strategy/BasicStrategy';
import { saveGameState, loadGameState } from '../lib/storage/gameStorage';

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  shoe: Shoe;
  dealerAI: DealerAI;
  strategy: BasicStrategy;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  // Initialize state with saved data or defaults
  const [state, dispatch] = useReducer(gameReducer, createInitialState(), (initial) => {
    const savedData = loadGameState();
    if (savedData) {
      console.log('[GameContext] Loaded saved game state from localStorage');
      return {
        ...initial,
        rules: savedData.rules,
        balance: savedData.balance,
        statistics: {
          ...savedData.statistics,
          currentBalance: savedData.balance,
        },
        countingSystem: savedData.countingSystem,
      };
    }
    return initial;
  });

  // Create instances that depend on state.rules
  const shoe = useMemo(
    () => new Shoe(state.rules.deckCount, state.rules.penetration),
    [state.rules.deckCount, state.rules.penetration]
  );

  const dealerAI = useMemo(
    () => new DealerAI(state.rules),
    [state.rules]
  );

  const strategy = useMemo(
    () => new BasicStrategy(state.rules),
    [state.rules]
  );

  // Auto-save game state to localStorage whenever it changes
  useEffect(() => {
    // Don't save during initial mount
    if (state.statistics.handsPlayed === 0 && state.balance === state.statistics.startingBalance) {
      return;
    }

    // Save to localStorage with debounce
    const timeoutId = setTimeout(() => {
      saveGameState(state);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [state.balance, state.rules, state.statistics, state.countingSystem]);

  const value = useMemo(
    () => ({ state, dispatch, shoe, dealerAI, strategy }),
    [state, shoe, dealerAI, strategy]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
