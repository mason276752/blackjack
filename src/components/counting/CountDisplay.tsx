import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../context/GameContext';
import { CountingSystem } from '../../types/game.types';
import { HI_LO, KO, OMEGA_II } from '../../constants/gameDefaults';
import { CountingSystemWarning } from './CountingSystemWarning';
import { getTrueCount } from '../../context/gameSelectors';

export function CountDisplay() {
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
    padding: '4px 10px',
    backgroundColor: isActive ? '#06b6d4' : 'transparent',
    color: isActive ? 'white' : '#94a3b8',
    border: isActive ? 'none' : '1px solid rgba(148, 163, 184, 0.3)',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: isActive ? 'bold' : 'normal',
    transition: 'all 0.2s ease',
  });

  return (
    <>
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          border: '2px solid #06b6d4',
          borderRadius: '8px',
          padding: '12px 16px',
          minWidth: '240px',
        }}
      >
        {/* System Selector */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>
            {t('systemSelector')}
          </div>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-between' }}>
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
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(148, 163, 184, 0.2)', margin: '8px 0' }} />

        {/* Count Display */}
        <div style={{ fontSize: '14px', color: '#06b6d4', fontWeight: 'bold', marginBottom: '8px' }}>
          {t('cardCounting')}
        </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ color: '#94a3b8' }}>{t('runningCount')}:</span>
        <span style={{ color: 'white', fontWeight: 'bold' }}>
          {state.runningCount > 0 ? '+' : ''}{state.runningCount}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ color: '#94a3b8' }}>{t('trueCount')}:</span>
        <span style={{ color: 'white', fontWeight: 'bold' }}>
          {trueCount > 0 ? '+' : ''}{trueCount.toFixed(1)}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
        <span style={{ color: '#94a3b8' }}>{t('decksRemaining')}:</span>
        <span style={{ color: '#94a3b8' }}>
          {(state.cardsRemaining / 52).toFixed(1)}
        </span>
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
