// Terminal test harness. Run it with the bundled Node (see README).
//
// It (1) generates 5 questions of every type across that type's valid chapters,
// (2) runs the three required grading cases, and (3) sanity-checks no-repeat.
// Output goes to the console AND to test/test-output.md (UTF-8) — open that file
// in an editor if the terminal mangles the Georgian text.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  generateQuestion,
  gradeAnswer,
  resetSession,
  sessionCount,
  TYPES,
  VALID_CHAPTERS,
} from "../src/index.js";

const lines = [];
function log(s = "") {
  console.log(s);
  lines.push(s);
}

function fmtOptions(q) {
  if (q.format === "ordering") {
    return q.options.map((o) => `${o.value}(${o.color})`).join(", ");
  }
  if (q.format === "multiple_choice") {
    return q.options.join(" | ");
  }
  return "—";
}

function fmtQuestion(q) {
  const parts = [];
  parts.push(`  [${q.id}]  type=${q.type}  ch=${q.chapter}  format=${q.format}`);
  parts.push(`  Q: ${q.questionText}`);
  parts.push(`  correctAnswer: ${JSON.stringify(q.correctAnswer)}`);
  if (q.format === "multiple_choice" || q.format === "ordering") {
    parts.push(`  options: ${fmtOptions(q)}`);
  }
  if (q.direction) parts.push(`  direction: ${q.direction}`);
  if (q.commonMistakes && q.commonMistakes.length) {
    const cm = q.commonMistakes.map((m) => `${m.answer} <${m.patternTag}>`).join(", ");
    parts.push(`  commonMistakes: ${cm}`);
  }
  return parts.join("\n");
}

// ---------------------------------------------------------------------------
// 1) Generate 5 of each type, spread across valid chapters (+ both round variants)
// ---------------------------------------------------------------------------
resetSession();
log("=".repeat(78));
log("SECTION 1 — 5 questions per type, across each type's valid chapters");
log("=".repeat(78));

for (const type of Object.values(TYPES)) {
  const chapters = VALID_CHAPTERS[type];
  log("");
  log(`### ${type.toUpperCase()}  (valid chapters: ${chapters.join(", ")})`);
  for (let i = 0; i < 5; i++) {
    const chapter = chapters[i % chapters.length];
    const difficulty = (i % 3) + 1;
    // Exercise both round variants so the caller-picks behavior is visible.
    const opts =
      type === TYPES.ROUND
        ? { variant: i % 2 === 0 ? "numeric" : "multiple_choice" }
        : {};
    const q = generateQuestion(type, chapter, difficulty, opts);
    log("");
    log(fmtQuestion(q));
  }
}

// ---------------------------------------------------------------------------
// 2) Grading cases: correct / incorrect-matching-a-common-mistake / incorrect-no-match
// ---------------------------------------------------------------------------
log("");
log("=".repeat(78));
log("SECTION 2 — grading cases");
log("=".repeat(78));

// Find an addition question that actually has a common mistake to test against.
let addQ = generateQuestion(TYPES.ADDITION, 3, 2);
let guard = 0;
while (addQ.commonMistakes.length === 0 && guard < 50) {
  addQ = generateQuestion(TYPES.ADDITION, 3, 2);
  guard++;
}

log("");
log("Addition question under test:");
log(fmtQuestion(addQ));

const correctAns = addQ.correctAnswer;
const mistakeAns = addQ.commonMistakes[0].answer;
// A wrong answer engineered to match neither correct nor any common mistake.
let noMatchAns = correctAns + 1;
const known = new Set([correctAns, ...addQ.commonMistakes.map((m) => m.answer)]);
while (known.has(noMatchAns)) noMatchAns++;

log("");
log(`  (a) correct answer  = ${correctAns}  -> ${JSON.stringify(gradeAnswer(addQ, correctAns))}`);
log(
  `  (b) common-mistake  = ${mistakeAns} (<${addQ.commonMistakes[0].patternTag}>)  -> ${JSON.stringify(
    gradeAnswer(addQ, mistakeAns)
  )}`
);
log(`  (c) wrong, no match = ${noMatchAns}  -> ${JSON.stringify(gradeAnswer(addQ, noMatchAns))}`);

// Bonus: show grading works for the other formats too.
const cmpQ = generateQuestion(TYPES.COMPARE, 1, 2);
log("");
log("Compare question (multiple_choice):");
log(fmtQuestion(cmpQ));
log(`  correct pick "${cmpQ.correctAnswer}" -> ${JSON.stringify(gradeAnswer(cmpQ, cmpQ.correctAnswer))}`);
const wrongSign = ["<", ">", "="].find((s) => s !== cmpQ.correctAnswer);
log(`  wrong pick   "${wrongSign}" -> ${JSON.stringify(gradeAnswer(cmpQ, wrongSign))}`);

const ordQ = generateQuestion(TYPES.ORDER, 2, 3);
log("");
log("Order question (ordering):");
log(fmtQuestion(ordQ));
log(`  correct order ${JSON.stringify(ordQ.correctAnswer)} -> ${JSON.stringify(gradeAnswer(ordQ, ordQ.correctAnswer))}`);
const scrambled = ordQ.correctAnswer.slice().reverse();
log(`  reversed order ${JSON.stringify(scrambled)} -> ${JSON.stringify(gradeAnswer(ordQ, scrambled))}`);
// Also prove that submitting the raw {value,color} option objects grades fine.
log(
  `  submit option-objects (in correct order) -> ${JSON.stringify(
    gradeAnswer(
      ordQ,
      ordQ.correctAnswer.map((v) => ({ value: v, color: "red" }))
    )
  )}`
);

// ---------------------------------------------------------------------------
// 3) No-repeat sanity check
// ---------------------------------------------------------------------------
log("");
log("=".repeat(78));
log("SECTION 3 — no-repeat tracker");
log("=".repeat(78));

resetSession();
const sigs = new Set();
let dupes = 0;
for (let i = 0; i < 200; i++) {
  const q = generateQuestion(TYPES.COMPARE, 1, 1); // small range => collisions likely without the tracker
  const sig = `${q.operands[0]}?${q.operands[1]}`;
  if (sigs.has(sig)) dupes++;
  sigs.add(sig);
}
log("");
log(`Generated 200 compare questions (small range). Repeated signatures: ${dupes}`);
log(`Tracker session size after run: ${sessionCount()}`);
resetSession();
log(`After resetSession(), session size: ${sessionCount()}`);

// ---------------------------------------------------------------------------
// Write the UTF-8 report file.
// ---------------------------------------------------------------------------
const outPath = join(dirname(fileURLToPath(import.meta.url)), "test-output.md");
writeFileSync(outPath, "```\n" + lines.join("\n") + "\n```\n", { encoding: "utf8" });
console.log(`\n(Full UTF-8 report written to: ${outPath})`);
