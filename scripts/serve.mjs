import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
const compressedAssets = new Map();
const root = path.resolve('dist');
const args = process.argv.slice(2);
const port = Number(args[args.indexOf('--port') + 1]) || 4173;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.glb': 'model/gltf-binary',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};
const headerRules = [];
let rule;
for (const line of (await fs.readFile(path.join(root, '_headers'), 'utf8')).split(/\r?\n/)) {
  if (line.startsWith('/')) {
    rule = { prefix: line.trim().replace(/\*$/, ''), headers: {} };
    headerRules.push(rule);
  } else if (rule && /^\s+\S/.test(line)) {
    const [name, ...value] = line.trim().split(':');
    rule.headers[name] = value.join(':').trim();
  }
}
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://127.0.0.1');
  let decoded;
  try {
    decoded = decodeURIComponent(url.pathname);
  } catch {
    res.writeHead(400);
    res.end();
    return;
  }
  if (decoded.startsWith('/api/')) {
    res.writeHead(503, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({ ok: false, code: 'LOCAL_STATIC_PREVIEW' }));
    return;
  }
  let file = path.resolve(root, '.' + decoded);
  if (file !== root && !file.startsWith(root + path.sep)) {
    res.writeHead(403);
    res.end();
    return;
  }
  let status = 200;
  try {
    if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html');
    await fs.access(file);
  } catch {
    file = path.join(root, '404.html');
    status = 404;
  }
  try {
    let bytes = await fs.readFile(file);
    const compress =
      /\.(html|css|js|svg|xml|txt|json)$/.test(file) &&
      (req.headers['accept-encoding'] || '').includes('gzip');
    if (compress) {
      const stamp = `${file}:${(await fs.stat(file)).mtimeMs}`;
      let cached = compressedAssets.get(stamp);
      if (!cached) {
        cached = gzipSync(bytes);
        compressedAssets.set(stamp, cached);
      }
      bytes = cached;
    }
    const headers = Object.assign(
      {},
      ...headerRules.filter((r) => decoded.startsWith(r.prefix)).map((r) => r.headers),
    );
    res.writeHead(status, {
      ...headers,
      ...(compress ? { 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' } : {}),
      'Content-Type': types[path.extname(file)] || 'application/octet-stream',
      'Content-Length': bytes.length,
    });
    res.end(req.method === 'HEAD' ? undefined : bytes);
  } catch {
    res.writeHead(500);
    res.end('Build unavailable');
  }
});
server.listen(port, '127.0.0.1', () =>
  console.log(`Local: http://127.0.0.1:${port}/ (static HTML + security headers)`),
);
