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
  /**
   * Unique identifier for this counting system
   * Examples: "hi-lo", "ko", "omega-ii", "zen"
   */
  id: string;

  /**
   * Display name
   * Examples: "Hi-Lo", "KO", "Omega II", "Zen Count"
   */
  name: string;

  /**
   * Card rank to count value mapping
   * Examples: { '2': 1, '3': 1, ..., 'K': -1, 'A': -1 }
   */
  values: Record<string, number>;

  /**
   * Whether this is a balanced counting system
   * - true: Requires true count conversion (Hi-Lo, Omega II, Zen)
   * - false: Uses running count directly (KO)
   */
  isBalanced: boolean;

  /**
   * Betting correlation (0-1)
   * Higher is better for bet sizing decisions
   */
  bettingCorrelation: number;

  /**
   * Playing efficiency (0-1)
   * Higher is better for playing strategy decisions
   */
  playingEfficiency: number;

  /**
   * ID of the strategy set this system is paired with
   * Examples: "illustrious18", "ko_preferred", "omega_matrix", "zen_indices"
   *
   * IMPORTANT: This creates a hard lock between counting system and strategy.
   * Hi-Lo must use Illustrious 18, KO must use KO Preferred, etc.
   */
  strategySetId: string;

  /**
   * Insurance decision threshold
   * Take insurance when effective count >= this value
   * - For balanced systems: True Count threshold
   * - For unbalanced systems: Running Count threshold
   *
   * Typical values:
   * - Hi-Lo: TC +3
   * - KO: RC +3
   * - Omega II: TC +6 (approximately 2x Hi-Lo)
   * - Zen Count: TC +3
   */
  insuranceIndex: number;
}

/**
 * Balance snapshot - single balance record point
 */
export interface BalanceSnapshot {
  balance: number;        // Balance at this point
  timestamp: number;      // Unix timestamp (milliseconds)
  handNumber: number;     // Which hand number
}

/**
 * Balance history - keeps up to 1000 snapshots
 */
export interface BalanceHistory {
  snapshots: BalanceSnapshot[];
  maxSize: number;  // 1000
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
  lastBet: number; // Remember previous round bet amount
  hands: PlayerHand[];
  activeHandIndex: number;
  insuranceBet: number;

  // Dealer state
  dealerHand: Card[];
  dealerValue: number;
  dealerHoleCardHidden: boolean;

  // Statistics
  statistics: SessionStats;

  // Balance history tracking
  balanceHistory: BalanceHistory;

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
