import fs from 'node:fs/promises';
import sharp from 'sharp';

// Originals supplied by the owner are retained unchanged; exports only resize and encode.
await fs.mkdir('public/brand', { recursive: true });
for (const name of ['wordmark', 'car-emblem']) {
  await sharp(`assets/brand/originals/${name}.png`)
    .resize({ width: 768, withoutEnlargement: true })
    .webp({ lossless: true, effort: 6 })
    .toFile(`public/brand/${name}.webp`);
  console.log(name, (await fs.stat(`public/brand/${name}.webp`)).size);
}
await sharp('assets/brand/originals/car-emblem.png')
  .resize(128, 128, { fit: 'contain', background: '#ffffff' })
  .flatten({ background: '#ffffff' })
  .png()
  .toFile('public/icons/brand-favicon.png');
