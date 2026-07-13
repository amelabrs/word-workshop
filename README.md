# Word Workshop

A phonics and vocabulary web app for a pre-reading child who knows letters
and phonetic sounds but hasn't started reading yet. Two modes per topic:

- **👂 Listen & Match** — a word is spoken aloud; the child taps the matching
  picture out of 4 choices.
- **🗣️ Say It** — the word's picture is shown broken into syllable/sound
  chunks; tapping a chunk speaks just that piece, "Sound it out" plays them
  in sequence, "Say the word" blends it into the whole word. No microphone —
  the app models the word and lets the child repeat it back out loud on
  their own; there's no speech recognition.

Plain HTML/CSS/JS, no build step, with [Alpine.js](https://alpinejs.dev/)
(loaded via CDN) handling reactivity. Deployable to GitHub Pages by pushing
static files — see [Deployment](#deployment) below.

## Adding content — the folder-based structure

All words live in **`folders.js`**, grouped into topic "folders" (Family,
Computer Parts, etc.) shown as tabs at the top of the app. This is the only
file you need to touch to add a new topic or word — `index.html` and
`app.js` read it at runtime and need no changes.

Each folder:

```js
family: {
  label: "Family",              // shown on the folder tab
  words: [
    { word: "mother", icon: "👩", chunks: ["mo", "ther"] },
    // ...
  ]
}
```

Each word:

| Field | Required | Description |
|-------|----------|--------------|
| `word` | yes | The word as spoken and matched against (lowercase) |
| `icon` | yes | An emoji used as the picture in both modes |
| `chunks` | yes | Ordered syllable/sound pieces for "Say It" mode — must join back into `word` when concatenated |
| `letterByLetter` | no | Set `true` for acronyms (e.g. `cpu`, `ups`) — "Say the word" spells the letters instead of blending syllables |
| `note` | no | Short caption shown under the icon in "Say It" mode (used for acronyms to explain what they stand for) |

**To add a new topic**: add a new key to the `FOLDERS` object in `folders.js`
with a `label` and a `words` array. It appears automatically as a new tab.

**To add a word to an existing topic**: append an object to that folder's
`words` array.

## Progress tracking

Every word a child matches correctly in **Listen & Match** is recorded in
`localStorage` (key `ww_progress`), per folder, and persists across browser
sessions/reloads. Tap the 📊 button in the header to open a progress panel
showing, per folder, how many words have been matched at least once and
which ones — so a parent can check progress without watching a session.

This is deliberately simple: it tracks "has matched at least once," not
scores, streaks, or timestamps. There's no lock/unlock gating — every word
in a folder is always available to practice.

## Local development

No build step, no dependencies to install. Just serve the directory statically:

```bash
cd "English words"
python3 -m http.server 8080
# open http://localhost:8080
```

Opening `index.html` directly via `file://` also works, except that
`speechSynthesis` voice selection can behave inconsistently across browsers
in that mode — serving over `http://` (even locally) is more reliable.

## Deployment

To deploy to GitHub Pages at `amelabrs.github.io/word-workshop`:

1. Create a new **public** GitHub repo named `word-workshop` (via
   `gh repo create word-workshop --public --source=. --remote=origin` from
   inside this folder, or via github.com).
2. Push this folder's contents to it:
   ```bash
   git init
   git add .
   git commit -m "Initial Word Workshop app"
   git branch -M main
   git remote add origin https://github.com/amelabrs/word-workshop.git
   git push -u origin main
   ```
3. The included `.github/workflows/pages.yml` auto-deploys on every push to
   `main` — enable it once by going to the repo's **Settings → Pages** and
   setting **Source** to "GitHub Actions" (one-time setup; after that, every
   push to `main` redeploys automatically).
4. The site will be live at `https://amelabrs.github.io/word-workshop/`
   a minute or two after the first push.

I haven't run any of the git/GitHub steps above — say the word when you're
ready and I'll run them (or run them yourself if you'd rather drive that part).
