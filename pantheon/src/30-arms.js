/* The five arms and their Aspects (kept for ever, raised with Ichor), the Anvil's marks (one run only),
   and the Tablet of Destinies (kept for ever, bought with Shards). */
const ARMS = { sword: "The Xiphos", axe: "The Labrys", hammer: "The Maul", spear: "The Dory", bow: "The Horn Bow" };
const armOf = me => me.weapon === "bow" ? "bow" : ARMS[me.melee] ? me.melee : null;
const ASPCOST = [1, 1, 2, 3, 4];   // Ichor for rank 1..5 (the Wanderer's first rank is free)
// stats(l, M, me) adds to the totals; hit / kill / dash / parry / hurtMe are called from the combat hooks with the rank
const ASPECTS = {
  sword: [
    { id: "wanderer", n: "Aspect of the Wanderer", who: "Yours, as you found it.", text: l => `Attack +${5 * l}% damage.`, stats: (l, M) => { M.atkDmg += .05 * l; } },
    { id: "alexander", n: "Aspect of Alexander", who: "The blade that crossed the Hydaspes.", text: l => `Each kill: +${4 * l}% damage for 8 seconds, five deep.`, kill: (me, m, l) => { const P = me.pn; P.momN = Math.min(5, (P.momN || 0) + 1); P.momT = me.tnow + 8; P.momV = .04 * l; } },
    { id: "gilgamesh", n: "Aspect of Gilgamesh", who: "He who saw the Deep, and came back.", text: l => `Heavy and critical blows send a shockwave for ${30 + 15 * l}% of your power.`, hit: (me, m, dmg, I, l) => { if (I.heavy || I.crit) shock(me, m, power(me) * (.3 + .15 * l), 4, "#ffd27a"); } },
    { id: "goujian", n: "Aspect of Goujian", who: "The king of Yue's sword, bright after two thousand years.", text: l => `+${3 * l}% critical chance; critical blows Sunder.`, stats: (l, M) => { M.crit += .03 * l; }, hit: (me, m, dmg, I) => { if (I.crit) afflict(me, m, "sunder", { t: 6, max: 5, n: 2, c: DOM.O.c }); } }
  ],
  axe: [
    { id: "wanderer", n: "Aspect of the Wanderer", who: "Yours, as you found it.", text: l => `Special +${6 * l}% damage.`, stats: (l, M) => { M.specDmg += .06 * l; } },
    { id: "penthesilea", n: "Aspect of Penthesilea", who: "The Amazon queen's sagaris.", text: l => `Spinning blows deal +${12 * l}% damage and mend you.`, hit: (me, m, dmg, I, l) => { if (I.round) { m.hp -= dmg * .12 * l; heal(me, .5); } } },
    { id: "pangu", n: "Aspect of Pangu", who: "The axe that parted heaven from earth.", text: l => `Heavy blows crack the ground for ${40 + 20 * l}% of your power; +${6 * l} maximum health.`, stats: (l, M) => { M.hpmax += 6 * l; }, hit: (me, m, dmg, I, l) => { if (I.heavy) shock(me, m, power(me) * (.4 + .2 * l), 5.5, "#c9a26a"); } },
    { id: "parashurama", n: "Aspect of Parashurama", who: "Rama of the Axe, who fought alone against armies.", text: l => `+${2 * l}% damage for every foe near you (up to five).`, hit: (me, m, dmg, I, l) => { m.hp -= dmg * .02 * l * Math.min(5, near(me, me.pos, 9).length); } }
  ],
  hammer: [
    { id: "wanderer", n: "Aspect of the Wanderer", who: "Yours, as you found it.", text: l => `You take ${2 * l}% less damage.`, stats: (l, M) => { M.dr += .02 * l; } },
    { id: "sucellus", n: "Aspect of Sucellus", who: "The Good Striker's long-handled mallet.", text: l => `Kills heal ${l} health; blows have a ${4 * l}% chance to stun.`, stats: (l, M) => { M.killHeal += l; }, hit: (me, m, dmg, I, l) => { if (Math.random() < .04 * l && !m.pnG) m.stun = Math.max(m.stun || 0, .9); } },
    { id: "ukko", n: "Aspect of Ukko", who: "Ukonvasara, hammer of the sky.", text: l => `Heavy blows call lightning for ${20 * l}% of the blow.`, hit: (me, m, dmg, I, l) => { if (I.heavy) strike(me, m, "S", dmg * .2 * l, "asp"); } },
    { id: "dagda", n: "Aspect of the Dagda", who: "One end kills the living, the other wakes the dead.", text: l => `+${8 * l} maximum health${l >= 3 ? `; +${l >= 5 ? 2 : 1} Death Defiance each run` : " (rank 3: a Death Defiance)"}.`, stats: (l, M) => { M.hpmax += 8 * l; M.defiance += l >= 5 ? 2 : l >= 3 ? 1 : 0; } }
  ],
  spear: [
    { id: "wanderer", n: "Aspect of the Wanderer", who: "Yours, as you found it.", text: l => `You attack ${4 * l}% faster.`, stats: (l, M) => { M.dex += .04 * l; } },
    { id: "achilles", n: "Aspect of Achilles", who: "Pelian ash, that only he could wield.", text: l => `After a dash your next 3 blows deal +${15 * l}% damage.`, dash: (me, l) => { me.pn.rushN = 3; me.pn.rushV = .15 * l; }, hit: (me, m, dmg, I) => { const P = me.pn; if (P.rushN > 0) { P.rushN--; m.hp -= dmg * P.rushV; } } },
    { id: "lugh", n: "Aspect of Lugh", who: "The spear that thirsts, kept in a cauldron lest it burn the world.", text: l => `Thrown blows deal +${20 * l}% damage and Scorch.`, hit: (me, m, dmg, I, l) => { if (I.thrown) { m.hp -= dmg * .2 * l; afflict(me, m, "burn", { t: 3.5, x: dmg * .12 * l, c: DOM.U.c }); } } },
    { id: "leonidas", n: "Aspect of Leonidas", who: "Come and take it.", text: l => `A parry gives +${30 * l}% damage for 6 seconds and a shield against one blow.`, parry: (me, l) => { me.pn.standT = me.tnow + 6; me.pn.standV = .3 * l; me.pn.shield = Math.min(2, (me.pn.shield || 0) + 1); } }
  ],
  bow: [
    { id: "wanderer", n: "Aspect of the Wanderer", who: "Yours, as you found it.", text: l => `Attack +${5 * l}% damage.`, stats: (l, M) => { M.atkDmg += .05 * l; } },
    { id: "arjuna", n: "Aspect of Arjuna", who: "Gandiva, that never missed.", text: l => `Each arrow that lands in a row: +${3 * l}% damage, six deep. Lost when you are hurt.`, hit: (me, m, dmg, I, l) => { const P = me.pn; if (I.arrow) { m.hp -= dmg * .03 * l * (P.rowN || 0); P.rowN = Math.min(6, (P.rowN || 0) + 1); } }, hurtMe: me => { me.pn.rowN = 0; } },
    { id: "houyi", n: "Aspect of Houyi", who: "The archer who shot nine suns out of the sky.", text: l => `Arrows Scorch; +${6 * l}% damage to champions, guardians and bosses.`, stats: (l, M) => { M.bossDmg += .06 * l; }, hit: (me, m, dmg, I, l) => { if (I.arrow) afflict(me, m, "burn", { t: 3.5, x: dmg * (.2 + .06 * l), c: DOM.U.c }); } },
    { id: "heracles", n: "Aspect of Heracles", who: "Arrows dipped in the Hydra's blood.", text: l => `Arrows inflict Stupor; +${5 * l} maximum health.`, stats: (l, M) => { M.hpmax += 5 * l; }, hit: (me, m, dmg, I, l) => { if (I.arrow) afflict(me, m, "stupor", { t: 4, max: 5, x: dmg * (.1 + .03 * l), c: DOM.V.c }); } }
  ]
};
const aspRank = (arm, id) => { const a = st.meta.asp[arm] || {}; return id === "wanderer" ? Math.max(1, a[id] || 0) : a[id] || 0; };
const aspNow = me => { const arm = armOf(me); if (!arm) return null; const id = st.meta.aspSel[arm] || "wanderer", A = ASPECTS[arm].find(a => a.id === id) || ASPECTS[arm][0], l = aspRank(arm, A.id); return l > 0 ? { A, l, arm } : { A: ASPECTS[arm][0], l: aspRank(arm, "wanderer"), arm }; };
const aspectMods = (me, M) => { const a = me && aspNow(me); if (a && a.A.stats) a.A.stats(a.l, M, me); M.trialHeal += 5 * mir("libation"); M.first += .15 * mir("ambush"); M.twin = .1 * mir("twin"); };
const aspCall = (me, ev, ...args) => { try { const a = aspNow(me); if (a && a.A[ev]) a.A[ev](me, ...args, a.l); } catch (e) { warn(e); } };
const shock = (me, m, x, r, c) => { const at = mp(m).clone(); fxRing(me, at, c, r, .35); later(me, .06, () => { for (const o of near(me, at, r, m)) hurt(me, o, x, c); }); };

// The Anvil: one mark per visit, for this run only
const FORGE = {
  edge: { n: "Whetted Edge", t: "Attack +15% damage.", stats: { atkDmg: .15 } },
  pommel: { n: "Heavy Pommel", t: "Special +25% damage.", stats: { specDmg: .25 } },
  hands: { n: "Quick Hands", t: "You attack 12% faster.", stats: { dex: .12 } },
  stride: { n: "Long Stride", t: "You move 10% faster.", stats: { spd: .1 } },
  twin: { n: "Twin Strike", t: "Every Attack lands a second, lighter blow (35%).", stats: { echo: .35 } },
  cleave: { n: "Sundering Blows", t: "Every blow Sunders the foe.", stats: { sunderAll: 1 } },
  leech: { n: "Thirsting Edge", t: "Attacks mend you a little.", stats: { lifesteal: .5 } },
  pierce: { n: "Bolt of the Ancients", t: "Cast +40% damage and a wider burst.", stats: { castDmg: .4, castWide: 1 } },
  quiver: { n: "Deep Quiver", t: "+2 Casts.", stats: { castMax: 2 } },
  breaker: { n: "Giant-Breaker", t: "+40% damage to champions, guardians and bosses.", stats: { bossDmg: .4 } },
  trigger: { n: "Hair Trigger", t: "+10% critical chance.", stats: { crit: .1 } },
  quake: { n: "Shockwave", t: "Heavy blows shake the ground around the foe for 60% of your power.", stats: { quake: .6 } },
  lode: { n: "Lodestone", t: "+50% coins and shards.", stats: { coin: .5 } },
  bulwark: { n: "Bulwark", t: "You take 12% less damage.", stats: { dr: .12 } },
  wind: { n: "Second Wind", t: "+1 Death Defiance, at once.", now: () => { R().def++; } }
};

// The Tablet of Destinies: [name, text, max rank, cost per rank]
const MIRROR = {
  breath: ["Second Breath", "Death Defiance: rise once more at half health, each run.", 3, [30, 90, 220]],
  skin: ["Bronze Skin", "+10 maximum health.", 5, [10, 20, 40, 70, 110]],
  quiver: ["Votive Stones", "+1 Cast.", 2, [25, 70]],
  favour: ["Favoured", "The gods offer rarer boons (+4%).", 5, [15, 30, 50, 80, 120]],
  purse: ["Traveller's Purse", "+15% coins.", 3, [15, 35, 60]],
  dice: ["Loaded Dice", "+1 reroll of a god's offer, each run.", 4, [20, 40, 70, 110]],
  libation: ["Libation", "Clearing a trial heals 5 health.", 3, [20, 45, 80]],
  ambush: ["First Blood", "Your first blow on each foe deals +15% damage.", 3, [15, 35, 65]],
  twin: ["Twin Curses", "+10% damage to foes bearing two or more statuses.", 3, [25, 55, 95]],
  start: ["Head Start", "Begin each run with a boon of your land's gods (rank 2: a Rare one).", 2, [40, 100]]
};
PN.ASPECTS = ASPECTS; PN.FORGE = FORGE; PN.MIRROR = MIRROR;
