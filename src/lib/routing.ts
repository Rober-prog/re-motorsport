import type { Locale } from '../data/categories';
export const baseRoutes = [
  '/',
  '/empresa',
  '/catalogo',
  '/profesionales',
  '/promociones',
  '/clasicos',
  '/contacto',
  '/tiendas',
  '/aviso-legal',
  '/privacidad',
  '/cookies',
];
export const localeFromPath = (path: string): Locale => {
  return /^\/ca(?:\/|$)/.test(path) ? 'ca' : 'es';
};
export const withoutLocale = (path: string) => path.replace(/^\/(?:ca|es)(?=\/|$)/, '') || '/';
export const localPath = (path: string, locale: Locale) => {
  const base = withoutLocale(path);
  return locale === 'ca' ? `/ca${base === '/' ? '' : base}` : base;
};
