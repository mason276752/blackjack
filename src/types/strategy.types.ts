/**
 * Strategy deviation types for card counting systems
 *
 * These types define strategy index plays (deviations from basic strategy)
 * that are applied based on the card count.
 */

/**
 * A single strategy deviation (index play)
 *
 * Represents when to deviate from basic strategy based on count.
 * For example: "16 vs 10 - surrender at TC >= 0" (Illustrious 18)
 */
export interface StrategyDeviation {
  /**
   * Player's hand value or composition
   * Examples: "16" (hard 16), "A7" (soft 18), "10,10" (pair of tens)
   */
  hand: string;

  /**
   * Dealer's up card
   * Values: "2" through "10", "A"
   */
  dealer: string;

  /**
   * Basic strategy action (before deviation)
   * Examples: "H" (hit), "S" (stand), "D" (double), "DH" (double or hit)
   */
  basicAction: string;

  /**
   * Deviation action (when count threshold is met)
   * Examples: "S" (stand), "SU" (surrender), "DH" (double or hit)
   */
  deviationAction: string;

  /**
   * Count threshold for applying deviation
   * - For balanced systems (Hi-Lo, Omega II, Zen): True Count
   * - For unbalanced systems (KO): Running Count
   *
   * Positive threshold: Apply deviation when count >= threshold
   * Negative threshold: Apply deviation when count <= threshold
   */
  threshold: number;

  /**
   * Human-readable description
   * Example: "16 vs 10 投降：TC >= 0"
   */
  description: string;
}

/**
 * A complete strategy set for a counting system
 *
 * Contains all index plays (deviations) for a specific card counting system.
 * Each counting system must have exactly one paired strategy set.
 */
export interface StrategySet {
  /**
   * Unique identifier
   * Examples: "illustrious18", "ko_preferred", "omega_matrix", "zen_indices"
   */
  id: string;

  /**
   * Display name for UI
   * Examples: "Illustrious 18", "KO Preferred", "Omega II Matrix"
   */
  name: string;

  /**
   * ID of the counting system this strategy is paired with
   * Examples: "hi-lo", "ko", "omega-ii", "zen"
   *
   * IMPORTANT: This creates a hard lock between system and strategy.
   * Cannot mix KO with Illustrious 18, for example.
   */
  systemId: string;

  /**
   * All deviation plays for this strategy set
   * Typically 14-22 plays depending on the system
   */
  deviations: StrategyDeviation[];

  /**
   * Whether this strategy uses true count (balanced) or running count (unbalanced)
   * - true: Use true count (Hi-Lo, Omega II, Zen Count)
   * - false: Use running count (KO)
   */
  usesTrueCount: boolean;

  /**
   * Description of this strategy set
   * Example: "Hi-Lo 系統的 18 個最重要策略偏差"
   */
  description: string;
}
