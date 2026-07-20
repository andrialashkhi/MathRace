// The six exercise generators + the generateQuestion dispatcher.
//
// Every generator returns the same object shape:
//   { id, type, chapter, questionText, format, correctAnswer, options, commonMistakes, ...extra }
// where `options` is [] unless format is "multiple_choice" or "ordering", and
// `commonMistakes` is [] unless type is "addition"/"subtraction".

import { randInt, pick, shuffle, distinctInts } from "./rng.js";
import { text, COLORS, SIGN_LT, SIGN_GT, SIGN_EQ } from "./georgian.js";
import {
  requiresCarry,
  requiresBorrow,
  noCarryResult,
  smallerFromLargerResult,
  forgotDecrementResult,
  roundTo,
  floorTo,
  ceilTo,
} from "./mathUtils.js";
import { isDuplicate, remember } from "./tracker.js";

// ---------------------------------------------------------------------------
// Type + chapter metadata
// ---------------------------------------------------------------------------

export const TYPES = {
  ADDITION: "addition",
  SUBTRACTION: "subtraction",
  COMPARE: "compare",
  ORDER: "order",
  ROUND: "round",
  ESTIMATE: "estimate",
};

// Which chapters each type is allowed in.
export const VALID_CHAPTERS = {
  addition: [3],
  subtraction: [3],
  compare: [1, 2],
  order: [1, 2],
  round: [1, 2],
  estimate: [3],
};

function clampDifficulty(d) {
  const n = Number(d);
  if (n <= 1) return 1;
  if (n >= 3) return 3;
  return 2;
}

// Number range for compare/order, by chapter + difficulty.
function compareOrderRange(chapter, difficulty) {
  if (chapter === 1) {
    return { 1: { min: 1, max: 100 }, 2: { min: 1, max: 500 }, 3: { min: 1, max: 1000 } }[
      difficulty
    ];
  }
  // chapter 2: up to 1,000,000
  return {
    1: { min: 1, max: 10000 },
    2: { min: 1, max: 200000 },
    3: { min: 1, max: 1000000 },
  }[difficulty];
}

// Operand range for addition/subtraction (chapter 3).
function addSubRange(difficulty) {
  return { 1: { min: 11, max: 89 }, 2: { min: 25, max: 199 }, 3: { min: 120, max: 899 } }[
    difficulty
  ];
}

// ---------------------------------------------------------------------------
// id generation
// ---------------------------------------------------------------------------

let idCounter = 0;
function makeId(type) {
  idCounter += 1;
  return `${type}-${idCounter}-${Math.random().toString(36).slice(2, 7)}`;
}

// ---------------------------------------------------------------------------
// option helpers
// ---------------------------------------------------------------------------

// Build a shuffled option list of `count` unique numbers that always contains
// `correct`. Tries the provided distractors first, then falls back to nudging
// by `step` until it has enough.
function buildNumericOptions(correct, distractors, count, step) {
  const set = new Set([correct]);
  for (const d of distractors) {
    if (set.size >= count) break;
    if (d >= 0) set.add(d);
  }
  let k = 1;
  while (set.size < count && k < 1000) {
    if (correct - k * step >= 0) set.add(correct - k * step);
    if (set.size < count) set.add(correct + k * step);
    k++;
  }
  return shuffle([...set].slice(0, count));
}

// ---------------------------------------------------------------------------
// The six generators. Each returns a "candidate" (question object without id)
// plus a `signature` used for no-repeat de-duplication.
// ---------------------------------------------------------------------------

function genAddition(chapter, difficulty) {
  const { min, max } = addSubRange(difficulty);
  let a, b;
  let guard = 0;
  do {
    a = randInt(min, max);
    b = randInt(min, max);
    guard++;
  } while (!requiresCarry(a, b) && guard < 200);

  const correct = a + b;

  // Common mistake: forgot to carry.
  const noCarry = noCarryResult(a, b);
  const commonMistakes = [];
  if (noCarry !== correct) commonMistakes.push({ answer: noCarry, patternTag: "no_carry" });

  return {
    signature: `add:${a}+${b}`,
    question: {
      type: TYPES.ADDITION,
      chapter,
      questionText: text.addition(a, b),
      format: "numeric",
      correctAnswer: correct,
      options: [],
      commonMistakes,
      operands: [a, b],
    },
  };
}

function genSubtraction(chapter, difficulty) {
  const { min, max } = addSubRange(difficulty);
  let a, b;
  let guard = 0;
  do {
    a = randInt(min, max);
    b = randInt(min, max);
    if (a < b) [a, b] = [b, a]; // guarantee minuend > subtrahend
    guard++;
  } while ((a === b || !requiresBorrow(a, b)) && guard < 200);

  const correct = a - b;

  // Two classic borrowing mistakes. Dedupe against the correct answer and each
  // other (they collapse to the same value on many single-borrow problems —
  // that's fine, we just emit the distinct ones).
  const candidates = [
    { answer: smallerFromLargerResult(a, b), patternTag: "wrong_borrow" },
    { answer: forgotDecrementResult(a, b), patternTag: "forgot_decrement" },
  ];
  const commonMistakes = [];
  const usedAnswers = new Set([correct]);
  for (const c of candidates) {
    if (!usedAnswers.has(c.answer)) {
      commonMistakes.push(c);
      usedAnswers.add(c.answer);
    }
  }

  return {
    signature: `sub:${a}-${b}`,
    question: {
      type: TYPES.SUBTRACTION,
      chapter,
      questionText: text.subtraction(a, b),
      format: "numeric",
      correctAnswer: correct,
      options: [],
      commonMistakes,
      operands: [a, b],
    },
  };
}

function genCompare(chapter, difficulty) {
  const { min, max } = compareOrderRange(chapter, difficulty);
  const a = randInt(min, max);
  // ~20% of the time force an equality so "=" is a real answer sometimes.
  const b = Math.random() < 0.2 ? a : randInt(min, max);

  let correct;
  if (a < b) correct = SIGN_LT;
  else if (a > b) correct = SIGN_GT;
  else correct = SIGN_EQ;

  return {
    // Operand order matters here: "3 ⬚ 5" (<) and "5 ⬚ 3" (>) are different.
    signature: `cmp:${a}?${b}`,
    question: {
      type: TYPES.COMPARE,
      chapter,
      questionText: text.compare(a, b),
      format: "multiple_choice",
      correctAnswer: correct,
      options: [SIGN_LT, SIGN_GT, SIGN_EQ],
      commonMistakes: [],
      operands: [a, b],
    },
  };
}

function genOrder(chapter, difficulty) {
  const { min, max } = compareOrderRange(chapter, difficulty);
  const count = difficulty >= 2 ? 4 : 3;
  const numbers = distinctInts(count, min, max);
  const direction = pick(["asc", "desc"]);

  const correctOrder = numbers
    .slice()
    .sort((x, y) => (direction === "asc" ? x - y : y - x));

  // Present the numbers shuffled, each tagged with a color.
  const shuffled = shuffle(numbers);
  const options = shuffled.map((value, i) => ({ value, color: COLORS[i % COLORS.length] }));

  return {
    // Same set + same direction = same question, regardless of shuffle/colors.
    signature: `ord:${direction}:${numbers.slice().sort((x, y) => x - y).join(",")}`,
    question: {
      type: TYPES.ORDER,
      chapter,
      questionText: text.order(shuffled, direction),
      format: "ordering",
      correctAnswer: correctOrder,
      options,
      commonMistakes: [],
      direction,
    },
  };
}

function genRound(chapter, difficulty, variant) {
  // Allowed places by chapter.
  const places = chapter === 1 ? [10, 100] : [10, 100, 1000];
  // Bias place by difficulty but keep it within the chapter's set.
  let place;
  if (difficulty === 1) place = 10;
  else place = pick(places);

  const range =
    chapter === 1
      ? { 1: { min: 10, max: 200 }, 2: { min: 10, max: 600 }, 3: { min: 20, max: 1000 } }[
          difficulty
        ]
      : {
          1: { min: 10, max: 2000 },
          2: { min: 100, max: 100000 },
          3: { min: 1000, max: 1000000 },
        }[difficulty];

  let n;
  let guard = 0;
  do {
    n = randInt(range.min, range.max);
    guard++;
  } while (n % place === 0 && guard < 50); // avoid the trivial "already round" case

  const correct = roundTo(n, place);

  const base = {
    type: TYPES.ROUND,
    chapter,
    questionText: text.round(n, place),
    correctAnswer: correct,
    commonMistakes: [],
    number: n,
    place,
  };

  let question;
  if (variant === "multiple_choice") {
    const distractors = [
      floorTo(n, place),
      ceilTo(n, place),
      roundTo(n, place === 10 ? 100 : place * 10), // rounded to the wrong (bigger) place
      n, // the un-rounded number itself
    ];
    question = {
      ...base,
      format: "multiple_choice",
      options: buildNumericOptions(correct, distractors, 4, place),
    };
  } else {
    question = { ...base, format: "numeric", options: [] };
  }

  return {
    signature: `rnd:${n}:${place}:${variant}`,
    question,
  };
}

function genEstimate(chapter, difficulty) {
  // Choose operand size by difficulty (chapter 3 only). The rounding PLACE is
  // then picked per-question from the places that are actually meaningful for
  // that operand size — e.g. rounding a 2-digit number to the nearest
  // thousand would collapse every answer to 0, so it's excluded there. This
  // gives real question-to-question variety instead of one hardcoded place
  // per difficulty tier.
  const cfg = {
    1: { min: 15, max: 89, places: [10] },
    2: { min: 30, max: 290, places: [10, 100] },
    3: { min: 150, max: 890, places: [10, 100] },
  }[difficulty];
  const place = pick(cfg.places);

  const op = pick(["+", "−"]);
  let a = randInt(cfg.min, cfg.max);
  let b = randInt(cfg.min, cfg.max);
  if (op === "−" && a < b) [a, b] = [b, a];

  const ra = roundTo(a, place);
  const rb = roundTo(b, place);
  const correct = op === "+" ? ra + rb : ra - rb;

  // Distractors that reflect real mistakes.
  const exact = op === "+" ? a + b : a - b; // didn't estimate, computed exactly
  const wrongRoundA =
    (a % place < place / 2 ? ceilTo(a, place) : floorTo(a, place)); // rounded a the wrong way
  const wrongEstimate = op === "+" ? wrongRoundA + rb : wrongRoundA - rb;
  const offByPlace = correct + place;

  const options = buildNumericOptions(
    correct,
    [exact, wrongEstimate, offByPlace],
    4,
    place
  );

  return {
    signature: `est:${a}${op}${b}:${place}`,
    question: {
      type: TYPES.ESTIMATE,
      chapter,
      questionText: text.estimate(a, b, op, place),
      format: "multiple_choice",
      correctAnswer: correct,
      options,
      commonMistakes: [],
      operands: [a, b],
      op,
      place,
    },
  };
}

// ---------------------------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------------------------

const GENERATORS = {
  addition: (ch, d) => genAddition(ch, d),
  subtraction: (ch, d) => genSubtraction(ch, d),
  compare: (ch, d) => genCompare(ch, d),
  order: (ch, d) => genOrder(ch, d),
  round: (ch, d, opts) => genRound(ch, d, opts.variant === "multiple_choice" ? "multiple_choice" : "numeric"),
  estimate: (ch, d) => genEstimate(ch, d),
};

/**
 * generateQuestion(type, chapter, difficulty, opts?)
 *   type       – one of TYPES
 *   chapter    – 1 | 2 | 3 (must be valid for the type)
 *   difficulty – 1 | 2 | 3 (clamped into range)
 *   opts       – { variant: "numeric" | "multiple_choice" }  (only used by "round")
 *
 * Applies session no-repeat: retries a bounded number of times to avoid a
 * signature already produced this session.
 */
export function generateQuestion(type, chapter, difficulty = 1, opts = {}) {
  const gen = GENERATORS[type];
  if (!gen) {
    throw new Error(
      `Unknown question type "${type}". Valid types: ${Object.values(TYPES).join(", ")}`
    );
  }

  const validChapters = VALID_CHAPTERS[type];
  if (!validChapters.includes(chapter)) {
    throw new Error(
      `Type "${type}" is not available in chapter ${chapter}. ` +
        `Valid chapter(s): ${validChapters.join(", ")}.`
    );
  }

  const d = clampDifficulty(difficulty);

  const MAX_ATTEMPTS = 40;
  let candidate;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    candidate = gen(chapter, d, opts);
    if (!isDuplicate(candidate.signature)) break;
  }
  // Whether unique or a forced repeat after exhausting attempts, record it.
  remember(candidate.signature);

  return { id: makeId(type), ...candidate.question };
}
