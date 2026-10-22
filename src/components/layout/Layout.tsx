import { useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowUpRight, Menu, X } from 'lucide-react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { localeFromPath, localPath, withoutLocale } from '../../lib/routing';
import { business } from '../../lib/business';
import { assetPath } from '../../lib/basePath';
import { ActionLink, Tooltip, useLocalPath } from '../ui/Primitives';

const navigation = [
  ['/', 'home'],
  ['/empresa', 'company'],
  ['/catalogo', 'catalog'],
  ['/profesionales', 'professionals'],
  ['/promociones', 'offers'],
  ['/clasicos', 'classics'],
] as const;
export function Brand({ featured = false }: { featured?: boolean }) {
  return (
    <span className={`brand${featured ? ' brand-featured' : ''}`}>
      <img
        className="brand-emblem"
        src={assetPath('/brand/car-emblem.webp')}
        width="1282"
        height="1227"
        alt=""
        aria-hidden="true"
      />
      <img
        className="brand-wordmark"
        src={assetPath('/brand/wordmark.webp')}
        width="2172"
        height="724"
        alt="Recanvis Martorell"
      />
    </span>
  );
}
function Header() {
  const { t } = useTranslation();
  const { pathname, search } = useLocation();
  const path = useLocalPath();
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
              {(['es', 'ca'] as const).map((l) => (
                <Link
                  key={l}
                  to={localPath(withoutLocale(pathname), l) + search}
                  lang={l}
                  hrefLang={l}
                  aria-label={l === 'es' ? 'ES — Español' : 'CA — Català'}
                  aria-current={locale === l ? 'true' : undefined}
                >
                  {l.toUpperCase()}
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
          {[...navigation, ['/contacto', 'contact'] as const].map(([to, key], i) => (
            <Link key={to} to={path(to)} onClick={close}>
              <span>0{i + 1}</span>
              {t(`nav.${key}`)}
              <ArrowUpRight size={22} />
            </Link>
          ))}
        </nav>
        <p className="eyebrow">RECANVIS MARTORELL</p>
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
          <p className="footer-company-data">
            {business.legalName} · NIF {business.taxId}
          </p>
        </div>
        <div>
          <h3>{t('footer.explore')}</h3>
          <nav aria-label={t('footer.explore')}>
            {[...navigation, ['/contacto', 'contact'] as const].map(([to, key]) => (
              <Link key={to} to={path(to)}>
                {t(`nav.${key}`)}
              </Link>
            ))}
          </nav>
        </div>
        <div>
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
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <defs>
          <filter id="corporate-logo-colors" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0 0 0.2614 0 0.1961  0 0 0.767 0 0.2157  0 0 0.8409 0 0.2431  0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>
      <Header />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <ScrollManager />
    </>
  );
}
