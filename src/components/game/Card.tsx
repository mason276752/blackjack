import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card as CardType } from '../../types/card.types';
import { useCardSprite } from '../../hooks/useCardSprite';
import { DISPLAY_CARD_WIDTH, DISPLAY_CARD_HEIGHT, SPRITE_SHEET_WIDTH, SPRITE_SHEET_HEIGHT } from '../../constants/cardSprites';

interface CardProps {
  card?: CardType;
  faceDown?: boolean;
  className?: string;
}

export function Card({ card, faceDown = false, className = '' }: CardProps) {
  const { t } = useTranslation('game');
  const [showTooltip, setShowTooltip] = useState(false);
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
    position: 'relative',
    cursor: faceDown || !card ? 'default' : 'help',
  };

  const label = faceDown || !card ? 'Hidden card' : `${card.rank} of ${card.suit}`;
  const cardValue = card && !faceDown ? t(`cardValue.${card.rank}`) : '';

  return (
    <div
      className={`card ${className}`}
      style={style}
      aria-label={label}
      onMouseEnter={() => !faceDown && card && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {showTooltip && card && !faceDown && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '8px',
            padding: '8px 12px',
            backgroundColor: '#1e293b',
            color: '#e2e8f0',
            border: '1px solid #8b5cf6',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
            fontSize: '13px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '2px', color: '#c084fc' }}>
            {card.rank} {card.suit}
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>{cardValue}</div>
          {/* Tooltip arrow */}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #8b5cf6',
            }}
          />
        </div>
      )}
    </div>
  );
}
