import { StrategyAction, GameRules } from '../../types/game.types';
import { HARD_HAND_STRATEGY, SOFT_HAND_STRATEGY, PAIR_STRATEGY } from '../../constants/strategyTables';
import {
  HARD_HAND_STRATEGY_H17_DAS,
  SOFT_HAND_STRATEGY_H17_DAS,
  PAIR_STRATEGY_H17_DAS,
} from '../../constants/strategyTables.h17';
import {
  HARD_HAND_STRATEGY_S17_DAS,
  SOFT_HAND_STRATEGY_S17_DAS,
  PAIR_STRATEGY_S17_DAS,
} from '../../constants/strategyTables.s17';

export interface TableRow {
  label: string;
  cells: StrategyAction[];
}

export interface TableData {
  headers: string[]; // ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A']
  rows: TableRow[];
}

const DEALER_CARDS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'];

/**
 * Get the appropriate strategy table based on game rules
 */
function getHardHandStrategyTable(rules?: GameRules): Record<string, StrategyAction> {
  if (!rules) {
    return HARD_HAND_STRATEGY; // Default fallback
  }

  // Select strategy based on H17/S17 and DAS
  if (rules.dealerHitsSoft17) {
    return HARD_HAND_STRATEGY_H17_DAS; // H17 with DAS
  } else {
    return HARD_HAND_STRATEGY_S17_DAS; // S17 with DAS
  }
}

function getSoftHandStrategyTable(rules?: GameRules): Record<string, StrategyAction> {
  if (!rules) {
    return SOFT_HAND_STRATEGY; // Default fallback
  }

  if (rules.dealerHitsSoft17) {
    return SOFT_HAND_STRATEGY_H17_DAS;
  } else {
    return SOFT_HAND_STRATEGY_S17_DAS;
  }
}

function getPairStrategyTable(rules?: GameRules): Record<string, StrategyAction> {
  if (!rules) {
    return PAIR_STRATEGY; // Default fallback
  }

  if (rules.dealerHitsSoft17) {
    return PAIR_STRATEGY_H17_DAS;
  } else {
    return PAIR_STRATEGY_S17_DAS;
  }
}

/**
 * Transform HARD_HAND_STRATEGY into a 2D table array
 * Rows: 5-21 (17 rows)
 * Columns: 2-A (10 columns)
 *
 * @param rules - Game rules to determine which strategy table to use
 */
export function getHardHandTable(rules?: GameRules): TableData {
  const strategyTable = getHardHandStrategyTable(rules);
  const rows: TableRow[] = [];

  for (let total = 5; total <= 21; total++) {
    const cells: StrategyAction[] = [];

    for (const dealer of DEALER_CARDS) {
      const key = `${total}_vs_${dealer}`;
      cells.push(strategyTable[key] || 'H');
    }

    rows.push({
      label: String(total),
      cells,
    });
  }

  return {
    headers: DEALER_CARDS,
    rows,
  };
}

/**
 * Transform SOFT_HAND_STRATEGY into a 2D table array
 * Rows: A2-A9 (8 rows)
 * Columns: 2-A (10 columns)
 *
 * @param rules - Game rules to determine which strategy table to use
 */
export function getSoftHandTable(rules?: GameRules): TableData {
  const strategyTable = getSoftHandStrategyTable(rules);
  const rows: TableRow[] = [];
  const softHands = ['A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'];

  for (const hand of softHands) {
    const cells: StrategyAction[] = [];

    for (const dealer of DEALER_CARDS) {
      const key = `${hand}_vs_${dealer}`;
      cells.push(strategyTable[key] || 'H');
    }

    rows.push({
      label: hand,
      cells,
    });
  }

  return {
    headers: DEALER_CARDS,
    rows,
  };
}

/**
 * Transform PAIR_STRATEGY into a 2D table array
 * Rows: 2,2 to A,A (10 rows)
 * Columns: 2-A (10 columns)
 *
 * @param rules - Game rules to determine which strategy table to use
 */
export function getPairTable(rules?: GameRules): TableData {
  const strategyTable = getPairStrategyTable(rules);
  const rows: TableRow[] = [];
  const pairs = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'];

  for (const pairValue of pairs) {
    const cells: StrategyAction[] = [];

    for (const dealer of DEALER_CARDS) {
      const key = `${pairValue}_vs_${dealer}`;
      cells.push(strategyTable[key] || 'H');
    }

    rows.push({
      label: `${pairValue},${pairValue}`,
      cells,
    });
  }

  return {
    headers: DEALER_CARDS,
    rows,
  };
}

/**
 * Get action color for table cell styling
 */
export function getActionColor(action: StrategyAction): string {
  const colors: Record<StrategyAction, string> = {
    H: '#fbbf24',   // yellow - hit
    S: '#22c55e',   // green - stand
    D: '#3b82f6',   // blue - double
    DH: '#fb923c',  // orange - double or hit
    DS: '#14b8a6',  // teal - double or stand
    SP: '#a855f7',  // purple - split
    SU: '#ef4444',  // red - surrender
  };

  return colors[action] || '#6b7280'; // gray fallback
}
