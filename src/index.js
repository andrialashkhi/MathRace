// Public API for the core question/grading engine.
//
// Everything a caller (the future UI / game layer) needs:
//   generateQuestion(type, chapter, difficulty, opts?)  -> question object
//   gradeAnswer(question, submittedAnswer)               -> { correct, matchedPattern }
//   resetSession()                                       -> clear no-repeat memory
//   TYPES, VALID_CHAPTERS                                -> metadata

export { generateQuestion, TYPES, VALID_CHAPTERS } from "./generators.js";
export { gradeAnswer } from "./grader.js";
export { resetSession, sessionCount } from "./tracker.js";
