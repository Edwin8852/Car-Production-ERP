import React from 'react';
import { Users, Shield, Server, Activity, ArrowUpRight, Database } from 'lucide-react';
import '../Dashboard.css';

const SuperAdminDashboard = () => {
  const stats = [
    { title: 'Total Users', value: '1,284', change: '+5.4%', icon: <Users size={24} />, color: '#6366f1' },
    { title: 'System Load', value: '24%', change: '-2%', icon: <Server size={24} />, color: '#10b981' },
    { title: 'Active Sessions', value: '42', change: '+12%', icon: <Activity size={24} />, color: '#f59e0b' },
    { title: 'Security Alerts', value: '0', change: 'Stable', icon: <Shield size={24} />, color: '#ef4444' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Super Admin Command Center</h1>
          <p className="text-secondary">Global system overview and administrative controls</p>
        </div>
        <div className="badge badge-success">System Online</div>
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

      <div className="dashboard-sections" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h2 style={{ fontSize: '1.1rem' }}>Global Activity Log</h2>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Admin</th>
                  <th>Action</th>
                  <th>Timestamp</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>John Doe</strong></td>
                  <td>Modified User Permissions</td>
                  <td>2 mins ago</td>
                  <td><span className="badge badge-success">Success</span></td>
                </tr>
                <tr>
                  <td><strong>System</strong></td>
                  <td>Database Backup</td>
                  <td>1 hour ago</td>
                  <td><span className="badge badge-success">Success</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Resource Usage</h2>
          <div style={{ padding: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>CPU Usage</span>
                <span>45%</span>
              </div>
              <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '45%', height: '100%', background: '#6366f1' }}></div>
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Memory</span>
                <span>62%</span>
              </div>
              <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '62%', height: '100%', background: '#10b981' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
