import { describe, expect, it } from 'vitest';
import { activeCategories, filterCategories } from '../data/categories';
import { resources } from '../locales/resources';
import { contactSchema } from '../lib/contactSchema';
import { localeFromPath, localPath, withoutLocale } from '../lib/routing';
const valid = {
  locale: 'es',
  name: 'Cliente de prueba',
  email: 'test@example.com',
  type: 'general',
  category: '',
  message: 'Necesito consultar por una pieza de mi vehículo.',
  consent: true,
};
describe('Catálogo', () => {
  it('las categorías activas tienen identificadores y rutas únicos', () => {
    const categories = activeCategories();
    expect(new Set(categories.map((category) => category.id)).size).toBe(11);
    expect(new Set(categories.map((category) => category.slug)).size).toBe(11);
  });
  it('busca sin acentos y por familias, respetando filtros', () => {
    expect(filterCategories('neumaticos', 'all').map((c) => c.id)).toEqual(['ruedas-neumaticos']);
    expect(filterCategories('Pastillas', 'mechanics')[0].id).toBe('frenos');
    expect(filterCategories('pastillas', 'maintenance')).toHaveLength(0);
    expect(filterCategories('no-existe', 'all')).toHaveLength(0);
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
