import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import AssignedProductionList from './components/AssignedProductionList';
import ProductionDetails from './components/ProductionDetails';
import { Factory, BellRing } from 'lucide-react';

const ManagerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAssignedOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/production-orders/manager/assigned');
      setOrders(response.data.data);
      if (selectedOrder) {
        // Refresh selected order data
        const updated = response.data.data.find(o => o.id === selectedOrder.id);
        if (updated) setSelectedOrder(updated);
      }
    } catch (error) {
      console.error("Failed to fetch assigned orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedOrders();
  }, []);

  const handleNotifyAdmin = () => {
    // In a real app, this would call a notification API
    alert("Notification sent to Admin: Production line needs review.");
  };

  return (
    <div className="animate-fade-in manager-dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Production Manager</h1>
          <p className="text-secondary">Execute and track manufacturing assignments</p>
        </div>
        <button className="btn btn-outline-primary" onClick={handleNotifyAdmin}>
          <BellRing size={18} style={{ marginRight: '0.5rem' }} />
          Notify Admin
        </button>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#6366f115', color: '#6366f1' }}>
            <Factory size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Assigned Batches</p>
            <h3 className="stat-value">{orders.length}</h3>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f59e0b15', color: '#f59e0b' }}>
            <Factory size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">In Progress</p>
            <h3 className="stat-value">{orders.filter(o => o.status === 'IN_PROGRESS').length}</h3>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#10b98115', color: '#10b981' }}>
            <Factory size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Completed</p>
            <h3 className="stat-value">{orders.filter(o => o.status === 'COMPLETED').length}</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="main-section">
          <AssignedProductionList 
            orders={orders} 
            selectedId={selectedOrder?.id}
            onSelect={setSelectedOrder} 
          />
        </div>
        <div className="sidebar-section">
          <ProductionDetails 
            order={selectedOrder} 
            onUpdate={fetchAssignedOrders}
          />
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
