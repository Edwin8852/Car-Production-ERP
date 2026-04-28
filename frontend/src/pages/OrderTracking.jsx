import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTrackingInfo } from '../modules/orders/orders.service';
import { updateStageStatus } from '../modules/manufacturing/manufacturing.service';
import { ArrowLeft, Box, Factory, Truck, CheckCircle, Clock, Check } from 'lucide-react';

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTracking = async () => {
    try {
      const response = await getTrackingInfo(id);
      setTrackingData(response.data || response);
    } catch (error) {
      console.error("Failed to fetch tracking info:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking();
  }, [id]);

  const handleUpdateStage = async (stageId, newStatus) => {
    try {
      await updateStageStatus(stageId, newStatus);
      fetchTracking(); // Refresh all data to see automated triggers
    } catch (error) {
      alert("Failed to update stage: " + error.message);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading tracking details...</div>;
  if (!trackingData) return <div style={{ padding: '2rem', textAlign: 'center' }}>Order not found.</div>;

  const { order, production, manufacturing_stages, delivery } = trackingData;

  const getStatusIcon = (status) => {
    if (['COMPLETED', 'DELIVERED'].includes(status?.toUpperCase())) return <CheckCircle size={20} color="var(--success)" />;
    if (['IN_PROGRESS', 'PROCESSING', 'READY'].includes(status?.toUpperCase())) return <Clock size={20} color="var(--accent-primary)" />;
    return <Clock size={20} color="var(--text-secondary)" />;
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ marginRight: '1rem' }}>
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="page-title">Order Tracking: {order.id}</h1>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
        {/* Order Info Card */}
        <div className="card">
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Order Information</h2>
          <div className="form-group">
            <label className="form-label">Customer</label>
            <div style={{ fontWeight: '600' }}>{order.customer_name}</div>
          </div>
          <div className="form-group">
            <label className="form-label">Product</label>
            <div style={{ fontWeight: '600' }}>{order.product_name}</div>
          </div>
          <div className="form-group">
            <label className="form-label">Total Amount</label>
            <div style={{ fontWeight: '600', color: 'var(--success)' }}>
              ₹{(order.total_amount || 0).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Current Status</label>
            <span className={`badge badge-${order.status === 'DELIVERED' ? 'success' : 'info'}`}>
              {order.status}
            </span>
          </div>
        </div>

        {/* Timeline Card */}
        <div className="card">
          <h2 style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>Production & Delivery Timeline</h2>
          
          <div className="timeline-container" style={{ paddingLeft: '1.5rem', borderLeft: '2px solid var(--border-color)', marginLeft: '1rem' }}>
            
            {/* 1. Order Placed */}
            <div className="timeline-item" style={{ position: 'relative', marginBottom: '2.5rem' }}>
              <div style={{ position: 'absolute', left: '-2.1rem', background: 'var(--bg-primary)', padding: '0.2rem' }}>
                <CheckCircle size={20} color="var(--success)" />
              </div>
              <div style={{ fontWeight: '600' }}>Order Received</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{new Date(order.created_at).toLocaleString()}</div>
            </div>

            {/* 2. Production Status */}
            <div className="timeline-item" style={{ position: 'relative', marginBottom: '2.5rem' }}>
              <div style={{ position: 'absolute', left: '-2.1rem', background: 'var(--bg-primary)', padding: '0.2rem' }}>
                {getStatusIcon(production?.status)}
              </div>
              <div style={{ fontWeight: '600' }}>Production: {production?.status || 'NOT STARTED'}</div>
              {production && (
                <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.5rem' }}>Manufacturing Stages:</div>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {manufacturing_stages.map(stage => (
                      <div key={stage.id} style={{ 
                        display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8rem',
                        padding: '0.4rem 0.6rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)',
                        border: stage.status === 'COMPLETED' ? '1px solid var(--success)' : '1px solid var(--border-color)'
                      }}>
                        {getStatusIcon(stage.status)}
                        <span>{stage.stage}</span>
                        {stage.status !== 'COMPLETED' && (
                          <button 
                            className="btn-sm" 
                            style={{ 
                              padding: '2px 6px', background: 'var(--success)', color: 'white', 
                              borderRadius: '4px', fontSize: '10px', display: 'flex', alignItems: 'center' 
                            }}
                            onClick={() => handleUpdateStage(stage.id, 'COMPLETED')}
                          >
                            <Check size={10} /> Complete
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Delivery Status */}
            <div className="timeline-item" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-2.1rem', background: 'var(--bg-primary)', padding: '0.2rem' }}>
                {getStatusIcon(delivery?.delivery_status)}
              </div>
              <div style={{ fontWeight: '600' }}>Delivery: {delivery?.delivery_status || 'WAITING'}</div>
              {delivery && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Person: {delivery.delivery_person_name || 'Assigned soon'} | Ref: {delivery.id}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
