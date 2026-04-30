import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import RoleGuard from '../components/RoleGuard';

// Pages
import Login from '../pages/Login';
import DashboardRouter from '../pages/DashboardRouter';
import Orders from '../pages/Orders';
import Production from '../pages/Production';
import Materials from '../pages/Materials';
import Suppliers from '../pages/Suppliers';
import Purchase from '../pages/Purchase';
import Delivery from '../pages/Delivery';
import Users from '../pages/Users';
import OrderTracking from '../pages/OrderTracking';
import SuperAdminDashboard from '../pages/super-admin/SuperAdminDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManagerDashboard from '../pages/manager/ManagerDashboard';
import DeliveryDashboardModule from '../pages/delivery/DeliveryDashboard';
import UserDashboard from '../pages/user/UserDashboard';






const router = createBrowserRouter([
  {
    path: '/',
    element: <RoleGuard><MainLayout /></RoleGuard>,
    children: [
      { index: true, element: <DashboardRouter /> },
      { 
        path: '/orders', 
        element: <RoleGuard allowedRoles={['Super Admin', 'Admin', 'Manager']}><Orders /></RoleGuard> 
      },
      { path: '/orders/:id/tracking', element: <OrderTracking /> },
      { 
        path: '/production', 
        element: <RoleGuard allowedRoles={['Super Admin', 'Admin', 'Manager']}><Production /></RoleGuard> 
      },
      { 
        path: '/materials', 
        element: <RoleGuard allowedRoles={['Super Admin', 'Admin', 'Manager']}><Materials /></RoleGuard> 
      },
      { 
        path: '/suppliers', 
        element: <RoleGuard allowedRoles={['Super Admin', 'Admin', 'Manager']}><Suppliers /></RoleGuard> 
      },
      { 
        path: '/purchase', 
        element: <RoleGuard allowedRoles={['Super Admin', 'Admin']}><Purchase /></RoleGuard> 
      },
      { 
        path: '/delivery', 
        element: <RoleGuard allowedRoles={['Super Admin', 'Admin', 'Delivery Person']}><Delivery /></RoleGuard> 
      },
      { 
        path: '/users', 
        element: <RoleGuard allowedRoles={['Super Admin']}><Users /></RoleGuard> 
      },
      { 
        path: '/super-admin', 
        element: <RoleGuard allowedRoles={['Super Admin']}><SuperAdminDashboard /></RoleGuard> 
      },
      { 
        path: '/admin-dashboard', 
        element: <RoleGuard allowedRoles={['Super Admin', 'Admin']}><AdminDashboard /></RoleGuard> 
      },
      { 
        path: '/manager-dashboard', 
        element: <RoleGuard allowedRoles={['Super Admin', 'Admin', 'Manager']}><ManagerDashboard /></RoleGuard> 
      },
      { 
        path: '/delivery-dashboard', 
        element: <RoleGuard allowedRoles={['Super Admin', 'Admin', 'Delivery Person']}><DeliveryDashboardModule /></RoleGuard> 
      },
      { 
        path: '/user-dashboard', 
        element: <RoleGuard allowedRoles={['Super Admin', 'Admin', 'Customer', 'User', 'CUSTOMER', 'USER']}><UserDashboard /></RoleGuard> 
      },
    ],
  },





  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      { path: '', element: <Login /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;

