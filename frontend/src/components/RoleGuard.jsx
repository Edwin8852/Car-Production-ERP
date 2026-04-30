import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const RoleGuard = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Check normalized roles as well
    const normalizedRole = role?.toUpperCase();
    const normalizedAllowed = allowedRoles.map(r => r.toUpperCase());
    
    if (!normalizedAllowed.includes(normalizedRole)) {
      // If user is logged in but doesn't have the right role, redirect to their default dashboard
      return <Navigate to="/" replace />;
    }
  }


  return children;
};

export default RoleGuard;
