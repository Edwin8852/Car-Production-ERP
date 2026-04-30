import React from 'react';
import SuperAdminDashboard from './super-admin/SuperAdminDashboard';
import AdminDashboard from './admin/AdminDashboard';
import ManagerDashboard from './manager/ManagerDashboard';
import DeliveryDashboard from './delivery/DeliveryDashboard';
import UserDashboard from './user/UserDashboard';



const DashboardRouter = () => {
  const role = localStorage.getItem('role');

  // Normalize role name
  const normalizedRole = role?.toUpperCase();

  switch (normalizedRole) {
    case 'SUPER_ADMIN':
    case 'SUPER ADMIN':
      return <SuperAdminDashboard />;
    case 'ADMIN':
      return <AdminDashboard />;
    case 'MANAGER':
      return <ManagerDashboard />;
    case 'DELIVERY_PERSON':
    case 'DELIVERY PERSON':
      return <DeliveryDashboard />;
    case 'USER':
    case 'CUSTOMER':
      return <UserDashboard />;
    default:
      // Fallback to user dashboard for unknown roles
      return <UserDashboard />;
  }
};



export default DashboardRouter;
