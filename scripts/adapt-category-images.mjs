import fs from 'node:fs/promises';
import sharp from 'sharp';
const brand = JSON.parse(await fs.readFile('src/config/brand.json', 'utf8'));
const rgb = brand.palette.primary
  .slice(1)
  .match(/../g)
  .map((channel) => parseInt(channel, 16));
const target = rgb.map((channel) => channel / Math.max(...rgb));
const images = ['mecanica', 'frenos', 'suspension', 'sistema-electrico', 'iluminacion'];
const report = [];
for (const name of images) {
  const original = `assets/legacy-public/categories/${name}.webp`;
  const { data, info } = await sharp(original)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let edited = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i] / 255,
      g = data[i + 1] / 255,
      b = data[i + 2] / 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b),
      delta = max - min;
    if (!delta || !max) continue;
    let hue =
      max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
    hue = (hue * 60 + 360) % 360;
    const saturation = delta / max;
    // Include all blue/cyan painted details and their reflections; keep neutral steel untouched.
    if (hue < 155 || hue > 250 || saturation < 0.18) continue;
    const blend =
      Math.min(1, (saturation - 0.18) / 0.15) * Math.min(1, (hue - 155) / 8, (250 - hue) / 8);
    const recolored = target.map((channel) => max * (1 - saturation + saturation * channel));
    data[i] = Math.round((r * (1 - blend) + recolored[0] * blend) * 255);
    data[i + 1] = Math.round((g * (1 - blend) + recolored[1] * blend) * 255);
    data[i + 2] = Math.round((b * (1 - blend) + recolored[2] * blend) * 255);
    if (blend > 0.5) edited++;
  }
  const output = `public/images/categories/${name}-rojo.webp`;
  await sharp(data, { raw: info }).webp({ quality: 92, effort: 6 }).toFile(output);
  report.push({
    original,
    output,
    primary: brand.palette.primary,
    recoloredPixels: edited,
    bytes: (await fs.stat(output)).size,
  });
}
await fs.writeFile('assets/hero-gtr/category-colors.json', JSON.stringify(report, null, 2) + '\n');
console.log(report);
