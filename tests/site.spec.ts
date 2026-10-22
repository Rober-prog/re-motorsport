import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const routes = [
  '/',
  '/empresa',
  '/catalogo',
  '/profesionales',
  '/promociones',
  '/clasicos',
  '/contacto',
  '/aviso-legal',
  '/privacidad',
  '/cookies',
];
const slugs = [
  'ruedas-neumaticos',
  'frenos',
  'motor',
  'iluminacion',
  'carroceria',
  'retrovisores-accesorios',
  'suspension',
  'sistema-electrico',
  'climatizacion',
  'interior',
  'escape',
];
test('las 42 páginas comerciales contienen HTML indexable en ambos idiomas', async ({
  request,
}) => {
  for (const base of [...routes, ...slugs.map((s) => `/catalogo/${s}`)])
    for (const prefix of ['', '/ca']) {
      const path = prefix + (base === '/' ? '' : base) || '/';
      const response = await request.get(path);
      expect(response.status(), path).toBe(200);
      const html = await response.text();
      expect(html, path).toContain('<h1');
      expect(html, path).toContain('<link rel="canonical"');
      expect(html, path).toContain(`href="https://rmartorell.com${path}"`);
      expect(html, path).toContain(`<html lang="${prefix ? 'ca' : 'es'}"`);
      expect(html, path).toContain('hreflang="ca"');
      expect(html, path).not.toContain('<!--app-html-->');
    }
});
test('datos de empresa en ES/CA y cautelas en los metadatos', async ({ request }) => {
  for (const prefix of ['', '/ca']) {
    const company = await (await request.get(`${prefix}/empresa`)).text();
    expect(company).toContain('RECANVIS MARTORELL SL');
    expect(company).toMatch(prefix ? /2 de gener (?:de|del) 1994/ : /2 de enero de 1994/);
    expect(company).not.toMatch(/(?:Desde|Des de) 1994/);
    const contact = await (await request.get(`${prefix}/contacto`)).text();
    expect(contact).toContain('Carretera de Piera, 4');
    expect(contact).toContain('Carretera de Piera, 4A');
    const schema = JSON.parse(
      contact.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1],
    );
    const org = schema['@graph'].find(
      (item: Record<string, unknown>) => item['@type'] === 'Organization',
    );
    expect(org.legalName).toBe('RECANVIS MARTORELL SL');
    expect(org.taxID).toBe('B60408010');
    expect(org.address.addressLocality).toBe('Martorell');
    expect(org.address).not.toHaveProperty('streetAddress');
    expect(org).not.toHaveProperty('foundingDate');
    const notice = await (await request.get(`${prefix}/aviso-legal`)).text();
    for (const fact of ['B60408010', '26389', 'B-102056', '4672']) expect(notice).toContain(fact);
    expect(notice).not.toContain('{{');
    const classics = await (await request.get(`${prefix}/clasicos`)).text();
    expect(classics).toContain('href="https://recambiosclasicos.com"');
    expect(classics).not.toContain('{{legalName}}');
  }
});

test('el catálogo funciona sin JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/catalogo');
  await expect(page.locator('.category-card')).toHaveCount(11);
  await expect(page.locator('h1')).toContainText('La pieza que buscas.');
  await context.close();
});
test('idioma, navegación, filtros y consulta de categoría', async ({ page }) => {
  await page.goto('/catalogo');
  await page.getByRole('searchbox').fill('frenos');
  await expect(page.locator('.category-card')).toHaveCount(1);
  await page.getByRole('link', { name: 'CA — Català', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ca');
  await expect(page.locator('h1')).toContainText('La peça que busques.');
  await page.getByRole('searchbox').fill('frens');
  await page.locator('.category-card').click();
  await expect(page.locator('h1')).toHaveText('Frens');
  await page.getByRole('link', { name: 'Consultar disponibilitat', exact: true }).click();
  await expect(page.getByLabel('Categoria de producte')).toHaveValue('frenos');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ca');
  await page.reload();
  await expect(page.locator('h1')).toContainText('La teva propera peça.');
});
test('validación y bloqueo honesto del envío', async ({ page }) => {
  let calls = 0;
  page.on('request', (request) => {
    if (request.url().includes('/api/contact')) calls++;
  });
  await page.goto('/contacto');
  await page.getByRole('button', { name: 'Enviar consulta', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Revisa los campos indicados');
  await page.getByLabel(/Nombre y apellidos/).fill('Cliente de prueba');
  await page.getByLabel(/Correo electrónico/).fill('test@example.com');
  await page
    .getByLabel(/Cuéntanos qué necesitas/)
    .fill('Necesito información sobre las piezas de mi vehículo.');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Enviar consulta', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('No se ha enviado tu consulta');
  expect(calls).toBe(0);
});
for (const width of [360, 390, 768, 1024, 1440, 1920])
  test(`responsive ${width}px sin desbordamiento`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/', '/catalogo', '/contacto', '/ca/clasicos']) {
      await page.goto(path);
      await expect(page.locator('h1')).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        path,
      ).toBe(true);
    }
    if (width < 960) {
      await page.getByRole('button', { name: 'Obrir menú', exact: true }).click();
      await expect(page.getByRole('dialog', { name: 'Obrir menú' })).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog', { name: 'Obrir menú' })).not.toBeVisible();
    }
  });
test('contraste y semántica con axe en páginas representativas', async ({ page }) => {
  test.setTimeout(180000);
  const auditPaths = [...routes, '/catalogo/frenos'].flatMap((path) => [
    path,
    path === '/' ? '/ca' : `/ca${path}`,
  ]);
  for (const path of auditPaths) {
    await page.goto(path);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const audit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      audit.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => n.target),
      })),
      path,
    ).toEqual([]);
  }
});
test('404 mantiene navegación y metadatos noindex', async ({ page }) => {
  await page.goto('/ruta-inexistente');
  await expect(page.locator('h1')).toContainText('Esta ruta no lleva');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,follow');
});
