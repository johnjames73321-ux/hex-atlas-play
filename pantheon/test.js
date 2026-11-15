// Smoke test for the pantheon layer, run in the page from the local test server:
//   const s = document.createElement("script"); s.src = "/pantheon/test.js"; document.head.appendChild(s);  then  await PT.smoke()
// It drives the real game (SV.S3.loop) frame by frame, so it also works while the tab is hidden.
window.PT = (() => {
  const PN = () => window.PANTHEON, me = () => SV.S3, sleep = ms => new Promise(r => setTimeout(r, ms));
  const errs = []; const ow = console.warn; console.warn = (...a) => { errs.push(a.map(x => x && x.stack ? x.stack.split("\n").slice(0, 3).join(" | ") : String(x)).join(" ")); ow.apply(console, a); };
  addEventListener("error", e => errs.push("window: " + e.message + " @" + e.lineno));
  const step = (n = 60, ms = 16) => { const m = me(); let t = m.last || performance.now(); for (let k = 0; k < n; k++) { t += ms; m.loop(t); } };
  const boot = async (la, lo) => { const s0 = document.getElementById("hxStart"); if (s0) s0.remove(); SV.at(la, lo); for (let i = 0; i < 40; i++) { await sleep(500); if (me() && me().pn && me().pn.W) break; } step(60); if (me().pn.ui) PN().closeUI(me()); return me().pn.W.info; };
  const go = i => { const m = me(), s = m.pn.W.sh[i]; m.pos.set(s.x - 3, m.H(s.x - 3, s.z), s.z); m.by = m.pos.y; m.yaw = Math.atan2(-(s.x - m.pos.x), -(s.z - m.pos.z)); m.face = m.yaw + Math.PI; m.pitchC = .15; step(8); return s; };
  const killTrial = () => { const m = me(), Tr = m.pn.W.trial; if (!Tr) return 0; let n = 0; for (const x of Tr.ms.slice()) if (!x.dead) { m.hurtMob(x, 999999, m.pos, false); n++; } return n; };
  const clearTrial = i => { const m = me(); go(i); PN().interact(m); step(40); for (let k = 0; k < 6 && m.pn.W.trial; k++) { killTrial(); step(150); } step(220); return m.pn.ui && m.pn.ui.type; };
  const pickCard = n => { const m = me(); if (!m.pn.ui) return null; m.pn.ui.t0 -= 2000; window.hxKey("Digit" + (n + 1), m); step(10); return PN().st.run.boons.length; };
  const dummy = (hp = 60000) => { const m = me(), x = m.spawn("wolf", false, false); x.root.position.set(m.pos.x + 3, m.H(m.pos.x + 3, m.pos.z), m.pos.z); x.hp = x.mx = hp; x.noRe = 1; return x; };
  const give = (id, god = "hellenic:Zeus", rar = 1, lv = 1) => { const Rn = PN().st.run, c = PN().CAT[id]; if (c.slot !== "P") Rn.boons = Rn.boons.filter(b => PN().CAT[b.id].slot !== c.slot); Rn.boons.push({ id, god, rar, lv }); PN().dirty(); };
  const smoke = async (la = 38, lo = 23.7) => { const out = {}; try {
    out.land = await boot(la, lo).then(i => [i.state, i.people, i.pan.name]); const m = me(), P = PN();
    out.sh = m.pn.W.sh.map(s => s.kind + ":" + (s.god ? s.god.n : s.name || s.reward || ""));
    out.t1 = clearTrial(0); out.cards1 = m.pn.ui && m.pn.ui.cfg.cards.map(c => c.title + " [" + c.tag + "]"); out.n1 = pickCard(0);
    out.t2 = clearTrial(1); out.n2 = pickCard(2); out.patron = P.st.run.patron;
    P.st.run.def = 99; const d = dummy();
    for (const k of Object.keys(P.DOM)) { for (let j = 0; j < 6; j++) P.strike(m, d, k, 20, "A"); step(10); }
    for (const id of Object.keys(P.CAT)) give(id, "celtic:Lugus", 2, 2);   // everything at once: every flag on
    m.pn.boonSig = ""; step(20); const M = P.mods(m); out.mods = { hpmax: M.hpmax, dr: +M.dr.toFixed(2), crit: +M.crit.toFixed(2) };
    for (const k of Object.keys(P.DOM)) { for (let j = 0; j < 4; j++) P.strike(m, d, k, 20, "S"); step(10); }
    for (const k of Object.keys(P.DOM)) { give(k + ":C"); give(k + ":D"); give(k + ":G"); P.st.run.cast = 3; P.st.run.gauge = 100; m.pn.castCd = 0; m.face = Math.atan2(d.root.position.x - m.pos.x, d.root.position.z - m.pos.z); P.cast(m); m.pn.dashAt = -9; m.pn.dashing = false; m.rollDir = [0, 0]; m.rollT = .1; step(4); m.rollT = 0; P.call(m); step(120); m.hp = 100; }
    m.atk = { kind: "s0", hit: new Set() }; for (let j = 0; j < 12; j++) m.hurtMob(d, 12, m.pos, false); m.atk = { kind: "spin", hit: new Set() }; for (let j = 0; j < 6; j++) m.hurtMob(d, 12, m.pos, true); m.atk = null; step(120);
    out.dummy = Math.round(d.hp); d.dead = .01; step(5);
    m.hp = 100; m.hp -= 30; step(5); out.hurt = Math.round(m.hp);
    if (m.pn.ui) { out.uiBeforeCodex = m.pn.ui.type; P.closeUI(m); } P.openCodex(m, 0); for (const t of [1, 2, 3]) { window.hxKey("Digit" + (t + 1), m); } out.codex = document.getElementById("pnCodex").textContent.length; window.hxKey("KeyO", m);
    if (m.pn.ui) { out.uiLeft = m.pn.ui.type; P.closeUI(m); } P.st.run.boons = []; P.dirty(); m.hp = 100; P.st.run.def = 99;
    const W = m.pn.W, gi = W.sh.findIndex(s => s.kind === "guard"); go(gi); out.gPrompt = document.getElementById("pnPrompt").textContent; P.interact(m); step(400); out.guard = W.G && { hp: Math.round(W.G.m.hp), n: W.G.n, tele: W.tele.length, orbs: W.orbs.length };
    if (W.G) { m.hurtMob(W.G.m, 9999999, m.pos, false); step(420); } out.afterGuard = m.pn.ui && m.pn.ui.type; pickCard(1); out.doors = W.sh.filter(s => s.kind === "door").map(s => s.to.state + "/" + s.to.pan.name);
    const wi = W.sh.findIndex(s => s.kind === "well"); go(wi); m.prog.coins = 1000; P.interact(m); out.well = m.pn.ui && m.pn.ui.cfg.cards.map(c => c.title + " " + c.tag); pickCard(0); pickCard(1); pickCard(2); window.hxKey("KeyE", m); out.wellClosed = !m.pn.ui;
    m.pn.invT = 0; P.st.run.def = 0; m.hp -= 5000; m.hp = 100; step(8); out.death = m.pn.ui && m.pn.ui.type; P.closeUI(m);
    out.meta = { shards: P.st.meta.shards, ichor: P.st.meta.ichor, runs: P.st.meta.runs, codex: Object.keys(P.st.meta.codex).length };
  } catch (e) { out.ex = e.stack.split("\n").slice(0, 4).join(" | "); }
    out.err = me() && me().pn && me().pn.err; out.errs = errs.slice(0, 10); return out; };
  return { step, boot, go, killTrial, clearTrial, pickCard, dummy, give, smoke, errs };
})();
