# CLAUDE.md - AI Development Documentation

This document provides context for AI assistants (Claude Code, Cursor, etc.) working on this blackjack project.

## Project Overview

A sophisticated React/TypeScript blackjack simulator with:
- Full blackjack gameplay with all standard actions
- AI auto-play with basic strategy and card counting
- Multiple card counting systems (Hi-Lo, KO, Hi-Opt I/II, Omega II)
- Comprehensive rule customization
- Interactive strategy tables
- Bilingual UI (English/Traditional Chinese)

**Tech Stack**: React 18.2, TypeScript 5.2, Vite 5.2, i18next for i18n

## Architecture Overview

### State Management Pattern

The app uses **React Context + useReducer** for global state:

```typescript
// GameContext provides:
- state: GameState (all game data)
- dispatch: React.Dispatch<GameAction> (state updates)
- strategy: BasicStrategy instance (singleton)
- shoe: Shoe instance (card deck)
- dealerAI: DealerAI instance (dealer logic)
```

**Key Rule**: All state modifications MUST go through the reducer via `dispatch()`. Never mutate state directly.

### Game Phase Flow

```
betting → dealing → player_turn → dealer_turn → resolution
```

**Critical**: Actions are only valid in specific phases. Always check `state.phase` before enabling UI controls.

### Component Hierarchy

```
App
└── GameContext.Provider
    └── GameLayout
        ├── HeaderCard (stats, counting, language)
        ├── StrategyPanel (left sidebar)
        ├── GameBoard (center)
        │   ├── DealerHand
        │   ├── PlayerHand (multiple for splits)
        │   ├── ActionButtons
        │   ├── BettingControls
        │   ├── AIControlPanel
        │   └── Message display
        └── RulesPanel (right sidebar)
```

## Critical Implementation Details

### 1. AI Auto-Play Architecture

**Location**: [src/hooks/useAIPlayer.ts](src/hooks/useAIPlayer.ts)

**Architecture**: State machine with 9 explicit phases

```typescript
type AIPhase =
  | 'idle'
  | 'waiting_bet'
  | 'placing_bet'
  | 'dealing_cards'
  | 'waiting_deal_complete'
  | 'deciding_action'
  | 'waiting_dealer'
  | 'waiting_resolution'
  | 'starting_next_round';
```

**Key Design Decisions**:

1. **Single Interval, No setTimeout Chain**
   - Uses custom `useInterval` hook ([src/hooks/useInterval.ts](src/hooks/useInterval.ts))
   - Prevents stale closures with callback ref pattern
   - All timing controlled by one source of truth

2. **Explicit Phase Tracking**
   - AI phase tracked separately from game phase
   - Detects phase transitions explicitly
   - Resets iteration counter on every transition

3. **Recovery Mechanisms**
   - **Stuck Detection**: 10-second timeout per phase
   - **Infinite Loop Protection**: 50 iteration maximum per phase
   - **Immediate Stop**: Synchronous stop via `aiStateRef` (no async race conditions)
   - **Error UI**: User-facing retry button

4. **Why This Works (vs. Previous Implementations)**
   - Old approach: setTimeout chain + aggressive dependency array
   - Problem: Stale closures, race conditions, timer corruption
   - New approach: Polling state machine + explicit transitions
   - Result: Reliable continuous play tested to 50+ rounds

**When Modifying AI Logic**:
- Always use `useCallback` for phase handlers
- Never use setTimeout directly - extend state machine instead
- Test extensively with fast speed (50ms) to catch timing issues
- Check `state.activeHandIndex` bounds before accessing `state.hands[index]`

### 2. Card Counting Implementation

**Location**: [src/lib/counting/CountTracker.ts](src/lib/counting/CountTracker.ts)

Each counting system has:
```typescript
{
  id: string;
  name: string;
  values: Record<Rank, number>;  // Card values
  isBalanced: boolean;           // Requires true count?
  description: string;
}
```

**True Count Calculation**:
```typescript
trueCount = runningCount / remainingDecks
```

Only meaningful for balanced systems (Hi-Lo, Hi-Opt I/II, Omega II). KO uses running count directly.

**When Adding New Counting System**:
1. Add to `COUNTING_SYSTEMS` array in CountTracker.ts
2. Add translations to i18n files (en/count.json, zh-TW/count.json)
3. Update CountingSystemSelector if special UI needed

### 3. Basic Strategy Tables

**Location**: [src/lib/strategy/StrategyTableData.ts](src/lib/strategy/StrategyTableData.ts)

**Action Codes**:
- `H` - Hit
- `S` - Stand
- `D` - Double (if available)
- `DH` - Double or Hit (fallback)
- `DS` - Double or Stand (fallback)
- `SP` - Split
- `SU` - Surrender

**Three Tables**:
1. **Hard Totals**: 5-20 vs dealer 2-A
2. **Soft Totals**: A-2 through A-9 vs dealer 2-A
3. **Pairs**: 2-2 through A-A vs dealer 2-A

**Critical**: BasicStrategy.getOptimalAction() expects:
```typescript
getOptimalAction(
  cards: Card[],          // Full Card objects
  dealerUpCard: Card,     // Full Card object (not just rank!)
  canDouble: boolean,
  canSplit: boolean,
  canSurrender: boolean
)
```

**Never** pass just rank strings - always pass full Card objects.

### 4. Reducer Pattern

**Location**: [src/context/gameReducer.ts](src/context/gameReducer.ts)

**Key Actions**:
- `PLACE_BET` - Sets currentBet, validates balance
- `DEAL_CARDS` - Deals initial 2 cards, checks for blackjacks
- `HIT` - Adds card to active hand, checks for bust
- `STAND` - Moves to next hand or dealer turn
- `DOUBLE_DOWN` - Doubles bet, hits once, stands
- `SPLIT` - Creates two hands from pair
- `SURRENDER` - Returns half bet, ends hand
- `RESOLVE_HANDS` - Calculates payouts, updates stats

**Immutability**: All state updates create new objects/arrays. Never use `.push()`, `.splice()`, etc.

**When Adding New Action**:
1. Define action type in gameActions.ts
2. Add case to reducer switch statement
3. Create action dispatcher in gameActions.ts
4. Update GameAction union type

### 5. Internationalization (i18n)

**Location**: [src/i18n/](src/i18n/)

**Namespaces**:
- `common` - Shared UI text
- `game` - Game-specific terms
- `actions` - Action button labels
- `strategy` - Strategy table labels
- `stats` - Statistics labels
- `count` - Counting system names
- `hand` - Hand status text
- `betting` - Betting UI text
- `rules` - Rule configuration text
- `ai` - AI control panel text

**Usage Pattern**:
```typescript
const { t } = useTranslation('namespace');
<button>{t('keyName')}</button>
```

**When Adding New Text**:
1. Add key to both `locales/en/<namespace>.json` and `locales/zh-TW/<namespace>.json`
2. Use descriptive keys (e.g., `dealCards` not `btn1`)
3. Keep translations in sync

### 6. Game Logic Hook

**Location**: [src/hooks/useGameLogic.ts](src/hooks/useGameLogic.ts)

Provides all game actions:
```typescript
const {
  dealCards,
  hit,
  stand,
  doubleDown,
  split,
  surrender,
  newRound
} = useGameLogic();
```

**Timing Adjustments** (user requested faster dealer):
- Initial dealer reveal: 500ms
- Per-card dealing: 500ms
- Resolution delay: 300ms

**When Modifying Timing**:
- Balance responsiveness vs. visual clarity
- Test at AI max speed (50ms) to ensure no race conditions
- Consider user feedback on "feels too fast/slow"

## Common Development Scenarios

### Adding a New Rule Option

1. **Add to GameRules type** ([src/types/game.types.ts](src/types/game.types.ts))
2. **Update GAME_DEFAULTS** ([src/constants/gameDefaults.ts](src/constants/gameDefaults.ts))
3. **Add UI control** in CustomRulesForm.tsx
4. **Handle in reducer** if affects gameplay logic
5. **Update preset configurations** if relevant
6. **Add translations** for new rule label

### Modifying AI Behavior

1. **Bet spreading**: Modify `AIPlayer.calculateBet()` ([src/lib/ai/AIPlayer.ts](src/lib/ai/AIPlayer.ts))
2. **Decision logic**: Modify `AIPlayer.decideAction()` (uses BasicStrategy)
3. **Phase handling**: Modify phase handlers in useAIPlayer.ts
4. **Always test** with 20+ rounds at various speeds

### Adding a New Card Action

1. **Add reducer case** (e.g., `INSURANCE`)
2. **Create action dispatcher** in gameActions.ts
3. **Add UI button** in ActionButtons.tsx with proper `canInsure` logic
4. **Update BasicStrategy** if strategy table changes
5. **Add i18n translations**

### Debugging AI Stuck Issues

**Check these in order**:

1. **Console logs**: Development mode has `[AI]` prefixed logs
2. **Phase mismatch**: Is `aiState.aiPhase` stuck while `state.phase` changed?
3. **Iteration count**: Is it hitting 50 max? (infinite loop protection triggered)
4. **Timeout**: Has phase elapsed >10s? (stuck detection triggered)
5. **Hand validation**: Check `state.activeHandIndex` vs `state.hands.length`

**Common Causes**:
- Phase handler returning early without transition
- Missing `transitionToPhase()` call after action
- Race condition between reducer update and AI check

### Performance Optimization

**Current Optimizations**:
- Strategy tables use React.memo
- BasicStrategy instance is singleton (don't recreate)
- Card sprites preloaded
- Statistics calculated in reducer (not component)

**If Performance Issues**:
1. Check for unnecessary re-renders (React DevTools Profiler)
2. Verify useCallback/useMemo dependencies are correct
3. Consider virtualizing long lists (though not needed currently)
4. Profile with fast AI speed (50ms) for stress testing

## Testing Guidelines

### Manual Testing Checklist

**Basic Gameplay**:
- [ ] Place bet, deal, hit, stand, resolve correctly
- [ ] Double down (with/without sufficient balance)
- [ ] Split pairs (including resplit limits)
- [ ] Surrender (when allowed)
- [ ] Insurance on dealer Ace

**AI Auto-Play**:
- [ ] Runs 20+ consecutive rounds without stopping
- [ ] Handles splits correctly (multiple hands)
- [ ] Handles immediate blackjacks (player/dealer/both)
- [ ] Pauses and resumes mid-round
- [ ] Stops cleanly with "Stop" button
- [ ] Speed adjustment (50ms, 500ms, 2000ms)
- [ ] Recovery from stuck state (if triggered)

**Card Counting**:
- [ ] Running count updates on every card dealt
- [ ] True count calculation correct (for balanced systems)
- [ ] System switching resets count
- [ ] Count persists across rounds (until reshuffle)

**Rule Variations**:
- [ ] Dealer hits/stands on soft 17
- [ ] Different blackjack payouts (6:5, 3:2, 2:1)
- [ ] Double restrictions (any, 9-11, 10-11)
- [ ] Split/resplit rules enforced
- [ ] Surrender availability

**Internationalization**:
- [ ] All UI text renders in English
- [ ] All UI text renders in Traditional Chinese
- [ ] Language persists on refresh
- [ ] No missing translation keys

### Edge Cases to Test

1. **Balance edge cases**:
   - Bet entire balance
   - Double with exact balance remaining
   - Split with insufficient balance for second hand

2. **Split edge cases**:
   - Split to max hands (4)
   - Split Aces with hit restriction
   - Resplit same rank multiple times

3. **Shoe penetration**:
   - Verify reshuffle at configured penetration
   - Count resets after reshuffle
   - AI continues playing through reshuffle

4. **Phase transitions**:
   - Immediate blackjack (player)
   - Immediate blackjack (dealer)
   - Both blackjack (push)
   - All hands bust before dealer turn

## Code Style Guidelines

### TypeScript

- Use explicit types for function parameters and return values
- Prefer interfaces for object shapes, types for unions
- Use `const` by default, `let` only when reassignment needed
- Leverage type inference where obvious

### React

- Functional components only (no class components)
- Use hooks for all logic
- Extract complex logic to custom hooks
- Keep components focused (single responsibility)
- Use React.memo for expensive renders

### Naming Conventions

- Components: PascalCase (e.g., `GameBoard.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useGameLogic.ts`)
- Types/Interfaces: PascalCase (e.g., `GameState`)
- Constants: UPPER_SNAKE_CASE (e.g., `GAME_DEFAULTS`)
- Functions: camelCase (e.g., `calculatePayout`)

### File Organization

- Group by feature/domain, not by file type
- Components in `components/<feature>/`
- Keep related types close to usage
- Shared utilities in `lib/`
- Hooks in `hooks/`

## Known Issues and Limitations

### Current Limitations

1. **Desktop/Tablet Only**: Mobile layout not optimized (narrow screens may have poor UX)
2. **Single Player**: No multiplayer or multiple spots
3. **No Server Backend**: All logic client-side, no persistence
4. **No Sound Effects**: Silent gameplay
5. **No Animations**: Card dealing is instant (setTimeout delays only for pacing)

### Potential Future Enhancements

- **Mobile responsive design**: Collapsible sidebars, vertical layout
- **Sound effects**: Card dealing, win/loss sounds
- **Animations**: Card flip, chip stacking, smooth transitions
- **Persistence**: Save game state, statistics history
- **Advanced stats**: House edge calculator, risk of ruin, Kelly criterion
- **Multiplayer**: Multiple spots, chat, leaderboards
- **Practice mode**: Highlight mistakes, suggest corrections
- **Betting systems**: Martingale, Fibonacci, etc. (educational purposes)

## Deployment

### Build Process

```bash
npm run build
```

Output: `dist/` directory with optimized static files

### Environment Variables

None currently. All configuration is in-app.

### Hosting Recommendations

- **Vercel**: Zero-config, automatic deployments
- **Netlify**: Similar to Vercel
- **GitHub Pages**: Free for public repos
- **CloudFlare Pages**: Fast global CDN

All support static React apps with client-side routing.

## Troubleshooting Development Issues

### Build Errors

**"Cannot find module"**:
- Check import paths (case-sensitive on Linux)
- Verify file exists at specified path
- Check tsconfig.json paths configuration

**"Type errors"**:
- Run `npm run lint` to see all type errors
- Check that types are imported from correct files
- Verify React/TypeScript versions compatible

### Runtime Errors

**"Maximum update depth exceeded"**:
- Check for infinite loops in useEffect
- Verify dependencies array is correct
- Look for state updates that trigger themselves

**"Cannot read property of undefined"**:
- Check array bounds before accessing (e.g., `state.hands[state.activeHandIndex]`)
- Add optional chaining (`?.`) where appropriate
- Validate data before rendering

**AI stops playing**:
- Check browser console for `[AI Recovery]` or `[AI]` logs
- Verify no errors in reducer actions
- Test with slower speed to isolate timing issues
- Use error recovery UI (retry button)

### Hot Reload Issues

**Changes not reflecting**:
- Hard refresh (Cmd/Ctrl + Shift + R)
- Clear Vite cache: `rm -rf node_modules/.vite`
- Restart dev server

## Resources

### Blackjack Strategy References

- **"Beat the Dealer"** by Edward Thorp (card counting origin)
- **"The Theory of Blackjack"** by Peter Griffin (mathematical analysis)
- **Wizard of Odds**: https://wizardofodds.com/games/blackjack/ (rule variations)

### Technical Documentation

- **React Docs**: https://react.dev/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Vite Guide**: https://vitejs.dev/guide/
- **i18next Docs**: https://www.i18next.com/

## Contact and Contributions

This is a personal learning project. Contributions are not actively sought, but feel free to fork and modify for your own purposes.

## License

MIT License - Free to use, modify, and distribute with attribution.

---

**Last Updated**: 2026-02-19

**Tested with**:
- Node 18.x, 20.x
- Chrome 120+, Firefox 120+, Safari 17+

**Known Compatible AI Tools**:
- Claude Code CLI
- GitHub Copilot
- Cursor IDE

When working on this project, always prioritize:
1. Type safety (TypeScript strict mode)
2. State immutability (reducer pattern)
3. Performance (memo, callback, useMemo)
4. User experience (smooth animations, clear feedback)
5. Code readability (clear names, comments where needed)
