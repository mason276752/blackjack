import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../context/GameContext';
import { CountingSystem } from '../../types/game.types';
import { HI_LO, KO, OMEGA_II, ZEN_COUNT, CAC2 } from '../../constants/gameDefaults';
import { CountingSystemWarning } from './CountingSystemWarning';
import { getEffectiveCount, getActiveStrategySet } from '../../context/gameSelectors';

export function CompactCountDisplay() {
  const { t, i18n } = useTranslation('count');
  const { state, dispatch } = useGame();
  const [showWarning, setShowWarning] = useState(false);
  const [pendingSystem, setPendingSystem] = useState<CountingSystem | null>(null);
  const [hoveredSystem, setHoveredSystem] = useState<string | null>(null);

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
    position: 'relative',
  });

  const renderSystemButton = (system: CountingSystem, systemId: string) => (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setHoveredSystem(systemId)}
      onMouseLeave={() => setHoveredSystem(null)}
    >
      <button
        style={getButtonStyle(state.countingSystem.id === systemId)}
        onClick={() => handleSystemSelect(system)}
      >
        {t(`systemName.${systemId}`)}
      </button>

      {/* Custom Tooltip */}
      {hoveredSystem === systemId && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            padding: '12px 14px',
            backgroundColor: '#1e293b',
            border: '1px solid #06b6d4',
            borderRadius: '8px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(6, 182, 212, 0.2)',
            minWidth: '220px',
            maxWidth: '280px',
            fontSize: '11px',
            lineHeight: '1.5',
            color: '#e2e8f0',
            whiteSpace: 'pre-line',
            textAlign: 'left',
            pointerEvents: 'none',
          }}
        >
          {/* Arrow */}
          <div
            style={{
              position: 'absolute',
              top: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '6px solid #06b6d4',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderBottom: '5px solid #1e293b',
            }}
          />

          {/* Tooltip Content */}
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#06b6d4', marginBottom: '8px' }}>
            {t(`systemName.${systemId}`)}
          </div>

          {/* Card Values Section */}
          <div style={{
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            padding: '8px 10px',
            borderRadius: '6px',
            marginBottom: '8px',
            border: '1px solid rgba(6, 182, 212, 0.2)'
          }}>
            <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px', fontWeight: '500' }}>
              {i18n.language === 'zh-TW' ? '牌值計算：' : 'Card Values:'}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#e2e8f0',
              fontFamily: 'monospace',
              lineHeight: '1.6',
              whiteSpace: 'pre-line'
            }}>
              {(() => {
                const lines = t(`systemDescription.${systemId}`).split('\n');
                // Find where system characteristics start (non-card-value line)
                let cardValueLines = [];
                for (let i = 0; i < lines.length; i++) {
                  if (lines[i].match(/^[+\-\s]*\d+:/)) {
                    cardValueLines.push(lines[i]);
                  } else if (cardValueLines.length > 0) {
                    // Stop when we hit the first non-card-value line after card values started
                    break;
                  }
                }
                return cardValueLines.join('\n');
              })()}
            </div>
          </div>

          {/* System Characteristics */}
          <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.5' }}>
            {(() => {
              const lines = t(`systemDescription.${systemId}`).split('\n');
              // Find where system characteristics start
              let startIdx = 0;
              for (let i = 0; i < lines.length; i++) {
                if (!lines[i].match(/^[+\-\s]*\d+:/)) {
                  startIdx = i;
                  break;
                }
              }
              return lines.slice(startIdx).join('\n');
            })()}
          </div>
        </div>
      )}
    </div>
  );

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
          {renderSystemButton(HI_LO, 'hi-lo')}
          {renderSystemButton(KO, 'ko')}
          {renderSystemButton(OMEGA_II, 'omega-ii')}
          {renderSystemButton(ZEN_COUNT, 'zen')}
          {renderSystemButton(CAC2, 'cac2')}
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
