import {LitElement, html, css} from 'lit';
import {localize} from '../locales/index.js';

export class ConfirmationDialog extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background-color: var(--white);
      border-radius: 8px;
      box-shadow: var(--shadow);
      padding: 24px;
      max-width: 400px;
      width: 90%;
    }

    .modal-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 16px;
      color: var(--secondary-color);
    }

    .modal-message {
      margin-bottom: 24px;
      color: var(--text-color);
    }

    .modal-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .cancel-button {
      background-color: var(--light-gray);
      color: var(--text-color);
    }

    .confirm-button {
      background-color: var(--primary-color);
      color: var(--white);
    }

    .confirm-button.danger {
      background-color: var(--danger-color);
    }
  `;

  static properties = {
    isOpen: {type: Boolean},
    title: {type: String},
    message: {type: String},
    confirmText: {type: String},
    cancelText: {type: String},
    isDanger: {type: Boolean},
  };

  constructor() {
    super();
    this.isOpen = false;
    this.title = '';
    this.message = '';
    this.confirmText = localize('proceed');
    this.cancelText = localize('cancel');
    this.isDanger = false;

    // Listen for language changes
    window.addEventListener('language-changed', () => {
      this.cancelText = localize('cancel');
      this.confirmText = localize('proceed');
    });
  }

  open(options = {}) {
    this.title = options.title || localize('are_you_sure');
    this.message = options.message || '';
    this.confirmText = options.confirmText || localize('proceed');
    this.cancelText = options.cancelText || localize('cancel');
    this.isDanger = options.isDanger || false;

    this.isOpen = true;
    return new Promise((resolve) => {
      this._resolve = resolve;
    });
  }

  close(result) {
    this.isOpen = false;
    if (this._resolve) {
      this._resolve(result);
      this._resolve = null;
    }
  }

  _onCancel() {
    this.close(false);
  }

  _onConfirm() {
    this.close(true);
  }

  render() {
    if (!this.isOpen) return html``;

    return html`
      <div class="modal" @click="${this._onCancel}">
        <div class="modal-content" @click="${(e) => e.stopPropagation()}">
          <div class="modal-title">${this.title}</div>
          <div class="modal-message">${this.message}</div>
          <div class="modal-buttons">
            <button class="cancel-button" @click="${this._onCancel}">
              ${this.cancelText}
            </button>
            <button
              class="confirm-button ${this.isDanger ? 'danger' : ''}"
              @click="${this._onConfirm}"
            >
              ${this.confirmText}
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('confirmation-dialog', ConfirmationDialog);
