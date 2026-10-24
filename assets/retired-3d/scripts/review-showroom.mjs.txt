import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
await fs.mkdir('docs/previews', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', args: ['--enable-unsafe-swiftshader'] });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: 'reduce',
});
await page.goto(process.env.BASE_URL || 'http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
await page.locator('[data-hotspot="motor"]').waitFor({ timeout: 45000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: 'docs/previews/home-showroom.png' });
for (const id of ['motor', 'frenos', 'ruedas-neumaticos', 'iluminacion', 'interior']) {
  await page.locator(`[data-hotspot="${id}"]`).click();
  await page.waitForTimeout(300);
  console.log(id, await page.locator('#vehicle-popup').boundingBox());
  await page.screenshot({ path: `docs/previews/popup-${id}.png` });
  await page.keyboard.press('Escape');
  await page.mouse.move(10, 10);
}
for (const [width, height] of [
  [1920, 1080],
  [1024, 768],
  [768, 1024],
  [390, 844],
]) {
  await page.setViewportSize({ width, height });
  await page.reload({ waitUntil: 'networkidle' });
  if (width < 768)
    await page.getByRole('button', { name: 'Activar experiencia 3D', exact: true }).click();
  await page.locator('[data-hotspot="ruedas-neumaticos"]').waitFor({ timeout: 45000 });
  await page.waitForTimeout(1000);
  await page.locator('[data-hotspot="ruedas-neumaticos"]').click();
  await page.waitForTimeout(300);
  console.log(width, await page.locator('#vehicle-popup').boundingBox());
  await page.screenshot({ path: `.cache/previews/showroom-${width}.png` });
}
await browser.close();
