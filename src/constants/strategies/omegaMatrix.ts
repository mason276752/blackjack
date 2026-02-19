/**
 * Omega II Index Matrix - Strategy deviations for Omega II counting system
 *
 * Omega II is a multi-level (level 2) balanced counting system.
 * Because card values are doubled compared to Hi-Lo, thresholds are approximately
 * 2x the Hi-Lo values.
 *
 * Example: Hi-Lo insurance at TC +3 → Omega II insurance at TC +6
 *
 * Reference: "Blackjack for Blood" by Bryce Carlson
 */

import { StrategySet } from '../../types/strategy.types';

export const OMEGA_MATRIX: StrategySet = {
  id: 'omega_matrix',
  name: 'Omega II Matrix',
  systemId: 'omega-ii',
  usesTrueCount: true,
  description: 'Advanced index plays for Omega II counting system',
  deviations: [
    // Insurance - Higher threshold due to multi-level counting
    {
      hand: 'any',
      dealer: 'A',
      basicAction: 'decline',
      deviationAction: 'take_insurance',
      threshold: 6,
      description: 'Take insurance at TC >= +6',
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

    // 16 vs 9 - Stand at higher positive count
    {
      hand: '16',
      dealer: '9',
      basicAction: 'H',
      deviationAction: 'S',
      threshold: 7,
      description: 'Stand on 16 vs 9 at TC >= +7',
    },

    // 15 vs 10 - Stand at positive count
    {
      hand: '15',
      dealer: '10',
      basicAction: 'H',
      deviationAction: 'S',
      threshold: 6,
      description: 'Stand on 15 vs 10 at TC >= +6',
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
      threshold: -3,
      description: 'Hit 13 vs 3 at TC <= -3',
    },

    // 12 vs 2 - Stand at higher positive count
    {
      hand: '12',
      dealer: '2',
      basicAction: 'H',
      deviationAction: 'S',
      threshold: 5,
      description: 'Stand on 12 vs 2 at TC >= +5',
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
      threshold: -5,
      description: 'Hit 12 vs 6 at TC <= -5',
    },

    // 10 vs 10 - Double at high positive count
    {
      hand: '10',
      dealer: '10',
      basicAction: 'H',
      deviationAction: 'DH',
      threshold: 9,
      description: 'Double 10 vs 10 at TC >= +9',
    },

    // 10 vs A - Double at high positive count
    {
      hand: '10',
      dealer: 'A',
      basicAction: 'H',
      deviationAction: 'DH',
      threshold: 8,
      description: 'Double 10 vs A at TC >= +8',
    },

    // 9 vs 2 - Double at positive count
    {
      hand: '9',
      dealer: '2',
      basicAction: 'H',
      deviationAction: 'DH',
      threshold: 4,
      description: 'Double 9 vs 2 at TC >= +4',
    },

    // 9 vs 7 - Double at higher positive count
    {
      hand: '9',
      dealer: '7',
      basicAction: 'H',
      deviationAction: 'DH',
      threshold: 7,
      description: 'Double 9 vs 7 at TC >= +7',
    },

    // 10,10 vs 5 - Split at high positive count
    {
      hand: '10,10',
      dealer: '5',
      basicAction: 'S',
      deviationAction: 'SP',
      threshold: 9,
      description: 'Split 10,10 vs 5 at TC >= +9',
    },

    // 10,10 vs 6 - Split at high positive count
    {
      hand: '10,10',
      dealer: '6',
      basicAction: 'S',
      deviationAction: 'SP',
      threshold: 8,
      description: 'Split 10,10 vs 6 at TC >= +8',
    },
  ],
};
