/**
 * Catch 22 Strategy Set - Paired with CAC2 Counting System
 *
 * This strategy set contains 22 index plays specifically designed for the CAC2 counting system.
 * CAC2 is a Level 2 balanced counting system with unique tag distribution.
 *
 * All thresholds are in True Count (TC) since CAC2 is a balanced system.
 * Thresholds are estimated based on comparison with Hi-Lo, Omega II, and Zen Count systems.
 */

import { StrategySet } from '../../types/strategy.types';

export const CATCH_22: StrategySet = {
  id: 'catch22',
  name: 'Catch 22',
  systemId: 'cac2',
  usesTrueCount: true,
  description: 'CAC2 system dedicated 22 strategy deviations',
  deviations: [
    // ==============================
    // 1. Insurance
    // ==============================
    {
      hand: 'any',
      dealer: 'A',
      basicAction: 'decline',
      deviationAction: 'take_insurance',
      threshold: 3,
      description: 'Take insurance at TC >= +3',
    },

    // ==============================
    // 2-5. Standing on Stiff Hands vs High Cards
    // ==============================
    {
      hand: '16',
      dealer: '10',
      basicAction: 'H',
      deviationAction: 'S',
      threshold: 0,
      description: 'Stand 16 vs 10 at TC >= 0',
    },
    {
      hand: '15',
      dealer: '10',
      basicAction: 'H',
      deviationAction: 'S',
      threshold: 4,
      description: 'Stand 15 vs 10 at TC >= +4',
    },
    {
      hand: '15',
      dealer: '9',
      basicAction: 'H',
      deviationAction: 'S',
      threshold: 3,
      description: 'Stand 15 vs 9 at TC >= +3',
    },
    {
      hand: '16',
      dealer: '9',
      basicAction: 'H',
      deviationAction: 'S',
      threshold: 5,
      description: 'Stand 16 vs 9 at TC >= +5',
    },

    // ==============================
    // 6-10. Doubling Hard Hands
    // ==============================
    {
      hand: '10',
      dealer: '10',
      basicAction: 'H',
      deviationAction: 'DH',
      threshold: 5,
      description: 'Double 10 vs 10 at TC >= +5',
    },
    {
      hand: '10',
      dealer: 'A',
      basicAction: 'H',
      deviationAction: 'DH',
      threshold: 5,
      description: 'Double 10 vs A at TC >= +5',
    },
    {
      hand: '11',
      dealer: 'A',
      basicAction: 'H',
      deviationAction: 'DH',
      threshold: 1,
      description: 'Double 11 vs A at TC >= +1',
    },
    {
      hand: '9',
      dealer: '2',
      basicAction: 'H',
      deviationAction: 'DH',
      threshold: 2,
      description: 'Double 9 vs 2 at TC >= +2',
    },
    {
      hand: '9',
      dealer: '7',
      basicAction: 'H',
      deviationAction: 'DH',
      threshold: 4,
      description: 'Double 9 vs 7 at TC >= +4',
    },

    // ==============================
    // 11-12. Aggressive Doubling (8 vs 5/6)
    // ==============================
    {
      hand: '8',
      dealer: '5',
      basicAction: 'H',
      deviationAction: 'DH',
      threshold: 3,
      description: 'Double 8 vs 5 at TC >= +3',
    },
    {
      hand: '8',
      dealer: '6',
      basicAction: 'H',
      deviationAction: 'DH',
      threshold: 3,
      description: 'Double 8 vs 6 at TC >= +3',
    },

    // ==============================
    // 13-14. Soft 19 Doubles
    // ==============================
    {
      hand: 'A8',
      dealer: '5',
      basicAction: 'S',
      deviationAction: 'DH',
      threshold: 2,
      description: 'Double soft 19 (A-8) vs 5 at TC >= +2',
    },
    {
      hand: 'A8',
      dealer: '6',
      basicAction: 'S',
      deviationAction: 'DH',
      threshold: 1,
      description: 'Double soft 19 (A-8) vs 6 at TC >= +1',
    },

    // ==============================
    // 15-19. 12 vs Small Cards (2-6)
    // ==============================
    {
      hand: '12',
      dealer: '2',
      basicAction: 'H',
      deviationAction: 'S',
      threshold: 4,
      description: 'Stand 12 vs 2 at TC >= +4',
    },
    {
      hand: '12',
      dealer: '3',
      basicAction: 'H',
      deviationAction: 'S',
      threshold: 2,
      description: 'Stand 12 vs 3 at TC >= +2',
    },
    {
      hand: '12',
      dealer: '4',
      basicAction: 'S',
      deviationAction: 'H',
      threshold: 0,
      description: 'Hit 12 vs 4 at TC <= 0',
    },
    {
      hand: '12',
      dealer: '5',
      basicAction: 'S',
      deviationAction: 'H',
      threshold: -2,
      description: 'Hit 12 vs 5 at TC <= -2',
    },
    {
      hand: '12',
      dealer: '6',
      basicAction: 'S',
      deviationAction: 'H',
      threshold: -2,
      description: 'Hit 12 vs 6 at TC <= -2',
    },

    // ==============================
    // 20-21. 13 vs Small Cards (2-3)
    // ==============================
    {
      hand: '13',
      dealer: '2',
      basicAction: 'S',
      deviationAction: 'H',
      threshold: -1,
      description: 'Hit 13 vs 2 at TC <= -1',
    },
    {
      hand: '13',
      dealer: '3',
      basicAction: 'S',
      deviationAction: 'H',
      threshold: -2,
      description: 'Hit 13 vs 3 at TC <= -2',
    },

    // ==============================
    // 22. Splitting Tens (High Variance Play)
    // ==============================
    {
      hand: '10,10',
      dealer: '5',
      basicAction: 'S',
      deviationAction: 'SP',
      threshold: 6,
      description: 'Split 10-10 vs 5 at TC >= +6',
    },
    {
      hand: '10,10',
      dealer: '6',
      basicAction: 'S',
      deviationAction: 'SP',
      threshold: 5,
      description: 'Split 10-10 vs 6 at TC >= +5',
    },
  ],
};
