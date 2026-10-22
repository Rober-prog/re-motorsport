import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { App } from './app/App';
import { createI18n } from './lib/i18n';
import { localeFromPath } from './lib/routing';
import { headForPath } from './lib/seo';
import { baseRoutes, localPath } from './lib/routing';
import { activeCategories } from './data/categories';
import { assetPath, routerBasename } from './lib/basePath';
export const paths = [
  ...baseRoutes,
  ...activeCategories().map((c) => `/catalogo/${c.slug}`),
].flatMap((path) => [path, localPath(path, 'ca')]);
export function render(path: string) {
  const locale = localeFromPath(path);
  const i18n = createI18n(locale);
  return {
    html: renderToString(
      <I18nextProvider i18n={i18n}>
        <StaticRouter basename={routerBasename} location={assetPath(path)}>
          <App />
        </StaticRouter>
      </I18nextProvider>,
    ),
    head: headForPath(path),
    locale,
  };
}
