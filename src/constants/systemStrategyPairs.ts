/**
 * System-Strategy Pairing Configuration
 *
 * This file enforces HARD LOCK between counting systems and their strategy sets.
 * Each counting system must use its dedicated strategy set - no mixing allowed.
 *
 * Pairings:
 * - Hi-Lo ↔ Illustrious 18
 * - KO ↔ KO Preferred
 * - Omega II ↔ Omega II Matrix
 * - Zen Count ↔ Zen Indices
 * - CAC2 ↔ Catch 22
 */

import { StrategySet } from '../types/strategy.types';
import { ILLUSTRIOUS_18 } from './strategies/illustrious18';
import { KO_PREFERRED } from './strategies/koPreferred';
import { OMEGA_MATRIX } from './strategies/omegaMatrix';
import { ZEN_INDICES } from './strategies/zenIndices';
import { CATCH_22 } from './strategies/catch22';

/**
 * Map of counting system ID to its paired strategy set
 *
 * This is the single source of truth for system-strategy pairing.
 */
export const SYSTEM_STRATEGY_MAP: Record<string, StrategySet> = {
  'hi-lo': ILLUSTRIOUS_18,
  'ko': KO_PREFERRED,
  'omega-ii': OMEGA_MATRIX,
  'zen': ZEN_INDICES,
  'cac2': CATCH_22,
};

/**
 * All available strategy sets
 *
 * Use this for iteration or lookup by strategy set ID.
 */
export const ALL_STRATEGY_SETS: StrategySet[] = [
  ILLUSTRIOUS_18,
  KO_PREFERRED,
  OMEGA_MATRIX,
  ZEN_INDICES,
  CATCH_22,
];

/**
 * Get strategy set for a counting system
 *
 * @param systemId - Counting system ID ("hi-lo", "ko", "omega-ii", "zen", "cac2")
 * @returns The paired StrategySet
 * @throws Error if system ID is invalid
 */
export function getStrategySetForSystem(systemId: string): StrategySet {
  const strategySet = SYSTEM_STRATEGY_MAP[systemId];
  if (!strategySet) {
    throw new Error(`No strategy set found for counting system: ${systemId}`);
  }
  return strategySet;
}

/**
 * Validate system-strategy pairing
 *
 * Checks if a given system ID and strategy set ID are correctly paired.
 *
 * @param systemId - Counting system ID
 * @param strategySetId - Strategy set ID
 * @returns true if pairing is valid, false otherwise
 */
export function validateSystemStrategyPairing(
  systemId: string,
  strategySetId: string
): boolean {
  const strategySet = SYSTEM_STRATEGY_MAP[systemId];
  return strategySet !== undefined && strategySet.id === strategySetId;
}

/**
 * Get strategy set by ID
 *
 * @param strategySetId - Strategy set ID
 * @returns StrategySet or undefined if not found
 */
export function getStrategySetById(strategySetId: string): StrategySet | undefined {
  return ALL_STRATEGY_SETS.find((set) => set.id === strategySetId);
}
