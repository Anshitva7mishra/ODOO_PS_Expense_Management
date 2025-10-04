import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useExpense } from '../../contexts/ExpenseContext';
import { useCompany } from '../../contexts/CompanyContext';
import { useAuth } from '../../contexts/AuthContext';
import { CheckIcon, XIcon, EyeIcon, FilterIcon } from 'lucide-react';
const ApprovalManagement: React.FC = () => {
  const {
    pendingApprovals,
    getPendingApprovals,
    approveExpense,
    rejectExpense,
    loading
  } = useExpense();
  const {
    company
  } = useCompany();
  const {
    currentUser
  } = useAuth();
  const [stepFilter, setStepFilter] = useState<'all' | 'manager' | 'finance' | 'director'>('all');
  const [comment, setComment] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [filteredApprovals, setFilteredApprovals] = useState(pendingApprovals);
  useEffect(() => {
    getPendingApprovals();
  }, []);
  useEffect(() => {
    let result = [...pendingApprovals];
    // Apply step filter
    if (stepFilter !== 'all') {
      result = result.filter(expense => expense.currentStep === stepFilter);
    }
    // Filter by role - only show expenses that the current user can approve
    if (currentUser?.role !== 'admin') {
      result = result.filter(expense => {
        if (expense.currentStep === 'manager' && currentUser?.role === 'manager') return true;
        if (expense.currentStep === 'finance' && currentUser?.isFinance) return true;
        if (expense.currentStep === 'director' && currentUser?.isDirector) return true;
        return false;
      });
    }
    setFilteredApprovals(result);
  }, [pendingApprovals, stepFilter, currentUser]);
  const handleApprove = async (id: string) => {
    try {
      await approveExpense(id);
      getPendingApprovals();
    } catch (err) {
      console.error('Failed to approve expense:', err);
    }
  };
  const handleReject = async (id: string) => {
    if (!comment) {
      alert('Please provide a reason for rejection');
      return;
    }
    try {
      await rejectExpense(id, comment);
      setRejectingId(null);
      setComment('');
      getPendingApprovals();
    } catch (err) {
      console.error('Failed to reject expense:', err);
    }
  };
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
        <p className="mt-1 text-sm text-gray-600">
          Review and approve expense submissions
        </p>
      </div>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center">
            <FilterIcon className="h-4 w-4 text-gray-500 mr-2" />
            <select value={stepFilter} onChange={e => setStepFilter(e.target.value as any)} className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option value="all">All Steps</option>
              <option value="manager">Manager Approval</option>
              <option value="finance">Finance Approval</option>
              <option value="director">Director Approval</option>
            </select>
          </div>
          <div className="text-sm text-gray-500">
            {filteredApprovals.length} pending approval
            {filteredApprovals.length !== 1 ? 's' : ''}
          </div>
        </div>
        {/* Approvals list */}
        {loading ? <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-500">Loading approvals...</p>
          </div> : filteredApprovals.length > 0 ? <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Step
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApprovals.map(expense => <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {expense.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {company?.currency} {expense.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                        {expense.currentStep}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link to={`/expenses/${expense.id}`} className="text-blue-600 hover:text-blue-900">
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        <button onClick={() => handleApprove(expense.id)} className="text-green-600 hover:text-green-900">
                          <CheckIcon className="h-5 w-5" />
                        </button>
                        <button onClick={() => setRejectingId(expense.id)} className="text-red-600 hover:text-red-900">
                          <XIcon className="h-5 w-5" />
                        </button>
                      </div>
                      {/* Rejection comment input */}
                      {rejectingId === expense.id && <div className="mt-2">
                          <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Reason for rejection (required)" className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500" rows={2} />
                          <div className="mt-2 flex space-x-2">
                            <button onClick={() => handleReject(expense.id)} disabled={!comment} className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300">
                              Confirm
                            </button>
                            <button onClick={() => {
                      setRejectingId(null);
                      setComment('');
                    }} className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                              Cancel
                            </button>
                          </div>
                        </div>}
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div> : <div className="p-8 text-center">
            <p className="text-gray-500">No pending approvals found.</p>
          </div>}
      </div>
    </div>;
};
export default ApprovalManagement;