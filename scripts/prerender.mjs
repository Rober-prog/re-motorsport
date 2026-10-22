import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { render, paths } from '../.ssr/entry-server.js';
const template = await fs.readFile('dist/index.html', 'utf8');
const basePath = process.env.VITE_BASE_PATH || '/';
const business = JSON.parse(await fs.readFile('src/data/business.json', 'utf8'));
const fontAssets = await fs.readdir('dist/assets');
const preloadFonts = fontAssets
  .filter((file) => /^(inter|manrope)-latin-wght-normal.*\.woff2$/.test(file))
  .map(
    (file) =>
      `<link rel="preload" href="${basePath}assets/${file}" as="font" type="font/woff2" crossorigin />`,
  )
  .join('');
const structuredData = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://rmartorell.com/#website',
      url: 'https://rmartorell.com',
      name: 'Recanvis Martorell',
      inLanguage: ['es', 'ca'],
    },
    {
      '@type': 'Organization',
      '@id': 'https://rmartorell.com/#organization',
      name: 'Recanvis Martorell',
      url: 'https://rmartorell.com',
      legalName: business.legalName,
      taxID: business.taxId,
      logo: 'https://rmartorell.com/brand/wordmark.webp',
      sameAs: [business.classicStore],
      address: {
        '@type': 'PostalAddress',
        ...(business.streetNumberConfirmed
          ? { streetAddress: business.address.streetAddress }
          : {}),
        addressLocality: business.address.addressLocality,
        addressRegion: business.address.addressRegion,
        postalCode: business.address.postalCode,
        addressCountry: business.address.addressCountry,
        // Street number stays omitted until the 4 / 4A discrepancy is resolved.
      },
    },
  ],
});
const schemaMarkup = `<script type="application/ld+json">${structuredData}</script>`;
for (const url of [...paths, '/404']) {
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
const root = 'https://rmartorell.com';
const entries = paths.map((url) => `<url><loc>${root}${url}</loc></url>`).join('\n');
await fs.writeFile(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`,
);
await fs.writeFile(
  'dist/robots.txt',
  `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${root}/sitemap.xml\n`,
);
const headers = await fs.readFile('dist/_headers', 'utf8');
const schemaHash = createHash('sha256').update(structuredData).digest('base64');
await fs.writeFile(
  'dist/_headers',
  headers.replace("script-src 'self'", `script-src 'self' 'sha256-${schemaHash}'`),
);
// Exclude the unoptimized original and the visual reference from the deployable output.
await fs.rm('dist/models/Lamborghini+Temerario.glb', { force: true });
const distRoot = path.resolve('dist');
const referenceOutput = path.resolve(distRoot, 'references');
if (!referenceOutput.startsWith(distRoot + path.sep))
  throw new Error('Reference output outside dist');
await fs.rm(referenceOutput, { recursive: true, force: true });
console.log(
  `Prerenderizadas ${paths.length} rutas + 404. HTML comercial disponible sin JavaScript.`,
);
