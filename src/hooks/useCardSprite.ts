import { useMemo } from 'react';
import { Card } from '../types/card.types';
import { getSpritePosition, SPRITE_MAP } from '../constants/cardSprites';

export function useCardSprite(card: Card | undefined, faceDown: boolean = false) {
  return useMemo(() => {
    if (faceDown || !card) {
      return SPRITE_MAP['back'];
    }

    return getSpritePosition(card.rank, card.suit, false);
  }, [card, faceDown]);
}
