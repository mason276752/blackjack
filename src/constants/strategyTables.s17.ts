import { StrategyAction } from '../types/game.types';

/**
 * Basic Strategy Tables for S17 (Dealer Stands on Soft 17) with DAS (Double After Split)
 * S17 is more player-friendly than H17 and affects strategy in a few key situations
 */

export const HARD_HAND_STRATEGY_S17_DAS: Record<string, StrategyAction> = {
  // Hard totals 5-8: Always hit
  '5_vs_2': 'H', '5_vs_3': 'H', '5_vs_4': 'H', '5_vs_5': 'H', '5_vs_6': 'H', '5_vs_7': 'H', '5_vs_8': 'H', '5_vs_9': 'H', '5_vs_10': 'H', '5_vs_A': 'H',
  '6_vs_2': 'H', '6_vs_3': 'H', '6_vs_4': 'H', '6_vs_5': 'H', '6_vs_6': 'H', '6_vs_7': 'H', '6_vs_8': 'H', '6_vs_9': 'H', '6_vs_10': 'H', '6_vs_A': 'H',
  '7_vs_2': 'H', '7_vs_3': 'H', '7_vs_4': 'H', '7_vs_5': 'H', '7_vs_6': 'H', '7_vs_7': 'H', '7_vs_8': 'H', '7_vs_9': 'H', '7_vs_10': 'H', '7_vs_A': 'H',
  '8_vs_2': 'H', '8_vs_3': 'H', '8_vs_4': 'H', '8_vs_5': 'H', '8_vs_6': 'H', '8_vs_7': 'H', '8_vs_8': 'H', '8_vs_9': 'H', '8_vs_10': 'H', '8_vs_A': 'H',

  // Hard 9: Double on 3-6, else hit
  '9_vs_2': 'H', '9_vs_3': 'DH', '9_vs_4': 'DH', '9_vs_5': 'DH', '9_vs_6': 'DH', '9_vs_7': 'H', '9_vs_8': 'H', '9_vs_9': 'H', '9_vs_10': 'H', '9_vs_A': 'H',

  // Hard 10: Double on 2-9, else hit
  '10_vs_2': 'DH', '10_vs_3': 'DH', '10_vs_4': 'DH', '10_vs_5': 'DH', '10_vs_6': 'DH', '10_vs_7': 'DH', '10_vs_8': 'DH', '10_vs_9': 'DH', '10_vs_10': 'H', '10_vs_A': 'H',

  // Hard 11: Double on all (same as H17)
  '11_vs_2': 'DH', '11_vs_3': 'DH', '11_vs_4': 'DH', '11_vs_5': 'DH', '11_vs_6': 'DH', '11_vs_7': 'DH', '11_vs_8': 'DH', '11_vs_9': 'DH', '11_vs_10': 'DH', '11_vs_A': 'DH',

  // Hard 12: Stand on 4-6, else hit
  '12_vs_2': 'H', '12_vs_3': 'H', '12_vs_4': 'S', '12_vs_5': 'S', '12_vs_6': 'S', '12_vs_7': 'H', '12_vs_8': 'H', '12_vs_9': 'H', '12_vs_10': 'H', '12_vs_A': 'H',

  // Hard 13-16: Stand on 2-6, else hit (S17: DON'T surrender 15 vs A, only vs 10)
  '13_vs_2': 'S', '13_vs_3': 'S', '13_vs_4': 'S', '13_vs_5': 'S', '13_vs_6': 'S', '13_vs_7': 'H', '13_vs_8': 'H', '13_vs_9': 'H', '13_vs_10': 'H', '13_vs_A': 'H',
  '14_vs_2': 'S', '14_vs_3': 'S', '14_vs_4': 'S', '14_vs_5': 'S', '14_vs_6': 'S', '14_vs_7': 'H', '14_vs_8': 'H', '14_vs_9': 'H', '14_vs_10': 'H', '14_vs_A': 'H',
  '15_vs_2': 'S', '15_vs_3': 'S', '15_vs_4': 'S', '15_vs_5': 'S', '15_vs_6': 'S', '15_vs_7': 'H', '15_vs_8': 'H', '15_vs_9': 'H', '15_vs_10': 'SU', '15_vs_A': 'H', // S17: HIT vs A (not surrender)
  '16_vs_2': 'S', '16_vs_3': 'S', '16_vs_4': 'S', '16_vs_5': 'S', '16_vs_6': 'S', '16_vs_7': 'H', '16_vs_8': 'H', '16_vs_9': 'SU', '16_vs_10': 'SU', '16_vs_A': 'SU',

  // Hard 17+: Always stand
  '17_vs_2': 'S', '17_vs_3': 'S', '17_vs_4': 'S', '17_vs_5': 'S', '17_vs_6': 'S', '17_vs_7': 'S', '17_vs_8': 'S', '17_vs_9': 'S', '17_vs_10': 'S', '17_vs_A': 'S',
  '18_vs_2': 'S', '18_vs_3': 'S', '18_vs_4': 'S', '18_vs_5': 'S', '18_vs_6': 'S', '18_vs_7': 'S', '18_vs_8': 'S', '18_vs_9': 'S', '18_vs_10': 'S', '18_vs_A': 'S',
  '19_vs_2': 'S', '19_vs_3': 'S', '19_vs_4': 'S', '19_vs_5': 'S', '19_vs_6': 'S', '19_vs_7': 'S', '19_vs_8': 'S', '19_vs_9': 'S', '19_vs_10': 'S', '19_vs_A': 'S',
  '20_vs_2': 'S', '20_vs_3': 'S', '20_vs_4': 'S', '20_vs_5': 'S', '20_vs_6': 'S', '20_vs_7': 'S', '20_vs_8': 'S', '20_vs_9': 'S', '20_vs_10': 'S', '20_vs_A': 'S',
  '21_vs_2': 'S', '21_vs_3': 'S', '21_vs_4': 'S', '21_vs_5': 'S', '21_vs_6': 'S', '21_vs_7': 'S', '21_vs_8': 'S', '21_vs_9': 'S', '21_vs_10': 'S', '21_vs_A': 'S',
};

export const SOFT_HAND_STRATEGY_S17_DAS: Record<string, StrategyAction> = {
  // Soft 13-14 (A,2 or A,3): Double on 5-6, else hit
  'A2_vs_2': 'H', 'A2_vs_3': 'H', 'A2_vs_4': 'H', 'A2_vs_5': 'DH', 'A2_vs_6': 'DH', 'A2_vs_7': 'H', 'A2_vs_8': 'H', 'A2_vs_9': 'H', 'A2_vs_10': 'H', 'A2_vs_A': 'H',
  'A3_vs_2': 'H', 'A3_vs_3': 'H', 'A3_vs_4': 'H', 'A3_vs_5': 'DH', 'A3_vs_6': 'DH', 'A3_vs_7': 'H', 'A3_vs_8': 'H', 'A3_vs_9': 'H', 'A3_vs_10': 'H', 'A3_vs_A': 'H',

  // Soft 15-16 (A,4 or A,5): Double on 4-6, else hit
  'A4_vs_2': 'H', 'A4_vs_3': 'H', 'A4_vs_4': 'DH', 'A4_vs_5': 'DH', 'A4_vs_6': 'DH', 'A4_vs_7': 'H', 'A4_vs_8': 'H', 'A4_vs_9': 'H', 'A4_vs_10': 'H', 'A4_vs_A': 'H',
  'A5_vs_2': 'H', 'A5_vs_3': 'H', 'A5_vs_4': 'DH', 'A5_vs_5': 'DH', 'A5_vs_6': 'DH', 'A5_vs_7': 'H', 'A5_vs_8': 'H', 'A5_vs_9': 'H', 'A5_vs_10': 'H', 'A5_vs_A': 'H',

  // Soft 17 (A,6): Double on 3-6, else hit
  'A6_vs_2': 'H', 'A6_vs_3': 'DH', 'A6_vs_4': 'DH', 'A6_vs_5': 'DH', 'A6_vs_6': 'DH', 'A6_vs_7': 'H', 'A6_vs_8': 'H', 'A6_vs_9': 'H', 'A6_vs_10': 'H', 'A6_vs_A': 'H',

  // Soft 18 (A,7): S17 rule - stand vs 2 (not double), double on 3-6, stand on 7/8, hit on 9/10/A
  'A7_vs_2': 'S', 'A7_vs_3': 'DS', 'A7_vs_4': 'DS', 'A7_vs_5': 'DS', 'A7_vs_6': 'DS', 'A7_vs_7': 'S', 'A7_vs_8': 'S', 'A7_vs_9': 'H', 'A7_vs_10': 'H', 'A7_vs_A': 'H',

  // Soft 19+ (A,8+): Always stand
  'A8_vs_2': 'S', 'A8_vs_3': 'S', 'A8_vs_4': 'S', 'A8_vs_5': 'S', 'A8_vs_6': 'S', 'A8_vs_7': 'S', 'A8_vs_8': 'S', 'A8_vs_9': 'S', 'A8_vs_10': 'S', 'A8_vs_A': 'S',
  'A9_vs_2': 'S', 'A9_vs_3': 'S', 'A9_vs_4': 'S', 'A9_vs_5': 'S', 'A9_vs_6': 'S', 'A9_vs_7': 'S', 'A9_vs_8': 'S', 'A9_vs_9': 'S', 'A9_vs_10': 'S', 'A9_vs_A': 'S',
};

export const PAIR_STRATEGY_S17_DAS: Record<string, StrategyAction> = {
  // Same as H17 - pair strategy doesn't change significantly between H17 and S17
  '2_vs_2': 'SP', '2_vs_3': 'SP', '2_vs_4': 'SP', '2_vs_5': 'SP', '2_vs_6': 'SP', '2_vs_7': 'SP', '2_vs_8': 'H', '2_vs_9': 'H', '2_vs_10': 'H', '2_vs_A': 'H',
  '3_vs_2': 'SP', '3_vs_3': 'SP', '3_vs_4': 'SP', '3_vs_5': 'SP', '3_vs_6': 'SP', '3_vs_7': 'SP', '3_vs_8': 'H', '3_vs_9': 'H', '3_vs_10': 'H', '3_vs_A': 'H',
  '4_vs_2': 'H', '4_vs_3': 'H', '4_vs_4': 'H', '4_vs_5': 'SP', '4_vs_6': 'SP', '4_vs_7': 'H', '4_vs_8': 'H', '4_vs_9': 'H', '4_vs_10': 'H', '4_vs_A': 'H',
  '5_vs_2': 'DH', '5_vs_3': 'DH', '5_vs_4': 'DH', '5_vs_5': 'DH', '5_vs_6': 'DH', '5_vs_7': 'DH', '5_vs_8': 'DH', '5_vs_9': 'DH', '5_vs_10': 'H', '5_vs_A': 'H',
  '6_vs_2': 'SP', '6_vs_3': 'SP', '6_vs_4': 'SP', '6_vs_5': 'SP', '6_vs_6': 'SP', '6_vs_7': 'H', '6_vs_8': 'H', '6_vs_9': 'H', '6_vs_10': 'H', '6_vs_A': 'H',
  '7_vs_2': 'SP', '7_vs_3': 'SP', '7_vs_4': 'SP', '7_vs_5': 'SP', '7_vs_6': 'SP', '7_vs_7': 'SP', '7_vs_8': 'H', '7_vs_9': 'H', '7_vs_10': 'H', '7_vs_A': 'H',
  '8_vs_2': 'SP', '8_vs_3': 'SP', '8_vs_4': 'SP', '8_vs_5': 'SP', '8_vs_6': 'SP', '8_vs_7': 'SP', '8_vs_8': 'SP', '8_vs_9': 'SP', '8_vs_10': 'SP', '8_vs_A': 'SP',
  '9_vs_2': 'SP', '9_vs_3': 'SP', '9_vs_4': 'SP', '9_vs_5': 'SP', '9_vs_6': 'SP', '9_vs_7': 'S', '9_vs_8': 'SP', '9_vs_9': 'SP', '9_vs_10': 'S', '9_vs_A': 'S',
  '10_vs_2': 'S', '10_vs_3': 'S', '10_vs_4': 'S', '10_vs_5': 'S', '10_vs_6': 'S', '10_vs_7': 'S', '10_vs_8': 'S', '10_vs_9': 'S', '10_vs_10': 'S', '10_vs_A': 'S',
  'A_vs_2': 'SP', 'A_vs_3': 'SP', 'A_vs_4': 'SP', 'A_vs_5': 'SP', 'A_vs_6': 'SP', 'A_vs_7': 'SP', 'A_vs_8': 'SP', 'A_vs_9': 'SP', 'A_vs_10': 'SP', 'A_vs_A': 'SP',
};
