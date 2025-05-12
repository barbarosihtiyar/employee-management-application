import {LitElement, html, css} from 'lit';
import {getCurrentLanguage, changeLanguage} from '../i18n/i18n-config.js';

export class LanguageSelector extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .dropdown {
      position: relative;
      width: 30px;
      height: 30px;
      user-select: none;
    }

    .selected {
      width: 30px;
      height: 30px;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .selected:hover {
      transform: translateY(-1px);
    }

    .selected img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 6px;
      display: block;
    }

    .dropdown-list {
      position: absolute;
      top: calc(100% + 10px);
      left: 50%;
      transform: translateX(-50%);
      min-width: 90px;
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
      padding: 8px;
      display: none;
      flex-direction: column;
      gap: 6px;
      z-index: 999;
      animation: fadeIn 0.2s ease-out;
      border: 1px solid rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translate(-50%, -5px);
      }
      to {
        opacity: 1;
        transform: translate(-50%, 0);
      }
    }

    .dropdown.open .dropdown-list {
      display: flex;
    }

    .dropdown-list::before {
      content: '';
      position: absolute;
      top: -6px;
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
      width: 12px;
      height: 12px;
      background-color: white;
      border-top: 1px solid rgba(0, 0, 0, 0.05);
      border-left: 1px solid rgba(0, 0, 0, 0.05);
    }

    .dropdown-item {
      width: 100%;
      height: 36px;
      padding: 0 12px;
      background-color: white;
      border-radius: 8px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      color: #333;
      font-size: 14px;
    }

    .dropdown-item:hover {
      background-color: #f5f5f5;
      transform: translateX(2px);
    }

    .dropdown-item:active {
      transform: scale(0.98);
    }

    .dropdown-item img {
      width: 24px;
      height: 24px;
      object-fit: cover;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  `;

  static properties = {
    language: {type: String},
    dropdownOpen: {type: Boolean},
  };

  constructor() {
    super();
    this.language = getCurrentLanguage();
    this.dropdownOpen = false;
    this.languageChangedHandler = this._handleLanguageChanged.bind(this);
    window.addEventListener('language-changed', this.languageChangedHandler);

    this._onDocumentClick = this._onDocumentClick.bind(this);
    document.addEventListener('click', this._onDocumentClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('language-changed', this.languageChangedHandler);
    document.removeEventListener('click', this._onDocumentClick);
  }

  _handleLanguageChanged(event) {
    this.language = event.detail.language;
  }

  _toggleDropdown(e) {
    e.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  _onDocumentClick(e) {
    const path = e.composedPath();
    const inDropdown = path.some(
      (el) => el === this.shadowRoot?.querySelector('.dropdown')
    );
    if (!inDropdown && this.dropdownOpen) {
      this.dropdownOpen = false;
    }
  }

  _selectLanguage(lang, e) {
    e.stopPropagation();
    changeLanguage(lang);
    this.dropdownOpen = false;
  }

  render() {
    return html`
      <div class="dropdown ${this.dropdownOpen ? 'open' : ''}">
        <div class="selected" @click="${this._toggleDropdown}">
          <img
            src="../../public/images/${this.language}.svg"
            alt="${this.language}"
          />
        </div>
        <div class="dropdown-list">
          <div
            class="dropdown-item"
            @click="${(e) => this._selectLanguage('tr', e)}"
          >
            <img src="../../public/images/tr.svg" alt="TR" />
            <span>TR</span>
          </div>
          <div
            class="dropdown-item"
            @click="${(e) => this._selectLanguage('en', e)}"
          >
            <img src="../../public/images/en.svg" alt="EN" />
            <span>EN</span>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('language-selector', LanguageSelector);
