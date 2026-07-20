# Audit Report — question generator & mistake-pattern logic

Generated: 2026-07-20T08:58:03.100Z
Samples per (type × chapter × difficulty × variant): **60**

Method: independent re-derivation of each exercise's mathematical definition in
`test/audit.js`. The audit imports only `generateQuestion` / `resetSession` /
`TYPES` / `VALID_CHAPTERS` — it does **not** import `mathUtils.js` or any engine
internal, so the checks are genuinely independent of the code under test.

**Check validation (negative control):** running `node test/audit.js --selftest`
feeds 10 deliberately-broken questions through the same `verify()` and confirms
each planted bug is caught (10/10). So a clean run below means "no bugs found",
not "the checks are vacuous".

## Scope & caveats

- The **correct-answer** checks (addition, subtraction, compare, order, round,
  estimate) use genuinely different arithmetic than the engine: plain `+`/`-`,
  native sort, sign comparison, and integer round-half-up via `floor + remainder`
  (the engine uses digit arrays and `Math.round`). A logic bug there would surface.
- The **mistake-pattern** checks (`no_carry`, `wrong_borrow`, `forgot_decrement`)
  reimplement each tag's documented algorithm from its definition and confirm the
  stored value matches. They verify the code implements the *documented* mistake
  model consistently; they do not judge whether that model is the ideal pedagogical
  representation of a child's error (a design choice, out of audit scope).
- Pattern-tag definitions were **consistent across all samples** — no tag produced
  an ambiguous or contradictory value, so none is flagged.

## Fixes applied this session

None. No source files were modified. This was a read-only audit.

## Summary — samples passed per exercise type

| Type | Samples passed | Total | Result |
|------|----------------|-------|--------|
| addition | 180 | 180 | ✅ PASS |
| subtraction | 180 | 180 | ✅ PASS |
| compare | 360 | 360 | ✅ PASS |
| order | 360 | 360 | ✅ PASS |
| round | 720 | 720 | ✅ PASS |
| estimate | 180 | 180 | ✅ PASS |

**Overall: 1980/1980 samples passed all checks.**

## Coverage — samples per type × chapter × difficulty

| Type | Chapter | Difficulty | Variant | Passed/Total |
|------|---------|-----------|---------|--------------|
| addition | 3 | 1 | - | 60/60 |
| addition | 3 | 2 | - | 60/60 |
| addition | 3 | 3 | - | 60/60 |
| subtraction | 3 | 1 | - | 60/60 |
| subtraction | 3 | 2 | - | 60/60 |
| subtraction | 3 | 3 | - | 60/60 |
| compare | 1 | 1 | - | 60/60 |
| compare | 1 | 2 | - | 60/60 |
| compare | 1 | 3 | - | 60/60 |
| compare | 2 | 1 | - | 60/60 |
| compare | 2 | 2 | - | 60/60 |
| compare | 2 | 3 | - | 60/60 |
| order | 1 | 1 | - | 60/60 |
| order | 1 | 2 | - | 60/60 |
| order | 1 | 3 | - | 60/60 |
| order | 2 | 1 | - | 60/60 |
| order | 2 | 2 | - | 60/60 |
| order | 2 | 3 | - | 60/60 |
| round | 1 | 1 | numeric | 60/60 |
| round | 1 | 1 | multiple_choice | 60/60 |
| round | 1 | 2 | numeric | 60/60 |
| round | 1 | 2 | multiple_choice | 60/60 |
| round | 1 | 3 | numeric | 60/60 |
| round | 1 | 3 | multiple_choice | 60/60 |
| round | 2 | 1 | numeric | 60/60 |
| round | 2 | 1 | multiple_choice | 60/60 |
| round | 2 | 2 | numeric | 60/60 |
| round | 2 | 2 | multiple_choice | 60/60 |
| round | 2 | 3 | numeric | 60/60 |
| round | 2 | 3 | multiple_choice | 60/60 |
| estimate | 3 | 1 | - | 60/60 |
| estimate | 3 | 2 | - | 60/60 |
| estimate | 3 | 3 | - | 60/60 |

## Observed number ranges (scaling check)

Min/max of generated operands (add/sub/estimate/compare), `number` (round), or
option values (order), across 60 samples per cell.

| Type:Chapter:Difficulty | observed min | observed max |
|--------------------------|-------------|-------------|
| addition:3:1 | 12 | 89 |
| addition:3:2 | 25 | 199 |
| addition:3:3 | 128 | 879 |
| subtraction:3:1 | 12 | 87 |
| subtraction:3:2 | 27 | 196 |
| subtraction:3:3 | 133 | 891 |
| compare:1:1 | 1 | 100 |
| compare:1:2 | 4 | 494 |
| compare:1:3 | 17 | 998 |
| compare:2:1 | 134 | 9891 |
| compare:2:2 | 1964 | 199358 |
| compare:2:3 | 18844 | 967879 |
| order:1:1 | 1 | 100 |
| order:1:2 | 2 | 500 |
| order:1:3 | 4 | 991 |
| order:2:1 | 59 | 10000 |
| order:2:2 | 1212 | 198197 |
| order:2:3 | 6828 | 997805 |
| round:1:1 | 11 | 199 |
| round:1:2 | 15 | 593 |
| round:1:3 | 29 | 998 |
| round:2:1 | 18 | 1964 |
| round:2:2 | 758 | 99616 |
| round:2:3 | 10802 | 986100 |
| estimate:3:1 | 15 | 89 |
| estimate:3:2 | 31 | 290 |
| estimate:3:3 | 153 | 890 |

Order directions observed: desc, asc 
(both `asc` and `desc` must appear).

## Estimate rounding-place variety

Difficulty 1 operands (15-89) are legitimately fixed to the nearest-ten place
only (nearest-hundred would collapse every answer to 0/100 on 2-digit
numbers). Difficulty 2/3 must show real variety (both tens and hundreds
appearing across 60 samples), not one hardcoded place.

| Type:Chapter:Difficulty | places observed | variety |
|--------------------------|-----------------|---------|
| estimate:3:1 | 10 | ✅ |
| estimate:3:2 | 10, 100 | ✅ |
| estimate:3:3 | 10, 100 | ✅ |

## Discrepancies

**None.** Every one of the 1980 generated samples matched independent verification.
