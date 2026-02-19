import { Card } from '../../types/card.types';
import { StrategyAction, GameRules } from '../../types/game.types';
import { HandEvaluator } from '../hand/HandEvaluator';
import { isPair } from '../deck/Card';
import { HARD_HAND_STRATEGY, SOFT_HAND_STRATEGY, PAIR_STRATEGY } from '../../constants/strategyTables';
import {
  HARD_HAND_STRATEGY_H17_DAS,
  SOFT_HAND_STRATEGY_H17_DAS,
  PAIR_STRATEGY_H17_DAS,
} from '../../constants/strategyTables.h17';
import {
  HARD_HAND_STRATEGY_S17_DAS,
  SOFT_HAND_STRATEGY_S17_DAS,
  PAIR_STRATEGY_S17_DAS,
} from '../../constants/strategyTables.s17';
import { normalizeRank, isFaceCard, getRankValueAceAsOne } from '../utils/cardHelpers';

export class BasicStrategy {
  private rules: GameRules;
  private hardHandStrategy: Record<string, StrategyAction>;
  private softHandStrategy: Record<string, StrategyAction>;
  private pairStrategy: Record<string, StrategyAction>;

  constructor(rules: GameRules) {
    this.rules = rules;

    // Select appropriate strategy tables based on rules
    if (rules.dealerHitsSoft17) {
      // H17 rules
      this.hardHandStrategy = HARD_HAND_STRATEGY_H17_DAS;
      this.softHandStrategy = SOFT_HAND_STRATEGY_H17_DAS;
      this.pairStrategy = { ...PAIR_STRATEGY_H17_DAS };
    } else {
      // S17 rules
      this.hardHandStrategy = HARD_HAND_STRATEGY_S17_DAS;
      this.softHandStrategy = SOFT_HAND_STRATEGY_S17_DAS;
      this.pairStrategy = { ...PAIR_STRATEGY_S17_DAS };
    }

    // Adjust pair strategy for No DAS
    if (!rules.doubleAfterSplit) {
      this.adjustPairStrategyForNoDAS();
    }
  }

  /**
   * Adjust pair splitting strategy when DAS is not allowed
   * Without DAS, we split less aggressively on small pairs
   */
  private adjustPairStrategyForNoDAS(): void {
    // 2,2: Split 4-7 instead of 2-7
    this.pairStrategy['2_vs_2'] = 'H';
    this.pairStrategy['2_vs_3'] = 'H';

    // 3,3: Split 4-7 instead of 2-7
    this.pairStrategy['3_vs_2'] = 'H';
    this.pairStrategy['3_vs_3'] = 'H';

    // 4,4: Never split without DAS
    this.pairStrategy['4_vs_5'] = 'H';
    this.pairStrategy['4_vs_6'] = 'H';

    // 6,6: Split 2-6 instead of 2-7
    this.pairStrategy['6_vs_7'] = 'H';
  }

  getOptimalAction(
    playerCards: Card[],
    dealerUpCard: Card,
    canDouble: boolean,
    canSplit: boolean,
    canSurrender: boolean
  ): StrategyAction {
    const dealerValue = this.getDealerCardValue(dealerUpCard.rank);

    // Check for pairs first
    if (isPair(playerCards) && canSplit) {
      const pairValue = this.getPairValue(playerCards[0].rank);
      const key = `${pairValue}_vs_${dealerValue}`;
      const action = this.pairStrategy[key];
      if (action === 'SP') return 'SP';
    }

    // Check for soft hands
    if (HandEvaluator.isSoft(playerCards)) {
      const softKey = this.getSoftHandKey(playerCards);
      const key = `${softKey}_vs_${dealerValue}`;
      const action = this.softHandStrategy[key];
      return this.resolveConditionalAction(action, canDouble);
    }

    // Hard hands
    const handValue = HandEvaluator.calculateValue(playerCards);
    const key = `${handValue}_vs_${dealerValue}`;
    const action = this.hardHandStrategy[key] || 'S'; // Default to stand if not found

    // Handle surrender
    if (action === 'SU' && canSurrender) {
      return 'SU';
    } else if (action === 'SU') {
      return 'H'; // If can't surrender, hit instead
    }

    return this.resolveConditionalAction(action, canDouble);
  }

  private resolveConditionalAction(action: StrategyAction, canDouble: boolean): StrategyAction {
    if (action === 'DH') {
      return canDouble ? 'D' : 'H';
    }
    if (action === 'DS') {
      return canDouble ? 'D' : 'S';
    }
    return action;
  }

  private getDealerCardValue(rank: string): string {
    return normalizeRank(rank as any);
  }

  private getPairValue(rank: string): string {
    return normalizeRank(rank as any);
  }

  private getSoftHandKey(cards: Card[]): string {
    // Find the non-Ace card values
    let nonAceValue = 0;
    for (const card of cards) {
      if (card.rank !== 'A') {
        nonAceValue += getRankValueAceAsOne(card.rank);
      }
    }

    // For multiple non-Ace cards, use the total
    if (nonAceValue > 9) {
      return `A${Math.min(nonAceValue, 9)}`;
    }

    return `A${nonAceValue}`;
  }

  getActionDescription(action: StrategyAction): string {
    switch (action) {
      case 'H': return 'hit';
      case 'S': return 'stand';
      case 'D': return 'doubleDown';
      case 'SP': return 'split';
      case 'SU': return 'surrender';
      case 'DH': return 'doubleOrHit';
      case 'DS': return 'doubleOrStand';
      default: return 'unknown';
    }
  }
}
