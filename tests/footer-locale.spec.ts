import { test, expect } from '@playwright/test';

test('entrada en catalán y cambio de idioma conservando la ruta y la consulta', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ca');
  await expect(page.locator('.language-switch a[aria-current="true"]')).toHaveText('CA');
  await expect(page.locator('.footer-brand h2')).toHaveText('Tot el que ens mou.');
  await page.getByRole('link', { name: 'ES — Español', exact: true }).click();
  await expect(page).toHaveURL(/\/es$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('.footer-brand h2')).toHaveText('Todo lo que nos mueve.');
  await page.goto('/es/contacto?categoria=frenos');
  await page.getByRole('link', { name: 'CA — Català', exact: true }).click();
  await expect(page).toHaveURL(/\/contacto\?categoria=frenos$/);
  await expect(page.getByLabel('Categoria de producte')).toHaveValue('frenos');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ca');
});

test('catalán por defecto sin JavaScript y compatibilidad de los enlaces /ca', async ({
  browser,
  request,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ca');
  await expect(page.locator('.footer-brand h2')).toHaveText('Tot el que ens mou.');
  const response = await request.get('/ca/catalogo');
  const html = await response.text();
  expect(response.status()).toBe(200);
  expect(html).toContain('<html lang="ca"');
  expect(html).toContain('rel="canonical" href="https://rmartorell.com/catalogo"');
  await context.close();
});

for (const width of [390, 1440]) {
  test(`pie centrado, enlaces legales en fila y sin solapamientos a ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.goto('/');
    const footer = page.locator('.site-footer');
    await footer.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(footer.locator('nav')).toHaveCount(1);
    const links = footer.locator('.footer-legal nav a');
    await expect(links).toHaveCount(3);
    const boxes = await links.evaluateAll((elements) =>
      elements.map((element) => {
        const box = element.getBoundingClientRect();
        return { x: box.x, y: box.y, right: box.right };
      }),
    );
    expect(
      Math.max(...boxes.map((box) => box.y)) - Math.min(...boxes.map((box) => box.y)),
    ).toBeLessThan(2);
    expect(Math.abs((boxes[0].x + boxes[2].right) / 2 - width / 2)).toBeLessThan(2);
    const logo = (await footer.locator('.footer-brand > a').boundingBox())!;
    expect(Math.abs(logo.x + logo.width / 2 - width / 2)).toBeLessThan(2);
    if (width >= 640) {
      await expect(page.locator('.back-top')).toBeVisible();
      const crafted = (await footer.locator('.footer-bottom > span:last-child').boundingBox())!;
      const backTop = (await page.locator('.back-top').boundingBox())!;
      expect(crafted.x + crafted.width).toBeLessThan(backTop.x - 12);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
}
