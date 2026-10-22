import { test, expect } from '@playwright/test';

for (const width of [360, 390, 768, 1440]) {
  test(`portada estática a ${width}px, sin WebGL ni modelos 3D`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width, height: 844 },
      isMobile: width < 640,
      hasTouch: width < 640,
    });
    const page = await context.newPage();
    const models: string[] = [];
    const errors: string[] = [];
    page.on('request', (request) => {
      if (/\.(glb|gltf)(\?|$)/.test(request.url())) models.push(request.url());
    });
    page.on('pageerror', (error) => errors.push(error.message));
    for (const path of ['/', '/ca']) {
      await page.goto(path);
      const hero = page.locator('.hero-static');
      await expect(hero.locator('h1')).toBeVisible();
      await expect(hero.locator('a, button, .hero-actions, .hero-bottom')).toHaveCount(0);
      await expect(page.locator('canvas, .hotspot, .vehicle-popup, .vehicle-controls')).toHaveCount(
        0,
      );
      const image = hero.locator('.hero-photograph img');
      await expect(image).toBeVisible();
      await expect
        .poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth))
        .toBeGreaterThan(0);
      if (width < 640) {
        await expect
          .poll(() => image.evaluate((img: HTMLImageElement) => img.currentSrc))
          .toContain('hero-garage-turquoise-mobile.webp');
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await page.locator('#categories').scrollIntoViewIfNeeded();
      await expect(page.locator('#categories')).toBeInViewport();
      await expect(page.locator('#categories .category-card')).toHaveCount(6);
    }
    expect(models).toEqual([]);
    expect(errors).toEqual([]);
    await context.close();
  });
}

test('la imagen, el texto y los enlaces de portada funcionan sin JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('.hero-static h1')).toBeVisible();
  await expect(page.locator('.hero-photograph img')).toBeVisible();
  await expect(page.locator('.hero-static a, .hero-static button')).toHaveCount(0);
  await page.locator('#categories').scrollIntoViewIfNeeded();
  await expect(page.locator('#categories')).toBeInViewport();
  await page.locator('#categories .category-card').first().click();
  await expect(page).toHaveURL(/\/catalogo\//);
  await context.close();
});
