import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Pages
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Orders from '../pages/Orders';
import Production from '../pages/Production';
import Materials from '../pages/Materials';
import Suppliers from '../pages/Suppliers';
import Purchase from '../pages/Purchase';
import Delivery from '../pages/Delivery';
import Users from '../pages/Users';
import OrderTracking from '../pages/OrderTracking';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: '/orders', element: <Orders /> },
      { path: '/orders/:id/tracking', element: <OrderTracking /> },
      { path: '/production', element: <Production /> },
      { path: '/materials', element: <Materials /> },
      { path: '/suppliers', element: <Suppliers /> },
      { path: '/purchase', element: <Purchase /> },
      { path: '/delivery', element: <Delivery /> },
      { path: '/users', element: <Users /> },
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
