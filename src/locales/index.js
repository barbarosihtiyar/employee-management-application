import {en} from './en.js';
import {tr} from './tr.js';

const locales = {
  en,
  tr,
};

let currentLanguage = 'en';

function initializeLanguage() {
  const htmlLang = document.documentElement.lang;
  if (htmlLang && locales[htmlLang]) {
    currentLanguage = htmlLang;
  }
}

initializeLanguage();

export function localize(key, placeholders = {}) {
  if (!locales[currentLanguage] || !locales[currentLanguage][key]) {
    console.warn(
      `Missing translation for key '${key}' in language '${currentLanguage}'`
    );
    if (locales.en && locales.en[key]) {
      return replacePlaceholders(locales.en[key], placeholders);
    }
    return key;
  }

  return replacePlaceholders(locales[currentLanguage][key], placeholders);
}

function replacePlaceholders(text, placeholders) {
  return text.replace(/{([^}]+)}/g, (match, key) => {
    return placeholders[key] !== undefined ? placeholders[key] : match;
  });
}

export function setLanguage(language) {
  if (locales[language]) {
    currentLanguage = language;
    document.documentElement.lang = language;

    window.dispatchEvent(
      new CustomEvent('language-changed', {
        detail: {language},
      })
    );

    return true;
  }
  return false;
}

export function getCurrentLanguage() {
  return currentLanguage;
}

export function getAvailableLanguages() {
  return Object.keys(locales);
}

export function isLanguageSupported(language) {
  return !!locales[language];
}
