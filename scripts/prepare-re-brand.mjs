import fs from 'node:fs/promises';
import sharp from 'sharp';
const brand = JSON.parse(await fs.readFile('src/config/brand.json', 'utf8'));
const p = brand.palette;
await fs.mkdir('public/brand', { recursive: true });
await fs.mkdir('public/icons', { recursive: true });
// Native AI reconstruction retained unchanged; larger exports are raster derivatives, not vectors.
const master = await fs.readFile(brand.logo.master);
for (const width of [1024, 2048, 4096]) {
  await sharp(master)
    .resize({ width })
    .png()
    .toFile(`public/brand/logo-re-motorsport-${width}.png`);
}
await sharp(master)
  .resize({ width: 4096 })
  .flatten({ background: p.white })
  .png()
  .toFile('public/brand/logo-re-motorsport-4096-white.png');
// Use the exact emblem in the supplied JPEG for small icons, preserving the original geometry.
const emblem = await sharp(brand.logo.source)
  .extract({ left: 4, top: 3, width: 126, height: 130 })
  .png()
  .toBuffer();
for (const [filename, size] of [
  ['favicon.png', 128],
  ['favicon-32.png', 32],
  ['apple-touch-icon.png', 180],
]) {
  await sharp(emblem)
    .resize(size, size, { fit: 'contain', background: p.white })
    .png()
    .toFile('public/icons/' + filename);
}
const social = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="${p.ink}"/><path d="M900 0L630 630M1040 0L770 630M1180 0L910 630" stroke="${p.primary}" stroke-opacity=".13" stroke-width="45"/><rect x="65" y="50" width="370" height="128" rx="8" fill="${p.white}"/><text x="65" y="300" font-family="Arial,sans-serif" font-size="66" font-weight="700" fill="${p.white}">Encuentra el recambio</text><text x="65" y="390" font-family="Arial,sans-serif" font-size="66" font-weight="700" fill="${p.primary}">que necesitas.</text><text x="65" y="540" font-family="Arial,sans-serif" font-size="23" letter-spacing="5" fill="${p.muted}">ESPARREGUERA / PIERA</text></svg>`;
const socialLogo = await sharp(master).resize({ width: 330 }).png().toBuffer();
await sharp(Buffer.from(social))
  .composite([{ input: socialLogo, left: 85, top: 67 }])
  .jpeg({ quality: 92 })
  .toFile('public/images/social.jpg');
const css = Object.entries(p)
  .map(([key, value]) => `  --brand-${key}: ${value};`)
  .join('\n');
await fs.writeFile(
  'src/styles/brand.css',
  `/* Generated from brand.json: sampled JPEG colors + documented accessible UI variants. */\n:root {\n${css}\n}\n`,
);
console.log(
  'Logo restaurado, PNG 1024/2048/4096, iconos originales, OG y tema rojo/negro generados.',
);
