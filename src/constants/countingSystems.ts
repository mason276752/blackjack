/**
 * Card counting system definitions
 *
 * Each counting system is paired with a specific strategy set (index plays).
 * This pairing is HARD LOCKED - you cannot mix systems and strategies.
 */

import { CountingSystem } from '../types/game.types';

/**
 * Hi-Lo Counting System
 *
 * Level: 1 (single-level)
 * Type: Balanced (requires true count conversion)
 * Paired Strategy: Illustrious 18
 *
 * Card values:
 * - Low cards (2-6): +1 (good for player when removed)
 * - Neutral (7-9): 0
 * - High cards (10-A): -1 (bad for player when removed)
 *
 * Most popular system due to simplicity and effectiveness.
 */
export const HI_LO: CountingSystem = {
  id: 'hi-lo',
  name: 'Hi-Lo',
  values: {
    '2': 1,
    '3': 1,
    '4': 1,
    '5': 1,
    '6': 1,
    '7': 0,
    '8': 0,
    '9': 0,
    '10': -1,
    'J': -1,
    'Q': -1,
    'K': -1,
    'A': -1,
  },
  isBalanced: true,
  bettingCorrelation: 0.97,
  playingEfficiency: 0.51,
  strategySetId: 'illustrious18',
  insuranceIndex: 3, // Take insurance at TC >= +3
};

/**
 * KO (Knock-Out) Counting System
 *
 * Level: 1 (single-level)
 * Type: Unbalanced (uses running count directly, no TC conversion needed)
 * Paired Strategy: KO Preferred
 *
 * Card values:
 * - Low cards (2-7): +1 (note: 7 is counted, unlike Hi-Lo)
 * - Neutral (8-9): 0
 * - High cards (10-A): -1
 *
 * Easier than Hi-Lo because no true count conversion required.
 * Uses pivot points: IRC (Initial Running Count), Key Count, Pivot.
 */
export const KO: CountingSystem = {
  id: 'ko',
  name: 'KO',
  values: {
    '2': 1,
    '3': 1,
    '4': 1,
    '5': 1,
    '6': 1,
    '7': 1, // Different from Hi-Lo!
    '8': 0,
    '9': 0,
    '10': -1,
    'J': -1,
    'Q': -1,
    'K': -1,
    'A': -1,
  },
  isBalanced: false, // Unbalanced system
  bettingCorrelation: 0.98,
  playingEfficiency: 0.55,
  strategySetId: 'ko_preferred',
  insuranceIndex: 3, // Take insurance at RC >= +3
};

/**
 * Omega II Counting System
 *
 * Level: 2 (multi-level)
 * Type: Balanced (requires true count conversion)
 * Paired Strategy: Omega II Matrix
 *
 * Card values:
 * - +2: 4, 5, 6
 * - +1: 2, 3, 7
 * - 0: 8, 9, A (Ace is neutral!)
 * - -1: 9 (wait, this is listed in neutral above - typo in plan?)
 * - -2: 10, J, Q, K
 *
 * More accurate than Hi-Lo but requires more mental effort.
 * Thresholds are approximately 2x Hi-Lo values due to multi-level counting.
 */
export const OMEGA_II: CountingSystem = {
  id: 'omega-ii',
  name: 'Omega II',
  values: {
    '2': 1,
    '3': 1,
    '4': 2,
    '5': 2,
    '6': 2,
    '7': 1,
    '8': 0,
    '9': 0, // Neutral, not -1
    '10': -2,
    'J': -2,
    'Q': -2,
    'K': -2,
    'A': 0, // Ace is neutral in Omega II
  },
  isBalanced: true,
  bettingCorrelation: 0.99,
  playingEfficiency: 0.67,
  strategySetId: 'omega_matrix',
  insuranceIndex: 6, // Take insurance at TC >= +6 (approximately 2x Hi-Lo)
};

/**
 * Zen Count Counting System
 *
 * Level: 2 (multi-level)
 * Type: Balanced (requires true count conversion)
 * Paired Strategy: Zen Indices
 *
 * Card values:
 * - +2: 4, 5, 6
 * - +1: 2, 3, 7
 * - 0: 8, 9
 * - -1: A (Ace is negative, unlike Omega II)
 * - -2: 10, J, Q, K
 *
 * Similar to Omega II but treats Ace as -1 instead of 0.
 * This gives better playing efficiency than Omega II.
 * Developed by Arnold Snyder.
 */
export const ZEN_COUNT: CountingSystem = {
  id: 'zen',
  name: 'Zen Count',
  values: {
    '2': 1,
    '3': 1,
    '4': 2,
    '5': 2,
    '6': 2,
    '7': 1,
    '8': 0,
    '9': 0,
    '10': -2,
    'J': -2,
    'Q': -2,
    'K': -2,
    'A': -1, // Different from Omega II!
  },
  isBalanced: true,
  bettingCorrelation: 0.96,
  playingEfficiency: 0.63,
  strategySetId: 'zen_indices',
  insuranceIndex: 3, // Take insurance at TC >= +3
};

/**
 * CAC2 (Catch And Count 2) Counting System
 *
 * Level: 2 (multi-level)
 * Type: Balanced (requires true count conversion)
 * Paired Strategy: Catch 22
 *
 * Card values:
 * - +2: 3, 4, 5
 * - +1: 2, 6, 7
 * - 0: 8, 9
 * - -1: A (Ace is negative)
 * - -2: 10, J, Q, K
 *
 * CAC2 is a mathematical product in the public domain.
 * Features 22 index plays (the most of any system implemented here).
 * Similar to Omega II but with different tag distribution.
 */
export const CAC2: CountingSystem = {
  id: 'cac2',
  name: 'CAC2',
  values: {
    '2': 1,
    '3': 2,
    '4': 2,
    '5': 2,
    '6': 1,
    '7': 1,
    '8': 0,
    '9': 0,
    '10': -2,
    'J': -2,
    'Q': -2,
    'K': -2,
    'A': -1,
  },
  isBalanced: true,
  bettingCorrelation: 0.98, // Estimated, similar to KO
  playingEfficiency: 0.60, // Estimated, between Hi-Lo and Omega II
  strategySetId: 'catch22',
  insuranceIndex: 3, // Take insurance at TC >= +3
};

/**
 * All available counting systems
 *
 * Use this array for UI display (counting system selector).
 */
export const ALL_COUNTING_SYSTEMS: CountingSystem[] = [
  HI_LO,
  KO,
  OMEGA_II,
  ZEN_COUNT,
  CAC2,
];

/**
 * Get counting system by ID
 *
 * @param id - System ID ("hi-lo", "ko", "omega-ii", "zen")
 * @returns CountingSystem or undefined if not found
 */
export function getCountingSystemById(id: string): CountingSystem | undefined {
  return ALL_COUNTING_SYSTEMS.find((system) => system.id === id);
}

/**
 * Validate that a counting system exists
 *
 * @param id - System ID to validate
 * @returns true if system exists
 */
export function isValidCountingSystemId(id: string): boolean {
  return ALL_COUNTING_SYSTEMS.some((system) => system.id === id);
}
