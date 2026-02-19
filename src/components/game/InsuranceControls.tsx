import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';

export function InsuranceControls() {
  const { t } = useTranslation('game');
  const { state, dispatch } = useGame();

  // Only show insurance when:
  // 1. Game is in player_turn phase
  // 2. Dealer's up card is Ace
  // 3. Insurance is allowed by rules
  // 4. Insurance hasn't been decided yet
  // 5. No split hands yet (insurance offered before splits)
  const shouldShowInsurance =
    state.phase === 'player_turn' &&
    state.dealerHand.length > 0 &&
    state.dealerHand[0]?.rank === 'A' &&
    state.rules.insuranceAllowed &&
    state.insuranceBet === 0 &&
    state.hands.length === 1 &&
    state.hands[0].cards.length === 2;

  if (!shouldShowInsurance) return null;

  const insuranceCost = Math.floor(state.currentBet / 2);
  const canAffordInsurance = state.balance >= insuranceCost;

  const handleTakeInsurance = () => {
    dispatch({ type: 'TAKE_INSURANCE' });
  };

  const handleDeclineInsurance = () => {
    dispatch({ type: 'DECLINE_INSURANCE' });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: '#1e293b',
          border: '2px solid #fbbf24',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        }}
      >
        <h3
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#fbbf24',
            marginBottom: '12px',
            textAlign: 'center',
          }}
        >
          {t('insuranceOffered')}
        </h3>

        <div
          style={{
            fontSize: '14px',
            color: '#d1d5db',
            marginBottom: '16px',
            lineHeight: '1.5',
            textAlign: 'center',
          }}
        >
          <p style={{ marginBottom: '8px' }}>
            {t('insuranceCost')}: <strong style={{ color: '#fbbf24' }}>${insuranceCost}</strong>
          </p>
          <p style={{ marginBottom: '8px' }}>
            {t('insurancePayout')}
          </p>
          <p style={{ fontSize: '12px', color: '#94a3b8' }}>
            {t('currentBalance')}: ${state.balance}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Button
            variant="danger"
            size="md"
            onClick={handleDeclineInsurance}
          >
            ✕ {t('decline')}
          </Button>
          <Button
            variant="warning"
            size="md"
            onClick={handleTakeInsurance}
            disabled={!canAffordInsurance}
          >
            ✓ {t('takeInsurance')} (${insuranceCost})
          </Button>
        </div>

        {!canAffordInsurance && (
          <div
            style={{
              marginTop: '12px',
              padding: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#ef4444',
              textAlign: 'center',
            }}
          >
            {t('insufficientBalance')}
          </div>
        )}
      </div>
    </div>
  );
}
