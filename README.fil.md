# Blackjack Game

**[English](./README.en.md) | [繁體中文](./README.md) | [한국어](./README.ko.md) | Filipino**

---

Isang sopistikadong web-based blackjack simulator na may AI auto-play, maraming card counting systems, strategy deviation hints, at komprehensibong rule customization. Ginawa gamit ang React, TypeScript, at Vite.

## Live Demo
<img width="1903" height="905" alt="image" src="https://github.com/user-attachments/assets/b3d2b761-58fa-4161-85db-3ff8de65ba46" />

🎮 **[Maglaro Ngayon](https://mason276752.github.io/blackjack/)**

## Mga Feature

### Core Gameplay
- **Kumpletong Blackjack Implementation**: Standard na blackjack gameplay na may hit, stand, double down, split, at surrender options
- **Customizable Rules**: Malawak na rule configuration kasama ang deck count, dealer behavior, payout ratios, at iba pa
- **Multiple Rule Presets**: Mabilis na setup gamit ang Las Vegas Strip, Atlantic City, European, at iba pang regional variations
- **Realistic Dealer AI**: Sumusunod sa tunay na dealer behavior na may configurable hit/stand rules
- **Insurance Feature**: Available kapag nagpakita ang dealer ng Ace, manual o automated na desisyon

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

**Hard-Locked System Pairing**: Bawat counting system ay eksklusibong naka-pair sa dedicated strategy para sa optimal accuracy

### Strategy Deviation System
- **Real-Time Deviation Hints**: Nagpapakita ng strategy deviations batay sa true count/running count
- **Index Plays Panel**: Nagpapakita ng kasalukuyang applicable na strategy deviations (hal. "16 vs 10 Stand at TC+0")
- **Intelligent Decision Engine**: Awtomatikong nag-aaply ang AI ng system-specific strategy deviations
- **Visual Guidance**: Color-coded deviation suggestions (hit, stand, double, split, surrender)

### AI Auto-Play
- **Intelligent Decision Making**: Gumagamit ang AI ng basic strategy tables + strategy deviations para sa optimal play decisions
- **Dynamic Bet Spreading**: Praktikal na 1-12 unit bet spread batay sa true count
- **Adjustable Speed**: Configurable game speed mula 50ms hanggang 2000ms
- **Live Decision Display**: Tingnan ang reasoning ng AI para sa bawat action nang real-time
- **Statistics Tracking**: Subaybayan ang rounds played, decisions made, at average bet size
- **Recovery Mechanisms**: Automatic stuck detection at retry functionality

### Strategy Assistant
- **Interactive Strategy Tables**:
  - Hard totals (5-20 vs dealer 2-A)
  - Soft totals (A-2 hanggang A-9 vs dealer 2-A)
  - Pair splitting (2-2 hanggang A-A vs dealer 2-A)
- **Visual Highlighting**: Naka-highlight ang kasalukuyang hand situation sa strategy tables
- **Action Hints**: Color-coded recommendations (hit, stand, double, split, surrender)
- **Manual Tab Control**: Hindi awtomatikong nag-switch ang Hard/Soft/Pairs tabs, kontrolado ng user

### User Interface
- **Three-Column Layout**: Strategy tables (kaliwang 520px), game area (gitna), rules panel (kanang 400px)
- **Responsive Design**: Optimized para sa desktop at tablet viewing
- **Four-Language Support**: Kumpletong English, Traditional Chinese, Korean, at Filipino localization
- **Card Sprites**: Visual card representation na may suit at rank display
- **Statistics Dashboard**: Subaybayan ang bankroll, hands played, win rate, at iba pa

## Tech Stack

- **React 18.2**: Modernong React na may hooks at context
- **TypeScript 5.2**: Kumpletong type safety sa buong codebase
- **Vite 5.2**: Mabilis na development at optimized production builds
- **i18next**: Internationalization na may language detection
- **ESLint**: Code quality at consistency

## Pagsisimula

### Prerequisites
- Node.js 16+
- npm o yarn

### Installation

```bash
# I-clone ang repository
git clone https://github.com/mason276752/blackjack.git
cd blackjack

# I-install ang dependencies
npm install

# Simulan ang development server
npm run dev
```

Available ang application sa `http://localhost:5173`

### Build para sa Production

```bash
npm run build
```

### Preview ng Production Build

```bash
npm run preview
```

### Magpatakbo ng Tests

```bash
npm test
```

## Paggamit

### Manual Play

1. **Configure Rules** (optional): I-click ang gear icon para i-customize ang game rules o pumili ng preset
2. **Pumili ng Counting System** (optional): Pumili ng preferred card counting system mula sa header
3. **Maglagay ng Bet**: Gamitin ang chip buttons para maglagay ng bet
4. **Mag-deal ng Cards**: I-click ang "Deal Cards" para simulan ang round
5. **Gumawa ng Decisions**: Gamitin ang action buttons (Hit, Stand, Double, Split, Surrender) batay sa strategy
6. **Tingnan ang Strategy Hints**: Tignan ang strategy tables sa kaliwa para sa optimal play recommendations
7. **Subaybayan ang Count**: Bantayan ang running count at true count sa header
8. **Strategy Deviations**: Kapag umabot sa threshold ang count, magpapakita ang center hint box ng deviation suggestions

### AI Auto-Play

1. **Simulan ang AI**: I-click ang "Play" button (▶) sa AI Control Panel
2. **Adjust Speed**: Gamitin ang slider para kontrolin ang game speed (50-2000ms)
3. **Bantayan ang Decisions**: Panoorin ang reasoning at statistics ng AI nang real-time
4. **Pause/Resume**: I-click ang "Pause" (⏸) para mag-pause, pagkatapos "Play" para mag-resume
5. **Itigil ang AI**: I-click ang "Stop" (⏹) para ganap na ihinto at i-reset ang AI statistics
6. **Retry sa Error**: Kung nag-stuck ang AI, i-click ang "Retry" button sa error display

## Game Rules

### Default Configuration
- **Decks**: 6 decks
- **Dealer**: Tumitigil sa soft 17 (S17)
- **Blackjack Payout**: 3:2
- **Double**: Anumang dalawang cards
- **Double After Split**: Pinapayagan
- **Resplit**: Hanggang 3 beses (4 hands total)
- **Resplit Aces**: Hindi pinapayagan
- **Hit Split Aces**: Hindi pinapayagan
- **Late Surrender**: Pinapayagan
- **Insurance**: Available kapag nagpapakita ang dealer ng Ace
- **Penetration**: 75% (reshuffle sa 1.5 decks remaining)
- **Starting Balance**: $25,000
- **Minimum Bet**: $25
- **Maximum Bet**: $5,000

## Card Counting Systems at Strategy Deviations

### Hi-Lo + Illustrious 18 (Inirerekomenda para sa Beginners)
**Card Values**:
- **Low cards (2-6)**: +1
- **Neutral (7-9)**: 0
- **High cards (10-A)**: -1

**System Characteristics**:
- **Type**: Balanced system, kailangan ng true count conversion
- **Advantages**: Madaling matutunan, magandang effectiveness
- **Betting Correlation**: 0.97
- **Playing Efficiency**: 0.51

**Strategy Deviations**: Illustrious 18 (18 key deviations)
- Insurance: TC >= +3
- 16 vs 10 Surrender: TC >= 0
- 15 vs 10 Stand: TC >= +4
- ... (18 total deviations)

### KO + KO Preferred (Walang True Count Conversion)
**Card Values**:
- **Low cards (2-7)**: +1
- **Neutral (8-9)**: 0
- **High cards (10-A)**: -1

**System Characteristics**:
- **Type**: Unbalanced system, walang kailangang true count
- **Advantages**: Mas simple kaysa Hi-Lo, hindi kailangan mag-track ng remaining decks
- **Betting Correlation**: 0.98
- **Playing Efficiency**: 0.55

**Strategy Deviations**: KO Preferred (14 optimized deviations)
- Insurance: RC >= +3
- 16 vs 10 Stand: Key Count (-4) o mas mataas
- 12 vs 4/5/6 Hit: IRC (-20) o mas mababa
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
- **Advantages**: Pinakamataas na theoretical accuracy
- **Disadvantages**: Mas kumplikado, kailangan ng mas maraming practice
- **Betting Correlation**: 0.99
- **Playing Efficiency**: 0.67

**Strategy Deviations**: Omega II Matrix (17 advanced indices)
- Insurance: TC >= +6 (halos 2x ng Hi-Lo)
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
- **Advantages**: Magandang balanse ng precision at complexity
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
- **Advantages**: 22 deviations na nagbibigay ng comprehensive coverage
- **Betting Correlation**: 0.98
- **Playing Efficiency**: 0.60

**Strategy Deviations**: Catch 22 (22 strategic deviations)
- Insurance: TC >= +3
- 16 vs 10 Stand: TC >= 0
- Soft 19 vs 5/6 Double: TC >= +2/+1
- 8 vs 5/6 Double: TC >= +3
- ... (22 total deviations)

## 🌍 Multilingual Support (i18n)

### Supported Languages
- **English** (Ingles)
- **繁體中文** (Traditional Chinese)
- **한국어** (Korean)
- **Filipino**

### Technical Implementation
- **i18next**: Kumpletong internationalization framework
- **Language Detection**: Automatic browser language detection
- **Persistence**: Naka-save ang language selection sa localStorage
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

### Mag-switch ng Language
Gamitin ang language switcher sa kanang itaas ng header:
- 🇬🇧 English
- 🇹🇼 繁體中文
- 🇰🇷 한국어
- 🇵🇭 Filipino

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Troubleshooting

### Tumitigil ang AI
- May built-in stuck detection ang AI (10-second timeout)
- Kapag na-detect, lalabas ang error message na may "Retry" button
- I-click ang "Stop" pagkatapos "Play" para mag-restart kung patuloy ang problema

### Hindi Nag-uupdate ang Statistics
- Siguraduhing hindi nasa betting phase (nag-uupdate ang stats pagkatapos ng hand resolution)
- Tingnan ang browser console para sa mga error

### Hindi Nag-hihighlight ang Strategy Tables
- I-verify na nasa player_turn phase
- Tingnan na may valid cards ang kasalukuyang hand

### Hindi Maka-decline ng Insurance
- Siguraduhing na-click ang "Decline" button (✕ button)
- Pagkatapos mag-decline, nagiging -1 ang `insuranceBet` (declined state)

## Development at Deployment

### GitHub Actions CI/CD
Gumagamit ang project ng GitHub Actions para sa automated deployment sa GitHub Pages:
- Awtomatikong tumatakbo ang test suite
- Binubuild ang production version
- Dine-deploy sa GitHub Pages

### Local Development
```bash
# Development mode (hot reload)
npm run dev

# Type checking
npm run type-check

# Lint checking
npm run lint

# Magpatakbo ng tests
npm test

# Production build
npm run build
```

## Kontribusyon

Ito ay personal project, pero welcome ang suggestions at feedback.

## License

MIT License - Tingnan ang LICENSE file para sa detalye

## Acknowledgments

- Basic strategy tables batay sa mathematical analysis ni Edward Thorp
- Card counting systems mula sa "Beat the Dealer" at iba pang blackjack literature
- Illustrious 18 na ginawa ni Don Schlesinger
- KO system mula sa "Knock-Out Blackjack"
- Omega II na ginawa ni Bryce Carlson
- Zen Count na ginawa ni Arnold Snyder
- UI design na inspired ng modern casino gaming interfaces
- Card sprites mula sa public resources

## Version History

### v2.0.0 (Kasalukuyan)
- ✅ 5 card counting systems (Hi-Lo, KO, Omega II, Zen Count, CAC2)
- ✅ System-strategy hard-locking (enforced pairing)
- ✅ Real-time strategy deviation hints
- ✅ Index Plays panel
- ✅ Four-language support (English, Traditional Chinese, Korean, Filipino)
- ✅ Strategy table manual tab control (inalis ang auto-switching)
- ✅ Dealer hand width optimization (consistent sa player)
- ✅ Insurance decline fix (-1 state flag)
- ✅ Strategy hint height increase (170px)

### v1.0.0
- ✅ Kumpletong blackjack game implementation
- ✅ AI auto-play system
- ✅ 3 card counting systems (Hi-Lo, KO, Omega II)
- ✅ Interactive strategy tables
- ✅ Bilingual support (Traditional Chinese, English)
- ✅ Insurance feature
- ✅ Player-unfavorable rounding rules
- ✅ GitHub Pages automatic deployment
- ✅ Comprehensive test coverage (104 tests)

---

**Developer**: Mason
**Project Link**: [GitHub Repository](https://github.com/mason276752/blackjack)
**Live Demo**: [Maglaro Ngayon](https://mason276752.github.io/blackjack/)
