import { Card, Rank } from '../../types/card.types';

/**
 * Card utility functions for blackjack game logic.
 * Consolidates duplicated card value and rank logic from multiple locations.
 */

/**
 * Check if a rank is a face card (Jack, Queen, King).
 *
 * @param rank - Card rank to check
 * @returns true if the rank is J, Q, or K
 *
 * @example
 * isFaceCard('K') // true
 * isFaceCard('A') // false
 * isFaceCard('7') // false
 */
export function isFaceCard(rank: Rank): boolean {
  return ['J', 'Q', 'K'].includes(rank);
}

/**
 * Get the numeric value of a card rank.
 * Face cards (J, Q, K) return 10.
 * Aces return 11 (use context-aware functions for Ace handling).
 * Number cards return their numeric value.
 *
 * @param rank - Card rank
 * @returns Numeric value of the rank (1-11)
 *
 * @example
 * getRankValue('K') // 10
 * getRankValue('A') // 11
 * getRankValue('7') // 7
 */
export function getRankValue(rank: Rank): number {
  if (rank === 'A') return 11;
  if (isFaceCard(rank)) return 10;
  return parseInt(rank);
}

/**
 * Get the numeric value of a card rank, treating Aces as 1.
 * Useful for calculating minimum hand values or soft hand logic.
 *
 * @param rank - Card rank
 * @returns Numeric value with Ace as 1
 *
 * @example
 * getRankValueAceAsOne('A') // 1
 * getRankValueAceAsOne('K') // 10
 * getRankValueAceAsOne('5') // 5
 */
export function getRankValueAceAsOne(rank: Rank): number {
  if (rank === 'A') return 1;
  if (isFaceCard(rank)) return 10;
  return parseInt(rank);
}

/**
 * Normalize a rank to its strategy table representation.
 * Face cards and 10s are treated as '10'.
 * Aces return 'A'.
 * Number cards return their rank as string.
 *
 * Used for strategy table lookups and display.
 *
 * @param rank - Card rank
 * @returns Normalized rank string ('A', '2'-'9', '10')
 *
 * @example
 * normalizeRank('K') // '10'
 * normalizeRank('J') // '10'
 * normalizeRank('A') // 'A'
 * normalizeRank('7') // '7'
 */
export function normalizeRank(rank: Rank): string {
  if (rank === 'A') return 'A';
  if (isFaceCard(rank)) return '10';
  return rank;
}

/**
 * Get the numeric value for pairing purposes.
 * Face cards and 10s all have value 10 and can pair with each other.
 *
 * @param rank - Card rank
 * @returns Pairing value (1-11)
 *
 * @example
 * getPairingValue('K') // 10
 * getPairingValue('10') // 10
 * getPairingValue('Q') // 10
 * getPairingValue('A') // 11
 */
export function getPairingValue(rank: Rank): number {
  if (rank === 'A') return 11;
  if (rank === '10' || isFaceCard(rank)) return 10;
  return parseInt(rank);
}

/**
 * Count the number of Aces in a hand.
 *
 * @param cards - Array of cards
 * @returns Number of Aces in the hand
 *
 * @example
 * countAces([{rank: 'A', suit: 'hearts'}, {rank: 'K', suit: 'spades'}]) // 1
 * countAces([{rank: 'A', suit: 'hearts'}, {rank: 'A', suit: 'spades'}]) // 2
 */
export function countAces(cards: Card[]): number {
  return cards.filter(card => card.rank === 'A').length;
}

/**
 * Get the display value for a dealer's up card (for strategy hints).
 * Normalizes face cards to '10' and keeps Ace as 'A'.
 *
 * @param card - Dealer's up card
 * @returns Display value string
 *
 * @example
 * getDealerDisplayValue({rank: 'K', suit: 'hearts'}) // '10'
 * getDealerDisplayValue({rank: 'A', suit: 'spades'}) // 'A'
 * getDealerDisplayValue({rank: '7', suit: 'diamonds'}) // '7'
 */
export function getDealerDisplayValue(card: Card): string {
  return normalizeRank(card.rank);
}

/**
 * Check if two ranks can pair for splitting purposes.
 * All 10-value cards (10, J, Q, K) can pair with each other.
 * Other ranks must match exactly.
 *
 * @param rank1 - First card rank
 * @param rank2 - Second card rank
 * @returns true if the ranks can form a pair
 *
 * @example
 * canRanksPair('K', 'Q') // true (both 10-value)
 * canRanksPair('10', 'J') // true (both 10-value)
 * canRanksPair('A', 'A') // true (exact match)
 * canRanksPair('7', '8') // false (different values)
 */
export function canRanksPair(rank1: Rank, rank2: Rank): boolean {
  return getPairingValue(rank1) === getPairingValue(rank2);
}
