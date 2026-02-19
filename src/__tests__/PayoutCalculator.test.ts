import { PayoutCalculator } from '../lib/rules/PayoutCalculator';
import { PlayerHand, GameRules } from '../types/game.types';

// Helper to create a mock player hand
const createHand = (bet: number, value: number, status: PlayerHand['status'] = 'active'): PlayerHand => ({
  id: 'test-hand',
  cards: [], // Cards not needed for payout calculation
  value,
  bet,
  status,
  doubled: false,
  split: false,
  splitCount: 0,
});

// Standard 3:2 blackjack rules
const standardRules: GameRules = {
  deckCount: 6,
  penetration: 0.75,
  dealerHitsSoft17: true,
  blackjackPayout: 1.5, // 3:2
  doubleAfterSplit: true,
  lateSurrender: true,
  maxSplits: 3,
  canResplitAces: false,
  canHitSplitAces: false,
  insuranceAllowed: true,
  doubleOn: 'any',
};

// 6:5 blackjack rules
const sixToFiveRules: GameRules = {
  ...standardRules,
  blackjackPayout: 1.2, // 6:5
};

describe('PayoutCalculator', () => {
  describe('calculatePayout', () => {
    describe('Blackjack payouts', () => {
      it('should pay 3:2 for blackjack (standard rules)', () => {
        const hand = createHand(100, 21, 'blackjack');
        const result = PayoutCalculator.calculatePayout(hand, 19, false, standardRules);

        expect(result.result).toBe('blackjack');
        expect(result.payout).toBe(250); // 100 bet + 150 winnings
      });

      it('should pay 6:5 for blackjack (6:5 rules)', () => {
        const hand = createHand(100, 21, 'blackjack');
        const result = PayoutCalculator.calculatePayout(hand, 19, false, sixToFiveRules);

        expect(result.result).toBe('blackjack');
        expect(result.payout).toBeCloseTo(220, 1); // 100 bet + 120 winnings
      });

      it('should handle different bet sizes with 3:2', () => {
        const hand50 = createHand(50, 21, 'blackjack');
        const result50 = PayoutCalculator.calculatePayout(hand50, 19, false, standardRules);
        expect(result50.payout).toBe(125); // 50 + 75

        const hand200 = createHand(200, 21, 'blackjack');
        const result200 = PayoutCalculator.calculatePayout(hand200, 19, false, standardRules);
        expect(result200.payout).toBe(500); // 200 + 300
      });

      it('should round DOWN blackjack payouts (player-unfavorable)', () => {
        // Odd bet with 3:2: 27 * 2.5 = 67.5 → round down to 67
        const hand27 = createHand(27, 21, 'blackjack');
        const result27 = PayoutCalculator.calculatePayout(hand27, 19, false, standardRules);
        expect(result27.payout).toBe(67); // Floor of 67.5 (27 + 40.5)

        // Odd bet with 6:5: 55 * 2.2 = 121 (no fraction in this case)
        const hand55 = createHand(55, 21, 'blackjack');
        const result55 = PayoutCalculator.calculatePayout(hand55, 19, false, sixToFiveRules);
        expect(result55.payout).toBe(121); // 55 * 2.2
      });

      it('should push when both player and dealer have blackjack', () => {
        const hand = createHand(100, 21, 'blackjack');
        const result = PayoutCalculator.calculatePayout(hand, 21, true, standardRules);

        expect(result.result).toBe('push');
        expect(result.payout).toBe(100); // Return original bet
      });
    });

    describe('Regular wins', () => {
      it('should pay 1:1 for regular win', () => {
        const hand = createHand(100, 20, 'stand');
        const result = PayoutCalculator.calculatePayout(hand, 18, false, standardRules);

        expect(result.result).toBe('win');
        expect(result.payout).toBe(200); // 100 bet + 100 winnings
      });

      it('should pay 1:1 when dealer busts', () => {
        const hand = createHand(100, 18, 'stand');
        const result = PayoutCalculator.calculatePayout(hand, 22, false, standardRules);

        expect(result.result).toBe('win');
        expect(result.payout).toBe(200);
      });

      it('should handle different winning values', () => {
        // Player 21 vs Dealer 20
        const hand21 = createHand(100, 21, 'stand');
        const result21 = PayoutCalculator.calculatePayout(hand21, 20, false, standardRules);
        expect(result21.result).toBe('win');
        expect(result21.payout).toBe(200);

        // Player 19 vs Dealer 17
        const hand19 = createHand(100, 19, 'stand');
        const result19 = PayoutCalculator.calculatePayout(hand19, 17, false, standardRules);
        expect(result19.result).toBe('win');
        expect(result19.payout).toBe(200);
      });
    });

    describe('Losses', () => {
      it('should return 0 for regular loss', () => {
        const hand = createHand(100, 17, 'stand');
        const result = PayoutCalculator.calculatePayout(hand, 20, false, standardRules);

        expect(result.result).toBe('lose');
        expect(result.payout).toBe(0);
      });

      it('should return 0 when dealer has blackjack and player does not', () => {
        const hand = createHand(100, 21, 'stand'); // 21 but not blackjack
        const result = PayoutCalculator.calculatePayout(hand, 21, true, standardRules);

        expect(result.result).toBe('lose');
        expect(result.payout).toBe(0);
      });

      it('should return 0 for player bust', () => {
        const hand = createHand(100, 25, 'bust');
        const result = PayoutCalculator.calculatePayout(hand, 19, false, standardRules);

        expect(result.result).toBe('bust');
        expect(result.payout).toBe(0);
      });

      it('should handle bust even if value > 21 without status', () => {
        const hand = createHand(100, 23, 'active');
        const result = PayoutCalculator.calculatePayout(hand, 19, false, standardRules);

        expect(result.result).toBe('bust');
        expect(result.payout).toBe(0);
      });
    });

    describe('Push (tie)', () => {
      it('should return bet for push', () => {
        const hand = createHand(100, 19, 'stand');
        const result = PayoutCalculator.calculatePayout(hand, 19, false, standardRules);

        expect(result.result).toBe('push');
        expect(result.payout).toBe(100); // Return original bet
      });

      it('should handle push with 21', () => {
        const hand = createHand(100, 21, 'stand');
        const result = PayoutCalculator.calculatePayout(hand, 21, false, standardRules);

        expect(result.result).toBe('push');
        expect(result.payout).toBe(100);
      });

      it('should handle push with different bet sizes', () => {
        const hand50 = createHand(50, 18, 'stand');
        const result50 = PayoutCalculator.calculatePayout(hand50, 18, false, standardRules);
        expect(result50.payout).toBe(50);

        const hand200 = createHand(200, 20, 'stand');
        const result200 = PayoutCalculator.calculatePayout(hand200, 20, false, standardRules);
        expect(result200.payout).toBe(200);
      });
    });

    describe('Surrender', () => {
      it('should return 50% of bet for surrender', () => {
        const hand = createHand(100, 16, 'surrender');
        const result = PayoutCalculator.calculatePayout(hand, 19, false, standardRules);

        expect(result.result).toBe('surrender');
        expect(result.payout).toBe(50); // Half of bet back
      });

      it('should handle surrender with different bet sizes', () => {
        const hand50 = createHand(50, 15, 'surrender');
        const result50 = PayoutCalculator.calculatePayout(hand50, 20, false, standardRules);
        expect(result50.payout).toBe(25);

        const hand200 = createHand(200, 16, 'surrender');
        const result200 = PayoutCalculator.calculatePayout(hand200, 10, false, standardRules);
        expect(result200.payout).toBe(100);
      });

      it('should round DOWN surrender payouts (player-unfavorable)', () => {
        // Odd bet: 51 / 2 = 25.5 → round down to 25
        const hand51 = createHand(51, 15, 'surrender');
        const result51 = PayoutCalculator.calculatePayout(hand51, 20, false, standardRules);
        expect(result51.payout).toBe(25); // Floor of 25.5

        // Odd bet: 99 / 2 = 49.5 → round down to 49
        const hand99 = createHand(99, 16, 'surrender');
        const result99 = PayoutCalculator.calculatePayout(hand99, 10, false, standardRules);
        expect(result99.payout).toBe(49); // Floor of 49.5
      });
    });

    describe('Edge cases', () => {
      it('should handle minimum bet', () => {
        const hand = createHand(1, 20, 'stand');
        const result = PayoutCalculator.calculatePayout(hand, 18, false, standardRules);

        expect(result.result).toBe('win');
        expect(result.payout).toBe(2);
      });

      it('should handle large bets', () => {
        const hand = createHand(1000, 21, 'blackjack');
        const result = PayoutCalculator.calculatePayout(hand, 19, false, standardRules);

        expect(result.result).toBe('blackjack');
        expect(result.payout).toBe(2500); // 1000 + 1500
      });

      it('should prioritize surrender status over value', () => {
        // Even with value 21, if status is surrender, pay surrender
        const hand = createHand(100, 21, 'surrender');
        const result = PayoutCalculator.calculatePayout(hand, 19, false, standardRules);

        expect(result.result).toBe('surrender');
        expect(result.payout).toBe(50);
      });

      it('should prioritize bust status over comparison', () => {
        // Even if dealer busts, player bust still loses
        const hand = createHand(100, 25, 'bust');
        const result = PayoutCalculator.calculatePayout(hand, 25, false, standardRules);

        expect(result.result).toBe('bust');
        expect(result.payout).toBe(0);
      });
    });
  });

  describe('calculateInsurancePayout', () => {
    it('should pay 2:1 when dealer has blackjack', () => {
      const payout = PayoutCalculator.calculateInsurancePayout(50, true);
      expect(payout).toBe(150); // 50 bet + 100 winnings (2:1)
    });

    it('should return 0 when dealer does not have blackjack', () => {
      const payout = PayoutCalculator.calculateInsurancePayout(50, false);
      expect(payout).toBe(0); // Lose insurance bet
    });

    it('should handle different insurance bet sizes', () => {
      expect(PayoutCalculator.calculateInsurancePayout(10, true)).toBe(30);
      expect(PayoutCalculator.calculateInsurancePayout(25, true)).toBe(75);
      expect(PayoutCalculator.calculateInsurancePayout(100, true)).toBe(300);
    });

    it('should always return 0 for no blackjack regardless of bet', () => {
      expect(PayoutCalculator.calculateInsurancePayout(10, false)).toBe(0);
      expect(PayoutCalculator.calculateInsurancePayout(100, false)).toBe(0);
      expect(PayoutCalculator.calculateInsurancePayout(500, false)).toBe(0);
    });

    it('should round DOWN insurance payouts (player-unfavorable)', () => {
      // This scenario is unlikely since insurance is typically taken with even bets
      // But if insurance bet itself is odd: 17 * 3 = 51 (no fraction)
      expect(PayoutCalculator.calculateInsurancePayout(17, true)).toBe(51);

      // Fractional example would need non-integer insurance bet, which shouldn't happen
      // but the Math.floor ensures safety
    });
  });
});
