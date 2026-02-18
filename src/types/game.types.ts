import { Card } from './card.types';
import { HandResult, SessionStats, CompletedHand } from './stats.types';

export type GamePhase = 'betting' | 'dealing' | 'player_turn' | 'dealer_turn' | 'resolution' | 'game_over';

export type HandStatus = 'active' | 'stand' | 'bust' | 'blackjack' | 'surrender';

export interface GameRules {
  // Deck configuration
  deckCount: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  penetration: number; // 0.5 to 0.9 (percentage)

  // Dealer rules
  dealerHitsSoft17: boolean; // H17 vs S17

  // Payout
  blackjackPayout: 1.5 | 1.2; // 3:2 or 6:5

  // Player options
  doubleAfterSplit: boolean; // DAS
  lateSurrender: boolean;
  maxSplits: number; // 0-3 (how many times can split)
  canResplitAces: boolean;
  canHitSplitAces: boolean;

  // Insurance
  insuranceAllowed: boolean;

  // Optional: Double restrictions
  doubleOn: 'any' | '9-11' | '10-11';
}

export interface PlayerHand {
  id: string;
  cards: Card[];
  value: number;
  bet: number;
  status: HandStatus;
  doubled: boolean;
  split: boolean;
  splitCount: number; // Track split depth
  result?: HandResult;
  payout?: number;
}

export interface CountingSystem {
  name: string;
  values: Record<string, number>; // Card rank -> count value
  isBalanced: boolean;
  bettingCorrelation: number;
  playingEfficiency: number;
}

export interface GameState {
  // Game phase
  phase: GamePhase;

  // Configuration
  rules: GameRules;

  // Deck/Shoe state
  cardsRemaining: number;
  totalCards: number;
  penetrationReached: boolean;

  // Player state
  balance: number;
  currentBet: number;
  hands: PlayerHand[];
  activeHandIndex: number;
  insuranceBet: number;

  // Dealer state
  dealerHand: Card[];
  dealerValue: number;
  dealerHoleCardHidden: boolean;

  // Statistics
  statistics: SessionStats;

  // Card counting
  runningCount: number;
  countingSystem: CountingSystem;

  // UI state
  showStrategyHint: boolean;
  showCountDisplay: boolean;
  showStatsPanel: boolean;
  message: string; // Display messages to user

  // History for replay
  handHistory: CompletedHand[];
}

export type StrategyAction = 'H' | 'S' | 'D' | 'SP' | 'SU' | 'DS' | 'DH';
// H=Hit, S=Stand, D=Double, SP=Split, SU=Surrender, DS=Double or Stand, DH=Double or Hit
