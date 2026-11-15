/* HUD and screens. All of it is plain DOM over the 3D view; offers are chosen with 1 2 3 (or the mouse),
   so the mouse stays captured and the fight is never left. */
const CSS = `
#pnHud,#pnTop,#pnCur,#pnBan,#pnPrompt,#pnVig{position:absolute;pointer-events:none;font-family:system-ui,sans-serif;color:#f4f1ea;text-shadow:0 1px 2px #000,0 0 5px rgba(0,0,0,.7)}
#sv .pnSerif,#pnBan b,#pnOffer h2,#pnOffer .c h3,#pnCodex h2,#pnDeath h2{font-family:"Palatino Linotype","Book Antiqua",Palatino,Georgia,serif;font-weight:400;letter-spacing:.06em}
#pnHud{left:14px;top:12px;z-index:31;display:grid;gap:6px;width:min(330px,46vw)}
#pnHp{position:relative;height:20px;border-radius:4px;background:rgba(10,6,8,.72);border:1px solid rgba(255,255,255,.28);overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.45)}
#pnHp b{position:absolute;left:0;top:0;bottom:0;background:#fff;opacity:.55;transition:width .6s ease-out .15s}
#pnHp i{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(180deg,#ff5a4f,#c2161c 60%,#8d0f18);transition:width .08s linear}
#pnHp span{position:absolute;inset:0;display:grid;place-items:center;font:700 12px system-ui;letter-spacing:.04em}
#pnHp.low i{animation:pnPulse .7s infinite alternate}@keyframes pnPulse{to{filter:brightness(1.6)}}
.pnRow{display:flex;align-items:center;gap:9px;font:700 12px system-ui;min-height:16px}
#pnDef{color:#ffe9a8;font-size:15px;letter-spacing:2px}#pnCast{color:#ff4466;font-size:13px;letter-spacing:2px}#pnShield{color:#e9dfae;font-size:13px}
#pnGauge{position:relative;flex:1;height:8px;border-radius:4px;background:rgba(0,0,0,.6);overflow:hidden;border:1px solid rgba(255,255,255,.2)}
#pnGauge i{position:absolute;left:0;top:0;bottom:0;background:#ffe9a8;transition:width .15s}#pnGauge u{position:absolute;top:0;bottom:0;width:1px;background:rgba(0,0,0,.8)}
#pnGauge.full{box-shadow:0 0 10px currentColor}#pnGod{font:600 11px system-ui;opacity:.92;white-space:nowrap;max-width:150px;overflow:hidden;text-overflow:ellipsis}
#pnBoons{display:flex;gap:5px;align-items:center;flex-wrap:wrap}
#pnBoons .b{position:relative;width:38px;height:38px;border-radius:50%;border:1.5px solid rgba(255,255,255,.25);background:rgba(8,10,20,.6) center/112% no-repeat;display:grid;place-items:center;font:700 10px system-ui;color:rgba(255,255,255,.45);text-shadow:none}
#pnBoons .b em{position:absolute;right:-3px;bottom:-3px;font:800 9px system-ui;font-style:normal;background:#0b0d18;border-radius:6px;padding:0 3px;color:#ffd27a;border:1px solid rgba(255,255,255,.25)}
#pnBoons .b kbd{position:absolute;left:50%;top:-7px;transform:translateX(-50%);font:700 8px system-ui;background:rgba(0,0,0,.7);border-radius:4px;padding:0 3px;color:#fff;white-space:nowrap}
#pnBoons .p{width:26px;height:26px}#pnBoons .more{font:700 11px system-ui;opacity:.8}
#pnTop{left:50%;top:10px;transform:translateX(-50%);z-index:31;display:grid;justify-items:center;gap:6px}
#pnCmp{position:relative;width:min(440px,56vw);height:24px;overflow:hidden;border-top:1px solid rgba(255,255,255,.35);border-bottom:1px solid rgba(255,255,255,.35);background:linear-gradient(90deg,transparent,rgba(0,0,0,.36) 18%,rgba(0,0,0,.36) 82%,transparent)}
#pnCmp i{position:absolute;top:0;left:0;height:24px;display:grid;place-items:center;font:700 11px system-ui;font-style:normal;white-space:nowrap;will-change:transform}
#pnCmp i.c{opacity:.55;font-size:10px}#pnCmp i.s{font-size:15px;text-shadow:0 0 6px currentColor,0 1px 2px #000}#pnCmp i.s small{font:700 8px system-ui;margin-left:2px;color:#fff;text-shadow:0 1px 2px #000}
#pnBoss{display:grid;justify-items:center;gap:3px}#pnBoss[hidden]{display:none}#pnBoss span{font:400 19px "Palatino Linotype",Georgia,serif;letter-spacing:.1em}
#pnBoss b{display:block;width:min(460px,60vw);height:10px;border-radius:5px;background:rgba(0,0,0,.6);overflow:hidden;border:1px solid rgba(255,255,255,.3)}#pnBoss b i{display:block;height:100%;background:linear-gradient(90deg,#ff7a3a,#d8261c);transition:width .1s}
#pnBoss em{font:600 11px system-ui;font-style:normal;letter-spacing:.2em;text-transform:uppercase;opacity:.85}
#pnCur{right:14px;top:12px;z-index:31;text-align:right;font:700 12px system-ui;line-height:1.55}#pnCur b{font:400 17px "Palatino Linotype",Georgia,serif;letter-spacing:.12em;display:block}#pnCur span{margin-left:10px}
#pnBan{left:50%;top:17%;transform:translateX(-50%);z-index:32;text-align:center;opacity:0;transition:opacity .45s;width:max-content;max-width:92vw}
#pnBan.on{opacity:1}#pnBan small{display:block;font:700 12px system-ui;letter-spacing:.36em;text-transform:uppercase}
#pnBan b{display:block;font-size:clamp(26px,4.6vw,48px);text-transform:uppercase}#pnBan b::after{content:"";display:block;margin:6px auto 0;width:min(340px,60vw);height:1px;background:linear-gradient(90deg,transparent,currentColor,transparent)}
#pnPrompt{left:50%;bottom:calc(210px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:31;font:600 14px system-ui;background:rgba(8,10,20,.78);border:1px solid rgba(255,255,255,.3);border-radius:9px;padding:7px 14px;white-space:nowrap}
#pnPrompt[hidden]{display:none}
#pnVig{inset:0;z-index:29;background:radial-gradient(ellipse at center,transparent 52%,rgba(160,0,10,.55));opacity:0;transition:opacity .25s}
#sv .pnLab{position:absolute;left:0;top:0;z-index:28;pointer-events:none;text-align:center;font:400 14px "Palatino Linotype",Georgia,serif;letter-spacing:.14em;text-transform:uppercase;white-space:nowrap;text-shadow:0 1px 2px #000,0 0 8px #000;will-change:transform}#sv .pnLab small{display:block;font:700 9px system-ui;letter-spacing:.2em;color:#fff;opacity:.85}
#sv .pnTx{position:absolute;left:0;top:0;z-index:30;pointer-events:none;font:800 14px system-ui;letter-spacing:.08em;text-shadow:0 1px 2px #000,0 0 6px #000;white-space:nowrap}
#pnOffer,#pnDeath{position:absolute;inset:0;z-index:62;display:grid;place-items:center;align-content:center;gap:14px;background:radial-gradient(ellipse at center,rgba(6,7,16,.72),rgba(3,3,8,.93));color:#eef0ff;font-family:system-ui,sans-serif;padding:14px;box-sizing:border-box;overflow:auto;animation:pnFade .25s}
#pnOffer[hidden],#pnDeath[hidden],#pnCodex[hidden]{display:none}@keyframes pnFade{from{opacity:0}}
#pnOffer .h{display:grid;justify-items:center;gap:2px;text-align:center}#pnOffer .h img{width:112px;height:112px;filter:drop-shadow(0 0 16px var(--c))}
#pnOffer .h img{animation:pnGlow 2.2s ease-in-out infinite alternate}@keyframes pnGlow{from{transform:scale(1)}to{transform:scale(1.07);filter:drop-shadow(0 0 30px var(--c))}}
#pnOffer .h small{font:700 11px system-ui;letter-spacing:.34em;text-transform:uppercase;color:var(--c)}#pnOffer h2{margin:0;font-size:clamp(28px,4.6vw,46px);text-transform:uppercase;color:#fff;text-shadow:0 0 22px var(--c)}
#pnOffer .h p{margin:2px 0 0;font:13px system-ui;opacity:.75}#pnOffer .h q{font:italic 15px "Palatino Linotype",Georgia,serif;opacity:.9;margin-top:4px;max-width:560px}
#pnOffer .cs{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;max-width:100%}
#pnOffer .c{position:relative;width:min(262px,29vw);min-width:190px;min-height:214px;box-sizing:border-box;text-align:left;color:inherit;background:linear-gradient(180deg,rgba(28,32,58,.96),rgba(13,15,30,.97));border:1px solid rgba(255,255,255,.16);border-top:3px solid var(--r);border-radius:12px;padding:13px 15px 15px;cursor:pointer;display:grid;gap:6px;align-content:start;font:13px/1.45 system-ui;overflow:hidden;animation:pnUp .38s cubic-bezier(.2,.9,.3,1.2) backwards;transition:transform .12s,box-shadow .12s,border-color .12s}
#pnOffer .c:nth-child(2){animation-delay:.07s}#pnOffer .c:nth-child(3){animation-delay:.14s}@keyframes pnUp{from{opacity:0;transform:translateY(34px)}}
#pnOffer .c.sel{transform:translateY(-6px) scale(1.035);border-color:var(--d);box-shadow:0 0 0 1px var(--d),0 14px 40px rgba(0,0,0,.6),0 0 34px -8px var(--d)}
#pnOffer .c.off{opacity:.45}#pnOffer .c img{position:absolute;right:-22px;top:-18px;width:120px;height:120px;opacity:.5;pointer-events:none}
#pnOffer .c kbd{font:800 11px system-ui;width:21px;height:21px;display:grid;place-items:center;border-radius:6px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.25)}
#pnOffer .c h3{margin:2px 0 0;font-size:21px;color:#fff;position:relative;max-width:78%}#pnOffer .c i{font:700 10px system-ui;font-style:normal;letter-spacing:.14em;text-transform:uppercase;color:var(--r);position:relative}
#pnOffer .c p{margin:2px 0 0;opacity:.93;position:relative}#pnOffer .c em{font:600 11px system-ui;font-style:normal;color:#ffb0a0;position:relative}#pnOffer .c u{text-decoration:none;font:600 11px system-ui;color:var(--d);position:relative}
#pnOffer .f{font:600 12px system-ui;opacity:.8;text-align:center}#pnOffer .f kbd,#pnCodex kbd,#pnDeath kbd{font:700 11px system-ui;padding:1px 6px;border-radius:5px;background:rgba(255,255,255,.14);margin:0 2px}
#pnCodex{position:absolute;z-index:63;left:50%;top:50%;transform:translate(-50%,-50%);width:min(920px,96vw);max-height:90vh;overflow:auto;box-sizing:border-box;background:rgba(10,12,24,.97);border:1px solid #6a5a2a;border-radius:14px;padding:14px 18px 16px;color:#e8ecff;font:13px/1.45 system-ui;box-shadow:0 20px 60px rgba(0,0,0,.65)}
#pnCodex h2{margin:0;font-size:24px;color:#ffd27a}#pnCodex .tabs{display:flex;gap:6px;margin:8px 0 12px;flex-wrap:wrap;align-items:center}
#pnCodex button{background:#1a1f3c;color:inherit;border:1px solid #3d477c;border-radius:8px;padding:6px 11px;cursor:pointer;font:600 12px system-ui;text-align:left}#pnCodex button:hover{border-color:#ffd27a}
#pnCodex button.on{border-color:#ffd27a;color:#ffd27a;background:#262446}#pnCodex button.cur{box-shadow:0 0 0 2px #ffd27a}#pnCodex button:disabled{opacity:.45;cursor:default}
#pnCodex .g{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:8px}#pnCodex .row{display:flex;gap:10px;align-items:center;background:#141830;border:1px solid #2a3158;border-radius:10px;padding:8px 10px}
#pnCodex .row img{width:46px;height:46px;flex:none}#pnCodex .row b{display:block;color:#fff}#pnCodex .row span{display:block;opacity:.8;font-size:12px}#pnCodex .row i{font:700 10px system-ui;font-style:normal;letter-spacing:.1em;text-transform:uppercase}
#pnCodex h4{margin:14px 0 6px;font:700 11px system-ui;letter-spacing:.2em;text-transform:uppercase;color:#f0a24a}#pnCodex .cur2{float:right;font:700 13px system-ui;color:#ffd27a}
#pnCodex .asp{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}#pnCodex .asp button{min-height:96px;display:grid;gap:3px;align-content:start}#pnCodex .asp button span{opacity:.8;font-size:11px;font-weight:400}#pnCodex .asp button i{font-style:normal;color:#ffd27a;font-size:11px}
#pnCodex .gods{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:5px}#pnCodex .gd{display:flex;gap:6px;align-items:center;font-size:11.5px;line-height:1.2;background:#12162c;border-radius:8px;padding:4px 6px;border:1px solid #232a4e}
#pnCodex .gd img{width:30px;height:30px;flex:none}#pnCodex .gd.no{opacity:.5}#pnCodex .gd b{display:block;color:#fff;font-size:12px}#pnCodex .gd span{opacity:.75}
#pnDeath h2{margin:0;font-size:clamp(30px,5.4vw,58px);text-transform:uppercase;color:#ff5a4a;text-shadow:0 0 30px rgba(255,60,40,.6);text-align:center}#pnDeath small{font:700 12px system-ui;letter-spacing:.36em;text-transform:uppercase;opacity:.8}
#pnDeath .st{display:grid;grid-template-columns:repeat(3,minmax(110px,1fr));gap:10px;text-align:center}#pnDeath .st div{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:10px;padding:10px 12px}#pnDeath .st b{display:block;font:400 26px "Palatino Linotype",Georgia,serif;color:#ffd27a}#pnDeath .st span{font:600 11px system-ui;letter-spacing:.14em;text-transform:uppercase;opacity:.75}
#pnDeath p{max-width:560px;text-align:center;opacity:.85;margin:0;line-height:1.5}
@media (max-width:760px){#pnOffer .c{width:92vw;min-height:0}#pnOffer .h img{width:64px;height:64px}#pnCodex .asp{grid-template-columns:repeat(2,1fr)}#pnCur{top:64px}}`;
let ui = null;
const ensureUI = () => { const sv = $("sv"); if (!sv) return null; if (ui && ui.hud.isConnected) return ui;
  if (!$("pnCss")) { const c = document.createElement("style"); c.id = "pnCss"; c.textContent = CSS; document.head.appendChild(c); }
  const mk = (id, html) => { let e = $(id); if (e) e.remove(); e = document.createElement("div"); e.id = id; if (html) e.innerHTML = html; sv.appendChild(e); return e; };
  ui = { hud: mk("pnHud", `<div id="pnHp"><b></b><i></i><span></span></div><div class="pnRow"><span id="pnDef"></span><span id="pnCast"></span><span id="pnShield"></span><span id="pnArt" style="margin-left:auto;font:700 11px system-ui;letter-spacing:.04em"></span></div><div class="pnRow"><div id="pnGauge"><i></i><u style="left:25%"></u><u style="left:50%"></u><u style="left:75%"></u></div><span id="pnGod"></span></div><div id="pnBoons"></div>`),
    top: mk("pnTop", `<div id="pnCmp"></div><div id="pnBoss" hidden><span></span><b><i></i></b><em></em></div>`), cur: mk("pnCur"), ban: mk("pnBan", "<small></small><b></b>"), prompt: mk("pnPrompt"), vig: mk("pnVig"), offer: mk("pnOffer"), codex: mk("pnCodex"), death: mk("pnDeath"), pool: [], labs: [] };
  sv.querySelectorAll(".pnLab").forEach(e => e.remove());
  ui.prompt.hidden = ui.offer.hidden = ui.codex.hidden = ui.death.hidden = true;
  for (const e of [ui.offer, ui.codex, ui.death]) e.addEventListener("pointerdown", ev => ev.stopPropagation());
  ui.offer.addEventListener("click", ev => { const me = cur(); if (!me) return; const c = ev.target.closest("[data-i]"); if (c) offerPick(me, +c.dataset.i, true); });
  ui.offer.addEventListener("mousemove", ev => { const me = cur(), U = me && me.pn && me.pn.ui, c = ev.target.closest("[data-i]"); if (U && U.type === "offer" && c && +c.dataset.i !== U.sel && !document.pointerLockElement) offerSel(me, +c.dataset.i); });
  ui.death.addEventListener("click", () => { const me = cur(); if (me) closeUI(me); });
  ui.codex.addEventListener("click", ev => { const me = cur(); if (!me) return; const b = ev.target.closest("button"); if (b) codexClick(me, b, ev.shiftKey || undefined); });
  const cmp = $("pnCmp"); ui.card = []; for (let a = 0; a < 360; a += 45) { const e = document.createElement("i"); e.className = "c"; e.textContent = { 0: "N", 90: "E", 180: "S", 270: "W" }[a] || "·"; cmp.appendChild(e); ui.card.push([a * Math.PI / 180, e]); }
  const help = sv.querySelector(".help"); if (help && !/U cast/.test(help.textContent)) help.textContent += " · U cast · I call · R arm art · O gods and arms";
  return ui; };
const banQ = []; let banBusy = 0;
const banner = (small, big, ms = 2600, color = "#ffe9a8") => { banQ.push([small, big, ms, color]); if (banQ.length > 4) banQ.splice(0, banQ.length - 4); if (!banBusy) banNext(); };
const banNext = () => { const b = banQ.shift(), u = ensureUI(); if (!b || !u) { banBusy = 0; return; } banBusy = 1; u.ban.firstChild.textContent = b[0]; u.ban.lastChild.textContent = b[1]; u.ban.firstChild.style.color = b[3]; u.ban.lastChild.style.color = "#fff"; u.ban.lastChild.style.textShadow = `0 2px 4px #000,0 0 26px ${b[3]}`; u.ban.classList.add("on"); setTimeout(() => { u.ban.classList.remove("on"); setTimeout(banNext, 420); }, b[2]); };
const roman = n => { if (!n) return "0"; const R2 = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]]; let s = ""; for (const [v, r] of R2) while (n >= v) { s += r; n -= v; } return s; };
const wrapA = a => Math.atan2(Math.sin(a), Math.cos(a));

// ---------- HUD, every frame (text ten times a second) ----------
const hudTick = (me, dt) => { const u = ensureUI(), P = me.pn, W = P.W; if (!u) return; const Rn = R(), M = mods(me), mx = M.hpmax, hp = hpNow(me), pct = clamp(me.hp, 0, 100);
  const hpEl = $("pnHp"); hpEl.children[1].style.width = hpEl.children[0].style.width = pct + "%"; hpEl.classList.toggle("low", pct < 30 && pct > 0); u.vig.style.opacity = P.hurtFlash > 0 ? .9 : pct < 30 && pct > 0 ? .55 : 0;
  // compass: shrines of the land by bearing
  const cf = me.yaw + Math.PI, wC = $("pnCmp").clientWidth || 440, K = wC / 2.6; let n = 0;
  for (const [a, e] of u.card) { const rel = wrapA(a - cf); e.style.transform = `translateX(${(wC / 2 - rel * K - 6).toFixed(0)}px)`; e.style.opacity = Math.abs(rel) < 1.3 ? .55 : 0; }
  if (W) for (const s of W.sh) { if (s.state === "done" && s.kind !== "door") continue; let e = u.pool[n]; if (!e) { e = document.createElement("i"); e.className = "s"; $("pnCmp").appendChild(e); u.pool[n] = e; } n++;
    const dx = s.x - me.pos.x, dz = s.z - me.pos.z, d = Math.hypot(dx, dz), rel = clamp(wrapA(Math.atan2(dx, dz) - cf), -1.25, 1.25), key = s.kind + s.i + Math.round(d / 5);
    if (e.k !== key) { e.k = key; e.innerHTML = `${{ god: "✦", cache: "❖", well: "◉", guard: "☠", door: "⛩", rift: "✺" }[s.kind]}<small>${Math.round(d)}</small>`; e.style.color = colOf(s); } e.style.display = ""; e.style.transform = `translateX(${(wC / 2 - rel * K - 12).toFixed(0)}px)`; }
  for (let i = n; i < u.pool.length; i++) u.pool[i].style.display = "none";
  // names over the shrines in view
  let ln = 0; const pv = PRJ.v || (PRJ.v = new me.T.Vector3()), sv = $("sv"); if (W && !P.ui) for (const s of W.sh) { if (s.state === "done" && s.kind !== "door") continue; const d = Math.hypot(s.x - me.pos.x, s.z - me.pos.z); if (d > 95 || d < 5) continue; pv.set(s.x, s.y + (s.kind === "door" ? 5.6 : 5.2), s.z).project(me.cam); if (pv.z > 1 || Math.abs(pv.x) > 1.05 || Math.abs(pv.y) > 1.05) continue;
    let e = u.labs[ln]; if (!e) { e = document.createElement("div"); e.className = "pnLab"; sv.appendChild(e); u.labs[ln] = e; } ln++; if (e.k !== s) { e.k = s; e.innerHTML = s.kind === "god" ? `${esc(s.god.n)}<small>${esc(domOf(s.god).n)}${s.patron ? " · your patron" : ""}</small>` : s.kind === "door" ? `${esc(s.to.state || s.to.place || "The wilds")}<small>${esc(s.to.pan.name)} gods</small>` : `${esc(label(s))}<small>${KINDS[s.kind]}</small>`; e.style.color = colOf(s); }
    e.style.display = ""; e.style.opacity = d > 70 ? ((95 - d) / 25).toFixed(2) : 1; e.style.transform = `translate(${((pv.x * .5 + .5) * innerWidth).toFixed(0)}px,${((-pv.y * .5 + .5) * innerHeight).toFixed(0)}px) translate(-50%,-50%)`; }
  for (let i = ln; i < u.labs.length; i++) u.labs[i].style.display = "none";
  if ((P.hudT = (P.hudT || 0) + dt) < .1 && !P.hudNow) return; P.hudT = 0; P.hudNow = 0;
  hpEl.lastChild.textContent = `${Math.ceil(hp)} / ${Math.round(mx)}`;
  artHud(me); $("pnDef").textContent = "☥".repeat(Math.max(0, Rn.def)); $("pnCast").textContent = "◆".repeat(Math.max(0, Rn.cast)) + "◇".repeat(Math.max(0, castMax(me) - Rn.cast)); $("pnShield").textContent = P.shield > 0 ? "⛨".repeat(P.shield) : "";
  const cb = boonIn("G"), gc = cb ? DOM[CAT[cb.id].dom].c : "#8a8fa8", gEl = $("pnGauge"); gEl.firstChild.style.width = Rn.gauge + "%"; gEl.firstChild.style.background = gc; gEl.style.color = gc; gEl.classList.toggle("full", Rn.gauge >= 100);
  $("pnGod").textContent = cb ? `I · ${GOD[cb.god] ? GOD[cb.god].n : "Call"}` : "no Call"; $("pnGod").style.color = gc;
  const sig = Rn.boons.map(b => b.id + b.lv + b.rar).join(",") + "|" + Rn.forge.length;
  if (P.boonSig !== sig) { P.boonSig = sig; glow(me); const slots = ["A", "S", "C", "D", "G"].map(sl => { const b = boonIn(sl); return b ? `<div class="b" title="${esc(boonName(b))}" style="background-image:url(${sigilURL(GOD[b.god] || GODS[0])});border-color:${RAR[b.rar].c}"><kbd>${sl === "A" ? "LMB" : sl === "S" ? "R" : sl === "C" ? "U" : sl === "D" ? "⇧⇧" : "I"}</kbd>${b.lv > 1 ? `<em>${b.lv}</em>` : ""}</div>` : `<div class="b">${SLOT[sl].slice(0, 3)}</div>`; }).join("");
    const ps = Rn.boons.filter(b => CAT[b.id].slot === "P"); $("pnBoons").innerHTML = slots + ps.slice(0, 7).map(b => `<div class="b p" title="${esc(boonName(b))}" style="background-image:url(${sigilURL(GOD[b.god] || GODS[0])});border-color:${RAR[b.rar].c}">${b.lv > 1 ? `<em>${b.lv}</em>` : ""}</div>`).join("") + (ps.length > 7 ? `<span class="more">+${ps.length - 7}</span>` : "") + (Rn.forge.length ? `<span class="more">⚒${Rn.forge.length}</span>` : ""); }
  u.cur.innerHTML = `<b>Depth ${roman(Rn.depth)}</b><span title="Shards">◈ ${st.meta.shards}</span><span title="Ichor">✦ ${st.meta.ichor}</span>${Rn.rr > 0 ? `<span title="Rerolls">⟳ ${Rn.rr}</span>` : ""}`;
  const boss = $("pnBoss"), Tr = W && W.trial, G = W && W.G, tm = G ? G.m : P.tgtT > 0 && P.tgt && !P.tgt.dead && (P.tgt.champ || P.tgt.boss) ? P.tgt : null;
  if (Tr || tm) { boss.hidden = false; const m = tm || null; boss.firstChild.textContent = m ? m.a[9] : Tr.s.kind === "god" ? `Trial of ${Tr.s.god.n}` : label(Tr.s); boss.children[1].style.visibility = m ? "visible" : "hidden"; if (m) boss.children[1].firstChild.style.width = clamp(100 * m.hp / m.mx, 0, 100).toFixed(1) + "%";
    boss.lastChild.textContent = Tr && !Tr.boss ? `wave ${Tr.wave} of ${Tr.waves} · ${Tr.left || 0} left` : G ? "Guardian" : ""; } else boss.hidden = true;
  const s = W && !P.ui ? nearest(me) : null, pr = s ? prompt(me, s) : null; u.prompt.hidden = !pr; if (pr) { u.prompt.textContent = pr; u.prompt.style.borderColor = colOf(s); }
};

// ---------- offers ----------
const offer = (me, cfg) => { const P = me.pn, keep = P.ui && P.ui.type === "offer" && cfg.shop ? P.ui.sel : Math.min(1, cfg.cards.length - 1); P.ui = { type: "offer", cfg, sel: keep, t0: performance.now(), mx: 0 }; drawOffer(me); sfx(me, "open"); };
const drawOffer = me => { const u = ensureUI(), U = me.pn.ui, c = U.cfg; u.offer.hidden = false; u.offer.style.setProperty("--c", c.color || "#ffe9a8");
  u.offer.innerHTML = `<div class="h">${c.god ? `<img src="${sigilURL(c.god)}" alt="">` : ""}<small>${esc(c.kicker || "")}</small><h2>${esc(c.title)}</h2>${c.sub ? `<p>${esc(c.sub)}</p>` : ""}${c.line ? `<q>${esc(c.line)}</q>` : ""}</div><div class="cs">${c.cards.map((k, i) => `<div class="c${i === U.sel ? " sel" : ""}${k.off ? " off" : ""}" data-i="${i}" style="--r:${k.rc || k.color};--d:${k.color}">${k.img || k.god ? `<img src="${k.img || sigilURL(k.god)}" alt="">` : ""}<kbd>${i + 1}</kbd><h3>${esc(k.title)}</h3><i>${esc(k.tag || "")}</i><p>${esc(k.text)}</p>${k.god ? `<u>${esc(k.god.n)} · ${esc(k.god.e)}</u>` : ""}${k.note ? `<em>${esc(k.note)}</em>` : ""}</div>`).join("")}</div><div class="f"><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd> choose · <kbd>←</kbd><kbd>→</kbd> then <kbd>Enter</kbd> or click${c.rerolls > 0 ? ` · <kbd>R</kbd> reroll (${c.rerolls})` : ""}${c.shop ? " · <kbd>E</kbd> leave" : ""}</div>`; };
const offerSel = (me, i) => { const U = me.pn.ui, n = U.cfg.cards.length; U.sel = (i + n) % n; const cs = ui.offer.querySelectorAll(".c"); cs.forEach((e, k) => e.classList.toggle("sel", k === U.sel)); sfx(me, "pick"); };
const offerPick = (me, i, clicked) => { const U = me.pn.ui; if (!U || U.type !== "offer" || performance.now() - U.t0 < 420) return; const c = U.cfg.cards[i]; if (!c) return; if (U.sel !== i) U.sel = i; const r = U.cfg.onPick(i); if (r === false) return; delete R().owed; save(); closeUI(me); };
const closeUI = me => { const P = me.pn, U = P.ui; P.ui = null; if (ui) { ui.offer.hidden = ui.codex.hidden = ui.death.hidden = true; } me.stopT = 0; P.hudNow = 1; P.boonSig = ""; if (U && U.type === "codex") me.unlocking = false; };
const uiKey = (me, code) => { const P = me.pn, U = P.ui; if (!U) return false;
  if (U.type === "offer") { const n = { Digit1: 0, Digit2: 1, Digit3: 2, Numpad1: 0, Numpad2: 1, Numpad3: 2 }[code];
    if (n != null) offerPick(me, n); else if (code === "ArrowLeft" || code === "KeyA") offerSel(me, U.sel - 1); else if (code === "ArrowRight" || code === "KeyD") offerSel(me, U.sel + 1); else if (code === "Enter" || code === "Space") offerPick(me, U.sel);
    else if (code === "KeyR" && U.cfg.rerolls > 0 && U.cfg.onReroll) { sfx(me, "coin"); U.cfg.onReroll(); } else if (U.cfg.shop && (code === "KeyE" || code === "Escape")) closeUI(me);
    return code !== "Escape" || !!U.cfg.shop; }
  if (U.type === "death" || U.type === "intro") { if ((code === "Enter" || code === "Space" || code === "KeyE") && performance.now() - U.t0 > 700) closeUI(me); return code !== "Escape"; }
  if (U.type === "codex") return codexKey(me, code);
  return false; };
const uiClick = me => { const U = me.pn.ui; if (!U) return; if (U.type === "offer") offerPick(me, U.sel); else if ((U.type === "death" || U.type === "intro") && performance.now() - U.t0 > 700) closeUI(me); };
document.addEventListener("mousemove", e => { const me = cur(), U = me && me.pn && me.pn.ui; if (!U || U.type !== "offer" || !document.pointerLockElement) return; U.mx += e.movementX; if (Math.abs(U.mx) > 120) { offerSel(me, U.sel + Math.sign(U.mx)); U.mx = 0; } });

// ---------- death and the first welcome ----------
const deathScreen = (me, s) => { const u = ensureUI(), top = s.top && GOD[s.top[0]]; me.pn.ui = { type: "death", t0: performance.now() }; u.death.hidden = false; const mm = Math.floor(s.t / 60), ss = String(s.t % 60).padStart(2, "0");
  u.death.innerHTML = `<small>The run is over</small><h2>The gods recall their gifts</h2><div class="st"><div><b>${roman(s.depth)}</b><span>depth reached</span></div><div><b>${s.kills}</b><span>foes slain</span></div><div><b>${s.lands}</b><span>lands crossed</span></div><div><b>${s.guardians}</b><span>guardians felled</span></div><div><b>◈ ${s.shards}</b><span>shards kept</span></div><div><b>${mm}:${ss}</b><span>time</span></div></div>
<p>${top ? `${esc(top.n)}, ${esc(top.e)}, favoured you most. ` : ""}Your boons are gone, but shards and Ichor stay with you: spend them on the Tablet of Destinies and the Aspects of your arms (<kbd>O</kbd>). Best depth so far: ${roman(s.best)}.</p><div class="f"><kbd>Enter</kbd> rise again</div>`; };
const intro = me => { const u = ensureUI(), W = me.pn.W, g = W.sh[0].god; me.pn.ui = { type: "intro", t0: performance.now() }; u.death.hidden = false;
  u.death.innerHTML = `<small>320 BC · ${esc(W.info.state || W.info.place || "the wilds")}</small><h2 style="color:#ffe9a8;text-shadow:0 0 30px rgba(255,220,120,.5)">The gods are watching</h2><img src="${sigilURL(g)}" alt="" style="width:120px;height:120px;filter:drop-shadow(0 0 18px ${domOf(g).c})">
<p>Every land answers to its own gods: ${GODS.length.toLocaleString()} of them, from ${PANS.length} peoples. Pillars of light mark their <b>shrines</b>. Stand at one and press <kbd>E</kbd> to accept a trial; win, and choose a <b>boon</b> that changes your Attack, Special, Cast, Dash or Call.</p>
<p><kbd>U</kbd> Cast · <kbd>I</kbd> Call your god · <kbd>R</kbd> your arm's art · <kbd>O</kbd> boons, arms and the Tablet · clear two shrines to wake the land's <b>guardian</b>, and its fall opens passages onward.</p><p>Fall, and the gods take their gifts back. What you earn for ever: shards and Ichor.</p><div class="f"><kbd>Enter</kbd> begin</div>`; };

// ---------- the codex (O): boons, arms, tablet, gods ----------
const TABS = ["Boons", "Arms", "Tablet", "Gods"];
const openCodex = (me, tab) => { const P = me.pn; if (P.ui && P.ui.type !== "codex") return; if (P.ui) { closeUI(me); sfx(me, "pick"); return; } P.ui = { type: "codex", tab: tab || 0, pan: PANS.indexOf(P.W.info.pan), t0: performance.now() }; me.unlocking = true; try { document.exitPointerLock(); } catch (e) {} drawCodex(me); sfx(me, "open"); };
const drawCodex = me => { const u = ensureUI(), U = me.pn.ui, Rn = R(), M = st.meta; u.codex.hidden = false; let h = `<span class="cur2">◈ ${M.shards} shards · ✦ ${M.ichor} Ichor</span><h2>${["Boons of this run", "Arms and Aspects", "Tablet of Destinies", "The Gods"][U.tab]}</h2><div class="tabs">${TABS.map((t, i) => `<button data-tab="${i}" class="${i === U.tab ? "on" : ""}">${i + 1} · ${t}</button>`).join("")}<span style="opacity:.6;margin-left:auto"><kbd>O</kbd> or <kbd>Esc</kbd> close</span></div>`;
  if (U.tab === 0) { const row = b => { const c = CAT[b.id], g = GOD[b.god] || GODS[0]; return `<div class="row"><img src="${sigilURL(g)}" alt=""><div><i style="color:${RAR[b.rar].c}">${RAR[b.rar].n}${b.lv > 1 ? " · Lv " + b.lv : ""} · ${c.slot === "P" ? "Blessing" : SLOT[c.slot]}</i><b>${esc(boonName(b))}</b><span>${esc(boonText(b))}</span><span style="color:${DOM[c.dom].c}">${esc(g.n)} · ${esc(PANBY[g.pan].name)}</span></div></div>`; };
    h += `<p>Depth ${roman(Rn.depth)} · ${Rn.nLands} land${Rn.nLands === 1 ? "" : "s"} · ${Rn.kills} slain · ${Rn.def} Death Defiance · best depth ${roman(M.best)} · ${M.runs} run${M.runs === 1 ? "" : "s"} ended</p>` + (Rn.boons.length ? `<div class="g">${Rn.boons.map(row).join("")}</div>` : `<p style="opacity:.7">No boons yet. Follow a pillar of light to a shrine and accept its trial.</p>`);
    if (Rn.forge.length) h += `<h4>Anvil marks</h4><div class="g">${Rn.forge.map(k => `<div class="row"><div><b>${FORGE[k].n}</b><span>${FORGE[k].t}</span></div></div>`).join("")}</div>`;
    const a = aspNow(me); if (a) h += `<h4>In hand</h4><div class="row"><div><b>${ARMS[a.arm]} · ${a.A.n} ${"●".repeat(a.l)}</b><span>${a.A.text(a.l)}</span></div></div>`; }
  if (U.tab === 1) { h += `<p>Each arm keeps its Aspects for ever. Ichor (✦) falls from guardians and can be bought at wells. Click an Aspect to wield it; “Raise” spends Ichor.</p>`;
    for (const arm of Object.keys(ARMS)) { h += `<h4>${ARMS[arm]}${armOf(me) === arm ? " · in hand" : ""} <span style="color:#e8ecff;letter-spacing:0;text-transform:none;font-weight:400">· art (R): <b>${ART[arm][0]}</b>, ${ART[arm][2]}</span></h4><div class="asp">` + ASPECTS[arm].map(A => { const l = aspRank(arm, A.id), sel = (st.meta.aspSel[arm] || "wanderer") === A.id, cost = l >= 5 ? 0 : ASPCOST[l]; return `<button data-asp="${arm}:${A.id}" class="${sel && l ? "on" : ""}"><b>${A.n.replace("Aspect of ", "")} ${"●".repeat(l)}${"○".repeat(5 - l)}</b><span>${esc(A.who)}</span><span style="opacity:1">${esc(A.text(Math.max(1, l)))}</span><i>${l >= 5 ? "max" : l ? `raise: ${cost} ✦ (right-click or Shift-click)` : `unlock: ${cost} ✦`}</i></button>`; }).join("") + `</div>`; } }
  if (U.tab === 2) h += `<p>Written once, kept for ever. Shards (◈) come from every trial and guardian.</p><div class="g">` + Object.entries(MIRROR).map(([k, q]) => { const l = mir(k), mx = l >= q[2], cost = mx ? 0 : q[3][l]; return `<button data-mir="${k}" ${mx || M.shards < cost ? "disabled" : ""}><b>${q[0]} ${"●".repeat(l)}${"○".repeat(q[2] - l)}</b><br><span style="font-weight:400;opacity:.85">${q[1]}</span><br><i style="font-style:normal;color:#ffd27a">${mx ? "complete" : cost + " ◈"}</i></button>`; }).join("") + `</div>`;
  if (U.tab === 3) { const p = PANS[U.pan], met = p.gods.filter(g => M.codex[g.id]).length, all = Object.keys(M.codex).length; h += `<div class="tabs"><button data-pan="-1">◀</button><b style="font:400 20px Georgia,serif;color:#fff;min-width:230px;text-align:center">${esc(p.name)} gods</b><button data-pan="1">▶</button><span style="opacity:.8">${p.gods.length} gods · ${met} have blessed you · ${all} of ${GODS.length.toLocaleString()} met in all</span></div><div class="gods">` + p.gods.map(g => `<div class="gd${M.codex[g.id] ? "" : " no"}" title="${esc(domOf(g).n)}${dom2Of(g) ? " · " + esc(dom2Of(g).n) : ""}"><img src="${sigilURL(g)}" alt="" loading="lazy"><div><b>${esc(g.n)}</b><span>${esc(g.e)}</span></div></div>`).join("") + `</div>`; }
  u.codex.innerHTML = h; };
const codexClick = (me, b, alt) => { const U = me.pn.ui, M = st.meta; if (!U) return; const d = b.dataset;
  if (d.tab != null) U.tab = +d.tab; else if (d.pan != null) U.pan = (U.pan + +d.pan + PANS.length) % PANS.length;
  else if (d.mir) { const q = MIRROR[d.mir], l = mir(d.mir); if (l < q[2] && M.shards >= q[3][l]) { M.shards -= q[3][l]; M.mirror[d.mir] = l + 1; if (d.mir === "breath") R().def++; if (d.mir === "dice") R().rr++; if (d.mir === "quiver") R().cast++; dirty(); save(); sfx(me, "boon"); } else sfx(me, "no"); }
  else if (d.asp) { const [arm, id] = d.asp.split(":"), l = aspRank(arm, id), A = M.asp[arm] || (M.asp[arm] = {});
    if (!l || (alt && l < 5)) { const cost = ASPCOST[l]; if (M.ichor >= cost) { M.ichor -= cost; A[id] = l + 1; M.aspSel[arm] = id; sfx(me, "anvil"); } else { sfx(me, "no"); me.say(`Needs ${cost} Ichor (✦). Guardians drop it; wells sell it.`, 2200); } } else { M.aspSel[arm] = id; sfx(me, "pick"); }
    dirty(); save(); }
  drawCodex(me); };
const codexKey = (me, code) => { const U = me.pn.ui; if (code === "KeyO" || code === "Escape" || code === "Digit0" || code === "Period") { closeUI(me); return true; } const n = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3 }[code]; if (n != null) { U.tab = n; drawCodex(me); sfx(me, "pick"); return true; }
  if (U.tab === 3 && (code === "ArrowLeft" || code === "ArrowRight")) { U.pan = (U.pan + (code === "ArrowLeft" ? -1 : 1) + PANS.length) % PANS.length; drawCodex(me); } return true; };
document.addEventListener("contextmenu", e => { const b = e.target.closest && e.target.closest("#pnCodex button[data-asp]"); if (b) { e.preventDefault(); const me = cur(); if (me) codexClick(me, b, true); } });
