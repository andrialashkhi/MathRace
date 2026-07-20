// Pure arithmetic helpers: carry/borrow detection, digit-wise "mistake" answers,
// and rounding. No randomness, no Georgian — easy to reason about and unit-test.

/** Digits of n, least-significant first, padded to `len`. 47 -> [7,4]. */
function digitsLSF(n, len) {
  const d = [];
  let x = Math.abs(n);
  while (x > 0) {
    d.push(x % 10);
    x = Math.floor(x / 10);
  }
  while (d.length < len) d.push(0);
  if (d.length === 0) d.push(0);
  return d;
}

/** Rebuild a number from least-significant-first digits. [2,3] -> 32. */
function fromDigitsLSF(d) {
  let n = 0;
  for (let i = d.length - 1; i >= 0; i--) n = n * 10 + d[i];
  return n;
}

/** True if a + b produces a carry in at least one column (i.e. requires regrouping). */
export function requiresCarry(a, b) {
  const len = Math.max(String(a).length, String(b).length);
  const da = digitsLSF(a, len);
  const db = digitsLSF(b, len);
  let carry = 0;
  for (let i = 0; i < len; i++) {
    const s = da[i] + db[i] + carry;
    if (s >= 10) return true;
    carry = 0;
  }
  return false;
}

/** True if a - b (a > b) requires borrowing in at least one column. */
export function requiresBorrow(a, b) {
  const len = Math.max(String(a).length, String(b).length);
  const da = digitsLSF(a, len);
  const db = digitsLSF(b, len);
  let borrow = 0;
  for (let i = 0; i < len; i++) {
    let top = da[i] - borrow;
    if (top < db[i]) return true;
    borrow = 0;
  }
  return false;
}

/**
 * Addition mistake: add each column independently and drop every carry.
 * 27 + 15 -> units (7+5)=12->2, tens (2+1)=3 -> 32.  patternTag: "no_carry"
 */
export function noCarryResult(a, b) {
  const len = Math.max(String(a).length, String(b).length);
  const da = digitsLSF(a, len);
  const db = digitsLSF(b, len);
  const r = da.map((x, i) => (x + db[i]) % 10);
  return fromDigitsLSF(r);
}

/**
 * Subtraction mistake: subtract the smaller digit from the larger in every
 * column, ignoring position. 52 - 27 -> |2-7|=5, |5-2|=3 -> 35.
 * patternTag: "wrong_borrow"
 */
export function smallerFromLargerResult(a, b) {
  const len = Math.max(String(a).length, String(b).length);
  const da = digitsLSF(a, len);
  const db = digitsLSF(b, len);
  const r = da.map((x, i) => Math.abs(x - db[i]));
  return fromDigitsLSF(r);
}

/**
 * Subtraction mistake: borrow into a column when needed, but forget to
 * decrement the column you borrowed from. 53 - 28 -> units 13-8=5, tens 5-2=3
 * -> 35. patternTag: "forgot_decrement"
 */
export function forgotDecrementResult(a, b) {
  const len = Math.max(String(a).length, String(b).length);
  const da = digitsLSF(a, len);
  const db = digitsLSF(b, len);
  const r = da.map((x, i) => {
    let top = x;
    if (top < db[i]) top += 10; // borrowed, but next column is NOT decremented
    return top - db[i];
  });
  return fromDigitsLSF(r);
}

/** Round n to the nearest multiple of `place` (half rounds up). */
export function roundTo(n, place) {
  return Math.round(n / place) * place;
}

/** Largest multiple of `place` that is <= n. */
export function floorTo(n, place) {
  return Math.floor(n / place) * place;
}

/** Smallest multiple of `place` that is >= n. */
export function ceilTo(n, place) {
  return Math.ceil(n / place) * place;
}
