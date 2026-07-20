// Grading engine.
//
// The teacher types in only the FINAL answer, so we can't see a student's work.
// For addition/subtraction we match a wrong answer against the precomputed
// commonMistakes to classify the error purely by number comparison.

/** Normalize an ordering submission to a plain array of numbers. */
function toNumberArray(x) {
  if (!Array.isArray(x)) return null;
  return x.map((el) =>
    el !== null && typeof el === "object" && "value" in el ? Number(el.value) : Number(el)
  );
}

/** Type-aware equality: numbers compare as numbers, signs compare as strings. */
function valuesEqual(correctAnswer, submitted) {
  if (typeof correctAnswer === "number") {
    return Number(submitted) === correctAnswer;
  }
  return String(submitted) === String(correctAnswer);
}

/**
 * gradeAnswer(question, submittedAnswer)
 * Returns { correct: boolean, matchedPattern: string | null }.
 */
export function gradeAnswer(question, submittedAnswer) {
  let correct = false;

  switch (question.format) {
    case "numeric":
      correct = Number(submittedAnswer) === Number(question.correctAnswer);
      break;

    case "multiple_choice":
      correct = valuesEqual(question.correctAnswer, submittedAnswer);
      break;

    case "ordering": {
      const submitted = toNumberArray(submittedAnswer);
      const expected = question.correctAnswer;
      correct =
        submitted !== null &&
        submitted.length === expected.length &&
        submitted.every((v, i) => v === expected[i]);
      break;
    }

    default:
      throw new Error(`Unknown question format "${question.format}".`);
  }

  if (correct) {
    return { correct: true, matchedPattern: null };
  }

  // Wrong answer: for add/sub, try to classify it against known mistake patterns.
  if (
    (question.type === "addition" || question.type === "subtraction") &&
    Array.isArray(question.commonMistakes)
  ) {
    const submittedNum = Number(submittedAnswer);
    const match = question.commonMistakes.find((m) => Number(m.answer) === submittedNum);
    if (match) {
      return { correct: false, matchedPattern: match.patternTag };
    }
  }

  return { correct: false, matchedPattern: null };
}
