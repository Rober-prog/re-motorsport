import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import HomePage from '../pages/HomePage';
import {
  CatalogPage,
  CategoryPage,
  CompanyPage,
  ProfessionalsPage,
  PromotionsPage,
  ClassicsPage,
  ContactPage,
  LegalPage,
  NotFoundPage,
} from '../pages/ContentPages';
import { seoForPath } from '../lib/seo';
import { useTranslation } from 'react-i18next';
function Seo() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  useEffect(() => {
    const seo = seoForPath(pathname);
    document.documentElement.lang = seo.locale;
    document.title = seo.title;
    if (i18n.language !== seo.locale) void i18n.changeLanguage(seo.locale);
    const meta = (attribute: string, name: string, value: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.append(element);
      }
      element.content = value;
    };
    meta('name', 'description', seo.description);
    meta('name', 'robots', seo.found ? 'index,follow' : 'noindex,follow');
    meta('property', 'og:title', seo.title);
    meta('property', 'og:description', seo.description);
    meta('property', 'og:url', seo.canonical);
    meta('property', 'og:locale', seo.locale === 'ca' ? 'ca_ES' : 'es_ES');
    meta('name', 'twitter:title', seo.title);
    meta('name', 'twitter:description', seo.description);
    for (const [key, value] of [
      ['canonical', seo.canonical],
      ['es', seo.es],
      ['ca', seo.ca],
      ['x-default', seo.ca],
    ]) {
      let el = document.head.querySelector<HTMLLinkElement>(
        key === 'canonical' ? 'link[rel="canonical"]' : `link[hreflang="${key}"]`,
      );
      if (!el) {
        el = document.createElement('link');
        el.rel = key === 'canonical' ? 'canonical' : 'alternate';
        if (key !== 'canonical') el.hreflang = key;
        document.head.append(el);
      }
      el.href = value;
    }
  }, [pathname, i18n]);
  return null;
}
export function App() {
  return (
    <>
      <Seo />
      <Routes>
        {['', '/es', '/ca'].map((prefix) => (
          <Route key={prefix} element={<Layout />}>
            <Route path={prefix || '/'} element={<HomePage />} />
            <Route path={`${prefix}/empresa`} element={<CompanyPage />} />
            <Route path={`${prefix}/catalogo`} element={<CatalogPage />} />
            <Route path={`${prefix}/catalogo/:categoria`} element={<CategoryPage />} />
            <Route path={`${prefix}/profesionales`} element={<ProfessionalsPage />} />
            <Route path={`${prefix}/promociones`} element={<PromotionsPage />} />
            <Route path={`${prefix}/clasicos`} element={<ClassicsPage />} />
            <Route path={`${prefix}/contacto`} element={<ContactPage />} />
            <Route path={`${prefix}/aviso-legal`} element={<LegalPage kind="notice" />} />
            <Route path={`${prefix}/privacidad`} element={<LegalPage kind="privacy" />} />
            <Route path={`${prefix}/cookies`} element={<LegalPage kind="cookies" />} />
            <Route path={`${prefix}/*`} element={<NotFoundPage />} />
          </Route>
        ))}
      </Routes>
    </>
  );
}
