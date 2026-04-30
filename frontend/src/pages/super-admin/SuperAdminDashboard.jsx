import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import StatsCards from './components/StatsCards';
import UserManagement from './components/UserManagement';
import OrdersOverview from './components/OrdersOverview';
import ReportsChart from './components/ReportsChart';
import SettingsPanel from './components/SettingsPanel';
import { ShieldAlert, Download, RefreshCcw } from 'lucide-react';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await api.get('/system/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error("Failed to fetch super admin stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="animate-fade-in super-admin-dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Super Admin Command Center</h1>
          <p className="text-secondary">Enterprise-level control and system analytics</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline-secondary" onClick={fetchStats}>
            <RefreshCcw size={18} style={{ marginRight: '0.5rem' }} />
            Sync Data
          </button>
          <button className="btn btn-primary">
            <Download size={18} style={{ marginRight: '0.5rem' }} />
            Export Audit Log
          </button>
        </div>
      </div>

      <StatsCards stats={stats} />

      <div className="dashboard-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="main-section">
          <ReportsChart />
          <UserManagement />
          <OrdersOverview />
        </div>
        <div className="sidebar-section">
          <SettingsPanel />
          <div className="card" style={{ marginTop: '2rem', background: '#fff1f2', borderColor: '#fecaca' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#be123c', marginBottom: '1rem' }}>
              <ShieldAlert size={24} />
              <h3 style={{ fontSize: '1rem' }}>Security Alerts</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#9f1239' }}>
              No critical security threats detected in the last 24 hours. System integrity is 100%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
