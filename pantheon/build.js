// Pantheon layer build: node pantheon/build.js [index.html]
// Joins pantheon/src/*.js into one script, puts it into index.html between the PANTHEON markers
// (replacing the old copy), then parses every <script> of the page so a syntax slip never ships.
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, ".."), file = process.argv[2] || path.join(root, "index.html");
const dir = path.join(__dirname, "src");
const src = fs.readdirSync(dir).filter(f => f.endsWith(".js")).sort().map(f => `/* ---- ${f} ---- */\n` + fs.readFileSync(path.join(dir, f), "utf8")).join("\n");
const code = `(() => {\n"use strict";\n${src}\n})();`;
if (/<\/script/i.test(code)) throw new Error('"</script" inside the pantheon source');
try { new vm.Script(code, { filename: "pantheon.js" }); } catch (e) { console.error("PANTHEON SYNTAX ERROR:", e.message, "\n", (e.stack || "").split("\n").slice(0, 4).join("\n")); process.exit(1); }
let h = fs.readFileSync(file, "utf8");
const A = "<!--PANTHEON:BEGIN-->", B = "<!--PANTHEON:END-->", block = `${A}<script>\n${code}\n</script>${B}`;
const i = h.indexOf(A), j = h.indexOf(B);
if (i >= 0 && j > i) h = h.slice(0, i) + block + h.slice(j + B.length);
else { const k = h.lastIndexOf("</body>"); if (k < 0) throw new Error("no </body>"); h = h.slice(0, k) + block + "\n" + h.slice(k); }
let n = 0; const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g; let m;
while ((m = re.exec(h))) { try { new vm.Script(m[1], { filename: "script" + n }); } catch (e) { console.error(`script ${n} does not parse:`, e.message); process.exit(1); } n++; }
fs.writeFileSync(file, h);
console.log(`pantheon: ${(code.length / 1024).toFixed(0)} KB in, ${n} scripts parse, ${file}`);
