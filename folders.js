// Word Workshop — content data.
//
// TABS: the topic tabs shown on the start screen.
// WORD_ITEMS: every word, grouped by `tab` and `level`. `level` just
// controls grouping/ordering on the level grid (all levels are always
// playable, no locking).
//
// Each word:
//   word           - shown/spoken/matched against
//   tab            - which TABS entry it belongs to
//   image          - path to a photo. If the file doesn't exist yet, the UI
//                    falls back to images/placeholder.svg automatically —
//                    just drop a real photo at this exact path whenever it's
//                    ready, no code changes needed.
//   level          - grouping within its tab (see above)
//   chunks         - ordered sound pieces for "Say It" mode; must join back
//                    into `word` when concatenated. This is also the answer
//                    key for the build-the-word tile game, so prefer small
//                    pieces (2-4) over big ones — a word split into only 2
//                    chunks makes for a trivially easy build. Words that are
//                    already short/one-syllable (Mouse, Home, Bank...) are
//                    fine left as a single chunk.
//   letterByLetter - (optional) true for acronyms — build/say-the-word
//                    spells the letters instead of blending sound pieces
//   group          - (optional) scopes the quiz's answer-choice pool to only
//                    other words sharing the same group within the tab,
//                    instead of the whole tab. Use this for words that are
//                    easily confused with each other and should be drilled
//                    against each other specifically (e.g. Mother/Father/
//                    Sister/Brother share group "immediate" so those
//                    questions only ever offer each other, never Baby).
//                    Words without a group fall back to the whole-tab pool.
//   note           - (optional) short caption shown in "Say It" mode
//   hidden         - (optional) true excludes this word entirely from the
//                    level grid, quizzes, answer-choice pools, and Say It —
//                    the entry stays in the file (photo/data intact) but is
//                    otherwise inert. Use to pull a word out of rotation
//                    temporarily without losing its content.

const TABS = [
  { id: "family", label: "Family" },
  { id: "computer", label: "Computer Parts" },
  { id: "types", label: "Computer Types" },
  { id: "places", label: "Places" },
  { id: "plants", label: "Plants" },
];

const WORD_ITEMS = [
  // ---- Family ----
  // Mother/Father/Sister/Brother share group "immediate" — their quiz
  // answer choices only ever offer each other. Grandfather/Grandmother are
  // hidden (the child doesn't respond well to those photos yet) — data and
  // photos stay in place, just flip `hidden: false` to bring them back.
  { word: "Mother", tab: "family", image: "images/mother.jpg", level: 1, group: "immediate", chunks: ["Mo", "th", "er"] },
  { word: "Father", tab: "family", image: "images/father.jpeg", level: 1, group: "immediate", chunks: ["Fa", "th", "er"] },
  { word: "Sister", tab: "family", image: "images/sister.jpg", level: 2, group: "immediate", chunks: ["Sis", "t", "er"] },
  { word: "Brother", tab: "family", image: "images/brother.jpg", level: 2, group: "immediate", chunks: ["Bro", "th", "er"] },
  { word: "Baby", tab: "family", image: "images/baby.jpg", level: 3, chunks: ["Ba", "by"] },
  { word: "Grandfather", tab: "family", image: "images/grandfather.jpg", level: 4, hidden: true, chunks: ["Grand", "fa", "th", "er"] },
  { word: "Grandmother", tab: "family", image: "images/grandmother.jpg", level: 4, hidden: true, chunks: ["Grand", "mo", "th", "er"] },

  // ---- Computer Parts ----
  { word: "Monitor", tab: "computer", image: "images/monitor.jpg", level: 1, chunks: ["Mo", "ni", "tor"] },
  { word: "Keyboard", tab: "computer", image: "images/keyboard.jpg", level: 1, chunks: ["Key", "board"] },
  { word: "Mouse", tab: "computer", image: "images/mouse.jpg", level: 1, chunks: ["Mouse"] },
  { word: "Speaker", tab: "computer", image: "images/speaker.jpg", level: 1, chunks: ["Spea", "ker"] },
  { word: "Printer", tab: "computer", image: "images/printer.jpeg", level: 2, chunks: ["Prin", "ter"] },
  { word: "CPU", tab: "computer", image: "images/CPU.jpg", level: 3, chunks: ["C", "P", "U"], letterByLetter: true, note: "the brain of the computer" },
  { word: "UPS", tab: "computer", image: "images/ups.jpg", level: 3, chunks: ["U", "P", "S"], letterByLetter: true, note: "keeps the computer on when the power goes off" },

  // ---- Computer Types ----
  { word: "Computer", tab: "types", image: "images/computer.jpg", level: 1, chunks: ["Com", "pu", "ter"] },
  { word: "Laptop", tab: "types", image: "images/laptop.jpg", level: 1, chunks: ["Lap", "top"] },
  { word: "Desktop", tab: "types", image: "images/desktop.jpg", level: 2, chunks: ["Desk", "top"] },
  { word: "Tablet", tab: "types", image: "images/tablet.jpg", level: 2, chunks: ["Ta", "blet"] },
  { word: "Smartphone", tab: "types", image: "images/smartphone.jpg", level: 3, chunks: ["Smart", "phone"] },

  // ---- Places ----
  { word: "Home", tab: "places", image: "images/house.webp", level: 1, chunks: ["Home"] },
  { word: "School", tab: "places", image: "images/school.avif", level: 1, chunks: ["School"] },
  { word: "Hospital", tab: "places", image: "images/hospital.avif", level: 2, chunks: ["Hos", "pi", "tal"] },
  { word: "Bank", tab: "places", image: "images/bank.jpg", level: 2, chunks: ["Bank"] },
  { word: "Airport", tab: "places", image: "images/airport.webp", level: 3, chunks: ["Air", "port"] },

  // ---- Plants ----
  { word: "Flower", tab: "plants", image: "images/flower.jpg", level: 1, chunks: ["Flow", "er"] },
  { word: "Leaf", tab: "plants", image: "images/leaf.png", level: 1, chunks: ["Leaf"] },
  { word: "Stem", tab: "plants", image: "images/stem.jpeg", level: 2, chunks: ["Stem"] },
  { word: "Root", tab: "plants", image: "images/root.jpeg", level: 2, chunks: ["Root"] },
];
