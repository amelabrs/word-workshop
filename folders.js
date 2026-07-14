// Word Workshop — content data.
//
// TABS: the topic tabs shown on the start screen.
// WORD_ITEMS: every word, grouped by `tab` and `level`. `level` controls
// quiz progression — words with the same level are introduced together in
// one pair of game levels (Listen + Read), and pairs unlock in order as the
// child scores well. This is the same progression model as letterbrain.
//
// Each word:
//   word           - shown/spoken/matched against
//   tab            - which TABS entry it belongs to
//   image          - path to a photo. If the file doesn't exist yet, the UI
//                    falls back to images/placeholder.svg automatically —
//                    just drop a real photo at this exact path whenever it's
//                    ready, no code changes needed.
//   level          - progression grouping within its tab (see above)
//   chunks         - ordered syllable/sound pieces for "Say It" mode; must
//                    join back into `word` when concatenated
//   letterByLetter - (optional) true for acronyms — "Say the word" spells
//                    the letters instead of blending syllables
//   note           - (optional) short caption shown in "Say It" mode

const TABS = [
  { id: "family", label: "Family" },
  { id: "computer", label: "Computer Parts" },
  { id: "types", label: "Computer Types" },
  { id: "places", label: "Places" },
  { id: "plants", label: "Plants" },
];

const WORD_ITEMS = [
  // ---- Family ----
  // Real family photos (Mother, Father, Grandfather, Grandmother) prioritized
  // into the earlier levels; Sister/Brother/Baby use stock photos for now.
  { word: "Mother", tab: "family", image: "images/mother.jpg", level: 1, chunks: ["Mo", "ther"] },
  { word: "Father", tab: "family", image: "images/father.jpeg", level: 1, chunks: ["Fa", "ther"] },
  { word: "Grandfather", tab: "family", image: "images/grandfather.jpg", level: 2, chunks: ["Grand", "fa", "ther"] },
  { word: "Grandmother", tab: "family", image: "images/grandmother.jpg", level: 2, chunks: ["Grand", "mo", "ther"] },
  { word: "Sister", tab: "family", image: "images/sister.jpg", level: 3, chunks: ["Sis", "ter"] },
  { word: "Brother", tab: "family", image: "images/brother.jpg", level: 3, chunks: ["Bro", "ther"] },
  { word: "Baby", tab: "family", image: "images/baby.jpg", level: 4, chunks: ["Ba", "by"] },

  // ---- Computer Parts ----
  { word: "Monitor", tab: "computer", image: "images/monitor.jpg", level: 1, chunks: ["Mo", "ni", "tor"] },
  { word: "Keyboard", tab: "computer", image: "images/keyboard.jpg", level: 1, chunks: ["Key", "board"] },
  { word: "Mouse", tab: "computer", image: "images/mouse.jpg", level: 1, chunks: ["Mouse"] },
  { word: "Speaker", tab: "computer", image: "images/speaker.jpg", level: 2, chunks: ["Spea", "ker"] },
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
