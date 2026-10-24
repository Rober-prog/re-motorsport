import { test, expect } from '@playwright/test';
test('un solo botón de consulta y cambio completo entre español y catalán', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Consultar un recambio', exact: true })).toHaveCount(
    1,
  );
  await expect(
    page.locator('header').getByRole('link', { name: 'Consultar un recambio', exact: true }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'CA — Català', exact: true }).click();
  await expect(page).toHaveURL(/\/ca$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ca');
  await expect(page.locator('h1')).toContainText('Troba el recanvi');
  await expect(page.getByRole('link', { name: 'Consultar un recanvi', exact: true })).toHaveCount(
    1,
  );
  await expect(page.locator('.category-card h3').first()).toHaveText('Motor i distribució');
  await expect(page.locator('footer')).toContainText('Tots els drets reservats');
  await expect(
    page.locator('header').getByRole('link', { name: 'CA — Català', exact: true }),
  ).toHaveAttribute('aria-current', 'true');
  await page.locator('.desktop-nav').getByRole('link', { name: 'Recanvis', exact: true }).click();
  await page.getByRole('searchbox').fill('pastilles');
  await expect(page.locator('.category-card')).toHaveCount(1);
  await page.locator('.category-card').click();
  await expect(page.locator('h1')).toHaveText('Frens');
  await page.getByRole('link', { name: 'Consultar disponibilitat', exact: true }).click();
  await expect(page).toHaveURL(/\/ca\/contacto\?categoria=frenos$/);
  await expect(page.getByLabel('Categoria de producte')).toHaveValue('frenos');
  await page.getByRole('link', { name: 'ES — Español', exact: true }).click();
  await expect(page).toHaveURL(/\/contacto\?categoria=frenos$/);
  await expect(page.getByLabel('Categoría de producto')).toHaveValue('frenos');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
});
for (const width of [320, 390, 1024, 1440])
  test(`selector y botón superior sin desbordamiento a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.goto('/');
    await expect(page.locator('header .header-contact')).toBeVisible();
    await page.getByRole('link', { name: 'CA — Català', exact: true }).click();
    await expect(page.locator('h1')).toContainText('Troba el recanvi');
    await expect(page.locator('header .header-contact')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (width < 960) {
      await page.getByRole('button', { name: 'Obrir menú', exact: true }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.keyboard.press('Escape');
    }
    await page
      .locator('.brand-logo')
      .first()
      .evaluate((img: HTMLImageElement) => img.decode());
    await page.screenshot({ path: `docs/previews/re-motorsport-ca-${width}.png` });
  });
test('catalán disponible con HTML estático sin JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/ca/tiendas');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ca');
  await expect(page.locator('h1')).toHaveText('La teva propera parada.');
  await expect(page.locator('.store-card').first()).toContainText('De dilluns a divendres');
  await page.getByRole('link', { name: 'ES — Español', exact: true }).click();
  await expect(page).toHaveURL(/\/tiendas$/);
  await expect(page.locator('h1')).toHaveText('Tu próxima parada.');
  await context.close();
});
