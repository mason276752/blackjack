import { AIPlayer } from '../lib/ai/AIPlayer';
import { BasicStrategy } from '../lib/strategy/BasicStrategy';
import { StrategyResolver } from '../lib/strategy/StrategyResolver';
import { Card } from '../types/card.types';
import { GameRules } from '../types/game.types';
import { ILLUSTRIOUS_18 as ILLUSTRIOUS_18_OLD, findDeviation, shouldDeviate } from '../constants/illustrious18';
import { ILLUSTRIOUS_18 as ILLUSTRIOUS_18_NEW } from '../constants/strategies/illustrious18';

// Mock translation function for tests - simulates i18next behavior
const mockTranslations: Record<string, string> = {
  'ai:reasoning.bet.favorable': 'favorable',
  'ai:reasoning.bet.unfavorable': 'unfavorable',
  'ai:reasoning.bet.neutral': 'neutral',
  'ai:reasoning.bet.template': 'True Count: {{trueCount}} ({{countDesc}}), Betting {{units}} units = ${{betAmount}}',
  'ai:reasoning.action.soft': 'Soft',
  'ai:reasoning.action.hard': 'Hard',
  'ai:reasoning.action.template': '{{handType}} {{handValue}} vs Dealer {{dealerValue}}: Strategy {{strategyCode}} → {{action}}',
  'ai:reasoning.action.deviationTemplate': '{{baseReasoning}} | I18 Deviation (TC {{trueCount}}): {{deviationDescription}}',
  'ai:reasoning.insurance.takeInsurance': 'True Count +{{trueCount}} >= +3: Insurance has positive expected value',
  'ai:reasoning.insurance.declineInsurance': 'True Count {{trueCount}} < +3: Insurance has negative expected value',
  'ai:reasoning.insurance.insufficientBalance': 'True Count +{{trueCount}} favors insurance, but insufficient balance',
};

const mockT = (key: string, params?: any) => {
  let template = mockTranslations[key] || key;

  if (!params) return template;

  // Replace all {{param}} with actual values
  Object.keys(params).forEach(paramKey => {
    template = template.replace(new RegExp(`\\{\\{${paramKey}\\}\\}`, 'g'), String(params[paramKey]));
  });

  return template;
};

describe('Illustrious 18', () => {
  let aiPlayer: AIPlayer;
  let strategy: BasicStrategy;
  let strategyResolver: StrategyResolver;
  let rules: GameRules;

  beforeEach(() => {
    rules = {
      deckCount: 6,
      penetration: 0.75,
      dealerHitsSoft17: true,
      blackjackPayout: 1.5,
      doubleAfterSplit: true,
      lateSurrender: true,
      maxSplits: 3,
      canResplitAces: false,
      canHitSplitAces: false,
      insuranceAllowed: true,
      doubleOn: 'any',
    };
    strategy = new BasicStrategy(rules);
    strategyResolver = new StrategyResolver(ILLUSTRIOUS_18_NEW);
    aiPlayer = new AIPlayer(strategy, strategyResolver, mockT as any);
  });

  const createCard = (rank: string): Card => ({
    suit: 'hearts' as const,
    rank: rank as any,
  });

  describe('findDeviation and shouldDeviate helpers', () => {
    it('should find 12 vs 3 deviation', () => {
      const deviation = findDeviation(12, '3', false);
      expect(deviation).toBeDefined();
      expect(deviation?.hand).toBe('12');
      expect(deviation?.dealer).toBe('3');
      expect(deviation?.trueCount).toBe(2);
    });

    it('should find 10,10 vs 5 pair deviation', () => {
      const deviation = findDeviation(20, '5', true, '10');
      expect(deviation).toBeDefined();
      expect(deviation?.hand).toBe('10,10');
      expect(deviation?.dealer).toBe('5');
      expect(deviation?.trueCount).toBe(5);
    });

    it('should return undefined for non-I18 situation', () => {
      const deviation = findDeviation(17, '7', false);
      expect(deviation).toBeUndefined();
    });

    it('should deviate when TC >= threshold (positive)', () => {
      const deviation = ILLUSTRIOUS_18_OLD.find(d => d.hand === '12' && d.dealer === '3');
      expect(shouldDeviate(deviation!, 2)).toBe(true);  // TC = 2, threshold = 2
      expect(shouldDeviate(deviation!, 3)).toBe(true);  // TC > threshold
      expect(shouldDeviate(deviation!, 1)).toBe(false); // TC < threshold
    });

    it('should deviate when TC <= threshold (negative)', () => {
      const deviation = ILLUSTRIOUS_18_OLD.find(d => d.hand === '13' && d.dealer === '2');
      expect(shouldDeviate(deviation!, -1)).toBe(true);  // TC = -1, threshold = -1
      expect(shouldDeviate(deviation!, -2)).toBe(true);  // TC < threshold
      expect(shouldDeviate(deviation!, 0)).toBe(false);  // TC > threshold
    });
  });

  describe('I18 Deviations - Stand Deviations', () => {
    it('should stand on 12 vs 3 at TC +2 (I18 #7)', () => {
      const hand = {
        id: '1',
        cards: [createCard('10'), createCard('2')],
        value: 12,
        bet: 10,
        status: 'active' as const,
        doubled: false,
        split: false,
        splitCount: 0,
      };

      // Without true count or low count: basic strategy hits
      const decisionLowCount = aiPlayer.decideAction(
        hand,
        createCard('3'),
        true,
        false,
        false,
        1  // TC +1 < +2
      );
      expect(decisionLowCount.action).toBe('hit');

      // At TC +2: deviate to stand
      const decisionHighCount = aiPlayer.decideAction(
        hand,
        createCard('3'),
        true,
        false,
        false,
        2  // TC +2
      );
      expect(decisionHighCount.action).toBe('stand');
      expect(decisionHighCount.reasoning).toContain('I18 Deviation');
      expect(decisionHighCount.reasoning).toContain('TC 2.0');
    });

    it('should stand on 12 vs 2 at TC +3 (I18 #8)', () => {
      const hand = {
        id: '1',
        cards: [createCard('10'), createCard('2')],
        value: 12,
        bet: 10,
        status: 'active' as const,
        doubled: false,
        split: false,
        splitCount: 0,
      };

      const decisionLowCount = aiPlayer.decideAction(hand, createCard('2'), true, false, false, 2);
      expect(decisionLowCount.action).toBe('hit');

      const decisionHighCount = aiPlayer.decideAction(hand, createCard('2'), true, false, false, 3);
      expect(decisionHighCount.action).toBe('stand');
      expect(decisionHighCount.reasoning).toContain('I18 Deviation');
    });

    it('should stand on 16 vs 9 at TC +5 (I18 #13)', () => {
      const hand = {
        id: '1',
        cards: [createCard('10'), createCard('6')],
        value: 16,
        bet: 10,
        status: 'active' as const,
        doubled: false,
        split: false,
        splitCount: 0,
      };

      const decisionLowCount = aiPlayer.decideAction(hand, createCard('9'), true, false, false, 4);
      expect(decisionLowCount.action).toBe('hit');

      const decisionHighCount = aiPlayer.decideAction(hand, createCard('9'), true, false, false, 5);
      expect(decisionHighCount.action).toBe('stand');
      expect(decisionHighCount.reasoning).toContain('I18 Deviation');
    });
  });

  describe('I18 Deviations - Hit Deviations (negative count)', () => {
    it('should hit 13 vs 2 at TC -1 or lower (I18 #14)', () => {
      const hand = {
        id: '1',
        cards: [createCard('10'), createCard('3')],
        value: 13,
        bet: 10,
        status: 'active' as const,
        doubled: false,
        split: false,
        splitCount: 0,
      };

      // Positive count: basic strategy stands
      const decisionPositive = aiPlayer.decideAction(hand, createCard('2'), true, false, false, 1);
      expect(decisionPositive.action).toBe('stand');

      // TC -1: deviate to hit
      const decisionNegative = aiPlayer.decideAction(hand, createCard('2'), true, false, false, -1);
      expect(decisionNegative.action).toBe('hit');
      expect(decisionNegative.reasoning).toContain('I18 Deviation');
    });

    it('should hit 12 vs 6 at TC -1 or lower (I18 #17)', () => {
      const hand = {
        id: '1',
        cards: [createCard('10'), createCard('2')],
        value: 12,
        bet: 10,
        status: 'active' as const,
        doubled: false,
        split: false,
        splitCount: 0,
      };

      const decisionPositive = aiPlayer.decideAction(hand, createCard('6'), true, false, false, 0);
      expect(decisionPositive.action).toBe('stand');

      const decisionNegative = aiPlayer.decideAction(hand, createCard('6'), true, false, false, -1);
      expect(decisionNegative.action).toBe('hit');
      expect(decisionNegative.reasoning).toContain('I18 Deviation');
    });
  });

  describe('I18 Deviations - Double Deviations', () => {
    it('should double 11 vs A at TC +1 (I18 #9) - Note: already basic strategy in H17', () => {
      const hand = {
        id: '1',
        cards: [createCard('5'), createCard('6')],
        value: 11,
        bet: 10,
        status: 'active' as const,
        doubled: false,
        split: false,
        splitCount: 0,
      };

      // Note: In H17 rules, basic strategy already doubles 11 vs A
      // This I18 deviation is more relevant for S17 rules
      // Let's test that it doesn't break anything
      const decision = aiPlayer.decideAction(hand, createCard('A'), true, false, false, 1);
      expect(decision.action).toBe('doubleDown');
    });

    it('should double 10 vs 10 at TC +4 (I18 #6)', () => {
      const hand = {
        id: '1',
        cards: [createCard('5'), createCard('5')],
        value: 10,
        bet: 10,
        status: 'active' as const,
        doubled: false,
        split: false,
        splitCount: 0,
      };

      const decisionLowCount = aiPlayer.decideAction(hand, createCard('10'), true, false, false, 3);
      expect(decisionLowCount.action).toBe('hit');

      const decisionHighCount = aiPlayer.decideAction(hand, createCard('10'), true, false, false, 4);
      expect(decisionHighCount.action).toBe('doubleDown');
      expect(decisionHighCount.reasoning).toContain('I18 Deviation');
    });

    it('should double 9 vs 2 at TC +1 (I18 #10)', () => {
      const hand = {
        id: '1',
        cards: [createCard('5'), createCard('4')],
        value: 9,
        bet: 10,
        status: 'active' as const,
        doubled: false,
        split: false,
        splitCount: 0,
      };

      const decisionLowCount = aiPlayer.decideAction(hand, createCard('2'), true, false, false, 0);
      expect(decisionLowCount.action).toBe('hit');

      const decisionHighCount = aiPlayer.decideAction(hand, createCard('2'), true, false, false, 1);
      expect(decisionHighCount.action).toBe('doubleDown');
      expect(decisionHighCount.reasoning).toContain('I18 Deviation');
    });
  });

  describe('I18 Deviations - Surrender Deviations', () => {
    it('should surrender 15 vs 10 at TC +4 (I18 #3) - Note: already basic strategy in H17', () => {
      const hand = {
        id: '1',
        cards: [createCard('10'), createCard('5')],
        value: 15,
        bet: 10,
        status: 'active' as const,
        doubled: false,
        split: false,
        splitCount: 0,
      };

      // Note: In H17 rules, basic strategy already surrenders 15 vs 10
      // This I18 deviation is relevant when surrender is not basic strategy
      const decision = aiPlayer.decideAction(hand, createCard('10'), true, false, true, 4);
      expect(decision.action).toBe('surrender');
    });
  });

  describe('I18 Deviations - Split Deviations', () => {
    it('should split 10,10 vs 5 at TC +5 (I18 #4)', () => {
      const hand = {
        id: '1',
        cards: [createCard('10'), createCard('K')],  // Both 10-value
        value: 20,
        bet: 10,
        status: 'active' as const,
        doubled: false,
        split: false,
        splitCount: 0,
      };

      const decisionLowCount = aiPlayer.decideAction(hand, createCard('5'), true, true, false, 4);
      expect(decisionLowCount.action).toBe('stand');

      const decisionHighCount = aiPlayer.decideAction(hand, createCard('5'), true, true, false, 5);
      expect(decisionHighCount.action).toBe('split');
      expect(decisionHighCount.reasoning).toContain('I18 Deviation');
    });

    it('should split 10,10 vs 6 at TC +4 (I18 #5)', () => {
      const hand = {
        id: '1',
        cards: [createCard('Q'), createCard('J')],
        value: 20,
        bet: 10,
        status: 'active' as const,
        doubled: false,
        split: false,
        splitCount: 0,
      };

      const decisionLowCount = aiPlayer.decideAction(hand, createCard('6'), true, true, false, 3);
      expect(decisionLowCount.action).toBe('stand');

      const decisionHighCount = aiPlayer.decideAction(hand, createCard('6'), true, true, false, 4);
      expect(decisionHighCount.action).toBe('split');
      expect(decisionHighCount.reasoning).toContain('I18 Deviation');
    });
  });

  describe('I18 Deviations - Action availability checks', () => {
    it('should not deviate to double if cannot double', () => {
      const hand = {
        id: '1',
        cards: [createCard('5'), createCard('6')],
        value: 11,
        bet: 10,
        status: 'active' as const,
        doubled: false,
        split: false,
        splitCount: 0,
      };

      // TC +1, should deviate to double, but can't double
      const decision = aiPlayer.decideAction(
        hand,
        createCard('A'),
        false,  // Cannot double
        false,
        false,
        1
      );

      // Should fall back to basic strategy (hit)
      expect(decision.action).toBe('hit');
      expect(decision.reasoning).not.toContain('I18 Deviation');
    });

    it('should not deviate to split if cannot split', () => {
      const hand = {
        id: '1',
        cards: [createCard('10'), createCard('K')],
        value: 20,
        bet: 10,
        status: 'active' as const,
        doubled: false,
        split: false,
        splitCount: 0,
      };

      // TC +5, should deviate to split 10,10 vs 5, but can't split
      const decision = aiPlayer.decideAction(
        hand,
        createCard('5'),
        true,
        false,  // Cannot split
        false,
        5
      );

      // Should fall back to basic strategy (stand)
      expect(decision.action).toBe('stand');
      expect(decision.reasoning).not.toContain('I18 Deviation');
    });
  });

  describe('Insurance (I18 #1) - already tested', () => {
    it('should take insurance at TC +3 or higher', () => {
      const decision = aiPlayer.decideInsurance(3.0, 3, 50, 1000);
      expect(decision.action).toBe('take_insurance');
    });
  });
});
