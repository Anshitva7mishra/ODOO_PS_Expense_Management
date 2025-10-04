import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { App } from './App';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import ExpenseSubmission from './pages/expenses/ExpenseSubmission';
import ExpenseHistory from './pages/expenses/ExpenseHistory';
import UserManagement from './pages/admin/UserManagement';
import ApprovalManagement from './pages/approvals/ApprovalManagement';
import ExpenseDetails from './pages/expenses/ExpenseDetails';
import CompanySettings from './pages/admin/CompanySettings';
import ApprovalRules from './pages/admin/ApprovalRules';
import Profile from './pages/profile/Profile';
import PrivateRoute from './components/auth/PrivateRoute';
import Layout from './components/layout/Layout';
export function AppRouter() {
  return <BrowserRouter>
      <App>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<PrivateRoute>
                <Layout />
              </PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="expenses">
              <Route path="submit" element={<ExpenseSubmission />} />
              <Route path="history" element={<ExpenseHistory />} />
              <Route path=":id" element={<ExpenseDetails />} />
            </Route>
            <Route path="approvals" element={<ApprovalManagement />} />
            <Route path="admin">
              <Route path="users" element={<UserManagement />} />
              <Route path="company" element={<CompanySettings />} />
              <Route path="rules" element={<ApprovalRules />} />
            </Route>
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </App>
    </BrowserRouter>;
}