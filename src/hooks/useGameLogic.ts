import { useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { HandEvaluator } from '../lib/hand/HandEvaluator';

export function useGameLogic() {
  const { state, dispatch, shoe, dealerAI } = useGame();

  const dealCards = useCallback(() => {
    if (state.currentBet === 0) {
      dispatch({ type: 'SET_MESSAGE', message: 'Please place a bet first' });
      return;
    }

    // Check if shoe needs reshuffling
    if (shoe.shouldReshuffle()) {
      shoe.reset();
      dispatch({ type: 'SHUFFLE_SHOE' });
      dispatch({ type: 'RESET_COUNT' });
    }

    // Deal initial cards: Player, Dealer, Player, Dealer
    const playerCard1 = shoe.deal();
    const dealerCard1 = shoe.deal();
    const playerCard2 = shoe.deal();
    const dealerCard2 = shoe.deal();

    // Update counts
    [playerCard1, dealerCard1, playerCard2].forEach(card => {
      dispatch({ type: 'UPDATE_COUNT', card });
    });

    dispatch({
      type: 'DEAL_INITIAL_CARDS',
      playerCards: [playerCard1, playerCard2],
      dealerCards: [dealerCard1, dealerCard2],
    });

    dispatch({
      type: 'UPDATE_SHOE_STATE',
      cardsRemaining: shoe.cardsRemaining(),
      totalCards: shoe.getTotalCards(),
    });
  }, [state.currentBet, dispatch, shoe]);

  const hit = useCallback(() => {
    const card = shoe.deal();
    // Use compound action to batch updates (reduces renders from 3 to 1)
    dispatch({
      type: 'HIT_CARD',
      card,
      cardsRemaining: shoe.cardsRemaining(),
      totalCards: shoe.getTotalCards(),
    });
  }, [dispatch, shoe]);

  const stand = useCallback(() => {
    dispatch({ type: 'STAND' });
  }, [dispatch]);

  const doubleDown = useCallback(() => {
    const card = shoe.deal();
    // Use compound action to batch updates (reduces renders from 3 to 1)
    dispatch({
      type: 'DOUBLE_DOWN_CARD',
      card,
      cardsRemaining: shoe.cardsRemaining(),
      totalCards: shoe.getTotalCards(),
    });
  }, [dispatch, shoe]);

  const split = useCallback(() => {
    const card1 = shoe.deal();
    const card2 = shoe.deal();
    // Use compound action to batch updates (reduces renders from 4 to 1)
    dispatch({
      type: 'SPLIT_CARDS',
      newCards: [card1, card2],
      cardsRemaining: shoe.cardsRemaining(),
      totalCards: shoe.getTotalCards(),
    });
  }, [dispatch, shoe]);

  const surrender = useCallback(() => {
    dispatch({ type: 'SURRENDER' });
  }, [dispatch]);

  const playDealerHand = useCallback(() => {
    // Reveal hole card
    dispatch({ type: 'DEALER_REVEAL_HOLE_CARD' });

    const dealerCards = [...state.dealerHand];
    dispatch({ type: 'UPDATE_COUNT', card: dealerCards[1] });

    // Dealer plays
    setTimeout(() => {
      let currentDealerHand = [...dealerCards];

      const playNext = () => {
        if (dealerAI.shouldHit(currentDealerHand)) {
          setTimeout(() => {
            const card = shoe.deal();
            currentDealerHand.push(card);
            // Use compound action to batch updates (reduces renders from 3 to 1)
            dispatch({
              type: 'DEALER_HIT_CARD',
              card,
              cardsRemaining: shoe.cardsRemaining(),
              totalCards: shoe.getTotalCards(),
            });

            if (!HandEvaluator.isBust(currentDealerHand)) {
              playNext();
            } else {
              // Dealer busts
              setTimeout(() => {
                const dealerValue = HandEvaluator.calculateValue(currentDealerHand);
                if (process.env.NODE_ENV === 'development') {
                  console.log('[useGameLogic] Dealer busts - dispatching RESOLVE_HANDS:', {
                    dealerCards: currentDealerHand.map(c => `${c.rank}${c.suit}`).join(','),
                    dealerValue,
                    dealerBust: dealerValue > 21,
                  });
                }
                dispatch({
                  type: 'RESOLVE_HANDS',
                  dealerValue,
                  dealerBlackjack: HandEvaluator.isBlackjack(state.dealerHand),
                });
              }, 300);
            }
          }, 500);
        } else {
          // Dealer stands
          dispatch({ type: 'DEALER_STAND' });
          setTimeout(() => {
            const dealerValue = HandEvaluator.calculateValue(currentDealerHand);
            if (process.env.NODE_ENV === 'development') {
              console.log('[useGameLogic] Dealer stands - dispatching RESOLVE_HANDS:', {
                dealerCards: currentDealerHand.map(c => `${c.rank}${c.suit}`).join(','),
                dealerValue,
              });
            }
            dispatch({
              type: 'RESOLVE_HANDS',
              dealerValue,
              dealerBlackjack: HandEvaluator.isBlackjack(state.dealerHand),
            });
          }, 300);
        }
      };

      playNext();
    }, 500);
  }, [state.dealerHand, dispatch, shoe, dealerAI]);

  const newRound = useCallback(() => {
    dispatch({ type: 'COMPLETE_ROUND' });
  }, [dispatch]);

  return {
    dealCards,
    hit,
    stand,
    doubleDown,
    split,
    surrender,
    playDealerHand,
    newRound,
  };
}
