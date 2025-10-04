import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../../contexts/AuthContext';
const Layout: React.FC = () => {
  const {
    currentUser
  } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  if (!currentUser) {
    return <Outlet />;
  }
  return <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className="md:hidden">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} isMobile={true} />
      </div>
      {/* Desktop sidebar - always visible */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <Sidebar isOpen={true} setIsOpen={setSidebarOpen} isMobile={false} />
      </div>
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>;
};
export default Layout;