import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { getCurrentUser } from '../modules/auth/auth.service';

const AuthLayout = () => {
  const token = getCurrentUser();

  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-layout">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
