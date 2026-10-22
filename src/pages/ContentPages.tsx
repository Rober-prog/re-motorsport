import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowUpRight,
  Building2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Search,
  SlidersHorizontal,
  Tag,
  Wrench,
} from 'lucide-react';
import { activeCategories, filterCategories } from '../data/categories';
import { localeFromPath } from '../lib/routing';
import { assetPath } from '../lib/basePath';
import { business, businessAddress, businessValues, incorporationDate } from '../lib/business';
import {
  ActionLink,
  Breadcrumbs,
  PageIntro,
  PendingNotice,
  useLocalPath,
} from '../components/ui/Primitives';
import { CategoryCard } from '../components/catalog/CategoryCard';
import { CategoryIcon } from '../components/ui/CategoryIcon';
import { ContactForm } from '../components/forms/ContactForm';
import { ContactBanner } from './HomePage';
export function CatalogPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('all');
  const filtered = filterCategories(query, group);
  return (
    <>
      <div className="container page-content">
        <Breadcrumbs title={t('nav.catalog')} />
        <PageIntro
          eyebrow={t('catalog.eyebrow')}
          title={t('catalog.title')}
          text={t('catalog.text')}
        />
        <div className="catalog-tools">
          <div className="search-control">
            <Search size={20} aria-hidden="true" />
            <input
              type="search"
              aria-label={t('catalog.search')}
              placeholder={t('catalog.search')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="filter-control">
            <SlidersHorizontal size={18} aria-hidden="true" />
            <select
              aria-label={t('catalog.filter')}
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            >
              {['all', 'maintenance', 'mechanics', 'equipment'].map((g) => (
                <option key={g} value={g}>
                  {t(g === 'all' ? 'common.all' : `catalog.${g}`)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="results-count" role="status" aria-live="polite">
          {filtered.length} {t('catalog.count')}
        </p>
        <div className="catalog-grid">
          {filtered.map((c, i) => (
            <CategoryCard key={c.id} category={c} index={i} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="empty-state">
            <Search size={36} />
            <h2>{t('common.noResults')}</h2>
            <button
              className="button button-secondary"
              onClick={() => {
                setQuery('');
                setGroup('all');
              }}
            >
              {t('common.clear')}
            </button>
          </div>
        )}
        <PendingNotice>{t('common.provisional')}</PendingNotice>
      </div>
      <ContactBanner />
    </>
  );
}
export function CategoryPage() {
  const { categoria } = useParams();
  const locale = localeFromPath(useLocation().pathname);
  const { t } = useTranslation();
  const path = useLocalPath();
  const category = activeCategories().find((c) => c.slug === categoria);
  if (!category) return <NotFoundPage />;
  return (
    <>
      <div className="container page-content">
        <Breadcrumbs title={category.name[locale]} />
        <div className="category-detail-grid">
          <div>
            <Link className="text-link" to={path('/catalogo')}>
              ← {t('common.back')}
            </Link>
            <PageIntro
              eyebrow={t('catalog.eyebrow')}
              title={category.name[locale]}
              text={category.description[locale]}
            />
            <ActionLink to={`/contacto?categoria=${category.id}`}>
              {t('catalog.consult')}
            </ActionLink>
          </div>
          <div
            className={`category-detail-art${category.image ? ' category-detail-photo' : ''}`}
            aria-hidden={category.image ? undefined : true}
          >
            {category.image ? (
              <img
                src={assetPath(category.image)}
                alt={category.name[locale]}
                width="960"
                height="640"
                fetchPriority="high"
                decoding="async"
              />
            ) : (
              <>
                <CategoryIcon name={category.icon} size={190} strokeWidth={0.7} />
                <span>{String(category.order).padStart(2, '0')} / RM</span>
              </>
            )}
          </div>
        </div>
        <section className="families-section">
          <h2>{t('catalog.families')}</h2>
          <p>{t('catalog.detail')}</p>
          <div className="family-grid">
            {category.families[locale].map((family, i) => (
              <div className="family-card" key={family}>
                <span>0{i + 1}</span>
                <h3>{family}</h3>
                <PendingNotice />
              </div>
            ))}
          </div>
        </section>
      </div>
      <ContactBanner />
    </>
  );
}
export function CompanyPage() {
  const { t } = useTranslation();
  const locale = localeFromPath(useLocation().pathname);
  return (
    <>
      <div className="container page-content">
        <Breadcrumbs title={t('nav.company')} />
        <PageIntro
          eyebrow={t('company.eyebrow')}
          title={t('company.title')}
          text={t('company.text')}
        />
        <div className="company-statement">
          <span className="statement-mark" aria-hidden="true">
            RM.
          </span>
          <div>
            <p>{t('company.detail')}</p>
            <h2>{t('company.approach')}</h2>
            <p>{t('company.approachText')}</p>
          </div>
        </div>
        <div className="info-grid">
          {['history', 'facilities'].map((key) => (
            <section className="info-card" key={key}>
              <Building2 size={28} aria-hidden="true" />
              <h2>{t(`company.${key}`)}</h2>
              <p>
                {t(`company.${key}Text`, { ...businessValues, date: incorporationDate(locale) })}
              </p>
              {key === 'facilities' && (
                <PendingNotice>{t('contact.addressNote', businessValues)}</PendingNotice>
              )}
            </section>
          ))}
        </div>
      </div>
      <ContactBanner />
    </>
  );
}
export function ProfessionalsPage() {
  const { t } = useTranslation();
  return (
    <div className="container page-content">
      <Breadcrumbs title={t('nav.professionals')} />
      <PageIntro
        eyebrow={t('professionals.eyebrow')}
        title={t('professionals.title')}
        text={t('professionals.text')}
      />
      <div className="professional-features">
        {[1, 2, 3].map((i) => (
          <article key={i}>
            <Wrench size={26} />
            <span>0{i}</span>
            <h2>{t(`professionals.item${i}`)}</h2>
            <p>{t(`professionals.item${i}Text`)}</p>
          </article>
        ))}
      </div>
      <section className="form-section">
        <h2>{t('professionals.form')}</h2>
        <ContactForm initialType="professional" />
      </section>
    </div>
  );
}
export function PromotionsPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="container page-content">
        <Breadcrumbs title={t('nav.offers')} />
        <PageIntro
          eyebrow={t('offers.eyebrow')}
          title={t('offers.title')}
          text={t('offers.text')}
        />
        <div className="empty-state promotion-empty">
          <Tag size={46} strokeWidth={1} />
          <h2>{t('offers.empty')}</h2>
          <p>{t('offers.detail')}</p>
          <ActionLink to="/contacto">{t('common.contact')}</ActionLink>
        </div>
      </div>
      <ContactBanner />
    </>
  );
}
export function ClassicsPage() {
  const { t } = useTranslation();
  return (
    <div className="container page-content">
      <Breadcrumbs title={t('nav.classics')} />
      <PageIntro
        eyebrow={t('classics.eyebrow')}
        title={t('classics.title')}
        text={t('classics.text')}
      />
      <div className="classic-banner">
        <span aria-hidden="true">CLASSICS</span>
        <p>{t('classics.detail', businessValues)}</p>
        <a
          className="button button-primary classic-store-link"
          href={business.classicStore}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('classics.visitStore')}
          <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </div>
      <section className="form-section">
        <h2>{t('classics.form')}</h2>
        <ContactForm initialType="classic" />
      </section>
    </div>
  );
}
export function ContactPage() {
  const { t } = useTranslation();
  return (
    <div className="container page-content">
      <Breadcrumbs title={t('nav.contact')} />
      <PageIntro
        eyebrow={t('contact.eyebrow')}
        title={t('contact.title')}
        text={t('contact.text')}
      />
      <div className="contact-grid">
        <section className="contact-information">
          <h2>{t('contact.details')}</h2>
          {[
            [MapPin, 'address'],
            [Phone, 'phone'],
            [Mail, 'email'],
            [Clock3, 'hours'],
          ].map(([Icon, key]) => {
            const I = Icon as typeof MapPin;
            return (
              <div className="contact-detail" key={String(key)}>
                <I size={20} />
                <div>
                  <h3>{t(`contact.${String(key)}`)}</h3>
                  <p>{key === 'address' ? businessAddress : t('contact.unconfirmed')}</p>
                  {key === 'address' && (
                    <p className="contact-address-note">
                      {t('contact.addressNote', businessValues)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
          <div className="contact-wordmark" aria-hidden="true">
            RM.
          </div>
        </section>
        <section>
          <h2 className="form-title">{t('contact.form')}</h2>
          <ContactForm />
        </section>
      </div>
    </div>
  );
}
export function LegalPage({ kind }: { kind: 'notice' | 'privacy' | 'cookies' }) {
  const { t } = useTranslation();
  const keys =
    kind === 'notice'
      ? ['owner', 'registry', 'activity', 'purpose']
      : kind === 'privacy'
        ? ['controller', 'data']
        : ['storage', 'third'];
  return (
    <div className="container page-content legal-content">
      <Breadcrumbs title={t(`legal.${kind}Title`)} />
      <PageIntro eyebrow={t('legal.eyebrow')} title={t(`legal.${kind}Title`)} />
      <PendingNotice>{t('legal.pending')}</PendingNotice>
      {keys.map((key) => (
        <section key={key}>
          <h2>{t(`legal.${key}`)}</h2>
          <p>{t(`legal.${key}Text`, businessValues)}</p>
          {key === 'owner' && <p>{t('contact.addressNote', businessValues)}</p>}
        </section>
      ))}
    </div>
  );
}
export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="container page-content not-found">
      <p className="error-code" aria-hidden="true">
        404
      </p>
      <PageIntro
        eyebrow="RECANVIS MARTORELL"
        title={t('notFound.title')}
        text={t('notFound.text')}
      />
      <ActionLink to="/">{t('notFound.cta')}</ActionLink>
      <ActionLink to="/catalogo" secondary>
        {t('common.viewCatalog')}
        <ArrowUpRight size={17} />
      </ActionLink>
    </div>
  );
}
