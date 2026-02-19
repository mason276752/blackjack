import { PlayerHand, GameRules } from '../../types/game.types';
import { HandResult } from '../../types/stats.types';
import { HandEvaluator } from '../hand/HandEvaluator';

export interface PayoutResult {
  result: HandResult;
  payout: number;
}

export class PayoutCalculator {
  static calculatePayout(
    playerHand: PlayerHand,
    dealerValue: number,
    dealerBlackjack: boolean,
    rules: GameRules
  ): PayoutResult {
    const playerValue = playerHand.value;
    const playerBlackjack = playerHand.status === 'blackjack';

    // Handle surrender
    if (playerHand.status === 'surrender') {
      return {
        result: 'surrender',
        // Player-unfavorable rounding: round DOWN payouts to player
        payout: Math.floor(playerHand.bet * 0.5), // Get back half the bet
      };
    }

    // Handle player bust
    if (playerHand.status === 'bust' || playerValue > 21) {
      return {
        result: 'bust',
        payout: 0, // Lose entire bet
      };
    }

    // Handle blackjack
    if (playerBlackjack) {
      if (dealerBlackjack) {
        return {
          result: 'push',
          payout: playerHand.bet, // Return original bet
        };
      }
      return {
        result: 'blackjack',
        // Player-unfavorable rounding: round DOWN payouts to player
        payout: Math.floor(playerHand.bet * (1 + rules.blackjackPayout)), // Bet + winnings
      };
    }

    // If dealer has blackjack and player doesn't, player loses
    if (dealerBlackjack) {
      return {
        result: 'lose',
        payout: 0,
      };
    }

    // Compare values
    if (dealerValue > 21) {
      // Dealer bust, player wins
      return {
        result: 'win',
        payout: playerHand.bet * 2, // Bet + equal winnings
      };
    }

    if (playerValue > dealerValue) {
      return {
        result: 'win',
        payout: playerHand.bet * 2,
      };
    }

    if (playerValue === dealerValue) {
      return {
        result: 'push',
        payout: playerHand.bet, // Return original bet
      };
    }

    // Player value < dealer value
    return {
      result: 'lose',
      payout: 0,
    };
  }

  static calculateInsurancePayout(insuranceBet: number, dealerBlackjack: boolean): number {
    // Insurance pays 2:1
    // Player-unfavorable rounding: round DOWN payouts to player
    // insuranceBet of -1 means declined, treat as 0
    if (insuranceBet <= 0) return 0;
    return dealerBlackjack ? Math.floor(insuranceBet * 3) : 0; // Return bet + 2x winnings
  }
}
