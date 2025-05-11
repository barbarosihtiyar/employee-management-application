import {LitElement, html, css} from 'lit';
import {localize} from '../locales/index.js';
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
      margin-bottom: 20px;
    }

    .list-title {
      font-size: 1.5rem;
      color: var(--primary-color);
      font-weight: 600;
    }

    .view-toggle {
      display: flex;
      gap: 8px;
    }

    .view-button {
      padding: 6px 12px;
      background-color: var(--white);
      border: 1px solid var(--border-color);
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .view-button.active {
      background-color: var(--primary-color);
      color: var(--white);
      border-color: var(--primary-color);
    }

    .no-employees {
      background-color: var(--white);
      padding: 40px;
      text-align: center;
      border-radius: 8px;
      box-shadow: var(--shadow);
    }

    /* Table styles */
    table {
      width: 100%;
      border-collapse: collapse;
      box-shadow: var(--shadow);
      background-color: var(--white);
      border-radius: 8px;
      overflow: hidden;
    }

    th,
    td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
    }

    th {
      background-color: var(--primary-color);
      color: var(--white);
      font-weight: 500;
    }

    tr:last-child td {
      border-bottom: none;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .edit-button,
    .delete-button {
      padding: 4px;
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .edit-button {
      color: var(--primary-color);
    }

    .delete-button {
      color: var(--danger-color);
    }

    /* Card list styles */
    .card-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .employee-card {
      background-color: var(--white);
      border-radius: 8px;
      box-shadow: var(--shadow);
      padding: 20px;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .employee-name {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0;
    }

    .employee-details {
      margin: 16px 0;
    }

    .detail-row {
      display: flex;
      margin-bottom: 6px;
    }

    .detail-label {
      width: 140px;
      font-weight: 500;
      color: var(--secondary-color);
    }

    .detail-value {
      flex: 1;
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

      table {
        display: block;
        overflow-x: auto;
      }

      .card-list {
        grid-template-columns: 1fr;
      }
    }
  `;

  static properties = {
    employees: {type: Array},
    filteredEmployees: {type: Array},
    displayMode: {type: String},
    currentPage: {type: Number},
    itemsPerPage: {type: Number},
    searchQuery: {type: String},
  };

  constructor() {
    super();
    this.employees = [];
    this.filteredEmployees = [];
    this.displayMode = 'table'; // 'table' or 'card'
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.searchQuery = '';

    // Bind event handlers
    this._handleEmployeeStoreUpdate =
      this._handleEmployeeStoreUpdate.bind(this);

    // Listen for store updates
    window.addEventListener(
      'employee-store-updated',
      this._handleEmployeeStoreUpdate
    );

    // Listen for language changes
    window.addEventListener('language-changed', () => this.requestUpdate());
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
    // Get reference to the confirmation dialog
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

    // Apply search filter
    if (this.searchQuery) {
      filtered = employeeStore.searchEmployees(this.searchQuery);
    }

    this.filteredEmployees = filtered;

    // Reset to first page when filters change
    this.currentPage = 1;
  }

  _handleSearch(e) {
    this.searchQuery = e.detail.query;
    this._applyFilters();
  }

  _handlePageChange(e) {
    this.currentPage = e.detail.page;
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
    // Show confirmation dialog
    const confirmed = await this.confirmDialog.open({
      title: localize('are_you_sure'),
      message: localize('confirm_delete', {
        name: `${employee.firstName} ${employee.lastName}`,
      }),
      confirmText: localize('proceed'),
      cancelText: localize('cancel'),
      isDanger: true,
    });

    if (confirmed) {
      employeeStore.deleteEmployee(employee.id);
    }
  }

  _formatDate(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  _renderTableView() {
    const paginatedEmployees = this._getPaginatedEmployees();

    if (paginatedEmployees.length === 0) {
      return html`
        <div class="no-employees">${localize('no_employees')}</div>
      `;
    }

    return html`
      <table>
        <thead>
          <tr>
            <th class="checkbox-column">
              <input type="checkbox" disabled />
            </th>
            <th>${localize('first_name')}</th>
            <th>${localize('last_name')}</th>
            <th>${localize('date_of_employment')}</th>
            <th>${localize('date_of_birth')}</th>
            <th>${localize('phone')}</th>
            <th>${localize('email')}</th>
            <th>${localize('department')}</th>
            <th>${localize('position')}</th>
            <th>${localize('actions')}</th>
          </tr>
        </thead>
        <tbody>
          ${paginatedEmployees.map(
            (employee) => html`
              <tr>
                <td>
                  <input type="checkbox" />
                </td>
                <td>${employee.firstName}</td>
                <td>${employee.lastName}</td>
                <td>${this._formatDate(employee.dateOfEmployment)}</td>
                <td>${this._formatDate(employee.dateOfBirth)}</td>
                <td>${employee.phone}</td>
                <td>${employee.email}</td>
                <td>${localize(employee.department.toLowerCase())}</td>
                <td>${localize(employee.position.toLowerCase())}</td>
                <td>
                  <div class="actions">
                    <button
                      class="edit-button"
                      @click="${() => this._handleEdit(employee)}"
                      title="${localize('edit_employee')}"
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
                        <path
                          d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
                        ></path>
                      </svg>
                    </button>
                    <button
                      class="delete-button"
                      @click="${() => this._handleDelete(employee)}"
                      title="${localize('delete')}"
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
                        <path d="M3 6h18"></path>
                        <path
                          d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
                        ></path>
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }

  _renderCardView() {
    const paginatedEmployees = this._getPaginatedEmployees();

    if (paginatedEmployees.length === 0) {
      return html`
        <div class="no-employees">${localize('no_employees')}</div>
      `;
    }

    return html`
      <div class="card-list">
        ${paginatedEmployees.map(
          (employee) => html`
            <div class="employee-card">
              <div class="card-header">
                <h3 class="employee-name">
                  ${employee.firstName} ${employee.lastName}
                </h3>
                <div class="actions">
                  <button
                    class="edit-button"
                    @click="${() => this._handleEdit(employee)}"
                    title="${localize('edit_employee')}"
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
                      <path
                        d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
                      ></path>
                    </svg>
                  </button>
                  <button
                    class="delete-button"
                    @click="${() => this._handleDelete(employee)}"
                    title="${localize('delete')}"
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
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="employee-details">
                <div class="detail-row">
                  <div class="detail-label">
                    ${localize('date_of_employment')}:
                  </div>
                  <div class="detail-value">
                    ${this._formatDate(employee.dateOfEmployment)}
                  </div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">${localize('date_of_birth')}:</div>
                  <div class="detail-value">
                    ${this._formatDate(employee.dateOfBirth)}
                  </div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">${localize('phone')}:</div>
                  <div class="detail-value">${employee.phone}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">${localize('email')}:</div>
                  <div class="detail-value">${employee.email}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">${localize('department')}:</div>
                  <div class="detail-value">
                    ${localize(employee.department.toLowerCase())}
                  </div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">${localize('position')}:</div>
                  <div class="detail-value">
                    ${localize(employee.position.toLowerCase())}
                  </div>
                </div>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }

  render() {
    return html`
      <div class="list-header">
        <div class="list-title">${localize('employee_list')}</div>

        <div class="view-toggle">
          <button
            class="view-button ${this.displayMode === 'table' ? 'active' : ''}"
            @click="${() => this._toggleDisplayMode('table')}"
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
              <path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18" />
            </svg>
            ${localize('table_view')}
          </button>

          <button
            class="view-button ${this.displayMode === 'card' ? 'active' : ''}"
            @click="${() => this._toggleDisplayMode('card')}"
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
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            ${localize('list_view')}
          </button>
        </div>
      </div>

      <search-box @search="${this._handleSearch}"></search-box>

      ${this.displayMode === 'table'
        ? this._renderTableView()
        : this._renderCardView()}

      <pagination-controls
        .currentPage="${this.currentPage}"
        .totalPages="${this._getTotalPages()}"
        @page-change="${this._handlePageChange}"
      ></pagination-controls>

      <confirmation-dialog></confirmation-dialog>
    `;
  }
}

customElements.define('employee-list', EmployeeList);
