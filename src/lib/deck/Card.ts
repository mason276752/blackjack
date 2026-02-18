import { Card, Rank, Suit, RANKS, SUITS } from '../../types/card.types';
import { getRankValue, getRankValueAceAsOne, canRanksPair } from '../utils/cardHelpers';

export function createCard(rank: Rank, suit: Suit): Card {
  return { rank, suit };
}

export function createDeck(): Card[] {
  const deck: Card[] = [];

  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push(createCard(rank, suit));
    }
  }

  return deck;
}

export function getCardValue(rank: Rank): number[] {
  if (rank === 'A') return [getRankValueAceAsOne(rank), getRankValue(rank)];
  return [getRankValue(rank)];
}

export function cardToString(card: Card): string {
  return `${card.rank}${card.suit[0].toUpperCase()}`;
}

export function isPair(cards: Card[]): boolean {
  if (cards.length !== 2) return false;
  return canRanksPair(cards[0].rank, cards[1].rank);
}
