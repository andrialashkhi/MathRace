# Math Practice — Georgian classroom math game (grades 2–4)

A teacher-hosted, one-shared-screen math game: a **landing page** → team setup →
two game modes (Game 1 buzzer race, Game 2 board race), built on a tested
question generator + grading engine.

**Entry point:** a landing/main-menu page (hero, what-it-is, features, benefits,
placeholder updates banner) → **დაწყება** → team setup.

**Look & feel:** soft-periwinkle theme, rounded bundled fonts, a Kahoot-style
animated background (drifting math shapes) on non-gameplay screens only (fully
off during play), GSAP-driven animations (3D dice reveal, turn announcement,
podium win), and synthesized sound effects with an always-visible mute/volume
control. GSAP is bundled locally (`assets/vendor/gsap.min.js`, offline).

**Audio note:** SFX are synthesized (no files). Background **music files are not
bundled** — drop CC0 tracks into `assets/audio/` (see `assets/audio/README.md`
for exact filenames); the app runs fine without them.

Below: the original engine docs (unchanged — pure logic, terminal-testable).

## Files

```
index.html       App shell (loads app.js)
app.js           UI/game shell: setup -> mode select -> Game 1 buzzer race
styles.css       Minimal structural styling (real polish comes later)
serve.js         Tiny static server (ES module imports need HTTP, not file://)
src/
  index.js       Public API (import from here)
  generators.js  The 6 exercise generators + generateQuestion() dispatcher
  grader.js      gradeAnswer()
  tracker.js     Session no-repeat memory + resetSession()
  georgian.js    ALL Georgian strings  <-- needs native-speaker proofread
  mathUtils.js   Carry/borrow detection, digit-wise mistakes, rounding
  rng.js         Random helpers
test/
  run.js         Terminal test harness
  test-output.md Generated UTF-8 report (open in an editor to read Georgian)
```

## Running the app (Game 1)

Start the static server, then open the page in a browser:

```powershell
& "C:\Program Files\Adobe\Adobe Creative Cloud Experience\libs\node.exe" serve.js
```

Then open **http://localhost:5173** in your browser.

Flow: **team setup** (2–6 teams + names) → **mode select** (Game 1 / Game 2) →
a config panel → **დაწყება** → play.

- **Game 1 (buzzer race):** target 5/7/10, pick chapters → buzzer-race play →
  **insight screen** on win or stop.
- **Game 2 (board race):** pick chapters + board size 20/25/30 → serpentine
  board race (see below).

**Game 2 — board race.** A serpentine (snakes-&-ladders style) trail of 20/25/30
squares, drawn as a winding illustrated road (SVG) that fits the viewport with
**no scrolling** at any size. The square positions come from the same
`buildBoard()` serpentine order; the SVG's `preserveAspectRatio="meet"` fits the
trail inside the available area, so it holds at 1920×1080 and smaller windows
alike (verified down to 1024×600). Each team gets a coloured token starting
before square 1; turns cycle A→B→C. On a turn: roll the 3D dice (CSS cube
tumble), the token hops forward square by square, then a question is asked —
**correct** keeps the new square, **incorrect** sends the token all the way back
to its pre-roll square. Three special-square types (randomly placed, never
first/last): **➕ bonus** (correct → +3 more), **⚠️ trap** (back to pre-roll even
when correct — shown in a warning colour so it doesn't look like a bug), and
**🔀 steal** (correct → swap with the furthest-ahead team). First token to reach
or pass the final square wins. A **შეჩერება** stop button with Georgian
confirmation is available throughout.

Verified: no scrollbar at 20/25/30 (at 1920×1080 **and** 1280×720 / 1024×600);
incorrect reverts to pre-roll; bonus/trap/steal all behave per spec; win triggers
on reaching the final square.

## Visual theme

**"Bright 3D Candy"** — a warm cream base with layered candy-colour mesh,
chunky pressable 3D buttons (coloured bottom "lip" that sinks on press), and
extruded candy-block numerals. Signature motif: the **checkered race stripe**
from the logo's finish flag, used on the landing page, question card, turn
announcement, podium floor and the Game 2 finish square. Each game has its own
identity colour — Speed Race orange `#FF5A2C`, Board Race blue `#2E7CF6`,
Table Conquest mint `#12C29A` — and teams share one 6-colour palette
(`TOKEN_COLORS` in `app.js`) across every screen.

Typography (all bundled offline, OFL): **Fredoka** for headings, numbers and
buttons, **Nunito** for body text, **Noto Sans Georgian** for Georgian. All
palette/typography/animation tokens live at the top of `styles.css` (`:root`).
Layout is projector-first and verified at 1920×1080, 1280×720 and 1024×600 with
no scrolling during play. `prefers-reduced-motion` is respected.

The redesign changed **presentation only**: every game-logic function in
`app.js` and everything in `src/` is byte-identical to the previous version.

**Adaptive difficulty (class-wide):** every game starts at tier 2. Over a rolling
window of the last 3 resolved questions — 3 correct bumps the tier up (max 3),
2+ wrong drops it (min 1); the window resets on each change. The current tier
shows as a small badge (`სირთულე: n/3`) top-right during play.

**End-of-game insight screen:** a per-type correct/incorrect table plus a
separate "mistakes we noticed" lens listing any `no_carry` / `wrong_borrow` /
`forgot_decrement` patterns that occurred, each with a short Georgian
explanation. Shown after both the win screen and a teacher stop.

**Characters:** each question is "asked" by a rotating Open Peeps character
(`assets/characters/peep-*.svg`) with a light entrance animation.

### Quickly testing the insight screen (no full game needed)

- Open the browser console and run **`__insightDemo()`** — seeds a full spread
  (all 6 types, correct + incorrect, all 3 mistake patterns, a dropped tier, a
  winner) and jumps straight to the insight screen from a cold load.
- Or load the app with **`?debug=1`** (http://localhost:5173/?debug=1) to get a
  **⏩** button on the play screen that fast-forwards to insight (using the real
  game so far, or a seeded demo if nothing's been answered yet). `?debug=1` also
  exposes `__q()` / `__state()` for inspection.

> The UI strings live in `app.js` (in the `UI` object), the mistake-pattern
> explanations in `PATTERN_INFO`, and the type labels in `TYPE_LABELS` — like
> `src/georgian.js`, these still need a native-speaker proofread.

### Character assets — real Open Peeps (CC0), already bundled

The 15 characters in `assets/characters/` are genuine **Open Peeps** by Pablo
Stanley, **CC0 1.0** (public domain — no attribution required), fetched once at
build time and saved locally; the app never fetches them at runtime. Provenance
is in `assets/characters/CREDITS.md` and in each SVG's embedded metadata. Swap in
different faces by replacing the files.

## Running the tests

Node is **not on this machine's PATH**. A Node v20 ships with Adobe Creative
Cloud and works fine:

```powershell
& "C:\Program Files\Adobe\Adobe Creative Cloud Experience\libs\node.exe" test\run.js
```

If the terminal prints `?????` instead of Georgian, force UTF-8 first:

```powershell
chcp 65001
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
```

…or just open **`test/test-output.md`** in VS Code — it's written as UTF-8 and
always renders correctly.

> Recommend installing a real Node (nodejs.org) so `npm test` works and you're
> not depending on the Adobe copy.

## API

```js
import { generateQuestion, gradeAnswer, resetSession, TYPES, VALID_CHAPTERS } from "./src/index.js";

// type, chapter, difficulty(1–3), opts
const q = generateQuestion(TYPES.ADDITION, 3, 2);
// round takes a variant: "numeric" (default) or "multiple_choice"
const r = generateQuestion(TYPES.ROUND, 2, 3, { variant: "multiple_choice" });

const result = gradeAnswer(q, 253); // { correct, matchedPattern }

resetSession(); // clear no-repeat memory between games
```

### Question shape

```js
{
  id: "addition-1-3b9og",
  type: "addition",              // one of TYPES
  chapter: 3,                    // 1 | 2 | 3
  questionText: "იპოვე ჯამი: 84 + 39 = ?",
  format: "numeric",             // "numeric" | "multiple_choice" | "ordering"
  correctAnswer: 123,            // number | string(sign) | array
  options: [],                   // filled for multiple_choice / ordering
  commonMistakes: [              // only for addition / subtraction
    { answer: 13, patternTag: "no_carry" }
  ],
  // plus a few type-specific extras: operands, direction, place, op, number
}
```

### Types → chapters

| type          | format(s)                     | chapters | commonMistakes tags                |
|---------------|-------------------------------|----------|------------------------------------|
| `addition`    | numeric                       | 3        | `no_carry`                         |
| `subtraction` | numeric                       | 3        | `wrong_borrow`, `forgot_decrement` |
| `compare`     | multiple_choice (`<` `>` `=`) | 1, 2     | —                                  |
| `order`       | ordering                      | 1, 2     | —                                  |
| `round`       | numeric **or** multiple_choice| 1, 2     | —                                  |
| `estimate`    | multiple_choice               | 3        | —                                  |

Calling a type with an invalid chapter throws a clear error.

### grateAnswer results

- **numeric** — exact numeric match.
- **multiple_choice** — submitted value equals `correctAnswer` (number or sign string).
- **ordering** — submitted array deep-equals `correctAnswer`; you may submit either
  a plain `[n, …]` array or the `[{value,color}, …]` option objects.
- If a numeric add/sub answer is wrong but matches a `commonMistakes` entry, the
  result carries that `patternTag` (e.g. `{ correct:false, matchedPattern:"no_carry" }`).

## ⚠️ Georgian text needs a native-speaker proofread

Every Georgian string lives in `src/georgian.js` and has **not** been verified by
a native speaker. Please check the imperative verb forms and the rounding "place"
words (ათეული / ასეული / ათასეული) before classroom use.
