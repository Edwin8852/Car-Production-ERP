import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import CreateOrder from './components/CreateOrder';
import MyOrdersList from './components/MyOrdersList';
import OrderTrackingView from './components/OrderTrackingView';
import { User, Settings } from 'lucide-react';

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders/my-orders');
      setOrders(response.data.data);
      if (response.data.data.length > 0 && !selectedOrderId) {
        setSelectedOrderId(response.data.data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch user orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  return (
    <div className="animate-fade-in user-dashboard">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">My Garage</h1>
          <p className="text-secondary">Track and manage your car bookings</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline-secondary">
            <User size={18} style={{ marginRight: '0.5rem' }} />
            Profile
          </button>
        </div>
      </div>

      <div className="dashboard-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="main-section">
          <CreateOrder onOrderCreated={fetchMyOrders} />
          <MyOrdersList 
            orders={orders} 
            selectedId={selectedOrderId}
            onSelect={setSelectedOrderId} 
          />
        </div>
        <div className="sidebar-section">
          <OrderTrackingView orderId={selectedOrderId} />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
