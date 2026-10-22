import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { createI18n } from './lib/i18n';
import { localeFromPath } from './lib/routing';
import { appPath, assetPath, routerBasename } from './lib/basePath';
import { App } from './app/App';
import { ErrorBoundary } from './components/ui/Primitives';
import './styles/global.css';
import './styles/accessibility.css';
import './styles/showroom.css';
import './styles/brand.css';
const locale = localeFromPath(appPath(window.location.pathname));
const i18n = createI18n(locale);
function Root() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter basename={routerBasename}>
        <ErrorBoundary
          fallback={
            <div className="app-error">
              <h1>{i18n.t('common.error')}</h1>
              <a href={assetPath(locale === 'ca' ? '/ca' : '/')}>{i18n.t('notFound.cta')}</a>
            </div>
          }
        >
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </I18nextProvider>
  );
}
const root = document.getElementById('root')!;
// Static pages contain the same React tree. Vite's development template is rendered normally.
const currentPath = appPath(window.location.pathname);
if (root.querySelector('main') && root.dataset.route === currentPath) hydrateRoot(root, <Root />);
else createRoot(root).render(<Root />);
