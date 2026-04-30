import React, { useState, useEffect } from 'react';
import { Package, Factory, Truck, CheckCircle } from 'lucide-react';
import api from '../../../api/axios';

const OrderTrackingView = ({ orderId }) => {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTracking = async () => {
      if (!orderId) return;
      setLoading(true);
      try {
        const response = await api.get(`/orders/${orderId}/track`);
        setTrackingData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch tracking info", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTracking();
  }, [orderId]);

  if (!orderId) {
    return (
      <div className="card" style={{ marginTop: '2rem', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="text-secondary">Select an order to track its progress</p>
      </div>
    );
  }

  if (loading || !trackingData) {
    return (
      <div className="card" style={{ marginTop: '2rem', padding: '2rem', textAlign: 'center' }}>
        <p>Loading tracking information...</p>
      </div>
    );
  }

  const { order, production, manufacturing_stages, delivery } = trackingData;

  // Determine active steps
  const isOrderPlaced = true; // Always true if it exists
  const isInProduction = order.status === 'IN_PROGRESS' || order.status === 'DELIVERED' || !!production;
  const isOutForDelivery = delivery && (delivery.delivery_status === 'OUT_FOR_DELIVERY' || delivery.delivery_status === 'DELIVERED');
  const isDelivered = order.status === 'DELIVERED';

  const Step = ({ title, active, completed, icon: Icon, details }) => (
    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', opacity: active ? 1 : 0.4 }}>
      <div style={{ 
        width: '40px', height: '40px', borderRadius: '50%', 
        background: completed ? '#10b981' : active ? 'var(--accent-primary)' : '#e2e8f0',
        color: completed || active ? 'white' : '#64748b',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0
      }}>
        <Icon size={20} />
      </div>
      <div>
        <h4 style={{ margin: 0, fontSize: '1.1rem', color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{title}</h4>
        {details && <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{details}</div>}
      </div>
    </div>
  );

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div className="card-header">
        <h2>Live Tracking: #{order.id}</h2>
      </div>
      <div style={{ padding: '2rem' }}>
        <div style={{ position: 'relative' }}>
          {/* Vertical Line Connector */}
          <div style={{ position: 'absolute', left: '19px', top: '20px', bottom: '40px', width: '2px', background: '#e2e8f0', zIndex: 0 }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Step 
              title="Order Confirmed" 
              active={isOrderPlaced} 
              completed={isOrderPlaced} 
              icon={Package} 
              details={<p>Your booking for <strong>{order.product_name}</strong> has been received.</p>}
            />
            
            <Step 
              title="Manufacturing" 
              active={isInProduction} 
              completed={production && production.status === 'COMPLETED'} 
              icon={Factory} 
              details={
                isInProduction && manufacturing_stages && manufacturing_stages.length > 0 ? (
                  <div style={{ marginTop: '0.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                    {manufacturing_stages.map((stage, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                        <span>{stage.stage}</span>
                        <span style={{ color: stage.status === 'COMPLETED' ? '#10b981' : '#f59e0b' }}>{stage.status}</span>
                      </div>
                    ))}
                  </div>
                ) : isInProduction ? <p>Your car is scheduled for production.</p> : null
              }
            />

            <Step 
              title="Out for Delivery" 
              active={isOutForDelivery} 
              completed={isDelivered} 
              icon={Truck} 
              details={
                delivery ? (
                  <p>Scheduled for: {new Date(delivery.delivery_date).toLocaleDateString()}</p>
                ) : null
              }
            />

            <Step 
              title="Delivered" 
              active={isDelivered} 
              completed={isDelivered} 
              icon={CheckCircle} 
              details={isDelivered ? <p>Your car has been delivered safely. Enjoy the ride!</p> : null}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingView;
