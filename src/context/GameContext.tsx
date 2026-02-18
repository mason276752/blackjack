import React, { createContext, useContext, useReducer, useMemo, ReactNode } from 'react';
import { GameState } from '../types/game.types';
import { GameAction } from './gameActions';
import { gameReducer, createInitialState } from './gameReducer';
import { Shoe } from '../lib/deck/Shoe';
import { DealerAI } from '../lib/dealer/DealerAI';
import { BasicStrategy } from '../lib/strategy/BasicStrategy';

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  shoe: Shoe;
  dealerAI: DealerAI;
  strategy: BasicStrategy;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, createInitialState());

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
