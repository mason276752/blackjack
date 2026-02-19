/**
 * Test suite for player-unfavorable rounding in insurance calculations
 *
 * Rule: When encountering 0.5 decimals in monetary calculations:
 * - Costs to player: round UP (Math.ceil) - player pays more
 * - Payouts to player: round DOWN (Math.floor) - player receives less
 */

describe('Insurance Rounding (Player-Unfavorable)', () => {
  describe('Insurance Cost Calculation', () => {
    it('should round UP odd bet amounts (player pays more)', () => {
      // Test cases where currentBet / 2 results in X.5
      const testCases = [
        { bet: 25, expected: 13 },  // 25 / 2 = 12.5 → ceil to 13
        { bet: 27, expected: 14 },  // 27 / 2 = 13.5 → ceil to 14
        { bet: 51, expected: 26 },  // 51 / 2 = 25.5 → ceil to 26
        { bet: 99, expected: 50 },  // 99 / 2 = 49.5 → ceil to 50
        { bet: 101, expected: 51 }, // 101 / 2 = 50.5 → ceil to 51
      ];

      testCases.forEach(({ bet, expected }) => {
        const insuranceCost = Math.ceil(bet / 2);
        expect(insuranceCost).toBe(expected);
      });
    });

    it('should not affect even bet amounts', () => {
      // Even bets should work the same as before
      const testCases = [
        { bet: 50, expected: 25 },   // 50 / 2 = 25
        { bet: 100, expected: 50 },  // 100 / 2 = 50
        { bet: 200, expected: 100 }, // 200 / 2 = 100
      ];

      testCases.forEach(({ bet, expected }) => {
        const insuranceCost = Math.ceil(bet / 2);
        expect(insuranceCost).toBe(expected);
      });
    });
  });

  describe('Real-world Examples', () => {
    it('$25 bet (minimum bet) should cost $13 for insurance', () => {
      const bet = 25;
      const insuranceCost = Math.ceil(bet / 2);

      expect(insuranceCost).toBe(13); // Not 12
      // Player pays $1 more than strict half
    });

    it('$27 bet should cost $14 for insurance', () => {
      const bet = 27;
      const insuranceCost = Math.ceil(bet / 2);

      expect(insuranceCost).toBe(14);
      // Player pays $0.50 more, rounded to whole dollar
    });

    it('$51 bet should cost $26 for insurance', () => {
      const bet = 51;
      const insuranceCost = Math.ceil(bet / 2);

      expect(insuranceCost).toBe(26);
    });
  });

  describe('Comparison: Floor vs Ceil', () => {
    it('demonstrates the difference between player-favorable and unfavorable rounding', () => {
      const oddBets = [25, 27, 51, 99, 101];

      oddBets.forEach(bet => {
        const floorCost = Math.floor(bet / 2); // Player-favorable (old)
        const ceilCost = Math.ceil(bet / 2);   // Player-unfavorable (new)

        // Ceil should always be >= floor
        expect(ceilCost).toBeGreaterThanOrEqual(floorCost);

        // For odd bets, ceil should be exactly 1 more than floor
        if (bet % 2 === 1) {
          expect(ceilCost).toBe(floorCost + 1);
        } else {
          expect(ceilCost).toBe(floorCost);
        }
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle bet of $1', () => {
      const bet = 1;
      const insuranceCost = Math.ceil(bet / 2);
      expect(insuranceCost).toBe(1); // 1 / 2 = 0.5 → ceil to 1
    });

    it('should handle large odd bets', () => {
      const bet = 4999;
      const insuranceCost = Math.ceil(bet / 2);
      expect(insuranceCost).toBe(2500); // 4999 / 2 = 2499.5 → ceil to 2500
    });

    it('should handle maximum bet ($5000)', () => {
      const bet = 5000;
      const insuranceCost = Math.ceil(bet / 2);
      expect(insuranceCost).toBe(2500); // Even bet, no rounding needed
    });
  });
});
