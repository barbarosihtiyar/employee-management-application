import {LitElement, html, css} from 'lit';
import {navigate} from '../router.js';
import {t} from '../i18n/i18n-config.js';

export class NotFoundView extends LitElement {
  static styles = css`
    :host {
      display: block;
      text-align: center;
      padding: 40px 20px;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: var(--white);
      border-radius: 8px;
      box-shadow: var(--shadow);
      padding: 32px;
    }

    h1 {
      font-size: 3rem;
      margin-bottom: 16px;
      color: var(--primary-color);
    }

    p {
      font-size: 1.2rem;
      margin-bottom: 24px;
      color: var(--text-color);
    }

    button {
      background-color: var(--primary-color);
      color: var(--white);
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    button:hover {
      background-color: var(--primary-light);
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._handleLanguageChange = this._handleLanguageChange.bind(this);
    window.addEventListener('language-changed', this._handleLanguageChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('language-changed', this._handleLanguageChange);
  }

  _handleLanguageChange() {
    this.requestUpdate();
  }

  render() {
    return html`
      <div class="container">
        <h1>404</h1>
        <p>${t('page_not_found')}</p>
        <button @click="${() => navigate('/employees')}">
          ${t('back_to_home')}
        </button>
      </div>
    `;
  }
}

customElements.define('not-found-view', NotFoundView);
