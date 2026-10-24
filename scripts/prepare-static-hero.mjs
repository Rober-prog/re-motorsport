import fs from 'node:fs/promises';
import sharp from 'sharp';
const images = [
  ['desktop', 1672],
  ['mobile', 900],
];
await fs.mkdir('public/images', { recursive: true });
const metadata = [];
for (const [variant, width] of images) {
  const output = `public/images/hero-nissan-gtr-${variant}.webp`;
  await sharp(`assets/hero-gtr/${variant}-master.png`)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 90, effort: 6 })
    .toFile(output);
  const image = await sharp(output).metadata();
  metadata.push({
    path: output,
    width: image.width,
    height: image.height,
    bytes: (await fs.stat(output)).size,
  });
}
await fs.writeFile('assets/hero-gtr/exports.json', JSON.stringify(metadata, null, 2) + '\n');
console.log(metadata);
