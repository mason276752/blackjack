export type HandResult = 'win' | 'lose' | 'push' | 'blackjack' | 'bust' | 'surrender';

export interface SessionStats {
  // Session tracking
  sessionStart: Date;
  handsPlayed: number;

  // Outcomes
  handsWon: number;
  handsLost: number;
  handsPushed: number;
  blackjacks: number;
  busts: number;
  surrenders: number;

  // Financial
  startingBalance: number;
  currentBalance: number;
  totalWagered: number;
  totalWon: number;
  netProfit: number;

  // Split/double tracking
  splitsMade: number;
  doubleDowns: number;
  insuranceTaken: number;

  // Hand types
  hardHands: number;
  softHands: number;
  pairs: number;

  // Counting accuracy (if hints enabled)
  correctPlays: number;
  incorrectPlays: number;
}

export interface CompletedHand {
  playerCards: string;
  dealerCards: string;
  result: HandResult;
  payout: number;
  timestamp: Date;
}
