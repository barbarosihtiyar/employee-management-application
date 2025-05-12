import {SearchBox} from '../../src/components/search-box.js';
import {fixture, assert, oneEvent} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

const mockT = (key) => {
  const translations = {
    search: 'Ara',
  };
  return translations[key] || key;
};

window.t = mockT;

suite('search-box', () => {
  test('is defined', () => {
    const el = document.createElement('search-box');
    assert.instanceOf(el, SearchBox);
  });

  test('renders with default placeholder', async () => {
    const el = await fixture(html`<search-box></search-box>`);

    const input = el.shadowRoot.querySelector('input');
    assert.equal(input.placeholder, 'Ara');
  });

  test('custom placeholder works', async () => {
    const el = await fixture(
      html`<search-box .placeholder="Test"></search-box>`
    );

    const input = el.shadowRoot.querySelector('input');
    assert.equal(input.placeholder, 'Test');
  });

  test('updates value on input', async () => {
    const el = await fixture(html`<search-box></search-box>`);

    const input = el.shadowRoot.querySelector('input');
    input.value = 'test value';
    input.dispatchEvent(new Event('input'));

    assert.equal(el.value, 'test value');
  });

  test('displays clear button when value exists', async () => {
    const el = await fixture(html`<search-box .value="test"></search-box>`);

    const clearButton = el.shadowRoot.querySelector('.clear-button');
    assert.exists(clearButton);
  });

  test('does not display clear button when value is empty', async () => {
    const el = await fixture(html`<search-box></search-box>`);

    const clearButton = el.shadowRoot.querySelector('.clear-button');
    assert.notExists(clearButton);
  });

  test('clears value when clear button is clicked', async () => {
    const el = await fixture(html`<search-box .value="test"></search-box>`);

    const clearButton = el.shadowRoot.querySelector('.clear-button');
    clearButton.click();

    await el.updateComplete;

    assert.equal(el.value, '');
  });

  test('dispatches search event on input (debounced)', async () => {
    const el = await fixture(html`<search-box></search-box>`);

    el._debounceTime = 10;

    const input = el.shadowRoot.querySelector('input');

    setTimeout(() => {
      input.value = 'test query';
      input.dispatchEvent(new Event('input'));
    });

    const event = await oneEvent(el, 'search');

    assert.deepEqual(event.detail, {query: 'test query'});
  });

  test('dispatches search event immediately when clear button is clicked', async () => {
    const el = await fixture(html`<search-box .value="test"></search-box>`);

    setTimeout(() => {
      const clearButton = el.shadowRoot.querySelector('.clear-button');
      clearButton.click();
    });

    const event = await oneEvent(el, 'search');

    assert.deepEqual(event.detail, {query: ''});
  });

  test('updates placeholder when language changes', async () => {
    const el = await fixture(html`<search-box></search-box>`);

    window.t = () => 'Yeni Ara';

    window.dispatchEvent(new CustomEvent('language-changed'));
    await el.updateComplete;

    const input = el.shadowRoot.querySelector('input');
    assert.equal(input.placeholder, 'Yeni Ara');

    window.t = mockT;
  });
});
