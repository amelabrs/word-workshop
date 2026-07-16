// ============================================================
// Word Workshop — game logic (data lives in folders.js)
// Screens/levels quiz mechanic mirroring letterbrain, minus level locking —
// every level is always playable — plus a bonus "Say It" phonics screen.
// ============================================================

// Level-card mode icons — custom SVGs instead of emoji so they render
// identically everywhere, rather than however each OS draws 🔊/🖼️.
// fill/stroke use currentColor so they follow whatever text color the card gets.
const ICON_HEAR_SVG = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3 9.5v5h3.7l5 3.8V5.7l-5 3.8H3z" fill="currentColor"/>
  <path d="M16.2 8.3a5.2 5.2 0 0 1 0 7.4" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/>
  <path d="M18.8 5.8a8.8 8.8 0 0 1 0 12.4" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/>
</svg>`;
const ICON_SEE_SVG = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M2 12S5.8 5.5 12 5.5 22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12z" stroke="currentColor" stroke-width="2.3" stroke-linejoin="round"/>
  <circle cx="12" cy="12" r="3.2" fill="currentColor"/>
</svg>`;

// Level-card background themes, cycled per pair (row) so the Hear it/See it
// pair for the same words share a color.
const CARD_THEMES = [
  { bg: "#1B7A3E", text: "#ffffff", sub: "#BFF2CE" },
  { bg: "#3E9EDB", text: "#ffffff", sub: "#DFF2FC" },
  { bg: "#FF6B35", text: "#ffffff", sub: "#FFE3D6" },
  { bg: "#FFC93C", text: "#5A4400", sub: "#8A6A1A" },
];

// Active (non-hidden) words for a tab — the single place "hidden" is
// enforced, so every quiz/level-grid/Say-It pool respects it consistently.
function tabWords(tab) {
  return WORD_ITEMS.filter((i) => i.tab === tab && !i.hidden);
}

function buildGameLevels() {
  const out = {};
  TABS.forEach((t) => (out[t.id] = []));
  TABS.forEach((t) => {
    const levels = [...new Set(tabWords(t.id).map((i) => i.level))].sort(
      (a, b) => a - b
    );
    levels.forEach((contentLevel, idx) => {
      const pair = idx + 1;
      out[t.id].push({ tab: t.id, contentLevel, mode: "listen", pair });
      out[t.id].push({ tab: t.id, contentLevel, mode: "read", pair });
    });
  });
  return out;
}
const GAME_LEVELS = buildGameLevels();

// ============================================================
// State
// ============================================================

let currentTab = TABS[0].id;
let currentGameLevelIdx = 0;
let currentContentLevel = 1;
let gameMode = "listen"; // "listen" | "read"
let levelItems = [];
let queue = [];
let currentIndex = 0;
let currentItem = null;
let stars = 0;
let answered = false;
let roundClean = true;
let roundWrongs = 0;

let phonicsTab = TABS[0].id;
let phonicsIndex = 0;

// ============================================================
// Persistence
// ============================================================

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function withImageFallback(img) {
  img.onerror = function () {
    this.onerror = null;
    this.src = "images/placeholder.svg";
  };
}

// ============================================================
// Screen management
// ============================================================

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ============================================================
// Start screen — tabs, Say It button, level grid
// ============================================================

function renderTabs() {
  const row = document.getElementById("tabs-row");
  row.innerHTML = "";
  TABS.forEach((t) => {
    const btn = document.createElement("button");
    btn.className = "tab-btn" + (t.id === currentTab ? " active" : "");
    btn.textContent = t.label;
    btn.onclick = () => {
      currentTab = t.id;
      renderTabs();
      renderLevelGrid();
    };
    row.appendChild(btn);
  });
}

function renderLevelGrid() {
  const grid = document.getElementById("level-grid");
  grid.innerHTML = "";
  const levels = GAME_LEVELS[currentTab];

  levels.forEach((gl, idx) => {
    const card = document.createElement("button");
    card.className = "level-card";
    const theme = CARD_THEMES[(gl.pair - 1) % CARD_THEMES.length];
    card.style.background = theme.bg;
    const wordsInLevel = tabWords(gl.tab).filter((i) => i.level === gl.contentLevel);
    const modeIcon = gl.mode === "listen" ? ICON_HEAR_SVG : ICON_SEE_SVG;
    card.innerHTML = `
      <div class="level-icon" style="color:${theme.text}">${modeIcon}</div>
      <div class="level-label" style="color:${theme.text}">${wordsInLevel.map((w) => w.word).join(", ")}</div>
      <div class="level-mode" style="color:${theme.sub}">${gl.mode === "listen" ? "Hear it" : "See it"}</div>
    `;
    card.onclick = () => {
      currentGameLevelIdx = idx;
      startGame();
    };
    grid.appendChild(card);
  });
}

document.getElementById("say-it-btn").addEventListener("click", () => {
  phonicsTab = currentTab;
  phonicsIndex = 0;
  showScreen("phonics-screen");
  renderPhonicsTabLabel();
  renderPhonics();
  renderWordStrip();
});

// ============================================================
// Quiz flow
// ============================================================

function startGame() {
  const gl = GAME_LEVELS[currentTab][currentGameLevelIdx];
  currentContentLevel = gl.contentLevel;
  gameMode = gl.mode;

  // Distractor pool draws from the whole tab (not just this level) since all
  // levels are always playable — otherwise early levels wouldn't have enough
  // other words to fill 4 choices.
  levelItems = tabWords(currentTab);
  const newWords = levelItems.filter((i) => i.level === currentContentLevel);
  const reviewPool = levelItems.filter((i) => i.level < currentContentLevel);

  let built = [];
  newWords.forEach((w) => {
    for (let i = 0; i < 3; i++) built.push(w);
  });
  const reviewCount = Math.min(4, reviewPool.length);
  built = built.concat(shuffle([...reviewPool]).slice(0, reviewCount));
  queue = shuffle(built);

  stars = 0;
  currentIndex = 0;

  showScreen("quiz-screen");
  loadRound();
}

function updateProgressBar() {
  const pct = queue.length ? Math.round((currentIndex / queue.length) * 100) : 0;
  document.getElementById("progress-fill").style.width = pct + "%";
  document.getElementById("stars-display").textContent = `⭐ ${stars}`;
}

function loadRound() {
  if (currentIndex >= queue.length) {
    showDone();
    return;
  }
  currentItem = queue[currentIndex];
  answered = false;
  roundClean = true;
  roundWrongs = 0;
  updateProgressBar();

  const promptArea = document.getElementById("prompt-area");
  promptArea.innerHTML = "";

  if (gameMode === "listen") {
    const btn = document.createElement("button");
    btn.className = "speaker-prompt-btn";
    btn.textContent = "🔊";
    btn.onclick = () => speak(currentItem.word);
    promptArea.appendChild(btn);
    setTimeout(() => speak(currentItem.word), 300);
  } else {
    const img = document.createElement("img");
    img.className = "prompt-image";
    img.src = currentItem.image;
    img.alt = "";
    withImageFallback(img);
    promptArea.appendChild(img);
  }

  renderChoices();
}

function renderChoices() {
  const grid = document.getElementById("choices-grid");
  grid.innerHTML = "";

  const pool = currentItem.group
    ? tabWords(currentTab).filter((i) => i.group === currentItem.group)
    : levelItems;
  const distractPool = pool.filter((i) => i.word !== currentItem.word);
  const distractors = shuffle([...distractPool]).slice(0, 3);
  const choices = shuffle([currentItem, ...distractors]);

  choices.forEach((choice) => {
    let el;
    if (gameMode === "listen") {
      el = document.createElement("button");
      el.className = "choice-image-btn";
      const img = document.createElement("img");
      img.src = choice.image;
      img.alt = "";
      withImageFallback(img);
      el.appendChild(img);
    } else {
      el = document.createElement("button");
      el.className = "choice-text-btn";
      el.textContent = choice.word;
    }
    el.dataset.word = choice.word;
    el.onclick = () => handleChoice(el, choice.word);
    grid.appendChild(el);
  });
}

function handleChoice(el, chosenWord) {
  if (answered) return;

  if (chosenWord === currentItem.word) {
    answered = true;
    if (roundClean) stars++;
    el.classList.add("correct");
    playCorrectChime();
    speak(`${currentItem.word}!`);
    updateProgressBar();
    setTimeout(advanceRound, 1600);
  } else {
    el.classList.add("wrong");
    el.disabled = true;
    roundClean = false;
    roundWrongs++;
    playWrongChime();
    speak("Try again!");
  }
}

function advanceRound() {
  currentIndex++;
  loadRound();
}

function showDone() {
  showScreen("done-screen");
  document.getElementById("done-score").textContent = `You got ${stars} out of ${queue.length} ⭐`;
  document.getElementById("done-unlock-msg").textContent =
    stars === queue.length ? "🎉 Perfect score!" : "";
}

document.getElementById("done-continue-btn").addEventListener("click", () => {
  showScreen("start-screen");
  renderLevelGrid();
});
document.getElementById("quiz-back-btn").addEventListener("click", () => {
  showScreen("start-screen");
  renderLevelGrid();
});

// ============================================================
// Say It (phonics) — ungated, always available for the whole tab
// ============================================================

document.getElementById("phonics-back-btn").addEventListener("click", () => {
  showScreen("start-screen");
  renderLevelGrid();
});

function phonicsWords() {
  return tabWords(phonicsTab);
}

function renderPhonicsTabLabel() {
  const tab = TABS.find((t) => t.id === phonicsTab);
  document.getElementById("phonics-tab-label").textContent = tab.label;
}

function renderWordStrip() {
  const strip = document.getElementById("word-strip");
  strip.innerHTML = "";
  phonicsWords().forEach((w, i) => {
    const d = document.createElement("div");
    d.className = "strip-item" + (i === phonicsIndex ? " on" : "");
    const img = document.createElement("img");
    img.src = w.image;
    img.alt = "";
    withImageFallback(img);
    d.appendChild(img);
    d.onclick = () => {
      phonicsIndex = i;
      renderPhonics();
      renderWordStrip();
    };
    strip.appendChild(d);
  });
}

function currentPhonicsWord() {
  return phonicsWords()[phonicsIndex];
}

function wholeWordSpeech(w) {
  return w.letterByLetter ? w.word.toUpperCase().split("").join(". ") : w.word;
}

// ---------- Build-the-word tile game ----------
// The child sees/hears the target word, then must tap tiles — a mix of the
// word's correct chunks plus a couple of decoys pulled from other words in
// the same tab — in the right order to assemble it.

let buildProgress = 0;
let filledSlots = [];
let trayTiles = [];

function distractorPool(word) {
  const ownChunks = new Set(word.chunks);
  const pool = new Set();
  phonicsWords().forEach((w) => {
    if (w.word === word.word) return;
    w.chunks.forEach((c) => {
      if (!ownChunks.has(c)) pool.add(c);
    });
  });
  return shuffle([...pool]);
}

function generateTray(word) {
  const distractorCount = Math.min(2, distractorPool(word).length);
  const distractors = distractorPool(word).slice(0, distractorCount);
  const tiles = word.chunks
    .map((c) => ({ text: c, used: false }))
    .concat(distractors.map((c) => ({ text: c, used: false })));
  return shuffle(tiles);
}

function renderPhonics() {
  const w = currentPhonicsWord();

  const img = document.getElementById("phonics-image");
  img.src = w.image;
  withImageFallback(img);

  const noteEl = document.getElementById("phonics-note");
  noteEl.textContent = w.note || "";
  noteEl.style.display = w.note ? "" : "none";

  buildProgress = 0;
  filledSlots = new Array(w.chunks.length).fill(null);
  trayTiles = generateTray(w);

  renderBuildRow();
  renderTray();

  document.getElementById("phonics-bubble").textContent = "Build the word! Tap the pieces in order.";
  setTimeout(() => speak(wholeWordSpeech(w)), 300);
}

function renderBuildRow() {
  const row = document.getElementById("build-row");
  row.innerHTML = "";
  filledSlots.forEach((text) => {
    const el = document.createElement("div");
    el.className = "build-slot" + (text ? " filled" : "");
    el.textContent = text || "";
    row.appendChild(el);
  });
}

function renderTray() {
  const tray = document.getElementById("tile-tray");
  tray.innerHTML = "";
  trayTiles.forEach((tile, i) => {
    const el = document.createElement("button");
    el.className = "tile" + (tile.used ? " used" : "");
    el.textContent = tile.text;
    el.disabled = tile.used;
    el.onclick = () => tapTile(i);
    tray.appendChild(el);
  });
}

function tapTile(i) {
  const tile = trayTiles[i];
  if (tile.used) return;
  const w = currentPhonicsWord();
  speak(tile.text, 0.65);

  if (tile.text === w.chunks[buildProgress]) {
    tile.used = true;
    filledSlots[buildProgress] = tile.text;
    buildProgress++;
    renderBuildRow();
    renderTray();

    if (buildProgress >= w.chunks.length) {
      playCorrectChime();
      document.getElementById("phonics-bubble").textContent = "🎉 You built it!";
      setTimeout(() => speak(wholeWordSpeech(w), 0.8), 400);
    } else {
      document.getElementById("phonics-bubble").textContent = "Yes! Next piece...";
    }
  } else {
    playWrongChime();
    document.getElementById("phonics-bubble").textContent = "Not quite — try again!";
    const trayEl = document.getElementById("tile-tray");
    const el = trayEl.children[i];
    if (el) {
      el.classList.add("wrong");
      setTimeout(() => el.classList.remove("wrong"), 400);
    }
  }
}

document.getElementById("phonics-say-whole-btn").addEventListener("click", () => {
  speak(wholeWordSpeech(currentPhonicsWord()), 0.8);
});

document.getElementById("phonics-sound-out-btn").addEventListener("click", () => {
  const w = currentPhonicsWord();
  if (buildProgress >= w.chunks.length) {
    speak(wholeWordSpeech(w), 0.8);
    return;
  }
  const nextText = w.chunks[buildProgress];
  speak(nextText, 0.6);
  const trayEl = document.getElementById("tile-tray");
  trayTiles.forEach((tile, i) => {
    if (!tile.used && tile.text === nextText) {
      const el = trayEl.children[i];
      if (el) {
        el.classList.add("hint");
        setTimeout(() => el.classList.remove("hint"), 700);
      }
    }
  });
});

document.getElementById("phonics-next-btn").addEventListener("click", () => {
  phonicsIndex = (phonicsIndex + 1) % phonicsWords().length;
  renderPhonics();
  renderWordStrip();
});

// ============================================================
// Text-to-speech
// ============================================================

// Same voice preference list as letterbrain, so both apps sound consistent.
const PREFERRED_VOICE_NAMES = [
  "Samantha", "Karen", "Moira", "Fiona", "Tessa", "Victoria",
  "Google UK English Female", "Google US English",
];
let cachedVoice = null;
function pickVoice() {
  const voices = speechSynthesis.getVoices();
  for (const name of PREFERRED_VOICE_NAMES) {
    const v = voices.find((v) => v.name === name);
    if (v) {
      cachedVoice = v;
      return cachedVoice;
    }
  }
  cachedVoice = voices.find((v) => /^en/i.test(v.lang)) || voices[0] || null;
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

// ============================================================
// Sound effects (Web Audio oscillators)
// ============================================================

let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function playTone(freqs, durationEach) {
  const ctx = getAudioCtx();
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const startTime = ctx.currentTime + i * durationEach;
    gain.gain.setValueAtTime(0.15, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + durationEach);
    osc.start(startTime);
    osc.stop(startTime + durationEach);
  });
}
function playCorrectChime() {
  playTone([523, 659, 784, 1047], 0.12);
}
function playWrongChime() {
  playTone([440, 349], 0.18);
}

// ============================================================
// Init
// ============================================================

renderTabs();
renderLevelGrid();
