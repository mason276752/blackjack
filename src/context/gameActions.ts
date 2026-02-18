import { Card } from '../types/card.types';
import { GameRules, CountingSystem } from '../types/game.types';

export type GameAction =
  // Configuration
  | { type: 'SET_RULES'; rules: GameRules }
  | { type: 'RESET_GAME' }

  // Betting phase
  | { type: 'PLACE_BET'; amount: number }
  | { type: 'CLEAR_BET' }

  // Dealing phase
  | { type: 'DEAL_INITIAL_CARDS'; playerCards: Card[]; dealerCards: Card[] }
  | { type: 'OFFER_INSURANCE' }
  | { type: 'TAKE_INSURANCE' }
  | { type: 'DECLINE_INSURANCE' }

  // Player actions (legacy - will be deprecated)
  | { type: 'HIT'; card: Card }
  | { type: 'STAND' }
  | { type: 'DOUBLE_DOWN'; card: Card }
  | { type: 'SPLIT'; newCards: [Card, Card] }
  | { type: 'SURRENDER' }

  // Compound player actions (batched for performance)
  | { type: 'HIT_CARD'; card: Card; cardsRemaining: number; totalCards: number }
  | { type: 'DOUBLE_DOWN_CARD'; card: Card; cardsRemaining: number; totalCards: number }
  | { type: 'SPLIT_CARDS'; newCards: [Card, Card]; cardsRemaining: number; totalCards: number }

  // Dealer actions (legacy - will be deprecated)
  | { type: 'DEALER_REVEAL_HOLE_CARD' }
  | { type: 'DEALER_HIT'; card: Card }
  | { type: 'DEALER_STAND' }

  // Compound dealer actions (batched for performance)
  | { type: 'DEALER_HIT_CARD'; card: Card; cardsRemaining: number; totalCards: number }

  // Resolution
  | { type: 'RESOLVE_HANDS'; dealerValue: number; dealerBlackjack: boolean }
  | { type: 'COMPLETE_ROUND' }

  // Card counting
  | { type: 'UPDATE_COUNT'; card: Card }
  | { type: 'RESET_COUNT' }
  | { type: 'SET_COUNTING_SYSTEM'; system: CountingSystem }

  // UI toggles
  | { type: 'TOGGLE_STRATEGY_HINT' }
  | { type: 'TOGGLE_COUNT_DISPLAY' }
  | { type: 'TOGGLE_STATS_PANEL' }

  // Shoe management
  | { type: 'SHUFFLE_SHOE' }
  | { type: 'UPDATE_SHOE_STATE'; cardsRemaining: number; totalCards: number }
  | { type: 'SET_MESSAGE'; message: string };
