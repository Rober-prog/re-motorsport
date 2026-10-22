import { resources } from '../locales/resources';
import { categories } from '../data/categories';
import { localPath, localeFromPath, withoutLocale } from './routing';
const origin = 'https://rmartorell.com';
export function seoForPath(pathname: string) {
  const locale = localeFromPath(pathname);
  const path = withoutLocale(pathname).replace(/\/$/, '') || '/';
  const dictionary = resources[locale].translation;
  const keys: Record<string, keyof typeof dictionary.nav> = {
    '/': 'home',
    '/empresa': 'company',
    '/catalogo': 'catalog',
    '/profesionales': 'professionals',
    '/promociones': 'offers',
    '/clasicos': 'classics',
    '/contacto': 'contact',
  };
  let title = keys[path] ? dictionary.nav[keys[path]] : undefined;
  if (path === '/aviso-legal') title = dictionary.legal.noticeTitle;
  if (path === '/privacidad') title = dictionary.legal.privacyTitle;
  if (path === '/cookies') title = dictionary.legal.cookiesTitle;
  const category = categories.find((c) => `/catalogo/${c.slug}` === path);
  if (category) title = category.name[locale];
  const found = !!title;
  const description =
    category?.description[locale] ||
    (path === '/catalogo' ? dictionary.catalog.text : dictionary.hero.subtitle);
  return {
    locale,
    path,
    title: `${title || '404'} · Recanvis Martorell`,
    description,
    canonical: `${origin}${localPath(path, locale)}`,
    es: `${origin}${path}`,
    ca: `${origin}${localPath(path, 'ca')}`,
    found,
  };
}
export function headForPath(pathname: string) {
  const seo = seoForPath(pathname);
  const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  return `<title>${escape(seo.title)}</title>\n<meta name="description" content="${escape(seo.description)}" />\n<meta name="robots" content="${seo.found ? 'index,follow' : 'noindex,follow'}" />\n<link rel="canonical" href="${escape(seo.canonical)}" />\n<link rel="alternate" hreflang="es" href="${escape(seo.es)}" />\n<link rel="alternate" hreflang="ca" href="${escape(seo.ca)}" />\n<link rel="alternate" hreflang="x-default" href="${escape(seo.es)}" />\n<meta property="og:title" content="${escape(seo.title)}" />\n<meta property="og:description" content="${escape(seo.description)}" />\n<meta property="og:url" content="${escape(seo.canonical)}" />\n<meta property="og:type" content="website" />\n<meta property="og:locale" content="${seo.locale === 'ca' ? 'ca_ES' : 'es_ES'}" />\n<meta property="og:image" content="${origin}/images/social.jpg" />\n<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:title" content="${escape(seo.title)}" />\n<meta name="twitter:description" content="${escape(seo.description)}" />\n<meta name="twitter:image" content="${origin}/images/social.jpg" />`;
}
