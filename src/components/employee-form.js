import {LitElement, html, css} from 'lit';
import {t} from '../i18n/i18n-config.js';
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
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-medium);
      padding: var(--spacing-xl);
      margin: var(--spacing-xl) auto;
      max-width: 800px;
      transition: all var(--transition-normal);
      width: 100%;
    }

    .form-title {
      font-size: var(--font-size-xxl);
      margin-bottom: var(--spacing-xl);
      color: var(--primary-color);
      font-weight: 600;
      text-align: center;
      position: relative;
      padding-bottom: var(--spacing-sm);
    }

    .form-title::after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
      width: 80px;
      height: 3px;
      background-color: var(--primary-color);
      border-radius: 2px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-lg);
      margin-top: var(--spacing-lg);
    }

    .form-group {
      margin-bottom: var(--spacing-lg);
      position: relative;
      width: 100%;
    }

    .form-group label {
      display: block;
      margin-bottom: var(--spacing-sm);
      font-weight: 500;
      color: var(--secondary-color);
      font-size: var(--font-size-sm);
    }

    input,
    select {
      width: calc(100% - 34px);
      padding: 12px 16px;
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-small);
      font-size: var(--font-size-md);
      transition: all var(--transition-fast);
      background-color: #fcfcfc;
    }

    select {
      width: 100%;
    }

    input:focus,
    select:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(255, 102, 0, 0.15);
      background-color: var(--white);
    }

    .button-group {
      display: flex;
      justify-content: center;
      gap: var(--spacing-lg);
      margin-top: var(--spacing-xl);
    }

    .cancel-button {
      background-color: var(--light-gray);
      color: var(--secondary-color);
      border: none;
      padding: 14px 28px;
      border-radius: var(--border-radius-small);
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
      font-size: var(--font-size-md);
      min-width: 150px;
    }

    .cancel-button:hover {
      background-color: #e0e0e0;
      transform: translateY(-2px);
    }

    .submit-button {
      background-color: var(--primary-color);
      color: var(--white);
      border: none;
      padding: 14px 35px;
      border-radius: var(--border-radius-small);
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition-fast);
      font-size: var(--font-size-md);
      min-width: 150px;
    }

    .submit-button:hover {
      background-color: var(--primary-light);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(255, 102, 0, 0.2);
    }

    .submit-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .error {
      color: var(--danger-color);
      font-size: var(--font-size-xs);
      margin-top: var(--spacing-xs);
      animation: fadeIn 0.3s ease;
      position: absolute;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-5px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Tablet */
    @media (max-width: 992px) {
      .form-card {
        margin: 0;
        padding: 0;

        form {
          padding: 10px;
        }
      }

      .form-title {
        margin-bottom: var(--spacing-lg);
        padding-top: 12px;
      }
    }

    /* Mobil */
    @media (max-width: 768px) {
      .form-card {
        margin: 0;
        padding: 0;

        form {
          padding: 10px;
        }
      }

      .form-title {
        font-size: var(--font-size-xl);
        margin-bottom: var(--spacing-lg);
        padding-top: 12px;
      }

      .form-grid {
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
      }

      .button-group {
        flex-direction: column-reverse;
        gap: var(--spacing-sm);
        margin-top: var(--spacing-lg);
      }

      .cancel-button,
      .submit-button {
        width: 100%;
        min-width: unset;
        padding: 12px;
      }

      input,
      select {
        padding: 10px 14px;
        width: calc(100% - 30px);
      }

      select {
        width: 100%;
      }
    }

    /* Küçük mobil cihazlar */
    @media (max-width: 480px) {
      .form-card {
        margin: 0;
        padding: 0;

        form {
          padding: 10px;
        }
      }

      .form-title {
        font-size: var(--font-size-lg);
        padding-top: 12px;
      }

      .form-group {
        width: 330px;
      }

      input,
      select {
        padding: 10px 14px;
        width: calc(100% - 30px);
      }

      select {
        width: 100%;
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
      department: 'Analytics',
      position: 'Junior',
    };
    this.errors = {};
    this.isEdit = false;
    this.isLoading = false;

    window.addEventListener('language-changed', () => this.requestUpdate());
  }

  connectedCallback() {
    super.connectedCallback();

    const location = window.location.pathname;
    const match = location.match(/\/employees\/(.+)\/edit/);

    if (match) {
      const employeeId = match[1];
      this.isEdit = true;

      const employee = employeeStore.getEmployeeById(employeeId);
      if (employee) {
        this.employee = {...employee};
      } else {
        navigate('/employees');
      }
    }
  }

  firstUpdated() {
    this.confirmDialog = this.shadowRoot.querySelector('confirmation-dialog');
  }

  _handleInputChange(e) {
    const {name, value} = e.target;

    this.employee = {
      ...this.employee,
      [name]: value,
    };

    if (this.errors[name]) {
      this.errors = {
        ...this.errors,
        [name]: null,
      };
    }
  }

  _validate() {
    const errors = {};

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
        errors[field] = t('required_field');
      }
    });

    if (this.employee.email && !this._isValidEmail(this.employee.email)) {
      errors.email = t('invalid_email');
    }

    if (this.employee.phone && !this._isValidPhone(this.employee.phone)) {
      errors.phone = t('invalid_phone');
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
        if (!this.confirmDialog) {
          console.error('Confirmation dialog bulunamadı');
          this.isLoading = false;
          employeeStore.updateEmployee(this.employee.id, this.employee);
          navigate('/employees');
          return;
        }

        const confirmed = await this.confirmDialog.open({
          title: t('are_you_sure'),
          message: t('confirm_update'),
          confirmText: t('save'),
          cancelText: t('cancel'),
        });

        if (!confirmed) {
          this.isLoading = false;
          return;
        }

        employeeStore.updateEmployee(this.employee.id, this.employee);
      } else {
        employeeStore.addEmployee(this.employee);
      }

      navigate('/employees');
    } catch (error) {
      if (error.message === 'duplicate_email') {
        this.errors = {
          ...this.errors,
          email: t('duplicate_email'),
        };
      } else if (error.message === 'duplicate_phone') {
        this.errors = {
          ...this.errors,
          phone: t('duplicate_phone'),
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
          ${this.isEdit ? t('edit_employee') : t('add_employee')}
        </div>

        <form @submit="${this._handleSubmit}">
          <div class="form-grid">
            <div class="form-group">
              <label for="firstName">${t('first_name')}</label>
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
              <label for="lastName">${t('last_name')}</label>
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
              <label for="dateOfEmployment">${t('date_of_employment')}</label>
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
              <label for="dateOfBirth">${t('date_of_birth')}</label>
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
              <label for="phone">${t('phone')}</label>
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
              <label for="email">${t('email')}</label>
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
              <label for="department">${t('department')}</label>
              <select
                id="department"
                name="department"
                @change="${this._handleInputChange}"
              >
                <option
                  value="Analytics"
                  ?selected=${this.employee.department === 'Analytics'}
                >
                  ${t('analytics')}
                </option>
                <option
                  value="Tech"
                  ?selected=${this.employee.department === 'Tech'}
                >
                  ${t('tech')}
                </option>
              </select>
              ${this.errors.department
                ? html`<div class="error">${this.errors.department}</div>`
                : ''}
            </div>

            <div class="form-group">
              <label for="position">${t('position')}</label>
              <select
                id="position"
                name="position"
                @change="${this._handleInputChange}"
              >
                <option
                  value="Junior"
                  ?selected=${this.employee.position === 'Junior'}
                >
                  ${t('junior')}
                </option>
                <option
                  value="Mid"
                  ?selected=${this.employee.position === 'Mid'}
                >
                  ${t('mid')}
                </option>
                <option
                  value="Senior"
                  ?selected=${this.employee.position === 'Senior'}
                >
                  ${t('senior')}
                </option>
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
              ${t('cancel')}
            </button>
            <button
              type="submit"
              class="submit-button"
              ?disabled="${this.isLoading}"
            >
              ${t('save')}
            </button>
          </div>
        </form>
      </div>

      <confirmation-dialog></confirmation-dialog>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
