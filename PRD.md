# Duck Race 🦆🏁 — Product Requirements Document

## Overview

**Duck Race** is a browser-based animated racing game built for the **Scam Center dynasty fantasy football league**. It determines the order in which 12 league members play blackjack at the draft position event on **July 29, 2026 at 9 PM PT**.

The host screen-shares the game during a Messenger video call. Each player's name is assigned to a uniquely colored duck racing across horizontal lanes. The ducks race for ~10–15 seconds with random speed variations—surging, slowing, jockeying for position—until all cross the finish line. The twist: **last place in the duck race plays blackjack first**. The race finish order is reversed to produce the Blackjack Playing Order.

### Design Philosophy

The game should feel like a **party event**, not a utility. It needs to be visually loud and fun enough to hold 12 people's attention on a video call. Think ESPN race graphics meets rubber duck bath time. The audience is fantasy football guys on a Thursday night—lean into the absurdity.

---

## Game Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  SETUP       │────▶│  COUNTDOWN   │────▶│  RACE        │────▶│  RESULTS     │
│  Enter names │     │  3..2..1..   │     │  ~10-15 sec  │     │  Finish +    │
│  up to 12    │     │  QUACK!      │     │  Animated    │     │  BJ Order    │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                                     │
                                                                     ▼
                                                               ┌──────────────┐
                                                               │  RE-RACE     │
                                                               │  Same names  │
                                                               └──────────────┘
```

1. **Setup** → Enter player names, preview duck assignments
2. **Countdown** → Dramatic 3…2…1…QUACK! with visual + audio fanfare
3. **Race** → Animated horizontal race with randomized speeds (~10–15 seconds)
4. **Results** → Finish order displayed, then Blackjack Playing Order (reversed)
5. **Re-Race** → Button to run again with the same names; fresh randomization

---

## Screens

### Screen 1: Setup

**Purpose:** Enter up to 12 player names and preview their duck lane assignments.

**Layout:**
- Title/logo area at top: "DUCK RACE 🦆" with a water/pond themed header
- Subtitle: "Scam Center Draft Position" or customizable event name
- Name input area: 12 input fields (or a single textarea, one name per line) with clear numbering
- Each entered name gets a live preview showing the duck color assigned to that lane
- Lane colors are fixed per lane position (Lane 1 = yellow, Lane 2 = blue, etc.) so colors are always visually distinct
- "Start Race" button—large, prominent, disabled until at least 2 names are entered
- Optional: "Randomize Lane Order" button to shuffle name-to-lane assignments before racing

**Duck Color Palette (12 distinct colors):**

| Lane | Color | Hex |
|------|-------|-----|
| 1 | Yellow | `#FFD700` |
| 2 | Blue | `#1E90FF` |
| 3 | Red | `#FF4444` |
| 4 | Green | `#32CD32` |
| 5 | Orange | `#FF8C00` |
| 6 | Purple | `#9B59B6` |
| 7 | Hot Pink | `#FF69B4` |
| 8 | Cyan | `#00CED1` |
| 9 | Lime | `#ADFF2F` |
| 10 | Coral | `#FF6B6B` |
| 11 | Teal | `#20B2AA` |
| 12 | Gold | `#DAA520` |

**Interactions:**
- Tab/Enter to move between name inputs
- Names auto-trim whitespace
- Duplicate name detection with visual warning
- Clear all button to reset

---

### Screen 2: Countdown

**Purpose:** Build anticipation before the race starts.

**Layout:**
- Full-screen takeover with dark/dramatic background
- Large centered countdown numbers: **3** → **2** → **1** → **QUACK!** 🦆
- Each number displays for ~1 second with scale-in animation (starts large, settles to size)
- "QUACK!" appears with a shake/bounce effect, held for ~0.5s before transitioning to race
- Duck silhouettes or emojis visible at starting line during countdown
- Optional quacking sound effect on each number, horn/fanfare on "QUACK!"

**Timing:**
- 3: 1000ms
- 2: 1000ms  
- 1: 1000ms
- QUACK!: 800ms
- Total pre-race: ~3.8 seconds

---

### Screen 3: Race

**Purpose:** The main event. Animated horizontal duck race with random speed dynamics.

**Layout:**
- Full-width horizontal race track
- 12 horizontal swim lanes (or however many players entered), stacked vertically
- Each lane has:
  - Player name label on the left side (fixed, always visible)
  - A colored duck (CSS art or emoji 🦆 with colored background) that moves left-to-right
  - Lane dividers (wavy water lines or simple dashed lines)
- Finish line on the right edge: checkered pattern or vertical banner
- Water/pond themed background—light blue with subtle wave animation
- Optional: lily pads, cattails, or pond scenery as background decoration

**Animation Mechanics:**

The race is the heart of the game. It must feel dynamic and unpredictable, not like a loading bar.

- **Duration:** Configurable, default 12 seconds. All ducks guaranteed to finish between 10–15 seconds.
- **Base speed:** Each duck starts with a random base speed factor.
- **Speed variation algorithm:**
  - Each duck's speed is updated every animation frame (~16ms)
  - Speed = baseSpeed × currentModifier
  - currentModifier fluctuates using a noise function or periodic random adjustment (every ~500ms)
  - Modifiers range from 0.3× (near-stop crawl) to 2.5× (burst sprint)
  - Ensure no duck is stuck at near-zero for more than ~1 second
  - Final 20% of track: increase variance to create dramatic finishes (surges and stalls)
- **Visual speed cues:**
  - Faster ducks: motion blur trail, splash particles, slight duck tilt forward
  - Slower ducks: gentle bob animation, no trail
  - Surging: brief flash/glow effect on the duck
- **Finish detection:**
  - Each duck finishes when it crosses the finish line X position
  - Record finish order (1st, 2nd, 3rd…)
  - When a duck finishes, flash its lane briefly and show a small placement badge
  - Camera/viewport stays fixed; ducks move within the viewport space
- **Guaranteed exciting finish:**
  - Algorithm should ensure at least 2-3 ducks finish within ~1 second of each other
  - The last few ducks should not lag absurdly far behind; compress finish times toward the end

**Fun Details:**
- Ducks waddle/bob as they move (slight vertical oscillation, ~2-3px)
- Splash particle effects behind moving ducks (small blue dots that fade)
- Water ripple effect on lanes
- When a duck crosses the finish line: confetti burst or splash effect on that lane

---

### Screen 4: Results

**Purpose:** Display the race finish order and—critically—the Blackjack Playing Order.

**Layout — Two-panel display:**

**Panel A: Race Results (left or top)**
- Header: "🏁 Race Results"
- Ordered list from 1st to last:
  - Placement badge (🥇🥈🥉 for top 3, numbered badges for 4th–12th)
  - Player name
  - Duck color indicator (dot or small duck icon)
- 1st place highlighted prominently

**Panel B: Blackjack Playing Order (right or bottom)**
- Header: "🃏 Blackjack Playing Order" 
- **This is the REVERSE of the race finish order**
- Last place in the race → plays blackjack 1st
- 1st place in the race → plays blackjack last
- Ordered list showing:
  - Blackjack position (1st to play, 2nd to play, … last to play)
  - Player name
  - Their duck race finish position (e.g., "finished 12th")
- The first-to-play name highlighted or emphasized
- Clear labeling: "Last in the race → First at the table"

**Post-race controls:**
- "🔄 Race Again" button — reruns with same names, fresh randomization
- "✏️ Edit Names" button — returns to Setup screen
- Optional: "📋 Copy Results" — copies both orders to clipboard as text

**Animation on results reveal:**
- Results don't appear instantly—animate in sequentially (each row slides in, ~100ms stagger)
- Blackjack order panel reveals after a beat (~1 second delay after race results)
- Dramatic "flip" or "reveal" animation on the Blackjack order to emphasize the reversal

---

## Technical Specification

### Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | React 18+ with TypeScript | Type safety, component model |
| Build | Vite | Fast dev/build, Cloudflare Pages compatible |
| Animation | CSS animations + requestAnimationFrame | Smooth 60fps, no heavy libs |
| Rendering | DOM/CSS (not Canvas) | Easier styling, responsive, accessible |
| Styling | CSS Modules or Tailwind | Scoped styles, rapid iteration |
| Sound | Web Audio API | No external audio files needed; synthesized quacks and splashes |
| Deployment | Cloudflare Pages | Free, fast, simple |
| State | React useState/useReducer | No external state management needed |

### Component Architecture

```
<App>
├── <SetupScreen>
│   ├── <Header />              // Title, logo, event name
│   ├── <NameInputList>         // 12 name inputs with duck color previews
│   │   └── <NameInput />       // Individual name input with lane color indicator
│   ├── <StartButton />         // Disabled until ≥2 names entered
│   └── <LanePreview />         // Optional: shows the lineup before starting
│
├── <CountdownOverlay>          // Full-screen 3..2..1..QUACK! overlay
│   └── <CountdownNumber />     // Animated number display
│
├── <RaceScreen>
│   ├── <RaceTrack>             // Container for all lanes
│   │   └── <Lane>              // Individual duck lane
│   │       ├── <PlayerLabel /> // Name on the left
│   │       ├── <Duck />        // The animated duck (CSS art or emoji)
│   │       └── <Splash />      // Particle effects behind duck
│   ├── <FinishLine />          // Checkered/banner finish line on right
│   └── <RaceTimer />           // Optional elapsed time display
│
├── <ResultsScreen>
│   ├── <RaceResults>           // Finish order panel
│   │   └── <ResultRow />       // Individual placement row
│   ├── <BlackjackOrder>        // Reversed order panel
│   │   └── <OrderRow />        // Individual BJ order row
│   ├── <ReRaceButton />        // Run again with same names
│   └── <EditNamesButton />     // Back to setup
│
└── <SoundController />         // Web Audio API manager (quacks, splashes, horn)
```

### State Machine

```
type GameState =
  | { phase: 'setup'; names: string[] }
  | { phase: 'countdown'; names: string[]; count: number }
  | { phase: 'racing'; ducks: DuckState[]; finishOrder: string[] }
  | { phase: 'results'; finishOrder: string[]; blackjackOrder: string[] }
```

### Key Data Types

```typescript
interface DuckState {
  name: string;
  color: string;
  lane: number;
  position: number;       // 0 to 1 (percentage of track completed)
  speed: number;          // current speed multiplier
  baseSpeed: number;      // assigned random base speed
  finished: boolean;
  finishTime: number;     // timestamp when crossed finish line
  finishPlace: number;    // 1st, 2nd, etc.
}

interface RaceConfig {
  durationTarget: number; // target race duration in ms (default 12000)
  minDuration: number;    // minimum 10000ms
  maxDuration: number;    // maximum 15000ms
  speedUpdateInterval: number; // how often to randomize speed (ms)
  names: string[];
}
```

### Animation Implementation

**Race loop (requestAnimationFrame):**

```
1. On each frame:
   a. Calculate deltaTime since last frame
   b. For each duck that hasn't finished:
      - Every speedUpdateInterval, compute new speed modifier:
        * Base random factor (0.5–1.5)
        * Position-based modifier (faster ducks get slightly slower, slower ducks get slightly faster to keep it competitive)
        * End-of-race surge modifier (last 20%: higher variance, 0.3–2.5)
      - Update position: position += speed * baseSpeed * deltaTime * trackScale
      - If position >= 1.0: mark finished, record finish time and place
   c. Update duck DOM positions via transform: translateX()
   d. If all ducks finished: transition to results after 1.5s delay
```

**Ensuring exciting finishes:**
- "Rubber-banding": ducks further behind get a slight speed boost; ducks further ahead get a slight drag. This keeps the pack together without being obvious.
- Final stretch variance: In the last 20% of the track, speed modifier range widens so positions can shuffle dramatically.
- Minimum spread: ensure finish times span at least 2 seconds total so there's a clear narrative, but no duck finishes more than 4 seconds after the leader.

### Sound Design (Web Audio API — Synthesized)

All sounds generated programmatically via Web Audio API, no external files:

| Sound | Trigger | Synthesis Approach |
|-------|---------|-------------------|
| Countdown beep | Each countdown number | Short sine wave tone, ascending pitch (C4→E4→G4) |
| QUACK! horn | "QUACK!" appears | Noise burst + low oscillator = air horn effect |
| Quacking | During race (ambient) | Periodic short noise bursts at duck frequencies |
| Splash | Duck crosses finish | White noise burst with bandpass filter, fast decay |
| Fanfare | Results reveal | Short ascending arpeggio (C5→E5→G5→C6) |

- Global mute/unmute toggle in corner of every screen
- Sound off by default (auto-play policies); user clicks to enable

### Responsive Design

- **Desktop-first** (optimized for screen sharing at 1920×1080 or similar)
- Race track uses full viewport width for maximum visual impact
- Minimum supported width: 768px (tablet)
- Mobile: lanes stack more tightly, player name font size reduces
- Font sizes scale with viewport width (`clamp()` or `vw` units)
- Duck size scales proportionally to lane height

### Performance Targets

- 60fps animation on mid-range hardware
- No layout thrashing during race (use `transform` only, never `left`/`top`)
- Total bundle size < 200KB (no heavy dependencies)
- First paint < 1 second on broadband

---

## Visual Design Direction

### Theme: Pond Day Race

- **Background:** Light blue gradient (#E0F7FA → #B2EBF2) with subtle wave pattern
- **Lanes:** Alternating slightly different blue tones for visual separation
- **Ducks:** CSS-drawn or emoji-based. CSS art preferred for color control:
  - Body: colored oval/circle matching lane color
  - Head: smaller circle
  - Bill: orange triangle
  - Eye: small white/black dot
  - Optional: tiny wing detail
- **Finish line:** Classic black-and-white checkered pattern, or a "FINISH" banner
- **Typography:** Bold, playful sans-serif (system fonts: -apple-system, "Segoe UI", or a fun Google Font like Fredoka One or Bangers for headers)
- **Accents:** Lily pads, cattails, small pond plants as subtle background decoration
- **Mood:** Bright, cheerful, slightly chaotic. Like a county fair duck race.

### CSS Duck Art Reference

```css
/* Conceptual — simplified CSS duck */
.duck {
  position: relative;
  width: 40px;
  height: 32px;
}
.duck-body {
  width: 40px;
  height: 28px;
  border-radius: 50% 50% 50% 50%;
  background: var(--duck-color);
}
.duck-head {
  position: absolute;
  top: -8px;
  right: -4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--duck-color);
}
.duck-bill {
  position: absolute;
  top: -2px;
  right: -12px;
  width: 0;
  height: 0;
  border-left: 10px solid orange;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
}
```

---

## Edge Cases & Constraints

- **Fewer than 12 players:** Game works with 2–12. Lanes scale to fill available vertical space.
- **Empty/whitespace names:** Silently ignored; not counted as entries.
- **Duplicate names:** Visual warning on setup screen; allow but discourage.
- **Browser tab backgrounded:** `requestAnimationFrame` pauses when tab is hidden. Since the host is screen-sharing, the tab will be active. No special handling needed.
- **Re-race:** Generates completely fresh randomization. Previous results are not persisted.
- **No persistence required:** No localStorage, no backend. It's a one-night event. Refresh = start over.
- **Tie handling:** Extremely unlikely given millisecond-precision finish times. If two ducks finish in the same frame, the one with the higher `position` value at finish detection wins. In practice, sub-frame interpolation makes true ties near-impossible.

---

## Out of Scope

- User accounts or authentication
- Backend or database
- Saving/loading race configurations
- Tournament brackets or multi-race series
- Customizable duck sprites or avatars
- Actual blackjack game integration
- Chat or multiplayer networking
- Accessibility (screen reader support for the race animation) — nice-to-have but not required for this one-time event

---

## Deployment

- Build: `npx vite build` → produces static `dist/` folder
- Deploy: Cloudflare Pages via `npx wrangler pages deploy dist --project-name=duck-race --branch=main`
- Expected URL: `https://duck-race.pages.dev` or custom subdomain
- No environment variables or secrets needed
- No server-side logic

---

## Success Criteria

1. Host can enter 12 names in under 60 seconds
2. Countdown + race completes in under 20 seconds total
3. All 12 people on the call understand the race results and blackjack order
4. At least one person says "run it again" (re-race button works)
5. Nobody asks "wait, who goes first in blackjack?" (clear labeling)
6. It looks good enough on screen share that people screenshot it
