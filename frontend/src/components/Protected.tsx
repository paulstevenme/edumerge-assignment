import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { getStoredUser, hasRole, type Role } from '../lib/auth';

type ProtectedProps = {
  children: ReactNode;
  allowedRoles?: Role[];
};

export default function Protected({ children, allowedRoles }: ProtectedProps) {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  if (allowedRoles?.length && !hasRole(user, allowedRoles)) {
    return <div className="container">You do not have permission to access this page.</div>;
  }

  return <>{children}</>;
}