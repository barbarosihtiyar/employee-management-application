import i18next from 'i18next';
import {en} from '../locales/en.js';
import {tr} from '../locales/tr.js';

const i18nConfig = {
  lng: 'en',
  fallbackLng: 'en',
  debug: false,
  resources: {
    en: {
      translation: en,
    },
    tr: {
      translation: tr,
    },
  },
  interpolation: {
    escapeValue: false,
  },
};

i18next.init(i18nConfig);

export function changeLanguage(lang) {
  if (i18next.language !== lang) {
    i18next.changeLanguage(lang);
    document.documentElement.lang = lang;

    window.dispatchEvent(
      new CustomEvent('language-changed', {
        detail: {language: lang},
      })
    );
  }
  return lang;
}

export function getCurrentLanguage() {
  return i18next.language;
}

export function getAvailableLanguages() {
  return Object.keys(i18nConfig.resources);
}

export function t(key, options = {}) {
  return i18next.t(key, options);
}

export function initializeLanguage() {
  const htmlLang = document.documentElement.lang;
  if (htmlLang && (htmlLang === 'en' || htmlLang === 'tr')) {
    changeLanguage(htmlLang);
  }
}

initializeLanguage();

i18next.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

export default i18next;
