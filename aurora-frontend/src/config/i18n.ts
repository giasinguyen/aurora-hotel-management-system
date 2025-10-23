import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enHeaderTranslations from '@/locales/en/client/header.json';
import viHeaderTranslations from '@/locales/vi/client/header.json';
import enHomeTranslations from '@/locales/en/client/home.json';
import viHomeTranslations from '@/locales/vi/client/home.json';

const resources = {
  en: {
    header: enHeaderTranslations,
    home: enHomeTranslations,
  },
  vi: {
    header: viHeaderTranslations,
    home: viHomeTranslations,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'header',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'language',
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
