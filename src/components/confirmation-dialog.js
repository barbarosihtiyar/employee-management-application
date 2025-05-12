import {LitElement, html, css} from 'lit';
import {t} from '../i18n/i18n-config.js';

export class ConfirmationDialog extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideIn {
      from {
        transform: translateY(-30px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
      animation: fadeIn 0.3s ease;
      backdrop-filter: blur(3px);
    }

    .modal-content {
      background-color: var(--white);
      border-radius: 4px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      padding: 20px;
      max-width: 450px;
      width: 90%;
      animation: slideIn 0.3s ease;
      border: 1px solid rgba(0, 0, 0, 0.05);
      position: relative;
      overflow: hidden;
    }

    .close-button {
      position: absolute;
      right: 15px;
      top: 15px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--primary-color);
      transition: all 0.2s ease;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 25px;
      z-index: 10;
      min-width: auto;
    }

    .modal-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 16px;
      color: var(--primary-color);
    }

    .modal-message {
      margin-bottom: 30px;
      color: var(--text-color);
      font-size: 1.05rem;
      line-height: 1.5;
    }

    .modal-buttons {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 8px;
    }

    button {
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      font-size: 1rem;
      min-width: 110px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .cancel-button {
      color: var(--secondary-color);
      border: 1px solid blue;
      background-color: transparent;
    }

    .cancel-button:hover {
      background-color: #e8e8e8;
      transform: translateY(-2px);
    }

    .confirm-button {
      background-color: var(--primary-color);
      color: var(--white);
      box-shadow: 0 4px 12px rgba(255, 102, 0, 0.25);
    }

    .confirm-button:hover {
      background-color: var(--primary-light);
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(255, 102, 0, 0.3);
    }

    .confirm-button.danger {
      background-color: var(--danger-color);
      box-shadow: 0 4px 12px rgba(220, 53, 69, 0.25);
    }

    .confirm-button.danger:hover {
      background-color: #e02a3f;
      box-shadow: 0 6px 15px rgba(220, 53, 69, 0.3);
    }

    @media (max-width: 480px) {
      .modal-content {
        padding: 24px;
      }

      .modal-buttons {
        flex-direction: column-reverse;
      }

      button {
        width: 100%;
      }
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
    this.confirmText = t('proceed');
    this.cancelText = t('cancel');
    this.isDanger = false;

    window.addEventListener('language-changed', () => {
      this.cancelText = t('cancel');
      this.confirmText = t('proceed');
      this.requestUpdate();
    });
  }

  open(options = {}) {
    this.title = options.title || t('are_you_sure');
    this.message = options.message || '';
    this.confirmText = options.confirmText || t('proceed');
    this.cancelText = options.cancelText || t('cancel');
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
        <div
          class="modal-content ${this.isDanger ? 'danger' : ''}"
          @click="${(e) => e.stopPropagation()}"
        >
          <button class="close-button" @click="${this._onCancel}">✕</button>
          <div class="modal-title">${this.title}</div>
          <div class="modal-message">${this.message}</div>
          <div class="modal-buttons">
            <button class="confirm-button " @click="${this._onConfirm}">
              ${this.confirmText}
            </button>
            <button class="cancel-button" @click="${this._onCancel}">
              ${this.cancelText}
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('confirmation-dialog', ConfirmationDialog);
