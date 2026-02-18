import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../context/GameContext';
import { useGameLogic } from '../../hooks/useGameLogic';
import { DealerHand } from './DealerHand';
import { PlayerHand } from './PlayerHand';
import { ActionButtons } from './ActionButtons';
import { BettingControls } from './BettingControls';
import { StrategyHint } from '../strategy/StrategyHint';
import { CompactCountDisplay } from '../counting/CompactCountDisplay';
import { CompactStatsDisplay } from '../statistics/CompactStatsDisplay';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { GameLayout } from '../layout/GameLayout';
import { StrategyPanel } from '../strategy/StrategyPanel';
import { RulesPanel } from '../settings/RulesPanel';
import { HeaderCard } from '../layout/HeaderCard';
import { AIControlPanel } from '../ai/AIControlPanel';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { Button } from '../common/Button';
import { theme } from '../../styles';

export function GameBoard() {
  const { t } = useTranslation(['common', 'game']);
  const { state, dispatch } = useGame();
  const { playDealerHand, newRound } = useGameLogic();
  const dealerPlayingRef = useRef(false);

  // Auto-play dealer turn (防止雙重執行)
  useEffect(() => {
    if (state.phase === 'dealer_turn' &&
        state.dealerHand.length > 0 &&
        !dealerPlayingRef.current) {
      dealerPlayingRef.current = true;
      playDealerHand();
    }
  }, [state.phase, state.dealerHand.length, playDealerHand]);

  // 新回合開始時重設 ref
  useEffect(() => {
    if (state.phase === 'betting') {
      dealerPlayingRef.current = false;
    }
  }, [state.phase]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.colors.slate[800]} 0%, ${theme.colors.slate[900]} 100%)`,
        color: theme.colors.text.primary,
        padding: theme.spacing.lg,
        fontFamily: theme.typography.fontFamily.base,
      }}
    >
      {/* Header - Unified Card Layout */}
      <HeaderCard
        countingContent={<CompactCountDisplay />}
        titleContent={
          <>
            <h1 style={{ margin: 0, fontSize: theme.typography.fontSize['3xl'], color: theme.colors.warning, fontWeight: theme.typography.fontWeight.bold, lineHeight: 1 }}>
              {t('common:title')}
            </h1>
            <div style={{ display: 'flex', justifyContent: 'center', gap: theme.spacing.md, fontSize: theme.typography.fontSize.base }}>
              <div>
                {t('common:balance')}: <span style={{ color: theme.colors.success, fontWeight: theme.typography.fontWeight.bold }}>${state.balance}</span>
              </div>
              {state.currentBet > 0 && (
                <div>
                  {t('common:bet')}: <span style={{ color: theme.colors.warning, fontWeight: theme.typography.fontWeight.bold }}>${state.currentBet}</span>
                </div>
              )}
            </div>
          </>
        }
        controlsContent={
          <>
            <CompactStatsDisplay />
            <LanguageSwitcher />
          </>
        }
      />

      {/* Game Layout with Panels */}
      <GameLayout
        leftPanel={<StrategyPanel />}
        rightPanel={<RulesPanel />}
      >
        <ErrorBoundary>
          {/* Dealer Area */}
        {state.dealerHand.length > 0 && (
          <div style={{ marginBottom: theme.spacing['2xl'], display: 'flex', justifyContent: 'center' }}>
            <DealerHand cards={state.dealerHand} hideHoleCard={state.dealerHoleCardHidden} />
          </div>
        )}

        {/* Strategy Hint */}
        <StrategyHint />

        {/* Player Hands */}
        {state.hands.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginBottom: theme.spacing.lg }}>
            {state.hands.map((hand, index) => (
              <PlayerHand
                key={hand.id}
                hand={hand}
                isActive={index === state.activeHandIndex && state.phase === 'player_turn'}
              />
            ))}
          </div>
        )}

        {/* Message Display */}
        <div
          style={{
            textAlign: 'center',
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.warning,
            marginBottom: theme.spacing.lg,
            minHeight: '30px',
          }}
        >
          {state.message ? (
            state.message === 'dealerStands'
              ? t('game:dealerStandsWith', { value: state.dealerValue })
              : t(`game:${state.message}`)
          ) : ''}
        </div>

        {/* Action Buttons */}
        <ActionButtons />

        {/* Betting Controls */}
        <BettingControls />

        {/* AI Control Panel */}
        <AIControlPanel />

        {/* New Round Button */}
        {state.phase === 'resolution' && (
          <div style={{ textAlign: 'center', marginTop: theme.spacing.lg }}>
            <Button
              variant="success"
              size="lg"
              onClick={newRound}
            >
              {t('common:newRound')}
            </Button>
          </div>
        )}

        {/* Game Controls */}
        <div style={{ textAlign: 'center', marginTop: theme.spacing['2xl'] }}>
          <div style={{ display: 'inline-flex', gap: theme.spacing.sm, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              variant={state.showStrategyHint ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => dispatch({ type: 'TOGGLE_STRATEGY_HINT' })}
            >
              {state.showStrategyHint ? t('common:hide') : t('common:show')} {t('game:strategyHints')}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => dispatch({ type: 'RESET_GAME' })}
            >
              {t('common:resetGame')}
            </Button>
          </div>
        </div>

        {/* Game Info */}
        <div style={{ textAlign: 'center', marginTop: theme.spacing['2xl'], color: theme.colors.text.tertiary, fontSize: theme.typography.fontSize.sm }}>
          <div>{t('game:rules')}: {state.rules.dealerHitsSoft17 ? 'H17' : 'S17'} | {t('game:blackjackPays')} {state.rules.blackjackPayout === 1.5 ? '3:2' : '6:5'}</div>
          <div>{t('game:decks')}: {state.rules.deckCount} | {t('game:penetration')}: {(state.rules.penetration * 100).toFixed(0)}%</div>
        </div>
      </ErrorBoundary>
      </GameLayout>
    </div>
  );
}
