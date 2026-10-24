import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import sharp from 'sharp';
await fs.mkdir('.cache/previews', { recursive: true });
await fs.mkdir('public/images', { recursive: true });
const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
});
const messages = [];
page.on('pageerror', (e) => messages.push(`PAGEERROR: ${e.message}`));
page.on('console', (msg) => {
  if (['error', 'warning'].includes(msg.type()))
    messages.push(`${msg.type()}: ${msg.text().slice(0, 300)}`);
});
page.on('response', (r) => {
  if (r.status() >= 400) messages.push(`HTTP ${r.status()} ${r.url()}`);
});
await page.goto(process.env.BASE_URL || 'http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.reload({ waitUntil: 'networkidle' });
console.log('Consola tras carga:', JSON.stringify(messages));
try {
  await page.waitForSelector('[data-hotspot="ruedas-neumaticos"]', { timeout: 45000 });
} catch {
  await page.screenshot({ path: '.cache/previews/load-error.png', fullPage: true });
  console.log(
    JSON.stringify(
      { messages, body: (await page.locator('body').innerText()).slice(0, 5000) },
      null,
      2,
    ),
  );
  await browser.close();
  process.exit(1);
}
await page.waitForTimeout(2600);
await page.screenshot({ path: '.cache/previews/home-desktop.png', fullPage: true });
const result = await page.evaluate(() => ({
  title: document.title,
  canvas: [...document.querySelectorAll('canvas')].map((c) => ({
    width: c.width,
    height: c.height,
  })),
  hotspots: [...document.querySelectorAll('[data-hotspot]')].map((b) => ({
    id: b.getAttribute('data-hotspot'),
    rect: b.getBoundingClientRect().toJSON(),
  })),
  overflow: document.documentElement.scrollWidth > innerWidth,
}));
const hide = await page.addStyleTag({
  content:
    '.hotspot,.vehicle-controls,.vehicle-category-access,.vehicle-note,.vehicle-fallback,.hero-copy,.hero-annotation,.hero-bottom {visibility:hidden!important}',
});
const data = await page.locator('canvas').evaluate((canvas) => canvas.toDataURL('image/png'));
const bytes = Buffer.from(data.split(',')[1], 'base64');
const poster = await page.locator('canvas').evaluate((canvas) => {
  const rect = canvas.getBoundingClientRect();
  const hero = canvas.closest('.hero').getBoundingClientRect();
  return { width: rect.width, height: rect.height, horizon: hero.top + hero.height / 2 - rect.top };
});
await hide.evaluate((el) => el.remove());
await sharp(bytes).webp({ quality: 88 }).toFile('public/images/vehicle-poster.webp');
await fs.writeFile('src/data/vehiclePoster.json', JSON.stringify(poster, null, 2) + '\n');
await sharp(bytes)
  .flatten({ background: '#07111e' })
  .resize(1200, 630, { fit: 'contain', background: '#07111e' })
  .jpeg({ quality: 88 })
  .toFile('public/images/social.jpg');
console.log(JSON.stringify({ result, messages }, null, 2));
await browser.close();
