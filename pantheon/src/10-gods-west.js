/* The gods of 320 BC, culture by culture. One line per deity: Name|domains|epithet.
   Domains (first = what the god mainly grants, second = a lesser gift):
   S storm  W water  R war  L love  H hunt  A wisdom/law  V revelry  C cold/mountain  E earth/harvest  T trickster/roads
   D death  U sun  M moon/night  F fire/hearth  K sky/kingship  Y healing/life  X fate/magic  N beasts/wild  O craft/forge  Z primordial
   re = which 320 BC peoples (ERA.tags[k][4]) follow the pantheon; the first match in list order wins. */
const PANS = [];
const PAN = (id, name, art, re, text) => PANS.push({ id, name, art, re: new RegExp(re, "i"), gods: text.trim().split("\n").map(l => { const [n, d, e] = l.trim().split("|"); return { n, d: d || "Z", e: e || "", pan: id }; }) });

PAN("hellenic", "Hellenic", "greek", "greek|macedon|epirot|hellen|cypriot|molossian", `
Zeus|KS|Cloud-Gatherer
Hera|KL|Queen of Heaven
Poseidon|WS|Earth-Shaker
Demeter|EC|Bringer of Seasons
Athena|AR|Grey-Eyed
Apollo|UY|Far-Shooter
Artemis|HM|Lady of Beasts
Ares|RF|Bane of Men
Aphrodite|LW|Foam-Born
Hephaestus|OF|Lame Smith
Hermes|TX|Guide of Souls
Dionysus|VN|Twice-Born
Hestia|FY|Keeper of the Hearth
Hades|DE|The Unseen
Persephone|DE|Dread Queen
Hecate|XM|Torch-Bearer
Helios|UK|All-Seeing
Selene|MX|Bright Wanderer
Eos|UL|Rosy-Fingered
Nyx|MZ|Mother Night
Erebus|MD|The Dark Below
Gaia|EZ|Broad-Breasted
Ouranos|KZ|Starry Sky
Chaos|ZX|The Yawning Gap
Cronus|ZE|Crooked Counsel
Rhea|EY|Mother of Gods
Oceanus|WZ|World River
Tethys|WY|Nurse of Rivers
Hyperion|UK|He Who Goes Above
Theia|UM|Wide-Shining
Themis|AX|Good Counsel
Mnemosyne|AV|Memory
Prometheus|FA|Forethought
Atlas|CK|The Enduring
Leto|YM|Gentle Mother
Pan|NV|Goat-Foot
Asclepius|YA|Blameless Healer
Hygieia|YE|Health
Eros|LT|Loosener of Limbs
Nike|RK|Victory
Nemesis|XA|Inescapable
Tyche|XT|Fortune of the City
Thanatos|DM|Gentle Death
Hypnos|MY|Sleep
Morpheus|MX|Shaper of Dreams
Eris|RT|Strife
Enyo|RD|Sacker of Cities
Phobos|RM|Rout
Deimos|RX|Dread
Heracles|RN|Glory of Hera
Boreas|CS|North Wind
Zephyrus|SL|West Wind
Notus|SW|South Wind
Eurus|SU|East Wind
Aeolus|ST|Keeper of Winds
Iris|TS|Rainbow Messenger
Hebe|YV|Bloom of Youth
Eileithyia|YM|Helper in Childbirth
Triton|WT|Trumpeter of the Sea
Nereus|WA|Old Man of the Sea
Thetis|WX|Silver-Footed
Amphitrite|WL|Queen of the Deep
Proteus|WT|Shape-Shifter
Glaucus|WY|Sea-Green
Charon|DW|Ferryman
Styx|DA|Oath of the Gods
Moirai|XD|The Three Fates
Erinyes|DR|The Kindly Ones
Horae|EA|The Seasons
Charites|LV|The Graces
Muses|VA|Daughters of Memory
Kabeiroi|OX|Great Gods of Samothrace
Dioscuri|RT|Horse-Taming Twins
Britomartis|HW|Sweet Maiden
Aristaeus|EN|Keeper of Bees
Priapus|EL|Guardian of Gardens
Adonis|LE|The Dying Youth
Kore Soteira|YD|Saviour Maiden
Trophonius|XD|Oracle of the Cave
Amphiaraus|XY|Seer Below
Zagreus|DN|First Dionysus
Phanes|ZU|First-Born Light
Ananke|XZ|Necessity
Kratos|RK|Might
Bia|RS|Force
Zelus|RT|Zeal
Metis|AT|Cunning Counsel
Dike|AK|Justice
Eirene|EA|Peace
Eunomia|AE|Good Order
Ate|XT|Ruin
Momus|TV|Mockery
Geras|DC|Old Age
Pontus|WZ|The Deep
Thalassa|WY|Sea Mother
Achelous|WN|Bull-Horned River
Scamander|WR|River of Troy
Alpheus|WH|The Pursuing River
Asteria|MX|Starry One
Astraeus|MS|Father of Winds and Stars
Pallas|RA|Titan of Warcraft
Perses|RF|The Destroyer
Epimetheus|TE|Afterthought
Chiron|YH|Wise Centaur
Silenus|VA|Drunken Sage
Maia|EM|Shy Pleiad
Pleione|WM|Mother of the Pleiades
Orion|HM|Giant Hunter
Phosphorus|UM|Morning Star
Hesperus|ML|Evening Star
Ariadne|VL|Mistress of the Labyrinth
Leucothea|WY|White Goddess
Palaemon|WT|Guardian of Harbours
Melinoe|DM|Bringer of Nightmares
Makaria|DY|Blessed Death
Hybris|RT|Insolence
Peitho|LA|Persuasion
Harmonia|LA|Concord
Paean|YU|Healer of the Gods
Telesphorus|YM|Bringer of Recovery
Agathos Daimon|EY|Good Spirit
Kairos|TX|The Right Moment
`);

PAN("kemetic", "Kemetic", "egypt", "egypt|ptolem", `
Amun|KZ|The Hidden One
Ra|UK|Lord of the Solar Barque
Osiris|DE|Foremost of the Westerners
Isis|XY|Great of Magic
Horus|KR|Avenger of His Father
Set|SR|Lord of the Red Land
Nephthys|DM|Lady of the House
Anubis|DT|He Upon His Mountain
Thoth|AM|Lord of Divine Words
Ptah|OZ|Beautiful of Face
Sekhmet|RF|The Powerful One
Bastet|LY|Lady of Bubastis
Hathor|LV|Mistress of Turquoise
Ma'at|AK|Feather of Truth
Sobek|WR|Pointed of Teeth
Khnum|OW|Potter of Men
Neith|RX|Opener of the Ways
Geb|EK|Father Earth
Nut|MK|Coverer of the Sky
Shu|SK|Upholder of the Sky
Tefnut|WS|Lady of Moisture
Khonsu|MY|The Traveller
Mut|KY|Mother of the Gods
Min|EL|Bull of His Mother
Montu|RU|Lord of Thebes
Wepwawet|RT|Opener of the Roads
Atum|ZU|The Complete One
Khepri|UZ|He Who Becomes
Aten|UK|The Disc
Apis|NE|Living Bull of Ptah
Hapi|WE|Lord of the Flood
Bes|YV|Guardian of the Home
Taweret|YW|The Great Female
Seshat|AO|Mistress of the House of Books
Serqet|YX|She Who Lets the Throat Breathe
Nefertem|YL|Lotus of the Sun
Sokar|DO|Lord of the Mysterious Region
Imhotep|YA|He Who Comes in Peace
Heka|XZ|Magic Itself
Meretseger|CD|She Who Loves Silence
Renenutet|EX|Lady of the Granaries
Wadjet|FK|The Green One
Nekhbet|KY|White Vulture of Nekheb
Apep|ZD|Serpent of Chaos
Ammit|DA|Devourer of the Dead
Anhur|RH|Bringer of the Distant One
Satet|WH|Archer of the Cataract
Anuket|WL|The Embracer
Heqet|YW|Frog of Rebirth
Meskhenet|XY|Lady of the Birth Brick
Shai|XA|What Is Ordained
Tatenen|EZ|The Risen Land
Nun|ZW|The Primeval Waters
Kek|MZ|Darkness Before Dawn
Heh|ZK|The Millions of Years
Pakhet|HR|She Who Scratches
Mafdet|AH|Slayer of Serpents
Maahes|RF|Lord of Slaughter
Shezmu|VD|Lord of the Wine Press
Khenti-Amentiu|DK|Foremost of the West
Mnevis|UN|Bull of Heliopolis
Buchis|RN|Bull of Montu
Banebdjedet|EL|Ram of Mendes
Sopdu|RK|Lord of the East
Sopdet|MW|Star of the Flood
Sah|MD|Father of Gods in Orion
Ihy|VL|The Sistrum Player
Tayt|OD|Weaver of Linen
Hedetet|YX|Scorpion Daughter of Ra
Iah|MA|The Moon
Kebechet|WD|Cooling Water
Qebui|SC|North Wind
Wosret|RK|The Powerful
Hatmehit|WE|Foremost of Fish
Nehebkau|XD|Binder of Souls
Babi|RN|Bull of the Baboons
Aker|ED|Guardian of the Horizon
Medjed|DX|The Smiter
Tutu|XR|Master of Demons
Serapis|DY|Lord of Alexandria
Harpocrates|YU|Horus the Child
`);

PAN("kushite", "Kushite", "egypt", "kush|nubian|meroit|aithiop|napata", `
Apedemak|RK|Lion of the South
Amun of Napata|KU|Lord of the Pure Mountain
Arensnuphis|HN|The Good Companion
Sebiumeker|ZE|Lord of Musawwarat
Mandulis|UK|Sun of Kalabsha
Amesemi|MY|Falcon-Crowned
Dedun|EO|Lord of Incense
Mut of Napata|KY|Lady of the Mountain
Isis of Philae|XY|Queen of the Southern Lands
Horus of Buhen|RK|Falcon of the Cataract
Anuket|WL|Lady of Sehel
Satis|WH|She Who Shoots
Khnum of Elephantine|OW|Lord of the Cataract
Mash|UF|The Sun
Aqedise|MY|The Moon God
Onuris|RH|He Who Brings Back the Distant One
Tefnut of Nubia|RF|The Wandering Lioness
Bes|YV|Dancer of the South
Thoth of Pnubs|AM|Lord of Pnubs
`);

PAN("mesopotamian", "Mesopotamian", "meso", "babylon|chalde|assyr|aramae|dilmun|elam|zagros|sumer|akkad", `
Marduk|KS|Bel, Lord of Babylon
Anu|KZ|Father of the Sky
Enlil|SK|Lord Wind
Ea|WA|Lord of the Abzu
Ishtar|LR|Queen of Heaven
Shamash|UA|Judge of Heaven and Earth
Sin|MA|Lamp of Heaven
Nabu|AX|Scribe of Destinies
Nergal|DR|Lord of the Great City
Ereshkigal|DM|Queen of the Great Below
Adad|SE|The Thunderer
Ninurta|RE|Champion of Enlil
Tiamat|ZW|Salt Sea Mother
Apsu|ZW|The Sweet Deep
Gula|YN|Great Physician
Nisaba|AE|Lady of Grain and Reed
Ninhursag|EY|Lady of the Mountain
Dumuzid|EL|The Shepherd
Geshtinanna|VD|Vine of Heaven
Nanaya|LX|Lady of Desire
Zababa|RK|Warrior of Kish
Girra|FO|The Fire
Nusku|FM|Lamp of the Night
Ninlil|SY|Lady Wind
Sarpanit|LY|The Shining One
Tashmetu|LA|Lady Who Listens
Ningal|MX|Great Lady
Aya|UL|The Dawn Bride
Lamashtu|DX|She Who Erases
Pazuzu|SX|King of the Wind Demons
Ninkasi|VE|She Who Fills the Mouth
Ningishzida|DY|Lord of the Good Tree
Namtar|DX|Fate-Cutter
Erra|RD|Scorched Earth
Ishum|FT|Night Watchman
Kittu|AU|Truth
Misharu|AK|Justice
Lahmu|ZW|The Hairy One
Kingu|ZR|Bearer of the Tablet
Apkallu|AO|The Seven Sages
Ashur|KR|The Great Mountain
Dagan|ES|Lord of Grain
Humban|KS|Lord of Heaven of Elam
Inshushinak|DA|Lord of Susa
Kiririsha|YL|Great Goddess
Napirisha|WK|The Great God
Pinikir|LM|Mistress of Heaven
Nahhunte|UA|Sun of Elam
Inzak|WT|Lord of Dilmun
Meskilak|EY|Lady of the Pure Land
Atargatis|WL|Fish-Tailed Lady
Hadad|SK|Rider of Clouds
Shala|ES|Lady of the Ear of Grain
Lugalbanda|TR|The Swift King
Gilgamesh|RD|He Who Saw the Deep
Enkidu|NH|Wild Man of the Steppe
Humbaba|NC|Guardian of the Cedars
Anzu|SN|Storm Bird
Mushussu|NX|Furious Serpent
Lamassu|AY|Winged Guardian
Gibil|FO|Burning Reed
Papsukkal|TA|Gatekeeper of Heaven
Belet-ili|YZ|Lady of the Gods
Mami|YO|Shaper of Clay
Ninazu|YD|Lord Healer
Ninsun|NA|Lady Wild Cow
Shulpae|NK|Youth Shining Forth
Uttu|OE|The Weaver
Nanshe|WX|Lady of Dreams and Fish
Ninshubur|TK|Faithful Vizier
Neti|DA|Gatekeeper of the Underworld
Kulla|OE|Lord of Bricks
Lisin|FM|Star of Mourning
Sebitti|RM|The Seven
`);

PAN("canaanite", "Canaanite", "meso", "phoenic|punic|carthag|canaan|philist|judean|samarit|edom|ammon|moab", `
Baal Hammon|KE|Lord of the Brazier Altars
Tanit|MY|Face of Baal
Melqart|RW|King of the City
Astarte|LR|Lady of Byblos
Eshmun|YE|The Eighth
El|KZ|Father of Years
Asherah|EY|She Who Treads the Sea
Baal Shamem|SK|Lord of Heaven
Baal Hadad|SR|Rider on the Clouds
Anat|RH|Maiden of Battle
Yam|WZ|Prince Sea
Mot|DC|Death
Resheph|RY|Lord of the Arrow
Kothar-wa-Khasis|OA|Skilful and Wise
Shapash|UD|Torch of the Gods
Yarikh|ME|Lamp of the Night
Dagon|EW|Lord of Grain
Shahar|UL|Dawn
Shalim|MY|Dusk
Sydyk|AK|Righteousness
Misor|AT|Uprightness
Chusor|OW|The Opener
Baalat Gebal|LK|Lady of Byblos
Baal Saphon|SW|Lord of the North Mountain
Qos|SH|The Bow
Chemosh|RF|Subduer
Milcom|KR|The King
Kotharat|YL|Swallow Daughters
Horon|DX|Lord of Spells
Arsay|ED|Daughter of the Wide World
Pidray|SU|Daughter of Light
Tallay|WS|Daughter of Dew
Attar|MR|The Morning Star
Nikkal|EM|Lady of Orchards
Sid|HY|Father of Sardinia
Shadrafa|YN|Spirit of Healing
Baal Marqod|VY|Lord of the Dance
Pumay|RK|Lord of Kition
Gad|XT|Good Fortune
`);

PAN("arabian", "Arabian", "meso", "arab|omani|nabat|sabae|himyar|minae|qataban|hadram|thamud|lihyan", `
Dushara|CK|Lord of the Mountain
Al-Lat|EK|The Goddess
Al-Uzza|MR|The Mightiest
Manat|XD|Fate
Almaqah|ME|Lord of the Ibexes
Athtar|SR|The Thunderer of Morning
Wadd|ML|Love
Shams|UA|Lady Sun
Sin of Hadramawt|MK|Lord of Shabwa
Amm|MS|The Uncle
Anbay|AX|The Speaker
Hawkam|AK|The Judge
Dhat-Himyam|UF|She of the Heat
Dhat-Badan|EN|Lady of the Wild Goats
Nasr|KN|The Vulture
Quzah|SC|Lord of the Rainbow
Ruda|ML|The Well-Disposed
Nuha|UA|The Wise Sun
Orotalt|VK|Lord of the Vine
Shay al-Qawm|RT|Protector of the Caravan
Al-Kutbay|AT|The Scribe
Hubal|XH|Lord of the Arrows
Dhu-Samawi|KS|Lord of the Heavens
Ta'lab|NE|Lord of Pastures
Kahl|RK|The Mighty
Sa'd|XT|Good Luck
Isaf|LX|Stone of the Vow
Na'ila|LE|She Who Receives
Yaghuth|RN|He Helps
Ya'uq|TN|He Preserves
Suwa|MY|The Night Watch
Atarsamain|MK|Morning Star of Heaven
`);

PAN("scythian", "Scythian", "steppe", "saka|scyth|sarmat|massaget|maeot|pazyryk|dahae|apasiac|wusun|yuezhi|taurian|tocharian|subeixi|sargat", `
Tabiti|FK|Queen of the Hearth
Papaios|KS|Sky Father
Api|EW|Mother Earth and Water
Goitosyros|UH|Far-Shooting Sun
Argimpasa|LX|Heavenly Mistress
Thagimasadas|WN|Lord of Horses and Waters
Scythian Ares|RO|The Sword in the Brushwood
Targitaos|RK|First of Men
Kolaxais|KU|Sun-King
Lipoxais|CE|Mountain-King
Arpoxais|WT|River-King
Snake-Legged Mother|EN|Lady of the Hylaia
Borysthenes|WE|River Father
Enarees|XY|The Soothsayers
The Golden Gifts|EK|Plough, Yoke, Axe and Cup From the Sky
Gold-Guarding Griffin|NK|Warder of the Arimaspian Gold
Tomyris|RD|Queen of the Massagetae
Anacharsis|AT|The Wandering Sage
Zarina|RL|Golden Queen
`);

PAN("persian", "Iranian", "persia", "iranian|persian|mede|parth|bactr|sogd|caspian|carduch|chorasm|arachos|gedros|hyrcan", `
Ahura Mazda|KA|Wise Lord
Mithra|AU|Lord of Wide Pastures
Anahita|WL|The Immaculate
Verethragna|RN|Smiter of Resistance
Tishtrya|SW|Star of the Rains
Atar|FA|Holy Fire
Haoma|YV|The Golden Plant
Vayu|SD|The Wind That Runs Between
Rashnu|AD|The Just
Sraosha|AR|Obedience
Ashi|XL|Reward
Zam|EK|The Earth
Hvar Khshaeta|UK|Radiant Sun
Mah|MN|Moon of the Cattle
Apam Napat|WF|Child of the Waters
Spenta Armaiti|EY|Holy Devotion
Asha Vahishta|FA|Best Truth
Vohu Manah|AN|Good Purpose
Khshathra Vairya|KO|Desirable Dominion
Haurvatat|YW|Wholeness
Ameretat|YE|Immortality
Daena|AX|Vision
Chista|AT|The Way Shower
Drvaspa|NY|Keeper of Horses
Airyaman|YA|Healer of the Tribe
Nairyosangha|TF|Messenger of the Lord
Rapithwin|UF|Lord of Noon
Zurvan|ZX|Boundless Time
Angra Mainyu|ZD|The Hostile Spirit
Azhi Dahaka|ZS|The Three-Headed
Aeshma|RX|Wrath of the Bloody Club
Simurgh|YK|Bird of the Tree of Seeds
Yima|KE|The Radiant Shepherd
Thraetaona|RS|Dragon-Slayer
Keresaspa|RH|Wielder of the Club
Gayomart|ZE|First Mortal
Khvarenah|KU|The Royal Glory
Vanant|MR|Star of the West
Satavaesa|WM|Star of the South
Haptoiringa|MC|Seven Thrones of the North
Parendi|XL|Abundance
Arshtat|AK|Justice
Ushah|UL|The Dawn
Rata|YL|The Gift
`);

PAN("anatolian", "Anatolian", "persia", "phryg|lydia|caria|lycia|pisid|cilic|cappadoc|paphlag|mysia|isaur|milya|cabal|luw|hurro|bithyn|galat", `
Matar Kubileya|EN|Mother of the Mountain
Attis|EL|The Shepherd Reborn
Men|MK|Lord of the Moon
Sabazios|SV|The Rider
Tarhunt|SK|Storm-God of the Vineyard
Arma|MY|The Crescent
Santa|RD|Lord of the Pyre
Kubaba|KX|Queen of Carchemish
Runtiya|HN|Stag-God of the Wild
Tiwaz|UA|Father Sun
Kamrusepa|YX|Lady of Spells
Hebat|KY|Queen of Heaven
Teshub|SR|Bull of the Storm
Sharruma|CR|Calf of Teshub
Kumarbi|ZE|Father of the Gods
Hannahanna|YE|Grandmother
Telipinu|ES|The Vanishing God
Inara|HN|Lady of the Steppe Beasts
Zeus Labraundos|SR|Lord of the Double Axe
Artemis of Ephesus|NY|Lady of Many Breasts
Ma of Comana|RL|The Conquering Mother
Agdistis|ZN|Twofold One
Midas|XO|King of the Golden Touch
Marsyas|VN|The Flayed Piper
Bagaios|KE|Phrygian Zeus
Kakasbos|RT|Rider With the Club
Trqqas|SK|Lycian Thunder
Maliya|AW|Lady of the River and Craft
Pldans|UY|Lydian Light
Kandaulas|HN|Dog-Throttler
Baki|VN|Lydian Bacchus
Sandan|RF|Lion-Rider of Tarsus
`);

PAN("caucasian", "Caucasian", "persia", "armen|kartvel|colch|caucas|orontid", `
Aramazd|KA|Father of All
Anahit|YL|Golden Mother
Vahagn|RF|Dragon-Reaper
Astghik|LW|Little Star
Mihr|UA|Light of Heaven
Tir|AX|Scribe of Aramazd
Nane|RA|Daughter of Wisdom
Barshamin|SK|Lord of Heaven
Spandaramet|DE|Lady of the Underworld
Tork Angegh|RO|The Ugly Giant
Hayk|HK|The Archer Patriarch
Ara the Beautiful|EL|The Dying King
Aralez|YN|Dog-Spirits That Lick Wounds
Tsovinar|SW|Lady of the Rain-Sea
Amanor|EV|Bringer of First Fruits
Armazi|KR|Bronze Lord of Mtskheta
Zadeni|EY|Giver of Harvest
Gatsi|KA|The Gold Idol
Ga|MA|The Silver Idol
Ainina|LM|Bright Lady
Danina|WL|Lady of Waters
Dali|HC|Lady of the Ibex Crags
Kopala|RS|Demon-Slayer
Iakhsari|RC|Hammer of the Peaks
Ochopintre|NH|Lord of Wild Things
Tamar|UK|Maiden Who Rides the Serpent
Amirani|FO|The Chained Titan
Ghmerti|KZ|Supreme Sky
Mindort-batoni|EL|Lord of Flowers
Adgilis Deda|EY|Mother of the Place
Khaldi|RK|Lion-Standing Lord
Teisheba|SR|Storm of Urartu
Shivini|UA|Winged Sun
`);

PAN("thracian", "Thracian", "greek", "thrac|dacian|geta|getic|paeon|moes|triball", `
Zalmoxis|DX|He Who Vanished Below
Bendis|HM|Huntress With Twin Spears
Sabazios|SV|The Horseman of Heaven
Kotys|VL|Lady of the Night Revels
Gebeleizis|SK|Lightning-Thrower
Derzelas|DY|Lord of Abundance Below
Heros|RH|The Thracian Rider
Zbelsurdos|SR|Eagle-Bearing Thunderer
Orpheus|VD|The Singer Who Went Down
Rhesus|RN|King of White Horses
Zagreus|DN|The Torn God
Semele|EF|Thunder-Struck Mother
Pleistoros|RD|God of the Apsinthians
Kandaon|RN|The Wolf-Warrior
Dionysus of the Bessi|XV|Oracle of the Mountain
Darzalas|YE|Great God of Odessos
Sitalkas|EV|Lord of Grain Song
Hipta|YN|Nurse of the Mountain
Perkos|SC|Lord of the Oak Crag
Iambadoule|YW|Lady of Healing Springs
Lycurgus|RC|Wolf-King of the Edones
`);

PAN("illyrian", "Illyrian", "greek", "illyr|pannon|messap|daun|peucet|liburn|dalmat|iapyg", `
Medaurus|RY|Rider of Risinium
Bindus|WS|Lord of Springs
En|FK|The Burning One
Vidasus|NH|Lord of Woods
Thana|HM|Huntress of the Forest Springs
Redon|WT|Guardian of Sailors
Andinus|EY|Giver of Growth
Tadenus|UY|The Healing Light
Armatus|RK|The Armed One
Iria|LW|Lady of Flanona
Latra|ED|Lady of Nedinum
Sentona|EY|Lady of the Fields
Anzotica|LW|Liburnian Venus
Ica|WY|Spring of Plomin
Deipaturos|KS|Sky Father
Prende|LU|Lady of the Rainbow Belt
Perendi|SC|The Striker
Nëna e Vatrës|FY|Mother of the Hearth
Dalmatian Silvanus|NE|Horned Shepherd
Aecorna|WT|Lady of the Lake Harbour
Zis Batas|SK|Messapic Thunderer
Damatira|EC|Messapic Earth Mother
Aprodita|LW|Lady of the Salento
Menzana|NK|Horse-Lord Jupiter
Dardanian Mother|ED|Dea Dardanica
`);

PAN("etruscan", "Etruscan", "greek", "etrusc|raet|rasenn", `
Tinia|KS|Lord of the Three Thunderbolts
Uni|KY|Queen of Veii
Menrva|AR|Lady of Lightning and Craft
Turan|LW|Mistress of Vulci
Fufluns|VE|Lord of Populonia
Laran|RF|The Spear-Bearer
Nethuns|WK|Lord of Wells and Sea
Aita|DE|Wolf-Capped King Below
Phersipnai|DE|Queen of Shades
Vanth|DT|Winged Guide With the Torch
Charun|DR|Hammer of the Gate
Turms|TD|Herald of the Dead
Sethlans|OF|The Smith
Usil|UK|Rising Sun
Tiur|MA|The Moon
Thesan|UL|Lady of the Dawn
Voltumna|KE|Prince of Etruria
Selvans|NE|Lord of Boundaries
Cel|EY|Earth Mother
Culsans|TA|Two-Faced Keeper of Gates
Culsu|DT|She of the Scissors and Torch
Tuchulcha|DX|Serpent-Haired Terror
Hercle|RN|The Adopted Son
Aplu|UY|Wolf-God of Veii
Artume|HM|Lady of the Night Hunt
Lasa|XL|Winged Attendant of Fate
Nortia|XA|She Who Drives the Nail
Satre|ZE|The Old Sower
Vetisl|DM|Lord of Night
Thalna|YL|Lady of Birth
Tages|AX|The Child Prophet
Vegoia|XS|Nymph of the Lightning Books
Mantus|DK|Lord of Mantua
Mania|DM|Mother of Ghosts
Alpan|LD|The Willing One
Catha|UM|Daughter of the Sun
Suri|DF|The Black One of Soracte
Tluscv|EC|Spirits of the Fields
Letham|DE|Liver-Region of the Underworld
Thufltha|XA|Avenger of Oaths
Horta|EY|Lady of Gardens
Feronia|NE|Lady of Wild Groves
Tecum|KA|God of the Lucumones
`);

PAN("italic", "Italic", "greek", "latin|roman|italic|umbri|oscan|samnit|sabell|sabine|picen|venet|sicel|sican|elym|nurag|ligur|lucan|brutt|campan", `
Jupiter|KS|Best and Greatest
Juno|KY|Queen and Warner
Mars|RE|Father of the Roman People
Quirinus|KR|Lord of the Assembled Men
Janus|TZ|God of Beginnings
Vesta|FA|The Eternal Flame
Minerva|AO|Lady of the Thousand Works
Neptunus|WN|Lord of Springs and Horses
Vulcan|FO|The Fire That Devours
Ceres|EA|Lady of Growth
Liber|VE|The Free One
Libera|VL|The Free Maiden
Diana|HM|Lady of the Grove of Nemi
Venus|LE|Lady of Gardens and Charm
Mercurius|TX|Lord of Trade
Saturnus|EZ|Lord of the Golden Age
Ops|EX|Plenty
Tellus|EY|Mother Earth
Faunus|NX|The Speaker in the Woods
Silvanus|NE|Lord of the Forest Edge
Bellona|RX|Fury of War
Fortuna|XT|First-Born of Jupiter
Dis Pater|DE|The Rich Father
Proserpina|DE|Queen Below
Orcus|DA|Punisher of Broken Oaths
Sol Indiges|UK|The Native Sun
Luna|MX|The Moon
Aurora|UL|The Dawn
Terminus|AC|The Boundary Stone
Fides|AK|Good Faith
Victoria|RK|Victory
Salus|YA|Welfare
Flora|LE|Lady of Blossoms
Pomona|EL|Lady of Orchards
Vertumnus|TE|The Changer of Seasons
Consus|EX|Keeper of the Stored Grain
Robigus|EC|Averter of Rust
Pales|NE|Guardian of Flocks
Lares|FY|Guardians of the Crossroads
Penates|FE|Keepers of the Storeroom
Genius|YK|The Begetting Spirit
Bona Dea|YL|The Good Goddess
Mater Matuta|UY|Mother of the Morning
Carmenta|XY|Singer of Fates
Portunus|WT|Keeper of Keys and Harbours
Volturnus|WS|The Rolling River
Tiberinus|WK|Father Tiber
Juturna|WY|Lady of Fountains
Fons|WE|The Spring
Summanus|SM|Thunder of the Night
Veiovis|DY|The Young Jove Below
Semo Sancus|AS|Guardian of Oaths
Angerona|XM|Lady of Silence
Laverna|TM|Patroness of Thieves
Furrina|WD|Lady of the Dark Spring
Lupercus|NH|Wolf-Warder
Picus|NX|The Woodpecker King
Mefitis|YD|Lady of the Vapours
Feronia|NE|Lady of Freedmen and Groves
Vacuna|RC|Sabine Victory
Reitia|YO|Lady of the Keys
Sardus Pater|HK|Father of Sardinia
Hercules|RN|The Unconquered
Castor|RN|Tamer of Horses
Pollux|RT|The Boxer
Aesculapius|YA|Serpent of the Island
Anna Perenna|EV|Lady of the Circling Year
Acca Larentia|ED|Mother of the Lares
Cardea|TA|Lady of the Hinge
Cloacina|WY|The Purifier
Dea Dia|EU|Bright Goddess of the Arval Grove
Egeria|WX|The Counselling Spring
Fornax|FE|Lady of the Oven
Honos|RK|Honour
Virtus|RA|Manly Valour
Iuventas|YR|Youth
Lua|DR|To Whom Captured Arms Are Burned
Marica|WN|Nymph of the Liris
Nerio|RL|Valour, Bride of Mars
Pax|EA|Peace
Pietas|AY|Duty
Spes|XU|Hope
Concordia|AL|Harmony
Libertas|TK|Liberty
Tempestates|SW|The Storm Winds
Vica Pota|RK|Conquering and Powerful
Voluptas|LV|Delight
Adranus|FH|Fire-God of Etna
Palici|WD|Twin Geysers
Hybla|EY|Sicel Earth Mother
Kerres|EY|Oscan Lady of Grain
Mamers|RN|Oscan Mars
Herentas|LE|Oscan Desire
Cupra|EY|Picene Mother
Jupiter Latiaris|KC|Lord of the Alban Mount
`);

PAN("iberian", "Iberian", "celtic", "iberian|celtiber|lusitan|turdet|tartess|aquitan|vascon|talayot|ibero|basque|oretan|conii|gallaec|astur|cantabr", `
Endovelicus|YD|Healer of the Dark Mountain
Ataegina|DE|Lady of Rebirth
Bandua|RA|Binder of Oaths
Nabia|WE|Lady of Valleys and Waters
Reue|KC|Lord of the High Peak
Trebaruna|FR|Lady of the House
Cosus|RW|Lord of the Confluences
Neto|RU|Shining War-God
Lugus|AO|The Many-Skilled
Epona|NY|Lady of Horses
Mari|EC|Lady of Anboto
Sugaar|SF|Serpent of Fire
Urtzi|KS|The Sky
Ilargi|MD|Light of the Dead
Eguzki|UY|Grandmother Sun
Basajaun|NO|Lord of the Woods
Abellio|EU|Apple-Lord of the Pyrenees
Erriapus|CK|Lord of the Peak
Ilurberrixo|KC|New Town Guardian
Aherbelste|NC|The Black He-Goat
Betatun|YE|Lady of the Sanctuary
Tanit of Ibiza|MY|Lady of the Cave
Melqart of Gadir|RW|Lord of the Pillars
Noctiluca|MX|Night-Shiner of Malaca
Habis|EA|The Law-Giving King
Gargoris|EV|Discoverer of Honey
Geryon|NR|Three-Bodied Herdsman
Arconi|NH|The Bear
Duillae|EL|Twin Ladies of Vegetation
Crouga|CA|Lord of the Sacred Rock
Tongoenabiagus|WA|Lord of the Oath Spring
Aernus|SC|Wind of Bragança
Vaelicus|ND|Wolf-Lord of the Vettones
Candamius|KC|Lord of the Thunder Peak
Erudinus|SK|Cantabrian Thunderer
Dercetius|CU|Lord of the Mountain Eye
`);

PAN("celtic", "Celtic", "celtic", "celt|gaul|briton|brittonic|goidel|pict|belg|galat|hallstatt|la t.ne|caledon", `
Lugus|AO|The Many-Skilled
Taranis|SK|The Thunderer
Teutates|RK|Father of the Tribe
Esus|ON|The Woodcutter Lord
Cernunnos|NE|The Horned One
Epona|NY|Great Mare
Belenus|UY|The Bright One
Brigantia|FA|The High One
Nodens|WY|The Cloud-Maker
Ogmios|AV|Strong of Speech
Sucellus|EV|The Good Striker
Nantosuelta|FE|Lady of the Winding River
Rosmerta|EX|The Great Provider
Sirona|YM|Lady of Stars and Springs
Grannus|YU|Lord of Hot Springs
Borvo|WY|The Boiling One
Maponos|VH|The Divine Son
Matrona|YE|The Divine Mother
Andraste|RX|The Unconquered
Camulus|RK|Champion of the Remi
Nemetona|AN|Lady of the Sacred Grove
Artio|NE|Bear-Mother
Arduinna|HN|Boar-Rider of the Forest
Damona|NY|Divine Cow
Sequana|WY|Lady of the Seine Springs
Segomo|RK|The Victor
Smertrios|RE|The Provider With the Club
Cathubodua|RD|Battle Crow
Abnoba|HW|Lady of the Black Forest
Vosegus|NC|Lord of the Vosges
Coventina|WY|Lady of the Well
Sulis|UY|Eye of the Hot Spring
Cocidius|RH|The Red One
Belatucadros|RD|Fair Shining Slayer
Mogons|KR|The Mighty One
Verbeia|WE|Lady of the Wharfe
Ancasta|WT|The Swift One
Ricagambeda|AK|Lady of the Furrow
The Dagda|EK|The Good God
The Morrígan|RX|Phantom Queen
Lugh|AO|Of the Long Arm
Nuada|KR|Silver-Hand
Brigid|FY|Exalted One
Manannán|WX|Son of the Sea
Goibniu|OF|Smith of the Feast
Dian Cécht|YO|Swift Power
Ogma|AR|Sun-Faced Champion
Aengus|LV|The Young Son
Danu|EZ|Mother of the Tribe
Badb|RD|The Scald-Crow
Macha|RN|Lady of the Horse Plain
Nemain|RX|Battle-Frenzy
Ériu|EK|Lady of the Land
Boann|WA|White Cow of the River
Lir|WZ|The Sea
Midir|DL|Lord of Brí Léith
Donn|DC|The Dark One
Balor|ZU|Of the Baleful Eye
Crom Cruach|ED|Bowed One of the Mound
Tailtiu|EY|Foster-Mother of the Harvest
Flidais|NH|Lady of Deer and Woodland
Airmed|YE|Keeper of Herbs
Creidhne|OA|The Bronze-Worker
Luchta|OE|The Wright
Bres|EK|The Beautiful Tyrant
Cailleach|CZ|The Veiled Hag of Winter
Áine|LU|Bright Lady of Midsummer
Belisama|FU|Summer-Bright
Icovellauna|WY|Lady of the Good Spring
Ucuetis|OF|Smith of Alesia
Bergusia|OE|Lady of Craft
Alisanos|CE|Lord of the Rock
Rudiobus|NR|The Red Horse
Moccus|NE|The Swine
Naria|XL|Lady of Luck
Litavis|EK|The Broad Earth
Vindonnus|YU|The Clear Light
Ritona|WT|Lady of the Fords
Souconna|WE|Lady of the Saône
Dea Matres|YX|The Three Mothers
Gobannos|OF|The Great Smith
Ambisagrus|SK|The Persistent
Intarabus|RW|The One Between
Lenus|YR|Healer of the Treveri
Loucetios|SR|The Lightning
Rigisamus|KR|Most Kingly
Robor|NE|The Oak
Tarvos Trigaranus|NK|Bull With Three Cranes
Vellaunus|KA|The Good Ruler
`);

PAN("germanic", "Germanic", "rune", "german|norse|nordic|jastorf|pomeran|lusatian|suebi|cimbr|teuton", `
Wodanaz|XK|Lord of Frenzy
Thunraz|SR|The Thunderer
Tiwaz|AR|The Sky-Father's Law
Frijjo|LX|The Beloved
Nerthus|EY|Mother Earth of the Wagon
Ingwaz|EK|Lord of the Ingaevones
Wulthuz|HC|The Glory of the Bow
Balthaz|UY|The Shining Lord
Sowilo|UK|Lady Sun
Menan|MX|The Moon
Austro|UL|Lady of the Shining Dawn
Fullo|EL|Bounty
Hludana|EW|The Famous One
Tamfana|EM|Lady of the Harvest Moon
Baduhenna|RN|Lady of the Battle Grove
Nehalennia|WT|Lady of the Northern Sea
Alcis|RY|The Twin Brothers
Mannus|ZK|First Man
Tuisto|ZE|The Twofold Born of Earth
Wulfaz|NR|The Wolf
Garmangabis|EY|The Giving One
Vagdavercustis|RA|Lady of Valour
Hariasa|RX|Goddess of the Host
Sandraudiga|EU|Lady of the Red Sand
Vihansa|RA|Battle-Goddess
Haeva|LY|Bride of the Club-Bearer
Magusanus|RN|The Mighty Old One
Requalivahanus|MD|Lord of Darkness
Saxnot|RK|Sword-Companion
Erminaz|KR|The Great One
Idisi|XR|The Battle-Maidens
Wurdiz|XD|What Has Become
Aegir|WV|Brewers of the Sea
Loge|FT|The Flame
Skadi|CH|Lady of the Snowshoes
Njorthuz|WE|Lord of Ships and Wealth
Thingsus|AK|Lord of the Assembly
Beda|AX|Lady of Pleas
Fimmilena|AT|Lady of the Fivefold Law
Matronae Aufaniae|YE|The Generous Mothers
Sinthgunt|MT|Night-Walker
Volla|EX|Fullness
Hretha|RC|The Fierce Winter
Seaxneat|RO|Friend of the Blade
Hermod|TD|The Swift Rider
Gullveig|XF|Thrice-Burned
`);

PAN("baltic", "Baltic", "rune", "balt|aesti|galind|sudov", `
Dievas|KA|Bright Sky Father
Perkūnas|SR|Oak-Thunderer
Saulė|UY|Mother Sun
Mėnulis|MR|The Moon Prince
Laima|XY|Fate-Giver
Žemyna|EY|Mother of Fields
Velnias|DT|Herdsman of the Dead
Aušrinė|UL|Morning Star
Medeina|HN|She-Wolf of the Forest
Gabija|FY|Hearth Flame
Patrimpas|EW|Lord of Running Water
Pikuolis|DX|The Wrathful
Ragana|XM|The Seer-Witch
Giltinė|DC|The Stinger
Žvorūnė|HN|Hound of the Hunt
Bangpūtys|WS|Wave-Blower
Vėjopatis|ST|Master of the Wind
Milda|LV|Lady of Courtship
Austėja|EL|Bee-Queen
Bubilas|EV|Lord of the Hive
Kalvis|OU|The Heavenly Smith
Ašvieniai|UT|The Divine Twins
Jūratė|WL|Queen of the Amber Sea
Javinė|EC|Lady of the Granary
Lazdona|NE|Lady of Hazel
Aitvaras|FX|The Fiery Serpent
Kaukas|EO|The Hearth Sprite
Vakarinė|ML|Evening Star
Dalia|XT|Giver of Shares
Māra|EW|Mother of the Earth and Waters
Ūsiņš|UN|Lord of Horses and Light
Jumis|EV|The Double Ear of Grain
Meža māte|NH|Mother of the Forest
Veļu māte|DC|Mother of Shades
`);

PAN("slavic", "Old Slavic", "rune", "slav|milograd|zarubin|venedi|neuri|budin", `
Perun|SR|The Striker
Veles|DN|Lord of Cattle and the Below
Mokosh|EX|Moist Mother
Svarog|OK|The Heavenly Smith
Dazhbog|UK|The Giving Sun
Stribog|SC|Grandfather of the Winds
Svarozhich|FO|Son of the Forge
Khors|UM|The Round Disc
Simargl|NE|Winged Hound of the Seed
Rod|ZX|The Kin-Maker
Rozhanitsy|XY|The Birth-Fates
Lada|LV|Lady of Harmony
Yarilo|EL|Lord of the Spring Shoots
Morana|DC|Winter-Death
Zorya|UM|The Dawn Maidens
Triglav|KZ|The Three-Headed
Svetovit|RX|Four-Faced Seer
Chernobog|DM|The Black God
Belobog|UY|The White God
Zhiva|YE|The Living One
Leshy|NT|Lord of the Forest
Vodyanoy|WD|Old Man of the Mill-Pond
Domovoy|FY|Grandfather of the House
Rusalka|WL|Spirit of the Drowned
Baba Yaga|XD|Bone-Leg of the Border
Kupala|WF|Midsummer Fire and Water
Kostroma|EL|Straw Maiden
Dodola|SE|Rain-Bringer
Zemlya|EA|Damp Mother Earth
Poludnitsa|UE|Lady Midday
`);

PAN("uralic", "Uralic", "rune", "finn|ural|sami|saami|samoyed|mansi|khanty|komi|perm|mordv|volga|ugr|selkup|enets|nenets|hasava|ngan|kulai|tobol", `
Ukko|SK|Old Man of the Sky
Akka|EY|The Old Woman
Ilmarinen|OS|Forger of the Sky
Väinämöinen|VA|The Eternal Singer
Tapio|NH|King of the Forest
Mielikki|NY|Mistress of the Wood
Ahti|WR|Lord of the Waves
Vellamo|WL|Lady of the Rolling Sea
Tuoni|DM|Lord of Tuonela
Tuonetar|DV|Hostess of the Dead
Louhi|XC|Gap-Toothed Crone of the North
Päivätär|UO|Sun-Maiden at the Loom
Kuutar|MO|Moon-Maiden
Pekko|EV|Lord of Barley
Lempo|LX|The Fickle Flame
Hiisi|NC|Spirit of the Sacred Hill
Kalma|DC|The Smell of the Grave
Nyyrikki|HN|Red-Capped Hunter
Tellervo|NL|Daughter of the Forest
Otso|NK|The Honey-Paw
Ilmatar|ZS|Maiden of the Air
Lemminkäinen|RT|The Reckless One
Horagalles|SR|Thunder-Man
Beaivi|UY|Sun-Maiden of the Reindeer
Máttaráhkká|YE|Ancestor Mother
Sáráhkká|YF|Lady of the Hearth and Birth
Juksáhkká|HY|Lady of the Bow
Uksáhkká|TY|Lady of the Door
Leib-Olmai|NH|Alder-Man of the Bears
Bieggolmai|SC|Wind-Man
Jábmiidáhkká|DC|Lady of the Dead
Radien-attje|KZ|The Ruling Father
Tjaetsieålmaj|WH|Water-Man
Numi-Torum|KZ|Sky-Father of the Ob
Mir-susne-hum|TA|The World-Surveying Man
Kaltes-Ekwa|YU|Lady of the Dawn
Kul-otyr|DW|Lord of the Lower World
Jelping-ja-oyka|NK|The Sacred Bear
Num|KZ|The Sky
Nga|DZ|Lord of the Below
Ya-nebya|EY|Mother Earth
Ilibem-berti|NY|Giver of Reindeer
Inmar|KS|Sky Lord of the Kama
Kyldysin|EY|Lord of Fertility
Shkay|KZ|Maker of the Erzya
Ange-patyai|YL|The Bee-Mother
Kugu Yumo|KA|The Great God
Mlande-ava|EY|Earth Mother
`);
