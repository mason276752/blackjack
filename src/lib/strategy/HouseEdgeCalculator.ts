import { GameRules } from '../../types/game.types';

/**
 * House Edge Calculator
 *
 * Calculates the theoretical house edge (or player advantage) based on game rules.
 * Positive values favor the house, negative values favor the player.
 *
 * Base house edge (S17, 6 decks, DAS, no surrender, 3:2 BJ): ~0.43%
 *
 * Sources:
 * - Wizard of Odds (https://wizardofodds.com/games/blackjack/calculator/)
 * - "The Theory of Blackjack" by Peter Griffin
 */

interface EdgeComponent {
  label: string;
  value: number; // Percentage points
  description: string;
}

export class HouseEdgeCalculator {
  /**
   * Calculate house edge based on game rules
   *
   * @param rules - Current game rules
   * @returns House edge as a percentage (positive = house advantage, negative = player advantage)
   */
  static calculateHouseEdge(rules: GameRules): number {
    let edge = 0;

    // Base edge starts at 0.43% for: S17, 6 decks, DAS, no surrender, 3:2 BJ
    const BASE_EDGE = 0.43;
    edge = BASE_EDGE;

    // Adjust for number of decks
    edge += this.deckCountAdjustment(rules.deckCount);

    // Adjust for dealer hits soft 17
    if (rules.dealerHitsSoft17) {
      edge += 0.22; // H17 adds ~0.22% to house edge
    }

    // Adjust for blackjack payout
    edge += this.blackjackPayoutAdjustment(rules.blackjackPayout);

    // Adjust for double after split
    if (!rules.doubleAfterSplit) {
      edge += 0.14; // No DAS adds ~0.14% to house edge
    }

    // Adjust for late surrender
    if (rules.lateSurrender) {
      edge -= 0.08; // Late surrender reduces house edge by ~0.08%
    }

    // Adjust for resplit aces
    if (rules.canResplitAces) {
      edge -= 0.08; // Resplit aces reduces house edge by ~0.08%
    }

    // Adjust for hit split aces
    if (rules.canHitSplitAces) {
      edge -= 0.14; // Hit split aces reduces house edge by ~0.14%
    }

    // Adjust for double restrictions
    edge += this.doubleRestrictionAdjustment(rules.doubleOn);

    // Adjust for max split hands (maxSplits + 1 = total hands)
    edge += this.maxSplitHandsAdjustment(rules.maxSplits + 1);

    return Math.round(edge * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Get detailed breakdown of house edge components
   */
  static getEdgeBreakdown(rules: GameRules): EdgeComponent[] {
    const components: EdgeComponent[] = [];

    // Base edge
    components.push({
      label: 'Base Edge (S17, 6D, DAS)',
      value: 0.43,
      description: 'Starting point for optimal basic strategy'
    });

    // Deck count adjustment
    const deckAdj = this.deckCountAdjustment(rules.deckCount);
    if (deckAdj !== 0) {
      components.push({
        label: `${rules.deckCount} Deck${rules.deckCount > 1 ? 's' : ''}`,
        value: deckAdj,
        description: `Fewer decks favor player`
      });
    }

    // H17 adjustment
    if (rules.dealerHitsSoft17) {
      components.push({
        label: 'Dealer Hits Soft 17 (H17)',
        value: 0.22,
        description: 'Dealer has more chances to improve'
      });
    } else {
      components.push({
        label: 'Dealer Stands on Soft 17 (S17)',
        value: 0,
        description: 'Included in base edge'
      });
    }

    // Blackjack payout
    const bjAdj = this.blackjackPayoutAdjustment(rules.blackjackPayout);
    if (bjAdj !== 0) {
      const payoutLabel = rules.blackjackPayout === 1.5 ? '3:2' :
                          rules.blackjackPayout === 1.2 ? '6:5' :
                          rules.blackjackPayout === 2.0 ? '2:1' :
                          `${rules.blackjackPayout}:1`;
      components.push({
        label: `Blackjack Pays ${payoutLabel}`,
        value: bjAdj,
        description: bjAdj > 0 ? 'Lower payout favors house' : 'Higher payout favors player'
      });
    }

    // DAS
    if (!rules.doubleAfterSplit) {
      components.push({
        label: 'No Double After Split',
        value: 0.14,
        description: 'Limits player options after splits'
      });
    } else {
      components.push({
        label: 'Double After Split Allowed',
        value: 0,
        description: 'Included in base edge'
      });
    }

    // Late surrender
    if (rules.lateSurrender) {
      components.push({
        label: 'Late Surrender',
        value: -0.08,
        description: 'Player can surrender before dealer checks'
      });
    }

    // Resplit aces
    if (rules.canResplitAces) {
      components.push({
        label: 'Can Resplit Aces',
        value: -0.08,
        description: 'More favorable splitting options'
      });
    }

    // Hit split aces
    if (rules.canHitSplitAces) {
      components.push({
        label: 'Can Hit Split Aces',
        value: -0.14,
        description: 'Significantly improves split aces'
      });
    }

    // Double restrictions
    const doubleAdj = this.doubleRestrictionAdjustment(rules.doubleOn);
    if (doubleAdj !== 0) {
      const label = rules.doubleOn === 'any' ? 'Double on Any' :
                    rules.doubleOn === '9-11' ? 'Double on 9-11 Only' :
                    'Double on 10-11 Only';
      components.push({
        label,
        value: doubleAdj,
        description: doubleAdj > 0 ? 'Limits player double down options' : 'Full flexibility'
      });
    }

    // Max split hands (maxSplits + 1 = total hands)
    const totalHands = rules.maxSplits + 1;
    const splitAdj = this.maxSplitHandsAdjustment(totalHands);
    if (splitAdj !== 0) {
      components.push({
        label: `Max ${totalHands} Split Hands`,
        value: splitAdj,
        description: splitAdj > 0 ? 'Limits splitting opportunities' : 'More splitting flexibility'
      });
    }

    return components;
  }

  /**
   * Deck count adjustment (relative to 6 decks)
   */
  private static deckCountAdjustment(deckCount: number): number {
    // Formula: (deckCount - 6) * 0.05% per deck
    // 1 deck: -0.25%, 2 decks: -0.20%, 4 decks: -0.10%, 6 decks: 0%, 8 decks: +0.10%
    const adjustment = (deckCount - 6) * 0.05;
    return Math.round(adjustment * 100) / 100;
  }

  /**
   * Blackjack payout adjustment (relative to 3:2)
   */
  private static blackjackPayoutAdjustment(payout: number): number {
    // 3:2 (1.5): 0%
    // 6:5 (1.2): +1.39%
    // 2:1 (2.0): -2.27%
    if (payout === 1.5) return 0; // 3:2 standard
    if (payout === 1.2) return 1.39; // 6:5 terrible for player
    if (payout === 2.0) return -2.27; // 2:1 great for player

    // Linear interpolation for other values
    if (payout < 1.5) {
      // Between 6:5 and 3:2
      return ((1.5 - payout) / (1.5 - 1.2)) * 1.39;
    } else {
      // Between 3:2 and 2:1
      return -((payout - 1.5) / (2.0 - 1.5)) * 2.27;
    }
  }

  /**
   * Double restriction adjustment (relative to 'any')
   */
  private static doubleRestrictionAdjustment(doubleOn: string): number {
    if (doubleOn === 'any') return 0;
    if (doubleOn === '9-11') return 0.09; // ~0.09% loss
    if (doubleOn === '10-11') return 0.18; // ~0.18% loss
    return 0;
  }

  /**
   * Max split hands adjustment (relative to 4 hands)
   */
  private static maxSplitHandsAdjustment(maxHands: number): number {
    // 4 hands (3 splits): 0%
    // 2 hands (1 split): +0.05%
    // 3 hands (2 splits): +0.02%
    if (maxHands >= 4) return 0;
    if (maxHands === 2) return 0.05;
    if (maxHands === 3) return 0.02;
    return 0;
  }

  /**
   * Convert house edge to player advantage
   * (just negates the value for display purposes)
   */
  static getPlayerAdvantage(rules: GameRules): number {
    return -this.calculateHouseEdge(rules);
  }
}
