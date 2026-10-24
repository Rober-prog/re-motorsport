import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const source = 'assets/brand/re-motorsport/logo-original.jpeg';
const original = await fs.readFile(source);
const { data, info } = await sharp(original)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const red = [[], [], []],
  black = [[], [], []],
  white = [[], [], []];
const histogram = new Map();
for (let y = 0; y < Math.min(145, info.height); y++) {
  for (let x = 0; x < Math.min(500, info.width); x++) {
    const offset = (y * info.width + x) * info.channels;
    const rgb = [data[offset], data[offset + 1], data[offset + 2]];
    const [r, g, b] = rgb;
    const group =
      r > 200 && g < 45 && b < 45
        ? red
        : r < 30 && g < 30 && b < 30
          ? black
          : r > 248 && g > 248 && b > 248
            ? white
            : null;
    if (group) rgb.forEach((value, channel) => group[channel].push(value));
    if (group === red) {
      const key = rgb.join(',');
      histogram.set(key, (histogram.get(key) || 0) + 1);
    }
  }
}
const median = (values) => values.sort((a, b) => a - b)[Math.floor(values.length / 2)];
const summarize = (group) => {
  const rgb = group.map(median);
  return {
    rgb,
    hex:
      '#' +
      rgb
        .map((v) => v.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase(),
    samples: group[0].length,
  };
};
const result = {
  source,
  sha256: createHash('sha256').update(original).digest('hex'),
  dimensions: { width: info.width, height: info.height },
  method:
    'Mediana por canal sRGB en la zona de marca x<500, y<145. Rojo: R>200,G<45,B<45. Negro: canales<30. Blanco: canales>248. Exclusión de fondo y bordes de color mixto para el rojo.',
  confidence:
    'Colores representativos del JPEG aportado por el usuario; no son una carta de color oficial ni valores Pantone certificados.',
  red: summarize(red),
  black: summarize(black),
  white: summarize(white),
  redModes: [...histogram].sort((a, b) => b[1] - a[1]).slice(0, 8),
};
await fs.writeFile(
  'assets/brand/re-motorsport/palette-sampling.json',
  JSON.stringify(result, null, 2) + '\n',
);
console.log(JSON.stringify({ red: result.red, black: result.black, white: result.white }));
