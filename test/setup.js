window.mockI18n = {
  translations: {
    en: {
      prev: 'Previous',
      next: 'Next',
      page_of: 'Page {current} of {total}',
      search: 'Search',
      proceed: 'Proceed',
      cancel: 'Cancel',
      are_you_sure: 'Are you sure?',
      employees: 'Employees',
      add_new: 'Add New',
    },
    tr: {
      prev: 'Önceki',
      next: 'Sonraki',
      page_of: 'Sayfa {current}/{total}',
      search: 'Ara',
      proceed: 'Devam Et',
      cancel: 'İptal',
      are_you_sure: 'Emin misiniz?',
      employees: 'Çalışanlar',
      add_new: 'Yeni Ekle',
    },
  },

  currentLanguage: 'tr',

  t: function (key, params) {
    const translations = this.translations[this.currentLanguage];
    if (!translations || !translations[key]) return key;

    let text = translations[key];
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        text = text.replace(`{${key}}`, value);
      }
    }

    return text;
  },

  getCurrentLanguage: function () {
    return this.currentLanguage;
  },

  changeLanguage: function (lang) {
    if (this.translations[lang]) {
      this.currentLanguage = lang;
      window.dispatchEvent(
        new CustomEvent('language-changed', {
          detail: {language: lang},
          bubbles: true,
        })
      );
    }
  },
};

window.mockRouter = {
  navigate: function (path) {
    window.dispatchEvent(
      new CustomEvent('vaadin-router-location-changed', {
        detail: {
          location: {
            pathname: path,
          },
        },
      })
    );
  },
};

window.t = (key, params) => window.mockI18n.t(key, params);

window.mock = function (modulePath, implementation) {
  const moduleName = modulePath.split('/').pop().split('.')[0];
  window.mocks = window.mocks || {};
  window.mocks[moduleName] = implementation;

  return implementation;
};

window.mock('../../src/i18n/i18n-config.js', {
  t: (key, params) => window.mockI18n.t(key, params),
  getCurrentLanguage: () => window.mockI18n.getCurrentLanguage(),
  changeLanguage: (lang) => window.mockI18n.changeLanguage(lang),
});

window.mock('../../src/router.js', {
  navigate: (path) => window.mockRouter.navigate(path),
});
