import React from 'react';
import { ShoppingCart, Factory, Package, TrendingUp, ArrowUpRight, Clock } from 'lucide-react';
import '../Dashboard.css';

const AdminDashboard = () => {
  const cards = [
    { title: 'Total Revenue', value: '₹4.2M', change: '+18%', icon: <TrendingUp size={24} />, color: '#ec4899' },
    { title: 'New Orders', value: '156', change: '+12%', icon: <ShoppingCart size={24} />, color: '#6366f1' },
    { title: 'Production Status', value: 'Optimal', change: '85%', icon: <Factory size={24} />, color: '#10b981' },
    { title: 'Inventory Alert', value: '12 Items', change: 'Low', icon: <Package size={24} />, color: '#f59e0b' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Administrator Dashboard</h1>
        <div className="date-picker">
          <Clock size={16} />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {cards.map((card, index) => (
          <div className="card stat-card" key={index}>
            <div className="stat-icon" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-content">
              <p className="stat-label">{card.title}</p>
              <h3 className="stat-value">{card.value}</h3>
              <div className="stat-change up">
                <ArrowUpRight size={14} />
                <span>{card.change} vs last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h2 style={{ fontSize: '1.1rem' }}>Operational Highlights</h2>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
           <TrendingUp size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
           <p>Standard Admin view of business operations.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
