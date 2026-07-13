> **Superseded (2026-07-13).** Word Workshop uses emoji icons (see
> `folders.js`, the `icon` field), not photo files — this doc describes an
> earlier iteration's asset pipeline that's no longer in use. Kept for
> historical reference only.

# Word Images — How to add real photos (superseded)

## Overview

Every word in `WORD_ITEMS` (in `app.js`) has an `image` path, e.g.:

```js
{ word: "Mother", tab: "evs", image: "images/mother.png", level: 1 }
```

**You don't need to touch any code to add a photo.** Just drop a file at that
exact path (e.g. `images/mother.png`) and it will show up automatically —
both as the prompt image (in "See it" / read-mode levels) and as one of the
4 picture choices (in "Hear it" / listen-mode levels).

Until a real file exists at that path, the `<img>` tag's `onerror` handler
falls back to `images/placeholder.svg` — a generic gray card — so the app
never shows a broken-image icon.

## Current word list needing photos

### EVS tab (family unit)
| Word | Expected path |
|------|----------------|
| Mother | `images/mother.png` |
| Father | `images/father.png` |
| Sister | `images/sister.png` |
| Brother | `images/brother.png` |
| Grandmother | `images/grandmother.png` |
| Grandfather | `images/grandfather.png` |
| Baby | `images/baby.png` |
| Family | `images/family.png` |

### Computer tab
| Word | Expected path |
|------|----------------|
| Keyboard | `images/keyboard.png` |
| Mouse | `images/mouse.png` |
| Laptop | `images/laptop.png` |
| Speaker | `images/speaker.png` |
| Monitor | `images/monitor.png` |
| Printer | `images/printer.png` |
| Screen | `images/screen.png` |

## Recommendations for the photos themselves

- Roughly square (the UI displays them in a square-ish frame with `object-fit: contain`, so non-square works too, just with letterboxing)
- Plain/simple background works best for young children — avoid busy scenes
- For "Hear it" (listen mode) levels specifically: choices need to look
  **visually distinct at a glance**, since a child is matching a spoken word
  to a picture, not reading text. Two "person" photos that look too similar
  (e.g. Mother vs Sister) can make the quiz harder than intended — that's a
  contrast to keep in mind when picking/cropping photos, not a code issue.

## Adding a brand-new word or tab later

1. Add an entry to `WORD_ITEMS` in `app.js` with a `word`, `tab`, `image` path, and `level`
2. If it's a new tab, add `{ id, label }` to the `TABS` array
3. Drop the photo at the path you chose
4. (Optional) add a corresponding entry to `WordVideos.json` — see [word-videos.md](word-videos.md)

`GAME_LEVELS` and the level grid are generated automatically from `WORD_ITEMS` — no other code changes needed.
