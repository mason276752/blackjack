/**
 * KO Preferred Strategy - Optimized deviations for KO counting system
 *
 * The KO (Knock-Out) system is unbalanced, so it uses Running Count (RC) thresholds
 * rather than True Count conversion.
 *
 * Key pivot points for 6-deck game:
 * - IRC (Initial Running Count): -20 (start of shoe)
 * - Key Count: -4 (approximate breakeven point)
 * - Pivot: +4 (optimal betting point)
 *
 * Reference: "Knock-Out Blackjack" by Olaf Vancura and Ken Fuchs
 */

import { StrategySet } from '../../types/strategy.types';

export const KO_PREFERRED: StrategySet = {
  id: 'ko_preferred',
  name: 'KO Preferred',
  systemId: 'ko',
  usesTrueCount: false, // KO uses running count directly
  description: 'Optimized strategy deviations for KO counting system (6-deck game)',
  deviations: [
    // Insurance (most important)
    {
      hand: 'any',
      dealer: 'A',
      basicAction: 'decline',
      deviationAction: 'take_insurance',
      threshold: 3,
      description: 'Take insurance at RC >= +3',
    },

    // 16 vs 10 - Stand at Key Count or above
    {
      hand: '16',
      dealer: '10',
      basicAction: 'H',
      deviationAction: 'S',
      threshold: -4,
      description: 'Stand on 16 vs 10 at RC >= -4 (Key Count)',
    },

    // 12 vs 4 - Hit at very negative counts (IRC)
    {
      hand: '12',
      dealer: '4',
      basicAction: 'S',
      deviationAction: 'H',
      threshold: -20,
      description: 'Hit 12 vs 4 at RC <= -20 (IRC or below)',
    },

    // 12 vs 5 - Hit at very negative counts
    {
      hand: '12',
      dealer: '5',
      basicAction: 'S',
      deviationAction: 'H',
      threshold: -20,
      description: 'Hit 12 vs 5 at RC <= -20',
    },

    // 12 vs 6 - Hit at very negative counts
    {
      hand: '12',
      dealer: '6',
      basicAction: 'S',
      deviationAction: 'H',
      threshold: -20,
      description: 'Hit 12 vs 6 at RC <= -20',
    },

    // 13 vs 2 - Hit at very negative counts
    {
      hand: '13',
      dealer: '2',
      basicAction: 'S',
      deviationAction: 'H',
      threshold: -20,
      description: 'Hit 13 vs 2 at RC <= -20',
    },

    // 13 vs 3 - Hit at very negative counts
    {
      hand: '13',
      dealer: '3',
      basicAction: 'S',
      deviationAction: 'H',
      threshold: -20,
      description: 'Hit 13 vs 3 at RC <= -20',
    },

    // 11 vs A - Double at Pivot or above
    {
      hand: '11',
      dealer: 'A',
      basicAction: 'H',
      deviationAction: 'DH',
      threshold: 4,
      description: 'Double 11 vs A at RC >= +4 (Pivot)',
    },

    // 10 vs 10 - Double at Pivot
    {
      hand: '10',
      dealer: '10',
      basicAction: 'H',
      deviationAction: 'DH',
      threshold: 4,
      description: 'Double 10 vs 10 at RC >= +4',
    },

    // 10 vs A - Double at Pivot
    {
      hand: '10',
      dealer: 'A',
      basicAction: 'H',
      deviationAction: 'DH',
      threshold: 4,
      description: 'Double 10 vs A at RC >= +4',
    },

    // 9 vs 2 - Double at Pivot
    {
      hand: '9',
      dealer: '2',
      basicAction: 'H',
      deviationAction: 'DH',
      threshold: 4,
      description: 'Double 9 vs 2 at RC >= +4',
    },

    // 9 vs 7 - Double at Pivot
    {
      hand: '9',
      dealer: '7',
      basicAction: 'H',
      deviationAction: 'DH',
      threshold: 4,
      description: 'Double 9 vs 7 at RC >= +4',
    },

    // 10,10 vs 5 - Split at Pivot (aggressive play)
    {
      hand: '10,10',
      dealer: '5',
      basicAction: 'S',
      deviationAction: 'SP',
      threshold: 4,
      description: 'Split 10,10 vs 5 at RC >= +4',
    },

    // 10,10 vs 6 - Split at Pivot
    {
      hand: '10,10',
      dealer: '6',
      basicAction: 'S',
      deviationAction: 'SP',
      threshold: 4,
      description: 'Split 10,10 vs 6 at RC >= +4',
    },
  ],
};
