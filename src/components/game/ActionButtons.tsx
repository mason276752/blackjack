import { useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../context/GameContext';
import { useGameLogic } from '../../hooks/useGameLogic';
import { useAIPlayer } from '../../hooks/useAIPlayer';
import { isPair } from '../../lib/deck/Card';
import { theme } from '../../styles';
import { Button } from '../common/Button';

export const ActionButtons = memo(function ActionButtons() {
  const { t } = useTranslation('actions');
  const { state } = useGame();
  const { hit, stand, doubleDown, split, surrender } = useGameLogic();
  const { aiState } = useAIPlayer();

  // Disable all actions when AI is playing
  const isAIPlaying = aiState.isEnabled && aiState.isPlaying;

  const currentHand = state.hands[state.activeHandIndex];

  const canHit = useMemo(() => {
    if (isAIPlaying) return false;
    if (state.phase !== 'player_turn') return false;
    if (!currentHand || currentHand.status !== 'active') return false;
    if (currentHand.value >= 21) return false;
    if (currentHand.doubled) return false;
    if (currentHand.split && !state.rules.canHitSplitAces && currentHand.cards[0].rank === 'A') {
      return false;
    }
    return true;
  }, [isAIPlaying, state.phase, currentHand, state.rules]);

  const canStand = useMemo(() => {
    if (isAIPlaying) return false;
    if (state.phase !== 'player_turn') return false;
    if (!currentHand || currentHand.status !== 'active') return false;
    return true;
  }, [isAIPlaying, state.phase, currentHand]);

  const canDouble = useMemo(() => {
    if (isAIPlaying) return false;
    if (state.phase !== 'player_turn') return false;
    if (!currentHand || currentHand.status !== 'active') return false;
    if (currentHand.cards.length !== 2) return false;
    if (currentHand.split && !state.rules.doubleAfterSplit) return false;
    if (state.balance < currentHand.bet) return false;

    // Check double restrictions
    if (state.rules.doubleOn === '9-11') {
      return currentHand.value >= 9 && currentHand.value <= 11;
    }
    if (state.rules.doubleOn === '10-11') {
      return currentHand.value >= 10 && currentHand.value <= 11;
    }
    return true;
  }, [isAIPlaying, state.phase, currentHand, state.balance, state.rules]);

  const canSplit = useMemo(() => {
    if (isAIPlaying) return false;
    if (state.phase !== 'player_turn') return false;
    if (!currentHand || currentHand.status !== 'active') return false;
    if (currentHand.cards.length !== 2) return false;
    if (!isPair(currentHand.cards)) return false;
    if (currentHand.splitCount >= state.rules.maxSplits) return false;
    if (currentHand.cards[0].rank === 'A' && !state.rules.canResplitAces && currentHand.splitCount > 0) {
      return false;
    }
    if (state.balance < currentHand.bet) return false;
    return true;
  }, [isAIPlaying, state.phase, currentHand, state.balance, state.rules]);

  const canSurrender = useMemo(() => {
    if (isAIPlaying) return false;
    if (!state.rules.lateSurrender) return false;
    if (state.phase !== 'player_turn') return false;
    if (!currentHand || currentHand.status !== 'active') return false;
    if (currentHand.cards.length !== 2) return false;
    if (state.hands.length > 1) return false;
    return true;
  }, [isAIPlaying, state.phase, currentHand, state.hands.length, state.rules]);

  // Render buttons directly without wrapper for inline display
  return (
    <>
      {state.phase === 'player_turn' && (
        <>
          <Button
            variant="primary"
            size="md"
            disabled={!canHit}
            onClick={hit}
          >
            {t('hit')}
          </Button>
          <Button
            variant="primary"
            size="md"
            disabled={!canStand}
            onClick={stand}
          >
            {t('stand')}
          </Button>
          <Button
            variant="primary"
            size="md"
            disabled={!canDouble}
            onClick={doubleDown}
          >
            {t('double')}
          </Button>
          <Button
            variant="primary"
            size="md"
            disabled={!canSplit}
            onClick={split}
          >
            {t('split')}
          </Button>
          <Button
            variant="primary"
            size="md"
            disabled={!canSurrender}
            onClick={surrender}
          >
            {t('surrender')}
          </Button>
        </>
      )}
    </>
  );
});
