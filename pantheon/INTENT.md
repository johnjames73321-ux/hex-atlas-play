# pantheon/ - the gods-of-320-BC layer of the street view

A roguelike run on top of the 3D walk: shrines, trials, boons, arms, guardians, passages. The live game is `../index.html`;
this folder is the source of the `<!--PANTHEON:BEGIN-->…<!--PANTHEON:END-->` script block inside it.

- **Never edit that block in index.html by hand.** Edit `src/*.js`, then `node pantheon/build.js` (joins the files in name
  order into one IIFE, replaces the block, parses every script of the page).
- It only uses what the game exposes: `window.hxRestore` (once per land), `window.hxKey`, `me.ps` (per frame),
  `me.onHit / onKill / up / parried / lmbDown`, plus a getter on `me.hp` (40-combat.js). Everything is wrapped in try/catch.
- Save: localStorage `hexatlas-pantheon` = `{ meta (kept for ever), run (lost on death) }`. No map data is touched.

| file | what |
|---|---|
| `10/11/12-gods-*.js` | 2,171 gods in 56 pantheons: `Name|domains|epithet` (domain letters at the top of 10) |
| `13-gods-index.js` | which pantheon a hex gets (`landInfo`: 320 BC people -> regex, else nearest land), the 20 domains |
| `20-boons.js` | save, boon catalogue, `mods()` (all boon stats summed), statuses, `hurt()` |
| `21-strike.js` | Legendary + Duo boons, `strike()` = what each domain does to a foe, status ticks |
| `30-arms.js` | Aspects of the five arms, Anvil marks, Tablet of Destinies |
| `40-combat.js` | hit / kill / hurt hooks, Dash, Cast (U), Call (I) |
| `50-world.js` | shrines, trials, hazards, offers, well, rift, guardian, passages, death |
| `60-fx.js` | effects, procedural sigils (frame per culture, glyph per domain), sound, battle music |
| `70-ui.js` | HUD, offer cards, codex (O), death and intro screens |
| `90-init.js` | wiring |

Test: `node pantheon/serve.js 8792`, open http://localhost:8792, load `/pantheon/test.js` in the page and run
`await PT.smoke(lat, lon)` (steps frames itself, works in a hidden tab; `errs` must be empty).
Shell heredocs here halve double backslashes: write files that contain them with the editor tools.
