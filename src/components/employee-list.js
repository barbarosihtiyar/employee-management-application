import {LitElement, html, css} from 'lit';
import {t} from '../i18n/i18n-config.js';
import {navigate} from '../router.js';
import employeeStore from '../store/employee-store.js';
import './confirmation-dialog.js';
import './pagination-controls.js';
import './search-box.js';

export class EmployeeList extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .list-title {
      font-size: 1.75rem;
      color: var(--primary-color);
      font-weight: 500;
    }

    .view-toggle {
      display: flex;
      gap: 8px;
    }

    .view-button {
      padding: 8px 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      border: none;
      background-color: transparent;
      color: var(--primary-color);
    }

    .view-button.active {
      background-color: var(--primary-color);
      color: var(--white);
    }

    .search-container {
      width: 100%;
      margin-bottom: 24px;
    }

    .no-employees {
      background-color: var(--white);
      padding: 40px;
      text-align: center;
      border-radius: 12px;
      box-shadow: var(--shadow);
    }

    /* Table styles */
    .table-container {
      width: 100%;
      overflow-x: auto;
      box-shadow: var(--shadow);
      background-color: var(--white);
      border-radius: 12px;
    }

    table {
      width: 100%;
      min-width: 1200px;
      border-collapse: collapse;
      overflow-x: auto;
      display: block;
    }

    th,
    td {
      padding: 14px 18px;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
    }

    th {
      color: var(--primary-color);
      font-weight: 500;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover {
      background-color: #f9f9f9;
    }

    .actions {
      display: flex;
      gap: 12px;
    }

    .edit-button,
    .delete-button {
      padding: 8px;
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.3s ease;
      color: var(--primary-color);
    }

    .edit-button:hover,
    .delete-button:hover {
      transform: translateY(-4px);
    }

    /* Card list styles */
    .card-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }

    .employee-card {
      background-color: var(--white);
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      padding: 24px;
      transition: all 0.3s ease;
      border-top: 4px solid var(--primary-color);
      position: relative;
      overflow: hidden;
    }

    .employee-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    }

    .employee-card::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      height: 100px;
      background: linear-gradient(
        135deg,
        transparent 70%,
        rgba(255, 102, 0, 0.1) 100%
      );
      border-radius: 0 0 0 100%;
      z-index: 1;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      position: relative;
      z-index: 2;
    }

    .employee-name {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
      color: var(--secondary-color);
    }

    .employee-details {
      margin: 20px 0;
    }

    .detail-row {
      display: flex;
      margin-bottom: 10px;
      align-items: center;
    }

    .detail-label {
      width: 150px;
      font-weight: 500;
      color: var(--secondary-color);
      opacity: 0.8;
    }

    .detail-value {
      flex: 1;
      color: var(--text-color);
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 16px;
      border-top: 1px solid #f0f0f0;
      padding-top: 16px;
    }

    .card-edit-button,
    .card-delete-button {
      padding: 8px 16px;
      background: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .card-edit-button {
      color: var(--primary-color);
      border: 1px solid var(--primary-color);
    }

    .card-edit-button:hover {
      background-color: var(--primary-color);
      color: white;
    }

    .card-delete-button {
      color: var(--danger-color);
      border: 1px solid var(--danger-color);
    }

    .card-delete-button:hover {
      background-color: var(--danger-color);
      color: white;
    }

    .checkbox-column {
      width: 40px;
    }

    @media (max-width: 768px) {
      .list-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .card-list {
        grid-template-columns: 1fr;
      }
    }

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .batch-actions {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .batch-delete-button {
      background-color: var(--danger-color);
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      border: none;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .batch-delete-button:hover {
      background-color: #c82333;
      transform: translateY(-2px);
    }

    .batch-delete-button[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    .pagination-container {
      display: flex;
      justify-content: center;
      margin-top: 24px;
      padding: 10px;
      border-radius: 4px;
    }

    .pagination {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .pagination-button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      background-color: transparent;
      border: none;
      font-weight: 500;
      color: gray;
      transition: all 0.2s ease;
      font-size: 16px;
      font-weight: 600;
    }

    .pagination-button.active {
      background-color: var(--primary-color);
      color: white;
    }

    .pagination-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pagination-nav {
      background-color: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .pagination-nav.prev {
      color: gray;
    }

    .pagination-nav.next {
      color: var(--primary-color);
    }

    .pagination-nav:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pagination-ellipsis {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
    }
  `;

  static properties = {
    employees: {type: Array},
    filteredEmployees: {type: Array},
    displayMode: {type: String},
    currentPage: {type: Number},
    itemsPerPage: {type: Number},
    searchQuery: {type: String},
    selectedEmployees: {type: Array},
    allSelected: {type: Boolean},
    language: {type: String},
  };

  constructor() {
    super();
    this.employees = [];
    this.filteredEmployees = [];
    this.displayMode = 'table'; // 'table' or 'card'
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.searchQuery = '';
    this.selectedEmployees = [];
    this.allSelected = false;
    this.language = document.documentElement.lang || 'en';

    this._handleEmployeeStoreUpdate =
      this._handleEmployeeStoreUpdate.bind(this);

    window.addEventListener(
      'employee-store-updated',
      this._handleEmployeeStoreUpdate
    );

    window.addEventListener('language-changed', (e) => {
      this.language = e.detail.language;
      this.requestUpdate();
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadEmployees();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(
      'employee-store-updated',
      this._handleEmployeeStoreUpdate
    );
  }

  firstUpdated() {
    this.confirmDialog = this.shadowRoot.querySelector('confirmation-dialog');
  }

  _loadEmployees() {
    this.employees = employeeStore.getAllEmployees();
    this._applyFilters();
  }

  _handleEmployeeStoreUpdate() {
    this._loadEmployees();
  }

  _applyFilters() {
    let filtered = this.employees;

    if (this.searchQuery) {
      filtered = employeeStore.searchEmployees(this.searchQuery);
    }

    this.filteredEmployees = filtered;

    this.currentPage = 1;
  }

  _handleSearch(e) {
    this.searchQuery = e.detail.query;
    this._applyFilters();
  }

  _handlePageChange(page) {
    this.currentPage = page;
    this.selectedEmployees = [];
    this.allSelected = false;
  }

  _toggleDisplayMode(mode) {
    this.displayMode = mode;
  }

  _getPaginatedEmployees() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredEmployees.slice(start, end);
  }

  _getTotalPages() {
    return Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
  }

  _handleEdit(employee) {
    navigate(`/employees/${employee.id}/edit`);
  }

  async _handleDelete(employee) {
    const confirmed = await this.confirmDialog.open({
      title: t('are_you_sure'),
      message: `${t('confirm_delete').replace(
        '{name}',
        employee.firstName + ' ' + employee.lastName
      )}`,
      confirmText: t('proceed'),
      cancelText: t('cancel'),
      isDanger: true,
    });

    if (confirmed) {
      employeeStore.deleteEmployee(employee.id);
    }
  }

  _formatDate(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  _toggleAllSelected(e) {
    const isSelected = e.target.checked;
    this.allSelected = isSelected;

    if (isSelected) {
      const currentPageEmployees = this._getPaginatedEmployees();
      this.selectedEmployees = currentPageEmployees.map((emp) => emp.id);
    } else {
      this.selectedEmployees = [];
    }
  }

  _toggleEmployeeSelection(e, employeeId) {
    const isSelected = e.target.checked;

    if (isSelected) {
      this.selectedEmployees = [...this.selectedEmployees, employeeId];
    } else {
      this.selectedEmployees = this.selectedEmployees.filter(
        (id) => id !== employeeId
      );
      this.allSelected = false;
    }

    const currentPageEmployees = this._getPaginatedEmployees();
    this.allSelected = currentPageEmployees.every((emp) =>
      this.selectedEmployees.includes(emp.id)
    );
  }

  _handlePageSizeChange(e) {
    this.itemsPerPage = parseInt(e.target.value, 10);
    this.currentPage = 1;
  }

  async _confirmBatchDelete() {
    if (this.selectedEmployees.length === 0) return;

    const confirmed = await this.confirmDialog.open({
      title: t('are_you_sure'),
      message: t('confirm_batch_delete').replace(
        '{count}',
        this.selectedEmployees.length
      ),
      confirmText: t('proceed'),
      cancelText: t('cancel'),
      isDanger: true,
    });

    if (confirmed) {
      for (const id of this.selectedEmployees) {
        employeeStore.deleteEmployee(id);
      }

      this.selectedEmployees = [];
      this.allSelected = false;
    }
  }

  _isEmployeeSelected(employeeId) {
    return this.selectedEmployees.includes(employeeId);
  }

  _renderPagination() {
    const totalPages = this._getTotalPages();
    if (totalPages <= 1) return html``;

    const pages = [];
    const currentPage = this.currentPage;

    pages.push(html`
      <button
        class="pagination-button ${currentPage === 1 ? 'active' : ''}"
        @click="${() => this._handlePageChange(1)}"
      >
        1
      </button>
    `);

    if (currentPage > 3) {
      pages.push(html`<span class="pagination-ellipsis">...</span>`);
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i <= totalPages - 1 && i > 1) {
        pages.push(html`
          <button
            class="pagination-button ${currentPage === i ? 'active' : ''}"
            @click="${() => this._handlePageChange(i)}"
          >
            ${i}
          </button>
        `);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push(html`<span class="pagination-ellipsis">...</span>`);
    }

    if (totalPages > 1) {
      pages.push(html`
        <button
          class="pagination-button ${currentPage === totalPages
            ? 'active'
            : ''}"
          @click="${() => this._handlePageChange(totalPages)}"
        >
          ${totalPages}
        </button>
      `);
    }

    return html`
      <div class="pagination-container">
        <div class="pagination">
          <button
            class="pagination-nav prev"
            ?disabled="${currentPage === 1}"
            @click="${() =>
              this._handlePageChange(Math.max(1, currentPage - 1))}"
          >
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
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          ${pages}

          <button
            class="pagination-nav next"
            ?disabled="${currentPage === totalPages}"
            @click="${() =>
              this._handlePageChange(Math.min(totalPages, currentPage + 1))}"
          >
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
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  _renderTableView() {
    const paginatedEmployees = this._getPaginatedEmployees();

    if (paginatedEmployees.length === 0) {
      return html` <div class="no-employees">${t('no_employees')}</div> `;
    }

    return html`
      <div class="toolbar">
        <div class="batch-actions">
          <button
            class="batch-delete-button"
            ?disabled="${this.selectedEmployees.length === 0}"
            @click="${this._confirmBatchDelete}"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Zm2.5-.5a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 1 0V6a.5.5 0 0 0-.5-.5Z"
              />
              <path
                d="M14 3.5V4h-1v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4H2v-.5A1.5 1.5 0 0 1 3.5 2H5V1.5A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5V2h1.5A1.5 1.5 0 0 1 14 3.5Zm-8.5-2A.5.5 0 0 0 5 2v1h6V2a.5.5 0 0 0-.5-.5h-3Z"
              />
            </svg>
            ${this.language === 'tr' ? 'Seçilenleri Sil' : 'Delete Selected'}
            (${this.selectedEmployees.length})
          </button>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th class="checkbox-column">
                <input
                  type="checkbox"
                  .checked=${this.allSelected}
                  @change=${this._toggleAllSelected}
                />
              </th>
              <th>${t('first_name')}</th>
              <th>${t('last_name')}</th>
              <th>${t('date_of_employment')}</th>
              <th>${t('date_of_birth')}</th>
              <th>${t('phone')}</th>
              <th>${t('email')}</th>
              <th>${t('department')}</th>
              <th>${t('position')}</th>
              <th>${t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            ${paginatedEmployees.map(
              (employee) => html`
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      .checked=${this._isEmployeeSelected(employee.id)}
                      @change=${(e) =>
                        this._toggleEmployeeSelection(e, employee.id)}
                    />
                  </td>
                  <td>${employee.firstName}</td>
                  <td>${employee.lastName}</td>
                  <td>${this._formatDate(employee.dateOfEmployment)}</td>
                  <td>${this._formatDate(employee.dateOfBirth)}</td>
                  <td>${employee.phone}</td>
                  <td>${employee.email}</td>
                  <td>${t(employee.department.toLowerCase())}</td>
                  <td>${t(employee.position.toLowerCase())}</td>
                  <td>
                    <div class="actions">
                      <button
                        class="edit-button"
                        @click="${() => this._handleEdit(employee)}"
                        title="${t('edit_employee')}"
                        ?disabled=${this.selectedEmployees.length > 1}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path
                            d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"
                          />
                          <path
                            fill-rule="evenodd"
                            d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                          />
                        </svg>
                      </button>
                      <button
                        class="delete-button"
                        @click="${() => this._handleDelete(employee)}"
                        title="${t('delete')}"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path
                            d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Zm2.5-.5a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 1 0V6a.5.5 0 0 0-.5-.5Z"
                          />
                          <path
                            d="M14 3.5V4h-1v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4H2v-.5A1.5 1.5 0 0 1 3.5 2H5V1.5A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5V2h1.5A1.5 1.5 0 0 1 14 3.5Zm-8.5-2A.5.5 0 0 0 5 2v1h6V2a.5.5 0 0 0-.5-.5h-3Z"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>

      ${this._renderPagination()}
    `;
  }

  _renderCardView() {
    const employees = this._getPaginatedEmployees();

    if (employees.length === 0) {
      return html` <div class="no-employees">${t('no_employees_found')}</div> `;
    }

    return html`
      <div class="card-list">
        ${employees.map(
          (employee) => html`
            <div class="employee-card">
              <div class="card-header">
                <h3 class="employee-name">
                  ${employee.firstName} ${employee.lastName}
                </h3>
              </div>
              <div class="employee-details">
                <div class="detail-row">
                  <div class="detail-label">${t('date_of_employment')}:</div>
                  <div class="detail-value">
                    ${this._formatDate(employee.dateOfEmployment)}
                  </div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">${t('date_of_birth')}:</div>
                  <div class="detail-value">
                    ${this._formatDate(employee.dateOfBirth)}
                  </div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">${t('phone')}:</div>
                  <div class="detail-value">${employee.phone}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">${t('email')}:</div>
                  <div class="detail-value">${employee.email}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">${t('department')}:</div>
                  <div class="detail-value">${employee.department}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">${t('position')}:</div>
                  <div class="detail-value">${employee.position}</div>
                </div>
              </div>
              <div class="card-actions">
                <button
                  class="card-edit-button"
                  @click="${() => this._handleEdit(employee)}"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"
                    />
                  </svg>
                  ${t('edit')}
                </button>
                <button
                  class="card-delete-button"
                  @click="${() => this._handleDelete(employee)}"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                    />
                  </svg>
                  ${t('delete')}
                </button>
              </div>
            </div>
          `
        )}
      </div>
      ${this._renderPagination()}
    `;
  }

  render() {
    return html`
      <div class="list-header">
        <div class="list-title">${t('employee_list')}</div>

        <div class="view-toggle">
          <button
            class="view-button ${this.displayMode === 'table' ? 'active' : ''}"
            @click="${() => this._toggleDisplayMode('table')}"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </button>

          <button
            class="view-button ${this.displayMode === 'card' ? 'active' : ''}"
            @click="${() => this._toggleDisplayMode('card')}"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </button>
        </div>
      </div>

      <div class="search-container">
        <search-box @search="${this._handleSearch}"></search-box>
      </div>

      ${this.displayMode === 'table'
        ? this._renderTableView()
        : this._renderCardView()}

      <confirmation-dialog></confirmation-dialog>
    `;
  }
}

customElements.define('employee-list', EmployeeList);
