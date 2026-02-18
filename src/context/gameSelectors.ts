/**
 * Selector functions for derived state
 * These compute values on-demand instead of storing in state
 */

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
