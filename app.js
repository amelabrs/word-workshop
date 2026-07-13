// ============================================================
// Word Workshop — Alpine component
// Data (FOLDERS) lives in folders.js — this file is pure logic.
// ============================================================

const PROGRESS_KEY = "ww_progress";

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
  } catch (e) {
    return {};
  }
}
function saveProgress(progress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------- Speech ----------
let cachedVoice = null;
function pickVoice() {
  const voices = speechSynthesis.getVoices();
  cachedVoice =
    voices.find((v) => /en-IN/i.test(v.lang)) ||
    voices.find((v) => /en-GB/i.test(v.lang)) ||
    voices.find((v) => /^en/i.test(v.lang)) ||
    voices[0] ||
    null;
  return cachedVoice;
}
if ("speechSynthesis" in window) {
  speechSynthesis.onvoiceschanged = pickVoice;
  pickVoice();
}
function speak(text, rate = 0.85) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = rate;
  u.pitch = 1.05;
  const v = cachedVoice || pickVoice();
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}

// ---------- Alpine component ----------
function wordWorkshop() {
  return {
    folders: FOLDERS,
    folderKeys: Object.keys(FOLDERS),
    currentFolder: "family",
    currentMode: "match",
    bubble: "Pick a folder to start!",
    mascotBob: false,
    showProgress: false,
    progress: loadProgress(),

    // Listen & Match state
    matchOrder: [],
    matchPtr: 0,
    matchTarget: null,
    matchOptions: [],
    matchDone: 0,
    feedbackWord: null,
    feedbackType: null,

    // Say It (phonics) state
    stripIndex: 0,
    litChunkIndex: null,
    soundOutRunning: false,

    init() {
      this.startRound();
    },

    get words() {
      return this.folders[this.currentFolder].words;
    },
    get currentWord() {
      return this.words[this.stripIndex];
    },

    selectFolder(key) {
      this.currentFolder = key;
      this.startRound();
    },
    selectMode(mode) {
      this.currentMode = mode;
      this.startRound();
    },

    startRound() {
      this.stripIndex = 0;
      this.litChunkIndex = null;
      this.feedbackWord = null;
      this.feedbackType = null;
      if (this.currentMode === "match") {
        this.matchOrder = shuffle(this.words.map((_, i) => i));
        this.matchPtr = 0;
        this.matchDone = 0;
        this.bubble = "Listen, then tap the picture!";
        this.nextMatchQuestion();
      } else {
        this.bubble = "Tap each colour to hear the sound, then blend them!";
      }
    },

    // ---------- Listen & Match ----------
    nextMatchQuestion() {
      if (this.matchPtr >= this.matchOrder.length) {
        this.bubble = "You matched every word in this folder! 🎉";
        this.matchTarget = null;
        return;
      }
      const idx = this.matchOrder[this.matchPtr];
      this.matchTarget = this.words[idx];
      const pool = this.words.filter((_, i) => i !== idx);
      const distractors = shuffle(pool).slice(0, Math.min(3, pool.length));
      this.matchOptions = shuffle([this.matchTarget, ...distractors]);
      setTimeout(() => speak(this.matchTarget.word), 350);
    },

    replay() {
      if (this.matchTarget) speak(this.matchTarget.word);
    },

    pickClass(word) {
      if (word !== this.feedbackWord) return "";
      return this.feedbackType;
    },

    pick(opt) {
      if (this.feedbackType) return; // ignore taps while feedback is showing
      this.feedbackWord = opt.word;
      if (opt.word === this.matchTarget.word) {
        this.feedbackType = "correct";
        this.matchDone++;
        this.markMatched(this.currentFolder, opt.word);
        this.bob();
        this.bubble = "Yes! That's the " + this.matchTarget.word + " 🎉";
        speak("Yes! " + this.matchTarget.word);
        setTimeout(() => {
          this.feedbackWord = null;
          this.feedbackType = null;
          this.matchPtr++;
          this.nextMatchQuestion();
        }, 1100);
      } else {
        this.feedbackType = "wrong";
        this.bubble = "Listen again — try once more!";
        speak(this.matchTarget.word);
        setTimeout(() => {
          this.feedbackWord = null;
          this.feedbackType = null;
        }, 400);
      }
    },

    bob() {
      this.mascotBob = false;
      requestAnimationFrame(() => {
        this.mascotBob = true;
        setTimeout(() => (this.mascotBob = false), 700);
      });
    },

    // ---------- Say It (phonics) ----------
    jumpTo(i) {
      this.stripIndex = i;
      this.litChunkIndex = null;
    },

    tapChunk(i) {
      this.litChunkIndex = i;
      speak(this.currentWord.chunks[i], 0.65);
      setTimeout(() => {
        if (this.litChunkIndex === i) this.litChunkIndex = null;
      }, 500);
    },

    wholeWordSpeech() {
      const w = this.currentWord;
      return w.letterByLetter ? w.word.toUpperCase().split("").join(". ") : w.word;
    },

    sayWhole() {
      this.bubble = "Your turn — say it back!";
      speak(this.wholeWordSpeech(), 0.8);
    },

    soundOut() {
      if (this.soundOutRunning) return;
      this.soundOutRunning = true;
      const chunks = this.currentWord.chunks;
      let i = 0;
      const step = () => {
        if (i >= chunks.length) {
          setTimeout(() => speak(this.wholeWordSpeech(), 0.8), 250);
          this.soundOutRunning = false;
          return;
        }
        this.litChunkIndex = i;
        speak(chunks[i], 0.6);
        i++;
        setTimeout(step, 650);
      };
      step();
    },

    nextWord() {
      this.stripIndex = (this.stripIndex + 1) % this.words.length;
      this.litChunkIndex = null;
    },

    // ---------- Progress (persisted per folder/word, for parents) ----------
    markMatched(folderKey, word) {
      if (!this.progress[folderKey]) this.progress[folderKey] = {};
      this.progress[folderKey][word] = true;
      saveProgress(this.progress);
    },
    isMatched(folderKey, word) {
      return !!(this.progress[folderKey] && this.progress[folderKey][word]);
    },
    progressCount(folderKey) {
      const words = this.folders[folderKey].words;
      const done = words.filter((w) => this.isMatched(folderKey, w.word)).length;
      return `${done}/${words.length}`;
    },
  };
}
