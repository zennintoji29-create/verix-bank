/**
 * Verix Bank — Production Web Server for Render
 * Serves the exact React Command Center & Bank Admin Desk
 * Features zero-dependency ultra-fast boot and 10-minute automated keep-alive daemon.
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 10000;
const PUBLIC_DIR = __dirname;
const BACKEND_RENDER_URL = 'https://fruadsih.onrender.com';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Healthcheck for Render
  if (req.url === '/health' || req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'verix-bank-portal', uptime: process.uptime() }));
    return;
  }

  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(PUBLIC_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    // SPA Fallback: If requested route is not a physical file (e.g. client router), serve index.html
    if (err || !stats.isFile()) {
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🛡️ Verix Bank Portal listening on port ${PORT}`);
  initKeepAliveDaemon();
});

// ── 🔄 Automated 10-Minute Render Keep-Alive Daemon ──
function initKeepAliveDaemon() {
  function pingServices() {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[Keep-Alive ${timestamp}] 📡 Sending heartbeat to ${BACKEND_RENDER_URL}...`);
    
    https.get(BACKEND_RENDER_URL, (res) => {
      console.log(`[Keep-Alive ${timestamp}] ✓ Live backend responded (${res.statusCode})`);
    }).on('error', (err) => {
      console.warn(`[Keep-Alive ${timestamp}] ⚠️ Ping status:`, err.message);
    });
  }

  // Initial ping on boot
  pingServices();
  // Continuous 10-minute heartbeat (600,000 ms)
  setInterval(pingServices, 10 * 60 * 1000);
}
