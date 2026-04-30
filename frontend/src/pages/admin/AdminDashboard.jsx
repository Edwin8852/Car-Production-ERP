import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import StatsCards from './components/StatsCards';
import OrdersManagement from './components/OrdersManagement';
import ProductionManagement from './components/ProductionManagement';
import MaterialsManagement from './components/MaterialsManagement';
import SupplierManagement from './components/SupplierManagement';
import PurchasesManagement from './components/PurchasesManagement';
import LimitedReports from './components/LimitedReports';
import { RefreshCcw, FileText, Settings, Navigation } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('OPERATIONS');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await api.get('/dashboard/stats');
      setStats({
        totalOrders: response.data.data.totalOrders,
        activeProduction: response.data.data.productionVolume,
        materialStock: response.data.data.lowStock
      });
    } catch (error) {
      console.error("Failed to fetch admin stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="animate-fade-in admin-dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Operational Center</h1>
          <p className="text-secondary">Manage day-to-day business operations</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline-secondary" onClick={fetchStats}>
            <RefreshCcw size={18} style={{ marginRight: '0.5rem' }} />
            Refresh
          </button>
        </div>
      </div>

      <StatsCards stats={stats} />

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
        <button 
          className={`btn ${activeTab === 'OPERATIONS' ? 'btn-primary' : 'btn-text'}`}
          onClick={() => setActiveTab('OPERATIONS')}
        >
          Core Operations
        </button>
        <button 
          className={`btn ${activeTab === 'SUPPLY_CHAIN' ? 'btn-primary' : 'btn-text'}`}
          onClick={() => setActiveTab('SUPPLY_CHAIN')}
        >
          Supply Chain & Inventory
        </button>
      </div>

      {activeTab === 'OPERATIONS' && (
        <div className="dashboard-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div className="main-section">
            <OrdersManagement />
            <ProductionManagement />
          </div>
          <div className="sidebar-section">
            <LimitedReports />
          </div>
        </div>
      )}

      {activeTab === 'SUPPLY_CHAIN' && (
        <div className="dashboard-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div className="main-section">
            <PurchasesManagement />
            <MaterialsManagement />
          </div>
          <div className="sidebar-section">
            <SupplierManagement />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

