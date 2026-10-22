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
await page.waitForTimeout(1500);
await page.screenshot({ path: 'docs/previews/home-lightened.png' });
for (let step = 1; step <= 12; step++) {
  await page.getByRole('button', { name: 'Girar a la derecha', exact: true }).click();
  await page.waitForTimeout(160);
  if (step % 3 === 0) await page.screenshot({ path: `docs/previews/rotation-${step * 30}.png` });
}
await page.getByRole('button', { name: 'Restablecer vista', exact: true }).click();
await page.setViewportSize({ width: 390, height: 844 });
await page.reload({ waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Activar experiencia 3D', exact: true }).click();
await page.locator('[data-hotspot="motor"]').waitFor({ timeout: 45000 });
await page.waitForTimeout(700);
await page.screenshot({ path: '.cache/previews/rotation-mobile.png' });
await browser.close();
