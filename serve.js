// Minimal static file server (no dependencies) so the app can be opened in a
// browser — ES module imports don't work from file://.
//
// Run:  node serve.js   (then open http://localhost:5173)
// On this machine node isn't on PATH; use the bundled one — see README.

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const ROOT = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5173;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const server = createServer(async (req, res) => {
  try {
    let urlPath = decodeURIComponent(req.url.split("?")[0]);
    if (urlPath === "/") urlPath = "/index.html";

    // Prevent path traversal outside ROOT.
    const filePath = normalize(join(ROOT, urlPath));
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403).end("Forbidden");
      return;
    }

    const data = await readFile(filePath);
    const type = MIME[extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  } catch (err) {
    res.writeHead(err.code === "ENOENT" ? 404 : 500);
    res.end(err.code === "ENOENT" ? "Not found" : "Server error");
  }
});

server.listen(PORT, () => {
  console.log(`Serving ${ROOT}`);
  console.log(`Open  http://localhost:${PORT}`);
});
