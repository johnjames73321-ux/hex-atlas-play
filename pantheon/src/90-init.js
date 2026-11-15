/* Wiring: once per land (window.hxRestore), keys (window.hxKey), one function per frame (me.ps). Every entry point
   is wrapped, so a fault in this layer can never stop the game underneath. */
const tick = (me, dt, t) => { const P = me.pn, rdt = clamp(t - (P.lastT || t), 0, .05); P.lastT = t;
  if (P.ui && P.ui.type !== "codex") me.stopT = Math.max(me.stopT || 0, .12);
  combatTick(me, dt); worldTick(me, dt, t); fxTick(me, rdt, t); hudTick(me, rdt); };
const reoffer = me => { const o = R().owed; if (!o || me.pn.ui) return; if (o.k === "gods") { const gs = o.ids.map(id => GOD[id]).filter(Boolean); if (gs.length) offerBoons(me, gs, o.boost || 0); else delete R().owed; } else if (o.k === "laurel") offerLaurel(me); else if (o.k === "anvil") offerAnvil(me); };
const init = me => {
  if (!me || me.pn || !me.T || !me.scene || !me.mobs || !me.ps) return;
  const P = me.pn = { q: [], fx: [], tx: [], shots: [], W: null, ui: null }; R(); dirty(); const u = ensureUI(); if (u) { u.offer.hidden = u.codex.hidden = u.death.hidden = true; u.pool.forEach(e => e.remove()); u.pool = []; }
  const hit0 = me.onHit, kill0 = me.onKill, par0 = me.parried, up0 = me.up, ld0 = me.lmbDown, lu0 = me.lmbUp, mm0 = me.mmb;
  me.onHit = (m, dmg, crit, heavy) => { try { hit0 && hit0(m, dmg, crit, heavy); } catch (e) { warn(e); } try { onHit(me, m, dmg, crit, heavy); } catch (e) { warn(e); } };
  me.onKill = (m, from, heavy) => { try { kill0 && kill0(m, from, heavy); } catch (e) { warn(e); } try { onKill(me, m); } catch (e) { warn(e); } };
  if (par0) me.parried = m => { par0(m); aspCall(me, "parry"); };
  if (up0) me.up = k => up0(k) * upMod(me, k);
  if (ld0) me.lmbDown = () => { if (P.ui) { P.swallow = 1; uiClick(me); return; } ld0(); };
  if (lu0) me.lmbUp = () => { if (P.swallow) { P.swallow = 0; return; } lu0(); };
  if (mm0) me.mmb = () => { if (!P.ui) mm0(); };
  hookHP(me);
  try { worldInit(me); } catch (e) { warn(e); }
  me.ps.push((dt, t) => { if (cur() !== me) return; try { tick(me, dt, t); } catch (e) { if (!P.err) { P.err = 1; warn(e); } } });
  const W = P.W; if (!W) return;
  if (!st.meta.seen) { st.meta.seen = 1; save(); setTimeout(() => { if (cur() === me && !P.ui) intro(me); }, 1400); }
  else setTimeout(() => { if (cur() === me) banner(W.info.state || W.info.place || "The wilds", `${W.info.pan.name} gods`, 2600, "#ffe9a8"); }, 800);
  if (R().owed) setTimeout(() => { if (cur() === me) reoffer(me); }, 2600);
};
const key = (me, code) => { const P = me && me.pn; if (!P) return false;
  if (P.ui) return uiKey(me, code);
  if (code === "KeyU" || code === "CapsLock") return cast(me);
  if (code === "KeyI") return call(me);
  if (code === "KeyO") { openCodex(me); return true; }
  if (code === "KeyE" && interact(me)) return true;
  return false; };
const restore0 = window.hxRestore;
window.hxRestore = me => { try { restore0 && restore0(me); } finally { try { init(me); } catch (e) { warn(e); } } };
const key0 = window.hxKey;
window.hxKey = (code, me) => { try { if (key(me, code)) return true; } catch (e) { warn(e); } return key0 ? key0(code, me) : false; };
// mouse side buttons: back = Cast, forward = Call (and never let them leave the page while the 3D view is open)
for (const ev of ["mousedown", "mouseup", "auxclick"]) addEventListener(ev, e => { const me = cur(); if (!me || !me.pn || (e.button !== 3 && e.button !== 4)) return; e.preventDefault(); e.stopPropagation(); if (ev === "mousedown" && !me.pn.ui) try { e.button === 3 ? cast(me) : call(me); } catch (x) { warn(x); } }, true);
Object.assign(PN, { init, R, cast, call, offerBoons, offerLaurel, offerAnvil, startTrial, wakeGuard, interact, openCodex, landInfo, banner, endRun, takeBoon, offerFor, closeUI, sigil, godSigil });
