import { GameRules } from '../types/game.types';

// Re-export counting systems from the new centralized location
export { HI_LO, KO, OMEGA_II, ZEN_COUNT, CAC2, ALL_COUNTING_SYSTEMS } from './countingSystems';

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

export const DEFAULT_STARTING_BALANCE = 25000;
export const DEFAULT_MIN_BET = 25;
export const DEFAULT_MAX_BET = 5000;
