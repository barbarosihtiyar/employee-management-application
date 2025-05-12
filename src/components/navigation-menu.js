import {LitElement, html, css} from 'lit';
import {t} from '../i18n/i18n-config.js';
import {navigate} from '../router.js';

export class NavigationMenu extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    nav {
      padding: 16px 0;
    }

    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    li {
      margin-bottom: 4px;
    }

    a {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      text-decoration: none;
      color: var(--text-color);
      font-weight: 500;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;
    }

    a:hover {
      background-color: rgba(255, 102, 0, 0.05);
      color: var(--primary-color);
    }

    a.active {
      background-color: rgba(255, 102, 0, 0.1);
      color: var(--primary-color);
      border-left-color: var(--primary-color);
    }

    .nav-icon {
      margin-right: 10px;
      width: 20px;
      height: 20px;
    }

    .add-button {
      margin: 16px 20px;
      background-color: var(--primary-color);
      color: var(--white);
      border: none;
      padding: 10px;
      border-radius: 4px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: calc(100% - 40px);
      transition: all 0.2s ease;
    }

    .add-button:hover {
      background-color: var(--primary-light);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(255, 102, 0, 0.2);
    }

    @media (max-width: 768px) {
      nav {
        padding: 8px 0;
      }

      .add-button {
        margin: 8px 20px;
      }
    }
  `;

  static properties = {
    currentPath: {type: String},
  };

  constructor() {
    super();
    this.currentPath = window.location.pathname;

    window.addEventListener(
      'vaadin-router-location-changed',
      this._handleRouteChange.bind(this)
    );

    window.addEventListener('language-changed', () => this.requestUpdate());
  }

  _handleRouteChange(event) {
    this.currentPath = event.detail.location.pathname;
  }

  _handleClick(event, path) {
    event.preventDefault();
    navigate(path);
  }

  render() {
    return html`
      <nav>
        <ul>
          <li>
            <a
              href="/employees"
              class="${this.currentPath.startsWith('/employees') &&
              !this.currentPath.includes('/new')
                ? 'active'
                : ''}"
              @click="${(e) => this._handleClick(e, '/employees')}"
            >
              <svg
                class="nav-icon"
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
          </li>
          <li>
            <a
              href="/employees/new"
              class="${this.currentPath.includes('/employees/new')
                ? 'active'
                : ''}"
              @click="${(e) => this._handleClick(e, '/employees/new')}"
            >
              <svg
                class="nav-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              ${t('add_new')}
            </a>
          </li>
        </ul>
      </nav>
    `;
  }
}

customElements.define('navigation-menu', NavigationMenu);
