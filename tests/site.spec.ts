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
function disableWebglScript() {
  const original = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (
    this: HTMLCanvasElement,
    type: string,
    ...args: unknown[]
  ) {
    if (type === 'webgl2' || type === 'webgl') return null;
    return original.apply(this, [type, ...args] as Parameters<typeof original>);
  } as typeof original;
}
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

test('exploración táctil real en móvil y cierre del panel', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  await page.goto('http://127.0.0.1:4173/');
  await page.getByRole('button', { name: 'Activar experiencia 3D', exact: true }).tap();
  const hotspot = page.locator('[data-hotspot="ruedas-neumaticos"]');
  await expect(hotspot).toBeVisible({ timeout: 45000 });
  const categories = (await page.locator('#vehicle-category').boundingBox())!;
  const controls = (await page.locator('.vehicle-controls').boundingBox())!;
  expect(categories.y + categories.height).toBeLessThanOrEqual(controls.y);
  await page.screenshot({ path: '.cache/previews/home-mobile.png', fullPage: true });
  await hotspot.tap();
  await expect(page.getByRole('dialog', { name: 'Ruedas y neumáticos' })).toBeVisible();
  const popupBox = (await page.locator('#vehicle-popup').boundingBox())!;
  const pointBox = (await hotspot.locator('.hotspot-dot').boundingBox())!;
  expect(popupBox.y).toBeGreaterThan(pointBox.y + pointBox.height);
  await page.screenshot({ path: '.cache/previews/popup-mobile.png' });
  await page.getByRole('button', { name: 'Cerrar', exact: true }).last().tap();
  await expect(page.locator('#vehicle-popup')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
  await context.close();
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
test('WebGL ausente conserva el catálogo y el fallback', async ({ page }) => {
  await page.addInitScript(disableWebglScript);
  await page.goto('/');
  await expect(page.getByText(/La vista 3D no está disponible/)).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('.vehicle-poster')).toBeVisible();
  await expect(page.locator('.category-card')).toHaveCount(6);
});
test('un error de carga del modelo deja disponible la navegación', async ({ page }) => {
  await page.route('**/models/*.glb', (route) => route.abort());
  await page.goto('/');
  await expect(page.getByText(/No se ha podido cargar el vehículo/)).toBeVisible({
    timeout: 45000,
  });
  await page.locator('.desktop-nav').getByRole('link', { name: 'Catálogo', exact: true }).click();
  await expect(page.locator('.category-card')).toHaveCount(11);
});
test('tarjetas próximas al punto, sin cubrirlo y dentro de la portada', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const positions: number[] = [];
  for (const id of ['motor', 'ruedas-neumaticos']) {
    const hotspot = page.locator(`[data-hotspot="${id}"]`);
    await expect(hotspot).toBeVisible({ timeout: 45000 });
    await hotspot.click();
    const popup = page.locator('#vehicle-popup');
    await expect(popup).toHaveAttribute('data-placement', 'anchored');
    await expect
      .poll(async () => {
        const dot = await hotspot.locator('.hotspot-dot').boundingBox();
        const box = await popup.boundingBox();
        if (!dot || !box) return Infinity;
        const x = dot.x + dot.width / 2,
          y = dot.y + dot.height / 2;
        return Math.hypot(
          Math.max(box.x - x, 0, x - box.x - box.width),
          Math.max(box.y - y, 0, y - box.y - box.height),
        );
      })
      .toBeLessThan(180);
    const box = (await popup.boundingBox())!;
    const dot = (await hotspot.locator('.hotspot-dot').boundingBox())!;
    expect(box.y >= dot.y + dot.height || box.y + box.height <= dot.y).toBe(true);
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(1440);
    expect(box.y).toBeGreaterThanOrEqual(94);
    expect(box.y + box.height).toBeLessThanOrEqual(1000);
    positions.push(box.y);
    await page.keyboard.press('Escape');
  }
  expect(Math.abs(positions[0] - positions[1])).toBeGreaterThan(250);
});

test('giro completo con botones, arrastre y restablecimiento', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const point = page.locator('[data-hotspot="motor"] .hotspot-dot');
  await expect(point).toBeVisible({ timeout: 45000 });
  const initial = (await point.boundingBox())!;
  const right = page.getByRole('button', { name: 'Girar a la derecha', exact: true });
  for (let step = 0; step < 6; step++) await right.click();
  await expect
    .poll(async () => Math.abs((await point.boundingBox())!.x - initial.x))
    .toBeGreaterThan(250);
  for (let step = 0; step < 6; step++) await right.click();
  await expect
    .poll(async () => Math.abs((await point.boundingBox())!.x - initial.x))
    .toBeLessThan(6);
  const canvas = (await page.locator('.vehicle-canvas').boundingBox())!;
  await page.mouse.move(400, canvas.y + canvas.height - 25);
  await page.mouse.down();
  await page.mouse.move(1000, canvas.y + canvas.height - 25, { steps: 15 });
  await page.mouse.up();
  await expect
    .poll(async () => Math.abs((await point.boundingBox())!.x - initial.x))
    .toBeGreaterThan(200);
  await page.getByRole('button', { name: 'Restablecer vista', exact: true }).click();
  await expect
    .poll(async () => Math.abs((await point.boundingBox())!.x - initial.x))
    .toBeLessThan(6);
  const left = page.getByRole('button', { name: 'Girar a la izquierda', exact: true });
  for (let step = 0; step < 6; step++) await left.click();
  await expect
    .poll(async () => Math.abs((await point.boundingBox())!.x - initial.x))
    .toBeGreaterThan(250);
});

test('hotspots con teclado, Escape, CTA, calidad y controles', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  await page.goto('/');
  const hotspot = page.locator('[data-hotspot="ruedas-neumaticos"]');
  await expect(hotspot).toBeVisible({ timeout: 45000 });
  await expect(hotspot).toHaveAttribute('data-anchor-mode', 'mesh');
  await expect(page.locator('.vehicle-note')).toHaveCount(0);
  await expect(page.getByText('Arrastra para explorar', { exact: true })).toHaveCount(0);
  const label = hotspot.locator('.hotspot-label');
  await expect(label).toBeHidden();
  await hotspot.hover();
  await expect(label).toBeVisible();
  await expect(page.locator('#vehicle-popup')).toHaveCount(0);
  await page.mouse.move(10, 10);
  await expect(label).toBeHidden();
  await page.keyboard.press('Tab');
  await hotspot.focus();
  await expect(label).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: 'Ruedas y neumáticos' })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Consultar esta categoría', exact: true }),
  ).toHaveAttribute('href', '/contacto?categoria=ruedas-neumaticos');
  await page.keyboard.press('Escape');
  await expect(page.locator('#vehicle-popup')).toHaveCount(0);
  await expect(hotspot).toBeFocused();
  for (let attempt = 0; attempt < 2; attempt++) {
    await page.locator('#vehicle-category').selectOption('motor');
    await expect(page.getByRole('dialog', { name: 'Motor', exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
  }
  await page.getByRole('button', { name: 'Girar a la derecha', exact: true }).click();
  await page.getByRole('button', { name: 'Restablecer vista', exact: true }).click();
  await page.getByLabel('Calidad gráfica').selectOption('low');
  await hotspot.click();
  await page.getByRole('link', { name: 'Consultar esta categoría', exact: true }).click();
  await expect(page.getByLabel('Categoría de producto')).toHaveValue('ruedas-neumaticos');
  expect(errors).toEqual([]);
});
for (const width of [360, 390, 768, 1024, 1440, 1920])
  test(`responsive ${width}px sin desbordamiento`, async ({ page }) => {
    await page.addInitScript(disableWebglScript);
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
  await page.addInitScript(disableWebglScript);
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
