import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../context/GameContext';
import { useGameLogic } from './useGameLogic';
import { AIPlayer, AIDecision } from '../lib/ai/AIPlayer';
import { useInterval } from './useInterval';
import { getTrueCount } from '../context/gameSelectors';

// AI phase state machine types
type AIPhase =
  | 'idle'
  | 'waiting_bet'
  | 'placing_bet'
  | 'dealing_cards'
  | 'waiting_deal_complete'
  | 'insurance_decision'
  | 'deciding_action'
  | 'waiting_dealer'
  | 'waiting_resolution'
  | 'starting_next_round';

interface AIState {
  isEnabled: boolean;
  isPlaying: boolean;
  speed: number;
  currentDecision: AIDecision | null;
  statistics: AIStatistics;

  // Phase tracking
  aiPhase: AIPhase;
  phaseEnterTime: number;
  iterationCount: number;
  lastGamePhase: string;

  // Recovery
  stuckDetected: boolean;
  errorMessage: string | null;
}

interface AIStatistics {
  roundsPlayed: number;
  decisionsCount: number;
  avgBetSize: number;
}

const DEBUG_AI = process.env.NODE_ENV === 'development';

export function useAIPlayer() {
  const { t } = useTranslation('ai');
  const { state, dispatch, strategy } = useGame();
  const gameLogic = useGameLogic();

  // State ref for synchronous access in recovery functions
  const aiStateRef = useRef<AIState | null>(null);

  const [aiState, setAIStateInternal] = useState<AIState>({
    isEnabled: false,
    isPlaying: false,
    speed: 500,
    currentDecision: null,
    statistics: { roundsPlayed: 0, decisionsCount: 0, avgBetSize: 0 },
    aiPhase: 'idle',
    phaseEnterTime: 0,
    iterationCount: 0,
    lastGamePhase: state.phase,
    stuckDetected: false,
    errorMessage: null,
  });

  // Wrapper to keep ref in sync
  const setAIState = useCallback((update: AIState | ((prev: AIState) => AIState)) => {
    setAIStateInternal(prev => {
      const newState = typeof update === 'function' ? update(prev) : update;
      aiStateRef.current = newState;
      return newState;
    });
  }, []);

  // Sync ref on mount
  useEffect(() => {
    aiStateRef.current = aiState;
  }, [aiState]);

  // Create AIPlayer instance (strategy from context, with i18n)
  const aiPlayer = useMemo(
    () => new AIPlayer(strategy, t),
    [strategy, t]
  );

  // Debug logging helper
  const logAIState = useCallback((action: string, details: any = {}) => {
    if (!DEBUG_AI) return;

    console.log(`[AI ${Date.now()}] ${action}`, {
      aiPhase: aiState.aiPhase,
      gamePhase: state.phase,
      iterationCount: aiState.iterationCount,
      phaseTime: Date.now() - aiState.phaseEnterTime,
      ...details,
    });
  }, [aiState.aiPhase, aiState.iterationCount, aiState.phaseEnterTime, state.phase]);

  // Helper to transition AI phases
  const transitionToPhase = useCallback((newPhase: AIPhase) => {
    logAIState(`Transition to ${newPhase}`);

    setAIState(prev => ({
      ...prev,
      aiPhase: newPhase,
      phaseEnterTime: Date.now(),
      iterationCount: 0,
      lastGamePhase: state.phase,
      stuckDetected: false,
      errorMessage: null,
    }));
  }, [logAIState, setAIState, state.phase]);

  // Update statistics
  const updateStatistics = useCallback((type: 'bet' | 'round' | 'decision', value?: number) => {
    setAIState(prev => {
      const newStats = { ...prev.statistics };

      if (type === 'bet' && value !== undefined) {
        // Update round count and average bet size together
        const totalBets = newStats.avgBetSize * newStats.roundsPlayed;
        newStats.roundsPlayed += 1;
        newStats.avgBetSize = (totalBets + value) / newStats.roundsPlayed;
      } else if (type === 'decision') {
        newStats.decisionsCount += 1;
      }

      return { ...prev, statistics: newStats };
    });
  }, [setAIState]);

  // Recovery: Handle stuck state
  const handleStuckState = useCallback(() => {
    console.error('[AI Recovery] Stuck detected', {
      aiPhase: aiState.aiPhase,
      gamePhase: state.phase,
      elapsed: Date.now() - aiState.phaseEnterTime,
    });

    setAIState(prev => ({
      ...prev,
      stuckDetected: true,
      errorMessage: `AI stuck in ${aiState.aiPhase} for >10s`,
    }));

    // Try to sync AI phase to game phase before giving up
    switch (state.phase) {
      case 'betting':
        transitionToPhase('waiting_bet');
        break;
      case 'dealing':
        transitionToPhase('waiting_deal_complete');
        break;
      case 'player_turn':
        transitionToPhase('deciding_action');
        break;
      case 'dealer_turn':
        transitionToPhase('waiting_dealer');
        break;
      case 'resolution':
        gameLogic.newRound();
        transitionToPhase('waiting_bet');
        break;
      default:
        // Truly unrecoverable - stop AI
        stopAIImmediate('Unrecoverable stuck state');
    }
  }, [aiState.aiPhase, aiState.phaseEnterTime, gameLogic, setAIState, state.phase, transitionToPhase]);

  // Recovery: Handle infinite loop
  const handleInfiniteLoop = useCallback(() => {
    console.error('[AI Recovery] Infinite loop detected', {
      aiPhase: aiState.aiPhase,
      gamePhase: state.phase,
      iterations: aiState.iterationCount,
    });

    setAIState(prev => ({
      ...prev,
      stuckDetected: true,
      errorMessage: `Infinite loop in ${aiState.aiPhase} (${aiState.iterationCount} iterations)`,
    }));

    // Try the same recovery strategy as handleStuckState
    switch (state.phase) {
      case 'betting':
        transitionToPhase('waiting_bet');
        break;
      case 'dealing':
        transitionToPhase('waiting_deal_complete');
        break;
      case 'player_turn':
        // Check if all hands are done
        const allHandsDone = state.hands.every(hand => hand.status !== 'active');
        if (allHandsDone) {
          // Trigger dealer turn
          gameLogic.playDealerHand();
          transitionToPhase('waiting_dealer');
        } else {
          transitionToPhase('deciding_action');
        }
        break;
      case 'dealer_turn':
        // Already in dealer turn, maybe dealer is stuck?
        // Force trigger dealer play again
        gameLogic.playDealerHand();
        transitionToPhase('waiting_dealer');
        break;
      case 'resolution':
        gameLogic.newRound();
        transitionToPhase('waiting_bet');
        break;
      default:
        // Truly unrecoverable - stop AI
        stopAIImmediate('Infinite loop - unrecoverable');
    }
  }, [aiState.aiPhase, aiState.iterationCount, gameLogic, setAIState, state.hands, state.phase, transitionToPhase]);

  // Immediate stop (synchronous)
  const stopAIImmediate = useCallback((reason: string) => {
    if (!aiStateRef.current) return;

    const newState = {
      ...aiStateRef.current,
      isEnabled: false,
      isPlaying: false,
      errorMessage: reason,
      aiPhase: 'idle' as AIPhase,
    };

    aiStateRef.current = newState;
    setAIStateInternal(newState);
    dispatch({ type: 'SET_MESSAGE', message: t('ai:status.aiStopped', { reason }) });
  }, [dispatch, t]);

  // Phase handlers
  const handleWaitingBetPhase = useCallback(() => {
    if (state.phase !== 'betting') {
      logAIState('Waiting for betting phase', { currentPhase: state.phase });

      // Phase mismatch recovery logic
      // If game has progressed beyond betting, sync AI phase to match game state
      if (state.phase === 'player_turn') {
        // Game already dealt cards and entered player turn
        logAIState('Phase mismatch detected: syncing to deciding_action');
        transitionToPhase('deciding_action');
        return;
      }

      if (state.phase === 'dealer_turn') {
        // Game already in dealer turn
        logAIState('Phase mismatch detected: syncing to waiting_dealer');
        transitionToPhase('waiting_dealer');
        return;
      }

      if (state.phase === 'resolution') {
        // Game already in resolution
        logAIState('Phase mismatch detected: syncing to waiting_resolution');
        transitionToPhase('waiting_resolution');
        return;
      }

      // Still waiting for betting phase (normal case)
      return;
    }

    if (state.currentBet > 0) {
      // Bet already placed
      transitionToPhase('dealing_cards');
      return;
    }

    // Move to placing bet
    transitionToPhase('placing_bet');
  }, [logAIState, state.currentBet, state.phase, transitionToPhase]);

  const handlePlacingBetPhase = useCallback(() => {
    const trueCount = getTrueCount(state.runningCount, state.cardsRemaining);
    const decision = aiPlayer.calculateBet(state.balance, trueCount, 10, 500);

    setAIState(prev => ({ ...prev, currentDecision: decision }));
    dispatch({ type: 'PLACE_BET', amount: decision.betAmount! });
    updateStatistics('bet', decision.betAmount!);

    logAIState('Placed bet', { amount: decision.betAmount });
    transitionToPhase('dealing_cards');
  }, [aiPlayer, dispatch, logAIState, setAIState, state.balance, state.runningCount, state.cardsRemaining, transitionToPhase, updateStatistics]);

  const handleDealingCardsPhase = useCallback(() => {
    if (state.currentBet === 0) {
      // Not ready - go back
      transitionToPhase('waiting_bet');
      return;
    }

    gameLogic.dealCards();
    updateStatistics('round');

    logAIState('Dealt cards');
    transitionToPhase('waiting_deal_complete');
  }, [gameLogic, logAIState, state.currentBet, transitionToPhase, updateStatistics]);

  const handleWaitingDealCompletePhase = useCallback(() => {
    // Check if dealer has Ace and insurance is offered
    const dealerUpCard = state.dealerHand[0];
    if (dealerUpCard?.rank === 'A' && state.rules.insuranceAllowed && state.insuranceBet === 0) {
      // Dealer has Ace, need to decide on insurance
      logAIState('Dealer has Ace, checking insurance decision');
      transitionToPhase('insurance_decision');
      return;
    }

    if (state.phase === 'player_turn') {
      transitionToPhase('deciding_action');
    } else if (state.phase === 'dealer_turn') {
      // Immediate blackjack - skip to dealer
      logAIState('Immediate blackjack detected');
      transitionToPhase('waiting_dealer');
    } else if (state.phase === 'resolution') {
      // Both blackjack - skip to resolution
      logAIState('Both blackjack detected');
      transitionToPhase('waiting_resolution');
    }
    // Otherwise keep waiting
  }, [logAIState, state.dealerHand, state.insuranceBet, state.phase, state.rules.insuranceAllowed, transitionToPhase]);

  const handleInsuranceDecisionPhase = useCallback(() => {
    // Calculate insurance parameters
    const maxInsurance = state.currentBet / 2; // Insurance is half of original bet
    const trueCount = getTrueCount(state.runningCount, state.cardsRemaining);

    // Get AI decision
    const decision = aiPlayer.decideInsurance(trueCount, maxInsurance, state.balance);

    setAIState(prev => ({ ...prev, currentDecision: decision }));
    logAIState('Insurance decision', {
      action: decision.action,
      trueCount,
      maxInsurance,
      balance: state.balance,
    });

    // Execute decision
    if (decision.action === 'take_insurance') {
      dispatch({ type: 'TAKE_INSURANCE' });
    } else {
      dispatch({ type: 'DECLINE_INSURANCE' });
    }

    // Continue to next phase (player turn will start)
    transitionToPhase('deciding_action');
  }, [aiPlayer, dispatch, logAIState, setAIState, state.balance, state.cardsRemaining, state.currentBet, state.runningCount, transitionToPhase]);

  const handleDecidingActionPhase = useCallback(() => {
    // DEFENSIVE VALIDATION
    if (state.phase !== 'player_turn') {
      logAIState('Phase changed unexpectedly', { expectedPhase: 'player_turn', actualPhase: state.phase });
      return;
    }

    if (state.activeHandIndex >= state.hands.length) {
      console.error('[AI] Invalid activeHandIndex', {
        index: state.activeHandIndex,
        length: state.hands.length,
      });
      return;
    }

    const currentHand = state.hands[state.activeHandIndex];
    if (!currentHand) {
      console.error('[AI] currentHand is undefined');
      return;
    }

    if (currentHand.status !== 'active') {
      // Hand already resolved, wait for next hand or phase change
      logAIState('Hand not active', { status: currentHand.status });
      return;
    }

    const dealerUpCard = state.dealerHand[0];
    if (!dealerUpCard) {
      console.error('[AI] dealerUpCard is undefined');
      return;
    }

    // Check available actions
    const canDouble =
      currentHand.cards.length === 2 &&
      state.balance >= currentHand.bet;

    const canSplit =
      currentHand.cards.length === 2 &&
      currentHand.cards[0].rank === currentHand.cards[1].rank &&
      state.hands.length < (state.rules.maxSplits + 1) &&
      state.balance >= currentHand.bet;

    const canSurrender =
      state.rules.lateSurrender &&
      currentHand.cards.length === 2 &&
      state.activeHandIndex === 0;  // Only first hand

    // Get true count for Illustrious 18 deviations
    const trueCount = getTrueCount(state.runningCount, state.cardsRemaining);

    const decision = aiPlayer.decideAction(
      currentHand,
      dealerUpCard,
      canDouble,
      canSplit,
      canSurrender,
      trueCount  // Pass true count for Illustrious 18 deviations
    );

    setAIState(prev => ({ ...prev, currentDecision: decision }));

    // Execute action
    logAIState(`Executing ${decision.action}`);
    switch (decision.action) {
      case 'hit':
        gameLogic.hit();
        break;
      case 'stand':
        gameLogic.stand();
        break;
      case 'doubleDown':
        gameLogic.doubleDown();
        break;
      case 'split':
        gameLogic.split();
        break;
      case 'surrender':
        gameLogic.surrender();
        break;
    }

    updateStatistics('decision');
    // Stay in same phase - will check again next iteration
  }, [aiPlayer, gameLogic, logAIState, setAIState, state, updateStatistics]);

  const handleWaitingDealerPhase = useCallback(() => {
    if (state.phase === 'resolution') {
      logAIState('Dealer complete, moving to resolution');
      transitionToPhase('waiting_resolution');
      return;
    }

    // Check if we're stuck in player_turn when all hands are done
    if (state.phase === 'player_turn') {
      const allHandsDone = state.hands.every(hand => hand.status !== 'active');
      if (allHandsDone) {
        logAIState('All hands done but still in player_turn, triggering dealer turn');
        // Manually trigger dealer play
        gameLogic.playDealerHand();
        return;
      }
    }

    // If phase is still player_turn but not all hands done, sync back to deciding_action
    if (state.phase === 'player_turn') {
      logAIState('Phase mismatch: still in player_turn with active hands, syncing to deciding_action');
      transitionToPhase('deciding_action');
      return;
    }

    // Update decision display if not set
    if (!aiState.currentDecision || aiState.currentDecision.action !== 'wait') {
      setAIState(prev => ({
        ...prev,
        currentDecision: { action: 'wait', reasoning: t('ai:status.dealerPlaying') }
      }));
    }
  }, [aiState.currentDecision, gameLogic, logAIState, setAIState, state.hands, state.phase, t, transitionToPhase]);

  const handleWaitingResolutionPhase = useCallback(() => {
    const waitTime = Math.max(aiState.speed * 2, 1000);
    const elapsed = Date.now() - aiState.phaseEnterTime;

    if (elapsed < waitTime) {
      // Still waiting
      if (!aiState.currentDecision || aiState.currentDecision.action !== 'wait') {
        setAIState(prev => ({
          ...prev,
          currentDecision: {
            action: 'wait',
            reasoning: t('ai:status.waitingNextRound', {
              seconds: Math.ceil((waitTime - elapsed) / 1000)
            })
          }
        }));
      }
      return;
    }

    // Wait complete - start next round
    logAIState('Resolution wait complete');
    transitionToPhase('starting_next_round');
  }, [aiState.currentDecision, aiState.phaseEnterTime, aiState.speed, logAIState, setAIState, t, transitionToPhase]);

  const handleStartingNextRoundPhase = useCallback(() => {
    setAIState(prev => ({
      ...prev,
      currentDecision: { action: 'deal', reasoning: t('ai:status.startingNextRound') }
    }));

    gameLogic.newRound();
    logAIState('Started new round');

    // Will transition to 'waiting_bet' when phase changes to 'betting'
  }, [gameLogic, logAIState, setAIState, t]);

  // Handle game phase transitions
  const handlePhaseTransition = useCallback((newGamePhase: string) => {
    logAIState('Game phase transition', {
      from: aiState.lastGamePhase,
      to: newGamePhase,
    });

    setAIState(prev => ({
      ...prev,
      lastGamePhase: newGamePhase,
      iterationCount: 0,
    }));

    // Map game phase to AI phase
    switch (newGamePhase) {
      case 'betting':
        transitionToPhase('waiting_bet');
        break;
      case 'dealing':
        transitionToPhase('waiting_deal_complete');
        break;
      case 'player_turn':
        transitionToPhase('deciding_action');
        break;
      case 'dealer_turn':
        transitionToPhase('waiting_dealer');
        break;
      case 'resolution':
        transitionToPhase('waiting_resolution');
        break;
    }
  }, [aiState.lastGamePhase, logAIState, setAIState, transitionToPhase]);

  // Main AI game loop
  const executeNextAction = useCallback(() => {
    // PHASE TRANSITION DETECTION
    if (state.phase !== aiState.lastGamePhase) {
      handlePhaseTransition(state.phase);
      return;
    }

    // STUCK DETECTION
    const elapsedInPhase = Date.now() - aiState.phaseEnterTime;
    if (elapsedInPhase > 10000) { // 10 second timeout
      handleStuckState();
      return;
    }

    // MAX ITERATION PROTECTION
    if (aiState.iterationCount > 50) {
      handleInfiniteLoop();
      return;
    }

    // BALANCE CHECK (with immediate stop)
    if (state.balance < 10) {
      stopAIImmediate('Insufficient balance');
      return;
    }

    // STATE MACHINE LOGIC
    switch (aiState.aiPhase) {
      case 'waiting_bet':
        handleWaitingBetPhase();
        break;
      case 'placing_bet':
        handlePlacingBetPhase();
        break;
      case 'dealing_cards':
        handleDealingCardsPhase();
        break;
      case 'waiting_deal_complete':
        handleWaitingDealCompletePhase();
        break;
      case 'insurance_decision':
        handleInsuranceDecisionPhase();
        break;
      case 'deciding_action':
        handleDecidingActionPhase();
        break;
      case 'waiting_dealer':
        handleWaitingDealerPhase();
        break;
      case 'waiting_resolution':
        handleWaitingResolutionPhase();
        break;
      case 'starting_next_round':
        handleStartingNextRoundPhase();
        break;
      case 'idle':
        // Do nothing
        break;
    }

    // Increment iteration counter
    setAIState(prev => ({
      ...prev,
      iterationCount: prev.iterationCount + 1,
    }));
  }, [
    aiState.aiPhase,
    aiState.iterationCount,
    aiState.lastGamePhase,
    aiState.phaseEnterTime,
    handleDealingCardsPhase,
    handleDecidingActionPhase,
    handleInfiniteLoop,
    handleInsuranceDecisionPhase,
    handlePhaseTransition,
    handlePlacingBetPhase,
    handleStartingNextRoundPhase,
    handleStuckState,
    handleWaitingBetPhase,
    handleWaitingDealCompletePhase,
    handleWaitingDealerPhase,
    handleWaitingResolutionPhase,
    setAIState,
    state.balance,
    state.phase,
    stopAIImmediate
  ]);

  // Use interval instead of setTimeout
  useInterval(
    executeNextAction,
    Math.max(aiState.speed, 50), // Enforce minimum speed
    aiState.isEnabled && aiState.isPlaying
  );

  // Control functions
  const startAI = useCallback(() => {
    if (state.balance < 10) {
      dispatch({ type: 'SET_MESSAGE', message: t('ai:status.insufficientBalance') });
      return;
    }
    logAIState('Starting AI');
    setAIState(prev => ({
      ...prev,
      isEnabled: true,
      isPlaying: true,
      aiPhase: 'waiting_bet',
      phaseEnterTime: Date.now(),
      iterationCount: 0,
      lastGamePhase: state.phase,
      stuckDetected: false,
      errorMessage: null,
    }));
  }, [dispatch, logAIState, setAIState, state.balance, state.phase, t]);

  const pauseAI = useCallback(() => {
    logAIState('Pausing AI');
    setAIState(prev => ({ ...prev, isPlaying: false }));
  }, [logAIState, setAIState]);

  const resumeAI = useCallback(() => {
    logAIState('Resuming AI');
    setAIState(prev => ({ ...prev, isPlaying: true }));
  }, [logAIState, setAIState]);

  const stopAI = useCallback(() => {
    logAIState('Stopping AI');
    setAIState(prev => ({
      ...prev,
      isEnabled: false,
      isPlaying: false,
      currentDecision: null,
      aiPhase: 'idle',
      stuckDetected: false,
      errorMessage: null,
    }));
  }, [logAIState, setAIState]);

  const setSpeed = useCallback((speed: number) => {
    setAIState(prev => ({ ...prev, speed }));
  }, [setAIState]);

  const resetStatistics = useCallback(() => {
    setAIState(prev => ({
      ...prev,
      statistics: { roundsPlayed: 0, decisionsCount: 0, avgBetSize: 0 },
    }));
  }, [setAIState]);

  // Stop AI if rules change mid-game
  useEffect(() => {
    if (aiState.isPlaying) {
      pauseAI();
      dispatch({ type: 'SET_MESSAGE', message: t('ai:status.aiPausedRuleChange') });
    }
  }, [state.rules.deckCount, state.rules.dealerHitsSoft17, state.rules.blackjackPayout, t]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (aiState.isPlaying) {
        pauseAI();
      }
    };
  }, []);

  return {
    aiState,
    startAI,
    pauseAI,
    resumeAI,
    stopAI,
    setSpeed,
    resetStatistics,
  };
}
