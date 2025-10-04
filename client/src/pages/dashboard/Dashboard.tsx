import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useExpense } from '../../contexts/ExpenseContext';
import {
  PlusIcon,
  FileTextIcon,
  CheckSquareIcon,
  XIcon,
  AlertCircleIcon,
  TrendingUpIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { expenses, pendingApprovals, getUserExpenses, getPendingApprovals } = useExpense();

  const [stats, setStats] = useState({
    totalExpenses: 0,
    pendingExpenses: 0,
    approvedExpenses: 0,
    rejectedExpenses: 0,
  });

  useEffect(() => {
    getUserExpenses();
    if (currentUser?.role !== 'employee') getPendingApprovals();
  }, []);

  useEffect(() => {
    if (expenses) {
      setStats({
        totalExpenses: expenses.length,
        pendingExpenses: expenses.filter((e) => e.status === 'pending').length,
        approvedExpenses: expenses.filter((e) => e.status === 'approved').length,
        rejectedExpenses: expenses.filter((e) => e.status === 'rejected').length,
      });
    }
  }, [expenses]);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
  }: {
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
  }) => (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all duration-200"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Welcome back, {currentUser?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-1 text-sm">
            Here’s an overview of your expense activities.
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link
            to="/expenses/submit"
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Expense
          </Link>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Expenses" value={stats.totalExpenses} icon={FileTextIcon} color="blue" />
        <StatCard title="Pending" value={stats.pendingExpenses} icon={AlertCircleIcon} color="yellow" />
        <StatCard title="Approved" value={stats.approvedExpenses} icon={CheckSquareIcon} color="green" />
        <StatCard title="Rejected" value={stats.rejectedExpenses} icon={XIcon} color="red" />
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <motion.div whileHover={{ y: -3 }}>
            <Link
              to="/expenses/submit"
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center"
            >
              <div className="bg-blue-100 p-3 rounded-full">
                <PlusIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="font-semibold text-gray-900">Submit New Expense</p>
                <p className="text-sm text-gray-500">Create a new report for approval</p>
              </div>
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -3 }}>
            <Link
              to="/expenses/history"
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center"
            >
              <div className="bg-indigo-100 p-3 rounded-full">
                <FileTextIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="font-semibold text-gray-900">View Expense History</p>
                <p className="text-sm text-gray-500">Check your past submissions</p>
              </div>
            </Link>
          </motion.div>

          {currentUser?.role !== 'employee' && (
            <motion.div whileHover={{ y: -3 }}>
              <Link
                to="/approvals"
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center"
              >
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckSquareIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">Pending Approvals</p>
                  <p className="text-sm text-gray-500">
                    {pendingApprovals.length} item
                    {pendingApprovals.length !== 1 ? 's' : ''} awaiting review
                  </p>
                </div>
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* Recent Expenses */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
          <Link
            to="/expenses/history"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 transition"
          >
            View all
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {expenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Date', 'Description', 'Category', 'Amount', 'Status'].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {expenses.slice(0, 5).map((expense) => (
                    <motion.tr
                      key={expense.id}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      className="transition cursor-pointer"
                    >
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium truncate max-w-[150px]">
                        <Link to={`/expenses/${expense.id}`} className="hover:text-blue-600">
                          {expense.description}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{expense.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">${expense.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 inline-flex text-xs font-medium rounded-full ${
                            expense.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : expense.status === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10">
              <TrendingUpIcon className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No expenses yet. Start by creating your first one!</p>
              <Link
                to="/expenses/submit"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
              >
                <PlusIcon className="h-4 w-4 mr-2" /> Submit Expense
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
