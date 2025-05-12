// Local Storage key for employee data
const EMPLOYEES_STORAGE_KEY = 'employees';

// Sample employee data for initial state
const sampleEmployees = [
  {
    id: '1',
    firstName: 'Robert',
    lastName: 'Thompson',
    dateOfEmployment: '2025-03-17',
    dateOfBirth: '1998-05-15',
    phone: '+18741696047',
    email: 'brockaaron@hanson-mcdonald.info',
    department: 'Tech',
    position: 'Junior',
  },
  {
    id: '2',
    firstName: 'Natalie',
    lastName: 'Peterson',
    dateOfEmployment: '2023-06-25',
    dateOfBirth: '1984-01-15',
    phone: '+17955647242',
    email: 'fletcherjordan@yahoo.com',
    department: 'Analytics',
    position: 'Mid',
  },
  {
    id: '3',
    firstName: 'Julie',
    lastName: 'Lucas',
    dateOfEmployment: '2023-12-09',
    dateOfBirth: '1973-01-12',
    phone: '+17906191232',
    email: 'rbecker@coleman-davis.com',
    department: 'Tech',
    position: 'Senior',
  },
  {
    id: '4',
    firstName: 'Christopher',
    lastName: 'Wilson',
    dateOfEmployment: '2023-02-01',
    dateOfBirth: '1969-08-07',
    phone: '+12597725455',
    email: 'xgarcia@hotmail.com',
    department: 'Tech',
    position: 'Senior',
  },
  {
    id: '5',
    firstName: 'Jennifer',
    lastName: 'Day',
    dateOfEmployment: '2025-01-13',
    dateOfBirth: '1975-03-02',
    phone: '+15582990916',
    email: 'jenniferrivera@lindsey.com',
    department: 'Analytics',
    position: 'Junior',
  },
  {
    id: '6',
    firstName: 'Kelsey',
    lastName: 'Orozco',
    dateOfEmployment: '2022-10-28',
    dateOfBirth: '2001-11-10',
    phone: '+16998176880',
    email: 'collinsrobert@lucas.com',
    department: 'Tech',
    position: 'Mid',
  },
  {
    id: '7',
    firstName: 'Sandra',
    lastName: 'Burns',
    dateOfEmployment: '2023-03-01',
    dateOfBirth: '1971-11-24',
    phone: '+14214717476',
    email: 'murphyjustin@williams.com',
    department: 'Tech',
    position: 'Junior',
  },
  {
    id: '8',
    firstName: 'Joel',
    lastName: 'Gardner',
    dateOfEmployment: '2023-03-09',
    dateOfBirth: '1993-08-20',
    phone: '+15243852662',
    email: 'stevensheather@pierce.com',
    department: 'Analytics',
    position: 'Junior',
  },
  {
    id: '9',
    firstName: 'Karen',
    lastName: 'Lewis',
    dateOfEmployment: '2022-07-25',
    dateOfBirth: '1979-12-02',
    phone: '+16811654231',
    email: 'gary17@ayala.com',
    department: 'Tech',
    position: 'Senior',
  },
  {
    id: '10',
    firstName: 'Stefanie',
    lastName: 'Delgado',
    dateOfEmployment: '2025-01-09',
    dateOfBirth: '1985-07-11',
    phone: '+18580046092',
    email: 'richardhudson@hotmail.com',
    department: 'Analytics',
    position: 'Senior',
  },
  {
    id: '11',
    firstName: 'Eric',
    lastName: 'Butler',
    dateOfEmployment: '2022-07-26',
    dateOfBirth: '1987-03-13',
    phone: '+10117501902',
    email: 'donnasmith@gmail.com',
    department: 'Analytics',
    position: 'Mid',
  },
  {
    id: '12',
    firstName: 'Donna',
    lastName: 'Hinton',
    dateOfEmployment: '2025-02-04',
    dateOfBirth: '1984-07-14',
    phone: '+19700130938',
    email: 'maryporter@spencer.info',
    department: 'Tech',
    position: 'Mid',
  },
  {
    id: '13',
    firstName: 'Donald',
    lastName: 'Sutton',
    dateOfEmployment: '2024-02-21',
    dateOfBirth: '1999-01-01',
    phone: '+17395330328',
    email: 'barbarabutler@eaton.info',
    department: 'Analytics',
    position: 'Senior',
  },
  {
    id: '14',
    firstName: 'Jason',
    lastName: 'Sanchez',
    dateOfEmployment: '2023-04-02',
    dateOfBirth: '1977-09-17',
    phone: '+19277955010',
    email: 'debra16@hotmail.com',
    department: 'Analytics',
    position: 'Senior',
  },
  {
    id: '15',
    firstName: 'Stephanie',
    lastName: 'Gay',
    dateOfEmployment: '2022-09-01',
    dateOfBirth: '1981-08-17',
    phone: '+19957214989',
    email: 'cervantesmartha@lambert-little.biz',
    department: 'Tech',
    position: 'Senior',
  },
  {
    id: '16',
    firstName: 'Michael',
    lastName: 'Smith',
    dateOfEmployment: '2023-10-25',
    dateOfBirth: '1977-03-02',
    phone: '+19647475783',
    email: 'uthomas@delgado.com',
    department: 'Analytics',
    position: 'Senior',
  },
  {
    id: '17',
    firstName: 'Tyler',
    lastName: 'Gay',
    dateOfEmployment: '2024-05-03',
    dateOfBirth: '1973-01-17',
    phone: '+13803863213',
    email: 'devans@gardner-martinez.org',
    department: 'Analytics',
    position: 'Senior',
  },
  {
    id: '18',
    firstName: 'Charles',
    lastName: 'Tucker',
    dateOfEmployment: '2024-08-18',
    dateOfBirth: '1978-03-06',
    phone: '+15488289231',
    email: 'arnoldapril@yahoo.com',
    department: 'Analytics',
    position: 'Senior',
  },
  {
    id: '19',
    firstName: 'Paula',
    lastName: 'Becker',
    dateOfEmployment: '2025-04-20',
    dateOfBirth: '1979-10-04',
    phone: '+12011539320',
    email: 'pscott@gmail.com',
    department: 'Analytics',
    position: 'Senior',
  },
  {
    id: '20',
    firstName: 'Yvette',
    lastName: 'Wise',
    dateOfEmployment: '2023-04-20',
    dateOfBirth: '1994-06-15',
    phone: '+13263072081',
    email: 'rhondasalas@yahoo.com',
    department: 'Analytics',
    position: 'Mid',
  },
  {
    id: '21',
    firstName: 'Cynthia',
    lastName: 'Warren',
    dateOfEmployment: '2025-05-02',
    dateOfBirth: '1989-01-21',
    phone: '+19420536844',
    email: 'michelle82@long-luna.com',
    department: 'Tech',
    position: 'Mid',
  },
  {
    id: '22',
    firstName: 'Tony',
    lastName: 'Williamson',
    dateOfEmployment: '2023-01-27',
    dateOfBirth: '1984-06-27',
    phone: '+12522648110',
    email: 'znichols@harvey.info',
    department: 'Tech',
    position: 'Senior',
  },
  {
    id: '23',
    firstName: 'Bryce',
    lastName: 'Nolan',
    dateOfEmployment: '2024-05-06',
    dateOfBirth: '1989-02-14',
    phone: '+14990063235',
    email: 'diana04@brooks.net',
    department: 'Tech',
    position: 'Senior',
  },
  {
    id: '24',
    firstName: 'Janet',
    lastName: 'Green',
    dateOfEmployment: '2023-07-02',
    dateOfBirth: '1974-06-12',
    phone: '+19623523095',
    email: 'paulramirez@yahoo.com',
    department: 'Analytics',
    position: 'Junior',
  },
  {
    id: '25',
    firstName: 'Crystal',
    lastName: 'Lewis',
    dateOfEmployment: '2025-05-11',
    dateOfBirth: '1971-10-19',
    phone: '+15744626412',
    email: 'wilsonamber@fleming-woods.com',
    department: 'Tech',
    position: 'Junior',
  },
  {
    id: '26',
    firstName: 'Patricia',
    lastName: 'Lee',
    dateOfEmployment: '2024-10-01',
    dateOfBirth: '1975-08-08',
    phone: '+15379966348',
    email: 'efry@gmail.com',
    department: 'Tech',
    position: 'Senior',
  },
  {
    id: '27',
    firstName: 'Karen',
    lastName: 'Barber',
    dateOfEmployment: '2022-07-24',
    dateOfBirth: '1980-07-01',
    phone: '+17643688174',
    email: 'nicole82@adams.com',
    department: 'Tech',
    position: 'Mid',
  },
  {
    id: '28',
    firstName: 'Michael',
    lastName: 'Reeves',
    dateOfEmployment: '2024-01-15',
    dateOfBirth: '1980-02-16',
    phone: '+16484453562',
    email: 'rduran@yahoo.com',
    department: 'Analytics',
    position: 'Junior',
  },
  {
    id: '29',
    firstName: 'Linda',
    lastName: 'Branch',
    dateOfEmployment: '2022-09-08',
    dateOfBirth: '1980-02-08',
    phone: '+10834571805',
    email: 'brendagarcia@hotmail.com',
    department: 'Analytics',
    position: 'Senior',
  },
  {
    id: '30',
    firstName: 'Diane',
    lastName: 'Cooper',
    dateOfEmployment: '2022-08-05',
    dateOfBirth: '1976-10-27',
    phone: '+17212575754',
    email: 'thomasjason@yahoo.com',
    department: 'Analytics',
    position: 'Mid',
  },
  {
    id: '31',
    firstName: 'Alan',
    lastName: 'Monroe',
    dateOfEmployment: '2024-08-12',
    dateOfBirth: '2002-07-14',
    phone: '+12179831887',
    email: 'manningseth@smith.com',
    department: 'Analytics',
    position: 'Senior',
  },
  {
    id: '32',
    firstName: 'Donna',
    lastName: 'Bradley',
    dateOfEmployment: '2024-12-18',
    dateOfBirth: '1989-01-11',
    phone: '+19604802200',
    email: 'yfowler@gmail.com',
    department: 'Tech',
    position: 'Mid',
  },
  {
    id: '33',
    firstName: 'Kristina',
    lastName: 'Werner',
    dateOfEmployment: '2024-02-02',
    dateOfBirth: '1988-05-19',
    phone: '+11278189677',
    email: 'sarahyoung@davis.biz',
    department: 'Tech',
    position: 'Junior',
  },
  {
    id: '34',
    firstName: 'Anthony',
    lastName: 'Nguyen',
    dateOfEmployment: '2024-07-16',
    dateOfBirth: '1973-07-29',
    phone: '+13488409812',
    email: 'elizabeth00@garcia.com',
    department: 'Tech',
    position: 'Junior',
  },
  {
    id: '35',
    firstName: 'Vickie',
    lastName: 'Perry',
    dateOfEmployment: '2023-01-06',
    dateOfBirth: '1975-10-08',
    phone: '+15160676195',
    email: 'matthewbooth@jackson-reynolds.com',
    department: 'Analytics',
    position: 'Junior',
  },
  {
    id: '36',
    firstName: 'Alan',
    lastName: 'Garcia',
    dateOfEmployment: '2024-07-14',
    dateOfBirth: '1996-04-10',
    phone: '+15913515322',
    email: 'jessicadavis@gmail.com',
    department: 'Tech',
    position: 'Mid',
  },
  {
    id: '37',
    firstName: 'Sean',
    lastName: 'Duncan',
    dateOfEmployment: '2023-10-14',
    dateOfBirth: '1987-09-08',
    phone: '+14132552812',
    email: 'stevengilmore@reed-franklin.com',
    department: 'Analytics',
    position: 'Senior',
  },
  {
    id: '38',
    firstName: 'Bradley',
    lastName: 'Wheeler',
    dateOfEmployment: '2023-12-08',
    dateOfBirth: '1984-02-28',
    phone: '+16833153266',
    email: 'marvinrojas@sandoval.net',
    department: 'Analytics',
    position: 'Junior',
  },
  {
    id: '39',
    firstName: 'James',
    lastName: 'Garrett',
    dateOfEmployment: '2024-10-23',
    dateOfBirth: '1998-08-31',
    phone: '+14203603789',
    email: 'bestjackie@kelly-mcconnell.com',
    department: 'Tech',
    position: 'Senior',
  },
  {
    id: '40',
    firstName: 'Samantha',
    lastName: 'Harrington',
    dateOfEmployment: '2023-09-05',
    dateOfBirth: '1982-10-13',
    phone: '+11461165003',
    email: 'alejandrorogers@clark.com',
    department: 'Analytics',
    position: 'Senior',
  },
  {
    id: '41',
    firstName: 'Miguel',
    lastName: 'Perez',
    dateOfEmployment: '2022-10-03',
    dateOfBirth: '1990-09-02',
    phone: '+16800116443',
    email: 'patrickgloria@hotmail.com',
    department: 'Analytics',
    position: 'Mid',
  },
  {
    id: '42',
    firstName: 'Darlene',
    lastName: 'Gutierrez',
    dateOfEmployment: '2023-01-12',
    dateOfBirth: '1985-03-23',
    phone: '+17242318074',
    email: 'desiree73@hotmail.com',
    department: 'Analytics',
    position: 'Senior',
  },
  {
    id: '43',
    firstName: 'Jasmine',
    lastName: 'Duncan',
    dateOfEmployment: '2022-10-26',
    dateOfBirth: '1974-07-27',
    phone: '+17480604349',
    email: 'thomas60@medina-casey.com',
    department: 'Tech',
    position: 'Senior',
  },
  {
    id: '44',
    firstName: 'Michael',
    lastName: 'Lawson',
    dateOfEmployment: '2025-05-02',
    dateOfBirth: '1995-05-08',
    phone: '+11377346755',
    email: 'smiranda@romero.com',
    department: 'Tech',
    position: 'Junior',
  },
  {
    id: '45',
    firstName: 'Monica',
    lastName: 'Travis',
    dateOfEmployment: '2024-12-25',
    dateOfBirth: '1970-06-25',
    phone: '+10167663983',
    email: 'johnny92@yahoo.com',
    department: 'Tech',
    position: 'Junior',
  },
  {
    id: '46',
    firstName: 'Erica',
    lastName: 'Rogers',
    dateOfEmployment: '2024-01-13',
    dateOfBirth: '1983-05-16',
    phone: '+19649404372',
    email: 'christinawilson@gmail.com',
    department: 'Tech',
    position: 'Junior',
  },
  {
    id: '47',
    firstName: 'Philip',
    lastName: 'Johnson',
    dateOfEmployment: '2025-03-11',
    dateOfBirth: '1979-08-08',
    phone: '+15049109382',
    email: 'warrensteven@gmail.com',
    department: 'Tech',
    position: 'Senior',
  },
  {
    id: '48',
    firstName: 'Brittany',
    lastName: 'Russell',
    dateOfEmployment: '2024-01-14',
    dateOfBirth: '1973-06-03',
    phone: '+16073029912',
    email: 'kentbrandt@hotmail.com',
    department: 'Tech',
    position: 'Mid',
  },
  {
    id: '49',
    firstName: 'Pamela',
    lastName: 'Holmes',
    dateOfEmployment: '2022-08-08',
    dateOfBirth: '1973-03-26',
    phone: '+10971436940',
    email: 'thomasbobby@newman.com',
    department: 'Analytics',
    position: 'Junior',
  },
  {
    id: '50',
    firstName: 'Douglas',
    lastName: 'Chandler',
    dateOfEmployment: '2025-01-16',
    dateOfBirth: '2003-02-13',
    phone: '+14339618878',
    email: 'thomascraig@hotmail.com',
    department: 'Tech',
    position: 'Senior',
  },
];
class EmployeeStore {
  constructor() {
    this.employees = [];
    this.loadFromLocalStorage();

    if (this.employees.length === 0) {
      this.employees = sampleEmployees;
      this.saveToLocalStorage();
    }

    this.stateChangeEvent = new CustomEvent('employee-store-updated', {
      bubbles: true,
      composed: true,
    });
  }

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

  notifyStateChange() {
    window.dispatchEvent(this.stateChangeEvent);
  }

  getAllEmployees() {
    return [...this.employees];
  }

  getEmployeeById(id) {
    return this.employees.find((employee) => employee.id === id) || null;
  }

  addEmployee(employee) {
    const newEmployee = {
      ...employee,
      id: Date.now().toString(),
    };

    if (this.isEmailDuplicate(newEmployee.email)) {
      throw new Error('duplicate_email');
    }

    if (this.isPhoneDuplicate(newEmployee.phone)) {
      throw new Error('duplicate_phone');
    }

    this.employees.push(newEmployee);
    this.saveToLocalStorage();
    this.notifyStateChange();

    return newEmployee;
  }

  updateEmployee(id, updatedData) {
    const employeeIndex = this.employees.findIndex(
      (employee) => employee.id === id
    );

    if (employeeIndex === -1) {
      throw new Error('Employee not found');
    }

    if (updatedData.email && this.isEmailDuplicate(updatedData.email, id)) {
      throw new Error('duplicate_email');
    }

    if (updatedData.phone && this.isPhoneDuplicate(updatedData.phone, id)) {
      throw new Error('duplicate_phone');
    }

    this.employees[employeeIndex] = {
      ...this.employees[employeeIndex],
      ...updatedData,
    };

    this.saveToLocalStorage();
    this.notifyStateChange();

    return this.employees[employeeIndex];
  }

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

  isEmailDuplicate(email, excludeId = null) {
    return this.employees.some(
      (employee) =>
        employee.email === email &&
        (excludeId === null || employee.id !== excludeId)
    );
  }

  isPhoneDuplicate(phone, excludeId = null) {
    return this.employees.some(
      (employee) =>
        employee.phone === phone &&
        (excludeId === null || employee.id !== excludeId)
    );
  }

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

const employeeStore = new EmployeeStore();

export default employeeStore;
