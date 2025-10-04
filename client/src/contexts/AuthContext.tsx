import React, { useEffect, useState, createContext, useContext } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
export type UserRole = 'admin' | 'manager' | 'employee';
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  managerId?: string;
  isFinance?: boolean;
  isDirector?: boolean;
}
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to get current user:', error);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const user = await authService.login(email, password);
      setCurrentUser(user);
      toast.success('Login successful');
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const user = await authService.signup(name, email, password);
      setCurrentUser(user);
      toast.success('Account created successfully');
    } catch (error) {
      toast.error('Signup failed. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    toast.info('You have been logged out');
  };
  const hasPermission = (requiredRole: UserRole | UserRole[]) => {
    if (!currentUser) return false;
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(currentUser.role);
    }
    if (requiredRole === 'admin') {
      return currentUser.role === 'admin';
    }
    if (requiredRole === 'manager') {
      return currentUser.role === 'admin' || currentUser.role === 'manager';
    }
    // Everyone has employee permissions
    return true;
  };
  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    hasPermission
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};