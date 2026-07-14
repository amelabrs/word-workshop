# Word Workshop

A vocabulary quiz app for a pre-reading child, structurally mirroring
[letterbrain](https://amelabrs.github.io/letterbrain): topic tabs, a
level grid, and a 4-choice picture/word quiz. Plus a bonus **Say It**
phonics screen for sounding words out.

Plain HTML/CSS/JS, no build step, no framework — deployable to GitHub Pages
by pushing static files.

## The quiz (letterbrain-style)

Each topic tab has a **level grid**. Levels come in pairs — one **Listen**
level (🔊 word spoken aloud → pick the matching picture from 4 choices) and
one **Read** level (🖼️ picture shown → pick the matching word text from 4
choices) — covering the same words. All levels are always playable, no
locking — pick any level in any order.

## Say It (phonics, bonus mode)

Tap the "🗣️ Say It" button on any tab to open an ungated practice screen for
every word in that tab — no locking, no scoring. Each word is broken into
syllable/sound chunks; tapping a chunk speaks just that piece, "🐢 Sound it
out" plays them in sequence, "🔊 Say the word" blends them into the whole
word. No microphone or speech recognition — the app models the word and lets
the child repeat it back out loud on their own.

## Adding content — the folder-based structure

All words live in **`folders.js`**, grouped into topic tabs (Family,
Computer Parts, Computer Types, Places, Plants). This is the only file you
need to touch to add a new topic or word — `index.html` and `app.js` read it
at runtime and need no changes.

Each tab in `TABS`:
```js
{ id: "family", label: "Family" }
```

Each word in `WORD_ITEMS`:
```js
{ word: "Mother", tab: "family", image: "images/mother.jpeg", level: 1, chunks: ["Mo", "ther"] }
```

| Field | Required | Description |
|-------|----------|--------------|
| `word` | yes | The word as spoken/shown/matched against |
| `tab` | yes | Which `TABS` entry this word belongs to |
| `image` | yes | Path to a photo. If the file doesn't exist yet, the UI falls back to `images/placeholder.svg` automatically — just drop a real photo at this exact path whenever it's ready, no code changes needed |
| `level` | yes | Grouping within its tab — words sharing a level are introduced together in one pair of levels (Listen + Read) on the level grid |
| `chunks` | yes | Ordered syllable/sound pieces for Say It mode — must join back into `word` when concatenated |
| `letterByLetter` | no | Set `true` for acronyms (e.g. `CPU`, `UPS`) — "Say the word" spells the letters instead of blending syllables |
| `note` | no | Short caption shown under the picture in Say It mode (used for acronyms, to explain what they stand for) |

**To add a new topic**: add a new entry to `TABS`, then give some
`WORD_ITEMS` that `tab` id. It appears automatically as a new tab, fully
wired into both the quiz and Say It.

**To add a word to an existing topic**: append an object to `WORD_ITEMS`
with that tab's id and a `level` (reuse an existing level number to group it
with other words in the same pair, or use the next number to make it a new
pair). Lower level numbers appear earlier in the level grid — put words with
real photos at lower levels than words still on stock/placeholder photos.

**Photos**: real photos, not icons/emoji. Some words are still waiting on a
photo (using the generic placeholder until then) — check `folders.js` for
which `image` paths don't have a matching file yet in `images/`.

## Local development

No build step, no dependencies to install:

```bash
cd "English words"
python3 -m http.server 8080
# open http://localhost:8080
```

## Deployment

Live at **https://amelabrs.github.io/word-workshop/**, deployed via
`.github/workflows/pages.yml` — any push to `main` on
`github.com/amelabrs/word-workshop` auto-redeploys within a minute or two.
