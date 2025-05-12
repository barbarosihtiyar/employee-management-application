import {ConfirmationDialog} from '../../src/components/confirmation-dialog.js';
import {fixture, assert, aTimeout} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

const mockT = (key) => {
  const translations = {
    proceed: 'Devam Et',
    cancel: 'İptal',
    are_you_sure: 'Emin misiniz?',
  };
  return translations[key] || key;
};

window.t = mockT;

suite('confirmation-dialog', () => {
  test('is defined', () => {
    const el = document.createElement('confirmation-dialog');
    assert.instanceOf(el, ConfirmationDialog);
  });

  test('renders nothing when closed', async () => {
    const el = await fixture(html`<confirmation-dialog></confirmation-dialog>`);
    assert.shadowDom.equal(el, '');
  });

  test('renders dialog when opened', async () => {
    const el = await fixture(html`<confirmation-dialog></confirmation-dialog>`);

    const openPromise = el.open({
      title: 'Test Title',
      message: 'Test Message',
    });

    await el.updateComplete;

    const modal = el.shadowRoot.querySelector('.modal');
    assert.exists(modal, 'Modal container should exist');

    const title = el.shadowRoot.querySelector('.modal-title');
    assert.equal(title.textContent, 'Test Title');

    const message = el.shadowRoot.querySelector('.modal-message');
    assert.equal(message.textContent, 'Test Message');

    const confirmButton = el.shadowRoot.querySelector('.confirm-button');
    assert.exists(confirmButton);
    assert.include(confirmButton.textContent.trim(), 'Devam Et');

    const cancelButton = el.shadowRoot.querySelector('.cancel-button');
    assert.exists(cancelButton);
    assert.include(cancelButton.textContent.trim(), 'İptal');

    el.close(false);
    const result = await openPromise;
    assert.isFalse(result);
  });

  test('resolves with true when confirmed', async () => {
    const el = await fixture(html`<confirmation-dialog></confirmation-dialog>`);

    setTimeout(() => {
      el.open();
      el.shadowRoot.querySelector('.confirm-button').click();
    });

    await aTimeout(10);

    assert.isFalse(el.isOpen, 'Dialog should be closed after confirming');
  });

  test('resolves with false when canceled', async () => {
    const el = await fixture(html`<confirmation-dialog></confirmation-dialog>`);

    setTimeout(() => {
      el.open();
      el.shadowRoot.querySelector('.cancel-button').click();
    });

    await aTimeout(10);

    assert.isFalse(el.isOpen, 'Dialog should be closed after canceling');
  });

  test('resolves with false when clicked outside modal', async () => {
    const el = await fixture(html`<confirmation-dialog></confirmation-dialog>`);

    setTimeout(() => {
      el.open();
      el.shadowRoot.querySelector('.modal').click();
    });

    await aTimeout(10);

    assert.isFalse(el.isOpen, 'Dialog should be closed after clicking outside');
  });

  test('applies danger class when isDanger is true', async () => {
    const el = await fixture(html`<confirmation-dialog></confirmation-dialog>`);

    el.open({
      isDanger: true,
      title: 'Danger Dialog',
    });

    await el.updateComplete;

    const confirmButton = el.shadowRoot.querySelector('.confirm-button');
    assert.exists(confirmButton);

    el.close(false);
  });

  test('uses custom button text when provided', async () => {
    const el = await fixture(html`<confirmation-dialog></confirmation-dialog>`);

    el.open({
      confirmText: 'Custom Confirm',
      cancelText: 'Custom Cancel',
    });

    await el.updateComplete;

    const confirmButton = el.shadowRoot.querySelector('.confirm-button');
    assert.include(confirmButton.textContent.trim(), 'Custom Confirm');

    const cancelButton = el.shadowRoot.querySelector('.cancel-button');
    assert.include(cancelButton.textContent.trim(), 'Custom Cancel');

    el.close(false);
  });
});
