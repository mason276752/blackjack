import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../context/GameContext';
import { isPair } from '../../lib/deck/Card';
import { StrategyResolver } from '../../lib/strategy/StrategyResolver';
import { getActiveStrategySet, getEffectiveCount } from '../../context/gameSelectors';

export function StrategyHint() {
  const { t } = useTranslation('strategy');
  const { state, strategy } = useGame();

  const hint = useMemo(() => {
    // Check if we have dealer hand
    if (!state.dealerHand || state.dealerHand.length === 0) return null;

    // Get the hand to evaluate
    let handToEvaluate;
    if (state.phase === 'player_turn') {
      // During player turn, use active hand
      handToEvaluate = state.hands[state.activeHandIndex];
      if (!handToEvaluate || handToEvaluate.status !== 'active') return null;
    } else {
      // For other phases, use the first hand (or last active hand)
      if (state.hands.length === 0) return null;
      handToEvaluate = state.hands[0];
    }

    const dealerUpCard = state.dealerHand[0];

    const canDouble = handToEvaluate.cards.length === 2 &&
                      state.balance >= handToEvaluate.bet &&
                      (!handToEvaluate.split || state.rules.doubleAfterSplit);

    const canSplit = handToEvaluate.cards.length === 2 &&
                     isPair(handToEvaluate.cards) &&
                     handToEvaluate.splitCount < state.rules.maxSplits &&
                     state.balance >= handToEvaluate.bet;

    const canSurrender = state.rules.lateSurrender &&
                         handToEvaluate.cards.length === 2 &&
                         state.hands.length === 1;

    // Get basic strategy action
    const basicAction = strategy.getOptimalAction(
      handToEvaluate.cards,
      dealerUpCard,
      canDouble,
      canSplit,
      canSurrender
    );

    // Check for counting system deviation
    const strategySet = getActiveStrategySet(state);
    const resolver = new StrategyResolver(strategySet);
    const effectiveCount = getEffectiveCount(state);

    const isPairHand = isPair(handToEvaluate.cards);
    const pairRank = isPairHand ? handToEvaluate.cards[0].rank : undefined;

    const deviation = resolver.findDeviation(
      handToEvaluate.value,
      dealerUpCard,
      isPairHand,
      pairRank
    );

    let finalAction = basicAction;
    let deviationApplied = false;

    if (deviation && resolver.shouldDeviate(deviation, effectiveCount)) {
      finalAction = deviation.deviationAction as any;
      deviationApplied = true;
    }

    return {
      action: finalAction,
      description: strategy.getActionDescription(finalAction),
      deviationApplied,
      deviation: deviationApplied ? deviation : undefined,
      effectiveCount,
      basicAction,
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

  const isVisible = state.showStrategyHint && hint !== null && state.phase !== 'betting';

  return (
    <div
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        border: `2px solid ${hint ? getActionColor(hint.action) : 'transparent'}`,
        borderRadius: '8px',
        padding: '12px 20px',
        margin: '16px auto',
        maxWidth: '500px',
        minHeight: '160px',
        height: '160px',
        overflow: 'hidden',
        textAlign: 'center',
        visibility: isVisible ? 'visible' : 'hidden',
      }}
    >
      {hint && (
        <>
          {/* Basic Strategy */}
          <div style={{ marginBottom: hint.deviationApplied ? '8px' : '0' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
              {t('basicStrategySuggests')}:
            </div>
            <div
              style={{
                fontSize: hint.deviationApplied ? '16px' : '20px',
                fontWeight: 'bold',
                color: hint.deviationApplied ? '#64748b' : getActionColor(hint.action),
                textDecoration: hint.deviationApplied ? 'line-through' : 'none',
              }}
            >
              {t(strategy.getActionDescription(hint.basicAction))}
            </div>
          </div>

          {/* Counting Deviation (if applied) */}
          {hint.deviationApplied && hint.deviation && (
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            paddingTop: '8px',
          }}
        >
          <div style={{ fontSize: '11px', color: '#06b6d4', marginBottom: '4px', fontWeight: 'bold' }}>
            📊 {state.countingSystem.name} {t('deviation')} ({state.countingSystem.isBalanced ? 'TC' : 'RC'}: {hint.effectiveCount > 0 ? '+' : ''}{hint.effectiveCount})
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
          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px', fontStyle: 'italic' }}>
            {hint.deviation.description}
          </div>
        </div>
          )}
        </>
      )}
    </div>
  );
}
