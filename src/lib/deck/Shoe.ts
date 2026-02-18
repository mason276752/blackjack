import { Card } from '../../types/card.types';
import { createDeck } from './Card';

export class Shoe {
  private cards: Card[];
  private dealtCards: Card[];
  private deckCount: number;
  private penetration: number;
  private totalCards: number;

  constructor(deckCount: number, penetration: number) {
    this.deckCount = deckCount;
    this.penetration = penetration;
    this.cards = [];
    this.dealtCards = [];
    this.totalCards = deckCount * 52;
    this.initialize();
  }

  private initialize(): void {
    this.cards = [];
    for (let i = 0; i < this.deckCount; i++) {
      this.cards.push(...createDeck());
    }
    this.shuffle();
  }

  shuffle(): void {
    // Fisher-Yates shuffle algorithm
    // Use crypto.getRandomValues for better randomness
    const array = this.cards;

    for (let i = array.length - 1; i > 0; i--) {
      const j = this.getSecureRandomIndex(i + 1);
      [array[i], array[j]] = [array[j], array[i]];
    }

    this.dealtCards = [];
  }

  private getSecureRandomIndex(max: number): number {
    // Use crypto API for secure random number generation
    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);
    return randomBuffer[0] % max;
  }

  deal(): Card {
    if (this.cards.length === 0) {
      throw new Error('Shoe is empty!');
    }

    const card = this.cards.pop()!;
    this.dealtCards.push(card);
    return card;
  }

  cardsRemaining(): number {
    return this.cards.length;
  }

  shouldReshuffle(): boolean {
    const dealtPercentage = this.dealtCards.length / this.totalCards;
    return dealtPercentage >= this.penetration;
  }

  reset(): void {
    this.cards.push(...this.dealtCards);
    this.shuffle();
  }

  getDealtCards(): Card[] {
    return [...this.dealtCards];
  }

  getTotalCards(): number {
    return this.totalCards;
  }

  getDecksRemaining(): number {
    return this.cards.length / 52;
  }
}
