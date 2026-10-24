import { useTranslation } from 'react-i18next';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { activeCategories } from '../data/categories';
import { brand } from '../config/brand';
import { CategoryCard } from '../components/catalog/CategoryCard';
import { ActionLink, SectionHeading, useLocalPath } from '../components/ui/Primitives';
import { assetPath } from '../lib/basePath';
import { Stores } from '../components/Stores';
export function ContactBanner() {
  const { t } = useTranslation();
  return (
    <section className="contact-banner">
      <div className="container">
        <div>
          <p className="eyebrow">{brand.name}</p>
          <h2>{t('landing.bannerTitle')}</h2>
          <p>{t('landing.bannerText')}</p>
        </div>
      </div>
    </section>
  );
}
export default function HomePage() {
  const { t } = useTranslation();
  const path = useLocalPath();
  return (
    <>
      <section className="hero re-hero hero-static" aria-labelledby="hero-title">
        <picture className="hero-photograph">
          <source
            media="(max-width: 959px)"
            srcSet={assetPath(brand.hero.mobile)}
            width="900"
            height="1350"
          />
          <img
            src={assetPath(brand.hero.desktop)}
            alt={t('landing.imageAlt')}
            width="1672"
            height="941"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="container hero-copy">
          <p className="eyebrow">
            <span className="tiny-line" />
            {t('landing.eyebrow')}
          </p>
          <h1 id="hero-title">
            {t('landing.line1')}
            <br />
            <span>{t('landing.line2')}</span>
          </h1>
          <p className="hero-subtitle">{t('hero.subtitle')}</p>
          <div className="hero-actions">
            <Link className="text-link" to={path('/tiendas')}>
              {t('landing.storesLink')} <ArrowUpRight size={18} />
            </Link>
          </div>
          <p className="hero-locations">
            ESPARREGUERA <span>/</span> PIERA
          </p>
        </div>
        <div className="hero-bottom container">
          <a href="#categories">
            {t('landing.explore')} <ArrowDown size={16} />
          </a>
          <span>{t('landing.eyebrow')}</span>
        </div>
      </section>
      <section className="categories-section section-padding" id="categories">
        <div className="container">
          <SectionHeading
            eyebrow={t('landing.catalogEyebrow')}
            title={t('landing.catalogTitle')}
            text={t('landing.catalogText')}
          >
            <ActionLink to="/catalogo" secondary>
              {t('landing.allParts')}
            </ActionLink>
          </SectionHeading>
          <div className="home-category-grid">
            {activeCategories()
              .slice(0, 6)
              .map((c, i) => (
                <CategoryCard key={c.id} category={c} index={i} />
              ))}
          </div>
          <p className="catalog-footnote">{t('landing.footnote')}</p>
        </div>
      </section>
      <section className="section-padding process-section" id="como-trabajamos">
        <div className="container">
          <SectionHeading
            eyebrow={t('landing.processEyebrow')}
            title={t('landing.processTitle')}
            text={t('landing.processText')}
          />
          <div className="process-grid">
            {[1, 2, 3].map((i) => (
              <article key={i}>
                <span className="process-number">0{i}</span>
                <h3>{t(`landing.step${i}Title`)}</h3>
                <p>{t(`landing.step${i}Text`)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section-padding" id="tiendas">
        <div className="container">
          <SectionHeading
            eyebrow={t('landing.storesEyebrow')}
            title={t('landing.storesTitle')}
            text={t('landing.storesText')}
          />
          <Stores />
        </div>
      </section>
      <ContactBanner />
    </>
  );
}
