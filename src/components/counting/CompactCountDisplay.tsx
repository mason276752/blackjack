import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../context/GameContext';
import { CountingSystem } from '../../types/game.types';
import { HI_LO, KO, OMEGA_II, ZEN_COUNT, CAC2 } from '../../constants/gameDefaults';
import { CountingSystemWarning } from './CountingSystemWarning';
import { getEffectiveCount, getActiveStrategySet } from '../../context/gameSelectors';

export function CompactCountDisplay() {
  const { t } = useTranslation('count');
  const { state, dispatch } = useGame();
  const [showWarning, setShowWarning] = useState(false);
  const [pendingSystem, setPendingSystem] = useState<CountingSystem | null>(null);

  const gameInProgress = state.phase !== 'betting' || state.currentBet > 0;

  // Get effective count and active strategy set
  const effectiveCount = useMemo(
    () => getEffectiveCount(state),
    [state.runningCount, state.cardsRemaining, state.countingSystem.isBalanced]
  );

  const activeStrategySet = useMemo(
    () => getActiveStrategySet(state),
    [state.countingSystem.id]
  );

  const handleSystemSelect = (system: CountingSystem) => {
    if (state.countingSystem.name === system.name) return;

    if (gameInProgress) {
      setPendingSystem(system);
      setShowWarning(true);
    } else {
      dispatch({ type: 'SET_COUNTING_SYSTEM', system });
    }
  };

  const handleConfirmChange = () => {
    if (pendingSystem) {
      dispatch({ type: 'SET_COUNTING_SYSTEM', system: pendingSystem });
      setPendingSystem(null);
    }
    setShowWarning(false);
  };

  const handleCancelChange = () => {
    setPendingSystem(null);
    setShowWarning(false);
  };

  const getButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: isActive ? '#06b6d4' : 'rgba(255, 255, 255, 0.1)',
    color: isActive ? 'white' : '#94a3b8',
    cursor: 'pointer',
    transition: 'all 0.2s',
  });

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          minWidth: '240px',
        }}
      >
        {/* System Selector - Horizontal Button Group */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          <button
            style={getButtonStyle(state.countingSystem.id === 'hi-lo')}
            onClick={() => handleSystemSelect(HI_LO)}
          >
            {t('systemName.hi-lo')}
          </button>
          <button
            style={getButtonStyle(state.countingSystem.id === 'ko')}
            onClick={() => handleSystemSelect(KO)}
          >
            {t('systemName.ko')}
          </button>
          <button
            style={getButtonStyle(state.countingSystem.id === 'omega-ii')}
            onClick={() => handleSystemSelect(OMEGA_II)}
          >
            {t('systemName.omega-ii')}
          </button>
          <button
            style={getButtonStyle(state.countingSystem.id === 'zen')}
            onClick={() => handleSystemSelect(ZEN_COUNT)}
          >
            {t('systemName.zen')}
          </button>
          <button
            style={getButtonStyle(state.countingSystem.id === 'cac2')}
            onClick={() => handleSystemSelect(CAC2)}
          >
            {t('systemName.cac2')}
          </button>
        </div>

        {/* Count Display - Compact Layout */}
        <div style={{ fontSize: '13px', lineHeight: '1.4' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '2px',
            }}
          >
            <span style={{ color: '#94a3b8' }}>{t('runningCount')}:</span>
            <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>
              {state.runningCount > 0 ? '+' : ''}
              {state.runningCount}
            </span>
          </div>

          {state.countingSystem.isBalanced && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '2px',
              }}
            >
              <span style={{ color: '#94a3b8' }}>{t('trueCount')}:</span>
              <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>
                {effectiveCount > 0 ? '+' : ''}
                {effectiveCount.toFixed(1)}
              </span>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
            }}
          >
            <span style={{ color: '#94a3b8' }}>{t('decksRemaining')}:</span>
            <span style={{ color: '#6b7280' }}>
              {(state.cardsRemaining / 52).toFixed(1)}
            </span>
          </div>
        </div>

        {/* Strategy Pairing Indicator */}
        <div
          style={{
            fontSize: '11px',
            color: '#94a3b8',
            marginTop: '4px',
            paddingTop: '8px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ marginBottom: '2px' }}>
            <span style={{ color: '#6b7280' }}>{t('strategy')}:</span>{' '}
            <span style={{ color: '#fbbf24' }}>{activeStrategySet.name}</span>
          </div>
          <div style={{ fontSize: '10px', color: '#6b7280' }}>
            {activeStrategySet.deviations.length} {t('indexPlays')}
          </div>
        </div>
      </div>

      <CountingSystemWarning
        isOpen={showWarning}
        onConfirm={handleConfirmChange}
        onCancel={handleCancelChange}
      />
    </>
  );
}
