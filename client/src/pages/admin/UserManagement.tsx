import React, { useEffect, useState } from 'react';
import { useCompany } from '../../contexts/CompanyContext';
import { PlusIcon, TrashIcon, PencilIcon, UserIcon, SearchIcon } from 'lucide-react';
const UserManagement: React.FC = () => {
  const {
    users,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    loading
  } = useCompany();
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'employee',
    managerId: '',
    isFinance: false,
    isDirector: false
  });
  useEffect(() => {
    fetchUsers();
  }, []);
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'employee',
      managerId: '',
      isFinance: false,
      isDirector: false
    });
    setEditingUser(null);
  };
  const handleEditUser = (user: any) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      managerId: user.managerId || '',
      isFinance: user.isFinance || false,
      isDirector: user.isDirector || false
    });
    setEditingUser(user);
    setShowUserForm(true);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
      } else {
        await createUser(formData);
      }
      setShowUserForm(false);
      resetForm();
    } catch (err) {
      console.error('Failed to save user:', err);
    }
  };
  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
      } catch (err) {
        console.error('Failed to delete user:', err);
      }
    }
  };
  const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()));
  const managers = users.filter(user => user.role === 'manager' || user.role === 'admin');
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage employees, managers, and their roles
        </p>
      </div>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        {/* Header with search and add button */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative rounded-md w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search users..." className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>
          <button onClick={() => {
          resetForm();
          setShowUserForm(true);
        }} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add User
          </button>
        </div>
        {/* Users table */}
        {loading ? <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-500">Loading users...</p>
          </div> : filteredUsers.length > 0 ? <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Manager
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Special Roles
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map(user => <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : user.role === 'manager' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.managerId ? users.find(u => u.id === user.managerId)?.name || 'Unknown' : <span className="text-gray-400">None</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.isFinance && <span className="px-2 mr-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Finance
                        </span>}
                      {user.isDirector && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Director
                        </span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleEditUser(user)} className="text-blue-600 hover:text-blue-900 mr-3">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div> : <div className="p-8 text-center">
            <p className="text-gray-500">
              No users found matching your search.
            </p>
          </div>}
      </div>
      {/* User form modal */}
      {showUserForm && <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input type="text" id="name" value={formData.name} onChange={e => setFormData({
                ...formData,
                name: e.target.value
              })} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input type="email" id="email" value={formData.email} onChange={e => setFormData({
                ...formData,
                email: e.target.value
              })} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select id="role" value={formData.role} onChange={e => setFormData({
                ...formData,
                role: e.target.value
              })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                {formData.role === 'employee' && <div>
                    <label htmlFor="manager" className="block text-sm font-medium text-gray-700">
                      Manager
                    </label>
                    <select id="manager" value={formData.managerId} onChange={e => setFormData({
                ...formData,
                managerId: e.target.value
              })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      <option value="">No Manager</option>
                      {managers.map(manager => <option key={manager.id} value={manager.id}>
                          {manager.name}
                        </option>)}
                    </select>
                  </div>}
                <div className="space-y-2">
                  <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <input id="isFinance" type="checkbox" checked={formData.isFinance} onChange={e => setFormData({
                    ...formData,
                    isFinance: e.target.checked
                  })} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="isFinance" className="font-medium text-gray-700">
                        Finance Approver
                      </label>
                      <p className="text-gray-500">
                        Can approve expenses at the finance step
                      </p>
                    </div>
                  </div>
                  <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <input id="isDirector" type="checkbox" checked={formData.isDirector} onChange={e => setFormData({
                    ...formData,
                    isDirector: e.target.checked
                  })} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="isDirector" className="font-medium text-gray-700">
                        Director Approver
                      </label>
                      <p className="text-gray-500">
                        Can approve expenses at the director step
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-end space-x-3">
                <button type="button" onClick={() => {
              setShowUserForm(false);
              resetForm();
            }} className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Cancel
                </button>
                <button type="submit" className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>}
    </div>;
};
export default UserManagement;