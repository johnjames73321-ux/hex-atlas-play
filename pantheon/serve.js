// Local test server for the game folder: node pantheon/serve.js [port]   (own port = own localStorage, never the live saves)
const http = require("http"), fs = require("fs"), path = require("path");
const root = path.join(__dirname, ".."), port = +process.argv[2] || 8792;
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".css": "text/css" };
http.createServer((q, s) => {
  let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
  const f = path.join(root, p); if (!f.startsWith(root)) { s.writeHead(403); return s.end(); }
  fs.readFile(f, (e, b) => { if (e) { s.writeHead(404); return s.end("not found"); } s.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream", "Cache-Control": "no-store" }); s.end(b); });
}).listen(port, "127.0.0.1", () => console.log("serving " + root + " on http://127.0.0.1:" + port));
