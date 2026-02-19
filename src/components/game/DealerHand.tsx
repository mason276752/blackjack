import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card as CardType } from '../../types/card.types';
import { Card } from './Card';
import { HandEvaluator } from '../../lib/hand/HandEvaluator';

interface DealerHandProps {
  cards: CardType[];
  hideHoleCard: boolean;
}

export const DealerHand = memo(function DealerHand({ cards, hideHoleCard }: DealerHandProps) {
  const { t } = useTranslation(['common', 'hand']);
  const visibleCards = hideHoleCard && cards.length > 1 ? [cards[0]] : cards;
  const displayValue = hideHoleCard && cards.length > 1
    ? HandEvaluator.calculateValue([cards[0]])
    : HandEvaluator.calculateValue(cards);

  return (
    <div
      style={{
        border: '2px solid #9333ea',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        minWidth: '200px',
      }}
    >
      <div style={{ marginBottom: '8px' }}>
        <span style={{ fontWeight: 'bold', color: '#9333ea', fontSize: '18px' }}>
          {t('common:dealer')} {hideHoleCard && cards.length > 1 ? '' : (() => {
            const desc = HandEvaluator.getHandDescription(cards);
            if (desc.key === 'value') return desc.value;
            return desc.value !== undefined ? t(`hand:${desc.key}`, { value: desc.value }) : t(`hand:${desc.key}`);
          })()}
        </span>
        {!hideHoleCard && cards.length > 0 && (
          <span style={{ color: '#94a3b8', marginLeft: '8px', fontSize: '14px' }}>
            ({displayValue})
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {cards.map((card, index) => (
          <Card
            key={`${card.rank}-${card.suit}-${index}`}
            card={card}
            faceDown={hideHoleCard && index === 1}
          />
        ))}
      </div>
    </div>
  );
});
