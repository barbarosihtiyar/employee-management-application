// Local Storage key for employee data
const EMPLOYEES_STORAGE_KEY = 'employees';

// Sample employee data for initial state
const sampleEmployees = [
  {
    id: '1',
    firstName: 'Ahmet',
    lastName: 'Sourtimes',
    dateOfEmployment: '2022-09-23',
    dateOfBirth: '1990-09-23',
    phone: '+90532123456',
    email: 'ahmet@sourtimes.org',
    department: 'Analytics',
    position: 'Junior',
  },
];

class EmployeeStore {
  constructor() {
    this.employees = [];
    this.loadFromLocalStorage();

    // If no employees are loaded, add sample data
    if (this.employees.length === 0) {
      this.employees = sampleEmployees;
      this.saveToLocalStorage();
    }

    // Create event for state changes
    this.stateChangeEvent = new CustomEvent('employee-store-updated', {
      bubbles: true,
      composed: true,
    });
  }

  // Load employees data from localStorage
  loadFromLocalStorage() {
    try {
      const storedData = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
      if (storedData) {
        this.employees = JSON.parse(storedData);
      }
    } catch (error) {
      console.error('Error loading employee data from localStorage:', error);
      this.employees = [];
    }
  }

  // Save employees data to localStorage
  saveToLocalStorage() {
    try {
      localStorage.setItem(
        EMPLOYEES_STORAGE_KEY,
        JSON.stringify(this.employees)
      );
    } catch (error) {
      console.error('Error saving employee data to localStorage:', error);
    }
  }

  // Notify all components that state has changed
  notifyStateChange() {
    window.dispatchEvent(this.stateChangeEvent);
  }

  // Get all employees
  getAllEmployees() {
    return [...this.employees];
  }

  // Get employee by ID
  getEmployeeById(id) {
    return this.employees.find((employee) => employee.id === id) || null;
  }

  // Add a new employee
  addEmployee(employee) {
    // Generate a unique ID
    const newEmployee = {
      ...employee,
      id: Date.now().toString(),
    };

    // Check if email already exists
    if (this.isEmailDuplicate(newEmployee.email)) {
      throw new Error('duplicate_email');
    }

    this.employees.push(newEmployee);
    this.saveToLocalStorage();
    this.notifyStateChange();

    return newEmployee;
  }

  // Update an existing employee
  updateEmployee(id, updatedData) {
    const employeeIndex = this.employees.findIndex(
      (employee) => employee.id === id
    );

    if (employeeIndex === -1) {
      throw new Error('Employee not found');
    }

    // Check if email is duplicate, but exclude the current employee
    if (updatedData.email && this.isEmailDuplicate(updatedData.email, id)) {
      throw new Error('duplicate_email');
    }

    // Update the employee data
    this.employees[employeeIndex] = {
      ...this.employees[employeeIndex],
      ...updatedData,
    };

    this.saveToLocalStorage();
    this.notifyStateChange();

    return this.employees[employeeIndex];
  }

  // Delete an employee
  deleteEmployee(id) {
    const initialLength = this.employees.length;
    this.employees = this.employees.filter((employee) => employee.id !== id);

    if (this.employees.length === initialLength) {
      throw new Error('Employee not found');
    }

    this.saveToLocalStorage();
    this.notifyStateChange();

    return true;
  }

  // Check if email already exists
  isEmailDuplicate(email, excludeId = null) {
    return this.employees.some(
      (employee) =>
        employee.email === email &&
        (excludeId === null || employee.id !== excludeId)
    );
  }

  // Search employees by query string
  searchEmployees(query) {
    if (!query) return this.getAllEmployees();

    const searchTerm = query.toLowerCase();
    return this.employees.filter((employee) => {
      return (
        employee.firstName.toLowerCase().includes(searchTerm) ||
        employee.lastName.toLowerCase().includes(searchTerm) ||
        employee.email.toLowerCase().includes(searchTerm) ||
        employee.department.toLowerCase().includes(searchTerm) ||
        employee.position.toLowerCase().includes(searchTerm)
      );
    });
  }
}

// Create a singleton instance
const employeeStore = new EmployeeStore();

export default employeeStore;
