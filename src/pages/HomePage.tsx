import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowDownRight, ArrowUpRight, Check, ChevronRight, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { activeCategories } from '../data/categories';
import { CategoryCard } from '../components/catalog/CategoryCard';
import {
  ActionLink,
  ErrorBoundary,
  SectionHeading,
  useLocalPath,
} from '../components/ui/Primitives';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { VehicleFallback } from '../components/vehicle/VehicleFallback';
import { assetPath } from '../lib/basePath';
const LazyVehicleExperience = lazy(() => import('../components/vehicle/VehicleExperience'));
function VehicleExperience() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <ErrorBoundary fallback={<VehicleFallback reason="modelError" />}>
      {mounted ? <LazyVehicleExperience /> : <VehicleFallback />}
    </ErrorBoundary>
  );
}

export function ContactBanner() {
  const { t } = useTranslation();
  return (
    <section className="contact-banner">
      <div className="container">
        <div>
          <p className="eyebrow">RECANVIS MARTORELL</p>
          <h2>{t('common.question')}</h2>
          <p>{t('common.questionText')}</p>
        </div>
        <ActionLink to="/contacto">{t('common.contact')}</ActionLink>
      </div>
    </section>
  );
}
export default function HomePage() {
  const { t } = useTranslation();
  const path = useLocalPath();
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('.hero-copy > *', {
        y: 22,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
      });
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) =>
        gsap.from(el, {
          y: 24,
          opacity: 0,
          duration: 0.65,
          scrollTrigger: { trigger: el, start: 'top 94%', once: true },
        }),
      );
    }, ref);
    return () => ctx.revert();
  }, [reduced]);
  return (
    <div ref={ref}>
      <section className="hero" aria-labelledby="hero-title">
        <div className="garage-background" aria-hidden="true">
          <div className="garage-line garage-line-1" />
          <div className="garage-line garage-line-2" />
          <div className="garage-line garage-line-3" />
          <div className="garage-grid" />
        </div>
        <div className="container hero-copy">
          <p className="eyebrow">
            <span className="tiny-line" />
            {t('hero.eyebrow')}
          </p>
          <h1 id="hero-title">
            {t('hero.line1')}
            <br />
            <span>{t('hero.line2')}</span>
            <br className="mobile-break" /> {t('hero.line3')}
          </h1>
          <p className="hero-subtitle">{t('hero.subtitle')}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#vehicle-explorer">
              {t('hero.cta')}
              <ArrowDownRight size={19} />
            </a>
            <Link className="text-link" to={path('/contacto')}>
              {t('nav.contact')}
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
        <div className="hero-brand-emblem">
          <img
            src={assetPath('/brand/car-emblem.webp')}
            width="1282"
            height="1227"
            alt="RM — Recanvis Martorell"
          />
        </div>
        <nav className="hero-section-nav" aria-label={t('footer.explore')}>
          <a className="is-current" href="#hero-title">
            {t('nav.home')}
          </a>
          <a href="#categories">{t('nav.catalog')}</a>
          <Link to={path('/profesionales')}>{t('nav.professionals')}</Link>
          <Link to={path('/clasicos')}>{t('nav.classics')}</Link>
          <Link to={path('/contacto')}>{t('nav.contact')}</Link>
        </nav>
        <div className="vehicle-stage" id="vehicle-explorer">
          <Suspense
            fallback={
              <div className="vehicle-loading">
                <span className="loading-track" />
                {t('hero.loading')}
              </div>
            }
          >
            <VehicleExperience />
          </Suspense>
        </div>
        <div className="hero-bottom container">
          <a href="#categories">
            {t('hero.scroll')}
            <ArrowDown size={17} />
          </a>
          <span className="hero-model">TEMERARIO / 3D</span>
        </div>
        <span className="hero-index" aria-hidden="true">
          01 — 03
        </span>
      </section>
      <section className="categories-section section-padding" id="categories">
        <div className="container">
          <div data-reveal>
            <SectionHeading
              eyebrow={t('home.catalogEyebrow')}
              title={t('home.catalogTitle')}
              text={t('home.catalogText')}
            >
              <ActionLink to="/catalogo" secondary>
                {t('common.viewCatalog')}
              </ActionLink>
            </SectionHeading>
          </div>
          <div className="home-category-grid" data-reveal>
            {activeCategories()
              .slice(0, 6)
              .map((c, i) => (
                <CategoryCard key={c.id} category={c} index={i} />
              ))}
          </div>
          <div className="catalog-footnote">
            <p>{t('common.provisional')}</p>
            <Link to={path('/catalogo')}>
              {t('common.all')}
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      <section className="company-section section-padding">
        <div className="container company-grid">
          <div className="company-art" data-reveal aria-hidden="true">
            <div className="technical-disc">
              <div />
              <div />
              <div />
              <span>RM</span>
            </div>
            <div className="art-caption">
              <span>
                RECANVIS
                <br />
                MARTORELL
              </span>
              <ArrowUpRight size={26} />
            </div>
            <span className="art-coordinate">RM / AUTOMOTIVE</span>
          </div>
          <div className="company-copy" data-reveal>
            <p className="eyebrow">{t('home.companyEyebrow')}</p>
            <h2>{t('home.companyTitle')}</h2>
            <p>{t('home.companyText')}</p>
            <ActionLink to="/empresa" secondary>
              {t('home.companyLink')}
            </ActionLink>
          </div>
        </div>
        <div className="container value-grid" data-reveal>
          {[1, 2, 3].map((i) => (
            <div className="value-item" key={i}>
              <span className="value-check">
                <Check size={18} />
              </span>
              <h3>{t(`home.value${i}`)}</h3>
              <p>{t(`home.value${i}Text`)}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="professionals-section section-padding">
        <div className="container professional-panel" data-reveal>
          <div>
            <p className="eyebrow">{t('home.proEyebrow')}</p>
            <h2>{t('home.proTitle')}</h2>
            <p>{t('home.proText')}</p>
            <ActionLink to="/profesionales">{t('home.proCta')}</ActionLink>
          </div>
          <div className="professional-art" aria-hidden="true">
            <Wrench size={200} strokeWidth={0.6} />
            <span>
              PRO<span>FESSIONAL</span>
            </span>
            <i />
          </div>
        </div>
      </section>
      <section className="container editorial-grid section-padding">
        <div className="editorial-card" data-reveal>
          <p className="eyebrow">04 / {t('nav.offers')}</p>
          <h2>{t('home.offers')}</h2>
          <p>{t('home.offersText')}</p>
          <Link className="text-link" to={path('/promociones')}>
            {t('common.more')}
            <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="editorial-card classics-card" data-reveal>
          <p className="eyebrow">05 / {t('nav.classics')}</p>
          <h2>{t('home.classics')}</h2>
          <p>{t('home.classicsText')}</p>
          <Link className="text-link" to={path('/clasicos')}>
            {t('home.exploreClassics')}
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
      <section className="brand-status container">
        <p className="eyebrow">{t('home.brands')}</p>
        <p>{t('home.brandsText')}</p>
      </section>
      <ContactBanner />
    </div>
  );
}
