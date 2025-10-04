import { User } from '../contexts/AuthContext';
// Mock data
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
// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    await delay(800); // Simulate API delay
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }
    // Store user in localStorage for persistence
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  },
  signup: async (name: string, email: string, password: string): Promise<User> => {
    await delay(1000); // Simulate API delay
    // Check if user already exists
    if (mockUsers.some(u => u.email === email)) {
      throw new Error('User already exists');
    }
    // Create a new user with admin role and new company
    const newUser: User = {
      id: String(mockUsers.length + 1),
      name,
      email,
      role: 'admin',
      // First user is always admin
      companyId: String(Date.now()) // Generate a unique company ID
    };
    mockUsers.push(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return newUser;
  },
  logout: () => {
    localStorage.removeItem('currentUser');
  },
  getCurrentUser: async (): Promise<User | null> => {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) return null;
    try {
      return JSON.parse(userJson) as User;
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      return null;
    }
  }
};