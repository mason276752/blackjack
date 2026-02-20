import { GameState, PlayerHand } from '../types/game.types';
import { GameAction } from './gameActions';
import { HandEvaluator } from '../lib/hand/HandEvaluator';
import { PayoutCalculator } from '../lib/rules/PayoutCalculator';
import { VEGAS_STRIP_RULES, HI_LO, DEFAULT_STARTING_BALANCE } from '../constants/gameDefaults';

export function createInitialState(): GameState {
  return {
    phase: 'betting',
    rules: VEGAS_STRIP_RULES,
    cardsRemaining: VEGAS_STRIP_RULES.deckCount * 52,
    totalCards: VEGAS_STRIP_RULES.deckCount * 52,
    penetrationReached: false,
    balance: DEFAULT_STARTING_BALANCE,
    currentBet: 0,
    lastBet: 0,
    hands: [],
    activeHandIndex: 0,
    insuranceBet: 0,
    dealerHand: [],
    dealerValue: 0,
    dealerHoleCardHidden: false,
    statistics: {
      sessionStart: new Date(),
      handsPlayed: 0,
      handsWon: 0,
      handsLost: 0,
      handsPushed: 0,
      blackjacks: 0,
      busts: 0,
      surrenders: 0,
      startingBalance: DEFAULT_STARTING_BALANCE,
      currentBalance: DEFAULT_STARTING_BALANCE,
      totalWagered: 0,
      totalWon: 0,
      netProfit: 0,
      splitsMade: 0,
      doubleDowns: 0,
      insuranceTaken: 0,
      hardHands: 0,
      softHands: 0,
      pairs: 0,
      correctPlays: 0,
      incorrectPlays: 0,
    },
    balanceHistory: {
      snapshots: [],
      maxSize: 1000,
    },
    runningCount: 0,
    countingSystem: HI_LO,
    showStrategyHint: true,
    showCountDisplay: true,
    showStatsPanel: false,
    message: 'placeBet',
    handHistory: [],
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_RULES':
      return {
        ...state,
        rules: action.rules,
        totalCards: action.rules.deckCount * 52,
        cardsRemaining: action.rules.deckCount * 52,
      };

    case 'RESET_GAME':
      return createInitialState();

    case 'PLACE_BET':
      if (action.amount > state.balance) {
        return { ...state, message: 'insufficientBalance' };
      }
      return {
        ...state,
        currentBet: action.amount,
        message: 'betPlaced',
      };

    case 'CLEAR_BET':
      return {
        ...state,
        currentBet: 0,
        message: 'placeBet',
      };

    case 'DEAL_INITIAL_CARDS': {
      const playerHand: PlayerHand = {
        id: 'hand-0',
        cards: action.playerCards,
        value: HandEvaluator.calculateValue(action.playerCards),
        bet: state.currentBet,
        status: HandEvaluator.isBlackjack(action.playerCards) ? 'blackjack' : 'active',
        doubled: false,
        split: false,
        splitCount: 0,
      };

      const dealerValue = HandEvaluator.calculateValue([action.dealerCards[0]]);

      return {
        ...state,
        phase: HandEvaluator.isBlackjack(action.playerCards) ? 'dealer_turn' : 'player_turn',
        hands: [playerHand],
        dealerHand: action.dealerCards,
        dealerValue,
        dealerHoleCardHidden: true,
        balance: state.balance - state.currentBet,
        lastBet: state.currentBet, // Remember this bet for next round
        activeHandIndex: 0,
        message: HandEvaluator.isBlackjack(action.playerCards) ? 'blackjack' : 'yourTurn',
        statistics: {
          ...state.statistics,
          totalWagered: state.statistics.totalWagered + state.currentBet,
        },
      };
    }

    case 'TAKE_INSURANCE': {
      // Player-unfavorable rounding: round UP costs to player
      const insuranceAmount = Math.ceil(state.currentBet / 2);
      if (state.balance < insuranceAmount) {
        return { ...state, message: 'insufficientBalance' };
      }
      return {
        ...state,
        insuranceBet: insuranceAmount,
        balance: state.balance - insuranceAmount,
        message: 'insuranceTaken',
      };
    }

    case 'DECLINE_INSURANCE':
      return {
        ...state,
        insuranceBet: -1, // -1 indicates insurance was declined
        message: 'insuranceDeclined',
      };

    case 'HIT': {
      const newHands = [...state.hands];
      const currentHand = { ...newHands[state.activeHandIndex] };
      currentHand.cards = [...currentHand.cards, action.card];
      currentHand.value = HandEvaluator.calculateValue(currentHand.cards);

      if (currentHand.value > 21) {
        currentHand.status = 'bust';
        // Move to next hand or dealer turn
        const nextHandIndex = state.activeHandIndex + 1;
        const allHandsComplete = nextHandIndex >= newHands.length;

        newHands[state.activeHandIndex] = currentHand;

        return {
          ...state,
          hands: newHands,
          phase: allHandsComplete ? 'dealer_turn' : 'player_turn',
          activeHandIndex: allHandsComplete ? state.activeHandIndex : nextHandIndex,
          message: currentHand.value > 21 ? 'bust' : 'yourTurn',
        };
      }

      newHands[state.activeHandIndex] = currentHand;

      return {
        ...state,
        hands: newHands,
        message: 'yourTurn',
      };
    }

    case 'STAND': {
      const nextHandIndex = state.activeHandIndex + 1;
      const allHandsComplete = nextHandIndex >= state.hands.length;

      const newHands = [...state.hands];
      newHands[state.activeHandIndex] = {
        ...newHands[state.activeHandIndex],
        status: 'stand',
      };

      return {
        ...state,
        hands: newHands,
        phase: allHandsComplete ? 'dealer_turn' : 'player_turn',
        activeHandIndex: allHandsComplete ? state.activeHandIndex : nextHandIndex,
        message: allHandsComplete ? 'dealerTurn' : 'yourTurn',
      };
    }

    case 'DOUBLE_DOWN': {
      if (state.balance < state.hands[state.activeHandIndex].bet) {
        return { ...state, message: 'insufficientToDouble' };
      }

      const newHands = [...state.hands];
      const currentHand = { ...newHands[state.activeHandIndex] };
      currentHand.cards = [...currentHand.cards, action.card];
      currentHand.value = HandEvaluator.calculateValue(currentHand.cards);
      currentHand.bet *= 2;
      currentHand.doubled = true;

      if (currentHand.value > 21) {
        currentHand.status = 'bust';
      } else {
        currentHand.status = 'stand';
      }

      newHands[state.activeHandIndex] = currentHand;

      const nextHandIndex = state.activeHandIndex + 1;
      const allHandsComplete = nextHandIndex >= newHands.length;

      return {
        ...state,
        hands: newHands,
        balance: state.balance - currentHand.bet / 2,
        phase: allHandsComplete ? 'dealer_turn' : 'player_turn',
        activeHandIndex: allHandsComplete ? state.activeHandIndex : nextHandIndex,
        statistics: {
          ...state.statistics,
          doubleDowns: state.statistics.doubleDowns + 1,
          totalWagered: state.statistics.totalWagered + currentHand.bet / 2,
        },
        message: currentHand.value > 21 ? 'bust' : 'dealerTurn',
      };
    }

    case 'SPLIT': {
      const currentHand = state.hands[state.activeHandIndex];
      if (state.balance < currentHand.bet) {
        return { ...state, message: 'insufficientToSplit' };
      }

      const newHands = [...state.hands];

      const hand1: PlayerHand = {
        id: `hand-${state.activeHandIndex}-1`,
        cards: [currentHand.cards[0], action.newCards[0]],
        value: HandEvaluator.calculateValue([currentHand.cards[0], action.newCards[0]]),
        bet: currentHand.bet,
        status: 'active',
        doubled: false,
        split: true,
        splitCount: currentHand.splitCount + 1,
      };

      const hand2: PlayerHand = {
        id: `hand-${state.activeHandIndex}-2`,
        cards: [currentHand.cards[1], action.newCards[1]],
        value: HandEvaluator.calculateValue([currentHand.cards[1], action.newCards[1]]),
        bet: currentHand.bet,
        status: 'active',
        doubled: false,
        split: true,
        splitCount: currentHand.splitCount + 1,
      };

      newHands.splice(state.activeHandIndex, 1, hand1, hand2);

      return {
        ...state,
        hands: newHands,
        balance: state.balance - currentHand.bet,
        statistics: {
          ...state.statistics,
          splitsMade: state.statistics.splitsMade + 1,
          totalWagered: state.statistics.totalWagered + currentHand.bet,
        },
        message: 'splitPlayFirstHand',
      };
    }

    case 'SURRENDER': {
      const newHands = [...state.hands];
      newHands[state.activeHandIndex] = {
        ...newHands[state.activeHandIndex],
        status: 'surrender',
      };

      return {
        ...state,
        hands: newHands,
        phase: 'dealer_turn',
        statistics: {
          ...state.statistics,
          surrenders: state.statistics.surrenders + 1,
        },
        message: 'surrendered',
      };
    }

    // ===== COMPOUND ACTIONS (Performance Optimized) =====
    // These actions combine multiple state updates into a single dispatch
    // to reduce re-renders from 3 per action to 1 (66% improvement)

    case 'HIT_CARD': {
      // Combine HIT + UPDATE_COUNT + UPDATE_SHOE_STATE
      const newHands = [...state.hands];
      const currentHand = { ...newHands[state.activeHandIndex] };
      currentHand.cards = [...currentHand.cards, action.card];
      currentHand.value = HandEvaluator.calculateValue(currentHand.cards);

      // Update card count
      const countValue = state.countingSystem.values[action.card.rank] || 0;
      const newRunningCount = state.runningCount + countValue;

      if (currentHand.value > 21) {
        currentHand.status = 'bust';
        const nextHandIndex = state.activeHandIndex + 1;
        const allHandsComplete = nextHandIndex >= newHands.length;
        newHands[state.activeHandIndex] = currentHand;

        return {
          ...state,
          hands: newHands,
          phase: allHandsComplete ? 'dealer_turn' : 'player_turn',
          activeHandIndex: allHandsComplete ? state.activeHandIndex : nextHandIndex,
          message: currentHand.value > 21 ? 'bust' : 'yourTurn',
          runningCount: newRunningCount,
          cardsRemaining: action.cardsRemaining,
          totalCards: action.totalCards,
          penetrationReached: action.cardsRemaining / action.totalCards <= (1 - state.rules.penetration),
        };
      }

      newHands[state.activeHandIndex] = currentHand;

      return {
        ...state,
        hands: newHands,
        message: 'yourTurn',
        runningCount: newRunningCount,
        cardsRemaining: action.cardsRemaining,
        totalCards: action.totalCards,
        penetrationReached: action.cardsRemaining / action.totalCards <= (1 - state.rules.penetration),
      };
    }

    case 'DOUBLE_DOWN_CARD': {
      // Combine DOUBLE_DOWN + UPDATE_COUNT + UPDATE_SHOE_STATE
      if (state.balance < state.hands[state.activeHandIndex].bet) {
        return { ...state, message: 'insufficientToDouble' };
      }

      const newHands = [...state.hands];
      const currentHand = { ...newHands[state.activeHandIndex] };
      currentHand.cards = [...currentHand.cards, action.card];
      currentHand.value = HandEvaluator.calculateValue(currentHand.cards);
      currentHand.bet *= 2;
      currentHand.doubled = true;
      currentHand.status = currentHand.value > 21 ? 'bust' : 'stand';

      // Update card count
      const countValue = state.countingSystem.values[action.card.rank] || 0;
      const newRunningCount = state.runningCount + countValue;

      const nextHandIndex = state.activeHandIndex + 1;
      const allHandsComplete = nextHandIndex >= newHands.length;

      newHands[state.activeHandIndex] = currentHand;

      return {
        ...state,
        hands: newHands,
        balance: state.balance - currentHand.bet / 2,
        phase: allHandsComplete ? 'dealer_turn' : 'player_turn',
        activeHandIndex: allHandsComplete ? state.activeHandIndex : nextHandIndex,
        statistics: {
          ...state.statistics,
          doubleDowns: state.statistics.doubleDowns + 1,
          totalWagered: state.statistics.totalWagered + (currentHand.bet / 2),
        },
        message: currentHand.value > 21 ? 'bust' : (allHandsComplete ? 'dealerTurn' : 'yourTurn'),
        runningCount: newRunningCount,
        cardsRemaining: action.cardsRemaining,
        totalCards: action.totalCards,
        penetrationReached: action.cardsRemaining / action.totalCards <= (1 - state.rules.penetration),
      };
    }

    case 'SPLIT_CARDS': {
      // Combine SPLIT + UPDATE_COUNT (x2) + UPDATE_SHOE_STATE
      if (state.balance < state.hands[state.activeHandIndex].bet) {
        return { ...state, message: 'insufficientToSplit' };
      }

      const originalHand = state.hands[state.activeHandIndex];
      const newHands = [...state.hands];

      // Create two new hands
      const hand1 = {
        ...originalHand,
        id: `${originalHand.id}-1`,
        cards: [originalHand.cards[0], action.newCards[0]],
        value: HandEvaluator.calculateValue([originalHand.cards[0], action.newCards[0]]),
        status: 'active' as const,
        split: true,
        splitCount: originalHand.splitCount + 1,
      };

      const hand2 = {
        ...originalHand,
        id: `${originalHand.id}-2`,
        cards: [originalHand.cards[1], action.newCards[1]],
        value: HandEvaluator.calculateValue([originalHand.cards[1], action.newCards[1]]),
        status: 'active' as const,
        split: true,
        splitCount: originalHand.splitCount + 1,
      };

      newHands.splice(state.activeHandIndex, 1, hand1, hand2);

      // Update card count for both new cards
      const countValue1 = state.countingSystem.values[action.newCards[0].rank] || 0;
      const countValue2 = state.countingSystem.values[action.newCards[1].rank] || 0;
      const newRunningCount = state.runningCount + countValue1 + countValue2;

      return {
        ...state,
        hands: newHands,
        balance: state.balance - originalHand.bet,
        statistics: {
          ...state.statistics,
          splitsMade: state.statistics.splitsMade + 1,
          totalWagered: state.statistics.totalWagered + originalHand.bet,
        },
        message: 'splitPlayFirstHand',
        runningCount: newRunningCount,
        cardsRemaining: action.cardsRemaining,
        totalCards: action.totalCards,
        penetrationReached: action.cardsRemaining / action.totalCards <= (1 - state.rules.penetration),
      };
    }

    case 'DEALER_HIT_CARD': {
      // Combine DEALER_HIT + UPDATE_COUNT + UPDATE_SHOE_STATE
      const newDealerHand = [...state.dealerHand, action.card];
      const dealerValue = HandEvaluator.calculateValue(newDealerHand);

      // Update card count
      const countValue = state.countingSystem.values[action.card.rank] || 0;
      const newRunningCount = state.runningCount + countValue;

      return {
        ...state,
        dealerHand: newDealerHand,
        dealerValue,
        message: dealerValue > 21 ? 'dealerBusts' : 'dealerHits',
        runningCount: newRunningCount,
        cardsRemaining: action.cardsRemaining,
        totalCards: action.totalCards,
        penetrationReached: action.cardsRemaining / action.totalCards <= (1 - state.rules.penetration),
      };
    }

    // ===== END COMPOUND ACTIONS =====

    case 'DEALER_REVEAL_HOLE_CARD':
      return {
        ...state,
        dealerHoleCardHidden: false,
        dealerValue: HandEvaluator.calculateValue(state.dealerHand),
        message: 'dealerRevealsHoleCard',
      };

    case 'DEALER_HIT': {
      const newDealerHand = [...state.dealerHand, action.card];
      const dealerValue = HandEvaluator.calculateValue(newDealerHand);

      return {
        ...state,
        dealerHand: newDealerHand,
        dealerValue,
        message: dealerValue > 21 ? 'dealerBusts' : 'dealerHits',
      };
    }

    case 'DEALER_STAND':
      return {
        ...state,
        message: 'dealerStands',
      };

    case 'RESOLVE_HANDS': {
      // 防禦性檢查：防止重複結算（只有在已經是 resolution 且手牌已經有結果時才阻止）
      if (state.phase === 'resolution' && state.hands.length > 0 && state.hands[0].result) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[gameReducer] RESOLVE_HANDS called twice - ignoring duplicate');
        }
        return state;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[gameReducer] RESOLVE_HANDS called', {
          phase: state.phase,
          balance: state.balance,
          hands: state.hands.length,
          timestamp: Date.now(),
          dealerValue: action.dealerValue,
          dealerHand: state.dealerHand.map(c => `${c.rank}${c.suit}`).join(','),
        });
      }

      const dealerBlackjack = HandEvaluator.isBlackjack(state.dealerHand);
      let totalPayout = 0;
      let handsWon = 0;
      let handsLost = 0;
      let handsPushed = 0;
      let blackjacks = 0;
      let busts = 0;

      const resolvedHands = state.hands.map(hand => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[gameReducer] Calculating payout for hand:', {
            playerCards: hand.cards.map(c => `${c.rank}${c.suit}`).join(','),
            playerValue: hand.value,
            playerStatus: hand.status,
            dealerValue: action.dealerValue,
            bet: hand.bet,
          });
        }

        const payoutResult = PayoutCalculator.calculatePayout(
          hand,
          action.dealerValue,
          dealerBlackjack,
          state.rules
        );

        if (process.env.NODE_ENV === 'development') {
          console.log('[gameReducer] Payout result:', {
            result: payoutResult.result,
            payout: payoutResult.payout,
          });
        }

        totalPayout += payoutResult.payout;

        // Count wins (including blackjack)
        if (payoutResult.result === 'win') handsWon++;
        if (payoutResult.result === 'blackjack') {
          blackjacks++;
          handsWon++;
        }

        // Count losses (including bust and surrender)
        if (payoutResult.result === 'lose') handsLost++;
        if (payoutResult.result === 'bust') {
          busts++;
          handsLost++;
        }
        if (payoutResult.result === 'surrender') {
          handsLost++;
        }

        // Count pushes
        if (payoutResult.result === 'push') handsPushed++;

        return {
          ...hand,
          result: payoutResult.result,
          payout: payoutResult.payout,
        };
      });

      // Calculate new balance
      const newBalance = state.balance + totalPayout;
      const newHandNumber = state.statistics.handsPlayed + 1;

      // Create balance snapshot
      const newSnapshot = {
        balance: newBalance,
        timestamp: Date.now(),
        handNumber: newHandNumber,
      };

      // Keep only last 1000 snapshots
      const updatedSnapshots = [
        ...state.balanceHistory.snapshots,
        newSnapshot,
      ].slice(-1000);

      return {
        ...state,
        hands: resolvedHands,
        balance: newBalance,
        phase: 'resolution',
        balanceHistory: {
          ...state.balanceHistory,
          snapshots: updatedSnapshots,
        },
        statistics: {
          ...state.statistics,
          handsPlayed: newHandNumber,
          handsWon: state.statistics.handsWon + handsWon,
          handsLost: state.statistics.handsLost + handsLost,
          handsPushed: state.statistics.handsPushed + handsPushed,
          blackjacks: state.statistics.blackjacks + blackjacks,
          busts: state.statistics.busts + busts,
          totalWon: state.statistics.totalWon + totalPayout,
          currentBalance: newBalance,
          netProfit: newBalance - state.statistics.startingBalance,
        },
        message: 'roundComplete',
      };
    }

    case 'COMPLETE_ROUND':
      return {
        ...state,
        phase: 'betting',
        hands: [],
        dealerHand: [],
        dealerValue: 0,
        dealerHoleCardHidden: false,
        currentBet: state.lastBet, // Restore previous bet amount
        activeHandIndex: 0,
        insuranceBet: 0,
        message: 'placeNextBet',
      };

    case 'UPDATE_COUNT':
      const countValue = state.countingSystem.values[action.card.rank] || 0;
      const newRunningCount = state.runningCount + countValue;

      return {
        ...state,
        runningCount: newRunningCount,
      };

    case 'RESET_COUNT':
      return {
        ...state,
        runningCount: 0,
      };

    case 'SET_COUNTING_SYSTEM':
      return {
        ...state,
        countingSystem: action.system,
        runningCount: 0,
      };

    case 'TOGGLE_STRATEGY_HINT':
      return {
        ...state,
        showStrategyHint: !state.showStrategyHint,
      };

    case 'TOGGLE_COUNT_DISPLAY':
      return {
        ...state,
        showCountDisplay: !state.showCountDisplay,
      };

    case 'TOGGLE_STATS_PANEL':
      return {
        ...state,
        showStatsPanel: !state.showStatsPanel,
      };

    case 'UPDATE_SHOE_STATE':
      return {
        ...state,
        cardsRemaining: action.cardsRemaining,
        totalCards: action.totalCards,
        penetrationReached: action.cardsRemaining / action.totalCards <= (1 - state.rules.penetration),
      };

    case 'SHUFFLE_SHOE':
      return {
        ...state,
        cardsRemaining: state.totalCards,
        penetrationReached: false,
        runningCount: 0,
        message: 'shoeShuffled',
      };

    case 'SET_MESSAGE':
      return {
        ...state,
        message: action.message,
      };

    default:
      return state;
  }
}
