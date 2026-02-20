import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../context/GameContext';
import { GameRules } from '../../types/game.types';
import { VEGAS_STRIP_RULES, SINGLE_DECK_RULES, ATLANTIC_CITY_RULES } from '../../constants/gameDefaults';
import { PresetSelector, PresetType } from './PresetSelector';
import { CustomRulesForm } from './CustomRulesForm';
import { ConfirmModal } from './ConfirmModal';
import { HouseEdgeCalculator } from '../../lib/strategy/HouseEdgeCalculator';
import { saveSelectedPreset, loadSelectedPreset } from '../../lib/storage/gameStorage';

export function RulesPanel() {
  const { t } = useTranslation('rules');
  const { state, dispatch } = useGame();

  // Load saved preset or default to 'vegas'
  const [selectedPreset, setSelectedPreset] = useState<PresetType>(() => {
    const saved = loadSelectedPreset();
    return saved || 'vegas';
  });
  const [customRules, setCustomRules] = useState<GameRules>(state.rules);
  const [showConfirm, setShowConfirm] = useState(false);

  // Determine if panel is locked
  const isLocked = state.phase !== 'betting' || state.currentBet > 0;

  // Initialize customRules from current state rules
  useEffect(() => {
    setCustomRules(state.rules);

    // Only auto-detect preset on initial load, not when selectedPreset is already set to 'custom'
    const savedPreset = loadSelectedPreset();
    if (savedPreset === 'custom') {
      // User explicitly chose custom, keep it as custom even if rules match a preset
      return;
    }

    // Auto-detect which preset matches current rules
    if (JSON.stringify(state.rules) === JSON.stringify(VEGAS_STRIP_RULES)) {
      setSelectedPreset('vegas');
    } else if (JSON.stringify(state.rules) === JSON.stringify(SINGLE_DECK_RULES)) {
      setSelectedPreset('single');
    } else if (JSON.stringify(state.rules) === JSON.stringify(ATLANTIC_CITY_RULES)) {
      setSelectedPreset('atlantic');
    } else {
      setSelectedPreset('custom');
    }
  }, [state.rules]);

  // Save selectedPreset to localStorage whenever it changes
  useEffect(() => {
    saveSelectedPreset(selectedPreset);
  }, [selectedPreset]);

  const handlePresetSelect = (preset: PresetType) => {
    if (isLocked) return;

    setSelectedPreset(preset);
    let newRules: GameRules;

    if (preset === 'vegas') {
      newRules = VEGAS_STRIP_RULES;
    } else if (preset === 'single') {
      newRules = SINGLE_DECK_RULES;
    } else if (preset === 'atlantic') {
      newRules = ATLANTIC_CITY_RULES;
    } else {
      // For 'custom', keep current customRules
      return;
    }

    setCustomRules(newRules);
    // Auto-apply preset rules immediately
    applyRulesChange(newRules);
  };

  const handleRuleChange = (field: keyof GameRules, value: any) => {
    if (isLocked) return;

    const newRules = {
      ...customRules,
      [field]: value,
    };

    setCustomRules(newRules);

    // Automatically switch to custom mode when user modifies any rule
    if (selectedPreset !== 'custom') {
      setSelectedPreset('custom');
    }

    // Auto-apply rule change immediately
    applyRulesChange(newRules);
  };

  const applyRulesChange = (newRules: GameRules) => {
    const rulesChanged = JSON.stringify(newRules) !== JSON.stringify(state.rules);
    const gameInProgress = state.phase !== 'betting' || state.currentBet > 0;

    if (rulesChanged && gameInProgress) {
      // Save pending rules for confirmation
      setCustomRules(newRules);
      setShowConfirm(true);
    } else if (rulesChanged) {
      dispatch({ type: 'SET_RULES', rules: newRules });
    }
  };

  const handleConfirmReset = () => {
    dispatch({ type: 'SET_RULES', rules: customRules });
    dispatch({ type: 'RESET_GAME' });
    setShowConfirm(false);
  };

  // Calculate player advantage based on current rules
  const playerAdvantage = useMemo(() => {
    return HouseEdgeCalculator.getPlayerAdvantage(customRules);
  }, [customRules]);

  const houseEdge = useMemo(() => {
    return HouseEdgeCalculator.calculateHouseEdge(customRules);
  }, [customRules]);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    opacity: isLocked ? 0.6 : 1,
    transition: 'opacity 0.3s ease',
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
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#fbbf24',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const lockIconStyle: React.CSSProperties = {
    fontSize: '16px',
  };

  const lockMessageStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#9ca3af',
    fontWeight: 'normal',
    marginTop: '4px',
  };

  return (
    <>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div style={{ flex: 1 }}>
            <div style={titleStyle}>
              {isLocked && <span style={lockIconStyle}>🔒</span>}
              {t('panelTitle', 'Game Rules')}
            </div>
            {isLocked && (
              <div style={lockMessageStyle}>
                {t('locked', 'Rules are locked during gameplay')}
              </div>
            )}
          </div>

          {/* Player Advantage Display */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '4px'
          }}>
            <div style={{
              fontSize: '11px',
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {t('playerAdvantage', 'Player Advantage')}
            </div>
            <div style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: playerAdvantage >= 0 ? '#22c55e' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {playerAdvantage >= 0 ? '+' : ''}{playerAdvantage.toFixed(2)}%
              <span style={{ fontSize: '14px' }}>
                {playerAdvantage >= 0 ? '📈' : '📉'}
              </span>
            </div>
            <div style={{
              fontSize: '10px',
              color: '#64748b',
              fontStyle: 'italic'
            }}>
              {t('houseEdge', 'House Edge')}: {houseEdge >= 0 ? '+' : ''}{houseEdge.toFixed(2)}%
            </div>
          </div>
        </div>

        <PresetSelector
          selectedPreset={selectedPreset}
          onSelectPreset={handlePresetSelect}
        />

        <CustomRulesForm
          rules={customRules}
          onChange={handleRuleChange}
          disabled={isLocked || selectedPreset !== 'custom'}
        />
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
