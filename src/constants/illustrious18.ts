/**
 * Illustrious 18 - The 18 most important strategy deviations based on true count
 * Developed by Don Schlesinger for Hi-Lo counting system
 *
 * Each deviation specifies when to deviate from basic strategy based on the true count.
 * Format: { hand, dealer, basicAction, deviationAction, trueCountThreshold }
 */

export interface StrategyDeviation {
  hand: string;          // e.g., "16" (hard), "A7" (soft), "10,10" (pair)
  dealer: string;        // Dealer up card: "2"-"10", "A"
  basicAction: string;   // Basic strategy action (H, S, D, SP, etc.)
  deviationAction: string; // Action to take when count crosses threshold
  trueCount: number;     // True count threshold for deviation
  description: string;   // Human-readable description
}

/**
 * The Illustrious 18 deviations (ordered by frequency/importance)
 */
export const ILLUSTRIOUS_18: StrategyDeviation[] = [
  // 1. Insurance (most important)
  {
    hand: 'any',
    dealer: 'A',
    basicAction: 'decline',
    deviationAction: 'take_insurance',
    trueCount: 3,
    description: 'Take insurance at TC >= +3',
  },

  // 2. 16 vs 10 (surrender)
  {
    hand: '16',
    dealer: '10',
    basicAction: 'H',
    deviationAction: 'SU',
    trueCount: 0,
    description: 'Surrender 16 vs 10 at TC >= 0 (if surrender not available in basic strategy)',
  },

  // 3. 15 vs 10 (surrender)
  {
    hand: '15',
    dealer: '10',
    basicAction: 'H',
    deviationAction: 'SU',
    trueCount: 4,
    description: 'Surrender 15 vs 10 at TC >= +4',
  },

  // 4. 10,10 vs 5 (split)
  {
    hand: '10,10',
    dealer: '5',
    basicAction: 'S',
    deviationAction: 'SP',
    trueCount: 5,
    description: 'Split 10,10 vs 5 at TC >= +5',
  },

  // 5. 10,10 vs 6 (split)
  {
    hand: '10,10',
    dealer: '6',
    basicAction: 'S',
    deviationAction: 'SP',
    trueCount: 4,
    description: 'Split 10,10 vs 6 at TC >= +4',
  },

  // 6. 10 vs 10 (double)
  {
    hand: '10',
    dealer: '10',
    basicAction: 'H',
    deviationAction: 'DH',
    trueCount: 4,
    description: 'Double 10 vs 10 at TC >= +4',
  },

  // 7. 12 vs 3 (stand)
  {
    hand: '12',
    dealer: '3',
    basicAction: 'H',
    deviationAction: 'S',
    trueCount: 2,
    description: 'Stand on 12 vs 3 at TC >= +2',
  },

  // 8. 12 vs 2 (stand)
  {
    hand: '12',
    dealer: '2',
    basicAction: 'H',
    deviationAction: 'S',
    trueCount: 3,
    description: 'Stand on 12 vs 2 at TC >= +3',
  },

  // 9. 11 vs A (double) - Note: This is already basic strategy in H17, deviation applies in S17
  {
    hand: '11',
    dealer: 'A',
    basicAction: 'H',
    deviationAction: 'DH',
    trueCount: 1,
    description: 'Double 11 vs A at TC >= +1 (S17 rules)',
  },

  // 10. 9 vs 2 (double)
  {
    hand: '9',
    dealer: '2',
    basicAction: 'H',
    deviationAction: 'DH',
    trueCount: 1,
    description: 'Double 9 vs 2 at TC >= +1',
  },

  // 11. 10 vs A (double)
  {
    hand: '10',
    dealer: 'A',
    basicAction: 'H',
    deviationAction: 'DH',
    trueCount: 4,
    description: 'Double 10 vs A at TC >= +4',
  },

  // 12. 9 vs 7 (double)
  {
    hand: '9',
    dealer: '7',
    basicAction: 'H',
    deviationAction: 'DH',
    trueCount: 3,
    description: 'Double 9 vs 7 at TC >= +3',
  },

  // 13. 16 vs 9 (stand)
  {
    hand: '16',
    dealer: '9',
    basicAction: 'H',
    deviationAction: 'S',
    trueCount: 5,
    description: 'Stand on 16 vs 9 at TC >= +5',
  },

  // 14. 13 vs 2 (stand when count is negative)
  {
    hand: '13',
    dealer: '2',
    basicAction: 'S',
    deviationAction: 'H',
    trueCount: -1,
    description: 'Hit 13 vs 2 at TC <= -1',
  },

  // 15. 12 vs 4 (stand when count is negative)
  {
    hand: '12',
    dealer: '4',
    basicAction: 'S',
    deviationAction: 'H',
    trueCount: 0,
    description: 'Hit 12 vs 4 at TC <= 0',
  },

  // 16. 12 vs 5 (stand when count is negative)
  {
    hand: '12',
    dealer: '5',
    basicAction: 'S',
    deviationAction: 'H',
    trueCount: -2,
    description: 'Hit 12 vs 5 at TC <= -2',
  },

  // 17. 12 vs 6 (stand when count is negative)
  {
    hand: '12',
    dealer: '6',
    basicAction: 'S',
    deviationAction: 'H',
    trueCount: -1,
    description: 'Hit 12 vs 6 at TC <= -1',
  },

  // 18. 13 vs 3 (stand when count is negative)
  {
    hand: '13',
    dealer: '3',
    basicAction: 'S',
    deviationAction: 'H',
    trueCount: -2,
    description: 'Hit 13 vs 3 at TC <= -2',
  },
];

/**
 * Helper function to check if a deviation applies
 */
export function findDeviation(
  handValue: number,
  dealerCard: string,
  isPair: boolean,
  pairValue?: string
): StrategyDeviation | undefined {
  // Check for pair deviations first
  if (isPair && pairValue) {
    const pairKey = `${pairValue},${pairValue}`;
    const deviation = ILLUSTRIOUS_18.find(
      d => d.hand === pairKey && d.dealer === dealerCard
    );
    if (deviation) return deviation;
  }

  // Check for hard hand deviations
  const handKey = String(handValue);
  return ILLUSTRIOUS_18.find(
    d => d.hand === handKey && d.dealer === dealerCard
  );
}

/**
 * Check if deviation should be applied based on true count
 */
export function shouldDeviate(
  deviation: StrategyDeviation,
  trueCount: number
): boolean {
  // For negative thresholds, deviate when TC is at or below threshold
  if (deviation.trueCount < 0) {
    return trueCount <= deviation.trueCount;
  }

  // For positive thresholds, deviate when TC is at or above threshold
  return trueCount >= deviation.trueCount;
}
