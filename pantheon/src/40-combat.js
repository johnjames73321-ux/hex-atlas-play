/* Combat hooks: every blow the hero lands or takes passes through here. Uses only what the game exposes
   (me.onHit / me.onKill / me.up / me.parried / me.ps), plus a getter on me.hp so damage can be turned aside. */
const hitInfo = me => {   // what kind of blow is landing right now
  const A = me.atk, k = A && A.kind;
  if (me.weapon === "bow" && !A) return { slot: "A", arrow: 1 };
  if (!A) return me.blade === false ? { slot: "S", thrown: 1 } : { slot: "O" };
  if (k === "s0" || k === "s1" || k === "s2" || k === "slam" || k === "whirl" || k === "thrust") return { slot: "A", heavy: k === "slam" || k === "thrust", round: k === "whirl" };
  return { slot: "S", heavy: k === "sweep" || k === "spin2", round: k === "spin" || k === "spin2", dash: k === "dash" };
};
const addGauge = (me, v) => { const Rn = R(); Rn.gauge = clamp(Rn.gauge + v * (1 + mods(me).gauge), 0, 100); };
const onHit = (me, m, dmg, crit, heavy) => {
  if (PN.inner || !alive(m)) return; const P = me.pn, M = mods(me), I = hitInfo(me), S = sOf(m); I.crit = crit; I.heavy = I.heavy || heavy;
  let mul = vuln(me, m) - 1;
  if (I.slot === "A") mul += M.atkDmg; else if (I.slot === "S") mul += M.specDmg;
  if (m.champ || m.boss || m.pnG) mul += M.bossDmg;
  if (M.first && !S.hit1) mul += M.first; S.hit1 = 1;
  if (M.twin && Object.keys(S.s).length >= 2) mul += M.twin;
  if (P.momT > me.tnow) mul += P.momV * P.momN; if (P.standT > me.tnow) mul += P.standV; if (P.frenzyT > me.tnow) mul += M.frenzy;
  if (M.lowDmg && me.hp < 50) mul += M.lowDmg;
  if (!crit && (M.crit || S.s.mark) && Math.random() < M.crit + (S.s.mark ? .25 : 0)) { mul += 1; I.crit = 1; fxText(me, head(me, m), "CRIT", "#ffd84a"); }
  const b = I.slot === "A" ? boonIn("A") : I.slot === "S" ? boonIn("S") : null, p = b ? pot(b) : 0;
  if (b) mul += (I.slot === "A" ? .2 : .3) * p;
  const extra = dmg * mul; if (extra > 0) { m.hp -= extra; if (extra > dmg * .2) num(me, m, extra, b ? DOM[CAT[b.id].dom].c : "#ffd27a"); }
  R().dealt += dmg + extra;
  if (b) { const d = CAT[b.id].dom, x = dmg * (I.slot === "A" ? .6 : .9) * p; later(me, 0, () => strike(me, m, d, x, I.slot)); }
  if (I.slot === "A") { if (M.echo) later(me, .13, () => { fxBurst(me, head(me, m), "#ffffff", 4); hurt(me, m, dmg * M.echo, "#ffffff"); }); if (M.lifesteal) heal(me, M.lifesteal); }
  if (M.sunderAll) afflict(me, m, "sunder", { t: 6, max: 5, c: DOM.O.c });
  if (M.quake && I.heavy) shock(me, m, power(me) * M.quake, 4.2, "#d8c8a0");
  aspCall(me, "hit", m, dmg, I);
  addGauge(me, clamp(dmg / power(me), .3, 3) * 1.15);
  P.tgt = m; P.tgtT = 5;
};
const onKill = (me, m) => {
  const P = me.pn, M = mods(me), Rn = R(); Rn.kills++; if (M.killHeal) heal(me, M.killHeal); if (M.killGauge) addGauge(me, M.killGauge); if (M.frenzy) P.frenzyT = me.tnow + 6;
  aspCall(me, "kill", m);
  const S = m.pn; if (S && S.s.blaze) { const x = S.s.blaze.x; for (const o of near(me, mp(m), 5 + (M.potF ? 2.5 : 0), m)) afflict(me, o, "blaze", { t: 4, x, c: DOM.F.c }); fxRing(me, mp(m), DOM.F.c, 5, .4); }
  fxBurst(me, head(me, m), m.pnC || "#ffd9a0", m.champ || m.pnG ? 22 : 8);
  try { worldKill(me, m); } catch (e) { warn(e); }
};

// ---------- the hero's health: defiance, dodges, shields, revenge ----------
const hookHP = me => { let v = me.hp; Object.defineProperty(me, "hp", { configurable: true, enumerable: true, get: () => v, set: n => { try { v = hpSet(me, v, n); } catch (e) { v = n; warn(e); } } }); };
const hpSet = (me, old, n) => {
  if (!(n < old)) return n; const P = me.pn, d = old - n, M = mods(me), Rn = R(); if (!P || old <= 0) return n;
  if (me.prog && me.prog.god) return n;
  if (P.invT > me.tnow) return old;
  if (d > 1.2) {   // a real blow, not a tick of poison
    if (M.dodge && Math.random() < M.dodge) { fxText(me, me.pos.clone().setY(me.pos.y + 2.2), "DODGE", "#ffd9a6"); sfx(me, "dodge"); return old; }
    if (P.shield > 0) { P.shield--; P.shieldT = 0; fxRing(me, me.pos, DOM.A.c, 2.4, .35); fxText(me, me.pos.clone().setY(me.pos.y + 2.2), "TURNED ASIDE", DOM.A.c); sfx(me, "deflect"); P.invT = me.tnow + .25; return old; }
    if (me.tnow - (P.revT || -9) > .8) { P.revT = me.tnow; later(me, 0, () => revenge(me)); }
    aspCall(me, "hurtMe"); addGauge(me, 5); P.hurtFlash = .35;
  }
  Rn.taken += d / 100 * M.hpmax;
  if (n <= 0) {
    if (Rn.def > 0) { Rn.def--; save(); P.invT = me.tnow + 2; later(me, 0, () => defy(me)); return 50; }
    P.died = 1;
  }
  return n;
};
const revenge = me => { const M = mods(me), foes = near(me, me.pos, 6.5).slice(0, 4); if (!foes.length) return;
  if (M.revS) for (const m of foes) { fxBolt(me, me.pos.clone().setY(me.pos.y + 1.2), head(me, m), DOM.S.c); hurt(me, m, power(me) * M.revS, DOM.S.c); }
  if (M.revC) for (const m of foes) afflict(me, m, "chill", { t: 6, max: 8, n: Math.round(M.revC), c: DOM.C.c });
  if (M.revE) { const m = foes[0]; hurt(me, m, power(me) * M.revE, DOM.E.c); m.stun = Math.max(m.stun || 0, 1); fxRoots(me, mp(m), DOM.E.c); } };
const defy = me => { fxRing(me, me.pos, "#ffffff", 9, .7); fxPillar(me, me.pos.clone(), "#ffe9a8", 30, .9); for (const m of near(me, me.pos, 9)) { m.stun = Math.max(m.stun || 0, 1.6); const p = mp(m), dx = p.x - me.pos.x, dz = p.z - me.pos.z, l = Math.hypot(dx, dz) || 1; p.x += dx / l * 3; p.z += dz / l * 3; }
  me.slowT = .8; me.shake = .5; sfx(me, "defy"); banner("Death Defiance", "You rise again", 2200, "#ffe9a8"); me.hpDraw && me.hpDraw(); };

// ---------- Dash ----------
const onDash = me => { const P = me.pn; if (me.tnow - (P.dashAt || -9) < .45) return; P.dashAt = me.tnow; aspCall(me, "dash");
  const b = boonIn("D"); if (!b) return; const p = pot(b), d = CAT[b.id].dom, c = DOM[d].c, at = me.pos.clone(), foes = near(me, at, 4.6);
  fxRing(me, at, c, 4.6, .4); fxBurst(me, at.clone().setY(at.y + 1), c, 10); sfx(me, "dash");
  for (const m of foes) { hurt(me, m, power(me) * 1.6 * p, c); strike(me, m, d, power(me) * p, "D"); }
  if (d === "A") P.invT = Math.max(P.invT || 0, me.tnow + .7); if (d === "T") P.hasteT = me.tnow + 2.6; if (d === "Y") heal(me, 3 * p); if (d === "D") heal(me, .8 * foes.length * p); };

// ---------- Cast: a thrown bolt of the god's power (U, or the mouse side button) ----------
const castMax = me => 3 + mir("quiver") + mods(me).castMax;
const cast = me => {
  const P = me.pn, Rn = R(), T = me.T; if (me.hp <= 0 || P.castCd > 0 || me.rollT > 0) return true;
  if (Rn.cast <= 0) { fxText(me, me.pos.clone().setY(me.pos.y + 2.3), "no Cast", "#ff8a8a"); return true; }
  Rn.cast--; P.castCd = .3; const b = boonIn("C"), d = b ? CAT[b.id].dom : null, c = d ? DOM[d].c : "#ff4466";
  const o = new T.Vector3(me.pos.x, me.pos.y + 1.3 + (me.jy || 0), me.pos.z); let X = null; try { X = me.xhit && me.xhit(); } catch (e) {}
  const dir = X && X.distanceTo(o) > 2 ? X.clone().sub(o).normalize() : new T.Vector3(Math.sin(me.face), .03, Math.cos(me.face)).normalize();
  sfx(me, "cast"); me.shake = Math.max(me.shake || 0, .08);
  if (d === "S") { const at = X ? X.clone() : o.clone().addScaledVector(dir, 16); at.y = Math.max(at.y, me.H(at.x, at.z)); fxPillar(me, at, c, 30, .35); fxBolt(me, at.clone().setY(at.y + 28), at, c); later(me, .1, () => castHit(me, at, b)); return true; }
  const n = d === "H" ? 3 : 1, slow = d === "M" ? .45 : 1;
  for (let i = 0; i < n; i++) { const v = dir.clone().applyAxisAngle(new T.Vector3(0, 1, 0), (i - (n - 1) / 2) * .13).multiplyScalar(44 * slow), mesh = fxOrb(me, c, d === "M" ? 1.7 : 1); mesh.position.copy(o); P.shots.push({ o: mesh, v, t: 0, life: 1.25 / slow, b, k: n > 1 ? .6 : 1 }); }
  return true;
};
const castHit = (me, at, b, k = 1) => { const M = mods(me), p = b ? pot(b) : 1, d = b ? CAT[b.id].dom : null, c = d ? DOM[d].c : "#ff4466", r = (b ? 2.8 : 1.7) * (M.castWide ? 1.5 : 1) * (d === "M" ? 1.6 : d === "F" ? 1.4 : 1);
  fxRing(me, at, c, r, .4); fxBurst(me, at.clone().setY(at.y + .5), c, 14); sfx(me, "boom"); me.shake = Math.max(me.shake || 0, .14);
  const dmg = power(me) * (b ? 2.8 * p : 2) * (1 + M.castDmg) * k;
  for (const m of near(me, at, r)) { hurt(me, m, dmg, c, 1); if (d) strike(me, m, d, power(me) * 1.2 * p * k, "C"); } };
const castTick = (me, dt) => { const P = me.pn, Rn = R(), mx = castMax(me); P.castCd = Math.max(0, (P.castCd || 0) - dt);
  if (Rn.cast < mx) { P.castT = (P.castT || 0) + dt; if (P.castT >= 2.6) { P.castT = 0; Rn.cast++; } } else { P.castT = 0; if (Rn.cast > mx) Rn.cast = mx; }
  for (let i = P.shots.length - 1; i >= 0; i--) { const s = P.shots[i], q = s.o.position; s.t += dt; q.addScaledVector(s.v, dt); s.o.rotation.y += dt * 9; let hit = s.t >= s.life || q.y < me.H(q.x, q.z) + .15;
    if (!hit) for (const m of me.mobs) { if (!alive(m)) continue; const c = mp(m); if (Math.hypot(c.x - q.x, c.z - q.z) < rad(m) + .55 && q.y > c.y - .6 && q.y < c.y + m.a[2] * GSC + 1) { hit = 1; break; } }
    if (hit) { me.scene.remove(s.o); P.shots.splice(i, 1); if (s.t < s.life || s.b) castHit(me, q.clone(), s.b, s.k); } } };

// ---------- Call: the god's own hand, paid for with the gauge your blows fill (I) ----------
const call = me => { const P = me.pn, Rn = R(), b = boonIn("G"); if (me.hp <= 0) return true;
  if (!b) { me.say("No god has answered your Call yet. Win a Call boon at a shrine.", 2200); return true; }
  if (Rn.gauge < 25) { me.say(`Call ${Math.floor(Rn.gauge)}% - land blows to fill it (25% a strike)`, 1400); return true; }
  if (P.call) return true; const tier = Math.floor(Rn.gauge / 25), p = pot(b), d = CAT[b.id].dom, g = GOD[b.god], dur = 1.4 + 1.2 * tier; Rn.gauge -= tier * 25;
  P.call = { d, p, t: dur, tick: 0, tier, heal: d === "Y" ? 10 * tier * p / dur : 0 };
  banner(g ? g.n : DOM[d].n, tier >= 4 ? "answers in full wrath" : "answers your Call", 1800, DOM[d].c); sfx(me, "call"); me.shake = .3; fxRing(me, me.pos, DOM[d].c, 12, .8); fxPillar(me, me.pos.clone(), DOM[d].c, 40, .8);
  const foes = near(me, me.pos, 26);
  if (d === "A") P.invT = Math.max(P.invT || 0, me.tnow + dur); if (d === "T") P.hasteT = me.tnow + dur + 3; if (d === "N") P.packT = me.tnow + dur + 4;
  if (d === "K") for (const m of foes) m.stun = Math.max(m.stun || 0, m.pnG ? .8 : 1.8); if (d === "L") for (const m of foes) afflict(me, m, "weak", { t: 9, c: DOM.L.c });
  return true; };
const callTick = (me, dt) => { const P = me.pn, C = P.call;
  if (P.packT > me.tnow) { P.packK = (P.packK || 0) - dt; if (P.packK <= 0) { P.packK = .55; const f = near(me, me.pos, 20), m = f.length && pick(f); if (m) { fxBeast(me, m, DOM.N.c); later(me, .16, () => hurt(me, m, power(me) * 1.3, DOM.N.c)); } } }
  if (!C) return; C.t -= dt; C.tick -= dt; if (C.heal) heal(me, C.heal * dt);
  if (C.tick <= 0) { C.tick = .26; const f = near(me, me.pos, 26); if (f.length) { const m = pick(f), at = mp(m).clone(), c = DOM[C.d].c; fxPillar(me, at, c, 34, .4); sfx(me, "smite");
    later(me, .12, () => { fxRing(me, at, c, 3, .35); me.shake = Math.max(me.shake || 0, .12); for (const o of near(me, at, 3)) { hurt(me, o, power(me) * 2.2 * C.p, c, 1); strike(me, o, C.d, power(me) * 1.3 * C.p, "G"); } }); } }
  if (C.t <= 0) P.call = null; };

// ---------- per frame ----------
const upMod = (me, k) => { const M = mods(me), P = me.pn; switch (k) {
  case "dmg": return 1 + M.dmg;
  case "spd": return (1 + M.spd) * (P.swiftT > me.tnow ? 1.15 : 1) * (P.hasteT > me.tnow ? 1.3 : 1);
  case "dex": return (1 + M.dex) * (P.hasteT > me.tnow ? 1.25 : 1);
  case "hp": return (M.hpmax / 100) / Math.max(.25, 1 - Math.min(.7, M.dr));
  default: return 1; } };
const combatTick = (me, dt) => {
  const P = me.pn, M = mods(me);
  for (let i = P.q.length - 1; i >= 0; i--) { const q = P.q[i]; q.t -= dt; if (q.t <= 0) { P.q.splice(i, 1); try { q.fn(); } catch (e) { warn(e); } } }
  statusTick(me, dt); castTick(me, dt); callTick(me, dt);
  const dashing = (me.atk && me.atk.kind === "dash") || me.rollT > 0; if (dashing && !P.dashing) onDash(me); P.dashing = dashing;
  if (M.regen && me.hp > 0 && me.hp < 100) heal(me, M.regen * dt);
  if (M.shield && (P.shield || 0) < 1) { P.shieldT = (P.shieldT || 0) + dt; if (P.shieldT >= (M.shieldCd || 14)) { P.shieldT = 0; P.shield = 1; fxText(me, me.pos.clone().setY(me.pos.y + 2.2), "shield", DOM.A.c); } }
  if (P.momT <= me.tnow) P.momN = 0;
  P.tgtT = (P.tgtT || 0) - dt; P.hurtFlash = Math.max(0, (P.hurtFlash || 0) - dt);
  if (P.died && me.hp > 0) { P.died = 0; try { endRun(me); } catch (e) { warn(e); } }
};
