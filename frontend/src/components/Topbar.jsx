import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import './Topbar.css';

const Topbar = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: 'Admin User', role: 'System Admin' };

  return (
    <header className="topbar">
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search orders, materials..." className="search-input" />
      </div>

      <div className="topbar-actions">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        <div className="user-profile">
          <div className="avatar">
            <User size={18} />
          </div>
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{user.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
