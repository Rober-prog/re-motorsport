import business from '../data/business.json';
import type { Locale } from '../data/categories';

export { business };
export const businessAddress = `${business.address.streetAddress}, ${business.address.postalCode} ${business.address.addressLocality}, ${business.address.addressRegion}`;
export const businessValues = {
  legalName: business.legalName,
  taxId: business.taxId,
  address: businessAddress,
  variant: business.addressVariant,
  cnae: business.cnaePublished,
  ...business.registry,
};
export function incorporationDate(locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'ca' ? 'ca-ES' : 'es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${business.incorporationDate}T00:00:00Z`));
}
