> **Superseded (2026-07-13).** The app was rebuilt as "Word Workshop" per
> [../docs/strategy.md](strategy.md) — emoji icons instead of photos, Alpine.js,
> Listen & Match + Say It (phonics) modes, no video/shorts/analytics system.
> See [../README.md](../README.md) for the current architecture. This file is
> kept for historical reference only — the data model, file map, and feature
> list below no longer match the running app.

# English Words — Implementation Reference (superseded)

## Overview

"English Words" is a **vanilla JS PWA** (no framework), structurally mirroring
[letterbrain](../../letterbrain/docs/IMPLEMENTATION.md). It teaches vocabulary
through word↔image association quizzes, organized into topic tabs instead of
a single alphabet.

Fully client-side, deployable to any static host (GitHub Pages, Render).

---

## Why this structure

Reused directly from letterbrain (proven to work well for this audience):
- Single-page "screen" system, no router
- TTS via Web Speech API for prompts/feedback
- Web Audio oscillator chimes (no audio files needed for correct/wrong)
- localStorage-based progression with pair-based unlocking
- Optional per-answer video reward + perfect-score "shorts" reward, both
  data-driven from JSON so no code changes are needed to add content later
- Optional analytics webhook, same JSON shape as letterbrain

Adapted for words instead of letters:
- The unit being learned is a **word**, not a letter — so instead of
  normal/reverse modes swapping letter↔image, our two modes are:
  - **Listen mode**: word is *spoken* (TTS, no text shown) → child picks the
    matching **image** from 4 choices
  - **Read mode**: an **image** is shown → child picks the matching **word**
    (text buttons) from 4 choices
- Content is split into **tabs** by topic (extensible — not hardcoded to one
  subject like letterbrain's single alphabet)

---

## File Map

```
English words/
├── index.html              — Single HTML shell; all screens live here as hidden divs
├── app.js                  — All game logic
├── style.css                — Styling; same child-friendly palette as letterbrain
├── manifest.json            — PWA install metadata
├── WordVideos.json          — Video reward data (loaded at runtime via fetch; stub/empty by default)
│
├── images/                  — Word illustration assets (user-supplied real photos expected)
│   └── placeholder.svg      — Generic fallback shown via onerror until a real photo is dropped in
├── videos/                  — Local mp4 overrides (optional, mirrors letterbrain/videos/)
├── audio/                   — Reserved for future pronunciation clips (unused for now — TTS covers this)
│
├── docs/
│   ├── IMPLEMENTATION.md    — This file
│   ├── word-images.md       — How to add/replace word photos
│   └── word-videos.md       — How to add video rewards, shorts, analytics
│
└── .github/workflows/pages.yml  — GitHub Pages auto-deploy on push to main (add when ready to deploy)
```

---

## Data Model

### WORD_ITEMS (app.js)

Static array. Each item:

| field   | type   | description                                    |
|---------|--------|-------------------------------------------------|
| `word`  | string | The word shown/spoken (e.g. "Mother")           |
| `tab`   | string | Which tab this word belongs to (`evs`, `computer`) |
| `image` | string | Expected path to image asset (e.g. `images/mother.png`) |
| `level` | number | Content level within its tab (progression order) |

### Tabs (v1 launch content)

| Tab id     | Label        | Content level 1        | Content level 2       | Content level 3   |
|------------|--------------|-------------------------|------------------------|--------------------|
| `evs`      | 👪 EVS       | Mother, Father, Sister, Brother | Grandmother, Grandfather | Baby, Family |
| `computer` | 💻 Computer  | Keyboard, Mouse, Laptop | Speaker, Monitor        | Printer, Screen    |

"EVS" (Environmental Studies) is a broad Indian primary-school subject that
also covers body parts, animals, community helpers, food, etc. V1 only ships
the **family-member** unit under that tab. Adding another EVS unit later
(e.g. body parts) is just appending items to `WORD_ITEMS` with `tab: "evs"`
and a new `level` — no structural change needed. Same for adding a brand new
tab: add an entry to `TABS` and give some `WORD_ITEMS` that `tab` id.

### GAME_LEVELS (generated at runtime from WORD_ITEMS)

For each tab, each content level generates **2 game levels** (one per mode):

```js
{ tab: "evs", contentLevel: 1, mode: "listen", pair: 1 }
{ tab: "evs", contentLevel: 1, mode: "read",   pair: 1 }
{ tab: "evs", contentLevel: 2, mode: "listen", pair: 2 }
// ...
```

**Pair = the unlock unit** (same concept as letterbrain). Completing a pair
at ≥80% unlocks the next pair, tracked **per tab** independently
(`ew_unlocked_evs`, `ew_unlocked_computer` in localStorage).

---

## Game Modes

| Mode     | Prompt                          | Child picks              |
|----------|----------------------------------|---------------------------|
| `listen` | Word spoken aloud (🔊 replay button, no text) | Image (4 choices) |
| `read`   | Image shown                      | Word text (4 choices)     |

Both modes: 4 choices = 1 correct + 3 distractors sampled from words already
unlocked in that tab (`levelItems`), matching letterbrain's distractor logic.

**Important asset note**: `read` mode is fully testable today with placeholder
images, since the answer choices are text. `listen` mode only becomes
meaningful once real distinct photos replace the placeholder — see
[word-images.md](word-images.md).

---

## Screen System

Same pattern as letterbrain — `<div class="screen">` elements, one
`.active` at a time, switched via `showScreen(id)`:

```
#start-screen   — Tab switcher + level grid
#quiz-screen    — Active gameplay
#done-screen    — Post-round score + unlock message
```

Two overlays (z-index above screens), both **data-gated no-ops until
configured** — see [word-videos.md](word-videos.md):
- `#video-overlay` — per-word reward clip (only shown if `WordVideos.json` has an entry for that word)
- `#shorts-overlay` — perfect-score cartoon reward (only shown if `CONFIG.SHORTS_IDS` is non-empty)

---

## Progression & Unlocking

Identical mechanism to letterbrain, applied per tab:

| Key                       | Default | Description                              |
|---------------------------|---------|-------------------------------------------|
| `ew_unlocked_<tab>`       | `"1"`   | Highest unlocked pair number for that tab |
| Unlock threshold          | 80%     | `Math.ceil(queue.length * 0.8)` stars needed |

Unlock only triggers when score ≥ threshold **and** the child is playing the
current frontier pair for that tab (not replaying an already-unlocked pair).

---

## State / Persistence

All state in `localStorage`:

| Key                    | Type    | Description                              |
|------------------------|---------|--------------------------------------------|
| `ew_unlocked_evs`      | string  | Unlocked pair number, EVS tab               |
| `ew_unlocked_computer` | string  | Unlocked pair number, Computer tab           |
| `ew_deviceId`          | string  | UUID for analytics (only relevant if webhook configured) |
| `ew_cartoon`           | JSON    | `{ index, position }` shorts resume state (only relevant if SHORTS_IDS configured) |

In-session (not persisted): `currentTab`, `currentGameLevelIdx`,
`currentContentLevel`, `gameMode`, `levelItems`, `queue`, `currentIndex`,
`currentItem`, `stars`, `answered`, `roundClean`, `roundWrongs`, `sessionStats`.

---

## Open configuration (deliberately stubbed, not guessed)

Two things depend on content only you can provide/curate, so they ship
disabled rather than faked:

1. **Video rewards / shorts** — `WordVideos.json` ships with empty entries
   and `CONFIG.SHORTS_IDS = []`. See [word-videos.md](word-videos.md) for the
   exact format to add real YouTube clips per word later.
2. **Analytics webhook** — `CONFIG.ANALYTICS_WEBHOOK_URL = ""` (disabled).
   If you want session stats logged like letterbrain, point this at your own
   Google Apps Script webhook (recommend a **separate** one from
   letterbrain's so the data doesn't mix), documented in word-videos.md.

Everything else (quiz flow, TTS, scoring, unlock progression) works out of
the box with no configuration.
