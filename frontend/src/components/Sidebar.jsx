import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Factory, 
  Package, 
  Users, 
  CreditCard, 
  Truck,
  Shield,
  LogOut
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const role = localStorage.getItem('role')?.toUpperCase() || '';

  const navItems = [
    { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'DELIVERY_PERSON', 'USER', 'STAFF', 'SUPER ADMIN', 'DELIVERY PERSON'] },
    { path: '/orders', name: 'Orders', icon: <ShoppingCart size={20} />, roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPER ADMIN'] },
    { path: '/production', name: 'Production', icon: <Factory size={20} />, roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPER ADMIN'] },
    { path: '/materials', name: 'Materials', icon: <Package size={20} />, roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPER ADMIN'] },
    { path: '/suppliers', name: 'Suppliers', icon: <Users size={20} />, roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SUPER ADMIN'] },
    { path: '/purchase', name: 'Purchase', icon: <CreditCard size={20} />, roles: ['SUPER_ADMIN', 'ADMIN', 'SUPER ADMIN'] },
    { path: '/delivery', name: 'Delivery', icon: <Truck size={20} />, roles: ['SUPER_ADMIN', 'ADMIN', 'DELIVERY_PERSON', 'SUPER ADMIN', 'DELIVERY PERSON'] },
    { path: '/users', name: 'Users (Admin)', icon: <Shield size={20} />, roles: ['SUPER_ADMIN', 'SUPER ADMIN'] },
  ];

  const filteredItems = navItems.filter(item => 
    !item.roles || item.roles.includes(role)
  );


  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <Factory size={24} color="var(--accent-primary)" />
        </div>
        <h2>Auto ERP</h2>
      </div>
      
      <div className="sidebar-nav">
        {filteredItems.map((item) => (
          <NavLink 
            to={item.path} 
            key={item.name}
            end={item.path === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>


      <div className="sidebar-footer">
        <button className="nav-link logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
