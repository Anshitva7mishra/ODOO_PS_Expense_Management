import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ExpenseProvider } from './contexts/ExpenseContext';
import { CompanyProvider } from './contexts/CompanyContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
interface AppProps {
  children: React.ReactNode;
}
export function App({
  children
}: AppProps) {
  return <AuthProvider>
      <CompanyProvider>
        <ExpenseProvider>
          <ToastContainer position="top-right" autoClose={3000} />
          {children}
        </ExpenseProvider>
      </CompanyProvider>
    </AuthProvider>;
}