import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const slugs = [
  'mecanica',
  'frenos',
  'suspension',
  'filtros',
  'sistema-electrico',
  'iluminacion',
  'neumaticos-llantas',
  'transmision',
];
test('las rutas prerenderizadas respetan el idioma y los datos comerciales', async ({
  request,
}) => {
  for (const route of [
    '',
    '/empresa',
    '/catalogo',
    '/tiendas',
    '/contacto',
    '/profesionales',
    '/promociones',
    '/clasicos',
    '/aviso-legal',
    '/privacidad',
    '/cookies',
    ...slugs.map((s) => '/catalogo/' + s),
  ]) {
    for (const prefix of ['', '/es', '/ca']) {
      const response = await request.get(prefix + route || '/');
      expect(response.status()).toBe(200);
      const html = await response.text();
      expect(html).toContain('<h1');
      expect(html).toContain(`<html lang="${prefix === '/ca' ? 'ca' : 'es'}"`);
      expect(html).toContain('RE-Motorsport');
      expect(html).not.toMatch(
        /Martorell|rmartorell|B60408010|B66294414|B02658516|recambiosclasicos|wa\.me|mailto:/i,
      );
      expect(html).toContain('noindex,follow');
      expect(html).not.toContain('rel="canonical"');
      const schema = JSON.parse(
        html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1],
      );
      const stores = schema['@graph'].filter(
        (v: Record<string, unknown>) => v['@type'] === 'AutoPartsStore',
      );
      expect(stores).toHaveLength(2);
      expect(JSON.stringify(stores)).not.toMatch(/Olesa|rating|taxID|openingHours/);
    }
  }
  expect(await (await request.get('/robots.txt')).text()).toContain('Disallow: /');
  expect((await request.get('/images/hero-nissan-gtr-desktop.webp')).status()).toBe(200);
  expect((await request.get('/images/hero-nissan-gtr-mobile.webp')).status()).toBe(200);
  expect((await request.get('/models/Lamborghini+Temerario.glb')).status()).toBe(404);
});
test('catálogo sin JavaScript y tiendas con teléfonos y mapas', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/catalogo');
  await expect(page.locator('.category-card')).toHaveCount(8);
  await page.goto('/tiendas');
  await expect(page.locator('.store-card')).toHaveCount(2);
  await expect(page.locator('a[href="tel:+34937774713"]')).toBeVisible();
  await expect(page.locator('a[href="tel:+34937426460"]')).toBeVisible();
  await expect(page.locator('a[href*="google.com/maps"]')).toHaveCount(2);
  await context.close();
});
test('búsqueda, filtros y consulta con categoría preseleccionada', async ({ page }) => {
  await page.goto('/catalogo');
  await page.getByRole('searchbox').fill('pastillas');
  await expect(page.locator('.category-card')).toHaveCount(1);
  await page.locator('.category-card').click();
  await expect(page.locator('h1')).toHaveText('Frenos');
  await page.getByRole('link', { name: 'Consultar disponibilidad', exact: true }).click();
  await expect(page.getByLabel('Categoría de producto')).toHaveValue('frenos');
  await expect(page.getByLabel('Tipo de consulta')).toHaveValue('spare');
  await expect(page.getByLabel(/Marca del vehículo/)).toBeVisible();
});
test('formulario no envía ni almacena datos y cambia de tienda', async ({ page }) => {
  let calls = 0;
  page.on('request', (r) => {
    if (r.url().includes('/api/contact')) calls++;
  });
  await page.goto('/contacto');
  await page.getByRole('button', { name: 'Revisar consulta', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Revisa los campos');
  await page.getByLabel('Tipo de consulta').selectOption('general');
  await page.getByLabel(/Nombre y apellidos/).fill('Cliente de prueba');
  await page.getByLabel(/Correo electrónico/).fill('test@example.com');
  await page
    .getByLabel(/Cuéntanos qué necesitas/)
    .fill('Necesito información sobre las piezas de mi vehículo.');
  await page.getByRole('checkbox').check();
  await page.getByLabel('Tienda', { exact: true }).selectOption('piera');
  await page.getByRole('button', { name: 'Revisar consulta', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('No se ha enviado');
  await expect(page.locator('.store-call')).toHaveAttribute('href', 'tel:+34937426460');
  expect(calls).toBe(0);
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
});
for (const width of [320, 390, 768, 1440, 1920])
  test(`responsive y teclado a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const route of ['/', '/catalogo', '/catalogo/frenos', '/tiendas', '/contacto']) {
      await page.goto(route);
      await expect(page.locator('h1')).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        route,
      ).toBe(true);
    }
    if (width < 960) {
      await page.getByRole('button', { name: 'Abrir menú', exact: true }).click();
      await expect(page.getByRole('dialog', { name: 'Abrir menú' })).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog', { name: 'Abrir menú' })).not.toBeVisible();
      await expect(page.getByRole('button', { name: 'Abrir menú', exact: true })).toBeFocused();
    }
  });
test('portada estática de Nissan sin canvas ni descargas 3D', async ({ page }) => {
  const downloads: string[] = [];
  page.on('request', (r) => downloads.push(r.url()));
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 950 });
    await page.goto('/');
    const photo = page.locator('.hero-photograph img');
    await expect(photo).toBeVisible();
    await expect
      .poll(() => photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
      .toBe(true);
    expect(await photo.evaluate((img: HTMLImageElement) => img.currentSrc)).toContain(
      width < 960 ? 'hero-nissan-gtr-mobile.webp' : 'hero-nissan-gtr-desktop.webp',
    );
    await expect(
      page.locator('canvas,[data-hotspot],.vehicle-controls,.vehicle-experience'),
    ).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Activar experiencia 3D' })).toHaveCount(0);
    for (const image of await page.locator('.category-card img').all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate((img: HTMLImageElement) => img.decode());
      await expect(image).toHaveAttribute('src', /-rojo\.webp$/);
      expect(await image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page
      .locator('.brand-logo')
      .first()
      .evaluate((img: HTMLImageElement) => img.decode());
    await page.screenshot({
      path: 'docs/previews/re-motorsport-static-' + width + '.png',
      fullPage: true,
    });
  }
  expect(
    downloads.filter((url) => /\.glb|VehicleScene|VehicleExperience|three\//i.test(url)),
  ).toEqual([]);
});
test('contraste y semántica de las páginas principales', async ({ page }) => {
  test.setTimeout(180000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const routes = ['/', '/catalogo', '/contacto', '/tiendas', '/empresa', '/privacidad'];
  for (const route of [...routes, ...routes.map((path) => '/ca' + (path === '/' ? '' : path))]) {
    await page.goto(route);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
      route,
    ).toEqual([]);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.screenshot({ path: 'docs/previews/re-motorsport-mobile.png', fullPage: true });
});
test('404 conserva navegación y español', async ({ page }) => {
  const response = await page.goto('/ruta-inexistente');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('Esta ruta no lleva');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
});
