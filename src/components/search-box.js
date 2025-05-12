import {LitElement, html, css} from 'lit';
import {t} from '../i18n/i18n-config.js';

export class SearchBox extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin-bottom: 16px;
    }

    .search-container {
      display: flex;
      align-items: center;
      position: relative;
    }

    input {
      padding: 10px 16px;
      padding-left: 40px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      font-size: 14px;
      width: 100%;
      background-color: var(--white);
    }

    input:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(255, 102, 0, 0.2);
    }

    .search-icon {
      position: absolute;
      left: 12px;
      color: var(--text-color);
      width: 20px;
      height: 20px;
      opacity: 0.5;
    }

    .clear-button {
      position: absolute;
      right: 12px;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-color);
      opacity: 0.5;
      padding: 0;
    }

    .clear-button:hover {
      opacity: 0.8;
    }
  `;

  static properties = {
    value: {type: String},
    placeholder: {type: String},
  };

  constructor() {
    super();
    this.value = '';
    this.placeholder = t('search');

    this._debounceTimer = null;
    this._debounceTime = 300;

    window.addEventListener('language-changed', () => {
      this.placeholder = t('search');
      this.requestUpdate();
    });
  }

  _handleInput(e) {
    this.value = e.target.value;

    clearTimeout(this._debounceTimer);

    this._debounceTimer = setTimeout(() => {
      this._dispatchSearchEvent();
    }, this._debounceTime);
  }

  _handleClear() {
    this.value = '';
    this.shadowRoot.querySelector('input').focus();
    this._dispatchSearchEvent();
  }

  _dispatchSearchEvent() {
    const event = new CustomEvent('search', {
      detail: {query: this.value},
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(event);
  }

  render() {
    return html`
      <div
        class="search-container"
        style="display: flex; align-items: center; position: relative;"
      >
        <svg
          style="position: absolute; left: 12px; color: var(--text-color); width: 20px; height: 20px; opacity: 0.5;"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          .value="${this.value}"
          placeholder="${this.placeholder}"
          @input="${this._handleInput}"
          style="padding: 10px 16px; padding-left: 40px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 14px; width: 100%; background-color: var(--white);"
        />
        ${this.value
          ? html`
              <button
                class="clear-button"
                @click="${this._handleClear}"
                style="position: absolute; right: 12px; background: none; border: none; cursor: pointer; color: var(--text-color); opacity: 0.5; padding: 0;"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            `
          : ''}
      </div>
    `;
  }
}

customElements.define('search-box', SearchBox);
