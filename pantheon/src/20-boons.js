/* Run state, the boon catalogue, statuses on foes, and the damage rules. Everything scales with "power":
   the hero's own base blow (level, training, weapon), so a boon is never too weak or too strong for a save. */
const PN = window.PANTHEON = { v: 1, inner: 0, GODS, GOD, PANS, DOM };
const SKEY = "hexatlas-pantheon", GSC = 1.45;
const RAR = [{ n: "Common", m: 1, c: "#d9dde6" }, { n: "Rare", m: 1.3, c: "#4aa8ff" }, { n: "Epic", m: 1.65, c: "#c06bff" }, { n: "Heroic", m: 2.1, c: "#ff5a4a" }, { n: "Legendary", m: 2.6, c: "#ffb52e" }, { n: "Duo", m: 2.2, c: "#b8ff5a" }];
const st = (() => { let s = {}; try { s = JSON.parse(localStorage.getItem(SKEY) || "{}") || {}; } catch (e) {}
  s.meta = Object.assign({ shards: 0, ichor: 0, mirror: {}, asp: {}, aspSel: {}, codex: {}, best: 0, runs: 0, wins: 0, seen: 0, opt: {} }, s.meta || {}); if (!s.run) s.run = null; return s; })();
let saveT = 0; const save = () => { clearTimeout(saveT); saveT = setTimeout(() => { try { localStorage.setItem(SKEY, JSON.stringify(st)); } catch (e) {} }, 300); };
const mir = k => st.meta.mirror[k] || 0;
const newRun = () => ({ seed: (Math.random() * 2 ** 31) | 0, boons: [], depth: 0, lands: {}, nLands: 0, kills: 0, t0: Date.now(), cleared: {}, forge: [], hearts: 0, def: 1 + mir("breath"), rr: mir("dice"), gauge: 0, cast: 3 + mir("quiver"), gods: {}, dealt: 0, taken: 0, guardians: 0, lv: 0 });
const R = () => st.run || (st.run = newRun());
PN.st = st; PN.save = save; PN.dirty = () => dirty();

// ---------- catalogue ----------
const ADJ = { S: ["Thunder", "Stormbrand", "Skyfire"], W: ["Tidal", "Riptide", "Breaker's"], R: ["Doom", "Bloodied", "Warbringer's"], L: ["Heartseeker", "Rose", "Enthralling"], H: ["Hunter's", "True", "Stalker's"],
  A: ["Aegis", "Sage's", "Lawgiver's"], V: ["Reveller's", "Drunken", "Wild Vine"], C: ["Frost", "Rime", "Winter's"], E: ["Rootbound", "Harvest", "Bramble"], T: ["Swift", "Trickster's", "Wayfarer's"],
  D: ["Reaper's", "Grave", "Shade"], U: ["Sunfire", "Radiant", "Dawn"], M: ["Moonlit", "Lunar", "Night's"], F: ["Ember", "Blazing", "Cinder"], K: ["Sovereign", "Heaven's", "Crowned"],
  Y: ["Mending", "Living", "Verdant"], X: ["Fated", "Hexed", "Oracle's"], N: ["Feral", "Spirit-Pack", "Beast"], O: ["Tempered", "Hammerfall", "Forged"], Z: ["Abyssal", "Unmade", "First-Dark"] };
const NOUN = { A: ["Strike", "Edge", "Blow"], S: ["Flourish", "Sweep", "Reckoning"], C: ["Shot", "Lance", "Volley"], D: ["Rush", "Step", "Passage"], G: ["Aid", "Wrath", "Descent"] };
const SLOT = { A: "Attack", S: "Special", C: "Cast", D: "Dash", G: "Call" }, SLOTKEY = { A: "LMB", S: "R · MMB · F", C: "U", D: "Shift ×2", G: "I" };
const DOMTEXT = { S: "lightning leaps to 3 nearby foes", W: "a wave hurls the foe back", R: "inflicts Doom, a wound that bursts a moment later", L: "inflicts Weak: its bites lose a third of their force",
  H: "Marks the foe so it takes critical wounds", A: "leaves the foe Exposed to all harm", V: "inflicts Stupor, a sickness that stacks five deep", C: "inflicts Chill; eight stacks freeze and shatter",
  E: "roots seize the foe in place", T: "may Daze the foe, and each blow quickens you", D: "drinks life, and reaps the nearly dead outright", U: "sets the foe alight with Scorch",
  M: "every fifth blow calls down a moonbeam", F: "sets a Blaze that spreads when the foe falls", K: "strikes far harder at the unwounded and the mighty", Y: "each blow mends you a little",
  X: "Hexes the foe: it suffers more from everything", N: "every third blow a spirit beast pounces", O: "Sunders the foe: every blow bites deeper, five deep", Z: "now and then tears open a rift of the unformed" };
// passives: [name, text(v) , stats at potency 1]. Stats are summed over all boons (see mods()).
const pc = v => Math.round(v * 100) + "%", n1 = v => (Math.round(v * 10) / 10).toString();
const PASS = {
  S: [["Static Charge", p => `When you are hurt, lightning strikes foes near you for ${pc(1.5 * p)} of your power.`, { revS: 1.5 }], ["High Voltage", p => `Your lightning leaps to 2 more foes and hits ${pc(.3 * p)} harder.`, { potS: .3, chain: 2 }]],
  W: [["Tidal Vigor", p => `+${Math.round(20 * p)} maximum health.`, { hpmax: 20 }], ["Riptide", p => `Your waves throw foes farther and hit ${pc(.4 * p)} harder.`, { potW: .4 }]],
  R: [["Blood Frenzy", p => `Below half health you deal +${pc(.25 * p)} damage.`, { lowDmg: .25 }], ["Battle Rage", p => `Each kill: +${pc(.2 * p)} damage for 6 seconds.`, { frenzy: .2 }]],
  L: [["Life Affirmation", p => `+${Math.round(25 * p)} maximum health.`, { hpmax: 25 }], ["Sweet Surrender", p => `Weak foes take +${pc(.15 * p)} damage.`, { potL: .15 }]],
  H: [["Keen Eye", p => `+${pc(.06 * p)} chance of a critical hit.`, { crit: .06 }], ["Clean Kill", p => `Your first blow on each foe deals +${pc(.6 * p)} damage.`, { first: .6 }]],
  A: [["Bronze Skin", p => `You take ${pc(.08 * p)} less damage.`, { dr: .08 }], ["Deflecting Guard", p => `Every ${n1(14 / p)} seconds a shield forms that turns aside one blow.`, { shield: 1 }]],
  V: [["After Party", p => `Each kill heals ${n1(1.5 * p)} health.`, { killHeal: 1.5 }], ["Strong Drink", p => `Stupor stacks 2 deeper and deals ${pc(.3 * p)} more.`, { potV: .3, stup: 2 }]],
  C: [["Frozen Touch", p => `Foes that hurt you are Chilled ${Math.round(3 * p)} deep.`, { revC: 3 }], ["Deep Winter", p => `Shattering a frozen foe deals ${pc(.6 * p)} more.`, { potC: .6 }]],
  E: [["Bountiful", p => `+${Math.round(30 * p)} maximum health.`, { hpmax: 30 }], ["Thornskin", p => `Foes that hurt you take ${pc(1.2 * p)} of your power and are Rooted.`, { revE: 1.2 }]],
  T: [["Fleet Foot", p => `You move ${pc(.1 * p)} faster.`, { spd: .1 }], ["Sleight", p => `${pc(.07 * p)} chance to dodge any blow.`, { dodge: .07 }]],
  D: [["Soul Tithe", p => `Each kill heals ${n1(2 * p)} health and fills your Call.`, { killHeal: 2, killGauge: 3 }], ["Scythe's Reach", p => `You reap foes ${pc(.06 * p)} sooner.`, { potD: .06 }]],
  U: [["Radiance", p => `+${pc(.08 * p)} damage.`, { dmg: .08 }], ["High Noon", p => `Scorch burns ${pc(.35 * p)} hotter.`, { potU: .35 }]],
  M: [["Night Vision", p => `+1 Cast, and your Cast hits ${pc(.2 * p)} harder.`, { castMax: 1, castDmg: .2 }], ["Full Moon", p => `Moonbeams fall on every fourth blow and hit ${pc(.3 * p)} harder.`, { potM: .3, moon4: 1 }]],
  F: [["Ember Heart", p => `You attack ${pc(.08 * p)} faster.`, { dex: .08 }], ["Wildfire", p => `Blaze burns ${pc(.3 * p)} hotter and leaps farther.`, { potF: .3 }]],
  K: [["Sovereign", p => `+${pc(.2 * p)} damage to champions, guardians and bosses.`, { bossDmg: .2 }], ["Divine Favour", p => `Your Call fills ${pc(.3 * p)} faster, and rarer boons are offered.`, { gauge: .3, luck: .05 }]],
  Y: [["Vitality", p => `You regain ${n1(.5 * p)} health every second.`, { regen: .5 }], ["Blessed", p => `Clearing a trial heals ${Math.round(8 * p)} health.`, { trialHeal: 8 }]],
  X: [["Windfall", p => `+${pc(.4 * p)} coins and shards.`, { coin: .4 }], ["Loaded Dice", p => `+${pc(.05 * p)} critical chance, and one more reroll in every land.`, { crit: .05, rerolls: 1 }]],
  N: [["Pack Bond", p => `Spirit beasts pounce on every second blow and hit ${pc(.3 * p)} harder.`, { potN: .3, pack2: 1 }], ["Thick Hide", p => `You take ${pc(.06 * p)} less damage; +${Math.round(10 * p)} maximum health.`, { dr: .06, hpmax: 10 }]],
  O: [["Tempered Edge", p => `Your Special deals +${pc(.18 * p)} damage.`, { specDmg: .18 }], ["Plate", p => `You take ${pc(.07 * p)} less damage.`, { dr: .07 }]],
  Z: [["Entropy", p => `+${pc(.18 * p)} damage, but 10 less maximum health.`, { dmg: .18, hpflat: -10 }], ["Abyssal Gift", p => `Every status and divine effect of yours is ${pc(.1 * p)} stronger.`, { potAll: .1 }]]
};
const CAT = {};
for (const d of Object.keys(DOM)) {
  for (const s of Object.keys(SLOT)) CAT[d + ":" + s] = { id: d + ":" + s, dom: d, slot: s };
  PASS[d].forEach((q, i) => { CAT[d + ":P" + (i + 1)] = { id: d + ":P" + (i + 1), dom: d, slot: "P", name: q[0], text: q[1], stats: q[2] }; });
}
const pot = b => RAR[b.rar].m * (1 + .3 * (b.lv - 1));
const boonName = b => { const c = CAT[b.id]; if (c.name) return c.name; const h = hash(b.god + c.id); return ADJ[c.dom][h % 3] + " " + NOUN[c.slot][(h >>> 4) % 3]; };
const boonText = (b, p = pot(b)) => { const c = CAT[b.id], d = c.dom;
  if (c.slot === "P") return c.text(p);
  if (c.slot === "A") return `Your Attack deals +${pc(.2 * p)} damage and ${DOMTEXT[d]}.`;
  if (c.slot === "S") return `Your Special (spin, stab, charged sweep, throw) deals +${pc(.3 * p)} damage and ${DOMTEXT[d]}.`;
  if (c.slot === "C") return `Your Cast bursts for ${pc(2.8 * p)} of your power: ${DOMTEXT[d]}.`;
  if (c.slot === "D") return `Your Dash blasts foes around you for ${pc(1.6 * p)} of your power: ${DOMTEXT[d]}.${DASHX[d] ? " " + DASHX[d] : ""}`;
  return `Call (${SLOTKEY.G}): ${DOM[d].n} falls on your foes for ${pc(2.2 * p)} of your power a strike, again and again. ${CALLX[d] || ""}`.trim(); };
const DASHX = { A: "You cannot be hurt for a moment.", T: "You run far faster for a few seconds.", Y: "Each dash mends you.", D: "Each foe touched feeds you life." };
const CALLX = { A: "While it lasts, nothing can hurt you.", Y: "It heals you deeply.", T: "You move and strike far faster.", K: "Every foe is stunned.", N: "A pack of spirit beasts hunts with you.", L: "Every foe is left Weak." };
PN.CAT = CAT; PN.boonName = boonName; PN.boonText = boonText;

// ---------- what the hero's boons add up to ----------
let MODS = null; const dirty = () => { MODS = null; };
const boonIn = slot => R().boons.find(b => CAT[b.id].slot === slot) || null;
const has = id => R().boons.find(b => b.id === id) || null;
const mods = me => { if (MODS) return MODS; const M = { hpmax: 0, hpflat: 0, dr: 0, dmg: 0, spd: 0, dex: 0, crit: 0, dodge: 0, castMax: 0, castDmg: 0, specDmg: 0, atkDmg: 0, gauge: 0, coin: 0, regen: 0, killHeal: 0, killGauge: 0, lowDmg: 0, frenzy: 0, first: 0, bossDmg: 0, trialHeal: 0, rerolls: 0, luck: 0, shield: 0, chain: 0, stup: 0, moon4: 0, pack2: 0, potAll: 0, defiance: 0, lifesteal: 0, car: 0 };
  for (const b of R().boons) { const c = CAT[b.id]; if (!c.stats) continue; const p = pot(b); for (const k in c.stats) M[k] = (M[k] || 0) + c.stats[k] * (k === "castMax" || k === "chain" || k === "stup" || k === "moon4" || k === "pack2" || k === "rerolls" || k === "hpflat" || k === "shield" ? 1 : p); if (c.stats.shield) M.shieldCd = 14 / p; }
  for (const f of R().forge) { const F = FORGE[f]; if (F && F.stats) for (const k in F.stats) M[k] = (M[k] || 0) + F.stats[k]; }
  try { aspectMods(me, M); } catch (e) { warn(e); }
  M.hpmax += 100 + 10 * mir("skin") + 25 * R().hearts + M.hpflat; M.hpmax = Math.max(30, M.hpmax); M.luck += .04 * mir("favour"); M.coin += .15 * mir("purse");
  return MODS = M; };
const potOf = (me, d) => 1 + (mods(me)["pot" + d] || 0) + mods(me).potAll;
const power = me => 12 * (me.up ? me.up("dmg") : 1) * (me.wMul ?? 1);
const maxHP = me => mods(me).hpmax;
const hpNow = me => Math.max(0, me.hp) / 100 * maxHP(me);
PN.mods = mods; PN.power = power;

// ---------- foes ----------
const alive = m => m && !m.dead && !m.tame;
const mp = m => m.root.position;
const rad = m => Math.max(.9, m.a[1] * .35 * GSC);
const near = (me, p, r, skip) => me.mobs.filter(m => alive(m) && m !== skip && Math.hypot(mp(m).x - p.x, mp(m).z - p.z) < r + rad(m));
const head = (me, m) => new me.T.Vector3(mp(m).x, mp(m).y + m.a[2] * GSC * .6, mp(m).z);
const sOf = m => m.pn || (m.pn = { s: {}, sp0: m.a[5], bite0: m.a[7] });
const restat = m => { const P = m.pn, s = P.s; let sp = 1, bite = 1; if (s.chill) sp *= 1 - Math.min(.72, .09 * s.chill.n); if (s.weak) bite *= FL("legL") ? .35 : .65; if (s.stupor) sp *= .9; m.a[5] = P.sp0 * sp; m.a[7] = P.bite0 * bite; };
const vuln = (me, m) => { const P = m.pn; if (!P) return 1; const s = P.s; let v = 1; if (s.hex) v += .25; if (s.sunder) v += (FL("legO") ? .08 : .06) * s.sunder.n; if (s.exposed) v += .15; if (s.weak) v += (mods(me).potL || 0) + (FL("legL") ? .25 : 0); if (s.mark) v += .2; return v; };
const afflict = (me, m, k, o = {}) => { if (!alive(m)) return null; const P = sOf(m), s = P.s[k] || (P.s[k] = { n: 0, t: 0, x: 0, tick: .5 });
  s.n = Math.min(o.max || 1, s.n + (o.n || 1)); s.t = Math.max(s.t, o.t || 4); s.x = Math.max(s.x, o.x || 0); s.c = o.c || s.c; restat(m); P.icon = o.c || P.icon; P.iconT = 0; return s; };
const hideNum = () => { const sv = $("sv"), e = sv && sv.lastElementChild; if (e && e.classList.contains("dn")) e.style.display = "none"; };
const num = (me, m, v, color, big) => { try { me.popNum(m, v, false); const e = $("sv").lastElementChild; if (e && e.classList.contains("dn")) { e.style.color = color || "#fff"; if (big) e.style.fontSize = "22px"; else e.style.fontSize = "13px"; } } catch (e) {} };
const finish = (me, m) => { PN.inner++; try { for (let i = 0; i < 8 && !m.dead; i++) { m.hp = Math.min(m.hp, 0); me.hurtMob(m, 1, me.pos, false); hideNum(); } } catch (e) { warn(e); } finally { PN.inner--; } };
const hurt = (me, m, v, color, big) => {   // damage from a boon: quiet, no combo, no hit-stop
  if (!alive(m) || !(v > 0)) return 0; v *= vuln(me, m); if (m.champ || m.boss || m.pnG) v *= 1 + mods(me).bossDmg;
  m.hp -= v; if (m.bar && m.bar.fill) m.bar.fill.scale.x = Math.max(0, m.hp / m.mx); m.angry = Math.max(m.angry || 0, 25); m.flash = .12; R().dealt += v;
  if (big) num(me, m, v, color, 1); else { const P = sOf(m), A = P.acc || (P.acc = { v: 0, t: .16 }); A.v += v; A.c = color; }
  if (m.hp <= 0) { flushNum(me, m); finish(me, m); } return v; };
const flushNum = (me, m) => { const P = m.pn; if (P && P.acc) { num(me, m, P.acc.v, P.acc.c); P.acc = null; } };
const heal = (me, v) => { if (me.hp <= 0 || !(v > 0)) return; me.hp = Math.min(100, me.hp + v / maxHP(me) * 100); me.hpDraw && me.hpDraw(); };
const later = (me, sec, fn) => me.pn.q.push({ t: sec, fn });
PN.hurt = hurt; PN.afflict = afflict; PN.heal = heal;

