import {LitElement, html, css} from 'lit';
import {localize} from '../locales/index.js';
import {navigate} from '../router.js';

export class NavigationMenu extends LitElement {
  static styles = css`
    :host {
      display: block;
      background-color: var(--white);
      box-shadow: var(--shadow);
      margin-bottom: 24px;
    }

    nav {
      display: flex;
      align-items: center;
      padding: 0 20px;
    }

    ul {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    li {
      margin-right: 24px;
    }

    a {
      display: block;
      padding: 16px 0;
      text-decoration: none;
      color: var(--text-color);
      font-weight: 500;
      position: relative;
      border-bottom: 2px solid transparent;
      transition: all 0.2s ease;
    }

    a:hover,
    a.active {
      color: var(--primary-color);
    }

    a.active {
      border-bottom-color: var(--primary-color);
    }

    .add-button {
      margin-left: auto;
      background-color: var(--primary-color);
      color: var(--white);
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      font-weight: 500;
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .add-button:hover {
      background-color: var(--primary-light);
    }

    @media (max-width: 768px) {
      nav {
        flex-direction: column;
        align-items: stretch;
        padding: 12px;
      }

      ul {
        flex-direction: column;
      }

      li {
        margin-right: 0;
        margin-bottom: 4px;
      }

      a {
        padding: 12px 0;
      }

      .add-button {
        margin: 12px 0 0 0;
        justify-content: center;
      }
    }
  `;

  static properties = {
    currentPath: {type: String},
  };

  constructor() {
    super();
    this.currentPath = window.location.pathname;

    // Listen for route changes
    window.addEventListener(
      'vaadin-router-location-changed',
      this._handleRouteChange.bind(this)
    );

    // Listen for language changes
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
              class="${this.currentPath.startsWith('/employees')
                ? 'active'
                : ''}"
              @click="${(e) => this._handleClick(e, '/employees')}"
            >
              ${localize('employees')}
            </a>
          </li>
        </ul>

        <button class="add-button" @click="${() => navigate('/employees/new')}">
          ${localize('add_new')}
        </button>
      </nav>
    `;
  }
}

customElements.define('navigation-menu', NavigationMenu);
