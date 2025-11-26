import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useRedux';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'staff' | 'manager' | 'customer';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isLogin, user } = useAppSelector((state) => state.auth);

  // Redirect to auth page if not logged in
  if (!isLogin) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  // Check role if required
  if (requiredRole && user) {
    const userRoles = user.roles || [];
    const hasRequiredRole = userRoles.includes(requiredRole);
    
    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
