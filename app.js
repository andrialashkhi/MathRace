// -----------------------------------------------------------------------------
// Game shell: team setup -> mode select -> Game 1 config -> Game 1 buzzer race.
// Pure vanilla ES modules. Imports the question/grading engine from src/.
//
// NOTE: the Georgian UI strings below are NOT yet native-speaker proofread
// (same caveat as src/georgian.js). They're grouped in UI{} so a proofreader
// only has to touch one place.
// -----------------------------------------------------------------------------

import {
  generateQuestion,
  gradeAnswer,
  resetSession,
  TYPES,
  VALID_CHAPTERS,
} from "./src/index.js";

// ---- Georgian UI strings (needs proofread) --------------------------------
const UI_KA = {
  appTitle: "მათრბოლა",
  // setup
  setupTitle: "გუნდების მომზადება",
  teamCount: "გუნდების რაოდენობა",
  teamName: "გუნდი",
  continue: "გაგრძელება",
  // mode select
  chooseGame: "აირჩიე თამაში",
  game1: "თამაში 1 — სისწრაფის რბოლა",
  game2: "თამაში 2 — დაფის რბოლა",
  game3: "თამაში 3 — ცხრილის დაპყრობა",
  game1Desc:
    "გუნდები ეჯიბრებიან სისწრაფეში. მასწავლებელი აჩვენებს ამოცანას და პირველი გუნდი, რომელიც ხელს აიწევს, პასუხობს. სწორ პასუხზე გუნდი იღებს ქულას; ვინც პირველი დააგროვებს საჭირო ქულებს, იმარჯვებს.",
  game2Desc:
    "გუნდები მოძრაობენ სათამაშო დაფაზე. თითოეული გუნდი პასუხობს ამოცანას და სწორ პასუხზე გადადგამს ნაბიჯებს წინ. გუნდი, რომელიც პირველი მიაღწევს ფინიშს, იმარჯვებს.",
  game3Desc:
    "გუნდები ეჯიბრებიან გამრავლების ცხრილის (1-დან 100-მდე) დაპყრობაში. ყოველ რაუნდში მონიშნულია ერთი უჯრა — გუნდი, რომელიც პირველი გასცემს სწორ პასუხს, იპყრობს მას თავისი ფერით. ბოლოს ყველაზე მეტი ქულის მფლობელი იმარჯვებს.",
  // config
  roundTarget: "სამიზნე ქულა",
  chapters: "თავები",
  chapter: "თავი",
  boardSize: "დაფის ზომა",
  start: "დაწყება",
  pickChapterWarn: "აირჩიე მინიმუმ ერთი თავი.",
  game2Placeholder: "თამაში 2 დაემატება მომავალ ვერსიაში.",
  // play
  whoAnswers: "ვინ პასუხობს? (დააჭირე გუნდს)",
  pickTeamFirst: "ჯერ აირჩიე გუნდი.",
  submit: "პასუხის დადასტურება",
  resetPick: "თავიდან",
  stop: "შეჩერება",
  correct: "სწორია! 🎉",
  wrongTryAnother: "არასწორია. სცადე სხვა გუნდი.",
  teamAlreadyTried: "ამ გუნდმა უკვე სცადა ამ კითხვაზე.",
  noneCorrect: "ვერცერთმა გუნდმა ვერ უპასუხა. შემდეგი ამოცანა.",
  orderHint: "დააჭირე ფერად უჯრებს სწორი თანმიმდევრობით.",
  // stop modal
  stopConfirm: "დარწმუნებული ხართ, რომ გსურთ თამაშის შეჩერება?",
  homeConfirm: "მთავარ გვერდზე დაბრუნება? მიმდინარე თამაში დაიკარგება.",
  yes: "დიახ",
  no: "არა",
  // play — adaptive difficulty indicator
  difficulty: "სირთულე",
  asksLabel: "გეკითხება:",
  // win
  wonPrefix: "გაიმარჯვა გუნდმა",
  newGame: "ახალი თამაში",
  seeResults: "შედეგების ნახვა",
  // insight
  insightTitle: "რას გამოვიკვლიეთ ამ თამაშში",
  insightStopped: "თამაში შეჩერდა",
  byTypeTitle: "შედეგები დავალების ტიპების მიხედვით",
  patternsTitle: "შეცდომები, რაც შევნიშნეთ",
  colCorrect: "სწორი",
  colIncorrect: "არასწორი",
  timesLabel: "-ჯერ",
  noQuestions: "ამ თამაშში დავალებებზე პასუხი არ გაცემულა.",
  backToMenu: "მთავარ მენიუში",
  // Game 2 (board race)
  g2Title: "თამაში 2 — დაფის რბოლა",
  g2Start: "დაწყება",
  teamCharacters: "გუნდის პერსონაჟები",
  prevCharacter: "წინა პერსონაჟი",
  nextCharacter: "შემდეგი პერსონაჟი",
  home: "მთავარი",
  turnOf: "რიგი",
  rollDice: "კამათლის გაგორება 🎲",
  rolled: "მოვიდა",
  startZone: "დაწყება",
  answerToKeep: "უპასუხე, რომ დარჩე ამ უჯრაზე",
  // special squares
  sqBonus: "ბონუსი",
  sqTrap: "ხაფანგი",
  sqSteal: "მოტაცება",
  landedBonus: "ბონუსის უჯრა! სწორ პასუხზე დამატებით +3 ნაბიჯი.",
  landedTrap: "ხაფანგის უჯრა! სწორი პასუხიც კი გაბრუნებს უკან.",
  landedSteal: "მოტაცების უჯრა! სწორ პასუხზე ლიდერს ადგილს გამოაცვლი.",
  landedNormal: "ჩვეულებრივი უჯრა.",
  // result messages
  resStay: "სწორია! რჩები ამ უჯრაზე. 🎉",
  resBack: "არასწორია. ბრუნდები საწყის პოზიციაზე.",
  resBonus: "სწორია! ბონუსი — დამატებით +3 ნაბიჯი! 🎉",
  resTrap: "ხაფანგი! სწორიც კი — მაინც ბრუნდები უკან.",
  resStealYes: "მოტაცება გამოვიდა! ლიდერს ადგილი გამოუცვალე.",
  resStealNone: "შენ უკვე ლიდერი ხარ — არაფერი შეიცვალა.",
  // big centered result text (Part D)
  bigCorrect: "სწორია!",
  bigWrong: "არასწორია!",
  bigTrap: "ხაფანგი!",
  bigBonus: "ბონუსი! +3",
  bigSteal: "მოტაცება!",
  // turn announcement (Game 2)
  turnAnnounce: "-ის ჯერია!",
  rollNow: "დააგორე კამათელი 🎲",
  // ---- landing page (ALL new copy — needs native-speaker proofread) ----
  landHeroTagline: "სახალისო მათემატიკის თამაშები მთელი კლასისთვის, ერთ ეკრანზე.",
  landStart: "დაწყება",
  landWhatTitle: "რას წარმოადგენს საიტი",
  landWhatBody:
    "ეს არის მათემატიკის სავარჯიშო თამაში დაწყებითი კლასებისთვის, რაც ეხმარება ბავშვებს მეტად სახალისო აქტივობებით განათელბის მიღება. მასწავლებელი მართავს თამაშს ერთი საერთო ეკრანიდან (პროექტორი ან ტელევიზორი). მოსწავლეებს პირადი მოწყობილობა არ სჭირდებათ. განსხვავებული სათამაშო რეჟიმი აქცევს სავარჯიშოებს გუნდურ შეჯიბრში.",
  landFeaturesTitle: "შესაძლებლობები",
  landBenefitsTitle: "რას აძლევს ეს კლასს",
  landUpdatesTitle: "განახლებები",
  landUpdatesPlaceholder:
    "დაემატა ახალი თამაში: ცხრილის დაპყრობა — გამრავლების სავარჯიშო მე-4 კლასისთვის.<br>ახალი, უფრო კაშკაშა დიზაინი მთელი საიტისთვის.<br>ინტერფეისი გადიდებულია, რომ პროექტორზეც კარგად იკითხებოდეს.<br>გუნდებს შეუძლიათ თავად აირჩიონ პერსონაჟი თამაში 2-ში.<br>თამაში 1-ს დაემატა ადაპტური სირთულის ლოგიკა.",
  featAdaptiveT: "ადაპტური სირთულე",
  featAdaptiveB: "დავალებების სირთულე ავტომატურად ერგება კლასის პასუხებს.",
  featInsightT: "მასწავლებლის ანალიზი",
  featInsightB: "თამაშის ბოლოს ჩანს, რომელ ტიპებში და შეცდომებში სჭირდებათ ვარჯიში.",
  featModesT: "სათამაშო რეჟიმები",
  featModesB: "სისწრაფის რბოლა და დაფის რბოლა, სხვადასხვა სტილის თამაშები.",
  featChaptersT: "თავების არჩევა",
  featChaptersB: "სხვადასხვა თემიდან აირჩიე ის, რაც შენს გაკვეთილს სჭირდება.",
  benTeacherT: "მასწავლებელს",
  benTeacherB: "ხედავს კლასის სუსტ წერტილებს დამატებითი შემოწმების გარეშე.",
  benStudentT: "მოსწავლეებს",
  benStudentB: "პირადი მოწყობილობის გარეშეც ყველა სრულად მონაწილეობს.",
  benCurriculumT: "პროგრამას",
  benCurriculumB: "სავარჯიშოები აგებულია დაწყებითი კლასების სასწავლო პროგრამის მიხედვით.",
  proofreadNote: "შენიშვნა: ტექსტს სჭირდება ენობრივი კორექტურა.",
  // ---- how-to-run strip (landing) ----
  howToTitle: "როგორ დავიწყოთ",
  howToStep1: "დააკავშირე მოწყობილობა პროექტორთან ან ტელევიზორთან.",
  howToStep2: "აირჩიე სათამაშო რეჟიმი.",
  howToStep3: "აირჩიე თავი და დაიწყე თამაში.",
  // ---- difficulty badge explanation (Game 1) ----
  difficultyExplain: "სირთულე იცვლება ავტომატურად, კლასის ბოლო პასუხების მიხედვით.",
  // ---- credits (landing footer) ----
  creditsLink: "კრედიტები",
  creditsTitle: "კრედიტები",
  creditsCharacters: "პერსონაჟები: Open Peeps by Pablo Stanley (openpeeps.com). ლიცენზია CC0 — თავისუფალი გამოყენებისთვის, ატრიბუცია არ საჭიროებს.",
  creditsFonts: "შრიფტები: Nunito და Noto Sans Georgian. ლიცენზია SIL Open Font License 1.1.",
  creditsAudio: "ხმოვანი ეფექტები გენერირდება პირდაპირ ბრაუზერში, ფაილების გარეშე. ფონური მუსიკა ცალკეა დამატებული თითოეული თამაშისთვის.",
  creditsLogo: "ლოგო: მოდაზგმულია Twemoji-ის დროშის გრაფიკიდან. ლიცენზია CC BY 4.0 (twemoji, jdecked/twemoji).",
  creditsClose: "დახურვა",
  muteBtnTitle: "ხმა",
  // ---- Game 3 (table conquest) ----
  g3Rounds: "რაუნდები",
  g3Round: "რაუნდი",
  g3Conquer: "დაიპყარი ეს უჯრა",
  g3SquareBonus: "კვადრატი! ორმაგი ქულა 🎉",
  g3LineBonus: "მთელი ხაზი! ბონუსი +3 🎉",
  g3Cells: "უჯრები",
  g3Points: "ქულები",
  g3Standings: "შედეგები",
  g3TableTitle: "შედეგები ცხრილების მიხედვით",
  g3TableCol: "ცხრილი",
  g3NoAttempts: "ამ თამაშში ვერცერთ უჯრას ვერ უპასუხეს.",
};

// ---- English UI strings (mirror of UI_KA; natural grammar, not literal) ---
const UI_EN = {
  appTitle: "MathRace",
  setupTitle: "Team Setup",
  teamCount: "Number of Teams",
  teamName: "Team",
  continue: "Continue",
  chooseGame: "Choose a Game",
  game1: "Game 1 — Speed Race",
  game2: "Game 2 — Board Race",
  game3: "Game 3 — Table Conquest",
  game1Desc:
    "Teams compete for speed. The teacher shows a question, and whichever team raises its hand first gets to answer. A correct answer earns the team a point; whoever reaches the target score first wins.",
  game2Desc:
    "Teams move around a game board. Each team answers a question and moves forward on a correct answer. The first team to reach the finish line wins.",
  game3Desc:
    "Teams compete to conquer the multiplication table (1 to 100). Each round highlights one cell — the first team to answer correctly claims it in their color. Whoever holds the most points at the end wins.",
  roundTarget: "Target Score",
  chapters: "Chapters",
  chapter: "Chapter",
  boardSize: "Board Size",
  start: "Start",
  pickChapterWarn: "Choose at least one chapter.",
  game2Placeholder: "Game 2 will be added in a future version.",
  whoAnswers: "Who's answering? (Tap a team)",
  pickTeamFirst: "Choose a team first.",
  submit: "Submit Answer",
  resetPick: "Reset",
  stop: "Stop",
  correct: "Correct! 🎉",
  wrongTryAnother: "Incorrect. Try another team.",
  teamAlreadyTried: "This team already tried this question.",
  noneCorrect: "No team answered correctly. Next question.",
  orderHint: "Tap the colored boxes in the correct order.",
  stopConfirm: "Are you sure you want to stop the game?",
  homeConfirm: "Return to the main menu? The current game will be lost.",
  yes: "Yes",
  no: "No",
  difficulty: "Difficulty",
  asksLabel: "Asking:",
  wonPrefix: "Winner",
  newGame: "New Game",
  seeResults: "View Results",
  insightTitle: "What We Learned From This Game",
  insightStopped: "Game Stopped",
  byTypeTitle: "Results by Question Type",
  patternsTitle: "Mistakes We Noticed",
  colCorrect: "Correct",
  colIncorrect: "Incorrect",
  timesLabel: " times",
  noQuestions: "No questions were answered in this game.",
  backToMenu: "Main Menu",
  g2Title: "Game 2 — Board Race",
  g2Start: "Start",
  teamCharacters: "Team Characters",
  prevCharacter: "Previous Character",
  nextCharacter: "Next Character",
  home: "Home",
  turnOf: "Turn",
  rollDice: "Roll the Dice 🎲",
  rolled: "Rolled",
  startZone: "Start",
  answerToKeep: "Answer correctly to stay on this square",
  sqBonus: "Bonus",
  sqTrap: "Trap",
  sqSteal: "Steal",
  landedBonus: "Bonus square! A correct answer earns 3 extra steps.",
  landedTrap: "Trap square! Even a correct answer sends you back.",
  landedSteal: "Steal square! A correct answer swaps places with the leader.",
  landedNormal: "A regular square.",
  resStay: "Correct! You stay on this square. 🎉",
  resBack: "Incorrect. You return to your starting position.",
  resBonus: "Correct! Bonus — 3 extra steps! 🎉",
  resTrap: "Trap! Even so, you go back.",
  resStealYes: "Steal successful! You swapped places with the leader.",
  resStealNone: "You're already in the lead — nothing changed.",
  bigCorrect: "Correct!",
  bigWrong: "Incorrect!",
  bigTrap: "Trap!",
  bigBonus: "Bonus! +3",
  bigSteal: "Steal!",
  turnAnnounce: "'s turn!",
  rollNow: "Roll the Dice 🎲",
  landHeroTagline: "Fun math games for the whole class, on one screen.",
  landStart: "Start",
  landWhatTitle: "What This Site Is",
  landWhatBody:
    "This is a math practice game for elementary school students, helping children learn through more enjoyable activities. The teacher runs the game from one shared screen (a projector or TV). Students don't need a personal device. Different game modes turn the exercises into a team competition.",
  landFeaturesTitle: "Features",
  landBenefitsTitle: "What This Gives the Class",
  landUpdatesTitle: "Updates",
  landUpdatesPlaceholder:
    "New game added: Table Conquest — multiplication practice for 4th grade.<br>A new, brighter design for the whole site.<br>The interface has been enlarged so it's easy to read on a projector too.<br>Teams can now choose their own character in Game 2.<br>Game 1 now has adaptive-difficulty logic.",
  featAdaptiveT: "Adaptive Difficulty",
  featAdaptiveB: "Question difficulty automatically adjusts to the class's answers.",
  featInsightT: "Teacher Insights",
  featInsightB: "At the end of the game, see which question types and mistakes need more practice.",
  featModesT: "Game Modes",
  featModesB: "Speed race and board race, different styles of gameplay.",
  featChaptersT: "Chapter Selection",
  featChaptersB: "Choose from different topics whatever your lesson needs.",
  benTeacherT: "For Teachers",
  benTeacherB: "See the class's weak spots without any extra grading.",
  benStudentT: "For Students",
  benStudentB: "Everyone can fully participate, even without a personal device.",
  benCurriculumT: "For the Curriculum",
  benCurriculumB: "Exercises are built around the elementary school curriculum.",
  proofreadNote: "Note: this text still needs a language proofread.",
  howToTitle: "How to Get Started",
  howToStep1: "Connect your device to a projector or TV.",
  howToStep2: "Choose a game mode.",
  howToStep3: "Choose a chapter and start the game.",
  difficultyExplain: "Difficulty adjusts automatically, based on the class's recent answers.",
  creditsLink: "Credits",
  creditsTitle: "Credits",
  creditsCharacters: "Characters: Open Peeps by Pablo Stanley (openpeeps.com). Licensed CC0 — free to use, no attribution required.",
  creditsFonts: "Fonts: Nunito and Noto Sans Georgian. Licensed under the SIL Open Font License 1.1.",
  creditsAudio: "Sound effects are generated directly in the browser, with no files. Background music is separately added for each game.",
  creditsLogo: "Logo: adapted from Twemoji's flag graphic. Licensed CC BY 4.0 (twemoji, jdecked/twemoji).",
  creditsClose: "Close",
  muteBtnTitle: "Volume",
  // ---- Game 3 (table conquest) ----
  g3Rounds: "Rounds",
  g3Round: "Round",
  g3Conquer: "Claim this cell",
  g3SquareBonus: "Square! Double points 🎉",
  g3LineBonus: "Whole line! Bonus +3 🎉",
  g3Cells: "Cells",
  g3Points: "Points",
  g3Standings: "Standings",
  g3TableTitle: "Results by Times Table",
  g3TableCol: "Table",
  g3NoAttempts: "No cells were attempted in this game.",
};

// UI resolves to the current language's strings on every access, so every
// existing `UI.xxx` call site in this file switches automatically — no need
// to touch each one individually when adding a language.
const UI = new Proxy({}, { get: (_, key) => (state.lang === "en" ? UI_EN : UI_KA)[key] });

function chapterLabel(n) { return `${UI.chapter} ${n}`; }

// Georgian names for each exercise type (for the insight breakdown).
const TYPE_LABELS_KA = {
  addition: "შეკრება",
  subtraction: "გამოკლება",
  compare: "შედარება",
  order: "დალაგება",
  round: "დამრგვალება",
  estimate: "შეფასება",
};
const TYPE_LABELS_EN = {
  addition: "Addition",
  subtraction: "Subtraction",
  compare: "Comparison",
  order: "Ordering",
  round: "Rounding",
  estimate: "Estimation",
};
const TYPE_LABELS = new Proxy({}, { get: (_, key) => (state.lang === "en" ? TYPE_LABELS_EN : TYPE_LABELS_KA)[key] });

// Pedagogical explanations for the mistake pattern tags the engine can emit.
// (mathUtils.js produces exactly: no_carry, wrong_borrow, forgot_decrement.)
// NOTE: Georgian below still needs a native-speaker proofread.
const PATTERN_INFO_KA = {
  no_carry: {
    title: "გადატანის დავიწყება",
    text: "მოსწავლეებმა შეკრებისას ერთეულების გადატანა (გადანაცვლება) დაივიწყეს.",
  },
  wrong_borrow: {
    title: "არასწორი გადასესხება",
    text: "გამოკლებისას პატარა ციფრს დიდი ციფრიდან აკლებდნენ, სვეტიდან გადასესხების ნაცვლად.",
  },
  forgot_decrement: {
    title: "შემცირების დავიწყება",
    text: "გამოკლებისას გადაისესხეს, მაგრამ მეზობელი სვეტის ერთით შემცირება დაავიწყდათ.",
  },
};
const PATTERN_INFO_EN = {
  no_carry: {
    title: "Forgetting to Carry",
    text: "Students forgot to carry the ones digit over when adding.",
  },
  wrong_borrow: {
    title: "Incorrect Borrowing",
    text: "When subtracting, they subtracted the smaller digit from the larger one instead of borrowing from the next column.",
  },
  forgot_decrement: {
    title: "Forgetting to Decrement",
    text: "When subtracting, they borrowed correctly but forgot to decrease the neighboring column by one.",
  },
};
const PATTERN_INFO = new Proxy({}, { get: (_, key) => (state.lang === "en" ? PATTERN_INFO_EN : PATTERN_INFO_KA)[key] });

// How many bundled Open Peeps characters exist in assets/characters/.
const PEEP_COUNT = 20;

// ---- app state ------------------------------------------------------------
const state = {
  screen: "landing", // landing | setup | mode | play | win | insight | g2play | g2win
  teams: [], // [{ name, score }]
  config: {
    mode: null, // "game1" | "game2" | "game3"
    roundTarget: 7,
    boardSize: 30, // Game 2 board sizes: 30 | 40 | 50
    g3Rounds: 40, // Game 3 round cap: 25 | 40 | 60
    chapters: new Set([1]),
  },
  play: freshPlayState(),
  g2: null, // Game 2 (board race) state; null unless a Game 2 is in progress
  g3: null, // Game 3 (table conquest) state; null unless a Game 3 is in progress
  modal: null, // null | { ... } (stop-confirm)
  showCredits: false, // landing-page credits modal
  lang: "ka", // "ka" | "en" — display language; never alters generated numbers/logic
};

// A clean play-state. Splits GAME-scoped fields (reset once per game) from
// QUESTION-scoped fields (reset by nextQuestion each question).
function freshPlayState() {
  return {
    // question-scoped
    question: null,
    selectedTeam: null, // index of team currently answering
    lockedTeams: [], // teams that already missed THIS question (locked out for it)
    orderPick: [], // for ordering: option indices in tap order
    feedback: null, // { text, kind: "good"|"bad" }
    character: 1, // which peep asks this question
    // game-scoped (adaptive difficulty + insight tracking)
    difficulty: 2, // current class-wide tier; every game starts at 2
    window: [], // rolling last-3 results (booleans), reset on tier change
    history: [], // one record per resolved question: { type, chapter, correct }
    patternCounts: {}, // matchedPattern tag -> count (across all wrong attempts)
    winnerName: null, // set when the game ends by win condition
    lastAnimatedQid: null, // gates the character entrance animation
  };
}

const app = document.getElementById("app");

// ---- tiny helpers ---------------------------------------------------------
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

// "3-ჯერ" (Georgian, invariant) vs "3 times" / "1 time" (English, pluralized).
function timesText(n) {
  return state.lang === "en" ? `${n} time${n === 1 ? "" : "s"}` : `${n}${UI.timesLabel}`;
}

// English mirror of src/georgian.js's text.* functions, keyed off already-
// generated question data (operands/place/direction/etc.). This never
// recomputes numbers or correctness — the engine (src/generators.js,
// src/georgian.js) is untouched and still the only source of truth for those.
// It only re-phrases the SAME generated question for display. Georgian stays
// exactly as originally generated (q.questionText, read as-is, unchanged).
const NEAREST_PLACE_EN = { 10: "nearest ten", 100: "nearest hundred", 1000: "nearest thousand" };
function questionTextFor(q) {
  if (state.lang !== "en") return q.questionText;
  switch (q.type) {
    case TYPES.ADDITION: {
      const [a, b] = q.operands;
      return `Find the sum: ${a} + ${b} = ?`;
    }
    case TYPES.SUBTRACTION: {
      const [a, b] = q.operands;
      return `Find the difference: ${a} − ${b} = ?`;
    }
    case TYPES.COMPARE: {
      const [a, b] = q.operands;
      return `Compare the numbers. Which sign belongs here? ${a} ⬚ ${b}`;
    }
    case TYPES.ORDER: {
      const nums = q.options.map((o) => o.value);
      const how = q.direction === "asc" ? "ascending (smallest to largest)" : "descending (largest to smallest)";
      return `Put the numbers in order, ${how}: ${nums.join(", ")}`;
    }
    case TYPES.ROUND:
      return `Round the number ${q.number} to the ${NEAREST_PLACE_EN[q.place]}.`;
    case TYPES.ESTIMATE: {
      const [a, b] = q.operands;
      const word = q.op === "+" ? "sum" : "difference";
      return `Round the numbers to the ${NEAREST_PLACE_EN[q.place]} and estimate: about how much is the ${word}? ${a} ${q.op} ${b}`;
    }
    default:
      return q.questionText;
  }
}

// Which exercise types are valid in a given chapter (reverse of VALID_CHAPTERS).
function typesForChapter(chapter) {
  return Object.values(TYPES).filter((t) => VALID_CHAPTERS[t].includes(chapter));
}

function randOf(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---- animation-only feedback helpers (no game logic) ----
// NOTE: these bursts are CSS-keyframe driven (like the original confetti), NOT
// GSAP. CSS animations keep running and self-clean even when the tab is hidden /
// rAF is paused, so they never get stuck invisible or leak — the robust choice
// for fire-and-forget particles. GSAP is reserved for the camera sequences.
const CONFETTI_COLORS = ["#EF5B2B", "#2F6FE0", "#14C9B4", "#F5A623", "#B23A9E", "#E24D8B"];
// Bigger, more satisfying correct-answer burst (Part 5): more + larger bits,
// wider spread, but still under ~1s and centered so it doesn't bury content.
function celebrate() {
  const layer = document.createElement("div");
  layer.className = "confetti-layer";
  const cx = window.innerWidth / 2, cy = window.innerHeight * 0.42;
  for (let i = 0; i < 60; i++) {
    const b = document.createElement("div");
    b.className = "confetti-bit";
    const ang = Math.random() * Math.PI * 2;
    const dist = 160 + Math.random() * 340;
    const size = 12 + Math.random() * 14;
    b.style.left = cx + "px";
    b.style.top = cy + "px";
    b.style.width = size + "px";
    b.style.height = size * (0.5 + Math.random() * 0.7) + "px";
    b.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    b.style.setProperty("--dx", Math.cos(ang) * dist + "px");
    b.style.setProperty("--dy", (Math.sin(ang) * dist + 220) + "px");
    b.style.setProperty("--dr", (Math.random() * 900 - 450) + "deg");
    b.style.animation = `confetti-fly ${560 + Math.random() * 260}ms ease-out forwards`;
    layer.appendChild(b);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 900);
}
function shakeEl(sel) {
  const el = document.querySelector(sel);
  if (el) { el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake"); }
}

// Map a board square's centre to a screen (px) point via the SVG's CTM.
function boardPointToScreen(square) {
  const svg = document.querySelector(".trail-svg");
  const g = state.g2;
  if (!svg || !g) return null;
  const ctm = svg.getScreenCTM();
  if (!ctm) return null;
  const c = boardCenter(square, g.cols);
  const pt = svg.createSVGPoint();
  pt.x = c.x; pt.y = c.y;
  const sp = pt.matrixTransform(ctm);
  return { x: sp.x, y: sp.y };
}

// Spawn a fire-and-forget CSS effect layer at a screen point (auto-removed).
function fxLayerAt(x, y, cls, lifeMs) {
  const layer = document.createElement("div");
  layer.className = "fx-layer " + cls;
  layer.style.left = x + "px";
  layer.style.top = y + "px";
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), lifeMs);
  return layer;
}

// TRAP: small explosion/burst of particles at the square.
function burstAt(square, color = "#E23B2E") {
  const p = boardPointToScreen(square);
  if (!p) return;
  const layer = fxLayerAt(p.x, p.y, "burst", 700);
  const flash = document.createElement("div");
  flash.className = "burst-flash"; layer.appendChild(flash);
  for (let i = 0; i < 16; i++) {
    const s = document.createElement("div");
    s.className = "burst-bit";
    const ang = (Math.PI * 2 * i) / 16 + Math.random() * 0.3;
    const dist = 40 + Math.random() * 70;
    s.style.background = i % 3 === 0 ? "#FFB020" : color;
    s.style.setProperty("--bx", Math.cos(ang) * dist + "px");
    s.style.setProperty("--by", Math.sin(ang) * dist + "px");
    s.style.animation = `burst-fly ${360 + Math.random() * 200}ms ease-out forwards`;
    layer.appendChild(s);
  }
}

// BONUS: a hop/jump indicator (arc + "+3") distinct from normal move hops.
function hopAt(square) {
  const p = boardPointToScreen(square);
  if (!p) return;
  const layer = fxLayerAt(p.x, p.y, "hop", 800);
  layer.innerHTML = `<div class="hop-ring"></div><div class="hop-plus">+3</div>`;
}

// STEAL: teleport flash (shrink/grow ring) at a square.
function teleportAt(square) {
  const p = boardPointToScreen(square);
  if (!p) return;
  const layer = fxLayerAt(p.x, p.y, "teleport", 650);
  layer.innerHTML = `<div class="tp-ring"></div><div class="tp-spark">✦</div>`;
}

// PART D — big, centered, brief result text (both games + special squares).
// Fire-and-forget (CSS-animated, auto-removed), never blocks gameplay pacing.
// kind: good | soft-bad | trap | bonus | steal  (soft-bad is gentle, not harsh).
let bigResultLayer = null;
function bigResult(text, kind) {
  if (bigResultLayer) bigResultLayer.remove();
  const el = document.createElement("div");
  el.className = "big-result " + kind;
  el.innerHTML = `<span>${esc(text)}</span>`;
  document.body.appendChild(el);
  bigResultLayer = el;
  setTimeout(() => { if (el === bigResultLayer) bigResultLayer = null; el.remove(); }, 1300); // keep in sync with big-result-pop's duration in styles.css
}

// -----------------------------------------------------------------------------
// Render dispatch
// -----------------------------------------------------------------------------
// Screens where gameplay is active (no animated background / different music).
const GAMEPLAY_SCREENS = new Set(["play", "g2play", "g3play"]);
// Language switch is only offered on the main menu, team setup, and mode-select.
const LANG_SWITCH_SCREENS = new Set(["landing", "setup", "mode"]);

function render() {
  let html = "";
  if (state.screen === "landing") html = renderLanding();
  else if (state.screen === "setup") html = renderSetup();
  else if (state.screen === "mode") html = renderMode();
  else if (state.screen === "play") html = renderPlay();
  else if (state.screen === "win") html = renderWin();
  else if (state.screen === "insight") html = renderInsight();
  else if (state.screen === "g2play") html = renderG2Play();
  else if (state.screen === "g2win") html = renderG2Win();
  else if (state.screen === "g3play") html = renderG3Play();
  else if (state.screen === "g3win") html = renderG3Win();

  if (state.modal) html += renderModal();

  const screenChanged = state._lastScreen !== state.screen;
  app.innerHTML = html;

  // Background FX + music follow the screen. Music is per-game: Game 1 play uses
  // the "game1" track, Game 2 play the "game2" track; everything else = "menu"
  // (no menu file bundled yet — a third track is coming, so this stays silent).
  const gameplay = GAMEPLAY_SCREENS.has(state.screen);
  setBgFxActive(!gameplay);
  setG1BgFxActive(state.screen === "play");
  setLangSwitchVisible(LANG_SWITCH_SCREENS.has(state.screen));
  const musicTrack = state.screen === "play" ? "game1" : state.screen === "g2play" ? "game2" : state.screen === "g3play" ? "game3" : "menu";
  Audio.playMusic(musicTrack);
  // Light fade on genuine screen changes only (not on in-screen re-renders).
  if (screenChanged) {
    app.classList.remove("screen-enter");
    void app.offsetWidth; // restart the animation
    app.classList.add("screen-enter");
  }
  state._lastScreen = state.screen;
  wireUp();
}

// -----------------------------------------------------------------------------
// Screen 0 — landing / main menu (true entry point)
// -----------------------------------------------------------------------------
function renderLanding() {
  const feat = (icon, t, b) => `
    <div class="feature-card">
      <div class="feature-icon">${icon}</div>
      <div class="feature-title">${t}</div>
      <div class="muted">${b}</div>
    </div>`;
  const benefit = (icon, t, b) => `
    <div class="benefit-row">
      <div class="benefit-icon">${icon}</div>
      <div><div class="benefit-title">${t}</div><div class="muted">${b}</div></div>
    </div>`;

  return `
    <div class="landing">
      <header class="hero">
        <img class="hero-logo" src="assets/logo.svg" alt="${UI.appTitle} logo" />
        <h1 class="hero-title">${UI.appTitle}</h1>
        <p class="hero-tagline">${UI.landHeroTagline}</p>
        <button class="btn-primary btn-lg hero-start" id="land-start">${UI.landStart} →</button>
      </header>

      <section class="card land-section howto-strip">
        <h2>${UI.howToTitle}</h2>
        <div class="howto-steps">
          <div class="howto-step"><span class="howto-num">1</span><span>${UI.howToStep1}</span></div>
          <div class="howto-step"><span class="howto-num">2</span><span>${UI.howToStep2}</span></div>
          <div class="howto-step"><span class="howto-num">3</span><span>${UI.howToStep3}</span></div>
        </div>
      </section>

      <section class="card land-section">
        <h2>${UI.landWhatTitle}</h2>
        <p class="land-lead">${UI.landWhatBody}</p>
      </section>

      <section class="land-section">
        <h2>${UI.landFeaturesTitle}</h2>
        <div class="feature-grid">
          ${feat("📈", UI.featAdaptiveT, UI.featAdaptiveB)}
          ${feat("🔎", UI.featInsightT, UI.featInsightB)}
          ${feat("🎮", UI.featModesT, UI.featModesB)}
          ${feat("📚", UI.featChaptersT, UI.featChaptersB)}
        </div>
      </section>

      <section class="card land-section">
        <h2>${UI.landBenefitsTitle}</h2>
        <div class="benefit-list">
          ${benefit("👩‍🏫", UI.benTeacherT, UI.benTeacherB)}
          ${benefit("🧒", UI.benStudentT, UI.benStudentB)}
          ${benefit("🎯", UI.benCurriculumT, UI.benCurriculumB)}
        </div>
      </section>

      <section class="card land-section updates">
        <h2>📣 ${UI.landUpdatesTitle}</h2>
        <div class="updates-banner muted">${UI.landUpdatesPlaceholder}</div>
      </section>

      <p class="proofread-note muted">${UI.proofreadNote}</p>
      <p class="land-footer"><button class="link-btn" id="open-credits">${UI.creditsLink}</button></p>
      ${state.showCredits ? renderCreditsModal() : ""}
    </div>`;
}

function renderCreditsModal() {
  return `
    <div class="modal-backdrop" id="credits-backdrop">
      <div class="modal stack credits-modal">
        <h2 style="margin:0">${UI.creditsTitle}</h2>
        <p>${UI.creditsCharacters}</p>
        <p>${UI.creditsFonts}</p>
        <p>${UI.creditsAudio}</p>
        <p>${UI.creditsLogo}</p>
        <div class="row" style="justify-content:center">
          <button class="btn-primary btn-lg" id="credits-close">${UI.creditsClose}</button>
        </div>
      </div>
    </div>`;
}

function wireLanding() {
  document.getElementById("land-start").onclick = () => {
    state.screen = "setup";
    render();
  };
  document.getElementById("open-credits").onclick = () => {
    state.showCredits = true;
    render();
  };
  if (state.showCredits) {
    document.getElementById("credits-close").onclick = () => { state.showCredits = false; render(); };
    document.getElementById("credits-backdrop").onclick = (e) => {
      if (e.target.id === "credits-backdrop") { state.showCredits = false; render(); }
    };
  }
}

// -----------------------------------------------------------------------------
// Screen 1 — team setup
// -----------------------------------------------------------------------------
function renderSetup() {
  const n = state.teams.length || 2;
  const rows = state.teams
    .map(
      (t, i) => `
      <div class="team-row">
        <label>${UI.teamName} ${i + 1}</label>
        <input type="text" data-team-name="${i}" value="${esc(t.name)}" placeholder="${UI.teamName} ${i + 1}" />
      </div>`
    )
    .join("");

  const options = [2, 3, 4, 5, 6]
    .map((c) => `<option value="${c}" ${c === n ? "selected" : ""}>${c}</option>`)
    .join("");

  return `
    <div class="row"><button class="nav-home" id="nav-home">🏠 ${UI.home}</button></div>
    <h1>${UI.appTitle}</h1>
    <div class="card stack setup-panel">
      <h2>${UI.setupTitle}</h2>
      <div class="field" style="max-width:260px">
        <label for="team-count">${UI.teamCount}</label>
        <select id="team-count">${options}</select>
      </div>
      <div class="team-rows">${rows}</div>
      <div class="row">
        <div class="spacer"></div>
        <button class="btn-primary btn-lg" id="setup-continue">${UI.continue}</button>
      </div>
    </div>`;
}

// -----------------------------------------------------------------------------
// Screen 2 — mode select + config panels
// -----------------------------------------------------------------------------
function renderMode() {
  const { mode } = state.config;
  return `
    <h1>${UI.chooseGame}</h1>
    <div class="mode-grid">
      <button class="mode-tile ${mode === "game1" ? "selected" : ""}" data-mode="game1">
        <h3>${UI.game1}</h3>
        <p class="muted">${UI.game1Desc}</p>
      </button>
      <button class="mode-tile ${mode === "game2" ? "selected" : ""}" data-mode="game2">
        <h3>${UI.game2}</h3>
        <p class="muted">${UI.game2Desc}</p>
      </button>
      <button class="mode-tile ${mode === "game3" ? "selected" : ""}" data-mode="game3">
        <h3>${UI.game3}</h3>
        <p class="muted">${UI.game3Desc}</p>
      </button>
    </div>
    ${mode === "game1" ? renderGame1Config() : ""}
    ${mode === "game2" ? renderGame2Config() : ""}
    ${mode === "game3" ? renderGame3Config() : ""}
    <div class="row" style="margin-top:16px">
      <button id="back-to-setup">← ${UI.setupTitle}</button>
      <div class="spacer"></div>
      <button class="nav-home" id="nav-home">🏠 ${UI.home}</button>
    </div>`;
}

function chapterToggles() {
  return [1, 2, 3]
    .map(
      (c) =>
        `<button class="chip ${state.config.chapters.has(c) ? "on" : ""}" data-chapter="${c}">${chapterLabel(c)}</button>`
    )
    .join("");
}

function renderGame1Config() {
  const rt = state.config.roundTarget;
  const targets = [5, 7, 10]
    .map((v) => `<button class="pill ${v === rt ? "selected" : ""}" data-target="${v}">${v}</button>`)
    .join("");
  return `
    <div class="card stack config-panel">
      <h2>${UI.game1}</h2>
      <div class="field">
        <label>${UI.roundTarget}</label>
        <div class="pills">${targets}</div>
      </div>
      <div class="field">
        <label>${UI.chapters}</label>
        <div class="chapter-toggles">${chapterToggles()}</div>
      </div>
      <div class="row">
        <button class="btn-primary btn-lg" id="start-game1">${UI.start}</button>
      </div>
    </div>`;
}

// which Open Peeps face a team will use on the board (chosen or stable default)
function teamPeepFor(i) {
  return state.teams[i].peepChoice || ((i % TEAM_PEEP_COUNT) + 1);
}

function renderGame2Config() {
  const bs = state.config.boardSize;
  const sizes = [30, 40, 50]
    .map((v) => `<button class="pill ${v === bs ? "selected" : ""}" data-board="${v}">${v}</button>`)
    .join("");
  const charRows = state.teams
    .map((t, i) => {
      const color = TOKEN_COLORS[i % TOKEN_COLORS.length];
      const chosen = teamPeepFor(i);
      return `<div class="char-pick-row">
          <span class="char-team"><span class="tk-dot" style="background:${color}"></span>${esc(t.name)}</span>
          <div class="char-arrows">
            <button class="char-arrow" data-team-char-prev="${i}" aria-label="${UI.prevCharacter}">‹</button>
            <div class="char-thumb" style="border-color:${color}">
              <img src="assets/characters/team-${chosen}.svg" alt="character ${chosen}" />
            </div>
            <button class="char-arrow" data-team-char-next="${i}" aria-label="${UI.nextCharacter}">›</button>
          </div>
        </div>`;
    })
    .join("");
  return `
    <div class="card stack config-panel">
      <h2>${UI.game2}</h2>
      <div class="field">
        <label>${UI.chapters}</label>
        <div class="chapter-toggles">${chapterToggles()}</div>
      </div>
      <div class="field">
        <label>${UI.boardSize}</label>
        <div class="pills">${sizes}</div>
      </div>
      <div class="field">
        <label>${UI.teamCharacters}</label>
        <div class="char-pick-list">${charRows}</div>
      </div>
      <div class="row">
        <button class="btn-primary btn-lg" id="start-game2">${UI.start}</button>
      </div>
    </div>`;
}

function renderGame3Config() {
  const rr = state.config.g3Rounds;
  const rounds = [25, 40, 60]
    .map((v) => `<button class="pill ${v === rr ? "selected" : ""}" data-g3rounds="${v}">${v}</button>`)
    .join("");
  return `
    <div class="card stack config-panel">
      <h2>${UI.game3}</h2>
      <div class="field">
        <label>${UI.g3Rounds}</label>
        <div class="pills">${rounds}</div>
      </div>
      <div class="row">
        <button class="btn-primary btn-lg" id="start-game3">${UI.start}</button>
      </div>
    </div>`;
}

// -----------------------------------------------------------------------------
// Screen 3 — Game 1 play
// -----------------------------------------------------------------------------
function renderPlay() {
  return `
    <div class="g1-play">
      <div class="g1-topbar">
        <div class="row">
          <h1>${UI.game1}</h1>
          <div class="spacer"></div>
          <span class="difficulty-badge" title="${UI.difficultyExplain}">${UI.difficulty}: ${state.play.difficulty}/3</span>
          ${DEBUG ? `<button id="debug-insight" title="fast-forward to insight">⏩</button>` : ""}
          <button class="nav-home" id="nav-home">🏠 ${UI.home}</button>
          <button class="btn-danger" id="stop-btn">${UI.stop}</button>
        </div>
        <p class="difficulty-caption muted small">${UI.difficultyExplain}</p>
      </div>
      <div class="play-layout">
        <div class="card scoreboard">
          <h3>${UI.whoAnswers}</h3>
          <div class="team-buttons">${renderScoreboard()}</div>
        </div>
        <div class="card question-card">
          ${renderQuestion()}
        </div>
      </div>
    </div>`;
}

function renderScoreboard() {
  return state.teams
    .map((t, i) => {
      const isLocked = state.play.lockedTeams.includes(i);
      const sel = i === state.play.selectedTeam ? "selected" : "";
      const locked = isLocked ? "locked" : "";
      const dis = isLocked ? "disabled" : "";
      return `
      <button class="team-btn ${sel} ${locked}" data-team="${i}" ${dis}
              title="${isLocked ? esc(UI.teamAlreadyTried) : ""}">
        <span class="tk-dot" style="background:${TOKEN_COLORS[i % TOKEN_COLORS.length]}"></span>
        <span class="team-name">${esc(t.name)}</span>
        <span class="score">${t.score}</span>
      </button>`;
    })
    .join("");
}

function renderQuestion() {
  const q = state.play.question;
  if (!q) return "";
  const teamChosen = state.play.selectedTeam !== null;
  const disabledCls = teamChosen ? "" : "disabled";

  const fb = state.play.feedback;
  const fbHtml = fb ? `<div class="feedback ${fb.kind}">${esc(fb.text)}</div>` : `<div class="feedback"></div>`;

  return `
    <div class="question-header">
      <div class="peep-wrap">
        <img class="peep" id="peep-img" src="assets/characters/peep-${state.play.character}.svg" alt="character" />
        <div class="peep-asks">${UI.asksLabel}</div>
      </div>
      <div class="question-text">${esc(questionTextFor(q))}</div>
    </div>
    ${!teamChosen ? `<p class="muted">${UI.pickTeamFirst}</p>` : ""}
    <div class="answer-area ${disabledCls}">
      ${renderAnswerControls(q)}
    </div>
    ${fbHtml}`;
}

function renderAnswerControls(q) {
  if (q.format === "numeric") {
    return `
      <div class="row">
        <input type="number" id="numeric-input" placeholder="?" style="font-size:22px;width:160px" />
        <button class="btn-primary btn-lg" id="numeric-submit">${UI.submit}</button>
      </div>`;
  }

  if (q.format === "multiple_choice") {
    const btns = q.options
      .map((opt, i) => `<button class="mc-btn" data-mc="${i}">${esc(opt)}</button>`)
      .join("");
    return `<div class="mc-grid">${btns}</div>`;
  }

  if (q.format === "ordering") {
    const picked = state.play.orderPick;
    const boxes = q.options
      .map((o, i) => {
        const at = picked.indexOf(i);
        const placed = at !== -1 ? "placed" : "";
        const badge = at !== -1 ? `<span class="place-badge">${at + 1}</span>` : "";
        return `<button class="order-box ${placed}" data-color="${o.color}" data-order="${i}">${badge}${o.value}</button>`;
      })
      .join("");
    const preview = picked.map((i) => q.options[i].value).join(" , ");
    const ready = picked.length === q.options.length;
    return `
      <p class="muted">${UI.orderHint}</p>
      <div class="order-boxes">${boxes}</div>
      <div class="order-preview">${preview ? esc(preview) : "&nbsp;"}</div>
      <div class="row">
        <button class="btn-primary btn-lg" id="order-submit" ${ready ? "" : "disabled"}>${UI.submit}</button>
        <button id="order-reset">${UI.resetPick}</button>
      </div>`;
  }

  return "";
}

// -----------------------------------------------------------------------------
// Win screen
// -----------------------------------------------------------------------------
function renderWin() {
  return renderPodium({
    name: state.play.winnerName || "",
    color: state.play.winnerColor || "var(--accent-3)",
    btnId: "win-continue",
    btnLabel: `${UI.seeResults} →`,
  });
}

// Shared podium-style win screen (GSAP-animated in wireUp).
function renderPodium({ name, color, btnId, btnLabel }) {
  return `
    <div class="podium-screen">
      <div class="podium-trophy">🏆</div>
      <div class="podium-sub">${UI.wonPrefix}</div>
      <div class="podium-winner" style="color:${color}">${esc(name)}</div>
      <div class="podium-block" style="--pcolor:${color}">
        <span class="podium-rank">1</span>
      </div>
      <div class="row" style="justify-content:center;margin-top:26px">
        <button class="btn-primary btn-lg" id="${btnId}">${btnLabel}</button>
      </div>
    </div>`;
}

// GSAP reveal for either win screen (suspense beat -> podium rises -> name pops).
// Skipped when the tab is hidden (rAF paused) so the podium is never left in its
// from-state; the CSS-default (fully visible) podium shows instead.
function playPodiumReveal() {
  if (!window.gsap || document.hidden) { celebrate(); return; }
  const tl = gsap.timeline();
  tl.from(".podium-block", { scaleY: 0, transformOrigin: "bottom", duration: 0.5, ease: "power3.out", delay: 0.15 })
    .from(".podium-trophy", { y: -40, scale: 0, rotate: -25, duration: 0.5, ease: "back.out(2)" }, "-=0.15")
    .from(".podium-sub", { opacity: 0, y: 10, duration: 0.3 }, "-=0.1")
    .from(".podium-winner", { opacity: 0, scale: 0.7, duration: 0.45, ease: "back.out(1.8)" }, "-=0.05")
    .add(() => celebrate());
}

// -----------------------------------------------------------------------------
// Insight screen (end-of-game teacher summary)
// -----------------------------------------------------------------------------
function renderInsight() {
  const history = state.play.history;

  // Per-type correct/incorrect tally (only types that actually came up).
  const byType = {};
  for (const h of history) {
    const b = (byType[h.type] = byType[h.type] || { correct: 0, incorrect: 0 });
    if (h.correct) b.correct++;
    else b.incorrect++;
  }
  const typeRows = Object.keys(byType)
    .map((type) => {
      const b = byType[type];
      return `
        <tr>
          <td>${TYPE_LABELS[type] || type}</td>
          <td class="num good-text">${b.correct}</td>
          <td class="num bad-text">${b.incorrect}</td>
        </tr>`;
    })
    .join("");

  const typeSection = history.length
    ? `<table class="insight-table">
         <thead><tr><th>${UI.byTypeTitle}</th><th class="num">${UI.colCorrect}</th><th class="num">${UI.colIncorrect}</th></tr></thead>
         <tbody>${typeRows}</tbody>
       </table>`
    : `<p class="muted">${UI.noQuestions}</p>`;

  // Mistake patterns — a SEPARATE lens (counted per wrong attempt, so these
  // numbers intentionally don't need to reconcile with the per-question table).
  const patterns = Object.keys(state.play.patternCounts).filter((k) => state.play.patternCounts[k] > 0);
  const patternSection = patterns.length
    ? `<h3 style="margin-top:24px">${UI.patternsTitle}</h3>
       <div class="pattern-list">
         ${patterns
           .map((tag) => {
             const info = PATTERN_INFO[tag] || { title: tag, text: "" };
             return `
             <div class="pattern-card">
               <div class="pattern-head">
                 <span class="pattern-title">${esc(info.title)}</span>
                 <span class="pattern-count">${timesText(state.play.patternCounts[tag])}</span>
               </div>
               <div class="muted">${esc(info.text)}</div>
             </div>`;
           })
           .join("")}
       </div>`
    : "";

  const winnerBanner = state.play.winnerName
    ? `<div class="insight-winner">🏆 ${UI.wonPrefix}: <b>${esc(state.play.winnerName)}</b></div>`
    : `<div class="muted">${UI.insightStopped}</div>`;

  return `
    <div class="card">
      <h1 style="margin-top:0">${UI.insightTitle}</h1>
      ${winnerBanner}
      <div style="margin-top:16px">${typeSection}</div>
      ${patternSection}
      <div class="row" style="justify-content:center;margin-top:28px">
        <button class="btn-primary btn-lg" id="insight-done">${UI.backToMenu}</button>
      </div>
    </div>`;
}

// ---- stop confirmation modal ----
function renderModal() {
  const msg = state.modal.kind === "home" ? UI.homeConfirm : UI.stopConfirm;
  return `
    <div class="modal-backdrop">
      <div class="modal stack">
        <p style="font-size:18px;font-weight:600">${msg}</p>
        <div class="row" style="justify-content:center">
          <button class="btn-danger btn-lg" id="modal-yes">${UI.yes}</button>
          <button class="btn-primary btn-lg" id="modal-no">${UI.no}</button>
        </div>
      </div>
    </div>`;
}

// -----------------------------------------------------------------------------
// Event wiring (re-attached after every render)
// -----------------------------------------------------------------------------
function wireUp() {
  // ---- modal (takes priority) ----
  if (state.modal) {
    document.getElementById("modal-yes").onclick = () => {
      const kind = state.modal.kind; // read BEFORE clearing
      const wasG2 = state.screen === "g2play";
      const wasG3 = state.screen === "g3play";
      state.modal = null;
      if (kind === "home") goHome();      // "back to main menu" -> landing
      else if (wasG2) stopGame2();        // Stop in Game 2 -> mode select
      else if (wasG3) g3Finish();         // Stop in Game 3 -> standings/win screen
      else endGame();                     // Stop in Game 1 -> insight screen
    };
    document.getElementById("modal-no").onclick = () => {
      state.modal = null;
      render();
    };
    return; // don't wire the screen behind the modal
  }

  if (state.screen === "landing") wireLanding();
  else if (state.screen === "setup") wireSetup();
  else if (state.screen === "mode") wireMode();
  else if (state.screen === "play") wirePlay();
  else if (state.screen === "win") {
    document.getElementById("win-continue").onclick = () => { state.screen = "insight"; render(); };
    playPodiumReveal();
    Audio.sfx("correct");
  } else if (state.screen === "insight") {
    document.getElementById("insight-done").onclick = () => leaveToModeSelect();
  } else if (state.screen === "g2play") wireG2Play();
  else if (state.screen === "g2win") {
    document.getElementById("g2win-menu").onclick = () => stopGame2();
    playPodiumReveal();
    Audio.sfx("correct");
  } else if (state.screen === "g3play") wireG3Play();
  else if (state.screen === "g3win") {
    document.getElementById("g3win-menu").onclick = () => stopGame3();
    playPodiumReveal();
    Audio.sfx("correct");
  }

  // PART E — persistent "back to main menu". During active play it requires the
  // same confirmation as Stop (so a misclick can't lose game progress); on
  // non-play screens it goes straight home. This is separate from Stop: Stop
  // ends the current game (G1->insight, G2->mode select); Home returns to the
  // landing page entirely.
  const home = document.getElementById("nav-home");
  if (home) {
    home.onclick = () => {
      if (GAMEPLAY_SCREENS.has(state.screen)) { state.modal = { kind: "home" }; render(); }
      else goHome();
    };
  }
}

function wireSetup() {
  const sel = document.getElementById("team-count");
  syncTeamCount(Number(sel.value)); // ensure array matches on first paint
  sel.onchange = () => {
    captureTeamNames();
    syncTeamCount(Number(sel.value));
    render();
  };
  app.querySelectorAll("[data-team-name]").forEach((inp) => {
    inp.oninput = () => {
      state.teams[Number(inp.dataset.teamName)].name = inp.value;
    };
  });
  document.getElementById("setup-continue").onclick = () => {
    captureTeamNames();
    state.screen = "mode";
    render();
  };
}

function wireMode() {
  app.querySelectorAll("[data-mode]").forEach((btn) => {
    btn.onclick = () => {
      state.config.mode = btn.dataset.mode;
      render();
    };
  });
  app.querySelectorAll("[data-chapter]").forEach((btn) => {
    btn.onclick = () => {
      const c = Number(btn.dataset.chapter);
      const set = state.config.chapters;
      set.has(c) ? set.delete(c) : set.add(c);
      render();
    };
  });
  app.querySelectorAll("[data-target]").forEach((btn) => {
    btn.onclick = () => {
      state.config.roundTarget = Number(btn.dataset.target);
      render();
    };
  });
  app.querySelectorAll("[data-board]").forEach((btn) => {
    btn.onclick = () => {
      state.config.boardSize = Number(btn.dataset.board);
      render();
    };
  });
  app.querySelectorAll("[data-g3rounds]").forEach((btn) => {
    btn.onclick = () => {
      state.config.g3Rounds = Number(btn.dataset.g3rounds);
      render();
    };
  });
  // Part B — per-team character choice
  app.querySelectorAll("[data-team-char-prev]").forEach((btn) => {
    btn.onclick = () => {
      const i = Number(btn.dataset.teamCharPrev);
      const cur = teamPeepFor(i);
      state.teams[i].peepChoice = ((cur - 2 + TEAM_PEEP_COUNT) % TEAM_PEEP_COUNT) + 1;
      render();
    };
  });
  app.querySelectorAll("[data-team-char-next]").forEach((btn) => {
    btn.onclick = () => {
      const i = Number(btn.dataset.teamCharNext);
      const cur = teamPeepFor(i);
      state.teams[i].peepChoice = (cur % TEAM_PEEP_COUNT) + 1;
      render();
    };
  });
  const back = document.getElementById("back-to-setup");
  if (back) back.onclick = () => { state.screen = "setup"; render(); };

  const s1 = document.getElementById("start-game1");
  if (s1) s1.onclick = startGame1;

  const s2 = document.getElementById("start-game2");
  if (s2) s2.onclick = startGame2;

  const s3 = document.getElementById("start-game3");
  if (s3) s3.onclick = startGame3;
}

function wirePlay() {
  document.getElementById("stop-btn").onclick = () => {
    state.modal = { kind: "stop" };
    render();
  };

  if (DEBUG) {
    const dbg = document.getElementById("debug-insight");
    // Jump to insight using the game so far; if nothing answered yet, seed a demo.
    if (dbg) dbg.onclick = () => {
      if (state.play.history.length === 0) seedDemoInsight();
      state.screen = "insight";
      render();
    };
  }

  // Play the character entrance animation ONCE per new question (not on every
  // re-render such as team selection).
  const peep = document.getElementById("peep-img");
  const q = state.play.question;
  if (peep && q && state.play.lastAnimatedQid !== q.id) {
    peep.classList.add("pop-in");
    state.play.lastAnimatedQid = q.id;
  }

  app.querySelectorAll("[data-team]").forEach((btn) => {
    btn.onclick = () => selectTeam(Number(btn.dataset.team));
  });

  if (!q) return;

  if (q.format === "numeric") {
    const input = document.getElementById("numeric-input");
    const submit = () => {
      if (input.value === "") return;
      handleSubmit(Number(input.value));
    };
    document.getElementById("numeric-submit").onclick = submit;
    input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
    if (state.play.selectedTeam !== null) input.focus();
  } else if (q.format === "multiple_choice") {
    app.querySelectorAll("[data-mc]").forEach((btn) => {
      btn.onclick = () => handleSubmit(q.options[Number(btn.dataset.mc)]);
    });
  } else if (q.format === "ordering") {
    app.querySelectorAll("[data-order]").forEach((btn) => {
      btn.onclick = () => {
        if (state.play.selectedTeam === null) return;
        const i = Number(btn.dataset.order);
        if (state.play.orderPick.includes(i)) return;
        state.play.orderPick.push(i);
        render();
      };
    });
    const os = document.getElementById("order-submit");
    if (os) os.onclick = () => {
      const answer = state.play.orderPick.map((i) => q.options[i].value);
      handleSubmit(answer);
    };
    document.getElementById("order-reset").onclick = () => {
      state.play.orderPick = [];
      render();
    };
  }
}

// -----------------------------------------------------------------------------
// Setup helpers
// -----------------------------------------------------------------------------
function syncTeamCount(count) {
  const cur = state.teams;
  const next = [];
  for (let i = 0; i < count; i++) {
    next.push(cur[i] || { name: `${UI.teamName} ${i + 1}`, score: 0 });
  }
  state.teams = next;
}

function captureTeamNames() {
  app.querySelectorAll("[data-team-name]").forEach((inp) => {
    const i = Number(inp.dataset.teamName);
    if (state.teams[i]) state.teams[i].name = inp.value.trim() || `${UI.teamName} ${i + 1}`;
  });
}

// Reset scores for a fresh run but keep names/count AND character choices.
function resetTeamsKeepIdentity() {
  state.teams = state.teams.map((t) => ({ name: t.name, score: 0, peepChoice: t.peepChoice }));
}

function goToSetup() {
  resetTeamsKeepIdentity();
  state.screen = "setup";
  state.play = freshPlayState();
  render();
}

// After the insight screen: reset scores, keep teams, return to mode select.
function leaveToModeSelect() {
  resetTeamsKeepIdentity();
  state.play = freshPlayState();
  state.screen = "mode";
  render();
}

// PART E — "back to main menu": return all the way to the landing page,
// keeping team names + character choices (so a confirmed misclick isn't painful).
function goHome() {
  resetTeamsKeepIdentity();
  state.play = freshPlayState();
  state.g2 = null;
  state.g3 = null;
  state.screen = "landing";
  render();
}

// -----------------------------------------------------------------------------
// Game 1 logic
// -----------------------------------------------------------------------------
function startGame1() {
  if (state.config.chapters.size === 0) { alert(UI.pickChapterWarn); return; }
  resetSession(); // engine no-repeat memory, per spec
  state.teams = state.teams.map((t) => ({ name: t.name, score: 0 }));
  state.play = freshPlayState(); // difficulty starts at tier 2, trackers empty
  state.screen = "play";
  nextQuestion();
}

// Draw a random (chapter, type) from the selected chapters, then a question,
// at the current adaptive difficulty tier. Resets only QUESTION-scoped state.
function nextQuestion() {
  const chapters = [...state.config.chapters];
  const chapter = randOf(chapters);
  const type = randOf(typesForChapter(chapter));
  const difficulty = state.play.difficulty; // class-wide adaptive tier
  const opts = type === TYPES.ROUND ? { variant: Math.random() < 0.5 ? "numeric" : "multiple_choice" } : {};

  state.play.question = generateQuestion(type, chapter, difficulty, opts);
  state.play.selectedTeam = null;
  state.play.lockedTeams = []; // fresh question -> everyone can answer again
  state.play.orderPick = [];
  state.play.feedback = null;
  state.play.character = 1 + Math.floor(Math.random() * PEEP_COUNT); // rotate the peep
  render();
}

// Called once per RESOLVED question (someone got it, or every team missed).
// Records history for the insight screen and updates adaptive difficulty.
function resolveQuestion(correct) {
  const q = state.play.question;
  state.play.history.push({ type: q.type, chapter: q.chapter, correct });
  adaptDifficulty(correct);
}

// Class-wide, round-based adaptive difficulty over a rolling window of 3.
function adaptDifficulty(correct) {
  const w = state.play.window;
  w.push(correct);
  while (w.length > 3) w.shift();

  if (w.length < 3) return; // need 3 results to judge

  const incorrect = w.filter((r) => !r).length;
  let changed = false;
  if (incorrect === 0 && state.play.difficulty < 3) {
    state.play.difficulty++; // all 3 correct -> harder
    changed = true;
  } else if (incorrect >= 2 && state.play.difficulty > 1) {
    state.play.difficulty--; // 2+ of last 3 wrong -> easier
    changed = true;
  }
  // Reset the window on a tier change so the same 3 results can't re-trigger it,
  // matching "all 3 correct AT the current tier".
  if (changed) state.play.window = [];
}

function selectTeam(i) {
  if (state.play.lockedTeams.includes(i)) {
    // a team that already missed this question is locked out for it
    state.play.feedback = { text: UI.teamAlreadyTried, kind: "bad" };
    render();
    return;
  }
  state.play.selectedTeam = i;
  state.play.orderPick = []; // starting a fresh attempt
  state.play.feedback = null;
  render();
}

function handleSubmit(submittedAnswer) {
  const q = state.play.question;
  const teamIdx = state.play.selectedTeam;
  if (teamIdx === null) return;

  const { correct, matchedPattern } = gradeAnswer(q, submittedAnswer);

  if (correct) {
    state.teams[teamIdx].score += 1;
    resolveQuestion(true); // record history + adapt difficulty
    if (state.teams[teamIdx].score >= state.config.roundTarget) {
      state.play.winnerName = state.teams[teamIdx].name;
      state.play.winnerColor = TOKEN_COLORS[teamIdx % TOKEN_COLORS.length];
      state.screen = "win";
      render();
      return;
    }
    state.play.feedback = { text: UI.correct, kind: "good" };
    render();
    celebrate(); // confetti burst
    Audio.sfx("correct");
    bigResult(UI.bigCorrect, "good"); // Part D
    const badge = document.querySelectorAll(".team-btn")[teamIdx]?.querySelector(".score");
    if (badge) badge.classList.add("bump"); // score pop
    // brief pause so the class sees the result, then next question
    setTimeout(nextQuestion, 1250);
  } else {
    // Count the mistake pattern (per wrong attempt) for the insight screen.
    if (matchedPattern) {
      state.play.patternCounts[matchedPattern] = (state.play.patternCounts[matchedPattern] || 0) + 1;
    }
    // Lock this team out of THIS question permanently; let an untried team try.
    if (!state.play.lockedTeams.includes(teamIdx)) state.play.lockedTeams.push(teamIdx);
    state.play.selectedTeam = null;
    state.play.orderPick = [];

    if (state.play.lockedTeams.length >= state.teams.length) {
      // every team has now missed this question -> nobody got it, move on.
      resolveQuestion(false); // record as an incorrect question + adapt
      state.play.feedback = { text: UI.noneCorrect, kind: "bad" };
      render();
      shakeEl(".question-text");
      Audio.sfx("wrong");
      bigResult(UI.bigWrong, "soft-bad"); // Part D
      setTimeout(nextQuestion, 1550);
    } else {
      state.play.feedback = { text: UI.wrongTryAnother, kind: "bad" };
      render();
      shakeEl(".question-text");
      Audio.sfx("wrong");
      bigResult(UI.bigWrong, "soft-bad"); // Part D
    }
  }
}

// Ending the game (win button already routes to insight; stop routes here).
function endGame() {
  state.screen = "insight";
  render();
}

// =============================================================================
// GAME 2 — board race (serpentine board, dice, special squares)
// =============================================================================

// Cohesive team palette (matches --team-* in styles.css), reused for Game 1
// scoreboard dots and Game 2 tokens so team colours are consistent app-wide.
const TOKEN_COLORS = ["#EF5B2B", "#2F6FE0", "#14C9B4", "#F5A623", "#B23A9E", "#E24D8B"];
const TEAM_PEEP_COUNT = 12; // bundled team-1..12.svg (distinct from the question-asker set)
const HOP_MS = 300; // per-square hop (spec: under ~500ms)

function shuffleInPlace(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build a serpentine board. cols/rows are chosen to sit near 16:9; a random
// subset of squares (never the first or last) becomes bonus / trap / steal.
function buildBoard(size) {
  const cols = Math.max(4, Math.ceil(Math.sqrt((size * 16) / 9)));
  const rows = Math.ceil(size / cols);
  // grid cell (r,c) -> square index, serpentine; trailing cells stay null
  const layout = new Array(rows * cols).fill(null);
  for (let s = 1; s <= size; s++) {
    const r = Math.floor((s - 1) / cols);
    const inRow = (s - 1) % cols;
    const c = r % 2 === 0 ? inRow : cols - 1 - inRow;
    layout[r * cols + c] = s;
  }
  // special squares (exclude first=1 and last=size)
  const types = new Array(size + 1).fill("normal");
  const perType = Math.max(1, Math.floor(size / 10)); // 20->2, 25->2, 30->3 each
  const pool = [];
  for (let s = 2; s < size; s++) pool.push(s);
  shuffleInPlace(pool);
  let p = 0;
  for (const t of ["bonus", "trap", "steal"]) {
    for (let k = 0; k < perType && p < pool.length; k++) types[pool[p++]] = t;
  }
  return { cols, rows, layout, types };
}

function startGame2() {
  if (state.config.chapters.size === 0) { alert(UI.pickChapterWarn); return; }
  resetSession(); // engine no-repeat memory, consistent with Game 1
  const size = state.config.boardSize;
  const board = buildBoard(size);
  state.g2 = {
    size,
    cols: board.cols,
    rows: board.rows,
    layout: board.layout,
    types: board.types,
    teams: state.teams.map((t, i) => ({
      name: t.name,
      color: TOKEN_COLORS[i % TOKEN_COLORS.length],
      peep: teamPeepFor(i), // teacher's choice from config, else stable default
      pos: 0, // 0 = start line (before square 1)
    })),
    turn: 0,
    phase: "roll", // roll | announce | dice | moving | reveal | question | resolved
    dice: null,
    diceFace: 1,
    preRoll: 0,
    landing: 0,
    landedType: "normal",
    question: null,
    orderPick: [],
    banner: null, // transient toast { text, kind }
    feedback: null,
    busy: false,
    winner: null,
  };
  state.screen = "g2play";
  render();
}

function stopGame2() {
  state.g2 = null;
  state.teams = state.teams.map((t) => ({ name: t.name, score: 0 }));
  state.play = freshPlayState();
  state.screen = "mode";
  render();
}

// ---- rendering ----
function renderG2Play() {
  const g = state.g2;
  const team = g.teams[g.turn];

  // compact team position chips (score = current square)
  const chips = g.teams
    .map(
      (t, i) => `<span class="pos-chip ${i === g.turn ? "current" : ""}">
        <span class="tk-dot" style="background:${t.color}"></span>${esc(t.name)}
        <b>${t.pos}</b></span>`
    )
    .join("");

  return `
    <div class="g2-root" style="--cols:${g.cols};--rows:${g.rows}">
      <div class="g2-topbar compact">
        <div class="g2-turn">
          <span class="muted">${UI.turnOf}:</span>
          <span class="turn-name"><span class="tk-dot" style="background:${team.color}"></span>${esc(team.name)}</span>
        </div>
        <div class="pos-chips">${chips}</div>
        <div class="spacer"></div>
        <div class="g2-legend">
          <span class="lg bonus">➕</span>
          <span class="lg trap">⚠️</span>
          <span class="lg steal">🔀</span>
        </div>
        <button class="nav-home" id="nav-home">🏠</button>
        <button class="btn-danger" id="g2-stop">${UI.stop}</button>
      </div>
      <div class="g2-board-area">${renderBoard()}</div>
      ${renderG2Overlay()}
    </div>`;
}

// start-zone token chip (top bar, for teams still at position 0)
function tokenChip(i) {
  const t = state.g2.teams[i];
  return `<span class="tk-dot" style="background:${t.color};width:22px;height:22px" title="${esc(t.name)}"></span>`;
}

// ---- 3D dice cube (big reveal; rotation driven by GSAP, not CSS) ----
function renderBigDice() {
  let faces = "";
  for (let n = 1; n <= 6; n++) faces += `<div class="face f${n}">${diceFacePips(n)}</div>`;
  return `<div class="dice-stage"><div class="dice3d big" id="g2-bigdice">${faces}</div></div>`;
}
// rotation that brings face N to the front (matches .face.fN transforms in CSS)
function diceFaceRot(n) {
  return ({
    1: { fx: 0, fy: 0 },
    2: { fx: 0, fy: -90 },
    3: { fx: -90, fy: 0 },
    4: { fx: 90, fy: 0 },
    5: { fx: 0, fy: 90 },
    6: { fx: 0, fy: -180 },
  })[n] || { fx: 0, fy: 0 };
}
function diceFacePips(n) {
  const map = { 1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9] };
  const on = new Set(map[n] || []);
  let cells = "";
  for (let i = 1; i <= 9; i++) cells += `<span class="pip-cell">${on.has(i) ? '<span class="pip"></span>' : ""}</span>`;
  return cells;
}

// ---- board as a winding illustrated trail (SVG), same serpentine positions ----
const BOARD_U = 100; // svg units per square cell
function boardCenter(s, cols) {
  const r = Math.floor((s - 1) / cols);
  const inRow = (s - 1) % cols;
  const c = r % 2 === 0 ? inRow : cols - 1 - inRow; // serpentine (same as buildBoard)
  return { x: c * BOARD_U + BOARD_U / 2, y: r * BOARD_U + BOARD_U / 2 };
}
function tokenClusterOffset(idx, n) {
  if (n <= 1) return { x: 0, y: 0 };
  const ang = (Math.PI * 2 * idx) / n - Math.PI / 2;
  return { x: Math.cos(ang) * 17, y: Math.sin(ang) * 17 };
}
function renderBoard() {
  const g = state.g2;
  const cols = g.cols, rows = g.rows;
  const W = cols * BOARD_U, H = rows * BOARD_U;

  // the road: a single path through square centres 1..N (serpentine)
  let d = "";
  for (let s = 1; s <= g.size; s++) {
    const p = boardCenter(s, cols);
    d += (s === 1 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`);
  }

  // square nodes
  let nodes = "";
  for (let s = 1; s <= g.size; s++) {
    const p = boardCenter(s, cols);
    const type = g.types[s];
    const icon = type === "bonus" ? "➕" : type === "trap" ? "⚠️" : type === "steal" ? "🔀" : "";
    nodes += `<g class="node ${type}" transform="translate(${p.x},${p.y})">
        <circle class="node-bg" r="34"></circle>
        ${icon ? `<text class="node-icon" y="-20">${icon}</text>` : ""}
        <text class="node-num" y="${icon ? 10 : 0}">${s}</text>
      </g>`;
  }

  // character tokens (on top). pos 0 shows at the start (square 1) so the
  // opening camera has a subject; teams sharing a spot are clustered. The
  // colored RING is the primary team signal; the Open Peeps face is flavour.
  const visPos = (t) => Math.max(1, Math.min(t.pos, g.size)); // 0 -> start (sq 1)
  let tokens = "";
  g.teams.forEach((t, i) => {
    const vp = visPos(t);
    const p = boardCenter(vp, cols);
    const same = g.teams.filter((x) => visPos(x) === vp);
    const off = tokenClusterOffset(same.indexOf(t), same.length);
    tokens += `<g class="btoken" data-team="${i}" transform="translate(${p.x + off.x},${p.y + off.y})">
        <ellipse class="btoken-shadow" cx="0" cy="26" rx="18" ry="6"></ellipse>
        <circle class="btoken-ring" r="27" fill="#fff" stroke="${t.color}" stroke-width="6"></circle>
        <image href="assets/characters/team-${t.peep}.svg" x="-30" y="-36" width="60" height="60" clip-path="url(#tokclip)" preserveAspectRatio="xMidYMid slice"></image>
        <circle class="btoken-num-bg" cx="16" cy="18" r="12" fill="${t.color}"></circle>
        <text class="btoken-num" x="16" y="18">${i + 1}</text>
      </g>`;
  });

  return `<div class="board" style="--cols:${cols};--rows:${rows}">
      <svg class="trail-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">
        <defs><clipPath id="tokclip"><circle r="24"></circle></clipPath></defs>
        <path class="road-outer" d="${d}"></path>
        <path class="road-inner" d="${d}"></path>
        <path class="road-dash" d="${d}"></path>
        ${nodes}
        ${tokens}
      </svg>
      <div class="board-legend">
        <span class="bl-item bonus">➕ ${UI.sqBonus}</span>
        <span class="bl-item trap">⚠️ ${UI.sqTrap}</span>
        <span class="bl-item steal">🔀 ${UI.sqSteal}</span>
      </div>
    </div>`;
}

// Move ONLY the existing token elements to match current positions — no full
// re-render. Rebuilding the whole board SVG (50 nodes + peep <image>s) every hop
// re-parsed the DOM and re-decoded the character images, which was the sustained
// main-thread scripting during movement. This just updates transform attributes.
function positionTokens() {
  const g = state.g2;
  const svg = document.querySelector(".trail-svg");
  if (!svg) return;
  const visPos = (t) => Math.max(1, Math.min(t.pos, g.size));
  g.teams.forEach((t, i) => {
    const el = svg.querySelector(`.btoken[data-team="${i}"]`);
    if (!el) return;
    const vp = visPos(t);
    const p = boardCenter(vp, g.cols);
    const same = g.teams.filter((x) => visPos(x) === vp);
    const off = tokenClusterOffset(same.indexOf(t), same.length);
    el.setAttribute("transform", `translate(${p.x + off.x},${p.y + off.y})`);
  });
}

function landedBadge(type) {
  if (type === "bonus") return `➕ ${UI.sqBonus}`;
  if (type === "trap") return `⚠️ ${UI.sqTrap}`;
  if (type === "steal") return `🔀 ${UI.sqSteal}`;
  return UI.landedNormal;
}

// PART C — ordering: update ONLY the answer UI on each tap (placed state, badges,
// preview, submit-enabled) instead of a full render() (which rebuilt the whole
// board SVG and caused the visible disappear/reappear flicker).
function updateOrderUI() {
  const g = state.g2;
  const q = g.question;
  if (!q) return;
  document.querySelectorAll("[data-g2order]").forEach((b) => {
    const i = Number(b.dataset.g2order);
    const at = g.orderPick.indexOf(i);
    b.classList.toggle("placed", at !== -1);
    let badge = b.querySelector(".place-badge");
    if (at !== -1) {
      if (!badge) { badge = document.createElement("span"); badge.className = "place-badge"; b.prepend(badge); }
      badge.textContent = at + 1;
    } else if (badge) {
      badge.remove();
    }
  });
  const preview = g.orderPick.map((i) => q.options[i].value).join(" , ");
  const pv = document.querySelector(".order-preview");
  if (pv) pv.textContent = preview || " ";
  const submit = document.getElementById("g2-order-submit");
  if (submit) submit.disabled = g.orderPick.length !== q.options.length;
}

// PART C — on answering, reveal the (already-rendered, intact) board by removing
// ONLY the question overlay + any toast, rather than rebuilding the whole app.
// NOTE: this intentionally leaves phase='resolved' with the DOM not fully
// re-rendered; that's fine — positionTokens() moves the tokens on the existing
// board, and the next FULL render() only happens at turn/game end.
function g2CloseQuestionOverlay() {
  const ov = document.querySelector(".g2-overlay");
  if (ov) ov.remove();
  const toast = document.querySelector(".g2-toast");
  if (toast) toast.remove();
}

function renderG2Overlay() {
  const g = state.g2;
  const team = g.teams[g.turn];
  let html = "";
  if (g.banner) html += `<div class="g2-toast ${g.banner.kind}">${esc(g.banner.text)}</div>`;

  // resting board view: a clear call-to-action to start this team's turn (dice hidden)
  if (g.phase === "roll" && !g.busy) {
    html += `
      <div class="g2-cta">
        <button class="btn-primary btn-lg roll-cta" id="g2-roll">${UI.rollNow}</button>
      </div>`;
  }

  // turn announcement overlay
  if (g.phase === "announce") {
    html += `
      <div class="turn-overlay">
        <div class="turn-announce" id="turn-announce">
          <span class="tk-dot big" style="background:${team.color}"></span>
          <span>${esc(team.name)}${UI.turnAnnounce}</span>
        </div>
      </div>`;
  }

  // big 3D dice reveal (GSAP-driven)
  if (g.phase === "dice") {
    html += `<div class="dice-overlay">${renderBigDice()}</div>`;
  }

  // question overlay
  if (g.phase === "question" && g.question) {
    html += `
      <div class="g2-overlay">
        <div class="g2-card">
          <div class="g2-badge ${g.landedType}">${landedBadge(g.landedType)}</div>
          <p class="muted">${UI.answerToKeep}</p>
          <div class="g2-question">${esc(questionTextFor(g.question))}</div>
          <div class="g2-answer">${renderG2Answer(g.question)}</div>
        </div>
      </div>`;
  }
  return html;
}

function renderG2Answer(q) {
  if (q.format === "numeric") {
    return `<div class="row" style="justify-content:center">
      <input type="number" id="g2-num" placeholder="?" style="font-size:22px;width:160px" />
      <button class="btn-primary btn-lg" id="g2-num-submit">${UI.submit}</button></div>`;
  }
  if (q.format === "multiple_choice") {
    return `<div class="mc-grid" style="justify-content:center">${q.options
      .map((o, i) => `<button class="mc-btn" data-g2mc="${i}">${esc(o)}</button>`)
      .join("")}</div>`;
  }
  if (q.format === "ordering") {
    const picked = state.g2.orderPick;
    const boxes = q.options
      .map((o, i) => {
        const at = picked.indexOf(i);
        const placed = at !== -1 ? "placed" : "";
        const badge = at !== -1 ? `<span class="place-badge">${at + 1}</span>` : "";
        return `<button class="order-box ${placed}" data-color="${o.color}" data-g2order="${i}">${badge}${o.value}</button>`;
      })
      .join("");
    const preview = picked.map((i) => q.options[i].value).join(" , ");
    const ready = picked.length === q.options.length;
    return `
      <p class="muted">${UI.orderHint}</p>
      <div class="order-boxes" style="justify-content:center">${boxes}</div>
      <div class="order-preview">${preview ? esc(preview) : "&nbsp;"}</div>
      <div class="row" style="justify-content:center">
        <button class="btn-primary btn-lg" id="g2-order-submit" ${ready ? "" : "disabled"}>${UI.submit}</button>
        <button id="g2-order-reset">${UI.resetPick}</button>
      </div>`;
  }
  return "";
}

function renderG2Win() {
  const g = state.g2;
  const w = g && g.winner != null ? g.teams[g.winner] : null;
  return renderPodium({
    name: w ? w.name : "",
    color: w ? w.color : "var(--accent-3)",
    btnId: "g2win-menu",
    btnLabel: UI.backToMenu,
  });
}

// ---- turn flow ----
// (Camera movement was removed — board stays in a normal flat view throughout.)
// 1) teacher starts the turn -> turn-announcement overlay -> dice
function g2StartTurn() {
  const g = state.g2;
  if (g.phase !== "roll" || g.busy) return;
  g.busy = true;
  g.banner = null;
  g.phase = "announce";
  render(); // renders the announcement overlay; GSAP animates it in wireG2Play
  Audio.sfx("turn");
  setTimeout(g2RollDice, 1700);
}

// 2) big GSAP dice tumble that lands EXACTLY on the rolled face (no post-anim flip)
function g2RollDice() {
  const g = state.g2;
  g.dice = 1 + Math.floor(Math.random() * 6); // the real, single source of truth
  g.phase = "dice";
  render(); // renders the big dice; we drive it with GSAP below (one owner)
  const el = document.getElementById("g2-bigdice");
  const rot = diceFaceRot(g.dice);
  Audio.sfx("dice");

  // Guard so the flow advances exactly once, whether via GSAP or the fallback.
  let advanced = false;
  const finish = () => { if (advanced) return; advanced = true; g2DiceDone(); };

  // Land the cube on the exact rolled face. GSAP animates only when the tab is
  // visible (rAF runs); otherwise we set the final orientation directly so the
  // correct face still shows. Either way the resting transform === diceFaceRot.
  if (el && window.gsap && !document.hidden) {
    gsap.fromTo(
      el,
      { rotationX: rot.fx - 720, rotationY: rot.fy - 1080 }, // whole-turn spins
      {
        rotationX: rot.fx, rotationY: rot.fy, // END exactly on the face
        duration: 0.95, ease: "power3.out",
        onComplete: () => {
          setTimeout(() => {
            gsap.to(".dice-overlay", { opacity: 0, scale: 0.6, duration: 0.3, ease: "power2.in", onComplete: finish });
          }, 450);
        },
      }
    );
  } else if (el) {
    el.style.transform = `rotateX(${rot.fx}deg) rotateY(${rot.fy}deg)`;
  }
  // Safety fallback: never stall the turn even if rAF is paused/throttled.
  setTimeout(finish, 2300);
}

// 3) dice recedes -> move the token
function g2DiceDone() {
  const g = state.g2;
  g.preRoll = g.teams[g.turn].pos;
  g.landing = Math.min(g.preRoll + g.dice, g.size);
  g.phase = "moving";
  g.banner = { text: `${UI.rolled}: ${g.dice}`, kind: "roll" };
  render();
  g2AnimateMove(g.turn, g.landing, () => g2AfterLanding());
}

// Move a team's token one square at a time toward `target`, then call cb.
function g2AnimateMove(teamIdx, target, cb, instant) {
  const g = state.g2;
  const t = g.teams[teamIdx];
  if (instant) { t.pos = target; positionTokens(); cb(); return; } // teleport (steal swap)
  const step = () => {
    if (t.pos === target) { cb(); return; }
    t.pos += target > t.pos ? 1 : -1;
    positionTokens(); // move only the token elements (no full board re-render)
    setTimeout(step, HOP_MS);
  };
  step();
}

function g2AfterLanding() {
  const g = state.g2;
  g.landedType = g._forceType || g.types[g.landing] || "normal"; // _forceType: DEBUG only
  g._forceType = null;
  g.banner = { text: landedText(g.landedType), kind: "land-" + g.landedType };
  g.phase = "reveal";
  render();
  // brief pause so the class sees WHICH square, then reveal the question
  setTimeout(() => {
    const chapter = randOf([...state.config.chapters]);
    const type = randOf(typesForChapter(chapter));
    const difficulty = 1 + Math.floor(Math.random() * 3);
    const opts = type === TYPES.ROUND ? { variant: Math.random() < 0.5 ? "numeric" : "multiple_choice" } : {};
    g.question = generateQuestion(type, chapter, difficulty, opts);
    g.orderPick = [];
    g.phase = "question";
    render();
  }, 1100);
}

function landedText(type) {
  if (type === "bonus") return UI.landedBonus;
  if (type === "trap") return UI.landedTrap;
  if (type === "steal") return UI.landedSteal;
  return UI.landedNormal;
}

function g2SubmitAnswer(ans) {
  const g = state.g2;
  if (g.phase !== "question") return;
  const { correct } = gradeAnswer(g.question, ans);
  const turn = g.turn;
  const type = g.landedType;
  let target;
  let msg;

  if (correct) {
    if (type === "bonus") { target = Math.min(g.landing + 3, g.size); msg = UI.resBonus; }
    else if (type === "trap") { target = g.preRoll; msg = UI.resTrap; }
    else if (type === "steal") {
      // furthest-forward OTHER team
      let maxPos = -1, maxIdx = -1;
      g.teams.forEach((t, i) => { if (i !== turn && t.pos > maxPos) { maxPos = t.pos; maxIdx = i; } });
      if (maxIdx !== -1 && maxPos > g.landing) {
        g.teams[maxIdx].pos = g.landing; // leader takes our square
        target = maxPos; // we take the leader's square
        msg = UI.resStealYes;
      } else { target = g.landing; msg = UI.resStealNone; } // we're already furthest
    } else { target = g.landing; msg = UI.resStay; }
  } else {
    target = g.preRoll; // incorrect: undo this turn's advance entirely
    msg = UI.resBack;
  }

  g.phase = "resolved";
  g.banner = null;
  // PART C fix: reveal the intact board by removing ONLY the question overlay,
  // instead of a full render() that rebuilt the heavy board SVG (the flicker).
  g2CloseQuestionOverlay();

  // ---- special-tile flourishes (visual + SFX only; do NOT gate/await these;
  //      the movement below runs regardless so the turn never stalls) ----
  const isStealSwap = correct && type === "steal" && msg === UI.resStealYes;
  if (type === "trap") { burstAt(g.landing); Audio.sfx("trap"); }
  else if (correct && type === "bonus") { hopAt(g.landing); Audio.sfx("bonus"); }
  else if (isStealSwap) { teleportAt(g.landing); teleportAt(target); Audio.sfx("swap"); }

  // PART D: big centered result text, consistent across outcomes. Steal-but-
  // already-furthest (no actual swap) reads as a plain correct, not a dramatic
  // "steal!" moment that didn't happen.
  if (type === "trap") bigResult(UI.bigTrap, "trap");
  else if (correct && type === "bonus") bigResult(UI.bigBonus, "bonus");
  else if (isStealSwap) bigResult(UI.bigSteal, "steal");
  else if (correct) bigResult(UI.bigCorrect, "good");
  else bigResult(UI.bigWrong, "soft-bad");

  // celebrate genuine forward progress (correct, and not a trap that sends back)
  if (correct && type !== "trap" && target >= g.landing) celebrate();

  // steal = instant teleport (both chars swap in place); others = hop animation.
  g2AnimateMove(turn, target, () => {
    if (g.teams[turn].pos >= g.size) {
      g.winner = turn;
      state.screen = "g2win";
      render();
      return;
    }
    setTimeout(g2NextTurn, 900);
  }, isStealSwap);
}

function g2NextTurn() {
  const g = state.g2;
  g.turn = (g.turn + 1) % g.teams.length;
  g.phase = "roll";
  g.busy = false;
  g.dice = null;
  g.question = null;
  g.orderPick = [];
  g.banner = null;
  render();
}

function wireG2Play() {
  document.getElementById("g2-stop").onclick = () => { state.modal = { kind: "stop" }; render(); };
  const roll = document.getElementById("g2-roll");
  if (roll) roll.onclick = g2StartTurn;

  const g = state.g2;

  // GSAP entrance for the turn-announcement overlay (skip when hidden so the
  // element is never stuck at its from-state — it stays visible via CSS).
  if (g.phase === "announce" && window.gsap && !document.hidden) {
    gsap.fromTo("#turn-announce", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" });
  }

  if (g.phase !== "question" || !g.question) return;
  const q = g.question;

  if (q.format === "numeric") {
    const input = document.getElementById("g2-num");
    const submit = () => { if (input.value === "") return; g2SubmitAnswer(Number(input.value)); };
    document.getElementById("g2-num-submit").onclick = submit;
    input.onkeydown = (e) => { if (e.key === "Enter") submit(); };
    input.focus();
  } else if (q.format === "multiple_choice") {
    app.querySelectorAll("[data-g2mc]").forEach((b) => {
      b.onclick = () => g2SubmitAnswer(q.options[Number(b.dataset.g2mc)]);
    });
  } else if (q.format === "ordering") {
    app.querySelectorAll("[data-g2order]").forEach((b) => {
      b.onclick = () => {
        const i = Number(b.dataset.g2order);
        if (g.orderPick.includes(i)) return;
        g.orderPick.push(i);
        updateOrderUI(); // targeted update — no full board rebuild (no flicker)
      };
    });
    const os = document.getElementById("g2-order-submit");
    if (os) os.onclick = () => g2SubmitAnswer(g.orderPick.map((i) => q.options[i].value));
    document.getElementById("g2-order-reset").onclick = () => { g.orderPick = []; updateOrderUI(); };
  }
}

// =============================================================================
// GAME 3 — table conquest (10×10 multiplication grid, claim cells by answering)
// =============================================================================
// Self-contained like Game 2 (state.g3). The multiplication here is trivial
// (r×c, r,c ∈ 1..10) and intrinsically tied to the grid, so it lives here in
// the presentation layer — the shared question engine (src/*) is untouched.
const G3_SIZE = 10;
function g3Key(r, c) { return r + "," + c; }

function startGame3() {
  state.teams = state.teams.map((t) => ({ name: t.name, score: 0 }));
  state.g3 = {
    owner: {}, // "r,c" -> teamIdx of the claiming team
    teams: state.teams.map((t, i) => ({
      name: t.name,
      color: TOKEN_COLORS[i % TOKEN_COLORS.length],
      score: 0, // points (incl. square + line bonuses)
      cells: 0, // count of owned cells
    })),
    target: null, // { r, c } currently in play
    question: null, // { r, c, product, options: [4 numbers] }
    selectedTeam: null,
    lockedTeams: [], // teams that already missed THIS target
    round: 0, // resolved targets so far
    roundCap: state.config.g3Rounds,
    feedback: null,
    busy: false, // true during the post-answer pause
    winner: null,
    lastClaim: null, // "r,c" of the most recent claim (gates the pop animation)
    reveal: null, // { r, c, product } shown briefly when everyone misses
    character: 1, // which peep asks this round's question
    lastAnimatedTarget: null, // gates the character entrance animation
    history: [], // one record per resolved target: { r, c, correct } — for the insight screen
  };
  state.screen = "g3play";
  g3NewTarget();
}

function stopGame3() {
  state.g3 = null;
  state.teams = state.teams.map((t) => ({ name: t.name, score: 0 }));
  state.play = freshPlayState();
  state.screen = "mode";
  render();
}

// ---- question building ----
function g3Distractors(r, c, product) {
  const cand = new Set();
  const add = (v) => { if (v > 0 && v !== product) cand.add(v); };
  // "off by one factor" — the classic multiplication slips
  add(r * (c + 1)); add(r * (c - 1)); add((r + 1) * c); add((r - 1) * c);
  add(product + r); add(product - r); add(product + c); add(product - c);
  // guaranteed fillers so tiny products (e.g. 1×1) still get 3 distinct wrongs
  add(product + 1); add(product + 2); add(product + 3); add(product - 1);
  return shuffleInPlace([...cand]).slice(0, 3);
}
function g3MakeQuestion(r, c) {
  const product = r * c;
  const options = shuffleInPlace([product, ...g3Distractors(r, c, product)]);
  return { r, c, product, options };
}
function g3Unclaimed() {
  const g = state.g3;
  const free = [];
  for (let r = 1; r <= G3_SIZE; r++)
    for (let c = 1; c <= G3_SIZE; c++)
      if (g.owner[g3Key(r, c)] === undefined) free.push({ r, c });
  return free;
}
function g3NewTarget() {
  const g = state.g3;
  g.selectedTeam = null;
  g.lockedTeams = [];
  g.feedback = null;
  g.reveal = null;
  g.busy = false;
  const free = g3Unclaimed();
  if (free.length === 0) { g3Finish(); return; }
  g.target = randOf(free);
  g.question = g3MakeQuestion(g.target.r, g.target.c);
  g.character = 1 + Math.floor(Math.random() * PEEP_COUNT); // rotate the peep
  render();
}

// ---- answering ----
function g3SelectTeam(i) {
  const g = state.g3;
  if (g.busy) return;
  if (g.lockedTeams.includes(i)) {
    g.feedback = { text: UI.teamAlreadyTried, kind: "bad" };
    render();
    return;
  }
  g.selectedTeam = i;
  g.feedback = null;
  render();
}

function g3HandleAnswer(value) {
  const g = state.g3;
  const teamIdx = g.selectedTeam;
  if (teamIdx === null || g.busy) return;

  if (value === g.question.product) {
    g3Claim(teamIdx);
  } else {
    if (!g.lockedTeams.includes(teamIdx)) g.lockedTeams.push(teamIdx);
    g.selectedTeam = null;
    if (g.lockedTeams.length >= g.teams.length) {
      g3AllMissed();
    } else {
      g.feedback = { text: UI.wrongTryAnother, kind: "bad" };
      render();
      Audio.sfx("wrong");
      bigResult(UI.bigWrong, "soft-bad");
    }
  }
}

// ---- line-completion helpers (row/col fully claimed → majority owner bonus) ----
function g3RowFull(r) {
  const g = state.g3;
  for (let c = 1; c <= G3_SIZE; c++) if (g.owner[g3Key(r, c)] === undefined) return false;
  return true;
}
function g3ColFull(c) {
  const g = state.g3;
  for (let r = 1; r <= G3_SIZE; r++) if (g.owner[g3Key(r, c)] === undefined) return false;
  return true;
}
// Majority owner of a completed line; ties resolve to the claiming team (which
// always owns a cell in the line), so "closing out" a line you lead is rewarded.
function g3LineMajority(counts, claimer) {
  let max = -1;
  for (const k in counts) max = Math.max(max, counts[k]);
  const top = Object.keys(counts).map(Number).filter((idx) => counts[idx] === max);
  return top.includes(claimer) ? claimer : top[0];
}
function g3AwardLineBonus(r, c, claimer) {
  const g = state.g3;
  const awarded = [];
  if (g3RowFull(r)) {
    const counts = {};
    for (let cc = 1; cc <= G3_SIZE; cc++) { const o = g.owner[g3Key(r, cc)]; counts[o] = (counts[o] || 0) + 1; }
    const w = g3LineMajority(counts, claimer);
    g.teams[w].score += 3; awarded.push(w);
  }
  if (g3ColFull(c)) {
    const counts = {};
    for (let rr = 1; rr <= G3_SIZE; rr++) { const o = g.owner[g3Key(rr, c)]; counts[o] = (counts[o] || 0) + 1; }
    const w = g3LineMajority(counts, claimer);
    g.teams[w].score += 3; awarded.push(w);
  }
  return awarded;
}

function g3Claim(teamIdx) {
  const g = state.g3;
  const { r, c } = g.target;
  g.owner[g3Key(r, c)] = teamIdx;
  g.lastClaim = g3Key(r, c);
  g.busy = true;
  g.selectedTeam = null;

  const team = g.teams[teamIdx];
  team.cells += 1;
  const square = r === c; // diagonal = square number = double points
  team.score += square ? 2 : 1;

  const bonuses = g3AwardLineBonus(r, c, teamIdx); // majority-owner line bonus
  g.round += 1;
  g.history.push({ r, c, correct: true });

  g.feedback = {
    text: bonuses.length ? UI.g3LineBonus : square ? UI.g3SquareBonus : UI.correct,
    kind: "good",
  };
  render();
  celebrate();
  Audio.sfx(square || bonuses.length ? "bonus" : "correct");
  bigResult(UI.bigCorrect, square || bonuses.length ? "bonus" : "good");
  setTimeout(g3AdvanceOrFinish, 1250);
}

function g3AllMissed() {
  const g = state.g3;
  g.busy = true;
  g.reveal = { r: g.target.r, c: g.target.c, product: g.question.product };
  g.round += 1;
  g.history.push({ r: g.target.r, c: g.target.c, correct: false });
  g.feedback = { text: UI.noneCorrect, kind: "bad" };
  render();
  Audio.sfx("wrong");
  bigResult(UI.bigWrong, "soft-bad");
  setTimeout(g3AdvanceOrFinish, 1550);
}

function g3AdvanceOrFinish() {
  const g = state.g3;
  if (!g) return;
  if (g.round >= g.roundCap || g3Unclaimed().length === 0) { g3Finish(); return; }
  g3NewTarget();
}

function g3Finish() {
  const g = state.g3;
  if (!g) { state.screen = "mode"; render(); return; }
  let best = 0;
  for (let i = 1; i < g.teams.length; i++) {
    const a = g.teams[i], b = g.teams[best];
    if (a.score > b.score || (a.score === b.score && a.cells > b.cells)) best = i;
  }
  g.winner = best;
  state.screen = "g3win";
  render();
}

// ---- rendering ----
function renderG3Play() {
  const g = state.g3;
  const q = g.question;
  const roundNum = Math.min(g.round + 1, g.roundCap);
  const chips = g.teams
    .map(
      (t) => `<span class="g3-chip"><span class="tk-dot" style="background:${t.color}"></span>${esc(t.name)} <b>${t.score}</b></span>`
    )
    .join("");
  return `
    <div class="g3-root">
      <div class="g2-topbar g3-topbar">
        <div class="g3-round">${UI.g3Round} ${roundNum}/${g.roundCap}</div>
        <div class="g3-chips">${chips}</div>
        <div class="spacer"></div>
        <button class="nav-home" id="nav-home">🏠</button>
        <button class="btn-danger" id="g3-stop">${UI.stop}</button>
      </div>
      <div class="g3-main">
        <div class="g3-grid-wrap">${renderG3Grid()}</div>
        <div class="g3-panel">
          <div class="g3-asker">
            <img class="g3-peep" id="g3-peep-img" src="assets/characters/peep-${g.character}.svg" alt="character" />
            <div class="g3-question">${q.r} × ${q.c} = ?</div>
          </div>
          <div class="g3-conquer muted">${UI.g3Conquer}</div>
          <div class="g3-teams">${renderG3Scoreboard()}</div>
          <div class="answer-area ${g.selectedTeam === null ? "disabled" : ""}">${renderG3Answer()}</div>
          ${g.feedback ? `<div class="feedback ${g.feedback.kind}">${esc(g.feedback.text)}</div>` : `<div class="feedback"></div>`}
        </div>
      </div>
    </div>`;
}

function renderG3Grid() {
  const g = state.g3;
  let cells = `<div class="g3-corner"></div>`;
  for (let c = 1; c <= G3_SIZE; c++) cells += `<div class="g3-head">${c}</div>`;
  for (let r = 1; r <= G3_SIZE; r++) {
    cells += `<div class="g3-head">${r}</div>`;
    for (let c = 1; c <= G3_SIZE; c++) {
      const key = g3Key(r, c);
      const owner = g.owner[key];
      const isTarget = g.target && g.target.r === r && g.target.c === c;
      const isReveal = g.reveal && g.reveal.r === r && g.reveal.c === c;
      let cls = "g3-cell";
      let content = "";
      let style = "";
      if (owner !== undefined) {
        cls += " claimed";
        style = `background:${g.teams[owner].color}`;
        content = r * c; // product revealed ONLY once claimed
        if (g.lastClaim === key) cls += " pop";
      } else if (isReveal) {
        cls += " reveal";
        content = g.reveal.product;
      } else {
        cls += " free";
        if (r === c) cls += " square"; // gold-marked bonus cell (no number shown)
      }
      if (isTarget) cls += " target";
      cells += `<div class="${cls}" style="${style}">${content}</div>`;
    }
  }
  return `<div class="g3-grid">${cells}</div>`;
}

function renderG3Scoreboard() {
  const g = state.g3;
  return g.teams
    .map((t, i) => {
      const locked = g.lockedTeams.includes(i);
      const sel = i === g.selectedTeam ? "selected" : "";
      return `<button class="g3-team ${sel} ${locked ? "locked" : ""}" data-g3team="${i}" ${locked ? "disabled" : ""}
                title="${locked ? esc(UI.teamAlreadyTried) : ""}">
          <span class="tk-dot" style="background:${t.color}"></span>
          <span class="g3-team-name">${esc(t.name)}</span>
          <span class="g3-team-score">${t.cells}</span>
        </button>`;
    })
    .join("");
}

function renderG3Answer() {
  const g = state.g3;
  if (g.selectedTeam === null) return `<p class="muted">${UI.pickTeamFirst}</p>`;
  return `<div class="mc-grid" style="justify-content:center">${g.question.options
    .map((o, i) => `<button class="mc-btn" data-g3ans="${i}">${o}</button>`)
    .join("")}</div>`;
}

// Per-times-table correct/incorrect breakdown for the insight table. A cell
// (r,c) counts toward BOTH its row's and column's table (e.g. 3×7 counts for
// both the ×3 and ×7 tables); a square cell (r===c) counts once. This is the
// same "diagnostic map" the original pitch promised — which tables the class
// actually struggled with — not just who won.
function g3TableStats(history) {
  const stats = {};
  for (let n = 1; n <= G3_SIZE; n++) stats[n] = { correct: 0, incorrect: 0 };
  for (const h of history) {
    const nums = h.r === h.c ? [h.r] : [h.r, h.c];
    for (const n of nums) {
      if (h.correct) stats[n].correct++;
      else stats[n].incorrect++;
    }
  }
  return stats;
}

function renderG3Win() {
  const g = state.g3;
  const w = g && g.winner != null ? g.teams[g.winner] : null;
  const standings = g
    ? g.teams.map((t) => t).sort((a, b) => b.score - a.score || b.cells - a.cells)
    : [];
  const rows = standings
    .map(
      (t) => `<tr>
        <td><span class="tk-dot" style="background:${t.color}"></span> ${esc(t.name)}</td>
        <td class="num">${t.score}</td>
        <td class="num">${t.cells}</td>
      </tr>`
    )
    .join("");

  const history = g ? g.history : [];
  const stats = g3TableStats(history);
  const tableSection = history.length
    ? `<table class="insight-table">
         <thead><tr><th>${UI.g3TableCol}</th><th class="num">${UI.colCorrect}</th><th class="num">${UI.colIncorrect}</th></tr></thead>
         <tbody>${Array.from({ length: G3_SIZE }, (_, i) => i + 1)
           .map(
             (n) => `<tr>
               <td>×${n}</td>
               <td class="num good-text">${stats[n].correct}</td>
               <td class="num bad-text">${stats[n].incorrect}</td>
             </tr>`
           )
           .join("")}</tbody>
       </table>`
    : `<p class="muted">${UI.g3NoAttempts}</p>`;

  return `
    <div class="podium-screen">
      <div class="podium-trophy">🏆</div>
      <div class="podium-sub">${UI.wonPrefix}</div>
      <div class="podium-winner" style="color:${w ? w.color : "var(--accent-3)"}">${w ? esc(w.name) : ""}</div>
    </div>
    <div class="card g3-standings-card">
      <h3 style="margin-top:0">${UI.g3Standings}</h3>
      <table class="insight-table">
        <thead><tr><th></th><th class="num">${UI.g3Points}</th><th class="num">${UI.g3Cells}</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <h3 style="margin-top:24px">${UI.g3TableTitle}</h3>
      ${tableSection}
      <div class="row" style="justify-content:center;margin-top:22px">
        <button class="btn-primary btn-lg" id="g3win-menu">${UI.backToMenu}</button>
      </div>
    </div>`;
}

function wireG3Play() {
  document.getElementById("g3-stop").onclick = () => { state.modal = { kind: "stop" }; render(); };
  const g = state.g3;
  if (!g) return;

  // Play the character entrance animation ONCE per new target (not on every
  // re-render such as team selection), same pattern as Game 1's peep.
  const peep = document.getElementById("g3-peep-img");
  const targetKey = g.target ? g3Key(g.target.r, g.target.c) : null;
  if (peep && targetKey && g.lastAnimatedTarget !== targetKey) {
    peep.classList.add("pop-in");
    g.lastAnimatedTarget = targetKey;
  }

  if (g.busy) return; // during the post-answer pause, ignore taps
  app.querySelectorAll("[data-g3team]").forEach((b) => {
    b.onclick = () => g3SelectTeam(Number(b.dataset.g3team));
  });
  if (g.selectedTeam !== null) {
    app.querySelectorAll("[data-g3ans]").forEach((b) => {
      b.onclick = () => g3HandleAnswer(g.question.options[Number(b.dataset.g3ans)]);
    });
  }
}

// =============================================================================
// ANIMATED BACKGROUND (Kahoot-style drifting shapes) — non-gameplay screens only
// =============================================================================
const BGFX_SHAPES = ["➕", "➖", "✖️", "➗", "🔢", "★", "●", "◆", "▲", "✦"];
const BGFX_COUNT = 32; // 2x the prior cap; still transform-only + fully hidden during play (see initBgFx/setBgFxActive)
let bgFxBuilt = false;

function initBgFx() {
  const layer = document.getElementById("bg-fx");
  if (!layer || bgFxBuilt) return;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < BGFX_COUNT; i++) {
    const el = document.createElement("span");
    el.className = "bgfx-shape";
    el.textContent = BGFX_SHAPES[i % BGFX_SHAPES.length];
    // random static anchor; motion is transform-only (GPU-friendly)
    el.style.left = Math.random() * 100 + "vw";
    el.style.top = Math.random() * 100 + "vh";
    el.style.fontSize = 1.6 + Math.random() * 3.2 + "rem";
    el.style.setProperty("--tx", (Math.random() * 40 - 20).toFixed(1) + "vw");
    el.style.setProperty("--ty", (Math.random() * 40 - 20).toFixed(1) + "vh");
    el.style.setProperty("--rot", (Math.random() * 720 - 360).toFixed(0) + "deg");
    el.style.animationDuration = (14 + Math.random() * 16).toFixed(1) + "s";
    el.style.animationDelay = (-Math.random() * 20).toFixed(1) + "s";
    frag.appendChild(el);
  }
  layer.appendChild(frag);
  bgFxBuilt = true;
}
// display:none fully stops the CSS animations (removed from render tree) during play.
function setBgFxActive(active) {
  const layer = document.getElementById("bg-fx");
  if (layer) layer.style.display = active ? "block" : "none";
}

// ---- Game 1 play-screen background: its own, faster, emoji-heavy variant ----
// Same transform+opacity-only technique as #bg-fx (proven safe — no filter, no
// scale, GPU-composited), just a livelier symbol set and a much shorter
// animation-duration range. Built once outside #app so it survives every
// re-render of the play screen without restarting; shown only while
// state.screen === "play" (see setG1BgFxActive, called from render()).
const G1_BGFX_SHAPES = ["🔢", "➕", "➖", "✖️", "➗", "🎉", "⭐", "🚀", "🏆", "💥", "🎯", "✨"];
const G1_BGFX_COUNT = 26;

function initG1BgFx() {
  const layer = document.createElement("div");
  layer.id = "g1-bg-fx";
  const frag = document.createDocumentFragment();
  for (let i = 0; i < G1_BGFX_COUNT; i++) {
    const el = document.createElement("span");
    el.className = "g1bgfx-shape";
    el.textContent = G1_BGFX_SHAPES[i % G1_BGFX_SHAPES.length];
    el.style.left = Math.random() * 100 + "vw";
    el.style.top = Math.random() * 100 + "vh";
    el.style.fontSize = 1.8 + Math.random() * 2.6 + "rem";
    el.style.setProperty("--tx", (Math.random() * 50 - 25).toFixed(1) + "vw");
    el.style.setProperty("--ty", (Math.random() * 50 - 25).toFixed(1) + "vh");
    el.style.setProperty("--rot", (Math.random() * 720 - 360).toFixed(0) + "deg");
    el.style.animationDuration = (4 + Math.random() * 5).toFixed(1) + "s"; // much faster than #bg-fx's 14-30s
    el.style.animationDelay = (-Math.random() * 9).toFixed(1) + "s";
    frag.appendChild(el);
  }
  layer.appendChild(frag);
  document.body.appendChild(layer);
}
function setG1BgFxActive(active) {
  const layer = document.getElementById("g1-bg-fx");
  if (layer) layer.style.display = active ? "block" : "none";
}

// =============================================================================
// AUDIO — synthesized SFX (offline) + optional bundled music (drop-in) + mute
// =============================================================================
const Audio = {
  ctx: null,
  started: false,
  muted: false,
  volume: 0.5,
  musicEls: {}, // track -> HTMLAudioElement
  currentTrack: null,

  // Called on the first user gesture (autoplay policies require this).
  start() {
    if (this.started) return;
    this.started = true;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { this.ctx = null; }
    // resume the music the current screen wants
    const t = state.screen === "play" ? "game1" : state.screen === "g2play" ? "game2" : "menu";
    this.playMusic(t);
  },

  ensureCtx() {
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  },

  // ---- synthesized sound effects (no files needed) ----
  sfx(name) {
    const ctx = this.ensureCtx();
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    const master = ctx.createGain();
    // correct/wrong get more presence than the rest of the SFX set (Part F) —
    // still scaled by the user's own volume/mute setting, just a higher base.
    const baseGain = (name === "correct" || name === "wrong") ? 0.27 : 0.18;
    master.gain.value = baseGain * this.volume;
    master.connect(ctx.destination);
    const tone = (freq, start, dur, type = "sine", peak = 1) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, now + start);
      g.gain.linearRampToValueAtTime(peak, now + start + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
      o.connect(g); g.connect(master);
      o.start(now + start); o.stop(now + start + dur + 0.02);
    };
    // short filtered-noise burst helper (for rattles/explosions/whooshes)
    const noise = (dur, filterType, freqStart, freqEnd, gain = 0.5) => {
      const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      const src = ctx.createBufferSource(); src.buffer = buf;
      const g = ctx.createGain(); g.gain.value = gain;
      const flt = ctx.createBiquadFilter(); flt.type = filterType; flt.frequency.setValueAtTime(freqStart, now);
      if (freqEnd != null) flt.frequency.exponentialRampToValueAtTime(freqEnd, now + dur);
      src.connect(flt); flt.connect(g); g.connect(master);
      src.start(now); src.stop(now + dur + 0.02);
    };

    if (name === "click") { tone(520, 0, 0.09, "triangle"); }
    else if (name === "correct") { tone(523, 0, 0.12, "sine"); tone(784, 0.1, 0.18, "sine"); tone(1046, 0.19, 0.24, "sine", 0.85); }
    else if (name === "wrong") { tone(220, 0, 0.22, "sawtooth", 0.85); tone(160, 0.14, 0.26, "sawtooth", 0.75); }
    else if (name === "turn") { tone(392, 0, 0.12, "triangle"); tone(587, 0.1, 0.16, "triangle"); }
    else if (name === "dice") { noise(0.25, "bandpass", 1200, null); }
    // ---- special-tile SFX (paired with the Part 4 animations) ----
    else if (name === "trap") { // short explosion: low boom + noise burst
      tone(90, 0, 0.28, "sawtooth", 0.9); tone(60, 0.02, 0.3, "sine", 0.8);
      noise(0.32, "lowpass", 900, 120, 0.7);
    }
    else if (name === "bonus") { // upbeat "yay" arpeggio up
      tone(523, 0, 0.1, "triangle"); tone(659, 0.08, 0.1, "triangle"); tone(880, 0.16, 0.18, "triangle");
    }
    else if (name === "swap") { // whoosh/teleport sweep
      noise(0.3, "bandpass", 400, 2600, 0.5); tone(700, 0, 0.22, "sine", 0.3);
    }
  },

  // ---- looping background music (optional files; graceful if missing) ----
  // per-game tracks; "menu" file not bundled yet (a third track is coming) — the
  // player fails silently on a missing file, so menu screens are simply quiet.
  MUSIC_SRC: { menu: "assets/audio/music-menu.mp3", game1: "assets/audio/game1.mp3", game2: "assets/audio/game2.mp3", game3: "assets/audio/game3.mp3" },
  playMusic(track) {
    if (!this.started || this.currentTrack === track) return;
    // pause any other track
    Object.values(this.musicEls).forEach((el) => { el.pause(); });
    this.currentTrack = track;
    if (this.muted) return;
    let el = this.musicEls[track];
    if (!el) {
      el = new window.Audio(this.MUSIC_SRC[track]);
      el.loop = true;
      el.addEventListener("error", () => {}); // missing file -> silent, no crash
      this.musicEls[track] = el;
    }
    el.volume = this.volume;
    const p = el.play();
    if (p && p.catch) p.catch(() => {}); // ignore autoplay/missing errors
  },

  setMuted(m) {
    this.muted = m;
    Object.values(this.musicEls).forEach((el) => { el.muted = m; });
    if (!m && this.started && this.currentTrack) {
      const t = this.currentTrack; this.currentTrack = null; this.playMusic(t);
    }
    updateMuteButton();
  },
  setVolume(v) {
    this.volume = v;
    Object.values(this.musicEls).forEach((el) => { el.volume = v; });
  },
};

// Always-accessible mute/volume control (fixed, outside #app so it persists).
function initAudioControl() {
  const ctrl = document.createElement("div");
  ctrl.id = "audio-ctrl";
  ctrl.innerHTML = `
    <button id="mute-btn" title="${UI.muteBtnTitle}">🔊</button>
    <input id="vol-slider" type="range" min="0" max="100" value="${Audio.volume * 100}" />`;
  document.body.appendChild(ctrl);
  ctrl.querySelector("#mute-btn").onclick = () => Audio.setMuted(!Audio.muted);
  ctrl.querySelector("#vol-slider").oninput = (e) => Audio.setVolume(Number(e.target.value) / 100);
}
function updateMuteButton() {
  const b = document.getElementById("mute-btn");
  if (b) b.textContent = Audio.muted ? "🔇" : "🔊";
}

// Language switch (Georgian / English), fixed outside #app so it persists —
// same pattern as #audio-ctrl. Only shown on the main menu, team setup, and
// mode-select screens (toggled by setLangSwitchVisible, called from render()).
function initLangSwitch() {
  const el = document.createElement("div");
  el.id = "lang-switch";
  el.innerHTML = `
    <button id="lang-ka" class="lang-btn" title="ქართული" aria-label="ქართული">🇬🇪</button>
    <button id="lang-en" class="lang-btn" title="English" aria-label="English">🇺🇸</button>`;
  document.body.appendChild(el);
  el.querySelector("#lang-ka").onclick = () => setLang("ka");
  el.querySelector("#lang-en").onclick = () => setLang("en");
  updateLangSwitchUI();
}
function updateLangSwitchUI() {
  const ka = document.getElementById("lang-ka");
  const en = document.getElementById("lang-en");
  if (ka) ka.classList.toggle("active", state.lang === "ka");
  if (en) en.classList.toggle("active", state.lang === "en");
}
function setLangSwitchVisible(visible) {
  const el = document.getElementById("lang-switch");
  if (el) el.style.display = visible ? "flex" : "none";
}
function setLang(lang) {
  if (state.lang === lang) return;
  state.lang = lang; // UI Proxy below now resolves to the new language
  // Team names default to "<teamName> <n>" (baked in at boot, or whenever
  // left blank) — refresh any team whose name still matches that pattern in
  // EITHER language so an untouched default follows the switch too. A name
  // the teacher actually typed never matches this pattern, so it's left alone.
  state.teams.forEach((t, i) => {
    if (t.name === `${UI_KA.teamName} ${i + 1}` || t.name === `${UI_EN.teamName} ${i + 1}`) {
      t.name = `${UI.teamName} ${i + 1}`;
    }
  });
  document.documentElement.lang = lang;
  document.title = UI.appTitle;
  const muteBtn = document.getElementById("mute-btn");
  if (muteBtn) muteBtn.title = UI.muteBtnTitle;
  updateLangSwitchUI();
  render();
}

// One-time: start audio on the first user gesture; play a light click on buttons.
function initAudioGestures() {
  const startOnce = () => { Audio.start(); };
  document.addEventListener("pointerdown", startOnce, { once: true });
  // delegated click SFX for all buttons
  document.addEventListener("click", (e) => {
    if (e.target.closest("button") && !e.target.closest("#audio-ctrl")) Audio.sfx("click");
  });
}

// -----------------------------------------------------------------------------
// DEBUG / fast-forward helpers (for demoing the insight screen without playing
// a full game). Open the console and call __insightDemo(), or load with ?debug=1
// to get a "⏩" button on the play screen that jumps straight to insight.
// -----------------------------------------------------------------------------
function seedDemoInsight() {
  // Ensure teams exist even from a cold load.
  if (state.teams.length === 0) syncTeamCount(2);
  state.play = freshPlayState();
  // A full spread: every one of the 6 types, a mix of correct/incorrect so
  // both the type table and (via patterns) the down-adaptation are visible.
  const spread = [
    ["addition", 3, true], ["addition", 3, false],
    ["subtraction", 3, true], ["subtraction", 3, false],
    ["compare", 1, true], ["compare", 2, false],
    ["order", 1, true], ["order", 2, true],
    ["round", 1, true], ["round", 2, false],
    ["estimate", 3, true], ["estimate", 3, false],
  ];
  for (const [type, chapter, correct] of spread) state.play.history.push({ type, chapter, correct });
  // All three real mistake patterns, so the pattern lens is populated.
  state.play.patternCounts = { no_carry: 3, wrong_borrow: 2, forgot_decrement: 1 };
  state.play.winnerName = state.teams[0] ? state.teams[0].name : "გუნდი 1";
  // Show that difficulty adapted down over the game.
  state.play.difficulty = 1;
}
window.__insightDemo = () => {
  seedDemoInsight();
  state.screen = "insight";
  render();
};
const DEBUG = new URLSearchParams(location.search).has("debug");
if (DEBUG) {
  // debug-only introspection helpers (no effect on normal play)
  window.__q = () => state.play.question;
  window.__state = () => state;
  window.__g2 = () => state.g2;
  window.__g3 = () => state.g3;
  // Force the NEXT Game 3 target to a specific cell (test square/line bonuses).
  window.__g3force = (r, c) => {
    const g = state.g3; if (!g) return "no g3";
    g.selectedTeam = null; g.lockedTeams = []; g.feedback = null; g.reveal = null; g.busy = false;
    g.target = { r, c };
    g.question = g3MakeQuestion(r, c);
    render();
    return { product: r * c };
  };
  window.__audio = () => Audio;
  // Force a specific square type for the NEXT landing (test special squares).
  window.__forceType = (t) => { if (state.g2) state.g2._forceType = t; };
  // Jump straight to the question phase (skips roll/move/reveal animation) so
  // the resolution branches can be tested without waiting on throttled timers.
  window.__g2quick = (forceType, preRoll, dice) => {
    const g = state.g2; if (!g) return "no g2";
    g.preRoll = preRoll;
    g.landing = Math.min(preRoll + dice, g.size);
    g.teams[g.turn].pos = g.landing; // as if the token already advanced
    g.landedType = forceType;
    const chapter = randOf([...state.config.chapters]);
    const type = randOf(typesForChapter(chapter));
    g.question = generateQuestion(type, chapter, 2, type === TYPES.ROUND ? { variant: "numeric" } : {});
    g.orderPick = [];
    g.phase = "question";
    g.busy = true;
    render();
    return { landing: g.landing, type: g.question.type, format: g.question.format };
  };
}

// ---- boot ----
syncTeamCount(2); // seed two teams so the setup inputs show on first paint
initBgFx();
initG1BgFx();
initAudioControl();
initLangSwitch();
initAudioGestures();
render();
