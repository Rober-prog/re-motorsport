import { describe, expect, it } from 'vitest';
import { Box3, Vector3, PerspectiveCamera } from 'three';
import { activeCategories, filterCategories } from '../data/categories';
import { vehicleHotspots } from '../data/vehicleHotspots';
import { resources } from '../locales/resources';
import { contactSchema } from '../lib/contactSchema';
import { localeFromPath, localPath, withoutLocale } from '../lib/routing';
import {
  alignVehicleHorizon,
  fitCamera,
  fitOrbitCamera,
} from '../components/vehicle/VehicleCamera';
const valid = {
  locale: 'es',
  name: 'Cliente de prueba',
  email: 'test@example.com',
  type: 'general',
  category: '',
  message: 'Necesito consultar por una pieza de mi vehículo.',
  consent: true,
};
describe('Catálogo y manifiesto', () => {
  it('busca sin acentos y por familias, respetando filtros', () => {
    expect(filterCategories('neumaticos', 'all').map((c) => c.id)).toEqual(['ruedas-neumaticos']);
    expect(filterCategories('Pastillas', 'mechanics')[0].id).toBe('frenos');
    expect(filterCategories('pastillas', 'maintenance')).toHaveLength(0);
    expect(filterCategories('no-existe', 'all')).toHaveLength(0);
  });
  it('todos los anclajes apuntan a categorías y destinos reales', () => {
    const ids = activeCategories().map((c) => c.id);
    expect(new Set(ids).size).toBe(11);
    for (const point of vehicleHotspots) {
      expect(ids).toContain(point.categoryId);
      expect(point.destination).toBe(`/contacto?categoria=${point.categoryId}`);
      expect(point.anchor.every(Number.isFinite)).toBe(true);
    }
  });
  it('las traducciones tienen exactamente las mismas claves', () => {
    const keys = (value: object, prefix = ''): string[] =>
      Object.entries(value).flatMap(([key, v]) =>
        typeof v === 'string' ? [`${prefix}${key}`] : keys(v, `${prefix}${key}.`),
      );
    expect(keys(resources.es.translation).sort()).toEqual(keys(resources.ca.translation).sort());
  });
});
describe('Validación de consultas', () => {
  it('acepta consulta válida, rechaza consentimiento ausente y mensajes cortos', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
    expect(contactSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, message: 'hola' }).success).toBe(false);
  });
  it('exige datos de vehículo y año válido para recambios y clásicos', () => {
    expect(contactSchema.safeParse({ ...valid, type: 'classic' }).success).toBe(false);
    expect(
      contactSchema.safeParse({
        ...valid,
        type: 'classic',
        brand: 'Seat',
        model: '600',
        year: '1968',
        part: 'Frenos',
      }).success,
    ).toBe(true);
    expect(
      contactSchema.safeParse({
        ...valid,
        type: 'spare',
        brand: 'Seat',
        model: '600',
        year: '1800',
        part: 'Frenos',
      }).success,
    ).toBe(false);
  });
  it('exige empresa para profesionales y rechaza categorías inexistentes', () => {
    expect(contactSchema.safeParse({ ...valid, type: 'professional' }).success).toBe(false);
    expect(
      contactSchema.safeParse({ ...valid, type: 'professional', company: 'Taller de prueba' })
        .success,
    ).toBe(true);
    expect(contactSchema.safeParse({ ...valid, category: 'inventada' }).success).toBe(false);
  });
});
describe('Rutas localizadas', () => {
  it('conserva la ruta al cambiar de idioma', () => {
    expect(localPath('/catalogo/frenos', 'ca')).toBe('/ca/catalogo/frenos');
    expect(withoutLocale('/ca/catalogo/frenos')).toBe('/catalogo/frenos');
    expect(localeFromPath('/catalogo')).toBe('es');
    expect(localeFromPath('/ca')).toBe('ca');
    expect(localeFromPath('/catalogo/carroceria')).toBe('es');
  });
});
describe('Encuadre automático', () => {
  it.each([
    [1440, 661, 363],
    [1920, 716, 393],
    [414, 440, 129.5],
  ])('conserva el coche completo durante una vuelta a %i × %i px', (width, height, horizon) => {
    const box = new Box3(new Vector3(-3, 0, -1.43), new Vector3(3, 1.55, 1.43));
    const camera = new PerspectiveCamera(34, width / height, 0.05, 100);
    const axis = new Vector3(0, 1, 0);
    for (let step = -12; step <= 24; step++) {
      const yaw = (step * Math.PI) / 12;
      const fit = fitOrbitCamera(box, width / height, horizon / height, yaw);
      camera.position.copy(fit.position);
      camera.lookAt(fit.target);
      alignVehicleHorizon(camera, width, height, horizon);
      for (const x of [box.min.x, box.max.x])
        for (const y of [box.min.y, box.max.y])
          for (const z of [box.min.z, box.max.z]) {
            const point = new Vector3(x, y, z).applyAxisAngle(axis, yaw).project(camera);
            expect(Math.abs(point.x)).toBeLessThanOrEqual(0.961);
            expect(Math.abs(point.y)).toBeLessThanOrEqual(0.961);
            expect(point.z).toBeLessThan(1);
          }
    }
  });
  it.each([
    [1440, 661, 363],
    [1920, 716, 393],
    [414, 440, 129.5],
  ])('alinea el horizonte del suelo con el fondo a %i × %i px', (width, height, horizon) => {
    const fit = fitCamera(
      new Box3(new Vector3(-3, 0, -1.43), new Vector3(3, 1.55, 1.43)),
      width / height,
    );
    const camera = new PerspectiveCamera(34, width / height, 0.05, 1e10);
    camera.position.copy(fit.position);
    camera.lookAt(fit.target);
    alignVehicleHorizon(camera, width, height, horizon);
    const distantGround = new Vector3(-fit.position.x, 0, -fit.position.z)
      .normalize()
      .multiplyScalar(1e8)
      .project(camera);
    expect(((1 - distantGround.y) * height) / 2).toBeCloseTo(horizon, 3);
  });
  it.each([360, 390, 768, 1024, 1440, 1920])(
    'mantiene las ocho esquinas en el encuadre a %i px',
    (width) => {
      const box = new Box3(new Vector3(-3, 0, -1.43), new Vector3(3, 1.55, 1.43));
      const aspect = width / (width < 640 ? 336 : 570);
      const fit = fitCamera(box, aspect);
      const camera = new PerspectiveCamera(34, aspect, 0.05, 100);
      camera.position.copy(fit.position);
      camera.lookAt(fit.target);
      camera.updateMatrixWorld();
      for (const x of [box.min.x, box.max.x])
        for (const y of [box.min.y, box.max.y])
          for (const z of [box.min.z, box.max.z]) {
            const p = new Vector3(x, y, z).project(camera);
            expect(Math.abs(p.x)).toBeLessThanOrEqual(0.821);
            expect(Math.abs(p.y)).toBeLessThanOrEqual(0.821);
            expect(p.z).toBeLessThan(1);
          }
    },
  );
});
