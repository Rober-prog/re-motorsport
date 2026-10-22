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
export const localeFromPath = (path: string): Locale => (/^\/es(?:\/|$)/.test(path) ? 'es' : 'ca');
export const withoutLocale = (path: string) => path.replace(/^\/(?:ca|es)(?=\/|$)/, '') || '/';
export const localPath = (path: string, locale: Locale) =>
  locale === 'es' ? `/es${path === '/' ? '' : path}` : path;
