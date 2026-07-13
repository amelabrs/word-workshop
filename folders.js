// Word Workshop — topic folder data.
//
// To add a new topic, add a new key here with a `label` and a `words` array.
// Each word needs: `word`, `icon` (emoji), and `chunks` (syllable/phonics
// pieces to sound out, in order — they must join back into the word).
// Set `letterByLetter: true` and add a `note` for acronyms/abbreviations
// (see cpu/ups below) so "Say the word" spells it out instead of blending it.
//
// No other file needs to change to add a folder or a word — app.js reads
// this object at runtime.

const FOLDERS = {
  family: {
    label: "Family",
    words: [
      { word: "mother", icon: "👩", chunks: ["mo", "ther"] },
      { word: "father", icon: "👨", chunks: ["fa", "ther"] },
      { word: "sister", icon: "👧", chunks: ["sis", "ter"] },
      { word: "brother", icon: "👦", chunks: ["bro", "ther"] },
      { word: "baby", icon: "👶", chunks: ["ba", "by"] },
      { word: "grandmother", icon: "👵", chunks: ["grand", "mo", "ther"] },
    ],
  },
  computer: {
    label: "Computer Parts",
    words: [
      { word: "monitor", icon: "🖥️", chunks: ["mo", "ni", "tor"] },
      { word: "keyboard", icon: "⌨️", chunks: ["key", "board"] },
      { word: "mouse", icon: "🖱️", chunks: ["mouse"] },
      { word: "speaker", icon: "🔊", chunks: ["spea", "ker"] },
      { word: "printer", icon: "🖨️", chunks: ["prin", "ter"] },
      { word: "cpu", icon: "🧠", chunks: ["c", "p", "u"], letterByLetter: true, note: "the brain of the computer" },
      { word: "ups", icon: "🔌", chunks: ["u", "p", "s"], letterByLetter: true, note: "keeps the computer on when the power goes off" },
    ],
  },
  types: {
    label: "Computer Types",
    words: [
      { word: "computer", icon: "🖥️", chunks: ["com", "pu", "ter"] },
      { word: "laptop", icon: "💻", chunks: ["lap", "top"] },
      { word: "desktop", icon: "🖥️", chunks: ["desk", "top"] },
      { word: "tablet", icon: "📱", chunks: ["ta", "blet"] },
      { word: "smartphone", icon: "📲", chunks: ["smart", "phone"] },
    ],
  },
  places: {
    label: "Places",
    words: [
      { word: "home", icon: "🏠", chunks: ["home"] },
      { word: "school", icon: "🏫", chunks: ["school"] },
      { word: "hospital", icon: "🏥", chunks: ["hos", "pi", "tal"] },
      { word: "bank", icon: "🏦", chunks: ["bank"] },
      { word: "airport", icon: "✈️", chunks: ["air", "port"] },
    ],
  },
};
