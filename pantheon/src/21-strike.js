/* Legendary boons (one per domain, offered once you hold three boons of it), Duo boons (two domains at once),
   and the 20 gifts themselves: what each domain does to a foe. */
const LEGEND = {
  S: ["Twice-Struck", "Every lightning strike of yours strikes a second time."], W: ["Maelstrom", "Your waves crash on every foe near the one you hit."], R: ["Total War", "Doom bursts on every foe near the doomed."],
  L: ["Heart's Dominion", "Weak foes lose two thirds of their force, and suffer far more."], H: ["Perfect Shot", "Your critical blows deal triple damage."], A: ["Unbreakable", "A shield forms every 6 seconds; when it turns a blow, foes near you are stunned."],
  V: ["Endless Feast", "Stupor never fades while the foe lives."], C: ["The Long Winter", "Foes freeze at five stacks of Chill, not eight."], E: ["Worldroot", "Roots seize foes twice as often and bite half again as hard."],
  T: ["Thief of Time", "+10% dodge. Dodging a blow makes you far faster for a moment."], D: ["Lord of the Dead", "You reap foes far sooner, and the reaped burst over those beside them."], U: ["Second Sun", "Scorched foes burn those near them."],
  M: ["Three Moons", "Every moonbeam falls three times."], F: ["Conflagration", "Blaze burns twice as fast."], K: ["Mandate of Heaven", "+30% damage while above four fifths health; your Call fills half again as fast."],
  Y: ["Undying", "Once in every land, a killing blow leaves you at a third of your health instead."], X: ["Written in the Stars", "One blow in five lands twice."], N: ["Alpha", "A spirit beast pounces on every blow."],
  O: ["Masterwork", "Sunder stacks ten deep, and each stack cuts deeper."], Z: ["Before the Beginning", "Rifts open far more often, and each one mends you."]
};
const DUO = {
  SW: ["Sea Storm", "Your waves call lightning down on the foes they strike."], CF: ["Thermal Shock", "A foe both burning and Chilled bursts apart, hurting all around it."], RD: ["Harvest of War", "Each Doom that bursts mends you and feeds your Call."],
  HM: ["Night Hunt", "Moonbeams Mark every foe they touch."], LV: ["Bacchanal", "Weak foes sink into Stupor, deeper every second."], MU: ["Twilight", "Moonbeams Scorch every foe they touch."],
  TX: ["Lucky Break", "After a dash, your next blow is always critical."], EY: ["Evergreen", "Each time roots seize a foe, you are mended."], KS: ["King of Storms", "Your lightning stuns the first foe it strikes."],
  FO: ["Forge-Fire", "Sundered foes are set Ablaze."], HN: ["The Wild Hunt", "Spirit beasts Mark their prey, and tear twice as hard at the Marked."], AR: ["Strategos", "Doom bursts twice as hard on Exposed foes."]
};
for (const d of Object.keys(LEGEND)) CAT[d + ":L"] = { id: d + ":L", dom: d, slot: "P", name: LEGEND[d][0], text: () => LEGEND[d][1], stats: Object.assign({ ["leg" + d]: 1 }, d === "T" ? { dodge: .1 } : d === "D" ? { potD: .15 } : d === "K" ? { gauge: .5 } : {}), leg: 1 };
for (const k of Object.keys(DUO)) CAT["duo:" + k] = { id: "duo:" + k, dom: k[0], dom2: k[1], slot: "P", name: DUO[k][0], text: () => DUO[k][1], stats: { ["duo" + k]: 1 }, duo: 1 };
const domCount = d => R().boons.filter(b => { const c = CAT[b.id]; return c.dom === d && !c.duo && !c.leg; }).length;
const specials = g => { const out = [], own = R().boons, ds = [g.d[0], g.d[1]].filter(Boolean);   // what this god may offer beyond the usual seven
  for (const d of ds) if (domCount(d) >= 3 && !own.some(b => b.id === d + ":L")) out.push({ id: d + ":L", god: g.id, rar: 4, lv: 1 });
  for (const k of Object.keys(DUO)) { if (!ds.includes(k[0]) && !ds.includes(k[1])) continue; if (domCount(k[0]) && domCount(k[1]) && !own.some(b => b.id === "duo:" + k)) out.push({ id: "duo:" + k, god: g.id, rar: 5, lv: 1 }); }
  return out; };
const FL = k => (MODS && MODS[k]) || 0;   // a flag from the hero's current boons (legendary / duo)

const thermal = (me, m) => { const S = m.pn && m.pn.s; if (!S || !FL("duoCF") || !S.chill || !(S.burn || S.blaze)) return; delete S.chill; delete S.burn; delete S.blaze; restat(m); const at = mp(m).clone(); fxRing(me, at, "#ffffff", 4, .4); fxBurst(me, head(me, m), DOM.F.c, 12); fxBurst(me, head(me, m), DOM.C.c, 12); sfx(me, "boom");
  later(me, .05, () => { for (const o of near(me, at, 3.8)) hurt(me, o, power(me) * 3, "#ffffff", 1); }); };
const moonbeam = (me, at, x, c) => { fxPillar(me, at, c, 26, .5); sfx(me, "moon"); later(me, .18, () => { fxRing(me, at, c, 3.6, .4); for (const o of near(me, at, 3.6)) { hurt(me, o, x * 2.2, c, 1); if (FL("duoHM")) afflict(me, o, "mark", { t: 7, c: DOM.H.c }); if (FL("duoMU")) afflict(me, o, "burn", { t: 3.5, x: x * .3, c: DOM.U.c }); } }); };
const strike = (me, m, d, x, src) => {
  if (!alive(m)) return; const c = DOM[d].c, k = potOf(me, d), p = mp(m), M = mods(me); x *= k;
  switch (d) {
    case "S": { hurt(me, m, x * .3, c); if (M.duoKS && !m.pnG) m.stun = Math.max(m.stun || 0, .5); let last = head(me, m), n = 0; const seen = new Set([m]);
      for (let j = 0; j < 3 + M.chain; j++) { const o = near(me, last, 9).filter(u => !seen.has(u)).sort((a, b) => mp(a).distanceTo(last) - mp(b).distanceTo(last))[0]; if (!o) break; seen.add(o); const h = head(me, o); fxBolt(me, last, h, c); hurt(me, o, x * .6, c); last = h; n++; }
      if (!n) { const h = head(me, m); fxBolt(me, h.clone().setY(h.y + 9), h, c); } sfx(me, "zap"); if (M.legS && src !== "leg") later(me, .2, () => strike(me, m, "S", x / k * .7, "leg")); break; }
    case "W": { const wave = (o, f) => { hurt(me, o, x * .5 * f, c); const q = mp(o), dx = q.x - me.pos.x, dz = q.z - me.pos.z, l = Math.hypot(dx, dz) || 1, push = (o.boss || o.pnG ? .8 : 2.6) * (1 + (M.potW || 0)), nx = q.x + dx / l * push, nz = q.z + dz / l * push; if (me.H(nx, nz) > -.6) { q.x = nx; q.z = nz; } o.stun = Math.max(o.stun || 0, .25); };
      wave(m, 1); if (M.legW) for (const o of near(me, p, 5, m)) wave(o, .7); fxRing(me, p, c, M.legW ? 5 : 2.2, .35); sfx(me, "wave"); if (M.duoSW && src !== "duo") later(me, .08, () => strike(me, m, "S", x / k * .5, "duo")); break; }
    case "R": { const s = afflict(me, m, "doom", { t: 1.1, max: 3, x: x * 1.2, c }); if (s) s.t = 1.1; break; }
    case "L": hurt(me, m, x * .35, c); afflict(me, m, "weak", { t: 6, c }); break;
    case "H": hurt(me, m, x * .4, c); afflict(me, m, "mark", { t: 7, c }); break;
    case "A": hurt(me, m, x * .35, c); afflict(me, m, "exposed", { t: 5, c }); break;
    case "V": afflict(me, m, "stupor", { t: M.legV ? 999 : 4, max: 5 + M.stup, x: x * .22, c }); break;
    case "C": { hurt(me, m, x * .3, c); const cap = M.legC ? 5 : 8, s = afflict(me, m, "chill", { t: 6, max: cap, n: src === "S" || src === "C" ? 2 : 1, c }); thermal(me, m);
      if (s && m.pn.s.chill && s.n >= cap) { delete m.pn.s.chill; restat(m); m.stun = Math.max(m.stun || 0, m.boss || m.pnG ? 1 : 2.2); fxBurst(me, head(me, m), c, 14); fxRing(me, p, c, 3, .4); sfx(me, "ice"); later(me, .5, () => hurt(me, m, x * 2.5 * (1 + (M.potC || 0)), c, 1)); } break; }
    case "E": { const P = sOf(m); if ((P.rootCd || 0) <= me.tnow) { P.rootCd = me.tnow + (M.legE ? 3.5 : 7); m.stun = Math.max(m.stun || 0, m.boss || m.pnG ? .5 : 1.3); afflict(me, m, "root", { t: 1.3, c }); hurt(me, m, x * (M.legE ? .75 : .5), c); fxRoots(me, p, c); sfx(me, "root"); if (M.duoEY) heal(me, 3); } else hurt(me, m, x * .3, c); break; }
    case "T": { hurt(me, m, x * .35, c); if (Math.random() < .3 && !(m.boss || m.pnG)) { m.stun = Math.max(m.stun || 0, .7); afflict(me, m, "daze", { t: .7, c }); } me.pn.swiftT = me.tnow + 1.6; break; }
    case "D": { hurt(me, m, x * .35, c); heal(me, .5 * k); if (alive(m) && !m.boss && !m.pnG && m.hp / m.mx < .2 + (M.potD || 0)) { const at = p.clone(); fxBurst(me, head(me, m), c, 10); sfx(me, "reap"); num(me, m, m.hp, c, 1); m.hp = 0; finish(me, m); if (M.legD) { fxRing(me, at, c, 3.6, .4); later(me, .08, () => { for (const o of near(me, at, 3.6)) hurt(me, o, power(me) * 2, c, 1); }); } } break; }
    case "U": afflict(me, m, "burn", { t: 3.5, x: x * .3, c }); thermal(me, m); break;
    case "M": { hurt(me, m, x * .2, c); me.pn.moonN = (me.pn.moonN || 0) + 1; if (me.pn.moonN >= (M.moon4 ? 4 : 5)) { me.pn.moonN = 0; const at = p.clone(); moonbeam(me, at, x, c); if (M.legM) { later(me, .3, () => moonbeam(me, at, x, c)); later(me, .6, () => moonbeam(me, at, x, c)); } } break; }
    case "F": afflict(me, m, "blaze", { t: 4, x: x * .24, c }); thermal(me, m); break;
    case "K": hurt(me, m, x * (.3 + (m.hp / m.mx > .7 ? .6 : 0) + (m.boss || m.champ || m.pnG ? .4 : 0)), c); break;
    case "Y": hurt(me, m, x * .3, c); heal(me, .6 * k); break;
    case "X": hurt(me, m, x * .2, c); afflict(me, m, "hex", { t: 5, c }); break;
    case "N": { me.pn.packN = (me.pn.packN || 0) + 1; if (me.pn.packN >= (M.legN ? 1 : M.pack2 ? 2 : 3)) { me.pn.packN = 0; fxBeast(me, m, c); sfx(me, "beast"); const dbl = M.duoHN && m.pn && m.pn.s.mark ? 2 : 1; later(me, .16, () => { hurt(me, m, x * 1.5 * dbl, c, 1); if (M.duoHN) afflict(me, m, "mark", { t: 7, c: DOM.H.c }); }); } else hurt(me, m, x * .15, c); break; }
    case "O": hurt(me, m, x * .25, c); afflict(me, m, "sunder", { t: 6, max: M.legO ? 10 : 5, c }); if (M.duoFO) { afflict(me, m, "blaze", { t: 4, x: x * .2, c: DOM.F.c }); thermal(me, m); } break;
    default: if (Math.random() < (M.legZ ? .4 : .16)) { const at = p.clone(); fxRift(me, at, c); sfx(me, "rift"); if (M.legZ) heal(me, 2); later(me, .12, () => { for (const o of near(me, at, 2.6)) hurt(me, o, x * 3, c, 1); }); } else hurt(me, m, x * .25, c);
  }
};
PN.strike = strike;

// statuses that tick
const statusTick = (me, dt) => { const M = mods(me);
  for (const m of me.mobs) { const P = m.pn; if (!P) continue; if (P.acc && ((P.acc.t -= dt) <= 0 || m.dead)) flushNum(me, m); if (m.dead) continue; let ch = 0;
    if (M.duoLV && P.s.weak) { P.lvT = (P.lvT || 0) + dt; if (P.lvT >= 1) { P.lvT = 0; afflict(me, m, "stupor", { t: 4, max: 5 + M.stup, x: power(me) * .2, c: DOM.V.c }); } }
    for (const k in P.s) { const s = P.s[k]; s.t -= dt;
      if (k === "stupor" || k === "burn" || k === "blaze") { s.tick -= dt; if (s.tick <= 0) { s.tick = k === "blaze" && M.legF ? .25 : .5; const v = s.x * (k === "stupor" ? s.n : 1) * (k === "burn" ? 1 + (M.potU || 0) : k === "blaze" ? 1 + (M.potF || 0) : 1 + (M.potV || 0)); hurt(me, m, v, s.c);
        if (k === "burn" && M.legU) for (const o of near(me, mp(m), 3, m)) hurt(me, o, v * .5, s.c); if (m.dead) break; } }
      if (s.t <= 0) { if (k === "doom") { let x = s.x * s.n; if (M.duoAR && P.s.exposed) x *= 2; const at = mp(m).clone(); fxBurst(me, head(me, m), s.c, 8); sfx(me, "doom"); delete P.s[k]; if (M.duoRD) { heal(me, 2); addGauge(me, 3); } if (M.legR) { fxRing(me, at, s.c, 4, .35); for (const o of near(me, at, 4, m)) hurt(me, o, x * .6, s.c); } hurt(me, m, x, s.c, 1); ch = 1; if (m.dead) break; continue; } delete P.s[k]; ch = 1; } }
    if (ch && !m.dead) restat(m); }
};
