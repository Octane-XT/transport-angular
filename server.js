// server.js — Serve Angular build under /transport with Express 5
// - Auto-detects dist/.../browser if present
// - Safe SPA fallback using RegExp (no '*' patterns)
// - Static caching for assets, no-cache for index.html

const path = require('path');
const fs = require('fs');
const express = require('express');
const compression = require('compression');

const app = express();

// -------------------- Config --------------------
const PORT = process.env.PORT || 8080;

// Base URL where the app is served (default: /transport)
// If you change it, also build Angular with: --base-href <BASE_HREF>/ --deploy-url <BASE_HREF>/
const BASE_HREF = (process.env.BASE_HREF || '/transport').replace(/\/+$/, '') || '/';

// -------------------- Resolve dist path --------------------
function exists(p) {
  try { return fs.existsSync(p); } catch { return false; }
}

function findDistPath() {
  // 1) If provided explicitly
  if (process.env.DIST_PATH) {
    let p = process.env.DIST_PATH;
    // If a "browser" subdir exists with index.html, prefer it
    const browserCandidate = path.join(p, 'browser');
    if (exists(path.join(browserCandidate, 'index.html'))) return browserCandidate;
    return p;
  }

  const root = __dirname;

  // 2) Primary guess: dist/transport
  let p = path.join(root, 'dist', 'transport');
  if (exists(path.join(p, 'browser', 'index.html'))) return path.join(p, 'browser');
  if (exists(path.join(p, 'index.html'))) return p;

  // 3) Secondary guess: dist/<repo-name>
  const repoName = path.basename(process.cwd());
  p = path.join(root, 'dist', repoName);
  if (exists(path.join(p, 'browser', 'index.html'))) return path.join(p, 'browser');
  if (exists(path.join(p, 'index.html'))) return p;

  // 4) Fallback: scan first subdir in dist/ containing index.html or browser/index.html
  const distRoot = path.join(root, 'dist');
  if (exists(distRoot)) {
    const dirs = fs.readdirSync(distRoot, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => path.join(distRoot, d.name));
    for (const d of dirs) {
      if (exists(path.join(d, 'browser', 'index.html'))) return path.join(d, 'browser');
      if (exists(path.join(d, 'index.html'))) return d;
    }
  }

  // Last resort — return the primary guess (may 500 if index.html truly missing)
  return path.join(root, 'dist', 'transport');
}

const distPath = findDistPath();
const indexHtmlPath = path.join(distPath, 'index.html');

// -------------------- Middleware --------------------
app.disable('x-powered-by');
app.use(compression());

// Serve static assets at BASE_HREF
app.use(
  BASE_HREF,
  express.static(distPath, {
    maxAge: '7d',
    etag: true,
    lastModified: true,
    index: false, // we'll serve index.html ourselves
    setHeaders: (res, filePath) => {
      if (path.basename(filePath).toLowerCase() === 'index.html') {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      }
    }
  })
);

// Optional: redirect root → BASE_HREF/
if (BASE_HREF !== '/') {
  app.get('/', (_req, res) => res.redirect(BASE_HREF + '/'));
}

// -------------------- SPA fallback (Express 5-safe) --------------------
function escapeRegExp(str) {
  // escape regex special chars: . * + ? ^ $ { } ( ) | [ ] \ /
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
const baseRegex = new RegExp('^' + escapeRegExp(BASE_HREF) + '(?:/.*)?$');

app.get(baseRegex, (_req, res) => {
  if (!exists(indexHtmlPath)) {
    return res
      .status(500)
      .send(`index.html introuvable dans ${indexHtmlPath}. Exécute "ng build" et vérifie le chemin.`);
  }
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.sendFile(indexHtmlPath);
});

// -------------------- Start --------------------
app.listen(PORT, () => {
  console.log('✅ Serving Angular from:', distPath);
  console.log('🧭 Base href:', BASE_HREF);
  console.log(`👉 Open: http://192.168.0.176:${PORT}${BASE_HREF === '/' ? '' : BASE_HREF + '/'}`);
});

/*
Build command (match BASE_HREF):
  npx ng build --configuration production --base-href /transport/ --deploy-url /transport/

Override paths if needed:
  BASE_HREF=/myapp DIST_PATH=/absolute/path/to/dist/transport/browser PORT=8080 node server.js
*/

