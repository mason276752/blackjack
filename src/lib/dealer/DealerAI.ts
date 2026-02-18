import { Card } from '../../types/card.types';
import { GameRules } from '../../types/game.types';
import { HandEvaluator } from '../hand/HandEvaluator';

export class DealerAI {
  private rules: GameRules;

  constructor(rules: GameRules) {
    this.rules = rules;
  }

  shouldHit(dealerHand: Card[]): boolean {
    const value = HandEvaluator.calculateValue(dealerHand);
    const isSoft = HandEvaluator.isSoft(dealerHand);

    // Dealer always hits on 16 or less
    if (value < 17) return true;

    // Special case: value is 17
    if (value === 17) {
      // S17 rule: Dealer stands on soft 17
      // H17 rule: Dealer hits on soft 17
      if (isSoft && this.rules.dealerHitsSoft17) {
        return true;
      }
      return false;
    }

    // Dealer stands on 18+
    return false;
  }

  getRuleDescription(): string {
    return this.rules.dealerHitsSoft17 ? 'H17 (Dealer hits soft 17)' : 'S17 (Dealer stands on soft 17)';
  }
}
