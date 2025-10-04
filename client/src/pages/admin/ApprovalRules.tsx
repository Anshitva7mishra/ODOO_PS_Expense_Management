import React, { useEffect, useState } from 'react';
import { useCompany } from '../../contexts/CompanyContext';
import { SettingsIcon, SaveIcon, PlusIcon, TrashIcon } from 'lucide-react';
const ApprovalRules: React.FC = () => {
  const {
    company,
    users,
    fetchUsers,
    updateApprovalRules,
    loading
  } = useCompany();
  const [ruleType, setRuleType] = useState<'percentage' | 'specific' | 'hybrid'>('percentage');
  const [percentage, setPercentage] = useState(60);
  const [specificApprovers, setSpecificApprovers] = useState<string[]>([]);
  const [active, setActive] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  useEffect(() => {
    fetchUsers();
  }, []);
  useEffect(() => {
    if (company?.approvalRules) {
      setRuleType(company.approvalRules.type);
      setPercentage(company.approvalRules.percentage || 60);
      setSpecificApprovers(company.approvalRules.specificApprovers || []);
      setActive(company.approvalRules.active);
    }
  }, [company]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateApprovalRules({
        type: ruleType,
        percentage: ruleType === 'percentage' || ruleType === 'hybrid' ? percentage : undefined,
        specificApprovers: ruleType === 'specific' || ruleType === 'hybrid' ? specificApprovers : undefined,
        active
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error('Failed to update approval rules:', err);
    }
  };
  const handleApproverToggle = (userId: string) => {
    if (specificApprovers.includes(userId)) {
      setSpecificApprovers(specificApprovers.filter(id => id !== userId));
    } else {
      setSpecificApprovers([...specificApprovers, userId]);
    }
  };
  const getSpecialRoleUsers = () => {
    return users.filter(user => user.isFinance || user.isDirector);
  };
  if (!company) {
    return <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-500">Loading approval rules...</p>
      </div>;
  }
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Approval Rules</h1>
        <p className="mt-1 text-sm text-gray-600">
          Configure conditional approval rules for expense workflows
        </p>
      </div>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <SettingsIcon className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">
              Conditional Approval Rules
            </h2>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rule Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`border rounded-lg p-4 cursor-pointer ${ruleType === 'percentage' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`} onClick={() => setRuleType('percentage')}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Percentage Rule</h3>
                    <input type="radio" checked={ruleType === 'percentage'} onChange={() => setRuleType('percentage')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Auto-approve if a certain percentage of approvers approve
                  </p>
                </div>
                <div className={`border rounded-lg p-4 cursor-pointer ${ruleType === 'specific' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`} onClick={() => setRuleType('specific')}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">
                      Specific Approver Rule
                    </h3>
                    <input type="radio" checked={ruleType === 'specific'} onChange={() => setRuleType('specific')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Auto-approve if specific key people approve
                  </p>
                </div>
                <div className={`border rounded-lg p-4 cursor-pointer ${ruleType === 'hybrid' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`} onClick={() => setRuleType('hybrid')}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Hybrid Rule</h3>
                    <input type="radio" checked={ruleType === 'hybrid'} onChange={() => setRuleType('hybrid')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Auto-approve if either percentage OR specific approvers
                    approve
                  </p>
                </div>
              </div>
            </div>
            {(ruleType === 'percentage' || ruleType === 'hybrid') && <div>
                <label htmlFor="percentage" className="block text-sm font-medium text-gray-700 mb-2">
                  Approval Percentage
                </label>
                <div className="flex items-center">
                  <input type="range" id="percentage" min="1" max="100" value={percentage} onChange={e => setPercentage(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    {percentage}%
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  If {percentage}% of approvers approve, the expense will be
                  auto-approved
                </p>
              </div>}
            {(ruleType === 'specific' || ruleType === 'hybrid') && <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specific Approvers
                </label>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">
                    Select users who can auto-approve expenses:
                  </p>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {getSpecialRoleUsers().length > 0 ? getSpecialRoleUsers().map(user => <div key={user.id} className="flex items-center">
                          <input type="checkbox" id={`user-${user.id}`} checked={specificApprovers.includes(user.id)} onChange={() => handleApproverToggle(user.id)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                          <label htmlFor={`user-${user.id}`} className="ml-2 block text-sm text-gray-900">
                            {user.name}
                            <span className="ml-1 text-xs text-gray-500">
                              {user.isFinance && ' (Finance)'}
                              {user.isDirector && ' (Director)'}
                            </span>
                          </label>
                        </div>) : <p className="text-sm text-gray-500 italic">
                        No users with special roles found. Add Finance or
                        Director roles to users first.
                      </p>}
                  </div>
                </div>
              </div>}
            <div>
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input id="active" type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="active" className="font-medium text-gray-700">
                    Enable Conditional Approval
                  </label>
                  <p className="text-gray-500">
                    When enabled, expenses can be auto-approved based on the
                    rules above
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end">
            {isSaved && <span className="mr-3 text-sm text-green-600">
                Rules saved successfully!
              </span>}
            <button type="submit" disabled={loading} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400">
              {loading ? <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </> : <>
                  <SaveIcon className="mr-2 h-4 w-4" />
                  Save Rules
                </>}
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default ApprovalRules;