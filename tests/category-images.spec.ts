import { test, expect } from '@playwright/test';

const categories = [
  'mecanica',
  'frenos',
  'suspension',
  'neumaticos',
  'sistema-electrico',
  'iluminacion',
];

for (const width of [390, 1440]) {
  test(`cada ficha muestra su fotografía completa a ${width}px en ambos idiomas`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    for (const prefix of ['', '/es']) {
      await page.goto(`${prefix}/catalogo`);
      for (const slug of categories) {
        const card = page.locator(`.catalog-grid a[href="${prefix}/catalogo/${slug}"]`);
        const cardImage = await card.locator('img').getAttribute('src');
        await card.click();
        const image = page.locator('.category-detail-photo img');
        await expect(image).toHaveAttribute('src', cardImage!);
        await expect(image).toBeVisible();
        await expect
          .poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth))
          .toBeGreaterThan(0);
        await expect(page.locator('.category-detail-art svg')).toHaveCount(0);
        const bounds = (await image.boundingBox())!;
        expect(Math.abs(bounds.width / bounds.height - 1.5)).toBeLessThan(0.01);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
        await page.goBack();
        await expect(page.locator('.catalog-grid')).toBeVisible();
      }
    }
  });
}
