import { useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowUpRight, Menu, X } from 'lucide-react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { brand } from '../../config/brand';
import { assetPath } from '../../lib/basePath';
import { localeFromPath, localPath, withoutLocale } from '../../lib/routing';

import { ActionLink, Tooltip, useLocalPath } from '../ui/Primitives';

const navigation = [
  ['/', 'home'],
  ['/catalogo', 'catalog'],
  ['/empresa', 'company'],
  ['/tiendas', 'stores'],
  ['/contacto', 'contact'],
] as const;
export function Brand({ featured = false }: { featured?: boolean }) {
  return (
    <span className={`brand${featured ? ' brand-featured' : ''}`}>
      <img
        className="brand-logo"
        src={assetPath(brand.logo.src)}
        width={brand.logo.width}
        height={brand.logo.height}
        alt={brand.name}
        decoding="async"
      />
    </span>
  );
}
function Header() {
  const { t } = useTranslation();
  const path = useLocalPath();
  const { pathname, search, hash } = useLocation();
  const locale = localeFromPath(pathname);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);
  const close = () => {
    setOpen(false);
    menuButton.current?.focus();
  };
  return (
    <>
      <a href="#main" className="skip-link">
        {t('common.skip')}
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link to={path('/')} className="brand-link">
            <Brand />
          </Link>
          <nav className="desktop-nav" aria-label={t('footer.explore')}>
            {navigation.map(([to, key]) => (
              <NavLink key={to} to={path(to)} end={to === '/'}>
                {t(`nav.${key}`)}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <nav className="language-switch" aria-label={t('common.language')}>
              {(['es', 'ca'] as const).map((language) => (
                <Link
                  key={language}
                  to={localPath(withoutLocale(pathname), language) + search + hash}
                  lang={language}
                  hrefLang={language}
                  aria-label={language === 'es' ? 'ES — Español' : 'CA — Català'}
                  aria-current={locale === language ? 'true' : undefined}
                >
                  {language.toUpperCase()}
                </Link>
              ))}
            </nav>
            <ActionLink to="/contacto" className="header-contact">
              {t('common.contact')}
            </ActionLink>
            <button
              ref={menuButton}
              className="icon-button menu-toggle"
              aria-label={t('common.menu')}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => setOpen(true)}
            >
              <Menu size={23} />
            </button>
          </div>
        </div>
      </header>
      <dialog ref={dialog} className="mobile-menu" onCancel={close} aria-label={t('common.menu')}>
        <div className="mobile-menu-top">
          <Brand />
          <button className="icon-button" aria-label={t('common.close')} onClick={close}>
            <X />
          </button>
        </div>
        <nav id="mobile-navigation">
          {navigation.map(([to, key], i) => (
            <Link key={to} to={path(to)} onClick={close}>
              <span>0{i + 1}</span>
              {t(`nav.${key}`)}
              <ArrowUpRight size={22} />
            </Link>
          ))}
        </nav>
        <p className="eyebrow">{brand.name}</p>
      </dialog>
    </>
  );
}
function Footer() {
  const { t } = useTranslation();
  const path = useLocalPath();
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <Link to={path('/')}>
            <Brand featured />
          </Link>
          <h2>{t('footer.tagline')}</h2>
          <p>{t('footer.text')}</p>
          <p className="footer-company-data">Esparreguera · Piera</p>
        </div>
        <div className="footer-legal">
          <h3>{t('footer.legal')}</h3>
          <nav aria-label={t('footer.legal')}>
            {[
              ['/aviso-legal', 'notice'],
              ['/privacidad', 'privacy'],
              ['/cookies', 'cookies'],
            ].map(([to, key]) => (
              <Link key={to} to={path(to)}>
                {t(`footer.${key}`)}
              </Link>
            ))}
          </nav>
          <p className="footer-development">{t('footer.development')}</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {t('footer.copyright')}
        </span>
        <span>{t('footer.crafted')}</span>
      </div>
    </footer>
  );
}
function ScrollManager() {
  const { pathname, hash } = useLocation();
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
    } else window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 700);
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return visible ? (
    <div className="back-top">
      <Tooltip text={t('common.toTop')}>
        <button
          className="icon-button"
          aria-label={t('common.toTop')}
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                ? 'instant'
                : 'smooth',
            })
          }
        >
          <ArrowUp size={20} />
        </button>
      </Tooltip>
    </div>
  ) : null;
}
export function Layout() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <ScrollManager />
    </>
  );
}
