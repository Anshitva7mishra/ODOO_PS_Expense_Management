import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, UsersIcon, FileTextIcon, CheckSquareIcon, SettingsIcon, LogOutIcon, XIcon, BuildingIcon, BookIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isMobile: boolean;
}
const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  setIsOpen,
  isMobile
}) => {
  const {
    currentUser,
    logout
  } = useAuth();
  const location = useLocation();
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  const navItems = [{
    name: 'Dashboard',
    href: '/',
    icon: HomeIcon,
    roles: ['admin', 'manager', 'employee']
  }, {
    name: 'Submit Expense',
    href: '/expenses/submit',
    icon: FileTextIcon,
    roles: ['admin', 'manager', 'employee']
  }, {
    name: 'Expense History',
    href: '/expenses/history',
    icon: BookIcon,
    roles: ['admin', 'manager', 'employee']
  }, {
    name: 'Approvals',
    href: '/approvals',
    icon: CheckSquareIcon,
    roles: ['admin', 'manager']
  }, {
    name: 'User Management',
    href: '/admin/users',
    icon: UsersIcon,
    roles: ['admin']
  }, {
    name: 'Company Settings',
    href: '/admin/company',
    icon: BuildingIcon,
    roles: ['admin']
  }, {
    name: 'Approval Rules',
    href: '/admin/rules',
    icon: SettingsIcon,
    roles: ['admin']
  }];
  const filteredNavItems = navItems.filter(item => item.roles.includes(currentUser?.role || 'employee'));
  // Different class for mobile vs desktop sidebar
  const sidebarClasses = isMobile ? `fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}` : 'h-full bg-white shadow-lg flex flex-col';
  return <>
      {/* Mobile backdrop */}
      {isMobile && isOpen && <div className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75" onClick={() => setIsOpen(false)}></div>}
      {/* Sidebar */}
      <div className={sidebarClasses}>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="px-4 py-5 flex items-center justify-between border-b">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">
                ExpenseFlow
              </span>
            </Link>
            {isMobile && <button className="text-gray-500 hover:text-gray-600" onClick={() => setIsOpen(false)}>
                <XIcon className="h-6 w-6" />
              </button>}
          </div>
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {filteredNavItems.map(item => <Link key={item.name} to={item.href} className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md ${isActive(item.href) ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`} onClick={() => isMobile && setIsOpen(false)}>
                <item.icon className={`mr-3 h-5 w-5 ${isActive(item.href) ? 'text-blue-500' : 'text-gray-400'}`} />
                {item.name}
              </Link>)}
          </nav>
          {/* Logout button */}
          <div className="border-t p-4">
            <button onClick={() => {
            logout();
            if (isMobile) setIsOpen(false);
          }} className="flex items-center px-4 py-2.5 w-full text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900">
              <LogOutIcon className="mr-3 h-5 w-5 text-gray-400" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>;
};
export default Sidebar;