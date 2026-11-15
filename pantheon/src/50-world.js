/* The land as a chamber: three shrines of the land's own gods, a cache, a well, and a guardian whose fall
   opens passages to the neighbouring lands. Clearing a shrine's trial earns its reward. Death ends the run. */
const GUARD = {
  hellenic: ["The Nemean Lion", "The Calydonian Boar", "The Chimera", "The Cretan Bull"], kemetic: ["Ammit the Devourer", "The Serpopard", "The Beast of Set", "Apep's Brood"], kushite: ["The Lion of Naqa", "The Elephant of Musawwarat", "The Ram of the Pure Mountain"],
  mesopotamian: ["Humbaba", "The Bull of Heaven", "The Mushussu", "Anzu"], canaanite: ["Lotan", "The Behemoth", "The Seven-Headed"], arabian: ["The Nasnas", "The Roc", "The Ghul of the Empty Quarter"],
  scythian: ["The Gold-Guarding Griffin", "The Steppe Wolf-King", "The Antlered Terror"], persian: ["Azhi Dahaka's Spawn", "The Manticore", "The Simurgh's Shadow"], anatolian: ["The Chimera of Lycia", "Illuyanka", "The Lion of Cybele"],
  caucasian: ["The Vishap", "The Devi", "The Ibex-Lord of Dali"], thracian: ["The Mares of Diomedes", "The Wolf of Zalmoxis", "The Strymon Boar"], illyrian: ["The Kulshedra", "The Wolf of the Karst", "The Boar of Bindus"],
  etruscan: ["Olta", "The Wolf of Aita", "Tuchulcha's Beast"], italic: ["The Wolf of Mars", "Cacus", "The Boar of the Laurentine Wood"], iberian: ["The Bull of Geryon", "The Herensuge", "The Wolf of Vaelicus"],
  celtic: ["The Boar of Ben Bulben", "The Tarasque", "The Hound of Culann", "The Horned Serpent"], germanic: ["The Great Aurochs", "The Wolf of the Hercynian Wood", "The Lindworm"], baltic: ["The Iron Wolf", "The Aurochs of Perkūnas", "The Žaltys"],
  slavic: ["The Zmey", "The Wolf of Veles", "The Bear of the Black Wood"], uralic: ["Otso the Honey-Paw", "The Elk of Hiisi", "The Iron Eagle of Pohjola"], siberian: ["Mangi the Sky-Bear", "Kheglen the Sky-Elk", "The Mammoth Below"],
  steppe: ["The Sky Wolf", "The Bull of Erlik", "The Snow Leopard Khan"], vedic: ["Vritra's Coil", "The Rakshasa-Tiger", "Airavata's Rival"], dravidian: ["The Tiger of the Kurinji Hills", "The Rogue Tusker", "The Naga of the Shore"],
  chinese: ["The Taotie", "Xiangliu", "The Nian", "The White Tiger of the West"], tibetan: ["The Snow Lion", "The Wild Yak of the Tsen", "The Lu Serpent"], korean: ["The Tiger of Baekdu", "The Bulgasari", "The Imugi"],
  kami: ["Yamata no Orochi", "The Boar of Ibuki", "The White Wolf of Mitsumine"], kamuy: ["The Evil Bear Wen-Kamuy", "The Great Trout Beneath the World", "The Stag of Poroshiri"], seasia: ["The Nine-Tailed Fox of Long Biên", "The Tiger of the Annam Hills", "The Naga of the Great River"],
  austronesian: ["The Bakunawa", "The Minokawa", "The Buwaya"], polynesian: ["The Great Moʻo", "The Taniwha", "The Shark of the Reef Passage"], papuan: ["The Cassowary of the Dema", "The Great Crocodile", "The Giant Boar of the Sago Swamp"],
  aboriginal: ["The Whowie", "The Great Kangaroo of the Dreaming", "The Bunyip"], berber: ["The Lion of Atlas", "Antaeus' Hound", "The Horned Viper of the Erg"], sahel: ["Bida the Wagadu Serpent", "The Hyena-Lord", "The Lion of the Bush"],
  westafrican: ["The Leopard of the Sacred Grove", "The Great Python", "The Bush-Cow of the Savanna"], bantu: ["Kimbiji", "The Lion-Spirit", "The Rogue Elephant of the Great Forest"], nilotic: ["The Lion of the Sudd", "The Bull of Deng", "The Crocodile of the White Nile"],
  cushitic: ["The Hyena of Buda", "The Lion of the Highlands", "The Serpent Arwe"], khoisan: ["The Rain Bull", "The Lion of the Thirstland", "The Eland of ǀKaggen"], maya: ["Camazotz", "The Jaguar of the Underworld", "Zipacna's Caiman"],
  mesoamerican: ["The Were-Jaguar", "The Earth Monster", "The Feathered Serpent's Shadow"], andean: ["The Fanged Jaguar of Chavín", "The Amaru", "The Condor-Puma"], chibchan: ["The Jaguar Shaman", "The Caiman of the Magdalena", "The Spectacled Bear of the Páramo"],
  antillean: ["The Great Caiman", "The Night-Dog Opiyelguabirán", "The Shark of Yayael's Sea"], amazonian: ["The Mapinguari", "Boiúna", "The Black Jaguar"], southerncone: ["The Nahuelito", "The Puma of Elal", "Caicai's Brood"],
  algonquian: ["Mishipeshu", "The Wendigo-Bear", "The Great Horned Serpent"], iroquoian: ["Uktena", "The Flint Bear", "The Naked Bear"], plains: ["Unktehi", "The Crazy Buffalo", "The Thunder-Bear"],
  southeastern: ["The Underwater Panther", "Tie-Snake", "The Great Alligator"], southwest: ["The Big Monster Yé'iitsoh", "Kolowisi", "The Horned Bear of the Mesa"], northwest: ["Sisiutl", "Wasgo the Sea-Wolf", "The Bear of the Cedar House"],
  california: ["The Grizzly of the First People", "The Water Monster", "The Great Elk"], arctic: ["The Ten-Legged Bear Qupqugiaq", "Amaguq", "The Great Musk-Ox"]
};
const LINES = {
  S: ["The sky has been waiting for a hand like yours.", "Stand where the lightning falls and do not flinch."], W: ["Everything returns to the water. Carry it with you.", "The tide does not ask. Neither should you."],
  R: ["Bleed for me, and I will make them bleed more.", "There is no glory in mercy. Take the field."], L: ["Even the fiercest heart softens. Use that.", "Be adored, and be terrible."],
  H: ["Patience. Then one clean arrow.", "The quarry is close. I can smell its fear."], A: ["Think first. Strike second. Live longest.", "A shield is only wisdom made bronze."],
  V: ["Drink deep. Tomorrow is for the dead.", "Let them dance until they drop."], C: ["The cold is patient. It always wins.", "Let winter into your blade."],
  E: ["What you plant in blood, I will make grow.", "The ground remembers every step."], T: ["Why fight fair? No one else does.", "Be gone before they know you came."],
  D: ["All roads end with me. Walk yours boldly.", "Send them down. I will keep the count."], U: ["Nothing hides at noon.", "Carry my light where it is not wanted."],
  M: ["The night keeps its own counsel. So shall we.", "Count your blows. On the last, look up."], F: ["Every hearth is a small war against the dark.", "Burn clean. Leave ash."],
  K: ["Kneel to no beast. You carry heaven's favour.", "The mighty are only tall. Cut them down."], Y: ["Live. That is the whole of my command.", "What is torn can be made whole."],
  X: ["It was written that you would come here.", "Fortune loves the reckless. Today."], N: ["The pack runs with you now.", "Teeth and patience. That is all the wild knows."],
  O: ["Good iron wants a good arm.", "Strike while it glows."], Z: ["Before the gods, there was only this.", "Take a piece of the first dark. It bites."]
};
const KINDS = { god: "Shrine", cache: "Cache", well: "Well", guard: "Guardian", door: "Passage" };
const neighbours = i => { const out = []; try { for (let d = 0; d < 6; d++) { const j = nb(i, d); if (j >= 0 && D.reg[j] >= 0) out.push(j); } } catch (e) {} return out; };
const landFlags = me => { const L = R().lands; return L[me.hex] || (L[me.hex] = { c: {}, g: 0 }); };

// ---------- building a land ----------
const worldInit = me => {
  const P = me.pn, T = me.T, Rn = R(), info = landInfo(me.hex), r = rngOf(hash(Rn.seed + "|" + me.hex)), W = P.W = { info, sh: [], trial: null, orbs: [], tele: [], G: null, greet: {} };
  if (!Rn.lands[me.hex]) { Rn.nLands++; landFlags(me); }
  const F = landFlags(me), gods = info.pan.gods, chosen = [];
  const wpick = () => { let tot = 0; const w = gods.map((g, i) => chosen.includes(g) ? 0 : 1 / (1 + i * .06)); for (const x of w) tot += x; let u = r() * tot; for (let i = 0; i < gods.length; i++) { u -= w[i]; if (u <= 0) return gods[i]; } return gods[0]; };
  for (let k = 0; k < 3; k++) chosen.push(wpick());
  const nbs = neighbours(me.hex).map(j => landInfo(j).pan).filter(p => p !== info.pan); if (nbs.length && r() < .45) { const fp = nbs[Math.floor(r() * nbs.length)]; chosen[2] = fp.gods[Math.floor(r() * Math.min(12, fp.gods.length))]; }
  const pat = Rn.patron && GOD[Rn.patron]; if (pat && !chosen.includes(pat)) chosen[1] = pat;
  const sx = me.sx || 0, sz = me.sz || 0, a0 = r() * 6.283;
  const spot = (ang, d) => { for (let t = 0; t < 14; t++) { const a = ang + (r() - .5) * .5 * (1 + t * .3), dd = d * (1 + (r() - .5) * .3) + t * 3, x = sx + Math.cos(a) * dd, z = sz + Math.sin(a) * dd; if (me.H(x, z) > .35 && Math.hypot(x, z) < 590) return [x, z]; } return [sx + Math.cos(ang) * d * .5, sz + Math.sin(ang) * d * .5]; };
  const add = (kind, ang, d, extra) => { const [x, z] = spot(ang, d), s = Object.assign({ kind, i: W.sh.length, x, z, y: Math.max(me.H(x, z), 0), state: F.c[W.sh.length] ? "done" : "idle" }, extra); W.sh.push(s); return s; };
  chosen.forEach((g, k) => add("god", a0 + k * 2.094, 46 + r() * 22, { god: g, patron: g === pat }));
  add("cache", a0 + 1.05, 78 + r() * 16, { reward: ["laurel", "anvil", "heart"][Math.floor(r() * 3)] });
  add("well", a0 + 3.14, 26 + r() * 8, {});
  const gn = GUARD[info.pan.id] || ["The Beast of the Land"]; add("guard", a0 + 4.2, 112 + r() * 20, { name: gn[Math.floor(r() * gn.length)] }); if (F.g) W.sh[W.sh.length - 1].state = "done";
  W.kinds = [...new Set(me.mobs.filter(m => !m.boss && !m.tame).map(m => m.k))];
  for (const s of W.sh) safeBuild(me, s);
  if (F.g) openDoors(me);
  if (mir("start") && !Rn.started) { Rn.started = 1; const g = chosen[0], o = offerFor(me, g, mir("start") > 1 ? .5 : 0, r)[0]; if (o) { takeBoon(me, o, true); later(me, 3.5, () => banner("Head Start", `${boonName(o)} · ${g.n}`, 2600, DOM[CAT[o.id].dom].c)); } }
  Rn.started = 1; save();
};
const colOf = s => s.kind === "god" ? domOf(s.god).c : s.kind === "cache" ? "#ffd27a" : s.kind === "well" ? "#7fe6ff" : s.kind === "guard" ? "#ff5a3a" : "#c9a6ff";
const safeBuild = (me, s) => { try { build(me, s); } catch (e) { warn(e); } };
const build = (me, s) => {
  const T = me.T, g = new T.Group(), c = new T.Color(colOf(s)), done = s.state === "done"; g.position.set(s.x, s.y, s.z); s.grp = g;
  const stone = new T.MeshLambertMaterial({ color: s.kind === "guard" ? 0x4a3a3a : 0x8d8778 }), b1 = new T.Mesh(new T.CylinderGeometry(1.9, 2.2, .45, 10), stone), b2 = new T.Mesh(new T.CylinderGeometry(1.25, 1.5, .5, 10), stone); b1.position.y = .22; b2.position.y = .7; g.add(b1, b2);
  if (s.kind === "door") { const pm = new T.MeshLambertMaterial({ color: 0x9a9484 }); for (const sd of [-1, 1]) { const p = new T.Mesh(new T.BoxGeometry(.5, 4.2, .5), pm); p.position.set(sd * 1.5, 2.1, 0); g.add(p); } const l = new T.Mesh(new T.BoxGeometry(3.8, .5, .6), pm); l.position.y = 4.4; g.add(l);
    const veil = new T.Mesh(new T.PlaneGeometry(2.5, 3.9), new T.MeshBasicMaterial({ color: c, transparent: true, opacity: .55, side: T.DoubleSide, depthWrite: false, blending: T.AdditiveBlending, fog: false })); veil.position.y = 2.2; g.add(veil); s.veil = veil; g.rotation.y = s.rot || 0; b1.visible = b2.visible = false; }
  else if (s.kind === "well") { const w = new T.Mesh(new T.CylinderGeometry(1, 1, .3, 14), new T.MeshBasicMaterial({ color: c, transparent: true, opacity: .8 })); w.position.y = .98; g.add(w); s.orb = w; }
  else { const tex = sigilTex(me, s), sp = new T.Sprite(new T.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, fog: false, opacity: done ? .28 : 1 })); sp.scale.set(2.6, 2.6, 1); sp.position.y = 3.1; g.add(sp); s.orb = sp;
    const glow = new T.Sprite(new T.SpriteMaterial({ map: glowTex(me), color: c, transparent: true, depthWrite: false, blending: T.AdditiveBlending, fog: false, opacity: done ? 0 : .7 })); glow.scale.set(5.2, 5.2, 1); glow.position.y = 3.1; g.add(glow); s.glow = glow; }
  if (!done) { const beam = new T.Mesh(new T.CylinderGeometry(.5, .5, 140, 8, 1, true), new T.MeshBasicMaterial({ color: c, transparent: true, opacity: s.kind === "door" ? .3 : .38, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide, fog: false })); beam.position.y = 70; g.add(beam); s.beam = beam; }
  const ring = new T.Mesh(new T.RingGeometry(2.5, 2.8, 40), new T.MeshBasicMaterial({ color: c, transparent: true, opacity: done ? .15 : .7, side: T.DoubleSide, depthWrite: false, fog: false })); ring.rotation.x = -Math.PI / 2; ring.position.y = .08; g.add(ring); s.ring = ring;
  me.scene.add(g);
};
const dim = (me, s) => { s.state = "done"; if (s.beam) { s.grp.remove(s.beam); s.beam = null; } if (s.orb && s.orb.material) s.orb.material.opacity = .28; if (s.glow) s.glow.material.opacity = 0; if (s.ring) s.ring.material.opacity = .15; if (s.kind !== "guard" && s.kind !== "door") { landFlags(me).c[s.i] = 1; save(); } };
const label = s => s.kind === "god" ? `${s.god.n}, ${s.god.e}` : s.kind === "cache" ? ({ laurel: "Laurel of the Victor", anvil: "The Anvil", heart: "Heart of the Land" })[s.reward] : s.kind === "well" ? "The Well of Offerings" : s.kind === "guard" ? s.name : `Passage to ${s.to.state || s.to.place || "the wilds"}`;
const prompt = (me, s) => { const W = me.pn.W;
  if (W.trial) return null; if (s.state === "done") return s.kind === "well" ? "The well is dry" : null;
  if (s.kind === "god") return `E · Accept the trial of ${s.god.n}${s.patron ? " (your patron)" : ""}`;
  if (s.kind === "cache") return `E · Fight for ${label(s)}`;
  if (s.kind === "well") return "E · Make an offering at the well";
  if (s.kind === "guard") { const need = 2 - W.sh.filter(q => q.kind === "god" && q.state === "done").length; return need > 0 ? `Sealed · clear ${need} more shrine${need > 1 ? "s" : ""} to wake ${s.name}` : `E · Wake ${s.name}`; }
  return `E · ${label(s)} · ${s.to.pan.name} gods`; };

// ---------- trials ----------
const kindsOf = me => { const W = me.pn.W; let ks = W.kinds.filter(k => { try { return !!SV.AN[k.split("@")[0]] || !!SV.AN[k]; } catch (e) { return false; } }); if (!ks.length) ks = ["wolf", "boar", "lion", "jackal", "hyena", "leopard", "brownbear"].filter(k => SV.AN[k]); return ks; };
const heat = () => R().depth;
const summon = (me, s, k, elite) => { let m = null; try { m = me.spawn(k, false, false); } catch (e) { warn(e); } if (!m) return null;
  for (let t = 0; t < 12; t++) { const a = Math.random() * 6.283, d = 11 + Math.random() * 9, x = s.x + Math.cos(a) * d, z = s.z + Math.sin(a) * d; if (me.H(x, z) > .2) { m.root.position.set(x, me.H(x, z), z); break; } }
  const h = heat(), c = colOf(s); m.noRe = 1; m.angry = 999; m.pnT = 1; m.hp = m.mx = m.mx * (1 + .1 * h) * (elite ? 1.25 : .5); m.a[7] *= (1 + .05 * h) * (elite ? 1.25 : 1); m.a[8] = 999;
  if (elite) { m.champ = 1; m.pnC = "#ffd23a"; m.root.scale.multiplyScalar(1.22); m.a[9] = "Champion " + m.a[9]; m.root.traverse(o => { if (o.material && o.material.emissive) o.material.emissive.setHex(0x3a2a00); }); }
  fxPillar(me, mp(m).clone(), c, 18, .5); fxRing(me, mp(m), c, 2, .4); return m; };
const startTrial = (me, s) => { const W = me.pn.W, ks = kindsOf(me); if (!ks.length) { complete(me, s); return; }
  s.state = "trial"; W.trial = { s, wave: 0, waves: heat() >= 6 ? 3 : 2, ms: [], t: 0, ks, haz: s.kind === "god" && heat() >= 1 ? HAZ[s.god.d[0]] : null, hz: 5 }; if (s.beam) s.beam.material.opacity = .7;
  { const T = me.T, a = new T.Mesh(new T.RingGeometry(23.6, 24, 72), new T.MeshBasicMaterial({ color: new T.Color(colOf(s)), transparent: true, opacity: .5, side: T.DoubleSide, depthWrite: false, fog: false })); a.rotation.x = -Math.PI / 2; a.position.set(s.x, s.y + .25, s.z); me.scene.add(a); W.trial.arena = a; }
  const nm = s.kind === "god" ? s.god.n : label(s); banner(s.kind === "god" ? "Trial of" : "Trial", nm, 2200, colOf(s)); sfx(me, "trial"); musicMood(me, 1); nextWave(me); };
const nextWave = me => { const W = me.pn.W, Tr = W.trial, s = Tr.s; Tr.wave++; const last = Tr.wave === Tr.waves, n = Math.min(6, 2 + Math.floor(heat() / 4) + (Tr.wave > 1 ? 1 : 0));
  for (let i = 0; i < n; i++) { const m = summon(me, s, pick(Tr.ks), false); if (m) Tr.ms.push(m); }
  if (last) { const m = summon(me, s, pick(Tr.ks), true); if (m) Tr.ms.push(m); }
  if (Tr.wave > 1) { banner("", last ? "The champion comes" : "They come again", 1400, colOf(s)); sfx(me, "wave2"); } };
const worldKill = (me, m) => {};
const trialTick = (me, dt) => { const W = me.pn.W, Tr = W.trial; if (!Tr) return; Tr.t += dt;
  let left = 0; for (const m of Tr.ms) { if (m.dead || !me.mobs.includes(m)) continue; left++; if (m.angry < 60) m.angry = 999; }
  Tr.left = left; if (Tr.arena) Tr.arena.material.opacity = .35 + Math.sin(me.tnow * 3) * .15;
  if (Tr.haz && left > 0 && (Tr.hz -= dt) <= 0) { Tr.hz = Math.max(3, 5.5 - heat() * .12); const s = Tr.s, c = colOf(s), who = s.god.n, md = me.mdir || [0, 0], mv = me.moving ? 1 : 0;
    if (Tr.haz === "strike") for (let i = 0; i < 2 + (heat() > 5 ? 1 : 0); i++) telegraph(me, me.pos.x + md[0] * mv * i * 3 + (Math.random() - .5) * (i ? 5 : 1), me.pos.z + md[1] * mv * i * 3 + (Math.random() - .5) * (i ? 5 : 1), 2.4, .9 + i * .2, 9, who, c);
    else if (Tr.haz === "ring") telegraph(me, me.pos.x, me.pos.z, 6.2, 1.5, 11, who, c);
    else for (let i = 0; i < 2; i++) { const o = fxOrb(me, c, 1.1); o.position.set(s.x + (i ? 1.5 : -1.5), s.y + 2.6, s.z); W.orbs.push({ o, v: new me.T.Vector3(0, 0, 0), t: 0, life: 5.5, dmg: 8, who, home: 6.5 }); } }
  if (Tr.boss || left > 0 || Tr.t < .6) return;
  if (Tr.wave < Tr.waves) { Tr.t = 0; later(me, .7, () => { if (me.pn.W.trial === Tr) nextWave(me); }); Tr.ms = []; Tr.t = -1; return; }
  W.trial = null; if (Tr.arena) { me.scene.remove(Tr.arena); Tr.arena.geometry.dispose(); Tr.arena.material.dispose(); } for (const q of W.tele) me.scene.remove(q.a, q.b); W.tele = []; for (const o of W.orbs) me.scene.remove(o.o); W.orbs = []; complete(me, Tr.s); };
const complete = (me, s) => { const Rn = R(), M = mods(me), c = colOf(s); Rn.depth++; st.meta.best = Math.max(st.meta.best, Rn.depth); dim(me, s);
  const sh = Math.round((3 + Rn.depth * .6) * (1 + M.coin)); st.meta.shards += sh; Rn.shards = (Rn.shards || 0) + sh; me.dropCoins && me.dropCoins(new me.T.Vector3(s.x, s.y, s.z), Math.round((14 + 3 * Rn.depth) * (1 + M.coin)));
  if (M.trialHeal) heal(me, M.trialHeal); me.slowT = .9; me.shake = .3; banner("Trial cleared", `+${sh} shards`, 1700, c); sfx(me, "clear"); musicMood(me, 0); fxRing(me, new me.T.Vector3(s.x, s.y, s.z), c, 14, .9); save();
  later(me, 1.25, () => reward(me, s)); };
const reward = (me, s) => { if (cur() !== me) return;
  if (s.kind === "god") offerBoons(me, [s.god], 0, s);
  else if (s.reward === "laurel") offerLaurel(me);
  else if (s.reward === "anvil") offerAnvil(me);
  else { R().hearts++; dirty(); heal(me, 25); banner("Heart of the Land", "+25 maximum health", 2400, "#ff6a7a"); sfx(me, "boon"); save(); } };

// ---------- offers ----------
const rollRar = (me, boost = 0, r = Math.random) => { const l = mods(me).luck + boost + R().depth * .004, u = r(); return u < .02 + l * .5 ? 3 : u < .1 + l ? 2 : u < .34 + l * 1.5 ? 1 : 0; };
const poolOf = g => { const d1 = g.d[0], d2 = g.d[1], ids = ["A", "S", "C", "D", "G", "P1", "P2"].map(s => d1 + ":" + s); if (d2 && d2 !== d1 && DOM[d2]) ids.push(d2 + ":P1", d2 + ":P2", d2 + ":" + "ASCDG"[hash(g.id) % 5]); return ids; };
const offerFor = (me, g, boost = 0, r = Math.random) => { const own = R().boons, out = [], pool = poolOf(g).filter(id => !own.some(b => b.id === id)), sp = specials(g);
  if (sp.length && r() < .75) out.push(sp[Math.floor(r() * sp.length)]);
  const w = id => { const c = CAT[id]; return c.slot === "P" ? 2 : boonIn(c.slot) ? 1 : 3.2; }; const bag = pool.slice();
  while (out.length < 3 && bag.length) { let tot = 0; for (const id of bag) tot += w(id); let u = r() * tot, k = 0; for (; k < bag.length - 1; k++) { u -= w(bag[k]); if (u <= 0) break; } const id = bag.splice(k, 1)[0]; out.push({ id, god: g.id, rar: rollRar(me, boost, r), lv: 1 }); }
  return out; };
const takeBoon = (me, o, quiet) => { const Rn = R(), c = CAT[o.id]; if (c.slot !== "P") Rn.boons = Rn.boons.filter(b => CAT[b.id].slot !== c.slot); Rn.boons.push({ id: o.id, god: o.god, rar: o.rar, lv: o.lv || 1 }); Rn.gods[o.god] = (Rn.gods[o.god] || 0) + 1; st.meta.codex[o.god] = (st.meta.codex[o.god] || 0) + 1; dirty(); save();
  if (!Rn.patron && GOD[o.god]) { Rn.patron = o.god; const g = GOD[o.god]; later(me, quiet ? 5 : 1.2, () => { banner("Your patron", g.n, 2600, domOf(g).c); me.say(`${g.n} is your patron for this run: a shrine of ${g.n} will wait in every land you enter.`, 6000); }); }
  if (!quiet) { const d = DOM[c.dom]; sfx(me, "boon"); fxPillar(me, me.pos.clone(), d.c, 30, .9, 1.1); fxRing(me, me.pos, d.c, 6, .6); fxBurst(me, me.pos.clone().setY(me.pos.y + 1.2), d.c, 26); } };
const cardOf = (me, o) => { const c = CAT[o.id], g = GOD[o.god], d = DOM[c.dom], old = c.slot !== "P" && boonIn(c.slot);
  return { img: domSigilURL(PANBY[g.pan].art, c.dom), title: boonName(o), tag: `${RAR[o.rar].n} · ${c.slot === "P" ? "Blessing" : SLOT[c.slot] + " · " + SLOTKEY[c.slot]}`, text: boonText(o), color: d.c, rc: RAR[o.rar].c, god: g, note: old ? `Replaces ${boonName(old)}` : "", dom: d }; };
const offerBoons = (me, gods, boost, s) => { const mk = () => { let os = []; if (gods.length === 1) os = offerFor(me, gods[0], boost); else for (const g of gods) { const o = offerFor(me, g, boost)[0]; if (o) os.push(o); }
    if (os.length < 3) { const ups = R().boons.filter(b => b.lv < 5).sort(() => Math.random() - .5).slice(0, 3 - os.length); for (const b of ups) os.push({ up: b }); } return os; };
  R().owed = { k: "gods", ids: gods.map(g => g.id), boost }; let os = mk(); if (!os.length) { delete R().owed; st.meta.shards += 10; banner("The gods have nothing more to give", "+10 shards", 2200); save(); return; }
  const g0 = gods[0], show = () => offer(me, { kicker: gods.length === 1 ? g0.e : "The gods of the land", title: gods.length === 1 ? g0.n : "Choose a Patron", sub: gods.length === 1 ? `${PANBY[g0.pan].name} · ${domOf(g0).n}${dom2Of(g0) ? " & " + dom2Of(g0).n : ""}` : "", color: gods.length === 1 ? domOf(g0).c : "#ffe9a8", line: gods.length === 1 ? pick(LINES[g0.d[0]] || LINES.Z) : "", god: gods.length === 1 ? g0 : null,
    cards: os.map(o => o.up ? laurelCard(o.up) : cardOf(me, o)), rerolls: R().rr, onReroll: () => { R().rr--; os = mk(); save(); show(); },
    onPick: i => { const o = os[i]; if (o.up) levelUp(me, o.up); else takeBoon(me, o); } });
  show(); };
const laurelCard = b => { const c = CAT[b.id], d = DOM[c.dom], nb2 = Object.assign({}, b, { lv: b.lv + 1 }); return { img: domSigilURL(PANBY[(GOD[b.god] || GODS[0]).pan].art, c.dom), title: boonName(b), tag: `Laurel · Lv ${b.lv} → ${b.lv + 1}`, text: boonText(nb2), color: d.c, rc: "#ffd27a", god: GOD[b.god], note: "", dom: d }; };
const levelUp = (me, b) => { b.lv++; dirty(); save(); sfx(me, "boon"); fxPillar(me, me.pos.clone(), "#ffd27a", 26, .8); fxBurst(me, me.pos.clone().setY(me.pos.y + 1.2), "#ffd27a", 20); };
const offerLaurel = me => { R().owed = { k: "laurel" }; const bs = R().boons.filter(b => b.lv < 5).sort(() => Math.random() - .5).slice(0, 3); if (!bs.length) { delete R().owed; st.meta.shards += 12; save(); banner("Laurel of the Victor", "No boon to raise: +12 shards", 2400, "#ffd27a"); return; }
  offer(me, { kicker: "Reward", title: "Laurel of the Victor", sub: "Raise one boon by a level", color: "#ffd27a", cards: bs.map(laurelCard), onPick: i => levelUp(me, bs[i]) }); };
const offerAnvil = me => { R().owed = { k: "anvil" }; const ks = Object.keys(FORGE).filter(k => !R().forge.includes(k)).sort(() => Math.random() - .5).slice(0, 3); if (!ks.length) { delete R().owed; return; }
  offer(me, { kicker: "Reward", title: "The Anvil", sub: "A mark hammered into your arms, for this run", color: "#c9d2e4", cards: ks.map(k => ({ title: FORGE[k].n, tag: "Anvil mark", text: FORGE[k].t, color: "#c9d2e4", rc: "#c9d2e4", dom: DOM.O })),
    onPick: i => { const k = ks[i]; R().forge.push(k); if (FORGE[k].now) FORGE[k].now(); dirty(); save(); sfx(me, "anvil"); fxBurst(me, me.pos.clone().setY(me.pos.y + 1.2), "#ffb060", 24); } }); };
const openWell = (me, s) => { const Rn = R(), r = rngOf(hash(Rn.seed + "|well|" + me.hex)), h = heat(), g = pick(me.pn.W.info.pan.gods, r);
  const all = [{ n: "Draught of the Spring", t: "Restore 40 health.", cost: 30, go: () => heal(me, 40) }, { n: "Votive Laurel", t: "Raise a random boon by a level.", cost: 80 + 6 * h, ok: () => R().boons.some(b => b.lv < 5), go: () => { const b = pick(R().boons.filter(b => b.lv < 5)); if (b) levelUp(me, b); } },
    { n: `Favour of ${g.n}`, t: `A boon of ${g.n}, ${g.e}.`, cost: 70 + 8 * h, go: () => { const o = offerFor(me, g, .1)[0]; if (o) { takeBoon(me, o); banner(boonName(o), g.n, 2400, DOM[CAT[o.id].dom].c); } } },
    { n: "Heart of the Land", t: "+25 maximum health.", cost: 120 + 10 * h, go: () => { R().hearts++; dirty(); heal(me, 25); } }, { n: "Whetstone of the Smiths", t: "A random Anvil mark.", cost: 110 + 8 * h, ok: () => Object.keys(FORGE).some(k => !R().forge.includes(k)), go: () => { const k = pick(Object.keys(FORGE).filter(k => !R().forge.includes(k))); R().forge.push(k); if (FORGE[k].now) FORGE[k].now(); dirty(); banner(FORGE[k].n, FORGE[k].t, 2600, "#c9d2e4"); } },
    { n: "Ichor of the Gods", t: "+1 Ichor, to raise an Aspect of your arms (O).", cost: 200, go: () => { st.meta.ichor++; } }];
  const items = all.sort(() => r() - .5).slice(0, 3), bought = s.bought || (s.bought = {});
  const show = () => offer(me, { kicker: "The Well of Offerings", title: `${me.prog.coins || 0} coins`, sub: "Cast coin into the water. E or Esc to leave.", color: "#7fe6ff", shop: 1,
    cards: items.map((it, i) => ({ title: it.n, tag: bought[i] ? "Taken" : `${it.cost} coins`, text: it.t, color: "#7fe6ff", rc: bought[i] || (me.prog.coins || 0) < it.cost || (it.ok && !it.ok()) ? "#666" : "#ffd23a", dom: DOM.W, off: bought[i] || (me.prog.coins || 0) < it.cost || (it.ok && !it.ok()) })),
    onPick: i => { const it = items[i]; if (bought[i] || (me.prog.coins || 0) < it.cost || (it.ok && !it.ok())) { sfx(me, "no"); return false; } me.prog.coins -= it.cost; me.saveProg && me.saveProg(); bought[i] = 1; it.go(); sfx(me, "coin"); save(); show(); return false; } });
  show(); };

// ---------- the guardian ----------
const hurtMe = (me, v, who) => { const P = me.pn; if (me.hp <= 0 || me.rollT > 0 || P.invT > me.tnow) return; me.hp -= v * (1 + .05 * heat()) / me.up("hp"); me.hurtT = 1; me.hpDraw && me.hpDraw(); const hu = $("svHurt"); if (hu) { hu.style.opacity = .55; setTimeout(() => hu.style.opacity = 0, 180); } me.shake = Math.max(me.shake || 0, .35);
  if (me.hp <= 0) { me.say && me.say(`Slain by ${who}`, 1800); setTimeout(() => { if (cur() !== me) return; me.hp = 100; me.pos.set(me.sx || 0, me.H(me.sx || 0, me.sz || 0), me.sz || 0); me.by = me.pos.y; (me.mobs || []).forEach(x => { x.angry = 0; }); me.hpDraw && me.hpDraw(); }, 0); } };
const wakeGuard = (me, s) => { const W = me.pn.W, ks = kindsOf(me).slice().sort((a, b) => ((SV.AN[b] || [])[6] || 0) - ((SV.AN[a] || [])[6] || 0)); if (!ks.length) { guardReward(me, s); return; }
  let m = null; try { m = me.spawn(ks[0], false, true); } catch (e) { warn(e); } if (!m) { guardReward(me, s); return; }
  const h = heat(), K = 1.45; m.root.position.set(s.x + 6, me.H(s.x + 6, s.z + 6), s.z + 6); m.root.scale.multiplyScalar(K); m.a[1] *= K; m.a[2] *= K; m.a[9] = s.name; m.named = 1; m.noRe = 1; m.angry = 9999; m.a[8] = 999; m.pnG = 1; m.pnC = "#ff5a3a"; m.champ = 1;
  m.hp = m.mx = (520 + 150 * h) * (1 + .1 * R().guardians); m.a[7] *= 1.15 + .05 * h; m.tr.delete("ghostly"); m.tr.delete("fragile"); m.tr.delete("armored");
  const seen = new Set(); m.root.traverse(o => { const mt = o.material; if (mt && mt.color && !seen.has(mt)) { seen.add(mt); const l = mt.color.r * .3 + mt.color.g * .59 + mt.color.b * .11; mt.color.setRGB(.2 + l * .7, .06 + l * .2, .05 + l * .12); if (mt.emissive) mt.emissive.setHex(0x2a0500); } });
  s.state = "trial"; W.G = { m, s, cd: 2.5, n: 0, adds: 0 }; W.trial = { s, wave: 1, waves: 1, ms: [m], t: 0, ks, boss: 1 };
  banner("Guardian of " + (W.info.place || W.info.state || "the land"), s.name, 3400, "#ff5a3a"); sfx(me, "boss"); musicMood(me, 2); me.shake = .5; fxPillar(me, mp(m).clone(), "#ff5a3a", 40, 1); };
const HAZ = { S: "strike", K: "strike", U: "strike", M: "strike", Z: "strike", F: "strike", W: "ring", C: "ring", E: "ring", R: "ring", D: "wisp", X: "wisp", V: "wisp", L: "wisp", T: "wisp" };
const telegraph = (me, x, z, r, dur, dmg, who, col = "#ff3020") => { const T = me.T, y = Math.max(me.H(x, z), 0) + .12, mk = (g, op) => { const o = new T.Mesh(g, new T.MeshBasicMaterial({ color: new T.Color(col), transparent: true, opacity: op, side: T.DoubleSide, depthWrite: false, fog: false })); o.rotation.x = -Math.PI / 2; o.position.set(x, y, z); me.scene.add(o); return o; };
  me.pn.W.tele.push({ a: mk(new T.RingGeometry(r - .14, r, 44), .9), b: mk(new T.CircleGeometry(r, 36), .3), x, z, r, t: 0, dur, dmg, who, col }); };
const guardTick = (me, dt) => { const W = me.pn.W, G = W.G;
  for (let i = W.tele.length - 1; i >= 0; i--) { const q = W.tele[i]; q.t += dt; const k = Math.min(1, q.t / q.dur); q.b.scale.setScalar(Math.max(.02, k));
    if (k >= 1) { me.scene.remove(q.a, q.b); q.a.geometry.dispose(); q.b.geometry.dispose(); W.tele.splice(i, 1); fxRing(me, new me.T.Vector3(q.x, q.a.position.y, q.z), q.col, q.r, .3); sfx(me, "slam");
      if (Math.hypot(me.pos.x - q.x, me.pos.z - q.z) < q.r && !((me.jy || 0) > 1.1)) hurtMe(me, q.dmg, q.who); } }
  for (let i = W.orbs.length - 1; i >= 0; i--) { const o = W.orbs[i], p = o.o.position; o.t += dt; if (o.home) { const dx = me.pos.x - p.x, dy = me.pos.y + 1.1 - p.y, dz = me.pos.z - p.z, l = Math.hypot(dx, dy, dz) || 1; o.v.x += (dx / l * o.home - o.v.x) * Math.min(1, dt * 2.2); o.v.y += (dy / l * o.home - o.v.y) * Math.min(1, dt * 2.2); o.v.z += (dz / l * o.home - o.v.z) * Math.min(1, dt * 2.2); } p.addScaledVector(o.v, dt); const hit = Math.hypot(p.x - me.pos.x, p.z - me.pos.z) < .95 && Math.abs(p.y - me.pos.y - 1 - (me.jy || 0)) < 1.5;
    if (hit) hurtMe(me, o.dmg, o.who); if (hit || o.t > o.life) { me.scene.remove(o.o); W.orbs.splice(i, 1); } }
  if (!G) return; if (G.m.dead || !me.mobs.includes(G.m)) { guardDown(me); return; } const m = G.m, p = mp(m), low = m.hp < m.mx * .5; G.cd -= dt;
  if (low && !G.adds) { G.adds = 1; banner("", `${G.s.name} calls its brood`, 1600, "#ff5a3a"); for (let i = 0; i < 2; i++) { const a = summon(me, G.s, pick(W.trial ? W.trial.ks : kindsOf(me)), false); if (a && W.trial) W.trial.ms.push(a); } }
  if (G.cd > 0 || m.stun > 0) return; G.cd = low ? 2.4 : 3.4; const k = G.n++ % 3, d = Math.hypot(me.pos.x - p.x, me.pos.z - p.z);
  if (k === 0 || d < 6) { telegraph(me, p.x, p.z, 7.5, 1.05, 22, G.s.name); me.tele && me.tele(m, 1, "!"); }
  else if (k === 1) { const n = low ? 14 : 10, a0 = Math.random() * 6.28; for (let i = 0; i < n; i++) { const a = a0 + i / n * 6.283, o = fxOrb(me, "#ff5a3a", 1.2); o.position.set(p.x, p.y + 1.1, p.z); W.orbs.push({ o, v: new me.T.Vector3(Math.sin(a) * 9, 0, Math.cos(a) * 9), t: 0, life: 3.2, dmg: 11, who: G.s.name }); } sfx(me, "volley"); }
  else { const md = me.mdir || [0, 0]; for (let i = 0; i < (low ? 5 : 3); i++) telegraph(me, me.pos.x + (me.moving ? md[0] * i * 3.2 : (Math.random() - .5) * 7), me.pos.z + (me.moving ? md[1] * i * 3.2 : (Math.random() - .5) * 7), 2.7, .85 + i * .16, 17, G.s.name); } };
const guardDown = me => { const W = me.pn.W, G = W.G, s = G.s; W.G = null; for (const q of W.tele) me.scene.remove(q.a, q.b); W.tele = []; for (const o of W.orbs) me.scene.remove(o.o); W.orbs = [];
  if (W.trial) for (const a of W.trial.ms) if (a !== G.m && alive(a)) { a.hp = 0; finish(me, a); } W.trial = null;
  const Rn = R(); Rn.guardians++; Rn.depth++; st.meta.best = Math.max(st.meta.best, Rn.depth); st.meta.ichor++; const sh = Math.round((15 + 2 * Rn.depth) * (1 + mods(me).coin)); st.meta.shards += sh; Rn.shards = (Rn.shards || 0) + sh; landFlags(me).g = 1; dim(me, s); save();
  me.slowT = 1.4; me.shake = .6; banner("Guardian slain", `+1 Ichor · +${sh} shards`, 3000, "#ffd27a"); sfx(me, "victory"); musicMood(me, 0); fxRing(me, new me.T.Vector3(s.x, s.y, s.z), "#ffd27a", 22, 1.2);
  later(me, 2.2, () => guardReward(me, s)); };
const guardReward = (me, s) => { if (cur() !== me) return; const W = me.pn.W, gs = W.info.pan.gods.slice().sort(() => Math.random() - .5).slice(0, 3); if (s.state !== "done") { landFlags(me).g = 1; dim(me, s); }
  offerBoons(me, gs, .22, s); openDoors(me); later(me, .5, () => me.say("Passages have opened beside the guardian's altar. Step through to carry your boons to another land.", 6000)); };
const openDoors = me => { const W = me.pn.W; if (W.doors) return; W.doors = 1; const gs = W.sh.find(q => q.kind === "guard"); if (!gs) return; const js = neighbours(me.hex).sort(() => Math.random() - .5).slice(0, 3);
  js.forEach((j, k) => { const a = (k - (js.length - 1) / 2) * .9 + Math.atan2(gs.z - (me.sz || 0), gs.x - (me.sx || 0)), x = gs.x + Math.cos(a) * 9, z = gs.z + Math.sin(a) * 9, s = { kind: "door", i: W.sh.length, x, z, y: Math.max(me.H(x, z), 0), state: "idle", j, to: landInfo(j), rot: Math.atan2(gs.x - x, gs.z - z) }; W.sh.push(s); safeBuild(me, s); }); };
const travel = (me, s) => { const j = s.j; if (SV.open.seam) return; let ang = 0; try { ang = Math.atan2(cy[j] - cy[me.hex], cx[j] - cx[me.hex]); } catch (e) {} sfx(me, "door"); const f = $("svFade"); if (f) f.style.opacity = 1; save();
  SV.open.seam = { ang: ang + Math.PI, yaw: me.yaw, face: me.face }; setTimeout(() => { try { SV.open(j); } catch (e) { warn(e); } }, 260); };

// ---------- using what you stand next to ----------
const nearest = me => { const W = me.pn.W; if (!W) return null; let best = null, bd = 5.2; for (const s of W.sh) { const d = Math.hypot(s.x - me.pos.x, s.z - me.pos.z); if (d < bd) { bd = d; best = s; } } return best; };
const interact = me => { const s = nearest(me), W = me.pn.W; if (!s || W.trial || s.state === "done" || me.hp <= 0) return false;
  if (s.kind === "god" || s.kind === "cache") startTrial(me, s);
  else if (s.kind === "well") openWell(me, s);
  else if (s.kind === "guard") { if (W.sh.filter(q => q.kind === "god" && q.state === "done").length < 2) { me.say(prompt(me, s), 2200); sfx(me, "no"); } else wakeGuard(me, s); }
  else travel(me, s);
  return true; };
const worldTick = (me, dt, t) => { const W = me.pn.W; if (!W) return; trialTick(me, dt); guardTick(me, dt);
  for (const s of W.sh) { if (!s.grp) continue; const d = Math.hypot(s.x - me.pos.x, s.z - me.pos.z);
    if (s.orb && s.kind !== "well") s.orb.position.y = 3.1 + Math.sin(t * 1.8 + s.i) * .22; if (s.ring) s.ring.rotation.z = t * .6 * (s.i % 2 ? 1 : -1); if (s.veil) s.veil.material.opacity = .4 + Math.sin(t * 4 + s.i) * .15;
    if (s.kind === "god" && s.state === "idle" && d < 16 && !W.greet[s.i]) { W.greet[s.i] = 1; const g = s.god; banner(g.e, g.n, 2600, domOf(g).c); sfx(me, "greet"); later(me, .9, () => me.say(`${g.n}: “${pick(LINES[g.d[0]] || LINES.Z)}”`, 4200)); } }
};
const endRun = me => { const Rn = R(), M = st.meta, bonus = Rn.depth * 2; M.shards += bonus; M.runs++; const sum = { depth: Rn.depth, kills: Rn.kills, lands: Rn.nLands, boons: Rn.boons.length, shards: (Rn.shards || 0) + bonus, guardians: Rn.guardians, t: Math.round((Date.now() - Rn.t0) / 1000), best: M.best, top: Object.entries(Rn.gods).sort((a, b) => b[1] - a[1])[0] };
  const W = me.pn.W; if (W) { for (const s of W.sh) if (s.grp) me.scene.remove(s.grp); for (const q of W.tele) me.scene.remove(q.a, q.b); for (const o of W.orbs) me.scene.remove(o.o); if (W.trial) { if (W.trial.arena) me.scene.remove(W.trial.arena); for (const a of W.trial.ms) if (alive(a)) { a.angry = 0; a.pnT = 0; } } }
  st.run = newRun(); dirty(); save(); me.pn.call = null; me.pn.shield = 0; musicMood(me, 0);
  try { worldInit(me); } catch (e) { warn(e); } deathScreen(me, sum); };
