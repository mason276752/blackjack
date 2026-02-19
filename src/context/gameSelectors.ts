/**
 * Selector functions for derived state
 * These compute values on-demand instead of storing in state
 */

import { GameState } from '../types/game.types';
import { StrategySet } from '../types/strategy.types';
import { SYSTEM_STRATEGY_MAP } from '../constants/systemStrategyPairs';

/**
 * Calculate true count from running count and cards remaining
 *
 * True count = Running count / Decks remaining
 * Used for bet sizing and strategy deviations in card counting
 *
 * @param runningCount - Current running count from card counting system
 * @param cardsRemaining - Number of cards left in shoe
 * @returns True count rounded to 1 decimal place, or 0 if no decks remain
 */
export function getTrueCount(runningCount: number, cardsRemaining: number): number {
  const decksRemaining = cardsRemaining / 52;

  if (decksRemaining <= 0) {
    return 0;
  }

  return Math.round((runningCount / decksRemaining) * 10) / 10;
}

/**
 * Get the active strategy set for the current counting system
 *
 * Returns the strategy set that is paired with the active counting system.
 * The pairing is hard-locked:
 * - Hi-Lo → Illustrious 18
 * - KO → KO Preferred
 * - Omega II → Omega II Matrix
 * - Zen Count → Zen Indices
 *
 * @param state - Current game state
 * @returns The paired strategy set
 * @throws Error if no strategy set found for the system (should never happen with valid state)
 */
export function getActiveStrategySet(state: GameState): StrategySet {
  const strategySet = SYSTEM_STRATEGY_MAP[state.countingSystem.id];
  if (!strategySet) {
    throw new Error(`No strategy set found for counting system: ${state.countingSystem.id}`);
  }
  return strategySet;
}

/**
 * Get effective count for strategy decisions
 *
 * Returns:
 * - True Count for balanced systems (Hi-Lo, Omega II, Zen Count)
 * - Running Count for unbalanced systems (KO)
 *
 * This is the count value that should be used for:
 * - Strategy deviation decisions (index plays)
 * - Insurance decisions
 * - Bet sizing (though bet sizing typically uses TC for all systems)
 *
 * @param state - Current game state
 * @returns Effective count (TC or RC depending on system type)
 */
export function getEffectiveCount(state: GameState): number {
  if (state.countingSystem.isBalanced) {
    // Balanced systems: Convert RC to TC
    return getTrueCount(state.runningCount, state.cardsRemaining);
  }

  // Unbalanced systems (KO): Use RC directly
  return state.runningCount;
}
