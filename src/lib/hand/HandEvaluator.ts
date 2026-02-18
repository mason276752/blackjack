import { Card } from '../../types/card.types';
import { isPair } from '../deck/Card';
import { getRankValue, countAces } from '../utils/cardHelpers';

export class HandEvaluator {
  static calculateValue(cards: Card[]): number {
    let total = 0;
    let aces = countAces(cards);

    // Add all card values (Aces counted as 11 initially)
    for (const card of cards) {
      total += getRankValue(card.rank);
    }

    // Convert Aces from 11 to 1 if bust
    while (total > 21 && aces > 0) {
      total -= 10; // Change one Ace from 11 to 1
      aces--;
    }

    return total;
  }

  static isSoft(cards: Card[]): boolean {
    let total = 0;
    let aces = countAces(cards);

    // A hand is soft if it has an Ace counted as 11 without busting
    if (aces === 0) return false;

    // Calculate total with all Aces as 11
    for (const card of cards) {
      total += getRankValue(card.rank);
    }

    // Check if we can count at least one Ace as 11
    while (total > 21 && aces > 0) {
      total -= 10;
      aces--;
    }

    return aces > 0 && total <= 21;
  }

  static isBlackjack(cards: Card[]): boolean {
    // Blackjack is exactly 2 cards totaling 21
    if (cards.length !== 2) return false;
    return HandEvaluator.calculateValue(cards) === 21;
  }

  static isBust(cards: Card[]): boolean {
    return HandEvaluator.calculateValue(cards) > 21;
  }

  static canSplit(cards: Card[]): boolean {
    if (cards.length !== 2) return false;
    return isPair(cards);
  }

  static compareHands(playerValue: number, dealerValue: number): 'win' | 'lose' | 'push' {
    if (dealerValue > 21) return 'win'; // Dealer bust
    if (playerValue > 21) return 'lose'; // Player bust
    if (playerValue > dealerValue) return 'win';
    if (playerValue < dealerValue) return 'lose';
    return 'push'; // Tie
  }

  static getHandDescription(cards: Card[]): { key: string; value?: number } {
    const value = HandEvaluator.calculateValue(cards);

    if (HandEvaluator.isBlackjack(cards)) return { key: 'blackjack' };
    if (HandEvaluator.isBust(cards)) return { key: 'bustValue', value };
    if (HandEvaluator.isSoft(cards)) return { key: 'soft', value };
    return { key: 'value', value };
  }
}
