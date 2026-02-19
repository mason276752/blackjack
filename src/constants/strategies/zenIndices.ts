/**
 * Zen Count Indices - Strategy deviations for Zen Count system
 *
 * The Zen Count is a multi-level (level 2) balanced system similar to Omega II,
 * but treats Ace as -1 instead of 0. This gives better playing efficiency.
 *
 * Thresholds are similar to Hi-Lo but slightly adjusted for the multi-level nature.
 *
 * Reference: "Blackbelt in Blackjack" by Arnold Snyder
 */

import { StrategySet } from '../../types/strategy.types';

export const ZEN_INDICES: StrategySet = {
  id: 'zen_indices',
  name: 'Zen Count Indices',
  systemId: 'zen',
  usesTrueCount: true,
  description: 'Precision strategy indices for Zen Count system',
  deviations: [
    // Insurance
    {
      hand: 'any',
      dealer: 'A',
      basicAction: 'decline',
      deviationAction: 'take_insurance',
      threshold: 3,
      description: 'Take insurance at TC >= +3',
    },

    // 16 vs 10 - Stand at neutral count
    {
      hand: '16',
      dealer: '10',
      basicAction: 'H',
      deviationAction: 'S',
      threshold: 0,
      description: 'Stand on 16 vs 10 at TC >= 0',
    },

    // 15 vs 10 - Stand at positive count
    {
      hand: '15',
      dealer: '10',
      basicAction: 'H',
      deviationAction: 'S',
      threshold: 4,
      description: 'Stand on 15 vs 10 at TC >= +4',
    },

    // 16 vs 9 - Stand at higher positive count
    {
      hand: '16',
      dealer: '9',
      basicAction: 'H',
      deviationAction: 'S',
      threshold: 5,
      description: 'Stand on 16 vs 9 at TC >= +5',
    },

    // 13 vs 2 - Hit at negative count
    {
      hand: '13',
      dealer: '2',
      basicAction: 'S',
      deviationAction: 'H',
      threshold: -1,
      description: 'Hit 13 vs 2 at TC <= -1',
    },

    // 13 vs 3 - Hit at negative count
    {
      hand: '13',
      dealer: '3',
      basicAction: 'S',
      deviationAction: 'H',
      threshold: -2,
      description: 'Hit 13 vs 3 at TC <= -2',
    },

    // 12 vs 2 - Stand at positive count
    {
      hand: '12',
      dealer: '2',
      basicAction: 'H',
      deviationAction: 'S',
      threshold: 3,
      description: 'Stand on 12 vs 2 at TC >= +3',
    },

    // 12 vs 3 - Stand at positive count
    {
      hand: '12',
      dealer: '3',
      basicAction: 'H',
      deviationAction: 'S',
      threshold: 2,
      description: 'Stand on 12 vs 3 at TC >= +2',
    },

    // 12 vs 4 - Hit at neutral/negative count
    {
      hand: '12',
      dealer: '4',
      basicAction: 'S',
      deviationAction: 'H',
      threshold: 0,
      description: 'Hit 12 vs 4 at TC <= 0',
    },

    // 12 vs 5 - Hit at negative count
    {
      hand: '12',
      dealer: '5',
      basicAction: 'S',
      deviationAction: 'H',
      threshold: -2,
      description: 'Hit 12 vs 5 at TC <= -2',
    },

    // 12 vs 6 - Hit at negative count
    {
      hand: '12',
      dealer: '6',
      basicAction: 'S',
      deviationAction: 'H',
      threshold: -1,
      description: 'Hit 12 vs 6 at TC <= -1',
    },

    // 11 vs A - Double at low positive count
    {
      hand: '11',
      dealer: 'A',
      basicAction: 'H',
      deviationAction: 'DH',
      threshold: 1,
      description: 'Double 11 vs A at TC >= +1',
    },

    // 10 vs 10 - Double at positive count
    {
      hand: '10',
      dealer: '10',
      basicAction: 'H',
      deviationAction: 'DH',
      threshold: 4,
      description: 'Double 10 vs 10 at TC >= +4',
    },

    // 10 vs A - Double at positive count
    {
      hand: '10',
      dealer: 'A',
      basicAction: 'H',
      deviationAction: 'DH',
      threshold: 4,
      description: 'Double 10 vs A at TC >= +4',
    },

    // 9 vs 2 - Double at low positive count
    {
      hand: '9',
      dealer: '2',
      basicAction: 'H',
      deviationAction: 'DH',
      threshold: 1,
      description: 'Double 9 vs 2 at TC >= +1',
    },

    // 9 vs 7 - Double at positive count
    {
      hand: '9',
      dealer: '7',
      basicAction: 'H',
      deviationAction: 'DH',
      threshold: 3,
      description: 'Double 9 vs 7 at TC >= +3',
    },

    // 10,10 vs 5 - Split at higher positive count
    {
      hand: '10,10',
      dealer: '5',
      basicAction: 'S',
      deviationAction: 'SP',
      threshold: 5,
      description: 'Split 10,10 vs 5 at TC >= +5',
    },

    // 10,10 vs 6 - Split at positive count
    {
      hand: '10,10',
      dealer: '6',
      basicAction: 'S',
      deviationAction: 'SP',
      threshold: 4,
      description: 'Split 10,10 vs 6 at TC >= +4',
    },

    // 15 vs 10 - Surrender at neutral count
    {
      hand: '15',
      dealer: '10',
      basicAction: 'H',
      deviationAction: 'SU',
      threshold: 0,
      description: 'Surrender 15 vs 10 at TC >= 0',
    },

    // 15 vs 9 - Surrender at positive count
    {
      hand: '15',
      dealer: '9',
      basicAction: 'H',
      deviationAction: 'SU',
      threshold: 2,
      description: 'Surrender 15 vs 9 at TC >= +2',
    },

    // 15 vs A - Surrender at low positive count
    {
      hand: '15',
      dealer: 'A',
      basicAction: 'H',
      deviationAction: 'SU',
      threshold: 1,
      description: 'Surrender 15 vs A at TC >= +1',
    },
  ],
};
