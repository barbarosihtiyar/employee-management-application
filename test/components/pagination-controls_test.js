import {PaginationControls} from '../../src/components/pagination-controls.js';
import {fixture, assert, oneEvent} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('pagination-controls', () => {
  test('is defined', () => {
    const el = document.createElement('pagination-controls');
    assert.instanceOf(el, PaginationControls);
  });

  test('renders with default values', async () => {
    const el = await fixture(html`<pagination-controls></pagination-controls>`);
    assert.shadowDom.equal(el, '');
  });

  test('renders pagination with multiple pages', async () => {
    const el = await fixture(html`
      <pagination-controls
        .currentPage=${1}
        .totalPages=${5}
      ></pagination-controls>
    `);

    await el.updateComplete;

    const prevButton = el.shadowRoot.querySelector('button:first-child');
    assert.isTrue(prevButton.hasAttribute('disabled'));

    const nextButton = el.shadowRoot.querySelector('button:last-child');
    assert.isFalse(nextButton.hasAttribute('disabled'));

    const pageButtons = el.shadowRoot.querySelectorAll('.page-button');
    assert.equal(pageButtons.length, 5);

    assert.isTrue(pageButtons[0].classList.contains('active'));
  });

  test('handles page change event', async () => {
    const el = await fixture(html`
      <pagination-controls
        .currentPage=${2}
        .totalPages=${5}
      ></pagination-controls>
    `);

    await el.updateComplete;

    const nextButton = el.shadowRoot.querySelector('button:last-child');

    setTimeout(() => nextButton.click());
    const {detail} = await oneEvent(el, 'page-change');

    assert.equal(detail.page, 3);
  });

  test('page button click changes page', async () => {
    const el = await fixture(html`
      <pagination-controls
        .currentPage=${1}
        .totalPages=${5}
      ></pagination-controls>
    `);

    await el.updateComplete;

    const pageButtons = el.shadowRoot.querySelectorAll('.page-button');

    setTimeout(() => pageButtons[2].click());
    const {detail} = await oneEvent(el, 'page-change');

    assert.equal(detail.page, 3);
  });

  test('correctly calculates visible pages with many pages', async () => {
    const el = await fixture(html`
      <pagination-controls
        .currentPage=${7}
        .totalPages=${15}
        .visiblePageCount=${5}
      ></pagination-controls>
    `);

    await el.updateComplete;

    const pageButtons = el.shadowRoot.querySelectorAll('.page-button');
    assert.equal(pageButtons.length, 5);

    assert.equal(pageButtons[0].textContent.trim(), '5');
    assert.equal(pageButtons[2].textContent.trim(), '7');
    assert.equal(pageButtons[4].textContent.trim(), '9');

    assert.isTrue(pageButtons[2].classList.contains('active'));
  });

  test('handles edge cases', async () => {
    const el = await fixture(html`
      <pagination-controls
        .currentPage=${15}
        .totalPages=${15}
      ></pagination-controls>
    `);

    await el.updateComplete;

    const nextButton = el.shadowRoot.querySelector('button:last-child');
    assert.isTrue(nextButton.hasAttribute('disabled'));

    const prevButton = el.shadowRoot.querySelector('button:first-child');
    assert.isFalse(prevButton.hasAttribute('disabled'));
  });
});
