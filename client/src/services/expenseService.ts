import { Expense, ApprovalStatus, ApprovalStep } from '../contexts/ExpenseContext';
import { v4 as uuidv4 } from 'uuid';
// Mock data
let mockExpenses: Expense[] = [];
// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export const expenseService = {
  getUserExpenses: async (userId: string): Promise<Expense[]> => {
    await delay(800); // Simulate API delay
    return mockExpenses.filter(expense => expense.userId === userId);
  },
  getPendingApprovals: async (approverId: string): Promise<Expense[]> => {
    await delay(800); // Simulate API delay
    // In a real app, this would filter based on the current step and approver role
    // For this demo, we'll return all pending expenses
    return mockExpenses.filter(expense => expense.status === 'pending');
  },
  submitExpense: async (expenseData: Partial<Expense>): Promise<Expense> => {
    await delay(1000); // Simulate API delay
    const now = new Date().toISOString();
    const newExpense: Expense = {
      id: uuidv4(),
      userId: expenseData.userId || '',
      userName: expenseData.userName || '',
      amount: expenseData.amount || 0,
      originalAmount: expenseData.originalAmount,
      originalCurrency: expenseData.originalCurrency,
      category: expenseData.category || 'Uncategorized',
      description: expenseData.description || '',
      date: expenseData.date || now.split('T')[0],
      receiptUrl: expenseData.receiptUrl,
      status: 'pending',
      currentStep: 'manager',
      approvals: [],
      createdAt: now,
      updatedAt: now
    };
    mockExpenses.push(newExpense);
    return newExpense;
  },
  approveExpense: async (id: string, approverId: string, comment?: string): Promise<Expense> => {
    await delay(800); // Simulate API delay
    const index = mockExpenses.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Expense not found');
    const expense = {
      ...mockExpenses[index]
    };
    const now = new Date().toISOString();
    // Add approval to the approvals array
    expense.approvals.push({
      step: expense.currentStep,
      approverId,
      status: 'approved',
      comment,
      date: now
    });
    // Update the current step based on the approval workflow
    if (expense.currentStep === 'manager') {
      expense.currentStep = 'finance';
    } else if (expense.currentStep === 'finance') {
      expense.currentStep = 'director';
    } else if (expense.currentStep === 'director') {
      expense.status = 'approved';
    }
    expense.updatedAt = now;
    mockExpenses[index] = expense;
    return expense;
  },
  rejectExpense: async (id: string, approverId: string, comment: string): Promise<Expense> => {
    await delay(800); // Simulate API delay
    const index = mockExpenses.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Expense not found');
    const expense = {
      ...mockExpenses[index]
    };
    const now = new Date().toISOString();
    // Add rejection to the approvals array
    expense.approvals.push({
      step: expense.currentStep,
      approverId,
      status: 'rejected',
      comment,
      date: now
    });
    // Update the status to rejected
    expense.status = 'rejected';
    expense.updatedAt = now;
    mockExpenses[index] = expense;
    return expense;
  },
  processReceipt: async (file: File): Promise<Partial<Expense>> => {
    await delay(2000); // Simulate OCR processing delay
    // Mock OCR result - in a real app this would use Tesseract.js or a similar library
    return {
      amount: Math.floor(Math.random() * 1000) + 50,
      date: new Date().toISOString().split('T')[0],
      description: 'Business lunch at Restaurant XYZ',
      category: 'Meals'
    };
  }
};