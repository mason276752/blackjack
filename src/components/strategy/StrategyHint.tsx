import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../context/GameContext';
import { isPair } from '../../lib/deck/Card';

export function StrategyHint() {
  const { t } = useTranslation('strategy');
  const { state, strategy } = useGame();

  const hint = useMemo(() => {
    if (state.phase !== 'player_turn') return null;

    const currentHand = state.hands[state.activeHandIndex];
    if (!currentHand || currentHand.status !== 'active') return null;
    if (!state.dealerHand || state.dealerHand.length === 0) return null;

    const dealerUpCard = state.dealerHand[0];

    const canDouble = currentHand.cards.length === 2 &&
                      state.balance >= currentHand.bet &&
                      (!currentHand.split || state.rules.doubleAfterSplit);

    const canSplit = currentHand.cards.length === 2 &&
                     isPair(currentHand.cards) &&
                     currentHand.splitCount < state.rules.maxSplits &&
                     state.balance >= currentHand.bet;

    const canSurrender = state.rules.lateSurrender &&
                         currentHand.cards.length === 2 &&
                         state.hands.length === 1;

    const action = strategy.getOptimalAction(
      currentHand.cards,
      dealerUpCard,
      canDouble,
      canSplit,
      canSurrender
    );

    return {
      action,
      description: strategy.getActionDescription(action),
    };
  }, [state, strategy]);

  const getActionColor = (action: string) => {
    if (action === 'H' || action === 'DH') return '#fbbf24';
    if (action === 'S' || action === 'DS') return '#22c55e';
    if (action === 'D') return '#3b82f6';
    if (action === 'SP') return '#a855f7';
    if (action === 'SU') return '#ef4444';
    return '#94a3b8';
  };

  const isVisible = state.showStrategyHint && hint !== null;

  return (
    <div
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        border: `2px solid ${hint ? getActionColor(hint.action) : '#94a3b8'}`,
        borderRadius: '8px',
        padding: '12px 20px',
        margin: '16px auto',
        maxWidth: '300px',
        textAlign: 'center',
        minHeight: '72px',
        visibility: isVisible ? 'visible' : 'hidden',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}
    >
      {hint && (
        <>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
            {t('basicStrategySuggests')}:
          </div>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: getActionColor(hint.action),
            }}
          >
            {t(hint.description)}
          </div>
        </>
      )}
    </div>
  );
}
