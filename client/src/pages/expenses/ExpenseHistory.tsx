import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useExpense } from '../../contexts/ExpenseContext';
import { useCompany } from '../../contexts/CompanyContext';
import { SearchIcon, FilterIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
const ExpenseHistory: React.FC = () => {
  const {
    expenses,
    getUserExpenses,
    loading
  } = useExpense();
  const {
    company
  } = useCompany();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [dateSort, setDateSort] = useState<'asc' | 'desc'>('desc');
  const [filteredExpenses, setFilteredExpenses] = useState(expenses);
  useEffect(() => {
    getUserExpenses();
  }, []);
  useEffect(() => {
    let result = [...expenses];
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(expense => expense.status === statusFilter);
    }
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(expense => expense.description.toLowerCase().includes(term) || expense.category.toLowerCase().includes(term));
    }
    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateSort === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setFilteredExpenses(result);
  }, [expenses, searchTerm, statusFilter, dateSort]);
  const handleDateSortToggle = () => {
    setDateSort(dateSort === 'asc' ? 'desc' : 'asc');
  };
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };
  return <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Expense History
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          View and manage all your submitted expenses
        </p>
      </div>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        {/* Filters and search */}
        <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="relative rounded-md w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search expenses..." className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
            <div className="flex items-center flex-1 sm:flex-none">
              <FilterIcon className="h-4 w-4 text-gray-500 mr-2" />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <button onClick={handleDateSortToggle} className="flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Date
              {dateSort === 'asc' ? <ChevronUpIcon className="ml-1 h-4 w-4" /> : <ChevronDownIcon className="ml-1 h-4 w-4" />}
            </button>
          </div>
        </div>
        {/* Expenses table */}
        {loading ? <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-500">Loading expenses...</p>
          </div> : filteredExpenses.length > 0 ? <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Category
                  </th>
                  <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Current Step
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExpenses.map(expense => <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900 max-w-[120px] sm:max-w-none truncate">
                      <Link to={`/expenses/${expense.id}`} className="hover:text-blue-600">
                        {expense.description}
                      </Link>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden sm:table-cell">
                      {expense.category}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {company?.currency} {expense.amount.toFixed(2)}
                      {expense.originalAmount && <span className="text-xs text-gray-400 hidden sm:block">
                          Originally: {expense.originalCurrency}{' '}
                          {expense.originalAmount.toFixed(2)}
                        </span>}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(expense.status)}`}>
                        {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden md:table-cell">
                      {expense.status === 'pending' ? <span className="capitalize">
                          {expense.currentStep}
                        </span> : expense.status === 'approved' ? <span className="text-green-600">Completed</span> : <span className="text-red-600">Rejected</span>}
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div> : <div className="p-6 sm:p-8 text-center">
            <p className="text-gray-500">
              No expenses found matching your filters.
            </p>
            <Link to="/expenses/submit" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Submit New Expense
            </Link>
          </div>}
      </div>
    </div>;
};
export default ExpenseHistory;