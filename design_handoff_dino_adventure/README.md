# Handoff: Word Workshop — "Dino Adventure" Theme

## Overview
Word Workshop is a picture/audio vocabulary quiz app for a young child, organized into topic folders (Family, Computer Parts, Computer Types, Places, Plants), each with graduated "Hear it" (listen → pick picture) and "See it" (see picture → pick word) levels, plus a phonics/"Say It" chunk-blending practice mode. This handoff covers a full re-skin to a "Dino Adventure" visual theme — jungle green, lava orange, and sunbeam yellow, with a friendly T-Rex mascot — layered over the existing app structure and logic. No topics, words, or quiz mechanics changed.

## About the Design Files
The bundled HTML files are **design references** built as interactive prototypes to demonstrate exact look, states, and behavior — they are not production code to copy line-for-line. Recreate this design in the target codebase's existing framework and component patterns (React, Vue, native, etc.), or choose the most suitable framework if none exists yet.

## Fidelity
**High-fidelity.** Colors, typography, spacing, and interaction states below are final; implement pixel-accurately.

## Screens / Views

### 1. Start / Home
**Purpose:** Choose a topic folder and a level, or jump into phonics practice.
**Layout:** Single column, max-width 640px, centered, vertical flex with 14-18px gaps. Full-bleed background: `linear-gradient(180deg, #1B7A3E 0%, #0F5C2C 60%, #0B4A22 100%)`. Two large decorative emoji watermarks fixed at opposite corners (🌴 top-right, 🚚 bottom-left), 110-130px, 14% opacity, pointer-events none.
**Components:**
- **Header row**: flex row, gap 14px. Mascot badge: 74×74px circle, background `#FFC93C`, 4px solid `#1B7A3E` border, `box-shadow: 0 5px 0 #C98A0A`, centered 🦖 emoji at 44px, gentle bob/rotate animation (3s loop, ±6px translateY, ±2deg rotate). Title "Word Workshop": Baloo 2 800, 28px, white, `text-shadow: 0 3px 0 #0F5C2C`. Subtitle "roar it · spot it · say it back": Nunito 700, 13px, `#BFF2CE`.
- **Topic tab row**: flex wrap, gap 8px. Each tab: Baloo 2 700, 14px, padding 9px 16px, border-radius 12px. Active: background `#FF6B35`, color white, `box-shadow: 0 4px 0 #C4471B`. Inactive: background `rgba(255,255,255,0.12)`, color `#BFF2CE`, no shadow.
- **"Say It" CTA button**: full width, Baloo 2 700 15px, padding 12px, border-radius 14px, background `#FF6B35`, color white, `box-shadow: 0 4px 0 #C4471B`. Label: "🗣️ Say It — practice this folder's words".
- **Level grid**: 2-column CSS grid, gap 12px. Each level card: white background, border-radius 16px, padding 16px 10px, center text, `box-shadow: 0 5px 0 rgba(0,0,0,0.25)`. Icon 2rem (🔊 for "Hear it" / listen mode, 🖼️ for "See it" / read mode). Word list: Baloo 2 700, 0.85rem, `#0F5C2C`. Mode label: 0.75rem, `#6B8B76`.

### 2. Quiz (Listen / Read modes)
**Purpose:** Match audio-to-picture or picture-to-word; earn a star per clean (no-mistake) round.
**Layout:** Same 640px column.
**Components:**
- **Top bar**: flex row, gap 10px. Back button: 40×40px white circle, `←`, `box-shadow: 0 3px 0 rgba(0,0,0,0.25)`. Progress bar: flex-1, height 12px, track `rgba(255,255,255,0.25)`, fill `#FFC93C`, rounded, animated width transition 0.3s. Star counter: Baloo 2 800, white, "⭐ {n}".
- **Prompt area**: centered, margin-bottom 24px. Listen mode: 160×160px white circle button, 🔊 at 5rem, `box-shadow: 0 6px 0 rgba(0,0,0,0.3)` — click replays audio. Read mode: 220×220px image, object-fit cover, border-radius 20px, same shadow depth.
- **Choice grid**: 2×2 grid, gap 14px. Each choice: border-radius 16px, `box-shadow: 0 4px 0 rgba(0,0,0,0.25)`, padding 8px. Listen mode choices are images (aspect-ratio 1, border-radius 10px inner). Read mode choices are word text, Baloo 2 700, 2rem, `#0F5C2C`, padding 24px 10px. States: default white bg; **correct** → bg `#EAFBF1`, `outline: 4px solid #1B7A3E`; **wrong** → bg `#FFEDED`, `outline: 4px solid #FF5A5A`, opacity 0.6, disabled.

### 3. Round Complete
**Purpose:** Celebrate score, return to Start.
**Layout:** Centered card, margin-top 60px, white bg, border-radius 22px, padding 30px 20px, `box-shadow: 0 6px 0 rgba(0,0,0,0.3)`.
**Components:** 🦖 emoji 48px. "Great job!" — Baloo 2 800, `#1B7A3E`. Score line "You got {stars} out of {total} ⭐" — 1.3rem 700 `#0F5C2C`. Perfect-score message "🎉 Perfect score!" (conditional) — 1.1rem 800 `#1B7A3E`. Continue button: pill, background `#FF6B35`, white text, `box-shadow: 0 4px 0 #C4471B`.

### 4. Phonics / "Say It" Practice
**Purpose:** Break a word into syllable/letter chunks, hear each chunk, blend, and repeat the whole word.
**Layout:** Same 640px column.
**Components:**
- **Top bar**: back button (same style as Quiz) + current folder name, Baloo 2 700 18px, white.
- **Speech bubble**: white rounded rect (border-radius 18px), padding 14px 18px, centered text, Baloo 2 18px `#0F5C2C`, `box-shadow: 0 4px 0 rgba(0,0,0,0.2)` — shows coaching prompts ("Tap each colour to hear the sound, then blend them!" / "Your turn — say it back!").
- **Practice card**: white, border-radius 26px, padding 30px 20px, `box-shadow: 0 5px 0 rgba(0,0,0,0.25)`. Contains: 180×180px word image (border-radius 20px); optional note text (e.g. "the brain of the computer") in `#6B8B76`; chunk row — each chunk is a colored pill, Baloo 2 700 34px, padding 8px 16px, border-radius 14px, white text, cycling through `["#1B7A3E","#3E9EDB","#FF6B35","#8B5E34","#FFC93C","#2FA88A"]`; tapped/active chunk scales to 1.15 with a soft ring shadow. Three action buttons: "🐢 Sound it out" (bg `#3E9EDB`, shadow `#2971A0`), "🔊 Say the word" (bg `#1B7A3E`, shadow `#0F5C2C`), "Next word ➡️" (bg `#FFC93C`, text `#5A4400`, shadow `#C98A0A`) — all Baloo 2 700 14px, white/dark text per above, padding 12px 18px, border-radius 16px.
- **Word strip** (thumbnail nav): flex wrap row, gap 10px. Each thumbnail 52×52px, border-radius 14px, `box-shadow: 0 3px 0 rgba(0,0,0,0.2)`, 3px border — `#FFC93C` when selected, transparent otherwise.

## Interactions & Behavior
- Tab click switches folder, resets to its level grid (no navigation reset otherwise).
- Level card click starts a quiz round: builds a shuffled queue of new-level words (×3 repeats each) + up to 4 shuffled review words from lower levels in the same folder; 4 answer choices per round (target + 3 distractors from the same folder).
- Listen mode: word is spoken via Web Speech (`SpeechSynthesisUtterance`, rate 0.85, pitch 1.05, preferring a friendly English voice) automatically on round load; prompt button replays it.
- Correct answer: green outline, ascending 4-note chime (523/659/784/1047 Hz, synthesized via WebAudio oscillators), speaks word again, advances after 1.6s. Star only awarded if the round had zero wrong taps ("clean" round).
- Wrong answer: red outline + disables that choice, 2-note descending chime (440/349 Hz), speaks "Try again!" — round stays open for another guess.
- Queue exhausted → Round Complete screen; Continue returns to Start.
- Phonics: tapping a chunk speaks it at rate 0.65 and scale-pops it for 500ms. "Sound it out" auto-steps through all chunks (650ms apart) then speaks the full word. "Say the word" speaks full word at rate 0.8 and updates the bubble prompt. "Next word" cycles to the next word in the folder, resets highlight/bubble. Clicking a strip thumbnail jumps directly to that word.
- Letter-by-letter words (CPU, UPS) are spelled out (`"C. P. U."`) rather than pronounced as a blended word.

## State Management
- `screen`: `start | quiz | done | phonics`
- `currentTab`: active folder id
- `currentGameLevelIdx`, `gameMode` (`listen|read`), `levelItems`, `queue`, `queueLength`, `currentIndex`, `currentItem`, `stars`, `answered`, `roundClean`, `choiceList`, `choiceStatus` (map of word → `correct|wrong`)
- `phonicsTab`, `phonicsIndex`, `litChunkIndex`, `phonicsBubble`, `soundOutRunning`
- No backend/data fetching — word list and folder metadata are static local data (see `WORD_ITEMS` / `TABS` below).

## Design Tokens
**Colors**
- Jungle green (bg gradient, primary): `#1B7A3E` → `#0F5C2C` → `#0B4A22`
- Lava orange (CTA/accent): `#FF6B35`, shadow `#C4471B`
- Sunbeam yellow (mascot badge, "next" button): `#FFC93C`, shadow `#C98A0A`, text-on-yellow `#5A4400`
- Sky blue (sound-out button): `#3E9EDB`, shadow `#2971A0`
- Success green: `#1B7A3E` (outline), bg wash `#EAFBF1`
- Error red: `#FF5A5A` (outline), bg wash `#FFEDED`
- Text on dark: white / `#BFF2CE`; text on light: `#0F5C2C` / `#6B8B76`
- Chunk cycle: `#1B7A3E, #3E9EDB, #FF6B35, #8B5E34, #FFC93C, #2FA88A`

**Typography:** Headings/buttons/labels — Baloo 2 (600/700/800). Body/copy — Nunito (600/700/800). Both via Google Fonts.

**Spacing scale:** 8, 10, 12, 14, 16, 18, 20, 24, 30px.

**Border radius:** 10, 12, 14, 16, 18, 20, 22, 26px, and 50% for circular badges/buttons.

**Shadows (all "gumdrop" hard-offset style, no blur):** small `0 3px 0`, medium `0 4px 0`, large `0 5px 0`/`0 6px 0`, colors matched to each element's own hue at ~70-100% opacity, or `rgba(0,0,0,0.2–0.3)` for white cards on the dark background.

## Assets
Word images are photographs already present in the original `word-workshop` repo (`amelabrs/word-workshop`, `images/` folder) — one JPEG/PNG/WebP/AVIF per vocabulary word (e.g. `mother.jpg`, `keyboard.jpg`, `flower.jpg`). No new imagery was introduced for this theme; only colors, mascot emoji, and chrome changed. Emoji (🦖, 🌴, 🚚, 🔊, 🖼️, 🐢, ⭐, 🎉) are used directly as text glyphs, not custom icon assets — swap for a matching icon set if the target platform needs non-emoji icons.

## Files
- `Word Workshop.dc.html` — the full themed prototype (all four screens, live interactions, real word data).
