import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  ShoppingCart, 
  Factory, 
  Package, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStatsData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard...</div>;

  const cards = [
    { title: 'Total Orders', value: statsData?.totalOrders || 0, change: '+12%', icon: <ShoppingCart size={24} />, color: 'var(--accent-primary)' },
    { title: 'Active Production', value: statsData?.productionVolume || 0, change: '+5%', icon: <Factory size={24} />, color: 'var(--success)' },
    { title: 'Low Stock Items', value: statsData?.lowStock || 0, change: '-2%', icon: <Package size={24} />, color: 'var(--warning)' },
    { title: 'Revenue (Delivered)', value: `₹${(statsData?.revenue || 0).toLocaleString('en-IN')}`, change: '+18%', icon: <TrendingUp size={24} />, color: '#ec4899' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Operational Overview</h1>
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
              <div className={`stat-change ${card.change.startsWith('+') ? 'up' : 'down'}`}>
                {card.change.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                <span>{card.change} vs last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-sections" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem' }}>Recent Customer Orders</h2>
            <button className="btn-text">View All</button>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {statsData?.recentOrders?.map((order) => (
                  <tr key={order.id}>
                    <td><strong>{order.id}</strong></td>
                    <td>{order.customer_name}</td>
                    <td>
                      <span className={`badge badge-${order.status === 'DELIVERED' ? 'success' : 'info'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>₹{(order.total_amount || 0).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Production Distribution</h2>
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ textAlign: 'center' }}>
              <Factory size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>Production is running at 85% capacity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
