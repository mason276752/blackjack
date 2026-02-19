/**
 * Strategy Resolver - Handles deviation lookup and application
 *
 * This class encapsulates the logic for finding and applying strategy deviations
 * (index plays) based on the current count and game situation.
 */

import { Card } from '../../types/card.types';
import { StrategySet, StrategyDeviation } from '../../types/strategy.types';

/**
 * Normalize a card rank to standard format
 *
 * @param rank - Card rank (might be "10", "J", "Q", "K")
 * @returns Normalized rank for comparison
 */
function normalizeRank(rank: string): string {
  // Face cards are treated as "10" for deviation lookup
  if (['J', 'Q', 'K'].includes(rank)) {
    return '10';
  }
  return rank;
}

/**
 * Strategy deviation resolver
 *
 * Provides methods to find applicable deviations and determine if they should be applied
 * based on the current effective count (True Count for balanced systems, Running Count for unbalanced).
 */
export class StrategyResolver {
  /**
   * Create a new strategy resolver
   *
   * @param strategySet - The strategy set to use for deviation lookup
   */
  constructor(private strategySet: StrategySet) {}

  /**
   * Find applicable deviation for the current situation
   *
   * Searches the strategy set for a deviation matching:
   * - Player's hand value/composition
   * - Dealer's up card
   *
   * Priority: Pair deviations are checked first, then hard/soft hand deviations.
   *
   * @param handValue - Player's hand total value (e.g., 16, 17)
   * @param dealerCard - Dealer's up card
   * @param isPairHand - Whether the hand is a pair
   * @param pairRank - If pair, the rank of the paired cards (e.g., "10" for 10,10)
   * @returns Matching deviation or undefined if none found
   */
  findDeviation(
    handValue: number,
    dealerCard: Card,
    isPairHand: boolean,
    pairRank?: string
  ): StrategyDeviation | undefined {
    const dealerValue = normalizeRank(dealerCard.rank as any);

    // Priority 1: Check for pair deviations (e.g., "10,10" vs dealer)
    if (isPairHand && pairRank) {
      const normalizedPairRank = normalizeRank(pairRank);
      const pairKey = `${normalizedPairRank},${normalizedPairRank}`;
      const pairDeviation = this.strategySet.deviations.find(
        (d) => d.hand === pairKey && d.dealer === dealerValue
      );
      if (pairDeviation) {
        return pairDeviation;
      }
    }

    // Priority 2: Check for hard/soft hand deviations (e.g., "16" vs dealer)
    const handKey = String(handValue);
    return this.strategySet.deviations.find(
      (d) => d.hand === handKey && d.dealer === dealerValue
    );
  }

  /**
   * Determine if a deviation should be applied based on count
   *
   * Handles both positive and negative thresholds:
   * - Positive threshold: Apply when count >= threshold (e.g., "stand at TC +5 or higher")
   * - Negative threshold: Apply when count <= threshold (e.g., "hit at TC -2 or lower")
   *
   * @param deviation - The deviation to check
   * @param effectiveCount - Current effective count (TC for balanced, RC for unbalanced)
   * @returns true if deviation should be applied
   */
  shouldDeviate(deviation: StrategyDeviation, effectiveCount: number): boolean {
    // Negative threshold: Deviate when count is at or below threshold
    // Example: "Hit 13 vs 2 at TC <= -1" → deviate if TC is -1, -2, -3, etc.
    if (deviation.threshold < 0) {
      return effectiveCount <= deviation.threshold;
    }

    // Positive threshold: Deviate when count is at or above threshold
    // Example: "Stand 16 vs 10 at TC >= 0" → deviate if TC is 0, +1, +2, etc.
    return effectiveCount >= deviation.threshold;
  }

  /**
   * Determine if insurance should be taken
   *
   * Insurance decision is based on the system-specific insurance index.
   * Different counting systems have different optimal insurance thresholds:
   * - Hi-Lo: TC +3
   * - KO: RC +3
   * - Omega II: TC +6 (approximately 2x Hi-Lo due to multi-level counting)
   * - Zen Count: TC +3
   *
   * @param effectiveCount - Current effective count (TC for balanced, RC for unbalanced)
   * @param insuranceIndex - System-specific insurance threshold from CountingSystem
   * @returns true if insurance should be taken
   */
  shouldTakeInsurance(effectiveCount: number, insuranceIndex: number): boolean {
    return effectiveCount >= insuranceIndex;
  }

  /**
   * Get the strategy set being used
   *
   * @returns The current strategy set
   */
  getStrategySet(): StrategySet {
    return this.strategySet;
  }

  /**
   * Get all deviations in this strategy set
   *
   * Useful for displaying available index plays in UI.
   *
   * @returns Array of all deviations
   */
  getAllDeviations(): StrategyDeviation[] {
    return this.strategySet.deviations;
  }

  /**
   * Get deviation count
   *
   * @returns Number of deviations in this strategy set
   */
  getDeviationCount(): number {
    return this.strategySet.deviations.length;
  }
}
