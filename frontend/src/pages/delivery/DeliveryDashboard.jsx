import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import AssignedDeliveries from './components/AssignedDeliveries';
import DeliveryDetails from './components/DeliveryDetails';
import { Truck, Map, Clock } from 'lucide-react';

const DeliveryDashboard = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAssignedDeliveries = async () => {
    setLoading(true);
    try {
      const response = await api.get('/delivery/assigned');
      setDeliveries(response.data.data);
      if (selectedDelivery) {
        // Refresh selected delivery data
        const updated = response.data.data.find(d => d.id === selectedDelivery.id);
        if (updated) setSelectedDelivery(updated);
      }
    } catch (error) {
      console.error("Failed to fetch assigned deliveries", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedDeliveries();
  }, []);

  return (
    <div className="animate-fade-in delivery-dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Delivery Hub</h1>
          <p className="text-secondary">Manage your routes and deliveries</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline-secondary">
            <Map size={18} style={{ marginRight: '0.5rem' }} />
            View Full Map
          </button>
        </div>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#6366f115', color: '#6366f1' }}>
            <Truck size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Pending Stops</p>
            <h3 className="stat-value">{deliveries.filter(d => d.delivery_status !== 'DELIVERED').length}</h3>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f59e0b15', color: '#f59e0b' }}>
            <Map size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Out for Delivery</p>
            <h3 className="stat-value">{deliveries.filter(d => d.delivery_status === 'OUT_FOR_DELIVERY').length}</h3>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#10b98115', color: '#10b981' }}>
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Completed Today</p>
            <h3 className="stat-value">{deliveries.filter(d => d.delivery_status === 'DELIVERED').length}</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr', gap: '2rem' }}>
        <div className="main-section">
          <AssignedDeliveries 
            deliveries={deliveries} 
            selectedId={selectedDelivery?.id}
            onSelect={setSelectedDelivery} 
          />
        </div>
        <div className="sidebar-section">
          <DeliveryDetails 
            delivery={selectedDelivery} 
            onUpdate={fetchAssignedDeliveries}
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
