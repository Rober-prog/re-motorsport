import { useTranslation } from 'react-i18next';
import { MapPin, Phone, ArrowUpRight } from 'lucide-react';
import { visibleStores, mapUrl } from '../config/brand';
export function Stores() {
  const { t, i18n } = useTranslation();
  return (
    <div className="store-grid">
      {visibleStores.map((store, index) => (
        <article className="store-card" key={store.id} id={store.id}>
          <span className="eyebrow">
            0{index + 1} / {t('stores.yourStore')}
          </span>
          <h2>{store.name}</h2>
          <p className="store-address">
            <MapPin size={18} aria-hidden="true" />
            <span>
              {store.street}
              <br />
              {store.postalCode} {store.city}, {store.region}
            </span>
          </p>
          <a
            className="store-phone"
            href={`tel:${store.phone}`}
            aria-label={t('stores.call', { name: store.name, phone: store.phoneLabel })}
          >
            <Phone size={20} aria-hidden="true" />
            {store.phoneLabel}
          </a>
          <dl className="store-hours">
            <div>
              <dt>{t('stores.weekdays')}</dt>
              <dd>
                {i18n.language === 'ca'
                  ? store.hours.weekdays.replace(' y ', ' i ')
                  : store.hours.weekdays}
              </dd>
            </div>
            <div>
              <dt>{t('stores.saturday')}</dt>
              <dd>{store.hours.saturday}</dd>
            </div>
            <div>
              <dt>{t('stores.sunday')}</dt>
              <dd>{t('stores.closed')}</dd>
            </div>
          </dl>
          <p className="hours-note">{t('stores.note')}</p>
          <a
            className="text-link"
            href={mapUrl(store)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('stores.mapLabel', { name: store.name })}
          >
            {t('stores.directions')} <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </article>
      ))}
    </div>
  );
}
