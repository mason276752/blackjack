# Blackjack Game

**English | [繁體中文](./README.md) | [한국어](./README.ko.md) | [Filipino](./README.fil.md)**

---

A sophisticated web-based blackjack simulator with AI auto-play, multiple card counting systems, strategy deviation hints, and comprehensive rule customization. Built with React, TypeScript, and Vite.

## Live Demo

🎮 **[Play Now](https://mason276752.github.io/blackjack/)**

## Features

### Core Gameplay
- **Full Blackjack Implementation**: Standard blackjack gameplay with hit, stand, double down, split, and surrender options
- **Customizable Rules**: Extensive rule configuration including deck count, dealer behavior, payout ratios, and more
- **Multiple Rule Presets**: Quick setup with Las Vegas Strip, Atlantic City, European, and other regional variations
- **Realistic Dealer AI**: Simulates authentic dealer behavior with configurable hit/stand rules
- **Insurance Feature**: Available when dealer shows Ace, manual or automated decision-making

### Card Counting (5 Systems)
- **Hi-Lo** (Balanced, Beginner-Friendly)
  - Paired Strategy: Illustrious 18 (18 key deviations)
  - Betting Correlation: 0.97 | Playing Efficiency: 0.51
- **KO (Knock-Out)** (Unbalanced)
  - Paired Strategy: KO Preferred (14 optimized deviations)
  - Betting Correlation: 0.98 | Playing Efficiency: 0.55
- **Omega II** (Advanced Multi-Level)
  - Paired Strategy: Omega II Matrix (17 advanced indices)
  - Betting Correlation: 0.99 | Playing Efficiency: 0.67
- **Zen Count** (Precision Multi-Level)
  - Paired Strategy: Zen Indices (21 precision indices)
  - Betting Correlation: 0.96 | Playing Efficiency: 0.63
- **CAC2** (Catch And Count 2)
  - Paired Strategy: Catch 22 (22 strategic deviations)
  - Betting Correlation: 0.98 | Playing Efficiency: 0.60

**Hard-Locked System Pairing**: Each counting system is exclusively paired with its dedicated strategy for optimal accuracy

### Strategy Deviation System
- **Real-Time Deviation Hints**: Display strategy deviations based on true count/running count
- **Index Plays Panel**: Shows currently applicable strategy deviations (e.g., "16 vs 10 Stand at TC+0")
- **Intelligent Decision Engine**: AI automatically applies system-specific strategy deviations
- **Visual Guidance**: Color-coded deviation suggestions (hit, stand, double, split, surrender)

### AI Auto-Play
- **Intelligent Decision Making**: AI uses basic strategy tables + strategy deviations for optimal play decisions
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
- **Manual Tab Control**: Hard/Soft/Pairs tabs don't auto-switch, user-controlled

### User Interface
- **Three-Column Layout**: Strategy tables (left 520px), game area (center), rules panel (right 400px)
- **Responsive Design**: Optimized for desktop and tablet viewing
- **Four-Language Support**: Full English, Traditional Chinese, Korean, and Filipino localization
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
│   └── strategy/        # Basic strategy tables & deviation resolver
├── i18n/
│   ├── locales/         # Translation files (en, zh-TW, ko, fil)
│   └── config.ts        # i18n configuration
├── types/               # TypeScript type definitions
└── constants/           # Game constants and defaults
    └── strategies/      # Strategy deviation definitions (Illustrious 18, KO Preferred, etc.)
```

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/mason276752/blackjack.git
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

### Run Tests

```bash
npm test
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
8. **Strategy Deviations**: When count reaches threshold, center hint box shows deviation suggestions

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
- **Dealer**: Stands on soft 17 (S17)
- **Blackjack Payout**: 3:2
- **Double**: Any two cards
- **Double After Split**: Allowed
- **Resplit**: Up to 3 times (4 hands total)
- **Resplit Aces**: Not allowed
- **Hit Split Aces**: Not allowed
- **Late Surrender**: Allowed
- **Insurance**: Available when dealer shows Ace
- **Penetration**: 75% (reshuffle at 1.5 decks remaining)
- **Starting Balance**: $25,000
- **Minimum Bet**: $25
- **Maximum Bet**: $5,000

### Rule Customization
All rules can be customized through the settings panel:
- Deck count (1-8 decks)
- Dealer behavior (hit/stand on soft 17)
- Blackjack payout ratio (6:5, 3:2, 2:1)
- Double down restrictions
- Split/resplit rules
- Insurance availability
- Surrender options

### Monetary Rounding Rules
The game implements **player-unfavorable rounding** to match real casino practices:
- **Costs (player pays)**: Round UP (e.g., insurance on $25 bet costs $13, not $12)
- **Payouts (player receives)**: Round DOWN (e.g., blackjack on $27 bet pays $67, not $67.5)

**Tip**: Use even bet amounts ($50, $100, $200, etc.) to avoid rounding losses.

## Card Counting Systems & Strategy Deviations

### Hi-Lo + Illustrious 18 (Recommended for Beginners)
**Card Values**:
- **Low cards (2-6)**: +1
- **Neutral (7-9)**: 0
- **High cards (10-A)**: -1

**System Characteristics**:
- **Type**: Balanced system, requires true count conversion
- **Advantages**: Easy to learn, good effectiveness
- **Betting Correlation**: 0.97
- **Playing Efficiency**: 0.51

**Strategy Deviations**: Illustrious 18 (18 key deviations)
- Insurance: TC >= +3
- 16 vs 10 Surrender: TC >= 0
- 15 vs 10 Stand: TC >= +4
- ... (18 total deviations)

### KO + KO Preferred (No True Count Conversion)
**Card Values**:
- **Low cards (2-7)**: +1
- **Neutral (8-9)**: 0
- **High cards (10-A)**: -1

**System Characteristics**:
- **Type**: Unbalanced system, no true count needed
- **Advantages**: Simpler than Hi-Lo, no need to track remaining decks
- **Betting Correlation**: 0.98
- **Playing Efficiency**: 0.55

**Strategy Deviations**: KO Preferred (14 optimized deviations)
- Insurance: RC >= +3
- 16 vs 10 Stand: Key Count (-4) or above
- 12 vs 4/5/6 Hit: IRC (-20) or below
- ... (14 total deviations)

### Omega II + Omega II Matrix (Advanced Multi-Level System)
**Card Values**:
- **+2 cards (4, 5)**: +2
- **+1 cards (2, 3, 7)**: +1
- **Neutral (8, 9, A)**: 0
- **-1 card (9)**: -1
- **-2 cards (10, J, Q, K)**: -2

**System Characteristics**:
- **Type**: Balanced multi-level system
- **Advantages**: Highest theoretical accuracy
- **Disadvantages**: More complex, requires more practice
- **Betting Correlation**: 0.99
- **Playing Efficiency**: 0.67

**Strategy Deviations**: Omega II Matrix (17 advanced indices)
- Insurance: TC >= +6 (approx 2x Hi-Lo)
- 16 vs 10 Stand: TC >= 0
- 10 vs 10 Double: TC >= +9
- ... (17 total deviations)

### Zen Count + Zen Indices (Precision Multi-Level System)
**Card Values**:
- **+2 cards (4, 5, 6)**: +2
- **+1 cards (2, 3, 7)**: +1
- **Neutral (8, 9)**: 0
- **-1 card (A)**: -1
- **-2 cards (10, J, Q, K)**: -2

**System Characteristics**:
- **Type**: Balanced multi-level system
- **Advantages**: Well-balanced precision and complexity
- **Betting Correlation**: 0.96
- **Playing Efficiency**: 0.63

**Strategy Deviations**: Zen Indices (21 precision indices)
- Insurance: TC >= +3
- 16 vs 10 Stand: TC >= 0
- 11 vs A Double: TC >= +1
- ... (21 total deviations)

### CAC2 + Catch 22 (Catch And Count 2)
**Card Values**:
- **+2 cards (3, 4, 5)**: +2
- **+1 cards (2, 6, 7)**: +1
- **Neutral (8, 9)**: 0
- **-1 card (A)**: -1
- **-2 cards (10, J, Q, K)**: -2

**System Characteristics**:
- **Type**: Balanced multi-level system
- **Advantages**: 22 deviations provide comprehensive coverage
- **Betting Correlation**: 0.98
- **Playing Efficiency**: 0.60

**Strategy Deviations**: Catch 22 (22 strategic deviations)
- Insurance: TC >= +3
- 16 vs 10 Stand: TC >= 0
- Soft 19 vs 5/6 Double: TC >= +2/+1
- 8 vs 5/6 Double: TC >= +3
- ... (22 total deviations)

## AI Bet Spreading Strategy

The AI uses a practical bet spread based on true count:

| True Count | Bet Units | Example ($25 min) |
|------------|-----------|-------------------|
| ≤ 0        | 1 unit    | $25              |
| +1         | 2 units   | $50              |
| +2         | 4 units   | $100             |
| +3         | 8 units   | $200             |
| ≥ +4       | 12 units  | $300             |

This 1-12 spread balances profitability with camouflage, matching real-world card counting practice.

## 🌍 Multilingual Support (i18n)

### Supported Languages
- **English**
- **繁體中文** (Traditional Chinese)
- **한국어** (Korean)
- **Filipino**

### Technical Implementation
- **i18next**: Full internationalization framework
- **Language Detection**: Automatic browser language detection
- **Persistence**: Language selection stored in localStorage
- **Namespace Separation**:
  - `common`: Shared UI text
  - `game`: Game terminology
  - `actions`: Action buttons
  - `strategy`: Strategy table labels
  - `stats`: Statistics labels
  - `count`: Card counting system names
  - `hand`: Hand status
  - `betting`: Betting UI
  - `rules`: Rule configuration
  - `ai`: AI control panel

### Switch Language
Use the language switcher in the top-right header:
- 🇬🇧 English
- 🇹🇼 繁體中文
- 🇰🇷 한국어
- 🇵🇭 Filipino

### Adding New Languages
1. Create new language folder in `src/i18n/locales/` (e.g., `ja/` for Japanese)
2. Copy existing translation files from `en/` or `zh-TW/`
3. Translate all namespace JSON files
4. Register new language in `src/i18n/config.ts`
5. Update language switcher UI

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

### Cannot Decline Insurance
- Make sure to click "Decline" button (✕ button)
- After declining, `insuranceBet` is set to -1 (declined state)

## Development & Deployment

### GitHub Actions CI/CD
The project uses GitHub Actions for automated deployment to GitHub Pages:
- Automatically runs test suite
- Builds production version
- Deploys to GitHub Pages

### Local Development
```bash
# Development mode (hot reload)
npm run dev

# Type checking
npm run type-check

# Lint checking
npm run lint

# Run tests
npm test

# Production build
npm run build
```

## Contributing

This is a personal project, but suggestions and feedback are welcome.

## License

MIT License - See LICENSE file for details

## Acknowledgments

- Basic strategy tables based on mathematical analysis by Edward Thorp
- Card counting systems from "Beat the Dealer" and other blackjack literature
- Illustrious 18 developed by Don Schlesinger
- KO system from "Knock-Out Blackjack"
- Omega II developed by Bryce Carlson
- Zen Count developed by Arnold Snyder
- UI design inspired by modern casino gaming interfaces
- Card sprites from public resources

## Version History

### v2.0.0 (Current)
- ✅ 5 card counting systems (Hi-Lo, KO, Omega II, Zen Count, CAC2)
- ✅ System-strategy hard-locking (enforced pairing)
- ✅ Real-time strategy deviation hints
- ✅ Index Plays panel
- ✅ Four-language support (English, Traditional Chinese, Korean, Filipino)
- ✅ Strategy table manual tab control (removed auto-switching)
- ✅ Dealer hand width optimization (consistent with player)
- ✅ Insurance decline fix (-1 state flag)
- ✅ Strategy hint height increase (170px)

### v1.0.0
- ✅ Complete blackjack game implementation
- ✅ AI auto-play system
- ✅ 3 card counting systems (Hi-Lo, KO, Omega II)
- ✅ Interactive strategy tables
- ✅ Bilingual support (Traditional Chinese, English)
- ✅ Insurance feature
- ✅ Player-unfavorable rounding rules
- ✅ GitHub Pages automatic deployment
- ✅ Comprehensive test coverage (104 tests)

## Technical Highlights

### State Management
- React Context + useReducer pattern
- Immutable state updates
- Type-safe Actions and State

### AI Implementation
- Basic strategy table-driven decision engine
- True count-driven betting system
- Strategy deviation resolver (StrategyResolver)
- Three-tier stuck detection and recovery mechanisms
- Comprehensive statistics tracking

### Card Counting & Strategy Deviations
- 5 counting systems, each with dedicated strategy set
- Unified `StrategyDeviation` format
- Automatic handling of balanced/unbalanced systems (TC/RC)
- Compile-time enforced system-strategy pairing

### Internationalization
- Full i18next integration
- Language detection and persistence
- Namespace separation (common, game, ai, rules, etc.)
- Four-language full coverage

### Testing
- Jest unit tests
- Payout calculation tests
- Card counting system tests
- AI decision logic tests
- StrategyResolver tests

---

**Developer**: Mason
**Project Link**: [GitHub Repository](https://github.com/mason276752/blackjack)
**Live Demo**: [Play Now](https://mason276752.github.io/blackjack/)
