import { HandEvaluator } from '../lib/hand/HandEvaluator';
import { Card } from '../types/card.types';

// Helper function to create cards
const card = (rank: string, suit: string = 'hearts'): Card => ({
  rank: rank as Card['rank'],
  suit: suit as Card['suit']
});

describe('HandEvaluator', () => {
  describe('calculateValue', () => {
    it('should calculate simple hand values', () => {
      expect(HandEvaluator.calculateValue([card('5'), card('7')])).toBe(12);
      expect(HandEvaluator.calculateValue([card('10'), card('9')])).toBe(19);
      expect(HandEvaluator.calculateValue([card('K'), card('Q')])).toBe(20);
    });

    it('should handle face cards as 10', () => {
      expect(HandEvaluator.calculateValue([card('J'), card('5')])).toBe(15);
      expect(HandEvaluator.calculateValue([card('Q'), card('8')])).toBe(18);
      expect(HandEvaluator.calculateValue([card('K'), card('6')])).toBe(16);
      expect(HandEvaluator.calculateValue([card('J'), card('Q'), card('K')])).toBe(30);
    });

    it('should handle single Ace as 11', () => {
      expect(HandEvaluator.calculateValue([card('A'), card('5')])).toBe(16); // Soft 16
      expect(HandEvaluator.calculateValue([card('A'), card('9')])).toBe(20); // Soft 20
    });

    it('should handle Ace as 1 when 11 would bust', () => {
      expect(HandEvaluator.calculateValue([card('A'), card('10'), card('5')])).toBe(16); // A=1
      expect(HandEvaluator.calculateValue([card('A'), card('K'), card('9')])).toBe(20); // A=1
    });

    it('should handle multiple Aces correctly', () => {
      // A,A = 12 (one as 11, one as 1)
      expect(HandEvaluator.calculateValue([card('A'), card('A')])).toBe(12);

      // A,A,5 = 17 (one as 11, one as 1)
      expect(HandEvaluator.calculateValue([card('A'), card('A'), card('5')])).toBe(17);

      // A,A,A = 13 (one as 11, two as 1)
      expect(HandEvaluator.calculateValue([card('A'), card('A'), card('A')])).toBe(13);

      // A,A,9 = 21 (one as 11, one as 1)
      expect(HandEvaluator.calculateValue([card('A'), card('A'), card('9')])).toBe(21);

      // A,A,A,8 = 21 (one as 11, two as 1)
      expect(HandEvaluator.calculateValue([card('A'), card('A'), card('A'), card('8')])).toBe(21);
    });

    it('should handle soft to hard transition', () => {
      // A,6 = 17 (soft)
      const hand1 = [card('A'), card('6')];
      expect(HandEvaluator.calculateValue(hand1)).toBe(17);

      // A,6,10 = 17 (hard, Ace now counts as 1)
      const hand2 = [card('A'), card('6'), card('10')];
      expect(HandEvaluator.calculateValue(hand2)).toBe(17);
    });

    it('should handle blackjack (A,10)', () => {
      expect(HandEvaluator.calculateValue([card('A'), card('10')])).toBe(21);
      expect(HandEvaluator.calculateValue([card('A'), card('J')])).toBe(21);
      expect(HandEvaluator.calculateValue([card('A'), card('Q')])).toBe(21);
      expect(HandEvaluator.calculateValue([card('A'), card('K')])).toBe(21);
    });

    it('should handle bust hands', () => {
      expect(HandEvaluator.calculateValue([card('10'), card('10'), card('5')])).toBe(25);
      expect(HandEvaluator.calculateValue([card('K'), card('Q'), card('9')])).toBe(29);
    });
  });

  describe('isSoft', () => {
    it('should identify soft hands', () => {
      expect(HandEvaluator.isSoft([card('A'), card('6')])).toBe(true); // Soft 17
      expect(HandEvaluator.isSoft([card('A'), card('7')])).toBe(true); // Soft 18
      expect(HandEvaluator.isSoft([card('A'), card('2'), card('3')])).toBe(true); // Soft 16
    });

    it('should identify hard hands', () => {
      expect(HandEvaluator.isSoft([card('10'), card('7')])).toBe(false); // Hard 17
      expect(HandEvaluator.isSoft([card('K'), card('Q')])).toBe(false); // Hard 20
    });

    it('should identify when soft hand becomes hard', () => {
      // A,6,10 = Hard 17 (Ace must be 1)
      expect(HandEvaluator.isSoft([card('A'), card('6'), card('10')])).toBe(false);

      // A,A,9 = 21, but with one Ace as 11, it's still soft
      // (A=11 + A=1 + 9 = 21)
      expect(HandEvaluator.isSoft([card('A'), card('A'), card('9')])).toBe(true);

      // A,A,A,8 = Hard 21 (all Aces as 1 would = 11, but one Ace can be 11 = 21)
      expect(HandEvaluator.isSoft([card('A'), card('A'), card('A'), card('8')])).toBe(true);
    });

    it('should handle multiple Aces', () => {
      // A,A = Soft 12 (one Ace is 11)
      expect(HandEvaluator.isSoft([card('A'), card('A')])).toBe(true);

      // A,A,5 = Soft 17 (one Ace is 11)
      expect(HandEvaluator.isSoft([card('A'), card('A'), card('5')])).toBe(true);
    });

    it('should return false for hands without Aces', () => {
      expect(HandEvaluator.isSoft([card('5'), card('7')])).toBe(false);
      expect(HandEvaluator.isSoft([card('K'), card('Q'), card('9')])).toBe(false);
    });
  });

  describe('isBlackjack', () => {
    it('should identify blackjack (A + 10-value card)', () => {
      expect(HandEvaluator.isBlackjack([card('A'), card('10')])).toBe(true);
      expect(HandEvaluator.isBlackjack([card('A'), card('J')])).toBe(true);
      expect(HandEvaluator.isBlackjack([card('A'), card('Q')])).toBe(true);
      expect(HandEvaluator.isBlackjack([card('A'), card('K')])).toBe(true);
      expect(HandEvaluator.isBlackjack([card('K'), card('A')])).toBe(true); // Order doesn't matter
    });

    it('should NOT identify 21 from 3+ cards as blackjack', () => {
      expect(HandEvaluator.isBlackjack([card('7'), card('7'), card('7')])).toBe(false);
      expect(HandEvaluator.isBlackjack([card('A'), card('5'), card('5')])).toBe(false);
      expect(HandEvaluator.isBlackjack([card('10'), card('6'), card('5')])).toBe(false);
    });

    it('should NOT identify non-21 two-card hands as blackjack', () => {
      expect(HandEvaluator.isBlackjack([card('A'), card('9')])).toBe(false); // 20
      expect(HandEvaluator.isBlackjack([card('10'), card('10')])).toBe(false); // 20
      expect(HandEvaluator.isBlackjack([card('5'), card('7')])).toBe(false); // 12
    });
  });

  describe('isBust', () => {
    it('should identify bust hands (> 21)', () => {
      expect(HandEvaluator.isBust([card('10'), card('10'), card('5')])).toBe(true); // 25
      expect(HandEvaluator.isBust([card('K'), card('Q'), card('9')])).toBe(true); // 29
      expect(HandEvaluator.isBust([card('7'), card('8'), card('9')])).toBe(true); // 24
    });

    it('should NOT identify valid hands as bust', () => {
      expect(HandEvaluator.isBust([card('10'), card('10')])).toBe(false); // 20
      expect(HandEvaluator.isBust([card('A'), card('10')])).toBe(false); // 21
      expect(HandEvaluator.isBust([card('A'), card('10'), card('5')])).toBe(false); // 16
    });

    it('should handle exactly 21', () => {
      expect(HandEvaluator.isBust([card('A'), card('K')])).toBe(false);
      expect(HandEvaluator.isBust([card('7'), card('7'), card('7')])).toBe(false);
    });
  });

  describe('compareHands', () => {
    it('should identify player win (higher value)', () => {
      expect(HandEvaluator.compareHands(19, 17)).toBe('win');
      expect(HandEvaluator.compareHands(20, 18)).toBe('win');
      expect(HandEvaluator.compareHands(21, 20)).toBe('win');
    });

    it('should identify player loss (lower value)', () => {
      expect(HandEvaluator.compareHands(17, 19)).toBe('lose');
      expect(HandEvaluator.compareHands(12, 20)).toBe('lose');
      expect(HandEvaluator.compareHands(18, 21)).toBe('lose');
    });

    it('should identify push (equal values)', () => {
      expect(HandEvaluator.compareHands(19, 19)).toBe('push');
      expect(HandEvaluator.compareHands(21, 21)).toBe('push');
      expect(HandEvaluator.compareHands(17, 17)).toBe('push');
    });

    it('should identify player loss when player busts', () => {
      expect(HandEvaluator.compareHands(25, 17)).toBe('lose'); // Player bust
      expect(HandEvaluator.compareHands(22, 20)).toBe('lose'); // Player bust
      expect(HandEvaluator.compareHands(30, 19)).toBe('lose'); // Player bust
    });

    it('should identify player win when dealer busts', () => {
      expect(HandEvaluator.compareHands(17, 25)).toBe('win'); // Dealer bust
      expect(HandEvaluator.compareHands(20, 22)).toBe('win'); // Dealer bust
      expect(HandEvaluator.compareHands(15, 30)).toBe('win'); // Dealer bust
    });

    it('should handle exactly 21', () => {
      expect(HandEvaluator.compareHands(21, 20)).toBe('win');
      expect(HandEvaluator.compareHands(20, 21)).toBe('lose');
      expect(HandEvaluator.compareHands(21, 21)).toBe('push');
    });
  });

  describe('canSplit', () => {
    it('should allow splitting pairs', () => {
      expect(HandEvaluator.canSplit([card('8'), card('8')])).toBe(true);
      expect(HandEvaluator.canSplit([card('A'), card('A')])).toBe(true);
      expect(HandEvaluator.canSplit([card('5'), card('5')])).toBe(true);
    });

    it('should allow splitting 10-value cards', () => {
      expect(HandEvaluator.canSplit([card('10'), card('10')])).toBe(true);
      expect(HandEvaluator.canSplit([card('K'), card('K')])).toBe(true);
      expect(HandEvaluator.canSplit([card('J'), card('Q')])).toBe(true); // Different ranks but both 10
      expect(HandEvaluator.canSplit([card('10'), card('K')])).toBe(true);
    });

    it('should NOT allow splitting non-pairs', () => {
      expect(HandEvaluator.canSplit([card('5'), card('7')])).toBe(false);
      expect(HandEvaluator.canSplit([card('A'), card('10')])).toBe(false);
      expect(HandEvaluator.canSplit([card('9'), card('8')])).toBe(false);
    });

    it('should NOT allow splitting with more than 2 cards', () => {
      expect(HandEvaluator.canSplit([card('8'), card('8'), card('5')])).toBe(false);
    });

    it('should NOT allow splitting with less than 2 cards', () => {
      expect(HandEvaluator.canSplit([card('8')])).toBe(false);
      expect(HandEvaluator.canSplit([])).toBe(false);
    });
  });
});
