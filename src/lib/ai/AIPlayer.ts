import { PlayerHand, GameRules, StrategyAction } from '../../types/game.types';
import { Card } from '../../types/card.types';
import { BasicStrategy } from '../strategy/BasicStrategy';
import { getDealerDisplayValue, normalizeRank } from '../utils/cardHelpers';
import { findDeviation, shouldDeviate } from '../../constants/illustrious18';
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
    private t: TFunction
  ) {}

  /**
   * Calculates optimal bet using practical bet spread (1-12 units)
   * This matches real-world card counting better than pure Kelly Criterion
   */
  calculateBet(
    balance: number,
    trueCount: number,
    minBet: number,
    maxBet: number
  ): AIDecision {
    // Practical bet spread based on true count
    let units: number;
    if (trueCount < 1) {
      units = 1;       // TC 0 or less: 1 unit (neutral/negative count)
    } else if (trueCount < 2) {
      units = 2;       // TC +1: 2 units
    } else if (trueCount < 3) {
      units = 4;       // TC +2: 4 units
    } else if (trueCount < 4) {
      units = 8;       // TC +3: 8 units
    } else {
      units = 12;      // TC +4+: 12 units (max spread)
    }

    let betAmount = minBet * units;
    betAmount = Math.max(minBet, Math.min(betAmount, maxBet));

    // Ensure we have enough balance
    if (balance < betAmount) {
      betAmount = Math.max(minBet, Math.min(balance, maxBet));
    }

    const reasoning = this.generateBetReasoning(trueCount, units, betAmount);
    return { action: 'bet', betAmount, reasoning };
  }

  /**
   * Decides whether to take insurance based on true count
   * Standard strategy: Take insurance when True Count >= +3
   */
  decideInsurance(
    trueCount: number,
    maxInsuranceAmount: number,
    balance: number
  ): AIDecision {
    // Insurance is mathematically favorable when TC >= +3
    // At TC +3, the deck has enough 10-value cards to make insurance +EV
    const shouldTakeInsurance = trueCount >= 3;

    // Check if we have enough balance
    if (shouldTakeInsurance && balance < maxInsuranceAmount) {
      return {
        action: 'decline_insurance',
        reasoning: this.t('ai:reasoning.insurance.insufficientBalance', {
          trueCount: trueCount.toFixed(1)
        }),
      };
    }

    if (shouldTakeInsurance) {
      return {
        action: 'take_insurance',
        reasoning: this.t('ai:reasoning.insurance.takeInsurance', {
          trueCount: trueCount.toFixed(1)
        }),
        insuranceAmount: maxInsuranceAmount,
      };
    } else {
      return {
        action: 'decline_insurance',
        reasoning: this.t('ai:reasoning.insurance.declineInsurance', {
          trueCount: trueCount.toFixed(1)
        }),
      };
    }
  }

  /**
   * Decides optimal play action using BasicStrategy with Illustrious 18 deviations
   */
  decideAction(
    hand: PlayerHand,
    dealerUpCard: Card,
    canDouble: boolean,
    canSplit: boolean,
    canSurrender: boolean,
    trueCount?: number  // Optional: if provided, check for Illustrious 18 deviations
  ): AIDecision {
    // Get basic strategy action first
    const basicAction = this.strategy.getOptimalAction(
      hand.cards,
      dealerUpCard,       // Pass full Card object
      canDouble,
      canSplit,
      canSurrender        // Pass boolean, not rules
    );

    // If true count is provided, check for Illustrious 18 deviations
    let optimalAction = basicAction;
    let deviationApplied = false;
    let deviationDescription = '';

    if (trueCount !== undefined) {
      const dealerValue = normalizeRank(dealerUpCard.rank as any);
      const isPair = checkIsPair(hand.cards);
      const pairValue = isPair ? normalizeRank(hand.cards[0].rank as any) : undefined;

      const deviation = findDeviation(hand.value, dealerValue, isPair, pairValue);

      if (deviation && shouldDeviate(deviation, trueCount)) {
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
      trueCount
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

  private generateBetReasoning(trueCount: number, units: number, betAmount: number): string {
    const countDescKey =
      trueCount >= 2 ? 'favorable' :
      trueCount <= 0 ? 'unfavorable' :
      'neutral';

    const countDesc = this.t(`ai:reasoning.bet.${countDescKey}`);

    return this.t('ai:reasoning.bet.template', {
      trueCount: trueCount.toFixed(1),
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
    trueCount?: number
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

    // If Illustrious 18 deviation was applied, add explanation
    if (deviationApplied && trueCount !== undefined) {
      return this.t('ai:reasoning.action.deviationTemplate', {
        baseReasoning,
        trueCount: trueCount.toFixed(1),
        deviationDescription
      });
    }

    return baseReasoning;
  }
}
