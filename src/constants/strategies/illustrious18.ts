/**
 * Illustrious 18 - The 18 most important strategy deviations for Hi-Lo counting
 *
 * Developed by Don Schlesinger for the Hi-Lo counting system.
 * These are the 18 most profitable index plays ranked by frequency and EV gain.
 *
 * Reference: "Blackjack Attack" by Don Schlesinger
 */

import { StrategySet } from '../../types/strategy.types';

export const ILLUSTRIOUS_18: StrategySet = {
  id: 'illustrious18',
  name: 'Illustrious 18',
  systemId: 'hi-lo',
  usesTrueCount: true,
  description: 'The 18 most important strategy deviations for Hi-Lo counting system',
  deviations: [
    // 1. Insurance (most important - accounts for ~30% of total deviation EV)
    {
      hand: 'any',
      dealer: 'A',
      basicAction: 'decline',
      deviationAction: 'take_insurance',
      threshold: 3,
      description: 'Take insurance at TC >= +3',
    },

    // 2. 16 vs 10 (surrender)
    {
      hand: '16',
      dealer: '10',
      basicAction: 'H',
      deviationAction: 'SU',
      threshold: 0,
      description: 'Surrender 16 vs 10 at TC >= 0',
    },

    // 3. 15 vs 10 (surrender)
    {
      hand: '15',
      dealer: '10',
      basicAction: 'H',
      deviationAction: 'SU',
      threshold: 4,
      description: 'Surrender 15 vs 10 at TC >= +4',
    },

    // 4. 10,10 vs 5 (split) - "Wonging out" play
    {
      hand: '10,10',
      dealer: '5',
      basicAction: 'S',
      deviationAction: 'SP',
      threshold: 5,
      description: 'Split 10,10 vs 5 at TC >= +5',
    },

    // 5. 10,10 vs 6 (split)
    {
      hand: '10,10',
      dealer: '6',
      basicAction: 'S',
      deviationAction: 'SP',
      threshold: 4,
      description: 'Split 10,10 vs 6 at TC >= +4',
    },

    // 6. 10 vs 10 (double)
    {
      hand: '10',
      dealer: '10',
      basicAction: 'H',
      deviationAction: 'DH',
      threshold: 4,
      description: 'Double 10 vs 10 at TC >= +4',
    },

    // 7. 12 vs 3 (stand)
    {
      hand: '12',
      dealer: '3',
      basicAction: 'H',
      deviationAction: 'S',
      threshold: 2,
      description: 'Stand on 12 vs 3 at TC >= +2',
    },

    // 8. 12 vs 2 (stand)
    {
      hand: '12',
      dealer: '2',
      basicAction: 'H',
      deviationAction: 'S',
      threshold: 3,
      description: 'Stand on 12 vs 2 at TC >= +3',
    },

    // 9. 11 vs A (double)
    {
      hand: '11',
      dealer: 'A',
      basicAction: 'H',
      deviationAction: 'DH',
      threshold: 1,
      description: 'Double 11 vs A at TC >= +1',
    },

    // 10. 9 vs 2 (double)
    {
      hand: '9',
      dealer: '2',
      basicAction: 'H',
      deviationAction: 'DH',
      threshold: 1,
      description: 'Double 9 vs 2 at TC >= +1',
    },

    // 11. 10 vs A (double)
    {
      hand: '10',
      dealer: 'A',
      basicAction: 'H',
      deviationAction: 'DH',
      threshold: 4,
      description: 'Double 10 vs A at TC >= +4',
    },

    // 12. 9 vs 7 (double)
    {
      hand: '9',
      dealer: '7',
      basicAction: 'H',
      deviationAction: 'DH',
      threshold: 3,
      description: 'Double 9 vs 7 at TC >= +3',
    },

    // 13. 16 vs 9 (stand)
    {
      hand: '16',
      dealer: '9',
      basicAction: 'H',
      deviationAction: 'S',
      threshold: 5,
      description: 'Stand on 16 vs 9 at TC >= +5',
    },

    // 14. 13 vs 2 (hit when count is negative)
    {
      hand: '13',
      dealer: '2',
      basicAction: 'S',
      deviationAction: 'H',
      threshold: -1,
      description: 'Hit 13 vs 2 at TC <= -1',
    },

    // 15. 12 vs 4 (hit when count is neutral/negative)
    {
      hand: '12',
      dealer: '4',
      basicAction: 'S',
      deviationAction: 'H',
      threshold: 0,
      description: 'Hit 12 vs 4 at TC <= 0',
    },

    // 16. 12 vs 5 (hit when count is negative)
    {
      hand: '12',
      dealer: '5',
      basicAction: 'S',
      deviationAction: 'H',
      threshold: -2,
      description: 'Hit 12 vs 5 at TC <= -2',
    },

    // 17. 12 vs 6 (hit when count is negative)
    {
      hand: '12',
      dealer: '6',
      basicAction: 'S',
      deviationAction: 'H',
      threshold: -1,
      description: 'Hit 12 vs 6 at TC <= -1',
    },

    // 18. 13 vs 3 (hit when count is negative)
    {
      hand: '13',
      dealer: '3',
      basicAction: 'S',
      deviationAction: 'H',
      threshold: -2,
      description: 'Hit 13 vs 3 at TC <= -2',
    },
  ],
};
