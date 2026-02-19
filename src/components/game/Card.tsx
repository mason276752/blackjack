import React from 'react';
import { Card as CardType } from '../../types/card.types';
import { useCardSprite } from '../../hooks/useCardSprite';
import { DISPLAY_CARD_WIDTH, DISPLAY_CARD_HEIGHT, SPRITE_SHEET_WIDTH, SPRITE_SHEET_HEIGHT } from '../../constants/cardSprites';

interface CardProps {
  card?: CardType;
  faceDown?: boolean;
  className?: string;
}

export function Card({ card, faceDown = false, className = '' }: CardProps) {
  const position = useCardSprite(card, faceDown);

  const style: React.CSSProperties = {
    width: `${DISPLAY_CARD_WIDTH}px`,
    height: `${DISPLAY_CARD_HEIGHT}px`,
    backgroundImage: `url(${import.meta.env.BASE_URL}poker.png)`,
    backgroundPosition: `-${position.x * 2}px -${position.y * 2}px`,
    backgroundSize: `${SPRITE_SHEET_WIDTH * 2}px ${SPRITE_SHEET_HEIGHT * 2}px`,
    display: 'inline-block',
    imageRendering: 'pixelated',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    margin: '0 4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  };

  const label = faceDown || !card ? 'Hidden card' : `${card.rank} of ${card.suit}`;

  return <div className={`card ${className}`} style={style} aria-label={label} title={label} />;
}
