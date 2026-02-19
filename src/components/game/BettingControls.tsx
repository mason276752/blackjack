import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../context/GameContext';
import { useGameLogic } from '../../hooks/useGameLogic';
import { useAIPlayer } from '../../hooks/useAIPlayer';
import { theme, textStyles, getChipColor, getOpacity, getCursor } from '../../styles';
import { Button } from '../common/Button';

const CHIP_VALUES = [25, 50, 100, 250, 500];

export function BettingControls() {
  const { t } = useTranslation(['betting', 'common']);
  const { state, dispatch } = useGame();
  const { dealCards } = useGameLogic();
  const { aiState } = useAIPlayer();
  const [selectedChip, setSelectedChip] = useState(25);

  // Disable all betting controls when AI is playing
  const isAIPlaying = aiState.isEnabled && aiState.isPlaying;

  const addBet = (amount: number) => {
    if (state.balance >= amount) {
      dispatch({ type: 'PLACE_BET', amount: state.currentBet + amount });
    }
  };

  const clearBet = () => {
    dispatch({ type: 'CLEAR_BET' });
  };

  const chipStyle = (value: number) => ({
    width: '60px',
    height: '60px',
    borderRadius: theme.borderRadius.full,
    border: selectedChip === value
      ? `3px solid ${theme.colors.warning}`
      : `2px solid ${theme.colors.text.secondary}`,
    backgroundColor: getChipColor(value),
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: theme.typography.fontSize.base,
    cursor: getCursor(isAIPlaying),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: theme.shadows.md,
    transition: theme.transition.all,
    margin: theme.spacing.xs,
    opacity: getOpacity(isAIPlaying),
  });

  if (state.phase !== 'betting') return null;

  return (
    <div style={{ textAlign: 'center', padding: theme.spacing.lg }}>
      <div style={{ marginBottom: theme.spacing.md }}>
        <h3 style={{
          ...textStyles.heading.h3,
          color: theme.colors.text.secondary,
          marginBottom: theme.spacing.sm,
        }}>
          {t('betting:selectChipValue')}
        </h3>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          {CHIP_VALUES.map(value => (
            <div
              key={value}
              style={chipStyle(value)}
              onClick={() => {
                if (!isAIPlaying) {
                  setSelectedChip(value);
                  addBet(value);
                }
              }}
            >
              ${value}
            </div>
          ))}
        </div>
      </div>

      <div style={{ margin: `${theme.spacing.md} 0` }}>
        <div style={{
          fontSize: theme.typography.fontSize.xl,
          color: theme.colors.text.secondary,
          marginBottom: theme.spacing.sm,
        }}>
          {t('common:currentBet')}: <span style={{
            color: theme.colors.warning,
            fontWeight: theme.typography.fontWeight.bold,
          }}>${state.currentBet}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: theme.spacing.sm, justifyContent: 'center' }}>
        <Button
          variant="success"
          size="md"
          disabled={state.currentBet === 0 || isAIPlaying}
          onClick={dealCards}
        >
          {t('common:dealCards')}
        </Button>
        <Button
          variant="danger"
          size="md"
          disabled={state.currentBet === 0 || isAIPlaying}
          onClick={clearBet}
        >
          {t('common:clearBet')}
        </Button>
      </div>
    </div>
  );
}
