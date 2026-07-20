// -----------------------------------------------------------------------------
// ALL Georgian-language strings live in this one file.
//
// >>> NEEDS NATIVE-SPEAKER PROOFREAD <<<
// The phrasing below was written to be simple and structural. It has NOT been
// verified by a native Georgian speaker. Before shipping to a classroom, have a
// native speaker check the imperative verb forms and the rounding "place" words.
// Everything is centralized here so a proofreader only has to touch this file.
// -----------------------------------------------------------------------------

// Colors used for the "order the numbers" exercise. Names kept in English on
// purpose — they are used as machine tags / CSS class names, not shown to kids.
export const COLORS = ["red", "blue", "green", "yellow"];

// Comparison signs (used as both the displayed option and the answer value).
export const SIGN_LT = "<";
export const SIGN_GT = ">";
export const SIGN_EQ = "=";

// "Round to the nearest ..." phrases, keyed by place value.
const NEAREST_PLACE = {
  10: "უახლოეს ათეულამდე", // nearest ten
  100: "უახლოეს ასეულამდე", // nearest hundred
  1000: "უახლოეს ათასეულამდე", // nearest thousand
};

export const text = {
  addition(a, b) {
    return `იპოვე ჯამი: ${a} + ${b} = ?`;
  },

  subtraction(a, b) {
    return `იპოვე სხვაობა: ${a} − ${b} = ?`;
  },

  compare(a, b) {
    return `შეადარე რიცხვები. რომელი ნიშანი უნდა ჩაისვას? ${a} ⬚ ${b}`;
  },

  // direction: "asc" | "desc"
  order(numbers, direction) {
    const how =
      direction === "asc"
        ? "ზრდადობით (პატარადან დიდისკენ)"
        : "კლებადობით (დიდიდან პატარასკენ)";
    return `დაალაგე რიცხვები ${how}: ${numbers.join(", ")}`;
  },

  round(n, place) {
    return `დაამრგვალე რიცხვი ${n} ${NEAREST_PLACE[place]}.`;
  },

  // op: "+" | "−"; place: 10 | 100 — the rounding place actually used to
  // compute the estimate. Stated explicitly so the question isn't ambiguous
  // about which place value the student should round to.
  estimate(a, b, op, place) {
    const word = op === "+" ? "ჯამი" : "სხვაობა"; // sum | difference
    return `დაამრგვალე რიცხვები ${NEAREST_PLACE[place]} და შეაფასე: დაახლოებით რამდენია ${word}? ${a} ${op} ${b}`;
  },
};
