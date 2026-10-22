import { ArrowUpRight, Check, ChevronRight, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { activeCategories } from '../data/categories';
import { CategoryCard } from '../components/catalog/CategoryCard';
import { ActionLink, SectionHeading, useLocalPath } from '../components/ui/Primitives';
import { assetPath } from '../lib/basePath';
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
  return (
    <div>
      <section className="hero hero-static" aria-labelledby="hero-title">
        <picture className="hero-photograph">
          <source
            media="(max-width: 639px)"
            srcSet={assetPath('/images/hero-garage-turquoise-mobile.webp')}
          />
          <img
            src={assetPath('/images/hero-garage-turquoise.webp')}
            alt=""
            width="1672"
            height="941"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <img
          className="hero-corner-logo"
          src={assetPath('/brand/car-emblem.webp')}
          alt=""
          aria-hidden="true"
          width="768"
          height="735"
        />
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
        </div>
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
