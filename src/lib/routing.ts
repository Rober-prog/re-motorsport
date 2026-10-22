import type { Locale } from '../data/categories';
export const baseRoutes = [
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
export const localeFromPath = (path: string): Locale => (/^\/ca(?:\/|$)/.test(path) ? 'ca' : 'es');
export const withoutLocale = (path: string) => path.replace(/^\/ca(?=\/|$)/, '') || '/';
export const localPath = (path: string, locale: Locale) =>
  locale === 'ca' ? `/ca${path === '/' ? '' : path}` : path;
