// Small random-number helpers used by the generators.
// Kept separate so they can later be swapped for a seedable RNG if we want
// reproducible sessions (e.g. for testing or replaying a game).

/** Inclusive random integer in [min, max]. */
export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Pick a random element of an array. */
export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Return a new array that is a shuffled copy of `arr` (Fisher–Yates). */
export function shuffle(arr) {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Generate `count` distinct integers in [min, max]. */
export function distinctInts(count, min, max) {
  const seen = new Set();
  // Guard against asking for more distinct values than the range allows.
  const capacity = max - min + 1;
  const n = Math.min(count, capacity);
  let guard = 0;
  while (seen.size < n && guard < 10000) {
    seen.add(randInt(min, max));
    guard++;
  }
  return [...seen];
}
