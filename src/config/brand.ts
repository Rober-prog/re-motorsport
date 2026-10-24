import config from './brand.json';
export const brand = config;
export const visibleStores = brand.stores.filter(
  (store) => store.visible && store.status === 'corroborated-public-listings',
);
const configuredUrl = import.meta.env.VITE_SITE_URL?.trim() || '';
function validOrigin(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' &&
      !url.username &&
      !url.password &&
      url.pathname === '/' &&
      !url.search &&
      !url.hash
      ? url.origin
      : '';
  } catch {
    return '';
  }
}
export const siteOrigin = validOrigin(configuredUrl);
export const mapUrl = (store: (typeof brand.stores)[number]) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.street}, ${store.postalCode} ${store.city}`)}`;
