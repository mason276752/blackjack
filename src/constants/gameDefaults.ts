import { GameRules, CountingSystem } from '../types/game.types';

// Default Vegas Strip rules
export const VEGAS_STRIP_RULES: GameRules = {
  deckCount: 6,
  penetration: 0.75,
  dealerHitsSoft17: false, // S17
  blackjackPayout: 1.5, // 3:2
  doubleAfterSplit: true,
  lateSurrender: true,
  maxSplits: 3,
  canResplitAces: false,
  canHitSplitAces: false,
  insuranceAllowed: true,
  doubleOn: 'any',
};

// Single deck rules (often less favorable)
export const SINGLE_DECK_RULES: GameRules = {
  deckCount: 1,
  penetration: 0.60,
  dealerHitsSoft17: true, // H17
  blackjackPayout: 1.2, // 6:5
  doubleAfterSplit: false,
  lateSurrender: false,
  maxSplits: 1,
  canResplitAces: false,
  canHitSplitAces: false,
  insuranceAllowed: true,
  doubleOn: '10-11',
};

// Atlantic City rules
export const ATLANTIC_CITY_RULES: GameRules = {
  deckCount: 8,
  penetration: 0.70,
  dealerHitsSoft17: false, // S17
  blackjackPayout: 1.5, // 3:2
  doubleAfterSplit: true,
  lateSurrender: true,
  maxSplits: 3,
  canResplitAces: false,
  canHitSplitAces: false,
  insuranceAllowed: true,
  doubleOn: 'any',
};

// Hi-Lo counting system (most popular)
export const HI_LO: CountingSystem = {
  name: 'Hi-Lo',
  values: {
    '2': 1, '3': 1, '4': 1, '5': 1, '6': 1,
    '7': 0, '8': 0, '9': 0,
    '10': -1, 'J': -1, 'Q': -1, 'K': -1, 'A': -1,
  },
  isBalanced: true,
  bettingCorrelation: 0.97,
  playingEfficiency: 0.51,
};

// KO (Knock-Out) counting system
export const KO: CountingSystem = {
  name: 'KO',
  values: {
    '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1,
    '8': 0, '9': 0,
    '10': -1, 'J': -1, 'Q': -1, 'K': -1, 'A': -1,
  },
  isBalanced: false,
  bettingCorrelation: 0.98,
  playingEfficiency: 0.55,
};

// Omega II counting system (advanced)
export const OMEGA_II: CountingSystem = {
  name: 'Omega II',
  values: {
    '2': 1, '3': 1, '7': 1,
    '4': 2, '5': 2, '6': 2,
    '8': 0, 'A': 0,
    '9': -1,
    '10': -2, 'J': -2, 'Q': -2, 'K': -2,
  },
  isBalanced: true,
  bettingCorrelation: 0.99,
  playingEfficiency: 0.67,
};

export const DEFAULT_STARTING_BALANCE = 25000;
export const DEFAULT_MIN_BET = 25;
export const DEFAULT_MAX_BET = 5000;
