/* Index of the gods, the 20 domains, and "which pantheon rules this land". */
const $ = id => document.getElementById(id);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; };
const rngOf = seed => () => ((seed = Math.imul(seed ^ (seed >>> 15), 2246822507) + 0x9e3779b9 | 0) >>> 0) / 4294967296;
const pick = (a, r = Math.random) => a[Math.floor(r() * a.length)];
const cur = () => (window.SV && window.SV.S3) || null;
const warn = e => { try { console.warn("[pantheon]", e); } catch (x) {} };

// peoples whose label needs a tighter match than the one written beside the list (word edges, look-alikes)
const REFIX = {
  thracian: "thrac|dacian|\\bgeta|getic|paeon|moes|triball|odrys",
  siberian: "tungus|yukaghir|evenk|chukot|koryak|yenisei|paleo-?sib|palaeo-?sib|paleo-?asiat|\\bamur|nivkh|ymyyakhtakh|glazkovo|orochon|negidal|nanai|\\boroch|sushen|yilou|\\bust\\b|belkachi|syalakh|kongin|birar|kilogir|primorye|poltse|\\buril\\b|baikal|boyagir|\\bugir|mungal|nemnyar|chapogir|tungir|kindigir|\\bhori\\b",
  scythian: "saka|scyth|sarmat|massaget|maeot|pazyryk|dahae|apasiac|wusun|yuezhi|taurian|tochar|subeixi|sargat|tarim|forest-steppe",
  steppe: "xiongnu|mongol|donghu|turkic|dingling|slab|hunnu|\\bhu\\b|wuhuan|xianbei|tuoba|shiwei|hunyu|hujie|mengwu|kumoxi|hulunbuir|xiajiadian|\\brong\\b|\\bdi\\b|\\bsteppe|hexi|\\bhami\\b|shirenzigou|qushe|xinli|north asian",
  vedic: "indo-aryan|indo-iranian \\(|indic|vedic|magadh|maurya|nanda|gandhar|kamboj|\\bbhil|sinhal|dardic|burushaski|indigenous forest|indigenous/indo",
  chinese: "chinese|\\bhan\\b|huaxia|\\bqin\\b|\\bchu\\b|zhou|\\bjin\\b|\\bshu\\b|\\bba\\b|\\bdian\\b|yelang|baidi|kunming|ailao|\\bbo\\b|\\bman\\b|\\bsui\\b|liaoning",
  tibetan: "tibeto|qiang|zhangzhung|tibet|burm|\\bnaga\\b|kirat|\\byi\\b",
  seasia: "austroasiatic|vietic|\\btai\\b|khmer|\\bmon\\b|\\blac\\b|hlai|\\bkam\\b|aslian|negrito|andaman|munda|\\byue\\b|\\bau\\b|\\bpu\\b|nicobar",
  polynesian: "polynes|lapita|samoic|fijian|micrones|tongan|oceanic|uvean|chamorro",
  sahel: "mande|\\bgur\\b|atlantic \\(|dogon|songhay|soninke|tichitt|\\bdhar\\b|pulaar|chadic|kotoko|\\bsara\\b|adamawa|ubangi|gbaya|\\bbanda\\b|zande|ngbandi|ngbaka|\\bmaba|\\bfur\\b|\\bdaza|\\bteda\\b|tubu|zaghawa|\\bberia\\b|kawar|saharan|kordofan|\\bkoman\\b|mangbetu|\\bnok\\b|serer|wolof|hassan|nemadi|\\btama\\b|\\bberti\\b|tunjur|meidob|sinyar|\\bkarra\\b|\\bchari\\b|kuwaa|central sudanic|benue|upper cross",
  westafrican: "yorub|igbo|\\bakan\\b|\\bedo\\b|\\bgbe\\b|\\bewe\\b|\\bkwa\\b|nupoid|idomoid|kainji|\\bguan\\b|\\bkru\\b|jukun|ekoid|bendi|tivoid|kamuku|ijaw",
  bantu: "bantu|kikongo|umbundu|mbundu|\\bmongo\\b|\\bteke\\b|\\bfang\\b|myene|\\bbeti\\b|ngangela|ngombe|mwani|\\bkoti\\b|grassfield|tikar|\\bmbam",
  nilotic: "nilot|surmic|nilo-|\\bberta\\b|kunama|\\bnara\\b|dinka|\\bluo\\b|eastern sudanic|pastoral neolithic",
  khoisan: "khoe|khoisan|\\bsan\\b(?! (agust|pedro))|khoekhoe|\\btuu\\b|kx'a|hadza|pygm|\\btwa\\b|sandawe|african forager|lsa forager",
  maya: "maya|yucat|k'iche|pet[eé]n",
  mesoamerican: "zapotec|olmec|\\bmixe|otomi|oto-mangue|nahua|totonac|otomang|mixtec|purepecha|huave|popoloc|chinantec|amuzgo|tequistlatec|cuitlatec|mesoamerican|lencan|misumalpan|subtiaba|corachol|chichimec|cahit|tepehuan|tecual|totorame|acaxee|xixime|caxcan|tecuex|zacatec|morelos|colim|taracahit|\\bcoca\\b|pinome|coano|tecoxquin|tepecano|\\btubar\\b|\\bhume\\b",
  amazonian: "tupi|arawak|\\bj[eê]\\b|macro-j|guaran|tukano|panoan|tapuya|bororo|kariri|yanomam|amazon|chiquitan|nambikwar|kayap|timbira|botocud|maxakal|kamak|zamuc|chapacur|tacana|arawan|harakmbut|katukin|mosete|tupari|s[aá]liva|juruna|witoto|\\bboran\\b|\\bpeba|zaparo|guahib|nadahup|\\bmura\\b|karaj|mond[eé]|kagwahiv|sambaqui|nheenga|maraj|tapajo|tucuj|taruma|warao|otomac|yaruro|betoi|puinave|tikuna|andoke|\\bhoti\\b|yabarana|tinigua|\\byuri\\b|\\bjuri\\b|xukuru|pankarar|xok[oó]|yaath|payay|trumai|munduruku|iranxe|matanawi|ramarama|kwaza|kanoe|itonama|canichana|cayu[bv]a|movima|yuracar|\\bleco|ofai|guato|cariban|guianan|humait|sapuca|goitac",
  southerncone: "mapu|tehuelch|chonan|charr|pampa|picunch|huillich|puelch|haush|yamana|kawesqar|\\bchono|guaicur|mataguay|\\bchaco\\b(?! canyon)|comeching|sanavir|querand|gununa|\\blule\\b|tonocot|enlhet|mascoy|\\bchan[aá]\\b|uruguay|selk|umbu",
  southwest: "hopi|zuni|keres|tewa|tiwa|towa|\\btano|basketmaker|pima|o'odham|yuman|yavapai|\\bpai\\b|apache|southern athabask|numic|paiute|shoshon|\\buto\\b|takic|cochim|\\bseri\\b|jumano|concho|toboso|irritila|mayran|tompiro|waikuri|peric|owens|\\bute\\b|mogollon|puebloan",
  northwest: "salish|wakash|kwak|haida|tsimsh|\\bnuu|chinook|chimaku|\\bbella|tlingit|st'at|secwep|thompson|okanag|sahapt|kutenai|kalapuy|cayuse|molala|klamath|dakelh|chilcot|babine|pentlatch|takelma|athabask|\\bdene\\b",
  arctic: "dorset|inuit|eskimo|aleut|thule|yupik|inupi|saqqaq|norton|kachemak"
};
for (const p of PANS) if (REFIX[p.id]) p.re = new RegExp(REFIX[p.id], "i");

const GODS = [], GOD = {}, PANBY = {};
for (const p of PANS) { PANBY[p.id] = p; for (const g of p.gods) { g.id = p.id + ":" + g.n; GODS.push(g); GOD[g.id] = g; } }

// land that no listed people holds: the nearest known tradition by latitude and longitude
const regionPan = (la, lo) => {
  if (lo < -30) {   // the Americas
    if (la > 60) return "arctic"; if (la > 47 && lo < -114) return "northwest"; if (la > 32 && lo < -114) return "california"; if (la > 29 && lo < -102) return "southwest";
    if (la > 39) return lo < -95 ? "plains" : lo > -82 || la > 44 ? "algonquian" : "iroquoian"; if (la > 25) return lo < -94 ? "plains" : "southeastern";
    if (la > 13 && lo < -86) return lo > -93 && la < 22 ? "maya" : "mesoamerican"; if (la > 9 && lo > -86 && lo < -59) return "antillean"; if (la > 0 && lo < -72) return "chibchan";
    if (la < -24) return "southerncone"; if (lo < -66 && la < 0) return "andean"; return "amazonian";
  }
  if (la < -9 && lo > 111 && lo < 156) return "aboriginal"; if (la < 0 && la > -12 && lo > 130 && lo < 156) return "papuan"; if (lo > 156 || (la < -28 && lo > 160)) return "polynesian";
  if (la < 26 && lo > 92) return lo > 116 || la < 2 ? "austronesian" : "seasia";
  if (lo > 128 && la > 30) return la > 41 ? "kamuy" : "kami"; if (lo > 124 && la > 33 && la < 44) return "korean"; if (lo > 100 && la < 42) return "chinese";
  if (lo > 60 && la > 52) return "siberian"; if (lo > 85 && la > 41) return "steppe"; if (lo > 78 && la > 27) return "tibetan"; if (lo > 67 && la < 36) return la < 17 ? "dravidian" : "vedic";
  if (lo > 46 && la > 44) return "scythian"; if (lo > 44 && la > 24 && la < 45) return "persian";
  if (la < 37 && la > 4 && lo > -18 && lo < 60) {   // Africa north of the forests, Arabia, the Levant
    if (lo > 34 && la > 12 && la < 31) return la > 28 && lo < 38 ? "canaanite" : "arabian"; if (la > 29 && lo > 38) return "mesopotamian"; if (la > 29 && lo > 33.5) return "canaanite";
    if (la > 18) return lo < 25 ? "berber" : la < 23.5 ? "kushite" : "kemetic"; if (lo > 33) return la > 8 ? "cushitic" : "nilotic"; if (lo > 22) return "nilotic"; return la < 10 && lo < 10 ? "westafrican" : "sahel";
  }
  if (la <= 4) return la < -17 ? "khoisan" : lo > 42 && la > -26 ? "austronesian" : "bantu";
  if (la > 39 && lo > 38 && lo < 50) return "caucasian"; if (la > 35.5 && lo > 26 && lo < 44) return "anatolian";
  if (lo > 20 && la > 53) return la > 58 ? "uralic" : "baltic"; if (lo > 22 && la > 46) return la > 48 || lo > 30 ? "slavic" : "thracian"; if (la > 50 && lo > 5) return "germanic";
  if (lo > 19 && la < 41.5) return "hellenic"; if (lo > 21 && la <= 46) return "thracian"; if (lo > 13.2 && la > 40 && la < 47 && lo < 21) return "illyrian";
  if (lo > 7 && la < 46.5) return la > 42 && lo < 12.5 ? "etruscan" : "italic"; if (lo < 3.3 && la < 43.8) return "iberian"; return "celtic";
};
const landInfo = i => {   // the 320 BC holder of a hex and its gods
  let state = "", people = "", kind = "";
  try { const k = eraOf(i); if (k >= 0) { const t = ERA.tags[k]; state = String(t[0] || ""); kind = String(t[3] || ""); people = String(t[4] || ""); } } catch (e) {}
  let pan = null; if (people) for (const p of PANS) if (p.re.test(people)) { pan = p; break; }
  if (!pan) { let ll = [0, 0]; try { ll = SV.hexLL(i); } catch (e) {} pan = PANBY[regionPan(ll[0], ll[1])] || PANS[0]; }
  let place = ""; try { place = (ERA.hn && ERA.hn[i]) || (ERA.rn && ERA.rn[D.reg[i]]) || D.regions[D.reg[i]][0] || ""; } catch (e) {}
  return { state, people, kind, pan, place };
};

// ---- the 20 domains: colour, what the gift is called, the mark it leaves on foes ----
const DOM = {
  S: { id: "storm", n: "Storm", c: "#ffe14a", c2: "#fff7b8", st: "Jolt", what: "lightning leaps between foes" },
  W: { id: "sea", n: "Waters", c: "#3fb8ff", c2: "#b6e6ff", st: "Surge", what: "waves hurl foes back" },
  R: { id: "war", n: "War", c: "#e8362b", c2: "#ff9a8a", st: "Doom", what: "a delayed wound bursts" },
  L: { id: "love", n: "Love", c: "#ff7ac8", c2: "#ffd0ea", st: "Weak", what: "foes strike feebly" },
  H: { id: "hunt", n: "The Hunt", c: "#7be05a", c2: "#d2ffb8", st: "Mark", what: "marked foes take critical wounds" },
  A: { id: "wisdom", n: "Wisdom", c: "#e9dfae", c2: "#fffbe0", st: "Exposed", what: "you turn blows aside" },
  V: { id: "revel", n: "Revelry", c: "#b667e8", c2: "#e6c4ff", st: "Stupor", what: "a stacking sickness" },
  C: { id: "frost", n: "Winter", c: "#a8ecff", c2: "#e8fbff", st: "Chill", what: "foes slow, then freeze and shatter" },
  E: { id: "earth", n: "Earth", c: "#9bbf3f", c2: "#dcf0a0", st: "Rooted", what: "roots hold foes fast" },
  T: { id: "trick", n: "Cunning", c: "#ffa340", c2: "#ffd9a6", st: "Dazed", what: "foes stumble, you move like wind" },
  D: { id: "death", n: "The Dead", c: "#56d6a8", c2: "#c4ffe8", st: "Reaped", what: "the weak are cut down, you drink life" },
  U: { id: "sun", n: "The Sun", c: "#ffc12e", c2: "#ffeeb0", st: "Scorch", what: "sunfire burns without end" },
  M: { id: "moon", n: "The Moon", c: "#b9c8ff", c2: "#eef2ff", st: "Moonstruck", what: "moonbeams fall on the counted blow" },
  F: { id: "fire", n: "Fire", c: "#ff6a2a", c2: "#ffc09a", st: "Blaze", what: "flames spread from the fallen" },
  K: { id: "sky", n: "The Heavens", c: "#ffe9a8", c2: "#ffffff", st: "Awed", what: "the mighty are humbled" },
  Y: { id: "heal", n: "Life", c: "#7dffb0", c2: "#d8ffe8", st: "Mended", what: "wounds close as you fight" },
  X: { id: "fate", n: "Fate", c: "#d88cff", c2: "#f2d6ff", st: "Hexed", what: "hexed foes suffer more from everything" },
  N: { id: "beast", n: "The Wild", c: "#d39a52", c2: "#f4d8ae", st: "Hunted", what: "spirit beasts strike beside you" },
  O: { id: "forge", n: "The Forge", c: "#c9d2e4", c2: "#ffffff", st: "Sundered", what: "armour splits, each blow bites deeper" },
  Z: { id: "prime", n: "The First Dark", c: "#a04dff", c2: "#dcbcff", st: "Unmade", what: "rifts of the unformed open" }
};
const domOf = g => DOM[g.d[0]] || DOM.Z, dom2Of = g => (g.d[1] && DOM[g.d[1]]) || null;
