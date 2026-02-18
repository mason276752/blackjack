import { Card } from '../../types/card.types';
import { CountingSystem } from '../../types/game.types';

export class CountTracker {
  private runningCount: number = 0;
  private system: CountingSystem;

  constructor(system: CountingSystem) {
    this.system = system;
  }

  updateCount(card: Card): void {
    const countValue = this.system.values[card.rank] || 0;
    this.runningCount += countValue;
  }

  getRunningCount(): number {
    return this.runningCount;
  }

  getTrueCount(decksRemaining: number): number {
    if (decksRemaining <= 0) return 0;

    // True count = Running count / Decks remaining
    return Math.round((this.runningCount / decksRemaining) * 10) / 10; // Round to 1 decimal
  }

  reset(): void {
    this.runningCount = 0;
  }

  getSystem(): CountingSystem {
    return this.system;
  }

  setSystem(system: CountingSystem): void {
    this.system = system;
    this.reset(); // Reset count when changing systems
  }
}
