import {LitElement, html, css} from 'lit';
import {t, getCurrentLanguage, changeLanguage} from '../i18n/i18n-config.js';
import {initRouter, navigate} from '../router.js';
import './language-selector.js';

export class AppShell extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
    }

    header {
      display: flex;
      align-items: center;
      padding: 0 var(--spacing-lg);
      margin: 24px 24px 10px 24px;
      height: var(--header-height);
      background-color: var(--white);
      box-shadow: var(--shadow);
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      position: sticky;
      top: 0;
      z-index: var(--z-index-header);

      @media (max-width: 992px) {
        max-width: var(--container-width);
        padding: 0 4px;
      }
      @media (max-width: 480px) {
        margin: 0;
      }
    }

    .app-title {
      font-size: var(--font-size-xl);
      font-weight: 700;
      color: var(--secondary-color);
      cursor: pointer;
      transition: color var(--transition-fast);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .app-title:hover {
      opacity: 0.8;
    }

    .app-title img {
      height: 30px;
      width: auto;
    }

    .nav-links {
      display: flex;
      align-items: center;
      margin-left: auto;
      margin-right: 24px;
      gap: 8px;
    }

    .nav-link {
      padding: 8px;
      color: var(--primary-color);
      font-weight: 500;
      text-decoration: none;
      border-radius: 4px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .nav-link:hover {
      transform: translateY(-2px);
    }

    .add-icon,
    .employees-icon {
      width: 16px;
      height: 16px;
    }

    language-selector {
      margin-left: 0;
    }

    main {
      flex: 1;
      padding: var(--spacing-xl);
      background-color: var(--background-light);
      min-height: calc(100vh - var(--header-height));
      margin: 0 auto;
      max-width: var(--container-width);
    }

    .hamburger-menu {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      width: 30px;
      height: 22px;
      cursor: pointer;
      margin-left: auto;
    }

    .hamburger-menu span {
      height: 3px;
      width: 100%;
      background-color: var(--primary-color);
      border-radius: 2px;
      transition: transform 0.3s ease;
    }

    /* Sidebar stilleri */
    .overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: var(--z-index-modal);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .overlay.active {
      display: block;
      opacity: 1;
    }

    .sidebar {
      position: fixed;
      top: 0;
      right: -500px;
      width: 300px;
      height: 100vh;
      background-color: var(--white);
      box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
      z-index: calc(var(--z-index-modal) + 1);
      transition: right 0.3s ease;
      padding: 20px;
      overflow-y: auto;
    }

    .sidebar.active {
      right: 0;
    }

    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
      margin-bottom: 20px;
    }

    .sidebar-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--secondary-color);
    }

    .close-button {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--secondary-color);
      font-size: 24px;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.2s ease;
    }

    .close-button:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 30px;
    }

    .sidebar-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      text-decoration: none;
      color: var(--primary-color);
      font-weight: 500;
      border-radius: 8px;
      transition: background-color 0.2s ease;
    }

    .sidebar-link:hover {
      background-color: #f5f5f5;
    }

    .sidebar-link.active {
      background-color: var(--primary-color);
      color: white;
    }

    .sidebar-link svg {
      width: 20px;
      height: 20px;
    }

    .sidebar-footer {
      margin-top: auto;
      padding-top: 20px;
      border-top: 1px solid #eee;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .language-label {
      font-weight: 500;
      font-size: 14px;
      margin-bottom: 8px;
      color: var(--text-color);
    }

    .language-options {
      display: flex;
      gap: 10px;
    }

    .language-option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      cursor: pointer;
      background-color: #f5f5f5;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .language-option:hover {
      background-color: #eaeaea;
    }

    .language-option.active {
      background-color: var(--primary-color);
      color: white;
    }

    .language-option img {
      width: 24px;
      height: 24px;
      border-radius: 4px;
    }

    /* Mobil görünüm */
    @media (max-width: 480px) {
      header {
        padding: 0 var(--spacing-sm);
      }

      .app-title {
        font-size: 1.2rem;
      }

      .nav-links {
        display: none;
      }

      .hamburger-menu {
        display: flex;
      }

      main {
        padding: var(--spacing-sm);
      }

      language-selector {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 280px;
      }
    }
  `;

  static properties = {
    language: {type: String},
    currentPath: {type: String},
    mobileMenuOpen: {type: Boolean},
    sidebarOpen: {type: Boolean},
  };

  constructor() {
    super();
    this.language = getCurrentLanguage();
    this.currentPath = window.location.pathname;
    this.mobileMenuOpen = false;
    this.sidebarOpen = false;

    this.languageChangedHandler = this._handleLanguageChanged.bind(this);
    window.addEventListener('language-changed', this.languageChangedHandler);

    window.addEventListener(
      'vaadin-router-location-changed',
      this._handleRouteChange.bind(this)
    );
  }

  firstUpdated() {
    initRouter(this.shadowRoot.querySelector('main'));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('language-changed', this.languageChangedHandler);
    window.removeEventListener(
      'vaadin-router-location-changed',
      this._handleRouteChange
    );
  }

  _handleLanguageChanged(event) {
    this.language = event.detail.language;
  }

  _handleRouteChange(event) {
    this.currentPath = event.detail.location.pathname;
    this.mobileMenuOpen = false;
    this.sidebarOpen = false;
  }

  _navigateToHome(e) {
    e.preventDefault();
    navigate('/employees');
  }

  _handleClick(event, path) {
    event.preventDefault();
    navigate(path);
  }

  _toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    if (this.sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  _closeSidebar() {
    this.sidebarOpen = false;
    document.body.style.overflow = '';
  }

  render() {
    return html`
      <header>
        <div class="app-title" @click="${this._navigateToHome}">
          <img src="../../public/images/ing.png" alt="logo" />
          ING
        </div>
        <div class="nav-links">
          <a
            href="/employees"
            class="nav-link ${this.currentPath.startsWith('/employees') &&
            !this.currentPath.includes('/new')
              ? 'active'
              : ''}"
            @click="${(e) => this._handleClick(e, '/employees')}"
          >
            <svg
              class="employees-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            ${t('employees')}
          </a>
          <a
            href="/employees/new"
            class="nav-link ${this.currentPath.includes('/employees/new')
              ? 'active'
              : ''}"
            @click="${(e) => this._handleClick(e, '/employees/new')}"
          >
            <svg
              class="add-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            ${t('add_new')}
          </a>
        </div>
        <div class="hamburger-menu" @click="${this._toggleSidebar}">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <language-selector></language-selector>
      </header>

      <!-- Overlay -->
      <div
        class="overlay ${this.sidebarOpen ? 'active' : ''}"
        @click="${this._closeSidebar}"
      ></div>

      <!-- Sidebar -->
      <div class="sidebar ${this.sidebarOpen ? 'active' : ''}">
        <div class="sidebar-header">
          <div class="sidebar-title">Menü</div>
          <button class="close-button" @click="${this._closeSidebar}">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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
        </div>

        <div class="sidebar-nav">
          <a
            href="/employees"
            class="sidebar-link ${this.currentPath.startsWith('/employees') &&
            !this.currentPath.includes('/new')
              ? 'active'
              : ''}"
            @click="${(e) => this._handleClick(e, '/employees')}"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            ${t('employees')}
          </a>
          <a
            href="/employees/new"
            class="sidebar-link ${this.currentPath.includes('/employees/new')
              ? 'active'
              : ''}"
            @click="${(e) => this._handleClick(e, '/employees/new')}"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            ${t('add_new')}
          </a>
        </div>

        <div class="sidebar-footer">
          <div>
            <div class="language-label">${t('language')}</div>
            <div class="language-options">
              <div
                class="language-option ${this.language === 'tr'
                  ? 'active'
                  : ''}"
                @click="${() => {
                  changeLanguage('tr');
                }}"
              >
                <img src="../../public/images/tr.svg" alt="TR" />
                <span>TR</span>
              </div>
              <div
                class="language-option ${this.language === 'en'
                  ? 'active'
                  : ''}"
                @click="${() => {
                  changeLanguage('en');
                }}"
              >
                <img src="../../public/images/en.svg" alt="EN" />
                <span>EN</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main></main>
    `;
  }
}

customElements.define('app-shell', AppShell);
