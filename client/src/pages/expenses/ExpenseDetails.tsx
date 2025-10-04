import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExpense } from '../../contexts/ExpenseContext';
import { useCompany } from '../../contexts/CompanyContext';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeftIcon, CheckIcon, XIcon, FileTextIcon, CalendarIcon, TagIcon, DollarSignIcon, ClockIcon, UserIcon } from 'lucide-react';
const ExpenseDetails: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const {
    getExpenseById,
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
  const [expense, setExpense] = useState<any>(null);
  const [comment, setComment] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  useEffect(() => {
    if (id) {
      const expenseData = getExpenseById(id);
      if (expenseData) {
        setExpense(expenseData);
      } else {
        navigate('/expenses/history');
      }
    }
  }, [id, getExpenseById, navigate]);
  const handleApprove = async () => {
    if (!id) return;
    try {
      await approveExpense(id);
      // Refresh expense data
      const updatedExpense = getExpenseById(id);
      setExpense(updatedExpense);
    } catch (err) {
      console.error('Failed to approve expense:', err);
    }
  };
  const handleReject = async () => {
    if (!id || !comment) return;
    try {
      await rejectExpense(id, comment);
      // Refresh expense data
      const updatedExpense = getExpenseById(id);
      setExpense(updatedExpense);
      setShowRejectForm(false);
      setComment('');
    } catch (err) {
      console.error('Failed to reject expense:', err);
    }
  };
  const canApprove = () => {
    if (!currentUser || !expense) return false;
    if (expense.status !== 'pending') return false;
    // Admin can approve any step
    if (currentUser.role === 'admin') return true;
    // Check if user has the right role for the current step
    if (expense.currentStep === 'manager' && currentUser.role === 'manager') return true;
    if (expense.currentStep === 'finance' && currentUser.isFinance) return true;
    if (expense.currentStep === 'director' && currentUser.isDirector) return true;
    return false;
  };
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };
  const getStepBadgeClass = (step: string) => {
    switch (step) {
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'finance':
        return 'bg-purple-100 text-purple-800';
      case 'director':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  if (!expense) {
    return <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>;
  }
  return <div>
      <div className="mb-4 sm:mb-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500">
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Back
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
          Expense Details
        </h1>
      </div>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
              <FileTextIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="ml-3 sm:ml-4">
              <h2 className="text-base sm:text-lg font-medium text-gray-900">
                {expense.description}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Submitted by {expense.userName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className={`px-2 sm:px-3 py-1 inline-flex text-xs sm:text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(expense.status)}`}>
              {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
            </span>
            {expense.status === 'pending' && <span className={`px-2 sm:px-3 py-1 inline-flex text-xs sm:text-sm leading-5 font-semibold rounded-full ${getStepBadgeClass(expense.currentStep)}`}>
                {expense.currentStep.charAt(0).toUpperCase() + expense.currentStep.slice(1)}{' '}
                Review
              </span>}
          </div>
        </div>
        {/* Content */}
        <div className="px-4 sm:px-6 py-4 sm:py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                Expense Information
              </h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 flex items-center">
                    <DollarSignIcon className="mr-1 h-3 sm:h-4 w-3 sm:w-4" />{' '}
                    Amount
                  </dt>
                  <dd className="mt-1 text-xs sm:text-sm text-gray-900">
                    {company?.currency} {expense.amount.toFixed(2)}
                    {expense.originalAmount && <span className="text-xs text-gray-500 block">
                        Originally: {expense.originalCurrency}{' '}
                        {expense.originalAmount.toFixed(2)}
                      </span>}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 flex items-center">
                    <TagIcon className="mr-1 h-3 sm:h-4 w-3 sm:w-4" /> Category
                  </dt>
                  <dd className="mt-1 text-xs sm:text-sm text-gray-900">
                    {expense.category}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 flex items-center">
                    <CalendarIcon className="mr-1 h-3 sm:h-4 w-3 sm:w-4" /> Date
                  </dt>
                  <dd className="mt-1 text-xs sm:text-sm text-gray-900">
                    {new Date(expense.date).toLocaleDateString()}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 flex items-center">
                    <ClockIcon className="mr-1 h-3 sm:h-4 w-3 sm:w-4" />{' '}
                    Submitted
                  </dt>
                  <dd className="mt-1 text-xs sm:text-sm text-gray-900">
                    {new Date(expense.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs sm:text-sm font-medium text-gray-500">
                    Description
                  </dt>
                  <dd className="mt-1 text-xs sm:text-sm text-gray-900">
                    {expense.description}
                  </dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                Receipt
              </h3>
              {expense.receiptUrl ? <div className="border border-gray-200 rounded-md overflow-hidden">
                  <img src={expense.receiptUrl} alt="Receipt" className="w-full h-auto object-contain max-h-48 sm:max-h-64" />
                </div> : <div className="border border-gray-200 rounded-md p-4 sm:p-6 flex items-center justify-center bg-gray-50 h-32 sm:h-48">
                  <p className="text-xs sm:text-sm text-gray-500">
                    No receipt attached
                  </p>
                </div>}
            </div>
          </div>
          {/* Approval History */}
          <div className="mt-6 sm:mt-8">
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
              Approval History
            </h3>
            {expense.approvals && expense.approvals.length > 0 ? <div className="bg-gray-50 rounded-md overflow-hidden border border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {expense.approvals.map((approval: any, index: number) => <li key={index} className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <UserIcon className="h-4 sm:h-5 w-4 sm:w-5 text-gray-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-xs sm:text-sm font-medium text-gray-900">
                              {approval.step.charAt(0).toUpperCase() + approval.step.slice(1)}{' '}
                              Review
                            </p>
                            <p className="text-xs text-gray-500">
                              {approval.approverName || 'System'} •{' '}
                              {approval.date ? new Date(approval.date).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${approval.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                        </span>
                      </div>
                      {approval.comment && <div className="mt-2 ml-0 sm:ml-8">
                          <p className="text-xs sm:text-sm text-gray-600">
                            "{approval.comment}"
                          </p>
                        </div>}
                    </li>)}
                </ul>
              </div> : <p className="text-xs sm:text-sm text-gray-500">
                No approval history yet
              </p>}
          </div>
          {/* Approval Actions */}
          {canApprove() && <div className="mt-6 sm:mt-8 border-t border-gray-200 pt-4 sm:pt-6">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">
                Actions
              </h3>
              <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4">
                <button onClick={handleApprove} disabled={loading} className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <CheckIcon className="mr-2 h-4 w-4" />
                  Approve
                </button>
                <button onClick={() => setShowRejectForm(true)} disabled={loading} className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  <XIcon className="mr-2 h-4 w-4" />
                  Reject
                </button>
              </div>
              {showRejectForm && <div className="mt-4 bg-gray-50 p-3 sm:p-4 rounded-md border border-gray-200">
                  <label htmlFor="comment" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Reason for rejection (required)
                  </label>
                  <textarea id="comment" rows={3} className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md" value={comment} onChange={e => setComment(e.target.value)} placeholder="Please provide a reason for rejecting this expense"></textarea>
                  <div className="mt-3 flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
                    <button onClick={handleReject} disabled={!comment || loading} className="inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300">
                      Confirm Rejection
                    </button>
                    <button onClick={() => {
                setShowRejectForm(false);
                setComment('');
              }} className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Cancel
                    </button>
                  </div>
                </div>}
            </div>}
        </div>
      </div>
    </div>;
};
export default ExpenseDetails;