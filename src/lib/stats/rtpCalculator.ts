import { SessionStats } from '../../types/stats.types';

/**
 * RTP (Return to Player) Calculator
 *
 * Calculates the percentage of wagered money returned to the player.
 * RTP = (Total Won / Total Wagered) × 100%
 *
 * Examples:
 * - RTP = 100%: Break even
 * - RTP > 100%: Player winning
 * - RTP < 100%: Player losing
 *
 * For blackjack with perfect basic strategy:
 * - Expected RTP: 99.5% - 99.7% (depending on rules)
 * - With card counting: Can exceed 100%
 */

export interface RTPData {
  rtp: number;              // Return to Player percentage
  totalWagered: number;     // Total amount bet
  totalWon: number;         // Total amount won (including returned bets)
  netProfit: number;        // Net profit/loss
  handsPlayed: number;      // Total hands played
  avgBet: number;           // Average bet size
  avgReturn: number;        // Average return per hand
}

/**
 * Calculate RTP from session statistics
 */
export function calculateRTP(stats: SessionStats): RTPData {
  const rtp = stats.totalWagered > 0
    ? (stats.totalWon / stats.totalWagered) * 100
    : 0;

  const avgBet = stats.handsPlayed > 0
    ? stats.totalWagered / stats.handsPlayed
    : 0;

  const avgReturn = stats.handsPlayed > 0
    ? stats.totalWon / stats.handsPlayed
    : 0;

  return {
    rtp: Math.round(rtp * 100) / 100,  // Round to 2 decimal places
    totalWagered: stats.totalWagered,
    totalWon: stats.totalWon,
    netProfit: stats.netProfit,
    handsPlayed: stats.handsPlayed,
    avgBet: Math.round(avgBet * 100) / 100,
    avgReturn: Math.round(avgReturn * 100) / 100,
  };
}

/**
 * Get RTP category description
 */
export function getRTPCategory(rtp: number): {
  category: 'excellent' | 'good' | 'average' | 'poor' | 'unknown';
  description: string;
  color: string;
} {
  if (rtp === 0) {
    return {
      category: 'unknown',
      description: 'No data yet',
      color: '#6b7280', // gray
    };
  }

  if (rtp >= 100) {
    return {
      category: 'excellent',
      description: 'Player advantage',
      color: '#22c55e', // green
    };
  }

  if (rtp >= 99) {
    return {
      category: 'good',
      description: 'Near perfect play',
      color: '#84cc16', // lime
    };
  }

  if (rtp >= 95) {
    return {
      category: 'average',
      description: 'Room for improvement',
      color: '#fbbf24', // yellow
    };
  }

  return {
    category: 'poor',
    description: 'Many mistakes',
    color: '#ef4444', // red
  };
}

/**
 * Calculate expected RTP for given game rules (theoretical)
 * This is separate from actual player performance
 */
export function getExpectedRTP(houseEdge: number): number {
  // Expected RTP = 100% - House Edge
  return 100 - houseEdge;
}

/**
 * Compare actual RTP to expected RTP
 */
export function compareRTPToExpected(actualRTP: number, houseEdge: number): {
  difference: number;
  performance: 'above' | 'expected' | 'below';
  message: string;
} {
  const expectedRTP = getExpectedRTP(houseEdge);
  const difference = actualRTP - expectedRTP;

  if (Math.abs(difference) < 0.5) {
    return {
      difference: Math.round(difference * 100) / 100,
      performance: 'expected',
      message: 'Playing as expected',
    };
  }

  if (difference > 0) {
    return {
      difference: Math.round(difference * 100) / 100,
      performance: 'above',
      message: 'Playing better than expected',
    };
  }

  return {
    difference: Math.round(difference * 100) / 100,
    performance: 'below',
    message: 'Playing worse than expected',
  };
}
