import { PlayerHand, StrategyAction } from '../../types/game.types';
import { Card } from '../../types/card.types';
import { BasicStrategy } from '../strategy/BasicStrategy';
import { StrategyResolver } from '../strategy/StrategyResolver';
import { getDealerDisplayValue, normalizeRank } from '../utils/cardHelpers';
import { isPair as checkIsPair } from '../deck/Card';
import { TFunction } from 'i18next';

export interface AIDecision {
  action: 'hit' | 'stand' | 'doubleDown' | 'split' | 'surrender' | 'bet' | 'deal' | 'wait' | 'take_insurance' | 'decline_insurance';
  reasoning: string;
  betAmount?: number;
  insuranceAmount?: number;
}

export class AIPlayer {
  constructor(
    private strategy: BasicStrategy,
    private strategyResolver: StrategyResolver,
    private t: TFunction
  ) {}

  /**
   * Calculates optimal bet using practical bet spread (1-12 units)
   * This matches real-world card counting better than pure Kelly Criterion
   *
   * Note: Bet sizing typically uses true count even for unbalanced systems like KO,
   * as it normalizes the advantage across different deck penetrations.
   */
  calculateBet(
    balance: number,
    effectiveCount: number,
    minBet: number,
    maxBet: number
  ): AIDecision {
    // Practical bet spread based on effective count
    let units: number;
    if (effectiveCount < 1) {
      units = 1;       // Count 0 or less: 1 unit (neutral/negative count)
    } else if (effectiveCount < 2) {
      units = 2;       // Count +1: 2 units
    } else if (effectiveCount < 3) {
      units = 4;       // Count +2: 4 units
    } else if (effectiveCount < 4) {
      units = 8;       // Count +3: 8 units
    } else {
      units = 12;      // Count +4+: 12 units (max spread)
    }

    let betAmount = minBet * units;
    betAmount = Math.max(minBet, Math.min(betAmount, maxBet));

    // Ensure we have enough balance
    if (balance < betAmount) {
      betAmount = Math.max(minBet, Math.min(balance, maxBet));
    }

    const reasoning = this.generateBetReasoning(effectiveCount, units, betAmount);
    return { action: 'bet', betAmount, reasoning };
  }

  /**
   * Decides whether to take insurance based on effective count and system-specific threshold
   *
   * Different counting systems have different optimal insurance thresholds:
   * - Hi-Lo: TC +3
   * - KO: RC +3
   * - Omega II: TC +6 (higher due to multi-level counting)
   * - Zen Count: TC +3
   */
  decideInsurance(
    effectiveCount: number,
    insuranceIndex: number,
    maxInsuranceAmount: number,
    balance: number
  ): AIDecision {
    // Use StrategyResolver to determine if insurance should be taken
    const shouldTakeInsurance = this.strategyResolver.shouldTakeInsurance(
      effectiveCount,
      insuranceIndex
    );

    // Check if we have enough balance
    if (shouldTakeInsurance && balance < maxInsuranceAmount) {
      return {
        action: 'decline_insurance',
        reasoning: this.t('ai:reasoning.insurance.insufficientBalance', {
          trueCount: effectiveCount.toFixed(1)
        }),
      };
    }

    if (shouldTakeInsurance) {
      return {
        action: 'take_insurance',
        reasoning: this.t('ai:reasoning.insurance.takeInsurance', {
          trueCount: effectiveCount.toFixed(1)
        }),
        insuranceAmount: maxInsuranceAmount,
      };
    } else {
      return {
        action: 'decline_insurance',
        reasoning: this.t('ai:reasoning.insurance.declineInsurance', {
          trueCount: effectiveCount.toFixed(1)
        }),
      };
    }
  }

  /**
   * Decides optimal play action using BasicStrategy with strategy deviations
   *
   * Uses the StrategyResolver to apply count-based deviations from the paired strategy set.
   * Each counting system has its own dedicated strategy set (e.g., Hi-Lo uses Illustrious 18).
   */
  decideAction(
    hand: PlayerHand,
    dealerUpCard: Card,
    canDouble: boolean,
    canSplit: boolean,
    canSurrender: boolean,
    effectiveCount?: number  // Optional: if provided, check for strategy deviations
  ): AIDecision {
    // Get basic strategy action first
    const basicAction = this.strategy.getOptimalAction(
      hand.cards,
      dealerUpCard,       // Pass full Card object
      canDouble,
      canSplit,
      canSurrender        // Pass boolean, not rules
    );

    // If effective count is provided, check for strategy deviations
    let optimalAction = basicAction;
    let deviationApplied = false;
    let deviationDescription = '';

    if (effectiveCount !== undefined) {
      const isPair = checkIsPair(hand.cards);
      const pairValue = isPair ? normalizeRank(hand.cards[0].rank as any) : undefined;

      // Use StrategyResolver to find applicable deviation
      const deviation = this.strategyResolver.findDeviation(
        hand.value,
        dealerUpCard,
        isPair,
        pairValue
      );

      if (deviation && this.strategyResolver.shouldDeviate(deviation, effectiveCount)) {
        // Check if deviation action is available
        const deviationActionAvailable = this.isActionAvailable(
          deviation.deviationAction,
          canDouble,
          canSplit,
          canSurrender
        );

        if (deviationActionAvailable) {
          optimalAction = deviation.deviationAction as StrategyAction;
          deviationApplied = true;
          deviationDescription = deviation.description;
        }
      }
    }

    // Map strategy code to action name (match gameLogic function names)
    let action: 'hit' | 'stand' | 'doubleDown' | 'split' | 'surrender';

    if (optimalAction === 'H') {
      action = 'hit';
    } else if (optimalAction === 'S') {
      action = 'stand';
    } else if (optimalAction === 'D' || optimalAction === 'DH' || optimalAction === 'DS') {
      // DH = double or hit, DS = double or stand
      if (canDouble) {
        action = 'doubleDown';
      } else {
        action = optimalAction === 'DS' ? 'stand' : 'hit';
      }
    } else if (optimalAction === 'SP') {
      if (canSplit) {
        action = 'split';
      } else {
        // Can't split, treat as normal hand
        const fallbackAction = this.strategy.getOptimalAction(
          hand.cards,
          dealerUpCard,
          canDouble,
          false,  // Don't offer split
          canSurrender
        );
        action = fallbackAction === 'H' ? 'hit' : 'stand';
      }
    } else if (optimalAction === 'SU') {
      action = 'surrender';
    } else {
      action = 'stand';  // Default fallback
    }

    const reasoning = this.generateActionReasoning(
      hand,
      dealerUpCard,
      optimalAction,
      action,
      deviationApplied,
      deviationDescription,
      effectiveCount
    );
    return { action, reasoning };
  }

  /**
   * Check if an action is available given current constraints
   */
  private isActionAvailable(
    action: string,
    canDouble: boolean,
    canSplit: boolean,
    canSurrender: boolean
  ): boolean {
    if (action === 'D' || action === 'DH' || action === 'DS') {
      return canDouble;
    }
    if (action === 'SP') {
      return canSplit;
    }
    if (action === 'SU') {
      return canSurrender;
    }
    // H, S are always available
    return true;
  }

  private generateBetReasoning(effectiveCount: number, units: number, betAmount: number): string {
    const countDescKey =
      effectiveCount >= 2 ? 'favorable' :
      effectiveCount <= 0 ? 'unfavorable' :
      'neutral';

    const countDesc = this.t(`ai:reasoning.bet.${countDescKey}`);

    return this.t('ai:reasoning.bet.template', {
      trueCount: effectiveCount.toFixed(1),
      countDesc,
      units,
      betAmount
    });
  }

  private generateActionReasoning(
    hand: PlayerHand,
    dealerUpCard: Card,
    strategyCode: StrategyAction,
    action: string,
    deviationApplied: boolean = false,
    deviationDescription: string = '',
    effectiveCount?: number
  ): string {
    const handTypeKey = hand.cards.some(c => c.rank === 'A') && hand.value <= 21 && hand.cards.length === 2
      ? 'soft'
      : 'hard';
    const handType = this.t(`ai:reasoning.action.${handTypeKey}`);
    const handValue = hand.value;
    const dealerValue = getDealerDisplayValue(dealerUpCard);

    const actionDisplay = action.toUpperCase();
    const baseReasoning = this.t('ai:reasoning.action.template', {
      handType,
      handValue,
      dealerValue,
      strategyCode,
      action: actionDisplay
    });

    // If strategy deviation was applied, add explanation
    if (deviationApplied && effectiveCount !== undefined) {
      return this.t('ai:reasoning.action.deviationTemplate', {
        baseReasoning,
        trueCount: effectiveCount.toFixed(1),
        deviationDescription
      });
    }

    return baseReasoning;
  }
}
