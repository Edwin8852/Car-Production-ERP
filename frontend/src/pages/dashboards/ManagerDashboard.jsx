import React from 'react';
import { ClipboardList, Users, Package, Settings, ArrowUpRight, BarChart3 } from 'lucide-react';
import '../Dashboard.css';

const ManagerDashboard = () => {
  const stats = [
    { title: 'Pending Tasks', value: '24', change: '8 Urgent', icon: <ClipboardList size={24} />, color: '#6366f1' },
    { title: 'Team Efficiency', value: '92%', change: '+3%', icon: <Users size={24} />, color: '#10b981' },
    { title: 'Stock Levels', value: 'Good', change: '95%', icon: <Package size={24} />, color: '#f59e0b' },
    { title: 'Production Goal', value: '78%', change: '+5%', icon: <BarChart3 size={24} />, color: '#8b5cf6' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Management Dashboard</h1>
          <p className="text-secondary">Monitor production and team performance</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {stats.map((stat, index) => (
          <div className="card stat-card" key={index}>
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <p className="stat-label">{stat.title}</p>
              <h3 className="stat-value">{stat.value}</h3>
              <div className="stat-change up">
                <ArrowUpRight size={14} />
                <span>{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Production Pipeline</h2>
        <div style={{ padding: '1rem' }}>
           <p>List of ongoing production batches will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
