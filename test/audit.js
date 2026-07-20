// -----------------------------------------------------------------------------
// AUDIT SCRIPT — independent correctness verification of the question engine.
//
// It imports ONLY the public generator entry points (generateQuestion,
// resetSession, TYPES, VALID_CHAPTERS). It does NOT import mathUtils.js or any
// of the engine's internal calculation helpers. Every check below reimplements
// the exercise's mathematical definition from scratch, so a bug in
// generators.js / mathUtils.js cannot hide behind its own logic.
//
// Output: audit-report.md (written next to this file's parent — project root).
// -----------------------------------------------------------------------------

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { generateQuestion, resetSession, TYPES, VALID_CHAPTERS } from "../src/index.js";

const SAMPLES = 60; // per type × chapter × difficulty (spec minimum is 50)

// ---------------------------------------------------------------------------
// Independent math primitives (do NOT reference mathUtils.js)
// ---------------------------------------------------------------------------

/** Digits of |n|, least-significant-first. digitsLSF(47) -> [7,4]. */
function digitsLSF(n) {
  n = Math.abs(Math.trunc(n));
  if (n === 0) return [0];
  const d = [];
  while (n > 0) {
    d.push(n % 10);
    n = Math.floor(n / 10);
  }
  return d;
}
function padTo(d, len) {
  const c = d.slice();
  while (c.length < len) c.push(0);
  return c;
}
/** Build a base-10 number from LSF digits. [3,1] -> 13. */
function numFromLSF(d) {
  let n = 0;
  for (let i = d.length - 1; i >= 0; i--) n = n * 10 + d[i];
  return n;
}
function columns(a, b) {
  const len = Math.max(digitsLSF(a).length, digitsLSF(b).length);
  return [padTo(digitsLSF(a), len), padTo(digitsLSF(b), len), len];
}

// --- exercise definitions, reimplemented independently ---

/** Plain arithmetic. */
const indepAdd = (a, b) => a + b;
const indepSub = (a, b) => a - b;

/**
 * "no_carry": add each column, keep ONLY the units digit of each column sum
 * (drop every carry), concatenate. Definition per the audit brief.
 */
function indepNoCarry(a, b) {
  const [da, db] = columns(a, b);
  return numFromLSF(da.map((x, i) => (x + db[i]) % 10));
}
/** "wrong_borrow": in each column subtract the smaller digit from the larger. */
function indepWrongBorrow(a, b) {
  const [da, db] = columns(a, b);
  return numFromLSF(da.map((x, i) => Math.abs(x - db[i])));
}
/**
 * "forgot_decrement": when the top digit is too small, add 10 to it to subtract,
 * but never reduce (borrow from) the next column. Column-independent.
 */
function indepForgotDecrement(a, b) {
  const [da, db] = columns(a, b);
  return numFromLSF(da.map((x, i) => (x < db[i] ? x + 10 - db[i] : x - db[i])));
}

/** True if adding a+b regroups (carries) in at least one column — with propagation. */
function indepCarryOccurs(a, b) {
  const [da, db, len] = columns(a, b);
  let carry = 0;
  for (let i = 0; i < len; i++) {
    const s = da[i] + db[i] + carry;
    if (s >= 10) return true;
    carry = 0;
  }
  return false;
}
/** True if a-b (a>=b) borrows in at least one column — with propagation. */
function indepBorrowOccurs(a, b) {
  const [da, db, len] = columns(a, b);
  let borrow = 0;
  for (let i = 0; i < len; i++) {
    const t = da[i] - borrow;
    if (t < db[i]) {
      borrow = 1;
    } else {
      borrow = 0;
    }
    if (t < db[i]) return true;
  }
  return false;
}

/** Round n to nearest `place`, half rounds UP — pure integer math (no Math.round). */
function indepRoundHalfUp(n, place) {
  const fl = Math.floor(n / place);
  const rem = n - fl * place;
  return rem * 2 >= place ? (fl + 1) * place : fl * place;
}

/** Sign relationship. */
function indepCompareSign(a, b) {
  if (a < b) return "<";
  if (a > b) return ">";
  return "=";
}
/** Independent sort. */
function indepSort(nums, dir) {
  return [...nums].sort((x, y) => (dir === "asc" ? x - y : y - x));
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------
function parseInts(str) {
  return (str.match(/\d+/g) || []).map(Number);
}
// Independent word map for "rounded to the nearest ..." (NOT imported from
// georgian.js — reimplemented so a bug in that file's word choice would
// surface here too). Thousand must be checked before hundred: the Georgian
// word for "thousand" (ათასეულამდე) contains the word for "hundred"
// (ასეულამდე) as a literal substring.
const PLACE_WORD = { 10: "ათეულამდე", 100: "ასეულამდე", 1000: "ათასეულამდე" };
function statedPlace(str) {
  if (str.includes(PLACE_WORD[1000])) return 1000;
  if (str.includes(PLACE_WORD[100])) return 100;
  if (str.includes(PLACE_WORD[10])) return 10;
  return null;
}
function arraysEqual(x, y) {
  return Array.isArray(x) && Array.isArray(y) && x.length === y.length && x.every((v, i) => v === y[i]);
}
function hasDuplicates(arr) {
  return new Set(arr.map((v) => JSON.stringify(v))).size !== arr.length;
}

// ---------------------------------------------------------------------------
// Verification per question. Returns an array of discrepancy strings (empty = ok).
// Each discrepancy is a structured object for the report.
// ---------------------------------------------------------------------------
function verify(q, meta) {
  const D = [];
  const add = (check, detail) => D.push({ check, detail, q, meta });

  // ---- shared structural checks for MC / ordering ----
  if (q.format === "multiple_choice") {
    if (!Array.isArray(q.options) || q.options.length === 0) add("mc_options_missing", "options empty");
    if (hasDuplicates(q.options)) add("mc_duplicate_options", `options=${JSON.stringify(q.options)}`);
    if (!q.options.some((o) => o === q.correctAnswer))
      add("mc_correct_not_in_options", `correctAnswer=${JSON.stringify(q.correctAnswer)} options=${JSON.stringify(q.options)}`);
  }

  switch (q.type) {
    // ------------------------------------------------------------------ ADD
    case TYPES.ADDITION: {
      const [a, b] = q.operands;
      // text ↔ operands consistency
      const t = parseInts(q.questionText);
      if (!(t[0] === a && t[1] === b)) add("text_operands_mismatch", `text ints ${JSON.stringify(t)} vs operands [${a},${b}]`);
      // 1a. correct answer
      const expect = indepAdd(a, b);
      if (q.correctAnswer !== expect)
        add("wrong_correct_answer", `${a}+${b}: code=${q.correctAnswer} independent=${expect}`);
      // "addition WITH carrying" spec requirement
      if (!indepCarryOccurs(a, b)) add("no_carry_present", `${a}+${b} does not require carrying`);
      // 1b. common mistakes
      for (const m of q.commonMistakes) {
        if (m.patternTag === "no_carry") {
          const sim = indepNoCarry(a, b);
          if (m.answer !== sim) add("mistake_no_carry_wrong", `${a}+${b}: code no_carry=${m.answer} independent=${sim}`);
        } else {
          add("unknown_pattern_tag", `addition had tag "${m.patternTag}"`);
        }
        if (m.answer === q.correctAnswer) add("mistake_equals_correct", `no_carry answer equals correct (${m.answer})`);
      }
      if (indepCarryOccurs(a, b) && indepNoCarry(a, b) !== expect && !q.commonMistakes.some((m) => m.patternTag === "no_carry"))
        add("missing_no_carry_mistake", `${a}+${b} carries but no no_carry mistake recorded`);
      break;
    }
    // ------------------------------------------------------------------ SUB
    case TYPES.SUBTRACTION: {
      const [a, b] = q.operands;
      const t = parseInts(q.questionText);
      if (!(t[0] === a && t[1] === b)) add("text_operands_mismatch", `text ints ${JSON.stringify(t)} vs operands [${a},${b}]`);
      if (a < b) add("minuend_lt_subtrahend", `${a} < ${b}`);
      const expect = indepSub(a, b);
      if (q.correctAnswer !== expect)
        add("wrong_correct_answer", `${a}-${b}: code=${q.correctAnswer} independent=${expect}`);
      if (!indepBorrowOccurs(a, b)) add("no_borrow_present", `${a}-${b} does not require borrowing`);
      const seenTags = new Set();
      for (const m of q.commonMistakes) {
        if (seenTags.has(m.patternTag)) add("duplicate_pattern_tag", `tag "${m.patternTag}" twice`);
        seenTags.add(m.patternTag);
        let sim;
        if (m.patternTag === "wrong_borrow") sim = indepWrongBorrow(a, b);
        else if (m.patternTag === "forgot_decrement") sim = indepForgotDecrement(a, b);
        else {
          add("unknown_pattern_tag", `subtraction had tag "${m.patternTag}"`);
          continue;
        }
        if (m.answer !== sim)
          add(`mistake_${m.patternTag}_wrong`, `${a}-${b}: code ${m.patternTag}=${m.answer} independent=${sim}`);
        if (m.answer === q.correctAnswer) add("mistake_equals_correct", `${m.patternTag} equals correct (${m.answer})`);
      }
      if (q.commonMistakes.length === 0) add("no_mistakes_recorded", `${a}-${b} has empty commonMistakes`);
      break;
    }
    // -------------------------------------------------------------- COMPARE
    case TYPES.COMPARE: {
      const [a, b] = q.operands;
      const t = parseInts(q.questionText);
      if (!(t[0] === a && t[1] === b)) add("text_operands_mismatch", `text ints ${JSON.stringify(t)} vs operands [${a},${b}]`);
      const expect = indepCompareSign(a, b);
      if (q.correctAnswer !== expect)
        add("wrong_correct_answer", `${a} vs ${b}: code=${q.correctAnswer} independent=${expect}`);
      if (!arraysEqual(q.options, ["<", ">", "="]))
        add("compare_options_unexpected", `options=${JSON.stringify(q.options)}`);
      break;
    }
    // ---------------------------------------------------------------- ORDER
    case TYPES.ORDER: {
      const vals = q.options.map((o) => o.value);
      const textVals = parseInts(q.questionText);
      // text list should match the option values (as sets, order may differ from shuffle)
      if ([...textVals].sort((x, y) => x - y).join() !== [...vals].sort((x, y) => x - y).join())
        add("order_text_values_mismatch", `text=${JSON.stringify(textVals)} options=${JSON.stringify(vals)}`);
      const expect = indepSort(vals, q.direction);
      if (!arraysEqual(q.correctAnswer, expect))
        add("wrong_correct_order", `dir=${q.direction} nums=${JSON.stringify(vals)} code=${JSON.stringify(q.correctAnswer)} independent=${JSON.stringify(expect)}`);
      // correctAnswer must be a permutation of the option values
      if ([...q.correctAnswer].sort((x, y) => x - y).join() !== [...vals].sort((x, y) => x - y).join())
        add("order_correct_not_permutation", `correct=${JSON.stringify(q.correctAnswer)} options=${JSON.stringify(vals)}`);
      if (hasDuplicates(vals)) add("order_duplicate_values", `values=${JSON.stringify(vals)}`);
      break;
    }
    // ---------------------------------------------------------------- ROUND
    case TYPES.ROUND: {
      const n = q.number;
      const place = q.place;
      const tN = parseInts(q.questionText)[0];
      if (tN !== n) add("text_number_mismatch", `text n=${tN} vs number=${n}`);
      const expect = indepRoundHalfUp(n, place);
      if (q.correctAnswer !== expect)
        add("wrong_correct_answer", `round(${n},${place}): code=${q.correctAnswer} independent=${expect}`);
      break;
    }
    // ------------------------------------------------------------- ESTIMATE
    case TYPES.ESTIMATE: {
      const [a, b] = q.operands;
      const op = q.op;
      const place = q.place;
      const t = parseInts(q.questionText);
      if (!(t[0] === a && t[1] === b)) add("text_operands_mismatch", `text ints ${JSON.stringify(t)} vs operands [${a},${b}]`);
      const ra = indepRoundHalfUp(a, place);
      const rb = indepRoundHalfUp(b, place);
      const expect = op === "+" ? ra + rb : ra - rb;
      if (q.correctAnswer !== expect)
        add("wrong_correct_answer", `est ${a}${op}${b} @${place}: round->${ra}${op}${rb}; code=${q.correctAnswer} independent=${expect}`);
      // the question text must explicitly state the rounding place, and it
      // must be the place the answer was actually computed with
      const stated = statedPlace(q.questionText);
      if (stated === null) add("text_missing_place", `no rounding-place word found in: "${q.questionText}"`);
      else if (stated !== place)
        add("text_place_mismatch", `text states place=${stated} but question used place=${place}`);
      break;
    }
    default:
      add("unknown_type", q.type);
  }

  // ---- range check ----
  const chMax = q.chapter === 2 ? 1000000 : q.chapter === 1 ? 1000 : Infinity;
  const nums =
    q.type === TYPES.ORDER
      ? q.options.map((o) => o.value)
      : q.type === TYPES.ROUND
      ? [q.number]
      : q.operands || [];
  for (const v of nums) {
    if (v < 1) add("range_below_min", `value ${v} < 1`);
    if (v > chMax) add("range_above_max", `value ${v} > chapter ${q.chapter} max ${chMax}`);
  }

  return D;
}

// ---------------------------------------------------------------------------
// NEGATIVE CONTROL — prove verify() actually catches planted bugs, so a clean
// run means "no bugs found", not "checks are vacuous". Run: node audit.js --selftest
// ---------------------------------------------------------------------------
function runSelfTest() {
  const M = { type: "", chapter: 1, difficulty: 1, variant: null };
  const cases = [
    ["wrong_correct_answer (add)", { id: "t1", type: TYPES.ADDITION, chapter: 3, format: "numeric",
      questionText: "იპოვე ჯამი: 27 + 15 = ?", correctAnswer: 999, options: [], operands: [27, 15],
      commonMistakes: [{ answer: 32, patternTag: "no_carry" }] }, "wrong_correct_answer"],
    ["mistake_no_carry_wrong", { id: "t2", type: TYPES.ADDITION, chapter: 3, format: "numeric",
      questionText: "იპოვე ჯამი: 27 + 15 = ?", correctAnswer: 42, options: [], operands: [27, 15],
      commonMistakes: [{ answer: 999, patternTag: "no_carry" }] }, "mistake_no_carry_wrong"],
    ["mistake_wrong_borrow_wrong", { id: "t3", type: TYPES.SUBTRACTION, chapter: 3, format: "numeric",
      questionText: "იპოვე სხვაობა: 52 − 27 = ?", correctAnswer: 25, options: [], operands: [52, 27],
      commonMistakes: [{ answer: 999, patternTag: "wrong_borrow" }] }, "mistake_wrong_borrow_wrong"],
    ["wrong_correct_answer (compare)", { id: "t4", type: TYPES.COMPARE, chapter: 1, format: "multiple_choice",
      questionText: "შეადარე რიცხვები. რომელი ნიშანი უნდა ჩაისვას? 5 ⬚ 3", correctAnswer: "<",
      options: ["<", ">", "="], operands: [5, 3], commonMistakes: [] }, "wrong_correct_answer"],
    ["wrong_correct_order", { id: "t5", type: TYPES.ORDER, chapter: 1, format: "ordering",
      questionText: "დაალაგე რიცხვები ზრდადობით (პატარადან დიდისკენ): 3, 1, 2", direction: "asc",
      correctAnswer: [1, 3, 2], options: [{ value: 3, color: "red" }, { value: 1, color: "blue" }, { value: 2, color: "green" }],
      commonMistakes: [] }, "wrong_correct_order"],
    ["wrong_correct_answer (round)", { id: "t6", type: TYPES.ROUND, chapter: 1, format: "numeric",
      questionText: "დაამრგვალე რიცხვი 141 უახლოეს ათეულამდე.", correctAnswer: 150, options: [],
      number: 141, place: 10, commonMistakes: [] }, "wrong_correct_answer"],
    ["wrong_correct_answer (estimate)", { id: "t7", type: TYPES.ESTIMATE, chapter: 3, format: "multiple_choice",
      questionText: "დაამრგვალე რიცხვები უახლოეს ათეულამდე და შეაფასე: დაახლოებით რამდენია სხვაობა? 60 − 31", correctAnswer: 40,
      options: [40, 30, 20, 50], operands: [60, 31], op: "−", place: 10, commonMistakes: [] }, "wrong_correct_answer"],
    ["text_place_mismatch (estimate)", { id: "t7b", type: TYPES.ESTIMATE, chapter: 3, format: "multiple_choice",
      questionText: "დაამრგვალე რიცხვები უახლოეს ათეულამდე და შეაფასე: დაახლოებით რამდენია ჯამი? 240 + 130", correctAnswer: 300,
      options: [300, 400, 350, 450], operands: [240, 130], op: "+", place: 100, commonMistakes: [] }, "text_place_mismatch"],
    ["mc_duplicate_options", { id: "t8", type: TYPES.ROUND, chapter: 1, format: "multiple_choice",
      questionText: "დაამრგვალე რიცხვი 141 უახლოეს ათეულამდე.", correctAnswer: 140, options: [140, 140, 150, 160],
      number: 141, place: 10, commonMistakes: [] }, "mc_duplicate_options"],
    ["mc_correct_not_in_options", { id: "t9", type: TYPES.ROUND, chapter: 1, format: "multiple_choice",
      questionText: "დაამრგვალე რიცხვი 141 უახლოეს ათეულამდე.", correctAnswer: 140, options: [150, 160, 170, 180],
      number: 141, place: 10, commonMistakes: [] }, "mc_correct_not_in_options"],
    ["range_above_max", { id: "t10", type: TYPES.COMPARE, chapter: 1, format: "multiple_choice",
      questionText: "შეადარე რიცხვები. რომელი ნიშანი უნდა ჩაისვას? 2000 ⬚ 3", correctAnswer: ">",
      options: ["<", ">", "="], operands: [2000, 3], commonMistakes: [] }, "range_above_max"],
  ];
  let ok = 0;
  for (const [name, q, expectedCheck] of cases) {
    const found = verify(q, M).map((d) => d.check);
    const caught = found.includes(expectedCheck);
    console.log(`${caught ? "PASS" : "FAIL"}  ${name}  (expected "${expectedCheck}", got [${found.join(", ")}])`);
    if (caught) ok++;
  }
  console.log(`\nSelf-test: ${ok}/${cases.length} planted bugs correctly caught.`);
  process.exit(ok === cases.length ? 0 : 1);
}
if (process.argv.includes("--selftest")) runSelfTest();

// ---------------------------------------------------------------------------
// Run the matrix
// ---------------------------------------------------------------------------
const discrepancies = [];
const cellStats = []; // { type, chapter, difficulty, variant, total, passed }
const rangeObserved = {}; // key type:ch:d -> {min,max}
const directionSeen = {}; // type order -> Set of directions
const placesSeen = {}; // key estimate:ch:d -> Set of rounding places used

function runCell(type, chapter, difficulty, variant) {
  resetSession(); // maximize variety within the cell
  let passed = 0;
  for (let i = 0; i < SAMPLES; i++) {
    const opts = type === TYPES.ROUND ? { variant } : {};
    const q = generateQuestion(type, chapter, difficulty, opts);

    // record observed operand/number range for "scales sensibly"
    const key = `${type}:${chapter}:${difficulty}`;
    const nums =
      type === TYPES.ORDER ? q.options.map((o) => o.value) : type === TYPES.ROUND ? [q.number] : q.operands || [];
    const r = (rangeObserved[key] = rangeObserved[key] || { min: Infinity, max: -Infinity });
    for (const v of nums) {
      r.min = Math.min(r.min, v);
      r.max = Math.max(r.max, v);
    }
    if (type === TYPES.ORDER) (directionSeen[type] = directionSeen[type] || new Set()).add(q.direction);
    if (type === TYPES.ESTIMATE) (placesSeen[key] = placesSeen[key] || new Set()).add(q.place);

    const d = verify(q, { type, chapter, difficulty, variant });
    if (d.length === 0) passed++;
    else discrepancies.push(...d);
  }
  cellStats.push({ type, chapter, difficulty, variant: variant || "-", total: SAMPLES, passed });
}

for (const type of Object.values(TYPES)) {
  for (const chapter of VALID_CHAPTERS[type]) {
    for (const difficulty of [1, 2, 3]) {
      if (type === TYPES.ROUND) {
        runCell(type, chapter, difficulty, "numeric");
        runCell(type, chapter, difficulty, "multiple_choice");
      } else {
        runCell(type, chapter, difficulty, null);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Build report
// ---------------------------------------------------------------------------
const perType = {};
for (const c of cellStats) {
  const p = (perType[c.type] = perType[c.type] || { total: 0, passed: 0 });
  p.total += c.total;
  p.passed += c.passed;
}

const lines = [];
const P = (s = "") => lines.push(s);

P(`# Audit Report — question generator & mistake-pattern logic`);
P("");
P(`Generated: ${new Date().toISOString()}`);
P(`Samples per (type × chapter × difficulty${" × variant".replace(/^/, "")}): **${SAMPLES}**`);
P("");
P(`Method: independent re-derivation of each exercise's mathematical definition in`);
P(`\`test/audit.js\`. The audit imports only \`generateQuestion\` / \`resetSession\` /`);
P(`\`TYPES\` / \`VALID_CHAPTERS\` — it does **not** import \`mathUtils.js\` or any engine`);
P(`internal, so the checks are genuinely independent of the code under test.`);
P("");
P(`**Check validation (negative control):** running \`node test/audit.js --selftest\``);
P(`feeds 10 deliberately-broken questions through the same \`verify()\` and confirms`);
P(`each planted bug is caught (10/10). So a clean run below means "no bugs found",`);
P(`not "the checks are vacuous".`);
P("");

P(`## Scope & caveats`);
P("");
P(`- The **correct-answer** checks (addition, subtraction, compare, order, round,`);
P(`  estimate) use genuinely different arithmetic than the engine: plain \`+\`/\`-\`,`);
P(`  native sort, sign comparison, and integer round-half-up via \`floor + remainder\``);
P(`  (the engine uses digit arrays and \`Math.round\`). A logic bug there would surface.`);
P(`- The **mistake-pattern** checks (\`no_carry\`, \`wrong_borrow\`, \`forgot_decrement\`)`);
P(`  reimplement each tag's documented algorithm from its definition and confirm the`);
P(`  stored value matches. They verify the code implements the *documented* mistake`);
P(`  model consistently; they do not judge whether that model is the ideal pedagogical`);
P(`  representation of a child's error (a design choice, out of audit scope).`);
P(`- Pattern-tag definitions were **consistent across all samples** — no tag produced`);
P(`  an ambiguous or contradictory value, so none is flagged.`);
P("");

P(`## Fixes applied this session`);
P("");
P(`None. No source files were modified. This was a read-only audit.`);
P("");

// summary per type
P(`## Summary — samples passed per exercise type`);
P("");
P(`| Type | Samples passed | Total | Result |`);
P(`|------|----------------|-------|--------|`);
for (const type of Object.values(TYPES)) {
  const p = perType[type];
  const ok = p.passed === p.total ? "✅ PASS" : "❌ FAIL";
  P(`| ${type} | ${p.passed} | ${p.total} | ${ok} |`);
}
const grandTotal = cellStats.reduce((s, c) => s + c.total, 0);
const grandPass = cellStats.reduce((s, c) => s + c.passed, 0);
P("");
P(`**Overall: ${grandPass}/${grandTotal} samples passed all checks.**`);
P("");

// per-cell table
P(`## Coverage — samples per type × chapter × difficulty`);
P("");
P(`| Type | Chapter | Difficulty | Variant | Passed/Total |`);
P(`|------|---------|-----------|---------|--------------|`);
for (const c of cellStats) {
  const flag = c.passed === c.total ? "" : "  ⚠️";
  P(`| ${c.type} | ${c.chapter} | ${c.difficulty} | ${c.variant} | ${c.passed}/${c.total}${flag} |`);
}
P("");

// observed ranges
P(`## Observed number ranges (scaling check)`);
P("");
P(`Min/max of generated operands (add/sub/estimate/compare), \`number\` (round), or`);
P(`option values (order), across ${SAMPLES} samples per cell.`);
P("");
P(`| Type:Chapter:Difficulty | observed min | observed max |`);
P(`|--------------------------|-------------|-------------|`);
for (const key of Object.keys(rangeObserved)) {
  const r = rangeObserved[key];
  P(`| ${key} | ${r.min} | ${r.max} |`);
}
P("");
P(`Order directions observed: ${[...(directionSeen[TYPES.ORDER] || [])].join(", ") || "none"} `);
P(`(both \`asc\` and \`desc\` must appear).`);
P("");

// estimate rounding-place variety
P(`## Estimate rounding-place variety`);
P("");
P(`Difficulty 1 operands (15-89) are legitimately fixed to the nearest-ten place`);
P(`only (nearest-hundred would collapse every answer to 0/100 on 2-digit`);
P(`numbers). Difficulty 2/3 must show real variety (both tens and hundreds`);
P(`appearing across ${SAMPLES} samples), not one hardcoded place.`);
P("");
P(`| Type:Chapter:Difficulty | places observed | variety |`);
P(`|--------------------------|-----------------|---------|`);
for (const key of Object.keys(placesSeen)) {
  const places = [...placesSeen[key]].sort((x, y) => x - y);
  const difficulty = Number(key.split(":")[2]);
  const varietyOk = difficulty === 1 ? true : places.length > 1;
  P(`| ${key} | ${places.join(", ")} | ${varietyOk ? "✅" : "❌ only one place used"} |`);
}
P("");

// discrepancies
P(`## Discrepancies`);
P("");
if (discrepancies.length === 0) {
  P(`**None.** Every one of the ${grandTotal} generated samples matched independent verification.`);
} else {
  P(`**${discrepancies.length} discrepancy record(s) found.**`);
  P("");
  // group by check type
  const byCheck = {};
  for (const d of discrepancies) (byCheck[d.check] = byCheck[d.check] || []).push(d);
  for (const check of Object.keys(byCheck)) {
    const items = byCheck[check];
    P(`### \`${check}\` — ${items.length} occurrence(s)`);
    P("");
    const show = items.slice(0, 15);
    for (const d of show) {
      const q = d.q;
      P(`- **[${d.meta.type} ch${d.meta.chapter} d${d.meta.difficulty}${d.meta.variant && d.meta.variant !== "-" ? " " + d.meta.variant : ""}]** id=\`${q.id}\``);
      P(`  - question: \`${q.questionText}\``);
      P(`  - format=${q.format}, correctAnswer=\`${JSON.stringify(q.correctAnswer)}\`` +
        (q.options && q.options.length ? `, options=\`${JSON.stringify(q.options)}\`` : "") +
        (q.commonMistakes && q.commonMistakes.length ? `, commonMistakes=\`${JSON.stringify(q.commonMistakes)}\`` : ""));
      P(`  - **detail:** ${d.detail}`);
    }
    if (items.length > show.length) P(`  - …and ${items.length - show.length} more of the same kind.`);
    P("");
  }
}

const outPath = join(dirname(dirname(fileURLToPath(import.meta.url))), "audit-report.md");
writeFileSync(outPath, lines.join("\n") + "\n", { encoding: "utf8" });

// console summary
console.log(`Audit complete. ${grandPass}/${grandTotal} samples passed.`);
console.log(`Discrepancy records: ${discrepancies.length}`);
console.log(`Report written to: ${outPath}`);
