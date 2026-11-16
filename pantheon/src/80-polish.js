/* Visual polish for the whole street view, kept in the game's own pixel-art look: soft blob shadows, drifting pixel clouds
   and birds, living water, biome particles, footstep dust and splashes, landing squash, blended walk and run with lean,
   weapon ribbons, dash afterimages, hit sparks and squash, death puffs, a breathing camera, and motion for HUD and menus.
   Purely visual: nothing here changes a number in play. Everything is wrapped, so it can never stop the game. */
const PXCSS = `
#sv > canvas{animation:pxFade .8s ease-out}@keyframes pxFade{from{filter:brightness(0) saturate(0)}to{filter:none}}
#sv .dn{font-weight:900!important;letter-spacing:.02em;text-shadow:0 2px 0 #000,0 0 6px rgba(0,0,0,.9),1px 1px 0 #000,-1px -1px 0 #000!important;animation:pxPop .34s cubic-bezier(.2,1.7,.4,1) both}
#sv .dn.crit{animation:pxCrit .5s cubic-bezier(.2,1.8,.4,1) both}
@keyframes pxPop{0%{scale:.2}55%{scale:1.38}100%{scale:1}}@keyframes pxCrit{0%{scale:.2;rotate:-14deg}50%{scale:1.7;rotate:6deg}100%{scale:1.15;rotate:0deg}}
#sv .msg:not([hidden]){animation:pxMsg .3s cubic-bezier(.2,.9,.3,1.25)}@keyframes pxMsg{from{opacity:0;translate:0 12px;scale:.94}}
#sv .hp b,#sv #svSt i{transition:width .22s cubic-bezier(.2,.8,.3,1)!important}
#pnBan.on b{animation:pxBan 1s cubic-bezier(.16,1,.3,1)}#pnBan.on small{animation:pxBan2 .8s ease-out}
@keyframes pxBan{from{letter-spacing:.55em;opacity:0;filter:blur(7px)}}@keyframes pxBan2{from{letter-spacing:.9em;opacity:0}}
#pnPrompt:not([hidden]){animation:pxIn .22s cubic-bezier(.2,.9,.3,1.3)}@keyframes pxIn{from{opacity:0;translate:0 8px;scale:.92}}
#pnBoss:not([hidden]){animation:pxDrop .5s cubic-bezier(.2,1.25,.4,1)}@keyframes pxDrop{from{opacity:0;translate:0 -18px}}
#pnOffer .c::before{content:"";position:absolute;inset:0;background:linear-gradient(105deg,transparent 38%,rgba(255,255,255,.13) 50%,transparent 62%);background-size:260% 100%;background-position:130% 0;pointer-events:none;border-radius:inherit}
#pnOffer .c.sel::before{animation:pxShine 1.8s ease-in-out infinite}@keyframes pxShine{from{background-position:130% 0}to{background-position:-130% 0}}
#pnOffer .c.sel{animation:none}#pnOffer .c.sel h3{text-shadow:0 0 14px var(--d)}
#pnBoons .b{transition:transform .2s,box-shadow .2s;animation:pxSlot .45s cubic-bezier(.2,1.6,.4,1) both}@keyframes pxSlot{from{scale:.3;opacity:0}}
#pnDeath h2,#pnDeath .st div{animation:pxUp .7s cubic-bezier(.2,.9,.3,1) both}#pnDeath .st div:nth-child(2){animation-delay:.06s}#pnDeath .st div:nth-child(3){animation-delay:.12s}#pnDeath .st div:nth-child(4){animation-delay:.18s}#pnDeath .st div:nth-child(5){animation-delay:.24s}#pnDeath .st div:nth-child(6){animation-delay:.3s}
#pnCodex:not([hidden]){animation:pxPanel .3s cubic-bezier(.2,.9,.3,1.15)}@keyframes pxPanel{from{opacity:0;scale:.96}}
#svTree:not([hidden]){animation:pxPanel .3s cubic-bezier(.2,.9,.3,1.15)}
#hxStart .box>*{animation:pxUp .75s cubic-bezier(.2,.9,.3,1) both}#hxStart .box>*:nth-child(2){animation-delay:.07s}#hxStart .box>*:nth-child(3){animation-delay:.14s}#hxStart .box>*:nth-child(4){animation-delay:.21s}#hxStart .box>*:nth-child(5){animation-delay:.28s}#hxStart .box>*:nth-child(6){animation-delay:.35s}#hxStart .box>*:nth-child(7){animation-delay:.42s}
@keyframes pxUp{from{opacity:0;translate:0 18px}}#hxStart .box{position:relative;z-index:1}#hxStart button:active{scale:.97}
#pxStartFx{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0}`;
const pxStyle = () => { if ($("pxCss")) return; const c = document.createElement("style"); c.id = "pxCss"; c.textContent = PXCSS; document.head.appendChild(c); };
try { pxStyle(); } catch (e) {}

// ---------- particles: screen-aligned squares, so every one lands as a crisp pixel block ----------
const pxSys = (me, add, N) => {
  const T = me.T, pos = new Float32Array(N * 3), ca = new Float32Array(N * 4), sz = new Float32Array(N), g = new T.BufferGeometry();
  g.setAttribute("position", new T.BufferAttribute(pos, 3)); g.setAttribute("ca", new T.BufferAttribute(ca, 4)); g.setAttribute("sz", new T.BufferAttribute(sz, 1));
  const mat = new T.ShaderMaterial({ uniforms: { uS: { value: 300 } }, transparent: true, depthWrite: false, blending: add ? T.AdditiveBlending : T.NormalBlending,
    vertexShader: "attribute float sz; attribute vec4 ca; uniform float uS; varying vec4 vC; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mv; gl_PointSize = sz > 0. ? max(1.5, sz * uS / max(.2, -mv.z)) : 0.; vC = ca; }",
    fragmentShader: "varying vec4 vC; void main(){ if (vC.a < .01) discard; gl_FragColor = vC; }" });
  const o = new T.Points(g, mat); o.frustumCulled = false; o.renderOrder = 6; me.scene.add(o);
  return { o, g, mat, pos, ca, sz, N, i: 0, v: new Float32Array(N * 3), life: new Float32Array(N), age: new Float32Array(N), s0: new Float32Array(N), s1: new Float32Array(N), a0: new Float32Array(N), col: new Float32Array(N * 3), grav: new Float32Array(N), drag: new Float32Array(N), kind: new Uint8Array(N), ph: new Float32Array(N), on: new Uint8Array(N), amb: new Uint8Array(N), nAmb: 0 };
};
const PXC = { c: null };
// kind: 0 fade+shrink · 1 blink (fireflies, motes) · 2 sway (snow, leaves, pollen) · 3 puff (grows while fading)
const pxEmit = (S, x, y, z, vx, vy, vz, life, s0, s1, col, a, grav = 0, drag = 0, kind = 0, amb = 0) => {
  let i = S.i; S.i = (S.i + 1) % S.N; if (S.on[i] && S.amb[i]) S.nAmb--;
  S.pos[i * 3] = x; S.pos[i * 3 + 1] = y; S.pos[i * 3 + 2] = z; S.v[i * 3] = vx; S.v[i * 3 + 1] = vy; S.v[i * 3 + 2] = vz;
  S.life[i] = life; S.age[i] = 0; S.s0[i] = s0; S.s1[i] = s1; S.a0[i] = a; S.grav[i] = grav; S.drag[i] = drag; S.kind[i] = kind; S.ph[i] = Math.random() * 6.283; S.on[i] = 1; S.amb[i] = amb; if (amb) S.nAmb++;
  S.col[i * 3] = col.r; S.col[i * 3 + 1] = col.g; S.col[i * 3 + 2] = col.b; };
const pxStep = (S, dt, cx, cz, R2) => {
  for (let i = 0; i < S.N; i++) { if (!S.on[i]) continue; const age = S.age[i] += dt, L = S.life[i], j = i * 3;
    if (age >= L || (S.amb[i] && (S.pos[j] - cx) ** 2 + (S.pos[j + 2] - cz) ** 2 > R2)) { S.on[i] = 0; if (S.amb[i]) S.nAmb--; S.sz[i] = 0; S.ca[i * 4 + 3] = 0; continue; }
    const k = age / L, dr = Math.max(0, 1 - S.drag[i] * dt), kd = S.kind[i];
    S.v[j] *= dr; S.v[j + 1] = S.v[j + 1] * dr - S.grav[i] * dt; S.v[j + 2] *= dr;
    S.pos[j] += S.v[j] * dt; S.pos[j + 1] += S.v[j + 1] * dt; S.pos[j + 2] += S.v[j + 2] * dt;
    if (kd === 2) { S.pos[j] += Math.sin(age * 1.7 + S.ph[i]) * dt * .7; S.pos[j + 2] += Math.cos(age * 1.3 + S.ph[i]) * dt * .5; }
    if (kd === 1) { S.pos[j] += Math.sin(age * .9 + S.ph[i]) * dt * .5; S.pos[j + 1] += Math.sin(age * 1.4 + S.ph[i]) * dt * .25; }
    const edge = Math.min(1, age * 2.5, (L - age) * 2.5);
    S.sz[i] = S.s0[i] + (S.s1[i] - S.s0[i]) * (kd === 3 ? 1 - (1 - k) ** 2 : k);
    const a = kd === 1 ? S.a0[i] * edge * (.35 + .65 * Math.max(0, Math.sin(age * 2.6 + S.ph[i])) ** 2) : kd === 2 ? S.a0[i] * edge : S.a0[i] * (1 - k);
    S.ca[i * 4] = S.col[j]; S.ca[i * 4 + 1] = S.col[j + 1]; S.ca[i * 4 + 2] = S.col[j + 2]; S.ca[i * 4 + 3] = a; }
  S.g.attributes.position.needsUpdate = S.g.attributes.ca.needsUpdate = S.g.attributes.sz.needsUpdate = true; };

// ---------- textures ----------
const pxSoft = (T, inner = .9) => { const c = document.createElement("canvas"); c.width = c.height = 32; const x = c.getContext("2d"), g = x.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, `rgba(255,255,255,${inner})`); g.addColorStop(.6, `rgba(255,255,255,${inner * .55})`); g.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = g; x.fillRect(0, 0, 32, 32); const t = new T.CanvasTexture(c); return t; };
const pxCloudTex = (T, seed, light, mid, shade) => {   // a flat, three-tone pixel cloud with a level base
  const c = document.createElement("canvas"); c.width = 64; c.height = 28; const x = c.getContext("2d"), r = rngOf(seed), B = [];
  const n = 4 + Math.floor(r() * 4); for (let k = 0; k < n; k++) { const t = (k + .5) / n; B.push([8 + t * 48 + (r() - .5) * 6, 17 - Math.sin(t * Math.PI) * (5 + r() * 5), 5 + r() * 6 * Math.sin(t * Math.PI + .3), 4 + r() * 4]); }
  const fill = (col, dy, grow) => { x.fillStyle = col; for (const [bx, by, rx, ry] of B) { x.beginPath(); x.ellipse(bx, by + dy, rx + grow, ry + grow, 0, 0, 6.283); x.fill(); } x.clearRect(0, 22, 64, 6); };
  fill(shade, 0, 0); fill(mid, -1.5, -.5); fill(light, -3, -1.5);
  const t = new T.CanvasTexture(c); t.magFilter = t.minFilter = T.NearestFilter; t.generateMipmaps = false; return t; };
const hexStr = c => "#" + c.getHexString();

// ---------- per land ----------
const pxInit = me => {
  if (!me || me.px || !me.T || !me.scene || !me.ps) return; const T = me.T, b = me.bio || {}, sc = me.scene;
  const nm = ((b.n || "") + " " + (b.a || "")).toLowerCase(), wt = String(b.t || "day");
  const X = me.px = { t: 0, wb: 0, lean: 0, roll: 0, pf: me.face || 0, pjy: 0, pvy: 0, sq: 0, sqS: 0, dip: 0, fov0: me.cam ? me.cam.fov : 78, ps: 0, tr: [], gh: [], ghT: 0, rings: [], shadows: new Map(), stepT: 0, splT: 0, birds: [] };
  X.night = /night|aurora/.test(wt); X.wet = /rain|storm|monsoon/.test(wt); X.grey = /overcast|mist|rain|storm|monsoon/.test(wt);
  X.snowy = /snow|ice|tundra|arctic|glacier|polar|alpine|frozen/.test(nm) || (b.sn != null && b.sn < 25);
  X.desert = /desert|dune|erg|sahara|arid|salt flat|sand/.test(nm); X.lush = /jungle|rain ?forest|swamp|marsh|mangrove|monsoon|tropical|wetland/.test(nm);
  X.forest = (me.trees || []).length > 140 || /forest|wood|taiga|bocage|grove/.test(nm);
  X.dust = pxSys(me, false, 700); X.glow = pxSys(me, true, 500);
  const C = c => new T.Color(c);
  X.cDust = C(b.g && b.g[0] ? "#" + b.g[0] : "#9a8a6a").lerp(C("#d8ccb0"), .45); X.cSand = C("#e6d6a8"); X.cSnow = C("#f6faff"); X.cWater = C("#dff4ff"); X.cSpark = C("#fff2c0"); X.cCrit = C("#ffd84a"); X.cSoul = C("#cfe8ff");
  // soft blob shadows (the hero's own is kept on the ground, so it stays put while you jump)
  X.shTex = pxSoft(T, .95); X.shGeo = new T.PlaneGeometry(2, 2).rotateX(-Math.PI / 2);
  const shadow = () => { const m = new T.Mesh(X.shGeo, new T.MeshBasicMaterial({ color: 0x000000, map: X.shTex, transparent: true, opacity: .34, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4, fog: false })); m.renderOrder = 2; sc.add(m); return m; };
  X.mkShadow = shadow; X.heroSh = shadow(); if (me.hero && me.hero.shadow) me.hero.shadow.visible = false;
  // sky: pixel clouds that drift around the horizon, a soft halo round the sun, birds by day
  try { const sky = me.sky, fogC = sc.fog ? sc.fog.color.clone() : C("#bcd"), white = C("#ffffff"), rr = rngOf(hash("cl|" + me.hex));
    const light = X.night ? fogC.clone().multiplyScalar(1.6).lerp(white, .08) : white.clone().lerp(fogC, X.grey ? .45 : .12), mid = light.clone().lerp(fogC, .35).multiplyScalar(.95), shade = light.clone().lerp(fogC, .6).multiplyScalar(X.grey ? .78 : .86);
    const n = X.grey ? 26 : X.desert ? 5 : X.night ? 7 : 13, g = new T.Group(), texs = [0, 1, 2, 3, 4].map(k => pxCloudTex(T, hash("cloud" + k + me.hex), hexStr(light), hexStr(mid), hexStr(shade)));
    for (let k = 0; k < n; k++) { const s = new T.Sprite(new T.SpriteMaterial({ map: texs[k % 5], transparent: true, depthWrite: false, fog: false, opacity: X.night ? .55 : X.grey ? .96 : .92 })), az = rr() * 6.283, el = (.05 + rr() * .2) * (X.grey ? .7 : 1), d = 2700, w = (X.grey ? 700 : 420) + rr() * 520;
      s.position.set(Math.cos(az) * Math.cos(el) * d, Math.sin(el) * d, Math.sin(az) * Math.cos(el) * d); s.scale.set(w, w * .44, 1); g.add(s); }
    sky.add(g); X.clouds = g;
    if (me.sun && !X.night) { const h = new T.Sprite(new T.SpriteMaterial({ map: pxSoft(T, .6), color: me.sun.material.color.clone(), transparent: true, depthWrite: false, fog: false, blending: T.AdditiveBlending, opacity: me.sun.material.opacity > .5 ? .3 : .1 })); h.scale.setScalar(me.sun.scale.x * 2.6); sc.add(h); X.halo = h; }
    if (!X.night && !X.wet) { const bm = new T.MeshBasicMaterial({ color: X.grey ? 0x3a3c44 : 0x24242c, side: T.DoubleSide }), wg = new T.BufferGeometry(); wg.setAttribute("position", new T.Float32BufferAttribute([0, 0, .18, 0, 0, -.22, 1, .05, -.05], 3));
      for (let f = 0; f < 2; f++) { const flock = { a: rr() * 6.283, r: 60 + rr() * 90, h: 38 + rr() * 50, w: (.05 + rr() * .05) * (rr() < .5 ? 1 : -1), m: [] };
        for (let k = 0; k < 4 + Math.floor(rr() * 4); k++) { const bd = new T.Group(), L = new T.Mesh(wg, bm), Rw = new T.Mesh(wg, bm); Rw.scale.x = -1; bd.add(L, Rw); bd.scale.setScalar(1.3 + rr() * .4); sc.add(bd); flock.m.push({ bd, L, Rw, ph: rr() * 6.283, ox: (k ? (k % 2 ? 1 : -1) * Math.ceil(k / 2) * 2.4 : 0), oz: -Math.ceil(k / 2) * 2.2 }); }
        X.birds.push(flock); } }
  } catch (e) { warn(e); }
  // living water: the flat sheet gets slow swells in its light, glints and gentle colour bands
  try { const w = sc.children.find(o => o.isMesh && o.material && o.material.isMeshPhongMaterial && o.geometry && o.geometry.parameters && o.geometry.parameters.width === 4000);
    if (w) { const U = X.wT = { value: 0 }, mt = w.material; mt.customProgramCacheKey = () => "pxWater"; mt.onBeforeCompile = s => { s.uniforms.uT = U;
      s.vertexShader = s.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vWp;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvWp = (modelMatrix * vec4(transformed, 1.)).xyz;");
      s.fragmentShader = s.fragmentShader.replace("#include <common>", "#include <common>\nuniform float uT; varying vec3 vWp;")
        .replace("#include <normal_fragment_begin>", "#include <normal_fragment_begin>\n{ vec2 p = vWp.xz; float t = uT; vec3 wn = vec3(sin(p.x * .42 + t * 1.6) * .5 + sin(p.x * .11 - p.y * .17 + t * .7) * .8 + sin(p.y * .9 + t * 2.3) * .25, 7., cos(p.y * .37 + t * 1.3) * .5 + cos(p.x * .23 + p.y * .13 - t * .9) * .8); normal = normalize(normal + (viewMatrix * vec4(normalize(wn) - vec3(0., 1., 0.), 0.)).xyz * 1.4); }")
        .replace("#include <color_fragment>", "#include <color_fragment>\ndiffuseColor.rgb *= .93 + .09 * sin(vWp.x * .045 + vWp.z * .038 + uT * .35);")
        .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n{ float gl = sin(vWp.x * 2.9 + uT * 2.1) * sin(vWp.z * 2.6 - uT * 1.7) * sin((vWp.x + vWp.z) * .7 + uT); totalEmissiveRadiance += step(.93, gl) * .5; }"); };
      mt.needsUpdate = true; X.water = w; } } catch (e) { warn(e); }
  // the weapon's ribbon: a strip between the blade's root and tip, fading over a sixth of a second
  { const TN = 16, g = new T.BufferGeometry(), idx = []; for (let i = 0; i < TN - 1; i++) { const a = i * 2; idx.push(a, a + 1, a + 3, a, a + 3, a + 2); }
    g.setAttribute("position", new T.BufferAttribute(new Float32Array(TN * 6), 3)); g.setAttribute("color", new T.BufferAttribute(new Float32Array(TN * 8), 4)); g.setIndex(idx);
    const m = new T.Mesh(g, new T.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, side: T.DoubleSide, blending: T.AdditiveBlending, fog: false })); m.frustumCulled = false; m.renderOrder = 7; m.visible = false; sc.add(m); X.rib = { m, g, TN }; }
  X.v1 = new T.Vector3(); X.v2 = new T.Vector3(); X.v2b = new T.Vector2();
  // a little sound under your feet (only when sound is on, like everything else)
  try { if (typeof SND === "object") { SND.step = SND.step || [["noise", 520, 260, .07, .018]]; SND.stepW = SND.stepW || [["noise", 1600, 600, .16, .03]]; SND.land = SND.land || [["noise", 380, 120, .16, .05], ["sine", 110, 60, .14, .05]]; } } catch (e) {}
  // hits: sparks and a squash; the first rule of juice is that every blow is seen
  const hit0 = me.onHit; me.onHit = (m, dmg, crit, heavy) => { try { hit0 && hit0(m, dmg, crit, heavy); } catch (e) { warn(e); } try { pxHit(me, m, crit, heavy); } catch (e) { warn(e); } };
  me.ps.push((dt, t) => { if (cur() !== me) return; try { pxTick(me, dt, t); } catch (e) { if (!X.err) { X.err = 1; warn(e); } } });
};
const pxHit = (me, m, crit, heavy) => { const X = me.px; if (!X || !m || !m.root) return; const p = head(me, m), n = crit ? 16 : heavy ? 11 : 7, c = crit ? X.cCrit : X.cSpark;
  for (let k = 0; k < n; k++) { const a = Math.random() * 6.283, s = 4 + Math.random() * (crit ? 9 : 6); pxEmit(X.glow, p.x, p.y, p.z, Math.cos(a) * s, 2 + Math.random() * 5, Math.sin(a) * s, .22 + Math.random() * .2, .1, .02, c, 1, 16, 2); }
  pxEmit(X.glow, p.x, p.y, p.z, 0, 0, 0, .07, crit ? .7 : .45, .1, c, .8);
  if (!m.dead) { if (!m.pxSq) m.pxBase = m.root.scale.clone(); m.pxSq = crit || heavy ? .22 : .16; m.pxSqS = crit || heavy ? .2 : .13; } };
const pxGroundC = (me, y) => { const X = me.px, b = me.bio || {}; if (b.sn && y > b.sn) return X.cSnow; if (X.snowy) return X.cSnow; if (X.desert || (b.w && y < 1.3)) return X.cSand; return X.cDust; };
const pxPuff = (me, x, y, z, n, c, spread = .6, up = 1, size = .4, life = .6) => { const X = me.px; for (let k = 0; k < n; k++) { const a = Math.random() * 6.283, s = spread * (.4 + Math.random()); pxEmit(X.dust, x + Math.cos(a) * .15, y + .05, z + Math.sin(a) * .15, Math.cos(a) * s, up * (.4 + Math.random() * .6), Math.sin(a) * s, life * (.7 + Math.random() * .6), size * .5, size * (1 + Math.random() * .6), c, .5, -.3, 2.5, 3); } };
const pxRing = (me, x, y, z, r, c, d = .5, op = .6) => { const T = me.T, X = me.px; if (!X.ringG) X.ringG = new T.RingGeometry(.86, 1, 36).rotateX(-Math.PI / 2); const o = new T.Mesh(X.ringG, new T.MeshBasicMaterial({ color: c, transparent: true, opacity: op, depthWrite: false, fog: false })); o.position.set(x, y, z); o.scale.setScalar(.1); me.scene.add(o); X.rings.push({ o, t: 0, d, r, op }); };
const pxInWater = me => { const b = me.bio || {}; return !!b.w && !me.flying && me.H(me.pos.x, me.pos.z) < -.05 && (me.by ?? me.pos.y) < .15; };
const pxTick = (me, dt, t) => {
  const X = me.px, T = me.T, hero = me.hero, cam = me.cam, pos = me.pos, b = me.bio || {}; X.t += dt;
  const moving = !!me.moving && me.hp > 0, grounded = !me.jy && !me.flying && !me.mantle && !(me.rollT > 0), run = !!me.runNow;
  // ---- the hero: blended stride, run lean, turn roll, squash on landing, stretch on the way up ----
  if (hero) {
    X.wb += ((moving ? 1 : 0) - X.wb) * (1 - Math.exp(-dt * 10));
    if (moving && !me.flying) { const amp = (me.crouching ? .38 : run ? .82 : .58) * X.wb, sw = Math.sin(me.walkT); hero.legs[0].rotation.x = sw * amp; hero.legs[1].rotation.x = -sw * amp;
      if (me.weapon !== "bow" && !me.atk && !me.block) hero.armL.rotation.x = -sw * amp * .85; }
    const lean = me.rollT > 0 || me.atk ? 0 : run && moving ? .16 : moving ? .05 : 0; X.lean += (lean - X.lean) * (1 - Math.exp(-dt * 8));
    let dy = (me.face || 0) - X.pf; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); X.pf = me.face || 0; const rate = dt > 0 ? dy / dt : 0;
    const roll = me.rollT > 0 ? 0 : clamp(-rate * .035, -.2, .2) * (moving ? 1 : .25); X.roll += (roll - X.roll) * (1 - Math.exp(-dt * 7));
    if (!(me.rollT > 0)) hero.root.rotation.x += X.lean; hero.root.rotation.z = X.roll;
    // landing: dust ring, squash, a dip of the camera and a soft thud
    const jy = me.jy || 0; if (X.pjy > .08 && jy === 0 && !me.flying) { const s = clamp(-X.pvy / 12, .25, 1.3), wet = pxInWater(me); X.sq = .26; X.sqS = s; X.dip = .22 * s;
      if (wet) { for (let k = 0; k < 14 * s; k++) { const a = Math.random() * 6.283, v = 2 + Math.random() * 3; pxEmit(X.dust, pos.x, .05, pos.z, Math.cos(a) * v, 3 + Math.random() * 4, Math.sin(a) * v, .5 + Math.random() * .3, .14, .06, X.cWater, .9, 16, 1); } pxRing(me, pos.x, .03, pos.z, 2.6 * s, 0xdff4ff, .6); }
      else { pxPuff(me, pos.x, me.by, pos.z, Math.round(10 * s), pxGroundC(me, me.by), 2.6 * s, .5, .5, .7); pxRing(me, pos.x, me.by + .05, pos.z, 1.8 * s, hexStr(pxGroundC(me, me.by)), .35, .35); }
      try { sfx(me, wet ? "stepW" : "land"); } catch (e) {} }
    if (X.pjy === 0 && jy > .02 && me.vy > 3 && !me.flying) pxPuff(me, pos.x, me.by, pos.z, 5, pxGroundC(me, me.by), 1.2, .3, .35, .5);
    X.pjy = jy; X.pvy = me.vy || 0;
    let sy = 1, sxz = 1; if (X.sq > 0) { X.sq -= dt; const k = Math.sin(clamp(1 - X.sq / .26, 0, 1) * Math.PI); sy = 1 - .17 * X.sqS * k; sxz = 1 + .09 * X.sqS * k; }
    else if (jy > .05 && me.vy > 1.5) { sy = 1.05; sxz = .97; }
    hero.root.scale.set(sxz, sy, sxz);
    // footsteps: a puff of the ground's own colour (a splash in water) on every footfall
    const s = Math.sin(me.walkT || 0); if (moving && grounded && Math.sign(s) !== Math.sign(X.ps) && X.ps !== 0) { const side = s > 0 ? 1 : -1, fx = Math.cos(me.face) * .14 * side, fz = -Math.sin(me.face) * .14 * side;
      if (pxInWater(me)) { for (let k = 0; k < 5; k++) pxEmit(X.dust, pos.x + fx, .05, pos.z + fz, (Math.random() - .5) * 2.4, 2 + Math.random() * 2.6, (Math.random() - .5) * 2.4, .45, .12, .05, X.cWater, .85, 14, 1); pxRing(me, pos.x + fx, .03, pos.z + fz, 1.1, 0xdff4ff, .55, .5); try { sfx(me, "stepW"); } catch (e) {} }
      else { pxPuff(me, pos.x + fx, me.by, pos.z + fz, run ? 3 : 1 + (Math.random() < .5 ? 1 : 0), pxGroundC(me, me.by), run ? .9 : .45, .45, run ? .42 : .3, .55); try { sfx(me, "step"); } catch (e) {} } }
    X.ps = s;
    // idle: after a few still seconds the knight looks around a little
    X.idle = moving || me.atk || me.block || me.draw != null ? 0 : (X.idle || 0) + dt; if (X.idle > 3 && me.weapon !== "bow" && hero.head) { const k = Math.min(1, (X.idle - 3) / 1.5); hero.head.rotation.y += Math.sin(X.t * .55) * .45 * k; hero.head.rotation.x = Math.sin(X.t * .33) * .08 * k; } else if (hero.head) hero.head.rotation.x = 0;
    // a level gained: a column of gold and a ring; coins picked up: a few glints
    const pr = me.prog || {}; if (X.lvl != null && pr.lvl > X.lvl) { const gc = X.cGold || (X.cGold = new T.Color("#ffd84a")); pxRing(me, pos.x, me.by + .08, pos.z, 4.5, 0xffd84a, .7, .8); for (let q = 0; q < 28; q++) { const a = q / 28 * 6.283; pxEmit(X.glow, pos.x + Math.cos(a) * .7, me.by + .2, pos.z + Math.sin(a) * .7, Math.cos(a) * .4, 3 + Math.random() * 4, Math.sin(a) * .4, 1 + Math.random() * .6, .08, .02, gc, 1, -.5, .8, 0); } X.dip = .12; X.sq = .26; X.sqS = .6; }
    X.lvl = pr.lvl; const cn = pr.coins || 0; if (X.coins != null && cn > X.coins && cn - X.coins < 5000) { const gc = X.cGold || (X.cGold = new T.Color("#ffd84a")); for (let q = 0; q < Math.min(10, 2 + (cn - X.coins) / 3); q++) pxEmit(X.glow, pos.x + (Math.random() - .5) * .6, pos.y + .8 + Math.random() * .6, pos.z + (Math.random() - .5) * .6, (Math.random() - .5) * 1.5, 1 + Math.random() * 2, (Math.random() - .5) * 1.5, .4 + Math.random() * .3, .06, .015, gc, 1, 3, 1, 0); } X.coins = cn;
    if (me.slide && grounded && (X.slT = (X.slT || 0) - dt) <= 0) { X.slT = .04; pxPuff(me, pos.x, me.by, pos.z, 2, pxGroundC(me, me.by), .8, .5, .45, .6); }
    // the hero's shadow stays on the ground and shrinks as you rise
    { const h = Math.max(0, (pos.y - (me.by ?? pos.y))), k = clamp(1 - h / 6, .35, 1); X.heroSh.position.set(pos.x, (me.by ?? pos.y) + .06, pos.z); X.heroSh.scale.setScalar(.62 * k * (me.rollT > 0 ? 1.2 : 1)); X.heroSh.material.opacity = .4 * k; X.heroSh.visible = me.hp > 0 && !me.flying; }
    // ---- weapon ribbon ----
    try { const R = X.rib, w = hero.sword && hero.sword.userData.w, wm = w && w.children[0], on = me.atk && me.atk.kind !== "dash" && me.weapon !== "bow" && me.blade && wm && hero.sword.visible;
      if (wm && X.wm !== wm) { X.wm = wm; wm.geometry.computeBoundingBox(); X.tipZ = wm.geometry.boundingBox.max.z; }
      if (on) { hero.root.updateMatrixWorld(true); const a = wm.localToWorld(X.v1.set(0, 0, X.tipZ * .32)), bq = wm.localToWorld(X.v2.set(0, 0, X.tipZ * .98)); X.tr.unshift([a.x, a.y, a.z, bq.x, bq.y, bq.z, X.t]); }
      while (X.tr.length && (X.t - X.tr[X.tr.length - 1][6] > .16 || X.tr.length > R.TN)) X.tr.pop();
      if (X.tr.length >= 2) { const P = R.g.attributes.position.array, Cc = R.g.attributes.color.array, bA = typeof boonIn === "function" && boonIn("A"), col = X.ribC || (X.ribC = new T.Color()); col.set(bA ? DOM[CAT[bA.id].dom].c : "#dfeaff"); const hot = me.atk && (me.atk.m >= 1.5 || me.atk.round) ? 1 : .7;
        for (let i = 0; i < R.TN; i++) { const s2 = X.tr[Math.min(i, X.tr.length - 1)], f = Math.max(0, 1 - (X.t - s2[6]) / .16) * (i < X.tr.length ? 1 : 0), al = f * f * .85 * hot;
          P.set(s2.slice(0, 6), i * 6); Cc[i * 8] = Cc[i * 8 + 4] = col.r; Cc[i * 8 + 1] = Cc[i * 8 + 5] = col.g; Cc[i * 8 + 2] = Cc[i * 8 + 6] = col.b; Cc[i * 8 + 3] = al * .25; Cc[i * 8 + 7] = al; }
        R.g.attributes.position.needsUpdate = R.g.attributes.color.needsUpdate = true; R.g.computeBoundingSphere(); R.m.visible = true; } else R.m.visible = false; } catch (e) { warn(e); X.rib.m.visible = false; }
    // ---- dash and roll afterimages: the whole hero, not a cylinder ----
    const dashing = (me.atk && me.atk.kind === "dash") || me.rollT > 0;
    if (me.fx) for (const f of me.fx) { const g = f.o && f.o.geometry; if (g && g.type === "CylinderGeometry" && g.parameters.radiusTop === .18) f.o.visible = false; }
    if (dashing && (X.ghT -= dt) <= 0) { X.ghT = .035; hero.root.updateMatrixWorld(true); const bA = typeof boonIn === "function" && boonIn("D"), mat = new T.MeshBasicMaterial({ color: bA ? DOM[CAT[bA.id].dom].c : "#9fd8ff", transparent: true, opacity: .42, depthWrite: false, blending: T.AdditiveBlending, fog: false }), g = new T.Group();
      hero.root.traverse(o => { if (!o.isMesh || !o.visible || !o.geometry || o.material && o.material.isMeshBasicMaterial) return; for (let q = o.parent; q; q = q.parent) if (!q.visible) return; const c = new T.Mesh(o.geometry, mat); c.matrixAutoUpdate = false; c.matrix.copy(o.matrixWorld); g.add(c); });
      sc0(me).add(g); X.gh.push({ g, mat, t: 0 }); }
    for (let i = X.gh.length - 1; i >= 0; i--) { const q = X.gh[i]; q.t += dt; q.mat.opacity = .42 * (1 - q.t / .3); if (q.t >= .3) { me.scene.remove(q.g); q.mat.dispose(); X.gh.splice(i, 1); } }
  }
  // ---- animals: blob shadows, squash on a hit, a puff and a rising spark when the body fades ----
  const seen = new Set();
  for (const m of me.mobs || []) { const R0 = m.root; if (!R0) continue; seen.add(m); let sh = X.shadows.get(m);
    if (!sh) { sh = X.mkShadow(); X.shadows.set(m, sh); m.pxR = clamp(((m.a[1] || 1) * .3 + (m.a[2] || 1) * .18) * GSC * (m.drake ? 1 : R0.scale.x), .3, 7); let c = null; R0.traverse(o => { const mt = o.material; if (!c && mt && mt.color && !mt.isMeshBasicMaterial) { const h = mt.color.getHex(); if (h !== 0xffffff && h > 0x101010) c = mt.color.clone(); } }); m.pxC = c || X.cDust; const pd = Math.hypot(R0.position.x - me.pos.x, R0.position.z - me.pos.z); if (X.t > 2 && pd < 45 && !m.pnT && !m.dead) pxPuff(me, R0.position.x, me.H(R0.position.x, R0.position.z), R0.position.z, 8, pxGroundC(me, R0.position.y), 1.8, .6, .6, .8); }
    const p = R0.position, gy = me.H(p.x, p.z), hgt = Math.max(0, p.y - gy), k = clamp(1 - hgt / 12, 0, 1), fade = m.dead ? clamp(m.dead / 3.5, 0, 1) : 1;
    sh.position.set(p.x, gy + .06, p.z); sh.scale.setScalar(m.pxR * (.6 + .4 * k)); sh.material.opacity = .34 * k * fade; sh.visible = R0.visible && k > 0;
    if (m.pxSq > 0) { m.pxSq -= dt; const B = m.pxBase; if (m.dead || m.pxSq <= 0 || !B) { if (B) R0.scale.copy(B); m.pxSq = 0; } else { const q = Math.sin((1 - m.pxSq / .22) * Math.PI) * m.pxSqS; R0.scale.set(B.x * (1 + q * .6), B.y * (1 - q), B.z * (1 + q * .6)); } }
    if (m.dead > 0 && !m.pxD) { m.pxD = 1; pxPuff(me, p.x, gy, p.z, 6, pxGroundC(me, gy), 1.6, .4, .45, .6); }
    if (m.dead > 0 && m.dead < .55 && !m.pxP) { m.pxP = 1; const hy = p.y + (m.a[2] || 1) * GSC * .4; pxPuff(me, p.x, hy, p.z, 10 + Math.round(m.pxR * 4), m.pxC, 1.4, 1, .5 + m.pxR * .15, .8);
      for (let q = 0; q < 6; q++) pxEmit(X.glow, p.x + (Math.random() - .5) * m.pxR, hy, p.z + (Math.random() - .5) * m.pxR, (Math.random() - .5) * .6, 1.2 + Math.random() * 1.6, (Math.random() - .5) * .6, 1.1 + Math.random() * .6, .16, .06, X.cSoul, .9, -.4, .6, 1); } }
  for (const [m, sh] of X.shadows) if (!seen.has(m)) { me.scene.remove(sh); sh.material.dispose(); X.shadows.delete(m); }
  // ---- ambient life of the land ----
  if (cam) { const cp = cam.position, R = 26, want = X.snowy ? 170 : X.desert ? 90 : 70;
    const em = (S, kind, life, s0, c, a, vx, vy, vz, grav, y0, y1) => { const ang = Math.random() * 6.283, d = Math.sqrt(Math.random()) * R, x = cp.x + Math.cos(ang) * d, z = cp.z + Math.sin(ang) * d, gy = me.H(x, z); pxEmit(S, x, Math.max(gy, b.w ? 0 : gy) + y0 + Math.random() * (y1 - y0), z, vx, vy, vz, life, s0, s0, c, a, grav, 0, kind, 1); };
    for (let n = 0; n < 4; n++) {
      if (X.snowy) { if (X.dust.nAmb < want) em(X.dust, 2, 7 + Math.random() * 4, .09 + Math.random() * .06, X.cSnow, .9, .4, -1.1 - Math.random() * .6, .2, 0, 4, 14); }
      else if (X.desert && !X.night) { if (X.dust.nAmb < want) em(X.dust, 2, 2.5 + Math.random() * 2, .07 + Math.random() * .05, X.cSand, .55, 4 + Math.random() * 3, -.1, 1.2, 0, .1, 1.6); }
      else if (X.night || X.lush) { if (X.glow.nAmb < (X.night ? 70 : 34)) em(X.glow, 1, 5 + Math.random() * 5, .1 + Math.random() * .05, X.cFire || (X.cFire = new T.Color("#d8ff6a")), X.night ? .95 : .55, 0, 0, 0, 0, .4, 3.4); }
      else if (X.forest && X.dust.nAmb < 40) em(X.dust, 2, 6 + Math.random() * 3, .14, X.cLeaf || (X.cLeaf = new T.Color().setHSL(.08 + Math.random() * .14, .6, .45)), .95, .6, -.7, .3, 0, 5, 12);
      else if (!X.wet && X.glow.nAmb < 50) em(X.glow, 1, 6 + Math.random() * 4, .05 + Math.random() * .04, X.cMote || (X.cMote = new T.Color("#fff6d8")), .45, 0, .05, 0, 0, .5, 4); }
    // ---- sky: drifting clouds, the sun's halo, birds wheeling far off ----
    if (X.clouds) X.clouds.rotation.y += dt * .0035;
    if (X.halo && me.sun) { X.halo.position.copy(me.sun.position); }
    for (const f of X.birds) { f.a += f.w * dt; const cx = me.pos.x + Math.cos(f.a) * f.r, cz = me.pos.z + Math.sin(f.a) * f.r, hd = Math.atan2(-Math.sin(f.a) * f.w, Math.cos(f.a) * f.w), cy = Math.max(me.H(cx, cz), 0) + f.h;
      for (const q of f.m) { const sx = Math.cos(hd), sz = -Math.sin(hd), fx2 = Math.sin(hd), fz2 = Math.cos(hd); q.bd.position.set(cx + sx * q.ox + fx2 * q.oz, cy + Math.sin(t * .7 + q.ph) * .6, cz + sz * q.ox + fz2 * q.oz); q.bd.rotation.y = hd; const fl = Math.sin(t * 7 + q.ph); q.L.rotation.z = fl * .55; q.Rw.rotation.z = -fl * .55; } }
    // ---- camera: a touch wider at a run, wider in a dash, a dip when you land ----
    const fov = X.fov0 + (run && moving ? 5 : 0) + ((me.atk && me.atk.kind === "dash") || me.rollT > 0 ? 8 : 0) + (me.slide ? 6 : 0) + (me.flying ? 4 : 0);
    const nf = cam.fov + (fov - cam.fov) * (1 - Math.exp(-dt * 7)); if (Math.abs(nf - cam.fov) > .01) { cam.fov = nf; cam.updateProjectionMatrix(); }
    if (X.dip > .001) { cam.position.y -= X.dip * Math.sin(Math.min(1, X.sq / .26 + .001) * Math.PI) ; X.dip *= Math.exp(-dt * 6); }
    // particle size: world units to pixels for this camera and screen
    me.R.getDrawingBufferSize(X.v2b); const uS = X.v2b.y / (2 * Math.tan(cam.fov * Math.PI / 360)); X.dust.mat.uniforms.uS.value = X.glow.mat.uniforms.uS.value = uS;
    pxStep(X.dust, dt, cp.x, cp.z, (R * 1.5) ** 2); pxStep(X.glow, dt, cp.x, cp.z, (R * 1.5) ** 2); }
  for (let i = X.rings.length - 1; i >= 0; i--) { const q = X.rings[i]; q.t += dt; const k = q.t / q.d; q.o.scale.setScalar(Math.max(.05, q.r * (1 - (1 - k) ** 3))); q.o.material.opacity = q.op * (1 - k); if (k >= 1) { me.scene.remove(q.o); q.o.material.dispose(); X.rings.splice(i, 1); } }
  if (X.wT) X.wT.value = t;
};
const sc0 = me => me.scene;

// ---------- the start menu: slow drifting hexes and motes behind the title, in its own colours ----------
const pxStartFx = () => { const st0 = $("hxStart"); if (!st0 || st0.hidden || $("pxStartFx")) return; const cv = document.createElement("canvas"); cv.id = "pxStartFx"; st0.prepend(cv); const x = cv.getContext("2d"), H = [], D = [];
  for (let k = 0; k < 26; k++) H.push({ x: Math.random(), y: Math.random(), r: 14 + Math.random() * 46, v: .006 + Math.random() * .014, a: .03 + Math.random() * .08, rot: Math.random() * 6.283, w: (Math.random() - .5) * .2 });
  for (let k = 0; k < 70; k++) D.push({ x: Math.random(), y: Math.random(), v: .01 + Math.random() * .03, p: Math.random() * 6.283, s: 1 + Math.random() * 2 });
  let last = performance.now(); const loop = now => { if (!cv.isConnected || st0.hidden) { cv.remove(); return; } const dt = Math.min(.05, (now - last) / 1000); last = now; const w = cv.width = cv.clientWidth, h = cv.height = cv.clientHeight; x.clearRect(0, 0, w, h);
    x.lineWidth = 1.5; for (const q of H) { q.y -= q.v * dt; q.rot += q.w * dt; if (q.y < -.1) { q.y = 1.1; q.x = Math.random(); } x.strokeStyle = `rgba(143,220,255,${q.a})`; x.beginPath(); for (let i = 0; i <= 6; i++) { const a = q.rot + i * Math.PI / 3, px = q.x * w + Math.cos(a) * q.r, py = q.y * h + Math.sin(a) * q.r; i ? x.lineTo(px, py) : x.moveTo(px, py); } x.stroke(); }
    for (const q of D) { q.y -= q.v * dt; if (q.y < -.02) { q.y = 1.02; q.x = Math.random(); } const al = .25 + .5 * Math.sin(now / 900 + q.p) ** 2; x.fillStyle = `rgba(255,236,190,${al * .55})`; x.fillRect(Math.round(q.x * w), Math.round(q.y * h), q.s, q.s); }
    requestAnimationFrame(loop); }; requestAnimationFrame(loop); };
for (const ms of [200, 900, 2500]) setTimeout(() => { try { pxStartFx(); } catch (e) {} }, ms);
setInterval(() => { try { pxStartFx(); } catch (e) {} }, 1500);

{ const r0 = window.hxRestore; window.hxRestore = me => { try { r0 && r0(me); } finally { try { pxStyle(); pxInit(me); } catch (e) { warn(e); } } }; }
PN.px = { emit: pxEmit, init: pxInit };
