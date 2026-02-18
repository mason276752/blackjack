import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../context/GameContext';
import { GameRules } from '../../types/game.types';
import { VEGAS_STRIP_RULES, SINGLE_DECK_RULES, ATLANTIC_CITY_RULES } from '../../constants/gameDefaults';
import { PresetSelector, PresetType } from './PresetSelector';
import { CustomRulesForm } from './CustomRulesForm';
import { ConfirmModal } from './ConfirmModal';

interface RulesConfigSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RulesConfigSidebar({ isOpen, onClose }: RulesConfigSidebarProps) {
  const { t } = useTranslation('rules');
  const { state, dispatch } = useGame();

  const [selectedPreset, setSelectedPreset] = useState<PresetType>('vegas');
  const [customRules, setCustomRules] = useState<GameRules>(state.rules);
  const [showConfirm, setShowConfirm] = useState(false);

  // Initialize customRules when sidebar opens
  useEffect(() => {
    if (isOpen) {
      setCustomRules(state.rules);
      // Determine which preset is currently selected based on current rules
      if (JSON.stringify(state.rules) === JSON.stringify(VEGAS_STRIP_RULES)) {
        setSelectedPreset('vegas');
      } else if (JSON.stringify(state.rules) === JSON.stringify(SINGLE_DECK_RULES)) {
        setSelectedPreset('single');
      } else if (JSON.stringify(state.rules) === JSON.stringify(ATLANTIC_CITY_RULES)) {
        setSelectedPreset('atlantic');
      } else {
        setSelectedPreset('custom');
      }
    }
  }, [isOpen, state.rules]);

  const handlePresetSelect = (preset: PresetType) => {
    setSelectedPreset(preset);
    if (preset === 'vegas') {
      setCustomRules(VEGAS_STRIP_RULES);
    } else if (preset === 'single') {
      setCustomRules(SINGLE_DECK_RULES);
    } else if (preset === 'atlantic') {
      setCustomRules(ATLANTIC_CITY_RULES);
    }
    // For 'custom', keep current customRules
  };

  const handleRuleChange = (field: keyof GameRules, value: any) => {
    setCustomRules((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Automatically switch to custom mode when user modifies any rule
    if (selectedPreset !== 'custom') {
      setSelectedPreset('custom');
    }
  };

  const handleApplyRules = () => {
    const rulesChanged = JSON.stringify(customRules) !== JSON.stringify(state.rules);
    const gameInProgress = state.phase !== 'betting' || state.currentBet > 0;

    if (rulesChanged && gameInProgress) {
      setShowConfirm(true);
    } else if (rulesChanged) {
      dispatch({ type: 'SET_RULES', rules: customRules });
      onClose();
    } else {
      onClose();
    }
  };

  const handleConfirmReset = () => {
    dispatch({ type: 'SET_RULES', rules: customRules });
    dispatch({ type: 'RESET_GAME' });
    setShowConfirm(false);
    onClose();
  };

  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    right: 0,
    height: '100vh',
    width: '400px',
    backgroundColor: '#1e293b',
    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.3s ease-in-out',
    zIndex: 1000,
    overflowY: 'auto',
    boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.5)',
    padding: '20px',
  };

  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    zIndex: 999,
    display: isOpen ? 'block' : 'none',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fbbf24',
  };

  const closeButtonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#9ca3af',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '4px 8px',
  };

  const applyButtonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#22c55e',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px',
  };

  return (
    <>
      <div style={backdropStyle} onClick={onClose} />
      <div style={sidebarStyle}>
        <div style={headerStyle}>
          <div style={titleStyle}>{t('title')}</div>
          <button style={closeButtonStyle} onClick={onClose}>
            ✕
          </button>
        </div>

        <PresetSelector selectedPreset={selectedPreset} onSelectPreset={handlePresetSelect} />

        <CustomRulesForm
          rules={customRules}
          onChange={handleRuleChange}
          disabled={selectedPreset !== 'custom'}
        />

        <button style={applyButtonStyle} onClick={handleApplyRules}>
          {t('applyChanges')}
        </button>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title={t('confirmTitle')}
        message={t('confirmMessage')}
        onConfirm={handleConfirmReset}
        onCancel={() => setShowConfirm(false)}
        confirmText={t('confirmButton')}
        cancelText={t('cancelButton')}
      />
    </>
  );
}
