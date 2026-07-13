> **Superseded (2026-07-13).** Word Workshop's rebuild dropped the video
> reward / shorts / analytics system entirely — strategy.md called for a
> simpler scope (modeling + repeat-prompting only, no mic, no rewards
> infrastructure). `WordVideos.json` is no longer read by the app. Kept for
> historical reference only.

# Word Videos, Shorts & Analytics — How to enable them (superseded)

These three features exist in the code (mirroring letterbrain) but ship
**disabled** because they depend on content only you can curate. Nothing
breaks by leaving them off — the quiz works fully without them.

---

## 1. Per-word video reward

After a correct answer, if there's a matching entry in `WordVideos.json`,
a short clip plays before advancing to the next question. If there's no
entry (the default), the app just advances immediately — same as
letterbrain's behavior when `vidStart` is `null`.

### WordVideos.json structure

```json
{
  "evs": {
    "video_id": "SOME_YOUTUBE_ID",
    "words": {
      "Mother": { "vidStart": 5, "vidEnd": 12 },
      "Father": { "funnyShort": "AkPv9ohAUWw" },
      "Baby": { "localVid": "videos/baby-laugh.mp4" }
    }
  },
  "computer": {
    "video_id": "",
    "words": {}
  }
}
```

### Fields per word

| Field | Description |
|-------|--------------|
| `funnyShort` | YouTube Shorts ID — takes priority if set |
| `localVid` | Path to a local mp4 in `videos/` — used if no `funnyShort` |
| `vidStart` / `vidEnd` | Timestamps (seconds) into the tab's `video_id` archive clip — used if neither of the above is set |

Leave a word's entry as `{}` (the current default for every word) to skip
the video for that word entirely.

**No app.js changes are ever needed** — just edit this JSON file.

---

## 2. Perfect-score "shorts" reward

Controlled by `CONFIG.SHORTS_IDS` in `app.js` (currently `[]`, disabled).

To enable: add YouTube Shorts video IDs to the array, e.g.:

```js
SHORTS_IDS: ["AkPv9ohAUWw", "tzBoE0ipsYU"],
```

When a session scores ≥ (total − 1) stars, one Short plays as a reward,
cycling through the list and resuming position via `localStorage`
(`ew_cartoon`) across sessions — identical mechanism to letterbrain's
`lb_cartoon`.

---

## 3. Analytics webhook

Controlled by `CONFIG.ANALYTICS_WEBHOOK_URL` in `app.js` (currently `""`,
disabled).

To enable, set it to a Google Apps Script webhook URL (same pattern as
letterbrain). **Use a separate webhook/sheet from letterbrain's** so session
data from the two apps doesn't mix in the same log.

Payload shape sent per session:

```json
{
  "timestamp": "ISO string",
  "deviceId": "uuid",
  "tab": "evs",
  "mode": "listen | read",
  "level": 1,
  "stars": 8,
  "total": 10,
  "perfect": false,
  "words": [
    { "word": "Mother", "firstTry": true, "wrongs": 0 },
    { "word": "Father", "firstTry": false, "wrongs": 2 }
  ]
}
```
