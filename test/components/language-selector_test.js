import {LanguageSelector} from '../../src/components/language-selector.js';
import {fixture, assert, oneEvent} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('language-selector', () => {
  let originalMockI18n;

  setup(() => {
    originalMockI18n = {
      currentLanguage: window.mockI18n.currentLanguage,
      t: window.mockI18n.t,
      getCurrentLanguage: window.mockI18n.getCurrentLanguage,
      changeLanguage: window.mockI18n.changeLanguage,
    };

    window.mockI18n.currentLanguage = 'en';
  });

  teardown(() => {
    window.mockI18n.currentLanguage = originalMockI18n.currentLanguage;
    window.mockI18n.t = originalMockI18n.t;
    window.mockI18n.getCurrentLanguage = originalMockI18n.getCurrentLanguage;
    window.mockI18n.changeLanguage = originalMockI18n.changeLanguage;
  });

  test('is defined', () => {
    const el = document.createElement('language-selector');
    assert.instanceOf(el, LanguageSelector);
  });

  test('renders with initial language', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);

    const selectedImg = el.shadowRoot.querySelector('.selected img');
    assert.exists(selectedImg);
    assert.include(selectedImg.getAttribute('src'), 'en.svg');
    assert.equal(selectedImg.getAttribute('alt'), 'en');
  });

  test('toggles dropdown when clicked', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);

    let dropdown = el.shadowRoot.querySelector('.dropdown');
    assert.isFalse(dropdown.classList.contains('open'));

    const selected = el.shadowRoot.querySelector('.selected');
    selected.click();
    await el.updateComplete;

    dropdown = el.shadowRoot.querySelector('.dropdown');
    assert.isTrue(dropdown.classList.contains('open'));

    selected.click();
    await el.updateComplete;

    dropdown = el.shadowRoot.querySelector('.dropdown');
    assert.isFalse(dropdown.classList.contains('open'));
  });

  test('changes language when an option is selected', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);

    const selected = el.shadowRoot.querySelector('.selected');
    selected.click();
    await el.updateComplete;

    const trOption = el.shadowRoot.querySelector('.dropdown-item:first-child');

    setTimeout(() => trOption.click());
    await oneEvent(window, 'language-changed');
    await el.updateComplete;

    assert.equal(window.mockI18n.currentLanguage, 'tr');

    const dropdown = el.shadowRoot.querySelector('.dropdown');
    assert.isFalse(dropdown.classList.contains('open'));

    const selectedImg = el.shadowRoot.querySelector('.selected img');
    assert.include(selectedImg.getAttribute('src'), 'tr.svg');
  });

  test('reacts to language-changed event from outside', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);

    window.dispatchEvent(
      new CustomEvent('language-changed', {
        detail: {language: 'tr'},
        bubbles: true,
      })
    );

    await el.updateComplete;

    assert.equal(el.language, 'tr');

    const selectedImg = el.shadowRoot.querySelector('.selected img');
    assert.include(selectedImg.getAttribute('src'), 'tr.svg');
  });

  test('closes dropdown when clicked outside', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);

    const selected = el.shadowRoot.querySelector('.selected');
    selected.click();
    await el.updateComplete;

    let dropdown = el.shadowRoot.querySelector('.dropdown');
    assert.isTrue(dropdown.classList.contains('open'));

    document.dispatchEvent(new MouseEvent('click'));
    await el.updateComplete;

    dropdown = el.shadowRoot.querySelector('.dropdown');
    assert.isFalse(dropdown.classList.contains('open'));
  });

  test('cleans up event listeners on disconnection', async () => {
    const el = await fixture(html`<language-selector></language-selector>`);

    const originalRemoveEventListener = window.removeEventListener;
    const originalDocumentRemoveEventListener = document.removeEventListener;

    const windowRemoveCalls = [];
    const documentRemoveCalls = [];

    window.removeEventListener = (eventName, handler) => {
      windowRemoveCalls.push(eventName);
      originalRemoveEventListener.call(window, eventName, handler);
    };

    document.removeEventListener = (eventName, handler) => {
      documentRemoveCalls.push(eventName);
      originalDocumentRemoveEventListener.call(document, eventName, handler);
    };

    el.remove();

    assert.include(windowRemoveCalls, 'language-changed');
    assert.include(documentRemoveCalls, 'click');

    window.removeEventListener = originalRemoveEventListener;
    document.removeEventListener = originalDocumentRemoveEventListener;
  });
});
