import React, { useEffect, useState, createContext, useContext } from 'react';
import { expenseService } from '../services/expenseService';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type ApprovalStep = 'manager' | 'finance' | 'director';
export interface Expense {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  originalAmount?: number;
  originalCurrency?: string;
  category: string;
  description: string;
  date: string;
  receiptUrl?: string;
  status: ApprovalStatus;
  currentStep: ApprovalStep;
  approvals: {
    step: ApprovalStep;
    approverId?: string;
    approverName?: string;
    status: ApprovalStatus;
    comment?: string;
    date?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
interface ExpenseContextType {
  expenses: Expense[];
  pendingApprovals: Expense[];
  loading: boolean;
  error: string | null;
  submitExpense: (expenseData: Partial<Expense>) => Promise<void>;
  getExpenseById: (id: string) => Expense | undefined;
  getUserExpenses: () => Promise<void>;
  getPendingApprovals: () => Promise<void>;
  approveExpense: (id: string, comment?: string) => Promise<void>;
  rejectExpense: (id: string, comment: string) => Promise<void>;
  processReceipt: (file: File) => Promise<Partial<Expense>>;
}
const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);
export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
export const ExpenseProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const {
    currentUser
  } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (currentUser) {
      getUserExpenses();
      if (currentUser.role !== 'employee') {
        getPendingApprovals();
      }
    }
  }, [currentUser]);
  const getUserExpenses = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const userExpenses = await expenseService.getUserExpenses(currentUser.id);
      setExpenses(userExpenses);
      setError(null);
    } catch (err) {
      setError('Failed to fetch expenses');
      toast.error('Failed to load your expenses');
    } finally {
      setLoading(false);
    }
  };
  const getPendingApprovals = async () => {
    if (!currentUser || currentUser.role === 'employee') return;
    setLoading(true);
    try {
      const approvals = await expenseService.getPendingApprovals(currentUser.id);
      setPendingApprovals(approvals);
      setError(null);
    } catch (err) {
      setError('Failed to fetch pending approvals');
      toast.error('Failed to load pending approvals');
    } finally {
      setLoading(false);
    }
  };
  const submitExpense = async (expenseData: Partial<Expense>) => {
    if (!currentUser) return;
    setLoading(true);
    try {
      await expenseService.submitExpense({
        ...expenseData,
        userId: currentUser.id,
        userName: currentUser.name
      });
      await getUserExpenses();
      toast.success('Expense submitted successfully');
    } catch (err) {
      setError('Failed to submit expense');
      toast.error('Failed to submit expense');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const getExpenseById = (id: string) => {
    return expenses.find(expense => expense.id === id) || pendingApprovals.find(expense => expense.id === id);
  };
  const approveExpense = async (id: string, comment?: string) => {
    setLoading(true);
    try {
      await expenseService.approveExpense(id, currentUser?.id || '', comment);
      if (currentUser?.role !== 'employee') {
        await getPendingApprovals();
      }
      toast.success('Expense approved');
    } catch (err) {
      setError('Failed to approve expense');
      toast.error('Failed to approve expense');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const rejectExpense = async (id: string, comment: string) => {
    setLoading(true);
    try {
      await expenseService.rejectExpense(id, currentUser?.id || '', comment);
      if (currentUser?.role !== 'employee') {
        await getPendingApprovals();
      }
      toast.success('Expense rejected');
    } catch (err) {
      setError('Failed to reject expense');
      toast.error('Failed to reject expense');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const processReceipt = async (file: File): Promise<Partial<Expense>> => {
    setLoading(true);
    try {
      const result = await expenseService.processReceipt(file);
      setError(null);
      return result;
    } catch (err) {
      setError('Failed to process receipt');
      toast.error('Failed to process receipt');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const value = {
    expenses,
    pendingApprovals,
    loading,
    error,
    submitExpense,
    getExpenseById,
    getUserExpenses,
    getPendingApprovals,
    approveExpense,
    rejectExpense,
    processReceipt
  };
  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};