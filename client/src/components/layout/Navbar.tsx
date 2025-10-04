import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon, BellIcon, UserCircleIcon, ChevronDownIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
interface NavbarProps {
  onMenuClick: () => void;
}
const Navbar: React.FC<NavbarProps> = ({
  onMenuClick
}) => {
  const {
    currentUser,
    logout
  } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  return <header className="bg-white shadow-sm z-10">
      <div className="px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button type="button" className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100" onClick={onMenuClick}>
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-blue-600">
                  ExpenseFlow
                </span>
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <button type="button" className="p-2 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            {/* Profile dropdown */}
            <div className="ml-3 relative">
              <div>
                <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center text-sm px-2 py-1 rounded-md hover:bg-gray-100 focus:outline-none">
                  <UserCircleIcon className="h-8 w-8 text-gray-500" />
                  <div className="ml-2 hidden md:block">
                    <div className="text-sm font-medium text-gray-700">
                      {currentUser?.name}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {currentUser?.role}
                    </div>
                  </div>
                  <ChevronDownIcon className="ml-1 h-4 w-4 text-gray-400 hidden sm:block" />
                </button>
              </div>
              {showProfileMenu && <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowProfileMenu(false)}>
                    Your Profile
                  </Link>
                  <button onClick={() => {
                logout();
                setShowProfileMenu(false);
              }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign out
                  </button>
                </div>}
            </div>
          </div>
        </div>
      </div>
    </header>;
};
export default Navbar;