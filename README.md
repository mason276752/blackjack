# Blackjack Game

A sophisticated web-based blackjack simulator with AI auto-play, card counting, and comprehensive rule customization. Built with React, TypeScript, and Vite.

## Features

### Core Gameplay
- **Full Blackjack Implementation**: Standard blackjack gameplay with hit, stand, double down, split, and surrender options
- **Customizable Rules**: Extensive rule configuration including deck count, dealer behavior, payout ratios, and more
- **Multiple Rule Presets**: Quick setup with Las Vegas Strip, Atlantic City, European, and other regional variations
- **Realistic Dealer AI**: Simulates authentic dealer behavior with configurable hit/stand rules

### Card Counting
- **Multiple Counting Systems**:
  - Hi-Lo (default, balanced system)
  - KO (unbalanced knock-out)
  - Hi-Opt I & II (advanced systems)
  - Omega II (multi-level system)
- **Real-Time Count Tracking**: Running count and true count display with remaining deck calculation
- **Visual Indicators**: Color-coded count display showing favorable/unfavorable situations

### AI Auto-Play
- **Intelligent Decision Making**: AI uses basic strategy tables for optimal play decisions
- **Dynamic Bet Spreading**: Practical 1-12 unit bet spread based on true count
- **Adjustable Speed**: Configurable game speed from 50ms to 2000ms
- **Live Decision Display**: See AI's reasoning for each action in real-time
- **Statistics Tracking**: Monitor rounds played, decisions made, and average bet size
- **Recovery Mechanisms**: Automatic stuck detection and retry functionality

### Strategy Assistant
- **Interactive Strategy Tables**:
  - Hard totals (5-20 vs dealer 2-A)
  - Soft totals (A-2 through A-9 vs dealer 2-A)
  - Pair splitting (2-2 through A-A vs dealer 2-A)
- **Visual Highlighting**: Current hand situation highlighted on strategy tables
- **Action Hints**: Color-coded recommendations (hit, stand, double, split, surrender)

### User Interface
- **Three-Column Layout**: Strategy tables (left), game area (center), rules panel (right)
- **Responsive Design**: Optimized for desktop and tablet viewing
- **Bilingual Support**: Full English and Traditional Chinese (繁體中文) localization
- **Card Sprites**: Visual card representation with suit and rank display
- **Statistics Dashboard**: Track bankroll, hands played, win rate, and more

## Tech Stack

- **React 18.2**: Modern React with hooks and context
- **TypeScript 5.2**: Full type safety throughout the codebase
- **Vite 5.2**: Fast development and optimized production builds
- **i18next**: Internationalization with language detection
- **ESLint**: Code quality and consistency

## Project Structure

```
src/
├── components/
│   ├── ai/              # AI control panel and UI
│   ├── common/          # Reusable components (language switcher, etc.)
│   ├── counting/        # Card counting displays and selectors
│   ├── game/            # Core game UI (board, cards, controls)
│   ├── layout/          # Layout components (header, grid)
│   ├── settings/        # Rule configuration UI
│   ├── statistics/      # Stats displays
│   └── strategy/        # Strategy table components
├── context/
│   ├── GameContext.tsx  # Global game state provider
│   ├── gameReducer.ts   # State management logic
│   └── gameActions.ts   # Action dispatchers
├── hooks/
│   ├── useAIPlayer.ts   # AI game loop orchestration
│   ├── useGameLogic.ts  # Core game logic (hit, stand, etc.)
│   ├── useInterval.ts   # Robust interval hook
│   └── useBreakpoint.ts # Responsive design utilities
├── lib/
│   ├── ai/              # AI player logic and decision making
│   ├── counting/        # Card counting implementations
│   ├── dealer/          # Dealer AI logic
│   ├── deck/            # Card and shoe management
│   ├── hand/            # Hand evaluation logic
│   ├── rules/           # Payout and rule calculations
│   └── strategy/        # Basic strategy tables
├── i18n/
│   ├── locales/         # Translation files (en, zh-TW)
│   └── config.ts        # i18n configuration
├── types/               # TypeScript type definitions
└── constants/           # Game constants and defaults
```

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd blackjack

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

### Manual Play

1. **Configure Rules** (optional): Click the gear icon to customize game rules or select a preset
2. **Select Counting System** (optional): Choose your preferred card counting system from the header
3. **Place Bet**: Use chip buttons to place your bet
4. **Deal Cards**: Click "Deal Cards" to start the round
5. **Make Decisions**: Use action buttons (Hit, Stand, Double, Split, Surrender) based on your strategy
6. **View Strategy Hints**: Check the strategy tables on the left for optimal play recommendations
7. **Track Count**: Monitor the running count and true count in the header

### AI Auto-Play

1. **Start AI**: Click the "Play" button (▶) in the AI Control Panel
2. **Adjust Speed**: Use the slider to control game speed (50-2000ms)
3. **Monitor Decisions**: Watch the AI's reasoning and statistics in real-time
4. **Pause/Resume**: Click "Pause" (⏸) to pause, then "Play" to resume
5. **Stop AI**: Click "Stop" (⏹) to completely stop and reset AI statistics
6. **Retry on Error**: If AI gets stuck, click the "Retry" button in the error display

## Game Rules

### Default Configuration
- **Decks**: 6 decks
- **Dealer**: Stands on soft 17
- **Blackjack Payout**: 3:2
- **Double**: Any two cards
- **Double After Split**: Allowed
- **Resplit**: Up to 3 times (4 hands total)
- **Resplit Aces**: Not allowed
- **Hit Split Aces**: Not allowed
- **Late Surrender**: Allowed
- **Insurance**: Available when dealer shows Ace
- **Penetration**: 75% (reshuffle at 1.5 decks remaining)

### Rule Customization
All rules can be customized through the settings panel:
- Deck count (1-8 decks)
- Dealer behavior (hit/stand on soft 17)
- Blackjack payout ratio (6:5, 3:2, 2:1)
- Double down restrictions
- Split/resplit rules
- Insurance availability
- Surrender options

## Card Counting Systems

### Hi-Lo (Recommended for Beginners)
- Low cards (2-6): +1
- Neutral (7-9): 0
- High cards (10-A): -1
- Balanced system, requires true count conversion

### KO (Knock-Out)
- Low cards (2-7): +1
- Neutral (8-9): 0
- High cards (10-A): -1
- Unbalanced system, no true count needed

### Hi-Opt I
- Low cards (3-6): +1
- Neutral (2, 7-9, A): 0
- High cards (10-K): -1
- Advanced balanced system

### Hi-Opt II
- Low cards (2, 3, 6, 7): +1
- Mid cards (4, 5): +2
- Neutral (8, 9, A): 0
- High cards (10-K): -2
- Multi-level balanced system

### Omega II
- Most complex multi-level system
- Requires side count of Aces
- Highest theoretical win rate

## AI Bet Spreading Strategy

The AI uses a practical bet spread based on true count:

| True Count | Bet Units | Example ($10 min) |
|------------|-----------|-------------------|
| ≤ 0        | 1 unit    | $10              |
| +1         | 2 units   | $20              |
| +2         | 4 units   | $40              |
| +3         | 8 units   | $80              |
| ≥ +4       | 12 units  | $120             |

This 1-12 spread balances profitability with camouflage, matching real-world card counting practice.

## Performance Considerations

- AI minimum speed enforced at 50ms to prevent performance issues
- Automatic shoe reshuffle at configurable penetration level
- Optimized re-renders with React.memo and useMemo
- Efficient card sprite rendering

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Troubleshooting

### AI Stops Playing
- The AI has built-in stuck detection (10-second timeout)
- If detected, an error message will appear with a "Retry" button
- Click "Stop" then "Play" to restart if issues persist

### Statistics Not Updating
- Ensure you're not in betting phase (stats update after hand resolution)
- Check browser console for any errors

### Strategy Tables Not Highlighting
- Verify you're in player_turn phase
- Check that current hand has valid cards

## Contributing

This is a personal project, but suggestions and feedback are welcome.

## License

MIT License - See LICENSE file for details

## Acknowledgments

- Basic strategy tables based on mathematical analysis by Edward Thorp
- Card counting systems from "Beat the Dealer" and other blackjack literature
- UI design inspired by modern casino gaming interfaces
