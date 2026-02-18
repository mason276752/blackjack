import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../context/GameContext';
import { CountingSystem } from '../../types/game.types';
import { HI_LO, KO, OMEGA_II } from '../../constants/gameDefaults';
import { CountingSystemWarning } from './CountingSystemWarning';
import { getTrueCount } from '../../context/gameSelectors';

export function CompactCountDisplay() {
  const { t } = useTranslation('count');
  const { state, dispatch } = useGame();
  const [showWarning, setShowWarning] = useState(false);
  const [pendingSystem, setPendingSystem] = useState<CountingSystem | null>(null);

  const gameInProgress = state.phase !== 'betting' || state.currentBet > 0;

  // Calculate true count on-demand
  const trueCount = useMemo(
    () => getTrueCount(state.runningCount, state.cardsRemaining),
    [state.runningCount, state.cardsRemaining]
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
          }}
        >
          <button
            style={getButtonStyle(state.countingSystem.name === 'Hi-Lo')}
            onClick={() => handleSystemSelect(HI_LO)}
          >
            {t('hiLo')}
          </button>
          <button
            style={getButtonStyle(state.countingSystem.name === 'KO')}
            onClick={() => handleSystemSelect(KO)}
          >
            {t('ko')}
          </button>
          <button
            style={getButtonStyle(state.countingSystem.name === 'Omega II')}
            onClick={() => handleSystemSelect(OMEGA_II)}
          >
            {t('omegaII')}
          </button>
        </div>

        {/* Count Display - Compact Three-Line Layout */}
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

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '2px',
            }}
          >
            <span style={{ color: '#94a3b8' }}>{t('trueCount')}:</span>
            <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>
              {trueCount > 0 ? '+' : ''}
              {trueCount.toFixed(1)}
            </span>
          </div>

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
      </div>

      <CountingSystemWarning
        isOpen={showWarning}
        onConfirm={handleConfirmChange}
        onCancel={handleCancelChange}
      />
    </>
  );
}
