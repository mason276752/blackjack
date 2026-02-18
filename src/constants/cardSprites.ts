import { Rank, RANKS, Suit, SUITS } from '../types/card.types';

// Poker.png is 1920x1073 pixels
// Grid: 13 columns (A-K) x 5 rows (4 suits + card back)
// Row order: Clubs, Diamonds, Hearts, Spades, Card Back
// Each card: 1920/13 ≈ 147.69px width, 1073/5 = 214.6px height
export const CARD_WIDTH = 1920 / 13;
export const CARD_HEIGHT = 1073 / 5;

// Display size (scaled down for visibility - original is too large)
export const DISPLAY_CARD_WIDTH = CARD_WIDTH * 0.5;
export const DISPLAY_CARD_HEIGHT = CARD_HEIGHT * 0.5;

export const SPRITE_SHEET_WIDTH = 1920;
export const SPRITE_SHEET_HEIGHT = 1073;

export interface SpritePosition {
  x: number;
  y: number;
}

// Generate sprite positions for all cards
const generateSpriteMap = (): Record<string, SpritePosition> => {
  const map: Record<string, SpritePosition> = {};

  SUITS.forEach((suit: Suit, suitIndex: number) => {
    RANKS.forEach((rank: Rank, rankIndex: number) => {
      const key = `${rank}_${suit}`;
      map[key] = {
        x: rankIndex * CARD_WIDTH,
        y: suitIndex * CARD_HEIGHT,
      };
    });
  });

  // Card back position (row 5, column 3 - blue card back)
  map['back'] = {
    x: 2 * CARD_WIDTH,
    y: 4 * CARD_HEIGHT,
  };

  return map;
};

export const SPRITE_MAP = generateSpriteMap();

// Helper function to get sprite position
export function getSpritePosition(rank: Rank, suit: Suit, faceDown: boolean = false): SpritePosition {
  if (faceDown) {
    return SPRITE_MAP['back'];
  }

  const key = `${rank}_${suit}`;
  return SPRITE_MAP[key];
}
