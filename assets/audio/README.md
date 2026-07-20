# Audio assets

## Sound effects — synthesized (no files)
All SFX (click, correct, wrong, dice, turn, trap, bonus, swap) are synthesized
in-browser with the Web Audio API in `app.js` (the `Audio` object). 0 bytes, no
licensing, respects the mute/volume control.

## Background music — per-game (files present)
The player uses **per-game** tracks (chosen by the user):

| File | Plays during | Size |
|------|--------------|------|
| `game1.mp3` | Game 1 (buzzer) active play | ~4.81 MB |
| `game2.mp3` | Game 2 (board) active play | ~4.51 MB |
| `game3.mp3` | Game 3 (table conquest) active play | ~4.28 MB |
| `music-menu.mp3` | landing / mode / config / waiting screens | **not present yet** |

- The **menu track is intentionally missing** — a third file is coming. The
  player fails silently on a missing file, so menu screens are simply quiet for
  now. Drop the third track in as `assets/audio/music-menu.mp3` when ready.
- All music files **loop**, start only after the **first user gesture**
  (autoplay-safe), and obey the mute/volume toggle (top-right).

## ⚠️ Size note (Render free tier)
`game1.mp3` + `game2.mp3` + `game3.mp3` ≈ **13.6 MB** combined — well over the
earlier ~1–2 MB guidance. They load on demand (per game, on first gesture) and
are cached, so this is usable, but if load time on the free tier matters,
consider re-encoding to a lower bitrate (e.g. ~96–128 kbps mono) or trimming
the loop. No `ffmpeg` was available in the build environment to compress them
here.

## Player mapping (app.js)
`Audio.MUSIC_SRC = { menu, game1, game2, game3 }`; `render()` picks the track
by screen (`play` → game1, `g2play` → game2, `g3play` → game3, else menu).
