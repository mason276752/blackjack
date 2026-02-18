export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
}

export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
// Suits order matches poker.png sprite sheet layout (top to bottom):
// Row 1: Clubs, Row 2: Diamonds, Row 3: Hearts, Row 4: Spades
export const SUITS: Suit[] = ['clubs', 'diamonds', 'hearts', 'spades'];
