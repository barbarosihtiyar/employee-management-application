import {NavigationMenu} from '../../src/components/navigation-menu.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

const mockT = (key) => {
  const translations = {
    employees: 'Çalışanlar',
    add_new: 'Yeni Ekle',
  };
  return translations[key] || key;
};

window.t = mockT;

suite('navigation-menu', () => {
  let originalPathname;

  setup(() => {
    originalPathname = window.location.pathname;

    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/employees',
      },
      writable: true,
    });
  });

  teardown(() => {
    Object.defineProperty(window, 'location', {
      value: {
        pathname: originalPathname,
      },
      writable: true,
    });
  });

  test('is defined', () => {
    const el = document.createElement('navigation-menu');
    assert.instanceOf(el, NavigationMenu);
  });

  test('renders navigation items', async () => {
    const el = await fixture(html`<navigation-menu></navigation-menu>`);

    const navItems = el.shadowRoot.querySelectorAll('li');
    assert.equal(navItems.length, 2);

    const firstItem = el.shadowRoot.querySelector('a');
    assert.include(firstItem.textContent.trim(), 'Çalışanlar');

    const secondItem = el.shadowRoot.querySelectorAll('a')[1];
    assert.include(secondItem.textContent.trim(), 'Yeni Ekle');
  });

  test('adds active class to current path', async () => {
    const el = await fixture(html`<navigation-menu></navigation-menu>`);

    const firstItem = el.shadowRoot.querySelector('a');
    assert.isTrue(firstItem.classList.contains('active'));

    const secondItem = el.shadowRoot.querySelectorAll('a')[1];
    assert.isFalse(secondItem.classList.contains('active'));
  });

  test('updates active item when path changes', async () => {
    const el = await fixture(html`<navigation-menu></navigation-menu>`);

    window.dispatchEvent(
      new CustomEvent('vaadin-router-location-changed', {
        detail: {
          location: {
            pathname: '/employees/new',
          },
        },
      })
    );

    await el.updateComplete;

    const firstItem = el.shadowRoot.querySelector('a');
    assert.isFalse(firstItem.classList.contains('active'));

    const secondItem = el.shadowRoot.querySelectorAll('a')[1];
    assert.isTrue(secondItem.classList.contains('active'));
  });

  test('handles navigation on click', async () => {
    const el = await fixture(html`<navigation-menu></navigation-menu>`);

    const secondItem = el.shadowRoot.querySelectorAll('a')[1];

    const originalNavigate = window.mockRouter.navigate;
    let navigatedPath = null;

    window.mockRouter.navigate = (path) => {
      navigatedPath = path;
      window.dispatchEvent(
        new CustomEvent('vaadin-router-location-changed', {
          detail: {
            location: {
              pathname: path,
            },
          },
        })
      );
    };

    const clickEvent = new MouseEvent('click', {bubbles: true});
    clickEvent.preventDefault = () => {};
    secondItem.dispatchEvent(clickEvent);

    await el.updateComplete;

    assert.equal(navigatedPath, '/employees/new');

    assert.isTrue(secondItem.classList.contains('active'));

    window.mockRouter.navigate = originalNavigate;
  });

  test('updates menu when language changes', async () => {
    const el = await fixture(html`<navigation-menu></navigation-menu>`);

    const oldTranslation = window.mockI18n.t;
    window.mockI18n.t = (key) => {
      const newTranslations = {
        employees: 'Personeller',
        add_new: 'Yeni Personel Ekle',
      };
      return newTranslations[key] || key;
    };

    window.dispatchEvent(new CustomEvent('language-changed'));
    await el.updateComplete;

    const firstItem = el.shadowRoot.querySelector('a');
    assert.include(firstItem.textContent.trim(), 'Personeller');

    const secondItem = el.shadowRoot.querySelectorAll('a')[1];
    assert.include(secondItem.textContent.trim(), 'Yeni Personel Ekle');

    window.mockI18n.t = oldTranslation;
  });
});
