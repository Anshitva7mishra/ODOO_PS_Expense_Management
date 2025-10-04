import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useExpense } from '../../contexts/ExpenseContext';
import { useCompany } from '../../contexts/CompanyContext';
import {
  SearchIcon,
  FilterIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from 'lucide-react';

const ExpenseHistory: React.FC = () => {
  const { expenses, getUserExpenses, loading } = useExpense();
  const { company } = useCompany();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [dateSort, setDateSort] = useState<'asc' | 'desc'>('desc');
  const [filteredExpenses, setFilteredExpenses] = useState(expenses);

  useEffect(() => {
    getUserExpenses();
  }, []);

  useEffect(() => {
    let result = [...expenses];
    if (statusFilter !== 'all') {
      result = result.filter(expense => expense.status === statusFilter);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        expense =>
          expense.description.toLowerCase().includes(term) ||
          expense.category.toLowerCase().includes(term)
      );
    }
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateSort === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setFilteredExpenses(result);
  }, [expenses, searchTerm, statusFilter, dateSort]);

  const handleDateSortToggle = () => setDateSort(dateSort === 'asc' ? 'desc' : 'asc');

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 text-green-700 border border-green-100';
      case 'rejected':
        return 'bg-red-50 text-red-700 border border-red-100';
      default:
        return 'bg-yellow-50 text-yellow-700 border border-yellow-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Expense History</h1>
          <p className="mt-2 text-gray-500">View and manage all your submitted expenses professionally</p>
        </div>

        {/* Card */}
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-200">
          {/* Filters */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-80">
              <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search expenses..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center flex-1 sm:flex-none">
                <FilterIcon className="h-5 w-5 text-gray-500 mr-2" />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as any)}
                  className="block w-full py-2 pl-3 pr-10 border-gray-300 text-gray-700 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <button
                onClick={handleDateSortToggle}
                className="flex items-center px-5 py-2 border border-gray-300 rounded-xl bg-white text-gray-700 text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow transition"
              >
                Date
                {dateSort === 'asc' ? (
                  <ChevronUpIcon className="ml-2 h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Expenses Table */}
          {loading ? (
            <div className="p-16 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-500"></div>
              <p className="mt-4 text-gray-500 text-lg">Loading your premium expenses...</p>
            </div>
          ) : filteredExpenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    {['Date', 'Description', 'Category', 'Amount', 'Status', 'Current Step'].map((header, idx) => (
                      <th
                        key={idx}
                        className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${
                          header === 'Category' || header === 'Current Step' ? 'hidden sm:table-cell' : ''
                        }`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredExpenses.map(expense => (
                    <tr key={expense.id} className="hover:bg-gray-50 transition-all duration-200">
                      <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 truncate max-w-[150px] sm:max-w-none">
                        <Link
                          to={`/expenses/${expense.id}`}
                          className="hover:text-blue-600 transition"
                          title={expense.description}
                        >
                          {expense.description}
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 hidden sm:table-cell">{expense.category}</td>
                      <td className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {company?.currency} {expense.amount.toFixed(2)}
                        {expense.originalAmount && (
                          <span className="block text-xs text-gray-400 mt-1">
                            Originally: {expense.originalCurrency} {expense.originalAmount.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full shadow-sm ${getStatusClass(
                            expense.status
                          )}`}
                        >
                          {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 hidden sm:table-cell">
                        {expense.status === 'pending' ? (
                          <span className="capitalize">{expense.currentStep}</span>
                        ) : expense.status === 'approved' ? (
                          <span className="text-green-600 font-semibold">Completed</span>
                        ) : (
                          <span className="text-red-600 font-semibold">Rejected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 text-center bg-gray-50 rounded-b-3xl">
              <p className="text-gray-500 mb-6 text-lg">No expenses match your filters.</p>
              <Link
                to="/expenses/submit"
                className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-xl shadow-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                Submit New Expense
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseHistory;
