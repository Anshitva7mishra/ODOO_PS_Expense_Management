import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useExpense } from '../../contexts/ExpenseContext';
import { PlusIcon, FileTextIcon, CheckSquareIcon, XIcon, AlertCircleIcon } from 'lucide-react';
const Dashboard: React.FC = () => {
  const {
    currentUser
  } = useAuth();
  const {
    expenses,
    pendingApprovals,
    getUserExpenses,
    getPendingApprovals
  } = useExpense();
  const [stats, setStats] = useState({
    totalExpenses: 0,
    pendingExpenses: 0,
    approvedExpenses: 0,
    rejectedExpenses: 0
  });
  useEffect(() => {
    getUserExpenses();
    if (currentUser?.role !== 'employee') {
      getPendingApprovals();
    }
  }, []);
  useEffect(() => {
    if (expenses) {
      setStats({
        totalExpenses: expenses.length,
        pendingExpenses: expenses.filter(e => e.status === 'pending').length,
        approvedExpenses: expenses.filter(e => e.status === 'approved').length,
        rejectedExpenses: expenses.filter(e => e.status === 'rejected').length
      });
    }
  }, [expenses]);
  return <div>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back, {currentUser?.name}!
        </p>
      </div>
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <FileTextIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Expenses
              </p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                {stats.totalExpenses}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <AlertCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                {stats.pendingExpenses}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckSquareIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                {stats.approvedExpenses}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full">
              <XIcon className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                {stats.rejectedExpenses}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link to="/expenses/submit" className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <PlusIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="font-medium text-gray-900">Submit New Expense</p>
              <p className="text-sm text-gray-600">
                Create a new expense report
              </p>
            </div>
          </Link>
          <Link to="/expenses/history" className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <FileTextIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="font-medium text-gray-900">View Expense History</p>
              <p className="text-sm text-gray-600">Check your past expenses</p>
            </div>
          </Link>
          {currentUser?.role !== 'employee' && <Link to="/approvals" className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <CheckSquareIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900">Pending Approvals</p>
                <p className="text-sm text-gray-600">
                  {pendingApprovals.length} expense
                  {pendingApprovals.length !== 1 ? 's' : ''} awaiting your
                  approval
                </p>
              </div>
            </Link>}
        </div>
      </div>
      {/* Recent expenses */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Expenses</h2>
          <Link to="/expenses/history" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View all
          </Link>
        </div>
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
          {expenses.length > 0 ? <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Category
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.slice(0, 5).map(expense => <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900 max-w-[120px] sm:max-w-none truncate">
                        <Link to={`/expenses/${expense.id}`} className="hover:text-blue-600">
                          {expense.description}
                        </Link>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden sm:table-cell">
                        {expense.category}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        ${expense.amount.toFixed(2)}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${expense.status === 'approved' ? 'bg-green-100 text-green-800' : expense.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                        </span>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div> : <div className="px-4 sm:px-6 py-6 sm:py-8 text-center">
              <p className="text-gray-500">
                No expenses found. Create your first expense!
              </p>
              <Link to="/expenses/submit" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <PlusIcon className="mr-2 h-4 w-4" />
                Submit Expense
              </Link>
            </div>}
        </div>
      </div>
    </div>;
};
export default Dashboard;