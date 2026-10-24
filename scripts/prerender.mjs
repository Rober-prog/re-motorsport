import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { loadEnv } from 'vite';
import { render, paths } from '../.ssr/entry-server.js';
const template = await fs.readFile('dist/index.html', 'utf8');
const env = { ...loadEnv('production', process.cwd(), 'VITE_'), ...process.env };
const basePath = env.VITE_BASE_PATH || '/';
const brand = JSON.parse(await fs.readFile('src/config/brand.json', 'utf8'));
let origin = '';
try {
  const url = new URL(env.VITE_SITE_URL || '');
  if (
    url.protocol === 'https:' &&
    url.pathname === '/' &&
    !url.search &&
    !url.hash &&
    !url.username &&
    !url.password
  )
    origin = url.origin;
} catch {
  /* Domain remains unconfirmed. */
}
const structuredData = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: brand.name,
      inLanguage: ['es-ES', 'ca-ES'],
      ...(origin ? { url: origin } : {}),
    },
    ...brand.stores
      .filter((s) => s.visible && s.status === 'corroborated-public-listings')
      .map((s) => ({
        '@type': 'AutoPartsStore',
        name: `${brand.name} ${s.name}`,
        telephone: s.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: s.street,
          postalCode: s.postalCode,
          addressLocality: s.city,
          addressRegion: s.region,
          addressCountry: 'ES',
        },
        ...(origin ? { url: `${origin}/tiendas#${s.id}` } : {}),
      })),
  ],
});
const schemaMarkup = `<script type="application/ld+json">${structuredData}</script>`;
const fontAssets = await fs.readdir('dist/assets');
const preloadFonts = fontAssets
  .filter((f) => /^(inter|manrope)-latin-wght-normal.*\.woff2$/.test(f))
  .map(
    (f) =>
      `<link rel="preload" href="${basePath}assets/${f}" as="font" type="font/woff2" crossorigin />`,
  )
  .join('');
for (const url of [...new Set(paths), '/404']) {
  const { html, head, locale } = render(url);
  const output = template
    .replace('lang="es"', `lang="${locale}"`)
    .replace('<!--app-head-->', head + schemaMarkup + preloadFonts)
    .replace('<div id="root">', `<div id="root" data-route="${url}">`)
    .replace('<!--app-html-->', html);
  const target =
    url === '/404' ? 'dist/404.html' : url === '/' ? 'dist/index.html' : `dist${url}/index.html`;
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, output);
}
const canonicalPaths = paths.filter(
  (url) =>
    !/^\/es(\/|$)/.test(url) &&
    !['/aviso-legal', '/privacidad', '/cookies'].includes(url.replace(/^\/ca(?=\/|$)/, '') || '/'),
);
await fs.writeFile(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${origin ? canonicalPaths.map((url) => `<url><loc>${origin}${url}</loc></url>`).join('\n') : ''}</urlset>`,
);
await fs.writeFile(
  'dist/robots.txt',
  origin
    ? `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n# Dominio y datos legales pendientes.\n',
);
const headers = await fs.readFile('dist/_headers', 'utf8');
await fs.writeFile(
  'dist/_headers',
  headers.replace(
    "script-src 'self'",
    `script-src 'self' 'sha256-${createHash('sha256').update(structuredData).digest('base64')}'`,
  ),
);
// The static site does not ship retired 3D models or reference material.
for (const relative of ['models', 'references', 'images/categories/neumaticos.webp']) {
  const distRoot = path.resolve('dist');
  const target = path.resolve(distRoot, relative);
  if (!target.startsWith(distRoot + path.sep)) throw new Error('Output outside dist');
  await fs.rm(target, { recursive: true, force: true });
}
console.log(
  `Prerenderizadas ${new Set(paths).size} rutas y 404. Dominio: ${origin || 'pendiente; indexación desactivada'}.`,
);
