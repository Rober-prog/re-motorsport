import { describe, expect, it, vi, afterEach } from 'vitest';
import { brand, visibleStores, mapUrl } from '../config/brand';
import { seoForPath, headForPath } from '../lib/seo';
afterEach(() => vi.unstubAllEnvs());
describe('Migración de marca y veracidad comercial', () => {
  it('solo expone dos tiendas corroboradas y mantiene los canales sin verificar desactivados', () => {
    expect(visibleStores.map((s) => s.id)).toEqual(['esparreguera', 'piera']);
    expect(brand.stores.find((s) => s.id === 'olesa')?.visible).toBe(false);
    expect(brand.contact.email.enabled).toBe(false);
    expect(brand.contact.whatsapp.enabled).toBe(false);
    expect(brand.legal.taxId).toBeNull();
    expect(brand.legal.privacyApproved).toBe(false);
    expect(brand.contact.submissionEnabled).toBe(false);
    for (const store of visibleStores)
      expect(new URL(mapUrl(store)).searchParams.get('query')).toContain(store.street);
  });
  it('omite dominios no confirmados y mantiene títulos y descripciones propios', () => {
    expect(seoForPath('/').canonical).toBe('');
    expect(seoForPath('/').indexable).toBe(false);
    expect(headForPath('/')).not.toContain('rel="canonical"');
    expect(seoForPath('/').title).not.toBe(seoForPath('/tiendas').title);
    expect(seoForPath('/catalogo/frenos').description).not.toBe(seoForPath('/tiendas').description);
    expect(seoForPath('/ca/contacto').locale).toBe('ca');
    expect(seoForPath('/catalogo/neumaticos').found).toBe(false);
  });
  it('con dominio aprobado genera canónicos y conserva las páginas legales en noindex', async () => {
    vi.stubEnv('VITE_SITE_URL', 'https://re-motorsport.example');
    vi.resetModules();
    const { seoForPath: seo } = await import('../lib/seo');
    expect(seo('/tiendas').canonical).toBe('https://re-motorsport.example/tiendas');
    expect(seo('/tiendas').indexable).toBe(true);
    expect(seo('/ca/tiendas').canonical).toBe('https://re-motorsport.example/ca/tiendas');
    expect(seo('/ca/tiendas').title).toContain('Botigues');
    expect(seo('/privacidad').indexable).toBe(false);
  });
});
