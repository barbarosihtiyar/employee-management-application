import {LitElement, html, css} from 'lit';
import {initRouter} from '../router.js';
import {localize, setLanguage, getCurrentLanguage} from '../locales/index.js';
import './navigation-menu.js';

export class AppShell extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background-color: var(--light-gray);
    }

    header {
      background-color: var(--white);
      box-shadow: var(--shadow);
      padding: 12px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .app-title {
      color: var(--primary-color);
      font-weight: 600;
      font-size: 1.25rem;
    }

    .language-selector {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .language-button {
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      background: none;
      border: 1px solid var(--border-color);
    }

    .language-button.active {
      background-color: var(--primary-color);
      color: var(--white);
      border-color: var(--primary-color);
    }

    main {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      main {
        padding: 16px;
      }
    }
  `;

  static properties = {
    language: {type: String},
  };

  constructor() {
    super();
    this.language = getCurrentLanguage();

    // Listen for language change events
    this.languageChangedHandler = this._handleLanguageChanged.bind(this);
    window.addEventListener('language-changed', this.languageChangedHandler);
  }

  connectedCallback() {
    super.connectedCallback();
    // Initialize router when component is connected
    initRouter(this.shadowRoot.querySelector('#outlet') || this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('language-changed', this.languageChangedHandler);
  }

  _handleLanguageChanged(event) {
    this.language = event.detail.language;
  }

  _changeLanguage(lang) {
    setLanguage(lang);
  }

  render() {
    return html`
      <header>
        <div class="app-title">${localize('app_title')}</div>
        <div class="language-selector">
          <button
            class="language-button ${this.language === 'en' ? 'active' : ''}"
            @click="${() => this._changeLanguage('en')}"
          >
            EN
          </button>
          <button
            class="language-button ${this.language === 'tr' ? 'active' : ''}"
            @click="${() => this._changeLanguage('tr')}"
          >
            TR
          </button>
        </div>
      </header>

      <navigation-menu></navigation-menu>

      <main id="outlet">
        <!-- Router outlet -->
      </main>
    `;
  }
}

customElements.define('app-shell', AppShell);
