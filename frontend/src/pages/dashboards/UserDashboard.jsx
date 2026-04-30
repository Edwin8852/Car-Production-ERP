import React from 'react';
import { ShoppingBag, Heart, User, Settings, Package, HelpCircle } from 'lucide-react';
import '../Dashboard.css';

const UserDashboard = () => {
  const summary = [
    { title: 'My Orders', value: '3', sub: '1 in transit', icon: <ShoppingBag size={24} />, color: '#6366f1' },
    { title: 'Wishlist', value: '12', sub: 'Items saved', icon: <Heart size={24} />, color: '#ef4444' },
    { title: 'Points', value: '450', sub: 'Rewards', icon: <Package size={24} />, color: '#10b981' },
    { title: 'Support', value: '0', sub: 'Active tickets', icon: <HelpCircle size={24} />, color: '#f59e0b' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Account</h1>
          <p className="text-secondary">Track your orders and manage your profile</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {summary.map((item, index) => (
          <div className="card stat-card" key={index}>
            <div className="stat-icon" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
              {item.icon}
            </div>
            <div className="stat-content">
              <p className="stat-label">{item.title}</p>
              <h3 className="stat-value">{item.value}</h3>
              <p className="text-secondary" style={{ fontSize: '0.8rem' }}>{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-sections" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Recent Activity</h2>
          <div style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
            <p>You haven't made any orders recently.</p>
          </div>
        </div>
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Profile Summary</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
             <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={32} color="#9ca3af" />
             </div>
             <div>
                <h3 style={{ fontSize: '1rem' }}>Demo User</h3>
                <p className="text-secondary" style={{ fontSize: '0.8rem' }}>user@gmail.com</p>
             </div>
          </div>
          <button className="btn btn-outline-primary" style={{ width: '100%', marginTop: '1rem' }}>Edit Profile</button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
