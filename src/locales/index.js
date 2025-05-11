import {en} from './en.js';
import {tr} from './tr.js';

const locales = {
  en,
  tr,
};

// Default language
let currentLanguage = 'en';

// Set the language based on HTML lang attribute
function initializeLanguage() {
  const htmlLang = document.documentElement.lang;
  if (htmlLang && locales[htmlLang]) {
    currentLanguage = htmlLang;
  }
}

// Initialize on script load
initializeLanguage();

// Get a localized string by key
export function localize(key, placeholders = {}) {
  if (!locales[currentLanguage] || !locales[currentLanguage][key]) {
    console.warn(
      `Missing translation for key '${key}' in language '${currentLanguage}'`
    );
    // Fallback to English
    if (locales.en && locales.en[key]) {
      return replacePlaceholders(locales.en[key], placeholders);
    }
    return key;
  }

  return replacePlaceholders(locales[currentLanguage][key], placeholders);
}

// Replace placeholders in the format {placeholder} with values
function replacePlaceholders(text, placeholders) {
  return text.replace(/{([^}]+)}/g, (match, key) => {
    return placeholders[key] !== undefined ? placeholders[key] : match;
  });
}

// Change the current language
export function setLanguage(language) {
  if (locales[language]) {
    currentLanguage = language;
    document.documentElement.lang = language;

    // Dispatch a custom event so components can update
    window.dispatchEvent(
      new CustomEvent('language-changed', {
        detail: {language},
      })
    );

    return true;
  }
  return false;
}

// Get current language
export function getCurrentLanguage() {
  return currentLanguage;
}

// Get available languages
export function getAvailableLanguages() {
  return Object.keys(locales);
}

// Check if a language is supported
export function isLanguageSupported(language) {
  return !!locales[language];
}
