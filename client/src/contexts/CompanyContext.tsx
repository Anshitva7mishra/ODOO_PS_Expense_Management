import React, { useEffect, useState, createContext, useContext } from 'react';
import { companyService } from '../services/companyService';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
export interface Company {
  id: string;
  name: string;
  currency: string;
  country: string;
  approvalRules: {
    type: 'percentage' | 'specific' | 'hybrid';
    percentage?: number;
    specificApprovers?: string[];
    active: boolean;
  };
}
export interface Currency {
  code: string;
  name: string;
  symbol: string;
}
interface CompanyContextType {
  company: Company | null;
  currencies: Currency[];
  exchangeRates: Record<string, number>;
  users: any[];
  loading: boolean;
  error: string | null;
  updateCompany: (companyData: Partial<Company>) => Promise<void>;
  fetchUsers: () => Promise<void>;
  createUser: (userData: any) => Promise<void>;
  updateUser: (id: string, userData: any) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  updateApprovalRules: (rules: Company['approvalRules']) => Promise<void>;
  convertCurrency: (amount: number, from: string, to: string) => number;
}
const CompanyContext = createContext<CompanyContextType | undefined>(undefined);
export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
export const CompanyProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const {
    currentUser
  } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (currentUser) {
      fetchCompanyData();
      fetchCurrencies();
    }
  }, [currentUser]);
  useEffect(() => {
    if (company) {
      fetchExchangeRates(company.currency);
    }
  }, [company]);
  const fetchCompanyData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const companyData = await companyService.getCompany(currentUser.companyId);
      setCompany(companyData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch company data');
      toast.error('Failed to load company information');
    } finally {
      setLoading(false);
    }
  };
  const fetchCurrencies = async () => {
    setLoading(true);
    try {
      const currencyData = await companyService.getCurrencies();
      setCurrencies(currencyData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch currencies');
      toast.error('Failed to load currency information');
    } finally {
      setLoading(false);
    }
  };
  const fetchExchangeRates = async (baseCurrency: string) => {
    setLoading(true);
    try {
      const rates = await companyService.getExchangeRates(baseCurrency);
      setExchangeRates(rates);
      setError(null);
    } catch (err) {
      setError('Failed to fetch exchange rates');
      toast.error('Failed to load exchange rates');
    } finally {
      setLoading(false);
    }
  };
  const fetchUsers = async () => {
    if (!currentUser || currentUser.role !== 'admin') return;
    setLoading(true);
    try {
      const userData = await companyService.getUsers(currentUser.companyId);
      setUsers(userData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      toast.error('Failed to load user information');
    } finally {
      setLoading(false);
    }
  };
  const updateCompany = async (companyData: Partial<Company>) => {
    if (!currentUser || !company) return;
    setLoading(true);
    try {
      const updatedCompany = await companyService.updateCompany(company.id, companyData);
      setCompany(updatedCompany);
      toast.success('Company information updated');
      // If currency changed, fetch new exchange rates
      if (companyData.currency && companyData.currency !== company.currency) {
        await fetchExchangeRates(companyData.currency);
      }
    } catch (err) {
      setError('Failed to update company');
      toast.error('Failed to update company information');
    } finally {
      setLoading(false);
    }
  };
  const createUser = async (userData: any) => {
    if (!currentUser || currentUser.role !== 'admin' || !company) return;
    setLoading(true);
    try {
      await companyService.createUser({
        ...userData,
        companyId: company.id
      });
      await fetchUsers();
      toast.success('User created successfully');
    } catch (err) {
      setError('Failed to create user');
      toast.error('Failed to create user');
    } finally {
      setLoading(false);
    }
  };
  const updateUser = async (id: string, userData: any) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    setLoading(true);
    try {
      await companyService.updateUser(id, userData);
      await fetchUsers();
      toast.success('User updated successfully');
    } catch (err) {
      setError('Failed to update user');
      toast.error('Failed to update user');
    } finally {
      setLoading(false);
    }
  };
  const deleteUser = async (id: string) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    setLoading(true);
    try {
      await companyService.deleteUser(id);
      await fetchUsers();
      toast.success('User deleted successfully');
    } catch (err) {
      setError('Failed to delete user');
      toast.error('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };
  const updateApprovalRules = async (rules: Company['approvalRules']) => {
    if (!currentUser || currentUser.role !== 'admin' || !company) return;
    setLoading(true);
    try {
      await companyService.updateApprovalRules(company.id, rules);
      setCompany({
        ...company,
        approvalRules: rules
      });
      toast.success('Approval rules updated');
    } catch (err) {
      setError('Failed to update approval rules');
      toast.error('Failed to update approval rules');
    } finally {
      setLoading(false);
    }
  };
  const convertCurrency = (amount: number, from: string, to: string): number => {
    if (from === to) return amount;
    if (!exchangeRates[from] || !exchangeRates[to]) return amount;
    // Convert to base currency first, then to target currency
    const amountInBase = amount / exchangeRates[from];
    return amountInBase * exchangeRates[to];
  };
  const value = {
    company,
    currencies,
    exchangeRates,
    users,
    loading,
    error,
    updateCompany,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    updateApprovalRules,
    convertCurrency
  };
  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
};