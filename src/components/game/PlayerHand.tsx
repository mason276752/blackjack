import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { PlayerHand as PlayerHandType } from '../../types/game.types';
import { Card } from './Card';
import { HandEvaluator } from '../../lib/hand/HandEvaluator';

interface PlayerHandProps {
  hand: PlayerHandType;
  isActive: boolean;
}

export const PlayerHand = memo(function PlayerHand({ hand, isActive }: PlayerHandProps) {
  const { t } = useTranslation('hand');
  const getStatusColor = () => {
    if (hand.result === 'win' || hand.result === 'blackjack') return '#4ade80';
    if (hand.result === 'lose' || hand.result === 'bust') return '#f87171';
    if (hand.result === 'push') return '#fbbf24';
    return isActive ? '#60a5fa' : '#94a3b8';
  };

  const getStatusText = () => {
    if (hand.result) {
      if (hand.result === 'blackjack') return t('blackjack');
      if (hand.result === 'bust') return t('bust');
      if (hand.result === 'win') return t('win', { amount: hand.payout });
      if (hand.result === 'lose') return t('lose');
      if (hand.result === 'push') return t('push');
      if (hand.result === 'surrender') return t('surrender', { amount: hand.payout });
    }
    return '';
  };

  return (
    <div
      style={{
        border: `2px solid ${getStatusColor()}`,
        borderRadius: '8px',
        padding: '16px',
        margin: '8px',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        minWidth: '200px',
        opacity: isActive ? 1 : 0.7,
      }}
    >
      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 'bold', color: getStatusColor() }}>
          {(() => {
            const desc = HandEvaluator.getHandDescription(hand.cards);
            if (desc.key === 'value') return desc.value;
            return desc.value !== undefined ? t(desc.key, { value: desc.value }) : t(desc.key);
          })()}
        </span>
        <span style={{ color: '#94a3b8' }}>{t('bet')}: ${hand.bet}</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
        {hand.cards.map((card, index) => (
          <Card key={`${card.rank}-${card.suit}-${index}`} card={card} />
        ))}
      </div>

      {hand.result && (
        <div
          style={{
            fontWeight: 'bold',
            fontSize: '14px',
            color: getStatusColor(),
            textAlign: 'center',
          }}
        >
          {getStatusText()}
        </div>
      )}
    </div>
  );
});
