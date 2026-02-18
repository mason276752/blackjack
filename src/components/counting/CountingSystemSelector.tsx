import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../context/GameContext';
import { CountingSystem } from '../../types/game.types';
import { HI_LO, KO, OMEGA_II } from '../../constants/gameDefaults';
import { CountingSystemWarning } from './CountingSystemWarning';

export function CountingSystemSelector() {
  const { t } = useTranslation('count');
  const { state, dispatch } = useGame();
  const [showWarning, setShowWarning] = useState(false);
  const [pendingSystem, setPendingSystem] = useState<CountingSystem | null>(null);

  // Check if game is in progress
  const gameInProgress = state.phase !== 'betting' || state.currentBet > 0;

  const handleSystemSelect = (system: CountingSystem) => {
    // Don't allow changing if already using this system
    if (state.countingSystem.name === system.name) {
      return;
    }

    // If game is in progress, show warning modal
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

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#9ca3af',
    fontWeight: 'normal',
  };

  const buttonsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
  };

  const getButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '6px 12px',
    backgroundColor: isActive ? '#8b5cf6' : 'transparent',
    color: isActive ? 'white' : '#9ca3af',
    border: isActive ? 'none' : '1px solid rgba(156, 163, 175, 0.3)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: isActive ? 'bold' : 'normal',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  });

  return (
    <>
      <div style={containerStyle}>
        <span style={labelStyle}>{t('systemSelector', 'Counting System:')}</span>
        <div style={buttonsContainerStyle}>
          <button
            style={getButtonStyle(state.countingSystem.name === 'Hi-Lo')}
            onClick={() => handleSystemSelect(HI_LO)}
            title={`${t('hiLo', 'Hi-Lo')} - BC: 0.97, PE: 0.51`}
          >
            {t('hiLo', 'Hi-Lo')}
          </button>
          <button
            style={getButtonStyle(state.countingSystem.name === 'KO')}
            onClick={() => handleSystemSelect(KO)}
            title={`${t('ko', 'KO')} - BC: 0.98, PE: 0.55 (Unbalanced)`}
          >
            {t('ko', 'KO')}
          </button>
          <button
            style={getButtonStyle(state.countingSystem.name === 'Omega II')}
            onClick={() => handleSystemSelect(OMEGA_II)}
            title={`${t('omegaII', 'Omega II')} - BC: 0.99, PE: 0.67 (Advanced)`}
          >
            {t('omegaII', 'Omega II')}
          </button>
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
