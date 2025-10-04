import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
interface PrivateRouteProps {
  children?: React.ReactNode;
  requiredRole?: 'admin' | 'manager' | 'employee' | Array<'admin' | 'manager' | 'employee'>;
}
const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  requiredRole = 'employee'
}) => {
  const {
    currentUser,
    loading
  } = useAuth();
  if (loading) {
    return <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>;
  }
  // If not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  // If role check is required
  if (requiredRole) {
    const hasRequiredRole = Array.isArray(requiredRole) ? requiredRole.includes(currentUser.role) : requiredRole === 'employee' || requiredRole === 'manager' && ['manager', 'admin'].includes(currentUser.role) || requiredRole === 'admin' && currentUser.role === 'admin';
    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }
  return children ? <>{children}</> : <Outlet />;
};
export default PrivateRoute;