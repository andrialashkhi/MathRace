# Character assets — Open Peeps (CC0)

`peep-1.svg` … `peep-20.svg` (the question-asker in Game 1 and Game 3) and
`team-1.svg` … `team-12.svg` (the Game 2 board character tokens — twelve
**distinct** individuals, no overlap with the peep set) are **Open Peeps**
characters by **Pablo Stanley** (https://www.openpeeps.com/), licensed
**CC0 1.0** (public domain) — https://creativecommons.org/publicdomain/zero/1.0/.
No attribution is required, and they may be used commercially and modified
freely.

They were composed via the DiceBear `open-peeps` style (which is a CC0 remix of
Open Peeps) and **downloaded once, at build time**, then saved here as static
files. The app loads them locally from `assets/characters/` and never fetches
them at runtime. Each SVG carries the CC0 / Open Peeps attribution in its
embedded `<metadata>` block.

These were generated with **friendly faces only** (no monster/angry/masked
combinations), no masks, no facial hair, and only normal glasses at low
probability — so they read as approachable classroom characters.

To re-roll any single character, overwrite its file with a new seed using the
same constraints (change `seed=` and the `peep-N.svg` filename):

```
https://api.dicebear.com/9.x/open-peeps/svg?seed=YOURSEED&backgroundColor=transparent&maskProbability=0&facialHairProbability=0&accessories=glasses,glasses2,glasses3&accessoriesProbability=20&face=awe,calm,cheeky,cute,eatingHappy,lovingGrin1,lovingGrin2,smile,smileBig,smileLOL,smileTeethGap
```

The app loads `peep-1.svg` … `peep-20.svg`; if you add or remove files, update
`PEEP_COUNT` in `app.js`. Likewise, `team-1.svg` … `team-12.svg` are loaded via
`TEAM_PEEP_COUNT` in `app.js` — update that constant too if you add or remove
team characters. You can also drop in hand-picked SVGs from the official Open
Peeps pack (openpeeps.com) — any CC0 Open Peeps SVG works.
