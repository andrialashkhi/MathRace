// Session-scoped "no repeat" tracker.
//
// A question's *signature* is a compact string that captures what makes it the
// same question (the actual numbers, plus operator/direction where that matters).
// We keep the set in module scope so the whole app shares one session; call
// resetSession() between games to clear it.

const seen = new Set();

/** Has this signature been generated already this session? */
export function isDuplicate(signature) {
  return seen.has(signature);
}

/** Record a signature so it won't be produced again this session. */
export function remember(signature) {
  seen.add(signature);
}

/** Clear all remembered signatures. Call this at the start of each new game. */
export function resetSession() {
  seen.clear();
}

/** How many distinct questions have been generated this session (debug/tests). */
export function sessionCount() {
  return seen.size;
}
