import { resources } from '../locales/resources';
import { activeCategories } from '../data/categories';
import { withoutLocale, localeFromPath, localPath } from './routing';
import { brand, siteOrigin } from '../config/brand';
export function seoForPath(pathname: string) {
  const path = withoutLocale(pathname).replace(/\/$/, '') || '/';
  const locale = localeFromPath(pathname);
  const dictionary = resources[locale].translation;
  const titles: Record<string, string> = {
    '/': dictionary.seo.home,
    '/empresa': dictionary.seo.company,
    '/catalogo': dictionary.seo.catalog,
    '/tiendas': dictionary.seo.stores,
    '/contacto': dictionary.seo.contact,
    '/profesionales': dictionary.seo.professionals,
    '/promociones': dictionary.seo.offers,
    '/clasicos': dictionary.seo.classics,
    '/aviso-legal': dictionary.legal.noticeTitle,
    '/privacidad': dictionary.legal.privacyTitle,
    '/cookies': dictionary.legal.cookiesTitle,
  };
  const category = activeCategories().find((c) => `/catalogo/${c.slug}` === path);
  const title = category?.name[locale] || titles[path];
  const legal = ['/aviso-legal', '/privacidad', '/cookies'].includes(path);
  const description =
    category?.description[locale] ||
    (path === '/'
      ? dictionary.seo.homeDescription
      : `${title || dictionary.seo.notFound}. ${dictionary.hero.subtitle}`);
  return {
    locale,
    path,
    title: `${brand.name} | ${title || dictionary.seo.notFound}`,
    description,
    canonical: siteOrigin && title ? `${siteOrigin}${localPath(path, locale)}` : '',
    alternates:
      siteOrigin && title
        ? {
            es: `${siteOrigin}${localPath(path, 'es')}`,
            ca: `${siteOrigin}${localPath(path, 'ca')}`,
          }
        : null,
    found: !!title,
    indexable: !!title && !!siteOrigin && !legal,
  };
}
export function headForPath(pathname: string) {
  const seo = seoForPath(pathname);
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const meta = (name: string, value: string, property = false) =>
    `<meta ${property ? 'property' : 'name'}="${name}" content="${esc(value)}" />`;
  return (
    `<title>${esc(seo.title)}</title>\n` +
    meta('description', seo.description) +
    meta('robots', seo.indexable ? 'index,follow' : 'noindex,follow') +
    (seo.canonical
      ? `<link rel="canonical" href="${esc(seo.canonical)}" />` +
        meta('og:url', seo.canonical, true) +
        (seo.alternates
          ? `<link rel="alternate" hreflang="es" href="${esc(seo.alternates.es)}" /><link rel="alternate" hreflang="ca" href="${esc(seo.alternates.ca)}" /><link rel="alternate" hreflang="x-default" href="${esc(seo.alternates.es)}" />`
          : '')
      : '') +
    meta('og:title', seo.title, true) +
    meta('og:description', seo.description, true) +
    meta('og:type', 'website', true) +
    meta('og:locale', seo.locale === 'ca' ? 'ca_ES' : 'es_ES', true) +
    meta('og:site_name', brand.name, true) +
    meta('og:image', `${siteOrigin}/images/social.jpg`, true) +
    meta('og:image:alt', resources[seo.locale].translation.seo.imageAlt, true) +
    meta('twitter:card', 'summary_large_image') +
    meta('twitter:title', seo.title) +
    meta('twitter:description', seo.description) +
    meta('twitter:image', `${siteOrigin}/images/social.jpg`)
  );
}
