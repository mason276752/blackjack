import { AIPlayer } from '../lib/ai/AIPlayer';
import { BasicStrategy } from '../lib/strategy/BasicStrategy';
import { StrategyResolver } from '../lib/strategy/StrategyResolver';
import { ILLUSTRIOUS_18 } from '../constants/strategies/illustrious18';
import { Card } from '../types/card.types';
import { GameRules } from '../types/game.types';

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

describe('AIPlayer', () => {
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
    strategyResolver = new StrategyResolver(ILLUSTRIOUS_18);
    aiPlayer = new AIPlayer(strategy, strategyResolver, mockT as any);
  });

  describe('decideInsurance', () => {
    it('should take insurance when true count >= +3', () => {
      const decision = aiPlayer.decideInsurance(3.0, 3, 50, 1000);

      expect(decision.action).toBe('take_insurance');
      expect(decision.reasoning).toContain('True Count +3.0');
      expect(decision.reasoning).toContain('positive expected value');
      expect(decision.insuranceAmount).toBe(50);
    });

    it('should take insurance when true count > +3', () => {
      const decision = aiPlayer.decideInsurance(4.5, 3, 50, 1000);

      expect(decision.action).toBe('take_insurance');
      expect(decision.reasoning).toContain('True Count +4.5');
      expect(decision.insuranceAmount).toBe(50);
    });

    it('should decline insurance when true count < +3', () => {
      const decision = aiPlayer.decideInsurance(2.5, 3, 50, 1000);

      expect(decision.action).toBe('decline_insurance');
      expect(decision.reasoning).toContain('True Count 2.5');
      expect(decision.reasoning).toContain('negative expected value');
      expect(decision.insuranceAmount).toBeUndefined();
    });

    it('should decline insurance when true count is negative', () => {
      const decision = aiPlayer.decideInsurance(-1.0, 3, 50, 1000);

      expect(decision.action).toBe('decline_insurance');
      expect(decision.reasoning).toContain('True Count -1.0');
      expect(decision.reasoning).toContain('negative expected value');
    });

    it('should decline insurance when true count is zero', () => {
      const decision = aiPlayer.decideInsurance(0, 3, 50, 1000);

      expect(decision.action).toBe('decline_insurance');
      expect(decision.reasoning).toContain('True Count 0.0');
    });

    it('should decline insurance when balance insufficient even if count favors it', () => {
      const decision = aiPlayer.decideInsurance(4.0, 3, 100, 50);

      expect(decision.action).toBe('decline_insurance');
      expect(decision.reasoning).toContain('True Count +4.0');
      expect(decision.reasoning).toContain('insufficient balance');
    });

    it('should take insurance when balance exactly equals insurance amount', () => {
      const decision = aiPlayer.decideInsurance(3.5, 3, 100, 100);

      expect(decision.action).toBe('take_insurance');
      expect(decision.insuranceAmount).toBe(100);
    });
  });

  describe('calculateBet', () => {
    it('should bet 1 unit on negative count', () => {
      const decision = aiPlayer.calculateBet(1000, -1, 10, 500);

      expect(decision.betAmount).toBe(10); // 1 unit × $10
      expect(decision.reasoning).toContain('unfavorable');
    });

    it('should bet 2 units on TC +1', () => {
      const decision = aiPlayer.calculateBet(1000, 1.5, 10, 500);

      expect(decision.betAmount).toBe(20); // 2 units × $10
    });

    it('should bet 4 units on TC +2', () => {
      const decision = aiPlayer.calculateBet(1000, 2.5, 10, 500);

      expect(decision.betAmount).toBe(40); // 4 units × $10
    });

    it('should bet 8 units on TC +3', () => {
      const decision = aiPlayer.calculateBet(1000, 3.5, 10, 500);

      expect(decision.betAmount).toBe(80); // 8 units × $10
    });

    it('should bet 12 units on TC +4 or higher', () => {
      const decision = aiPlayer.calculateBet(1000, 5.0, 10, 500);

      expect(decision.betAmount).toBe(120); // 12 units × $10
    });

    it('should respect max bet limit', () => {
      const decision = aiPlayer.calculateBet(10000, 10.0, 10, 100);

      expect(decision.betAmount).toBe(100); // Capped at max bet
    });

    it('should adjust to balance if insufficient', () => {
      const decision = aiPlayer.calculateBet(50, 5.0, 10, 500);

      expect(decision.betAmount).toBe(50); // All-in with available balance
    });
  });

  describe('decideAction', () => {
    const createCard = (rank: string): Card => ({
      suit: 'hearts' as const,
      rank: rank as any,
    });

    it('should recommend hit on hard 12 vs dealer 7', () => {
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

      const decision = aiPlayer.decideAction(
        hand,
        createCard('7'),
        true,
        false,
        false
      );

      expect(decision.action).toBe('hit');
    });

    it('should recommend stand on hard 17', () => {
      const hand = {
        id: '1',
        cards: [createCard('10'), createCard('7')],
        value: 17,
        bet: 10,
        status: 'active' as const,
        doubled: false,
        split: false,
        splitCount: 0,
      };

      const decision = aiPlayer.decideAction(
        hand,
        createCard('10'),
        true,
        false,
        false
      );

      expect(decision.action).toBe('stand');
    });

    it('should recommend double on hard 11', () => {
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

      const decision = aiPlayer.decideAction(
        hand,
        createCard('6'),
        true,
        false,
        false
      );

      expect(decision.action).toBe('doubleDown');
    });

    it('should recommend split on pair of 8s', () => {
      const hand = {
        id: '1',
        cards: [createCard('8'), createCard('8')],
        value: 16,
        bet: 10,
        status: 'active' as const,
        doubled: false,
        split: false,
        splitCount: 0,
      };

      const decision = aiPlayer.decideAction(
        hand,
        createCard('6'),
        true,
        true,
        false
      );

      expect(decision.action).toBe('split');
    });

    it('should fallback to hit when cannot double on DH', () => {
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

      const decision = aiPlayer.decideAction(
        hand,
        createCard('6'),
        false, // Cannot double
        false,
        false
      );

      expect(decision.action).toBe('hit');
    });
  });
});
