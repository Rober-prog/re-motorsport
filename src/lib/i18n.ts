import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from '../locales/resources';
import type { Locale } from '../data/categories';
export function createI18n(locale: Locale) {
  const instance = createInstance();
  void instance.use(initReactI18next).init({
    resources,
    lng: locale,
    fallbackLng: 'ca',
    initAsync: false,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
  return instance;
}
