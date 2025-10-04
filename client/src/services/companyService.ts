import { Company, Currency } from '../contexts/CompanyContext';
import { User } from '../contexts/AuthContext';
// Mock data
const mockCompanies: Company[] = [{
  id: '1',
  name: 'Demo Company',
  currency: 'USD',
  country: 'United States',
  approvalRules: {
    type: 'percentage',
    percentage: 60,
    active: true
  }
}];
const mockUsers: User[] = [{
  id: '1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
  companyId: '1'
}, {
  id: '2',
  name: 'Manager User',
  email: 'manager@example.com',
  role: 'manager',
  companyId: '1',
  isFinance: true
}, {
  id: '3',
  name: 'Employee User',
  email: 'employee@example.com',
  role: 'employee',
  companyId: '1',
  managerId: '2'
}, {
  id: '4',
  name: 'Director User',
  email: 'director@example.com',
  role: 'manager',
  companyId: '1',
  isDirector: true
}];
// Mock currencies
const mockCurrencies: Currency[] = [{
  code: 'USD',
  name: 'US Dollar',
  symbol: '$'
}, {
  code: 'EUR',
  name: 'Euro',
  symbol: '€'
}, {
  code: 'GBP',
  name: 'British Pound',
  symbol: '£'
}, {
  code: 'JPY',
  name: 'Japanese Yen',
  symbol: '¥'
}, {
  code: 'CAD',
  name: 'Canadian Dollar',
  symbol: 'CA$'
}];
// Mock exchange rates
const mockExchangeRates: Record<string, Record<string, number>> = {
  USD: {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.8,
    CAD: 1.37
  },
  EUR: {
    USD: 1.09,
    EUR: 1,
    GBP: 0.86,
    JPY: 163.5,
    CAD: 1.49
  }
};
// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export const companyService = {
  getCompany: async (id: string): Promise<Company> => {
    await delay(800); // Simulate API delay
    const company = mockCompanies.find(c => c.id === id);
    if (!company) {
      throw new Error('Company not found');
    }
    return company;
  },
  updateCompany: async (id: string, companyData: Partial<Company>): Promise<Company> => {
    await delay(1000); // Simulate API delay
    const index = mockCompanies.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Company not found');
    }
    const updatedCompany = {
      ...mockCompanies[index],
      ...companyData
    };
    mockCompanies[index] = updatedCompany;
    return updatedCompany;
  },
  getCurrencies: async (): Promise<Currency[]> => {
    await delay(800); // Simulate API delay
    return mockCurrencies;
  },
  getExchangeRates: async (baseCurrency: string): Promise<Record<string, number>> => {
    await delay(1000); // Simulate API delay
    // Return mock exchange rates or generate some if they don't exist
    if (mockExchangeRates[baseCurrency]) {
      return mockExchangeRates[baseCurrency];
    }
    // Generate mock rates
    const rates: Record<string, number> = {};
    mockCurrencies.forEach(currency => {
      if (currency.code === baseCurrency) {
        rates[currency.code] = 1;
      } else {
        // Generate a random rate between 0.5 and 2
        rates[currency.code] = 0.5 + Math.random() * 1.5;
      }
    });
    return rates;
  },
  getUsers: async (companyId: string): Promise<User[]> => {
    await delay(800); // Simulate API delay
    return mockUsers.filter(user => user.companyId === companyId);
  },
  createUser: async (userData: Partial<User>): Promise<User> => {
    await delay(1000); // Simulate API delay
    const newUser: User = {
      id: String(Date.now()),
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'employee',
      companyId: userData.companyId || '',
      managerId: userData.managerId,
      isFinance: userData.isFinance,
      isDirector: userData.isDirector
    };
    mockUsers.push(newUser);
    return newUser;
  },
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    await delay(1000); // Simulate API delay
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    const updatedUser = {
      ...mockUsers[index],
      ...userData
    };
    mockUsers[index] = updatedUser;
    return updatedUser;
  },
  deleteUser: async (id: string): Promise<void> => {
    await delay(1000); // Simulate API delay
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    mockUsers.splice(index, 1);
  },
  updateApprovalRules: async (companyId: string, rules: Company['approvalRules']): Promise<void> => {
    await delay(1000); // Simulate API delay
    const index = mockCompanies.findIndex(c => c.id === companyId);
    if (index === -1) {
      throw new Error('Company not found');
    }
    mockCompanies[index].approvalRules = rules;
  }
};