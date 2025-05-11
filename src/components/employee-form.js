import {LitElement, html, css} from 'lit';
import {localize} from '../locales/index.js';
import {navigate} from '../router.js';
import employeeStore from '../store/employee-store.js';
import './confirmation-dialog.js';

export class EmployeeForm extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .form-card {
      background-color: var(--white);
      border-radius: 8px;
      box-shadow: var(--shadow);
      padding: 24px;
    }

    .form-title {
      font-size: 1.5rem;
      margin-bottom: 24px;
      color: var(--primary-color);
      font-weight: 600;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-group label {
      display: block;
      margin-bottom: 6px;
      font-weight: 500;
    }

    input,
    select {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      font-size: 14px;
    }

    input:focus,
    select:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(255, 102, 0, 0.2);
    }

    .error {
      color: var(--danger-color);
      font-size: 12px;
      margin-top: 4px;
    }

    .full-width {
      grid-column: span 2;
    }

    .button-group {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 32px;
    }

    .cancel-button {
      background-color: var(--light-gray);
      color: var(--text-color);
    }

    .submit-button {
      background-color: var(--primary-color);
      color: var(--white);
    }

    .submit-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }

      .full-width {
        grid-column: span 1;
      }
    }
  `;

  static properties = {
    employee: {type: Object},
    errors: {type: Object},
    isEdit: {type: Boolean},
    isLoading: {type: Boolean},
  };

  constructor() {
    super();
    this.employee = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      department: 'Analytics', // Default value
      position: 'Junior', // Default value
    };
    this.errors = {};
    this.isEdit = false;
    this.isLoading = false;

    // Listen for language changes
    window.addEventListener('language-changed', () => this.requestUpdate());
  }

  connectedCallback() {
    super.connectedCallback();

    // Check if we're in edit mode
    const location = window.location.pathname;
    const match = location.match(/\/employees\/(.+)\/edit/);

    if (match) {
      const employeeId = match[1];
      this.isEdit = true;

      // Get employee data
      const employee = employeeStore.getEmployeeById(employeeId);
      if (employee) {
        this.employee = {...employee};
      } else {
        // Employee not found, redirect to list
        navigate('/employees');
      }
    }
  }

  firstUpdated() {
    // Get reference to the confirmation dialog
    this.confirmDialog = this.shadowRoot.querySelector('confirmation-dialog');
  }

  _handleInputChange(e) {
    const {name, value} = e.target;

    this.employee = {
      ...this.employee,
      [name]: value,
    };

    // Clear error for this field
    if (this.errors[name]) {
      this.errors = {
        ...this.errors,
        [name]: null,
      };
    }
  }

  _validate() {
    const errors = {};

    // Required fields
    [
      'firstName',
      'lastName',
      'dateOfEmployment',
      'dateOfBirth',
      'phone',
      'email',
      'department',
      'position',
    ].forEach((field) => {
      if (!this.employee[field]) {
        errors[field] = localize('required_field');
      }
    });

    // Email validation
    if (this.employee.email && !this._isValidEmail(this.employee.email)) {
      errors.email = localize('invalid_email');
    }

    // Phone validation
    if (this.employee.phone && !this._isValidPhone(this.employee.phone)) {
      errors.phone = localize('invalid_phone');
    }

    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  _isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  _isValidPhone(phone) {
    return /^\+[0-9]{1,3}[0-9\s]{5,14}$/.test(phone);
  }

  async _handleSubmit(e) {
    e.preventDefault();

    if (!this._validate()) {
      return;
    }

    try {
      this.isLoading = true;

      if (this.isEdit) {
        // Get confirmation before updating
        const confirmed = await this.confirmDialog.open({
          title: localize('are_you_sure'),
          message: localize('confirm_update'),
          confirmText: localize('save'),
          cancelText: localize('cancel'),
        });

        if (!confirmed) {
          this.isLoading = false;
          return;
        }

        // Update employee
        employeeStore.updateEmployee(this.employee.id, this.employee);
      } else {
        // Add new employee
        employeeStore.addEmployee(this.employee);
      }

      // Navigate back to employee list
      navigate('/employees');
    } catch (error) {
      if (error.message === 'duplicate_email') {
        this.errors = {
          ...this.errors,
          email: localize('duplicate_email'),
        };
      } else {
        console.error('Error saving employee:', error);
      }
      this.isLoading = false;
    }
  }

  _handleCancel() {
    navigate('/employees');
  }

  render() {
    return html`
      <div class="form-card">
        <div class="form-title">
          ${this.isEdit ? localize('edit_employee') : localize('add_employee')}
        </div>

        <form @submit="${this._handleSubmit}">
          <div class="form-grid">
            <div class="form-group">
              <label for="firstName">${localize('first_name')}</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                .value="${this.employee.firstName}"
                @input="${this._handleInputChange}"
              />
              ${this.errors.firstName
                ? html`<div class="error">${this.errors.firstName}</div>`
                : ''}
            </div>

            <div class="form-group">
              <label for="lastName">${localize('last_name')}</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                .value="${this.employee.lastName}"
                @input="${this._handleInputChange}"
              />
              ${this.errors.lastName
                ? html`<div class="error">${this.errors.lastName}</div>`
                : ''}
            </div>

            <div class="form-group">
              <label for="dateOfEmployment"
                >${localize('date_of_employment')}</label
              >
              <input
                type="date"
                id="dateOfEmployment"
                name="dateOfEmployment"
                .value="${this.employee.dateOfEmployment}"
                @input="${this._handleInputChange}"
              />
              ${this.errors.dateOfEmployment
                ? html`<div class="error">${this.errors.dateOfEmployment}</div>`
                : ''}
            </div>

            <div class="form-group">
              <label for="dateOfBirth">${localize('date_of_birth')}</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                .value="${this.employee.dateOfBirth}"
                @input="${this._handleInputChange}"
              />
              ${this.errors.dateOfBirth
                ? html`<div class="error">${this.errors.dateOfBirth}</div>`
                : ''}
            </div>

            <div class="form-group">
              <label for="phone">${localize('phone')}</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+901234567890"
                .value="${this.employee.phone}"
                @input="${this._handleInputChange}"
              />
              ${this.errors.phone
                ? html`<div class="error">${this.errors.phone}</div>`
                : ''}
            </div>

            <div class="form-group">
              <label for="email">${localize('email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                .value="${this.employee.email}"
                @input="${this._handleInputChange}"
              />
              ${this.errors.email
                ? html`<div class="error">${this.errors.email}</div>`
                : ''}
            </div>

            <div class="form-group">
              <label for="department">${localize('department')}</label>
              <select
                id="department"
                name="department"
                .value="${this.employee.department}"
                @change="${this._handleInputChange}"
              >
                <option value="Analytics">${localize('analytics')}</option>
                <option value="Tech">${localize('tech')}</option>
              </select>
              ${this.errors.department
                ? html`<div class="error">${this.errors.department}</div>`
                : ''}
            </div>

            <div class="form-group">
              <label for="position">${localize('position')}</label>
              <select
                id="position"
                name="position"
                .value="${this.employee.position}"
                @change="${this._handleInputChange}"
              >
                <option value="Junior">${localize('junior')}</option>
                <option value="Medior">${localize('medior')}</option>
                <option value="Senior">${localize('senior')}</option>
              </select>
              ${this.errors.position
                ? html`<div class="error">${this.errors.position}</div>`
                : ''}
            </div>
          </div>

          <div class="button-group">
            <button
              type="button"
              class="cancel-button"
              @click="${this._handleCancel}"
            >
              ${localize('cancel')}
            </button>
            <button
              type="submit"
              class="submit-button"
              ?disabled="${this.isLoading}"
            >
              ${localize('save')}
            </button>
          </div>
        </form>
      </div>

      <confirmation-dialog></confirmation-dialog>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
