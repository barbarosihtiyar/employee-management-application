import {LitElement, html, css} from 'lit';
import {t} from '../i18n/i18n-config.js';

export class PaginationControls extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin: 20px 0;
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .page-info {
      margin: 0 16px;
      color: var(--text-color);
    }

    button {
      background-color: var(--white);
      border: 1px solid var(--border-color);
      color: var(--text-color);
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
    }

    button:hover:not(:disabled) {
      background-color: var(--light-gray);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-button {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }

    .page-button.active {
      background-color: var(--primary-color);
      color: var(--white);
      border-color: var(--primary-color);
    }

    @media (max-width: 768px) {
      .pagination {
        flex-wrap: wrap;
      }

      .page-numbers {
        display: flex;
        gap: 4px;
        margin: 8px 0;
      }
    }
  `;

  static properties = {
    currentPage: {type: Number},
    totalPages: {type: Number},
    visiblePageCount: {type: Number},
  };

  constructor() {
    super();
    this.currentPage = 1;
    this.totalPages = 1;
    this.visiblePageCount = 5;

    window.addEventListener('language-changed', () => this.requestUpdate());
  }

  _onPageChange(page) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    const event = new CustomEvent('page-change', {
      detail: {page},
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(event);
  }

  _getVisiblePages() {
    const pages = [];
    let startPage = Math.max(
      1,
      this.currentPage - Math.floor(this.visiblePageCount / 2)
    );
    let endPage = Math.min(
      this.totalPages,
      startPage + this.visiblePageCount - 1
    );

    if (endPage - startPage + 1 < this.visiblePageCount) {
      startPage = Math.max(1, endPage - this.visiblePageCount + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  render() {
    if (this.totalPages <= 1) return html``;

    const visiblePages = this._getVisiblePages();

    return html`
      <div class="pagination">
        <button
          ?disabled="${this.currentPage === 1}"
          @click="${() => this._onPageChange(this.currentPage - 1)}"
        >
          ${t('prev')}
        </button>

        <div class="page-info">
          ${t('page_of', {
            current: this.currentPage,
            total: this.totalPages,
          })}
        </div>

        <div class="page-numbers">
          ${visiblePages.map(
            (page) => html`
              <button
                class="page-button ${page === this.currentPage ? 'active' : ''}"
                @click="${() => this._onPageChange(page)}"
              >
                ${page}
              </button>
            `
          )}
        </div>

        <button
          ?disabled="${this.currentPage === this.totalPages}"
          @click="${() => this._onPageChange(this.currentPage + 1)}"
        >
          ${t('next')}
        </button>
      </div>
    `;
  }
}

customElements.define('pagination-controls', PaginationControls);
